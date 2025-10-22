const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');

// Search products (autocomplete)
// GET /api/products/search?q=milk&limit=10
router.get('/search', authenticateToken, productController.searchProducts);

// Get product by barcode (scanning)
// GET /api/products/barcode/123456789
router.get('/barcode/:barcode', authenticateToken, productController.getProductByBarcode);

// Get product details by ID
// GET /api/products/123
router.get('/:productId', authenticateToken, productController.getProductById);

module.exports = router;