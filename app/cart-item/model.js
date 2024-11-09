const mongoose = require('mongoose')
const { getMaxListeners } = require('../tags/model')
const {model, Schema} = mongoose

const cartItemSchema = new Schema({
    name:{
        type: String,
        minlength: [3, 'Panjang nama makanan minimal 3 karakter'],
        required: [true, 'Nama item harus diisi']
    },
    quantity: {
        type: Number,
        required: [true, 'Kuantitas harus diisi'],
        min: [1, 'Kuantitas minimal 1'],
    },
    price: {
        type: Number,
        default: 0
    },
    image_url: String,
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
})

module.exports = model('CartItem',cartItemSchema)