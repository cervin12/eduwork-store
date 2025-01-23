// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { store, index, update, destroy } = require('./controller'); // Adjust the path
const { decodeToken } = require('../../middlewares/authMiddleware'); // Adjust the path
const { policy_check } = require('../../middlewares/policyMiddleware'); // Adjust the path
const multer = require('multer'); // Assuming you're using multer for file uploads
const os = require('os');

// Configure multer (example configuration)
const upload = multer({ dest: 'public/images/products' });

// Apply decodeToken middleware to all routes below
router.use(decodeToken);

// Define routes with appropriate policy checks
router.post('/product', upload.single('file'), policy_check('create', 'Product'), store);
router.get('/product', policy_check('read', 'Product'), index);
router.put('/product/:id', upload.single('file'), policy_check('update', 'Product'), update);
router.delete('/product/:id', policy_check('delete', 'Product'), destroy);

module.exports = router;
