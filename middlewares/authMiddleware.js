// authMiddleware.js
const {getToken, policyFor } = require('./policyModule');
const jwt = require('jsonwebtoken');
const config = require('../app/config');
const User = require('../app/user/model');

async function decodeToken(req, res, next) {
  try {
    let token = getToken(req);

    if (!token) return next();

    const decoded = jwt.verify(token, config.secretKey);
    req.user = decoded;

    let user = await User.findOne({ token: { $in: [token] } });
    if (!user) {
      return res.status(401).json({
        error: 1,
        message: 'Token Expired',
      });
    }

    req.ability = policyFor(user); // Attach the Ability instance to req
    next();
  } catch (error) {
    if (error && error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 1,
        message: error.message,
      });
    }
    next(error);
  }
}

module.exports = {
  decodeToken,
};
