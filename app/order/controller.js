const Order = require("./model");
const { Types } = require("mongoose");
const OrderItem = require("../order-item/model");
const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../deliveryAddress/model");

const store = async (req, res, next) => {
  try {
    let { delivery_fee, delivery_address } = req.body;
    let items = await CartItem.find({ user: req.user._id }).populate("product");
    if (!items) {
      return res.json({
        error: 1,
        message: "Tidak bisa membuat order karena tidak ada item keranjang",
      });
    }
    let address = await DeliveryAddress.findById(delivery_address);
    let order = new Order({
      _id: new Types.ObjectId(),
      status: 'waiting_payment',
      delivery_fee: delivery_fee,
      delivery_address: address,
      user: req.user._id,
    });

    let orderItems = await OrderItem.insertMany(
      items.map((item) => ({
        ...item,
        name: item.product.name,
        quantity: parseInt(item.quantity),
        price: parseInt(item.product.price),
        order: order._id,
        product: item.product._id,
      }))
    );
    orderItems.forEach((item) => order.order_items.push(item));
    order.save();
    await CartItem.deleteMany({ user: req.user._id });
    return res.json(order);
  } catch (error) {
    if(error && error.name === 'ValidationError'){
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors
      })
    }
    next(error) 
  }
};

const index = async(req,res,next)=>{
  try {
    let {skip=0, limit = 10} = req.query
    let count = await Order.find({user: req.user._id}).countDocument()
    let orders = await order
    .find({user: req.user._id})
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .populate('order_items')
    .sort('-createAt')

    return res.json({
      data: orders.map(order => order.toJSON({virutals: true})),
      count
    })
  } catch (error) {
    if(error && error.name === 'ValidationError'){
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors
      })
    }
    next(error) 
  }
}

module.exports = {
  store,
  index
}
