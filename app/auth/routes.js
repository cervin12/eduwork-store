const router = require('express').Router();
const authController = require('./controller');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configure Passport Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, authController.localStrategy));

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', passport.authenticate('jwt', { session: false }), authController.me); // Ensure 'me' route is protected

module.exports = router;
