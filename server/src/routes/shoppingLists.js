const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');
const { authenticateToken } = require('../middleware/auth');
const { validateShoppingListAccess } = require('../middleware/validation');

// ********************************************
// *         Shopping List Endpoints          *
// ********************************************

// Shopping list endpoints
router.post('/', authenticateToken, shoppingListController.createShoppingList);
router.get('/', authenticateToken, shoppingListController.getAllShoppingLists);
router.get('/:listId', authenticateToken, validateShoppingListAccess, shoppingListController.getShoppingList);
router.delete('/:listId', authenticateToken, validateShoppingListAccess, shoppingListController.deleteShoppingList);

// Shopping list item endpoints
router.post('/:listId/items/', authenticateToken, validateShoppingListAccess, shoppingListController.createAndAddShoppingListItem);
router.patch('/:listId/items/:itemId/toggle', authenticateToken, validateShoppingListAccess, shoppingListController.toggleItemChecked);
router.delete('/:listId/items/:itemId', authenticateToken, validateShoppingListAccess, shoppingListController.removeShoppingListItem);

module.exports = router;