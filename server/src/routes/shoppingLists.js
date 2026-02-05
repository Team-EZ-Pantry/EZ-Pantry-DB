const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');
const { authenticateToken } = require('../middleware/auth');

// ********************************************
// *         Shopping List Endpoints          *
// ********************************************

// Shopping list endpoints
router.post('/', authenticateToken, shoppingListController.createShoppingList);
router.get('/', authenticateToken, shoppingListController.getAllShoppingLists);
router.get('/:listId', authenticateToken, shoppingListController.getShoppingList);
router.delete('/:listId', authenticateToken, shoppingListController.deleteShoppingList);

// Shopping list item endpoints
router.post('/:listId/items/', authenticateToken, shoppingListController.createAndAddShoppingListItem);
router.patch('/:listId/items/:itemId/toggle', authenticateToken, shoppingListController.toggleItemChecked);
router.delete('/:listId/items/:itemId', authenticateToken, shoppingListController.removeShoppingListItem);

module.exports = router;