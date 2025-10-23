// *************************************
// *     Shopping List Controllers     *
// *************************************

const shoppingListModel = require('../models/shoppingListModel');

// ********************************************
// *   Get all of the user's shopping lists   *
// ********************************************
async function getAllShoppingLists(req, res) {
  try {
    const userId = req.user.userId;
    const shoppingLists = await shoppingListModel.getAllShoppingLists(userId);
    res.json(shoppingLists);
  } catch (error) {
    console.error('Get all shopping lists error:', error);
    res.status(500).json({ error: 'Failed to retrieve shopping lists' });
  }
}

// *************************************
// *       Create a shopping list      *
// *************************************
async function createShoppingList(req, res) {
  try {
    const userId = req.user.userId;
    const { name } = req.body;
    const newShoppingList = await shoppingListModel.createShoppingList(userId, name);
    res.status(201).json(newShoppingList);
  } catch (error) {
    console.error('Create shopping list error:', error);
    res.status(500).json({ error: 'Failed to create shopping list' });
  }
}

// *************************************
// *       Get a shopping list         *
// *************************************
async function getShoppingList(req, res) {
  try {
    const userId = req.user.userId;
    const { listId } = req.params;
    const shoppingList = await shoppingListModel.getShoppingList(userId, listId);
    if (!shoppingList) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }
    res.json(shoppingList);
  } catch (error) {
    console.error('Get shopping list error:', error);
    res.status(500).json({ error: 'Failed to retrieve shopping list' });
  }
}

// *************************************
// *       Delete a shopping list      *
// *************************************
async function deleteShoppingList(req, res) {   // make sure you also delete all associated items
  try {
    const userId = req.user.userId;
    const { listId } = req.params; 
    const deleted = await shoppingListModel.deleteShoppingList(userId, listId);
    if (!deleted) {
      return res.status(404).json({ error: 'Shopping list not found' });
    }
    res.json({ message: 'Shopping list deleted successfully' });
  } catch (error) {
    console.error('Delete shopping list error:', error);
    res.status(500).json({ error: 'Failed to delete shopping list' });
  }
}

// ********************************************
// *   Toggle the checked status of an item   *
// ********************************************
async function toggleItemChecked(req, res) {
  try {
    const { listId, itemId } = req.params;
    const updatedItem = await shoppingListModel.toggleItemChecked(listId, itemId);
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found in shopping list' });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error('Toggle item checked error:', error);
    res.status(500).json({ error: 'Failed to toggle item checked status' });
  }
}

// *************************************
// *       Add an item to a list       *
// *************************************
async function addShoppingListItem(req, res) {
   try {
      const { listId } = req.params;
      const { productId } = req.body;
      const { quantity } = req.body;
      const newItem = await shoppingListModel.addShoppingListItem(listId, productId, quantity);
      res.status(201).json(newItem);
   } catch (error) {
      console.error('Add shopping list item error:', error);
      res.status(500).json({ error: 'Failed to add item to shopping list' });
   }
}

// *************************************
// *    Remove an item from a list     *
// *************************************
async function removeShoppingListItem(req, res) {
   try {
      const { listId, itemId } = req.params;
      const removed = await shoppingListModel.removeShoppingListItem(listId, itemId);
      if (!removed) {
         return res.status(404).json({ error: 'Item not found in shopping list' });
      }
      res.json({ message: 'Item removed from shopping list successfully' });
   } catch (error) {
      console.error('Remove shopping list item error:', error);
      res.status(500).json({ error: 'Failed to remove item from shopping list' });
   }
}

module.exports = {
  getAllShoppingLists,
  createShoppingList,
  getShoppingList,
  deleteShoppingList,
  toggleItemChecked,
  addShoppingListItem,
  removeShoppingListItem,
};