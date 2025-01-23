const router = require('express').Router()
const invoiceController = require('./controller')

router.get('/invoice/:id',invoiceController.show)

module.exports = router