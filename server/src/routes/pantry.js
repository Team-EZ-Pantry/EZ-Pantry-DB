const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');
const { authenticateToken } = require('../middleware/auth');

// *************************************
// *         Pantry Endpoints          *
// *************************************
// Pantry management
router.get('/', authenticateToken, pantryController.getAllPantries);
router.post('/', authenticateToken, pantryController.createPantry);
router.get('/:pantryId', authenticateToken, pantryController.getPantry);
router.put('/:pantryId', authenticateToken, pantryController.updatePantry);
router.delete('/:pantryId', authenticateToken, pantryController.deletePantry);

// Product management within pantries
router.post('/:pantryId/products', authenticateToken, pantryController.addProductToPantry);
router.delete('/:pantryId/products/:productId', authenticateToken, pantryController.removeProductFromPantry);
router.put('/:pantryId/products/:productId/quantity', authenticateToken, pantryController.updateProductQuantity);
router.put('/:pantryId/products/:productId/expiration', authenticateToken, pantryController.updateProductExpiration);

module.exports = router;