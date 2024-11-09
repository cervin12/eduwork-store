const mongoose = require('mongoose')
const {model, Schema} = mongoose

const orderItemSchema = Schema({
    name:{
        type:String,
        required: [true, 'Nama order item harus diisi'],
        minlength: [3, 'Panjang nama order item minimal 3 karakter'],
    },
    price:{
        type: Number,
        required: [true, 'Harga order item harus diisi'],
    },
    quantity:{
        type: Number,
        required: [true, 'Kuantitas order item harus diisi'],
        min: [1, 'Kuantitas minimal 1']
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
})

module.exports = model('OrderItem', orderItemSchema)