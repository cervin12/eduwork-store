const {policy_check} = require('../../middlewares/policyMiddleware')
const router = require('express').Router()
const deliveryAddressController = require('./controller')

router.get('/deliverryAddress', policy_check('read', 'DeliveryAddress'), deliveryAddressController.view)
router.post('/deliverryAddress',policy_check('create', 'DeliveryAddress'), deliveryAddressController.store)
router.put('/deliverryAddress/:id', deliveryAddressController.store)
router.delete('/deliverryAddress/:id',deliveryAddressController.view)

module.exports = router
