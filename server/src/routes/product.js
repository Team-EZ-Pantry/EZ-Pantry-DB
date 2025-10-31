const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const { validateCustomProductAccess } = require('../middleware/validation');

// *************************************
// *         Product Endpoints         *
// *************************************
// Regular products
router.get('/search', authenticateToken, productController.searchProducts);
router.get('/barcode/:barcode', authenticateToken, productController.getProductByBarcode);

// Custom products
// Future feature: Search and get all users' custom products (public catalog)
// router.get('/custom/search', authenticateToiken, productController.searchCustomProducts);
router.post('/custom', authenticateToken, productController.createCustomProduct);
router.get('/custom', authenticateToken, productController.getMyCustomProducts); // Will eventually get shared custom products too
router.delete('/custom/:customProductId', authenticateToken, validateCustomProductAccess, productController.deleteCustomProduct);

// Coming very soon
//router.patch('/custom/:customProductId', authenticateToken, validateCustomProductAccess, productController.modifyCustomProduct);

module.exports = router;