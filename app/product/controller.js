// productController.js
const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tags/model');

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    // let image = req.file;


    if (payload.category) {
      let category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length > 0) { // Corrected 'leght' to 'length'
      let tags = await Tag.find({ name: { $in: payload.tags } });
      if (tags.length > 0) {
        let newTags = payload.tags.map(tag => {
          let foundTag = tags.find(t => t.name === tag);
          return foundTag ? foundTag.id : null;
        }).filter(tagId => tagId !== null);

        let newTagPromises = payload.tags
          .filter(tag => !tags.find(t => t.name === tag))
          .map(tag => new Tag({ name: tag }).save());

        let newTagsCreated = await Promise.all(newTagPromises);
        let newTagIds = newTagsCreated.map(tag => tag._id);
        payload = { ...payload, tags: [...newTags, ...newTagIds] };
      } else {
        let newTagPromises = payload.tags.map(tag => new Tag({ name: tag }).save());
        let newTagsCreated = await Promise.all(newTagPromises);
        let newTagIds = newTagsCreated.map(tag => tag._id);
        payload = { ...payload, tags: newTagIds };
      }
    }

    

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length -1]
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          let product = new Product({ ...payload, image_url: filename});
          await product.save();
          return res.status(201).json({
            status: 'success',
            data: {
              product,
            },
          });
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === 'ValidationError') {
            return res.status(400).json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });

      src.on('error', (err) => { // Capture the error object
        next(err);
      });
    } else {
      res.status(400).json({ error: 1, message: 'Image is required.' });
    }
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10, q = '', category = '', tags = [] } = req.query;
    let criteria = {};

    if (q.length) {
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: 'i' },
      };
    }

    if (category.length) {
      let categoryDoc = await Category.findOne({ name: { $regex: category, $options: 'i' } });
      if (categoryDoc) {
        criteria = {
          ...criteria,
          category: categoryDoc._id,
        };
      }
    }

    if (tags.length) {
      let tagsDocs = await Tag.find({ name: { $in: tags } });
      if (tagsDocs.length > 0) {
        criteria = {
          ...criteria,
          tags: { $in: tagsDocs.map(tag => tag._id) }, // Assuming tags is an array field
        };
      }
    }

    let count = await Product.find(criteria).countDocuments();

    let products = await Product.find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('category')
      .populate('tags');

    return res.json({
      data: products,
      count,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params;

    if (payload.category) {
      let category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length > 0) { // Corrected 'leght' to 'length'
      let tags = await Tag.find({ name: { $in: payload.tags } });
      if (tags.length > 0) {
        let newTags = payload.tags.map(tag => {
          let foundTag = tags.find(t => t.name === tag);
          return foundTag ? foundTag.id : null;
        }).filter(tagId => tagId !== null);
        payload = { ...payload, tags: newTags };
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split('.').pop(); // Simplified extraction
      let filename = req.file.filename + '.' + originalExt;
      if(!filename) return res.status(400).json({ error: 1, message: 'Filename is required.' });
      let target_path = path.resolve(config.rootPath, `public/images/products/${filename}`);

      console.log(filename);
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          let product = await Product.findById(id);
          if (!product) {
            fs.unlinkSync(target_path);
            return res.status(404).json({
              error: 1,
              message: 'Product not found.',
            });
          }

          let currentImage = path.resolve(config.rootPath, `public/images/products/${product.image_url}`);
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          product = await Product.findByIdAndUpdate(
            id,
            { ...payload, image_url: filename },
            { new: true, runValidators: true }
          );
          return res.json({
            status: 'success',
            data: {
              product,
            },
          });
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === 'ValidationError') {
            return res.status(400).json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });

      src.on('error', (err) => { // Capture the error object
        next(err);
      });
    } else {
      let product = await Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
      if (!product) {
        return res.status(404).json({
          error: 1,
          message: 'Product not found.',
        });
      }
      return res.json({
        status: 'success',
        data: {
          product,
        },
      });
    }
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        error: 1,
        message: 'Product not found.',
      });
    }
    return res.json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(400).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

module.exports = {
  store,
  index,
  update,
  destroy,
};
