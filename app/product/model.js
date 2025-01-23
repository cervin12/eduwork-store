const mongoose = require('mongoose')
const {model, Schema} = mongoose

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Nama produk harus diisi'],
        minlength: [3, 'Minimal nama produk terdiri dari 3 huruf']
    },
    description: {
        type: String,
        maxlength: [1000, 'Maksimal deskripsi hanya sampai 1000 karakter']
    },
    stock: Number,
    price: {
      type: Number,
      required: [true, 'Harga produk harus diisi']
    },
    image_url: {
        type: String,
        required: [true, 'URL gambar harus diisi']
    },
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