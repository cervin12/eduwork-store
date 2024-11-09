const router = require('express').Router()
const {policy_check} = require('../../middleware')
const cartController = require('./controller')

router.get('/cart', policy_check('read', 'Cart'), cartController.index)
router.put('/cart', policy_check('update', 'Cart'), cartController.update)

module.exports = router