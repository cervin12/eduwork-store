const mongoose = require('mongoose')
const {model, Schema} = mongoose

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Nama produk harus diisi'],
        minlength: [3, 'Minimal nama produk terdiri dari 3 huruf']
    },
    stock: {
        type: Number,
        required: [true, 'Stok produk harus diisi'],
    },
    description: {
        type: String,
        maxlength: [1000, 'Maksimal deskripsi hanya sampai 1000 karakter']
    },
    price: {
        type: Number,
        default: 0
    },
    image_url: String,
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    tags: {
        type: [Schema.Types.ObjectId],
        ref: 'Tag'
    }

},{
    timestamps: true
})

module.exports = model('Product', productSchema)