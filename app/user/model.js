const mongoose = require('mongoose')
const { Schema, model} = mongoose
const AutoIncrement = require('mongoose-sequence')(mongoose)
const bcrypt = require('bcrypt')

let userSchema = Schema({
    full_name:{
        type: String,
        required: [true, 'Nama harus diisi'],
        minlength: [3, 'Panjang nama minimal 3 karakter'],
        maxlength: [255, 'Panjang nama maksimal 255 karakter']
    },
    customer_id:{
        type: Number
    },
    email:{
        type: String,
        required: [true, 'Email harus diisi'],
        maxlength: [255, 'Panjang email maksimal 255 karakter'],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'format email tidak valid'],
        unique: [true, 'Email sudah terdaftar']
    },
    password:{
        type: String,
        required: [true, 'Password harus diisi'],
        minlength: [6, 'Panjang password minimal 6 karakter'],
        maxlength: [255, 'Panjang password maksimal 255 karakter']
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    token: {
        type: [String],
        default: []
    }
},{
    timestamps: true
})

const HASH_ROUND = 10;
userSchema.pre('save', function(next) {
    if (this.isModified('password')) { // Ensure password is only hashed if modified
        this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    }
    next();
});

userSchema.plugin(AutoIncrement, {inc_field: 'customer_id'})

module.exports = model('User', userSchema)