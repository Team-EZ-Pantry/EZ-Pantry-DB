const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');
const { authenticateToken } = require('../middleware/auth');
const { validateCustomProductAccess, validatePantryAccess } = require('../middleware/validation');

// *************************************
// *     Pantry Product Endpoints      *
// *************************************
// Pantry management
router.post('/', authenticateToken,                                      pantryController.createPantry);
router.get('/', authenticateToken,                                       pantryController.getAllPantriesForUser);
router.get('/:pantryId', authenticateToken, validatePantryAccess,        pantryController.getPantry);
router.patch('/:pantryId/name', authenticateToken, validatePantryAccess, pantryController.updatePantryName);
router.delete('/:pantryId', authenticateToken, validatePantryAccess,     pantryController.deletePantry);

// Product management within pantries
router.post('/:pantryId/products/:productId', authenticateToken, validatePantryAccess, pantryController.addProduct);
router.delete('/:pantryId/products/:productId', authenticateToken, validatePantryAccess, pantryController.removeProduct);
router.patch('/:pantryId/products/:productId/quantity', authenticateToken, validatePantryAccess, pantryController.updateProductQuantity);
router.patch('/:pantryId/products/:productId/expiration', authenticateToken, validatePantryAccess, pantryController.updateProductExpiration);

// Custom products within pantries
router.post('/:pantryId/custom-products/:customProductId', authenticateToken, validatePantryAccess, validateCustomProductAccess, pantryController.addCustomProduct);
router.delete('/:pantryId/custom-products/:customProductId', authenticateToken, validatePantryAccess, validateCustomProductAccess, pantryController.removeCustomProduct);
router.patch('/:pantryId/custom-products/:customProductId/quantity', authenticateToken, validatePantryAccess, validateCustomProductAccess, pantryController.updateCustomProductQuantity);
router.patch('/:pantryId/custom-products/:customProductId/expiration', authenticateToken, validatePantryAccess, validateCustomProductAccess, pantryController.updateCustomProductExpiration);

module.exports = router;