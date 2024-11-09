const router = require('express').Router()
const tagController = require('./controller')
const { policy_check } = require('../../middlewares/policyMiddleware')

router.get('/tag', tagController.index)
router.post('/tag', policy_check('create', 'Tag'), tagController.store)
router.put('/tag/:id', policy_check('update', 'Tag'), tagController.update)
router.delete('/tag/:id', policy_check('delete', 'Tag'), tagController.destroy)

module.exports = router