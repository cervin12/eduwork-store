const DeliveryAddress = require("./model");
const subject = require("@casl/ability");
const { policyFor } = require("../../utils/index");

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let user = req.user;
    let address = new DeliveryAddress({ ...payload, user: user._id });
    await address.save();
    return res.json(address);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next();
  }
};

const update = async (req, res, next) => {
  try {
    let { _id, ...payload } = req.body;
    let { id } = req.params;
    let address = await DeliveryAddress.findById(id);
    let subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });
    let policy = policyFor(req.user);
    if (!policy.can("update", subjectAddress)) {
      return res.json({
        error: 1,
        message: "You are not allowed to change this source",
      });
    }

    address = await DeliveryAddress.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return res.json(address);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next();
  }
};

const view = async (req, res, next) => {
  try {
  let {skip = 0, limit = 10} = req.query
  let count = await DeliveryAddress.find({user: req.user._id}).countDocuments()
  let address = await DeliveryAddress
  .find({user:req.user._id})
  .skip(parseInt(skip))
  .limit(parseInt(limit))
  .sort('-createAt')

  return res.json({
    data: address,
    count
  });
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next();
  }
};

const destroy = async (req, res, next) => {
  try {
    let { id } = req.params;
    let address = await DeliveryAddress.findByIdAndDelete(id);
    return res.json(address);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next();
  }
};

module.exports = {
  store,
  update,
  view,
  destroy
};
