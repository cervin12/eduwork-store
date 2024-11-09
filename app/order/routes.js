const router = require('express').Router()
const {policy_check} = require('../../middleware')
const orderController = require('./controller')

router.get('/order', policy_check('read', 'Order'), orderController.index)
router.post('/order', policy_check('create', 'Order'), orderController.store)

module.exports = router
