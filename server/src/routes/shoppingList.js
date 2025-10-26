const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');
const { authenticateToken } = require('../middleware/auth');

// ********************************************
// *         Shopping List Endpoints          *
// ********************************************

// User's shopping lists
router.get('/', authenticateToken, shoppingListController.getAllShoppingLists);
router.post('/', authenticateToken, shoppingListController.createShoppingList);
router.get('/:listId', authenticateToken, shoppingListController.getShoppingList);
router.delete('/:listId', authenticateToken, shoppingListController.deleteShoppingList);

// Toggle checked status of an item.
// When every item on the list is checked, server should mark list as complete (?)
router.patch('/:listId/items/:itemId', authenticateToken, shoppingListController.toggleItemChecked);

router.put('/:listId', authenticateToken, shoppingListController.addShoppingListItem);
router.delete('/:listId/items/:itemId', authenticateToken, shoppingListController.removeShoppingListItem);

module.exports = router;