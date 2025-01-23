const User = require('../user/model')
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config')
const {getToken} = require('../../utils')

const register = async (req, res, next) => {
    try {
        const payload = req.body;
        let user = new User(payload);
        await user.save();
        return res.json(user);
    } catch (error) {
        if (error && error.name === 'ValidationError') {
            return res.json({
                error: 1,
                message: error.message,
                fields: error.errors
            });
        }
        if (error && error.code === 11000) { // Duplicate key error code
            const duplicatedField = Object.keys(error.keyValue)[0];
            const duplicatedValue = error.keyValue[duplicatedField];
            return res.json({
                error: 1,
                message: `${duplicatedField.charAt(0).toUpperCase() + duplicatedField.slice(1)} "${duplicatedValue}" sudah terdaftar`
            });
        }
        next(error);
    }
};


const localStrategy = async (email,password,done)=>{
    try {
        let user = await User .findOne({email}).select('-__v -createdAt -updatedAt -cart_items -token')
        if(!user) return done()
        if(bcrypt.compareSync(password,user.password)){
            ({password, ...userWithoutPassword} = user.toJSON())
            return done(null,userWithoutPassword)
        } 
    } catch (error) {
        done(error,null)
    }
    done()
}

const login = async (req,res,next)=>{
    passport.authenticate('local',async function(err,user){
        if(err) return next(err)
        if(!user) return res.json({
            error: 1,
            message: 'Invalid email or password'
        })
        
        let signed = jwt.sign({ id: user._id, email: user.email, role: user.role }, config.secretKey, { expiresIn: '1h' });

        let updatedUser = {}
        try {
            updatedUser = await User.findByIdAndUpdate(user._id, { $set: { token: signed } }, {new: true});
            
        } catch (updateError) {
            return next(updateError); // Handle potential update errors
        }
        res.json({
            message: 'Login Success',
            user,
            updatedUser,
            token: signed
        })
    })(req,res,next)
}

const logout = async(req,res,next)=>{
    let token = getToken(req)

    let user = await User.findOneAndUpdate({token: {$in:[token]}},{$pull:{token:token}},{useFindAndModify: false})

    if(!user||!token){
        return res.json({
            error:1,
            message: 'User not found'
        })
    }

    return res.json({
        error: 0,
        message: 'Logout Success'
    })
}

const me = (req,res,next)=>{

    if(!req.user){
        return res.json({
            error: 1,
            messsage: 'You are not login or token erpired'
        })
    }

    return res.json(req.user)
}

module.exports ={
    register,
    localStrategy,
    login,
    logout,
    me
}