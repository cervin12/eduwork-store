const Category = require("./model");

const index = async (req, res, next) => {
  try {
    let category = await Category.find();
    return res.json(category);
  } catch (error) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let { id } = req.params;
    let payload = req.body;
    let category = await Category.findByIdAndUpdate(id, payload, { new: true });
    return res.json(category)
  } catch (er) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const store = async(req,res,next)=>{
    try {
        let payload = req.body
        let category = new Category(payload)
        await category.save()
        return res.json(category)
    } catch (err) {
        if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
    }
}

const destroy = async(req,res,next)=>{
    try {
        const {id} = req.params
        const category = await Category.findByIdAndDelete(id)
        return res.json(category)
    } catch (err) {
        if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
    }
}

module.exports = {
    index,
    update,
    store,
    destroy
}
