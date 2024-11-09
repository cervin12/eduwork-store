const Tag = require("./model");

const index = async (req, res, next) => {
  try {
    let tag = await Tag.find();
    return res.json(tag);
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
    let tag = await Tag.findByIdAndUpdate(id, payload, { new: true });
    return res.json(tag)
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
        let tag = new Tag(payload)
        await tag.save()
        return res.json(tag)
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
        const tag = await Tag.findByIdAndDelete(id)
        return res.json(tag)
    } catch (err) {
        if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors
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
