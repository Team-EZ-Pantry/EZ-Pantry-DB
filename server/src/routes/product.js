const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const { validateCustomProductAccess } = require('../middleware/validation');

// *************************************
// *         Product Endpoints         *
// *************************************
// Regular products
// Future feature: Search include's user's custom products (and then maybe shared custom products, and then maybe a public catalogue)
router.get('/search', authenticateToken, productController.searchProducts);
router.get('/barcode/:barcode', authenticateToken, productController.getProductByBarcode);

// Custom products
router.post('/custom', authenticateToken, productController.createCustomProduct);
router.get('/custom', authenticateToken, productController.getMyCustomProducts); // Will eventually get shared custom products too
router.patch('/custom/:customProductId', authenticateToken, validateCustomProductAccess, productController.modifyCustomProduct);
router.delete('/custom/:customProductId', authenticateToken, validateCustomProductAccess, productController.deleteCustomProduct);

module.exports = router;