// *************************************
// *     Shopping List Controllers     *
// *************************************

const shoppingListModel = require('../models/shoppingListModel');

// *************************************
// *       Create a shopping list      *
// *************************************
async function createShoppingList(req, res) {
  try {
    const userId = req.user.userId;
    const { list_name } = req.body;

    // Validate list_name is required and not empty
    if (!list_name || list_name.trim() === '') {
      return res.status(400).json({ error: 'list_name is required and cannot be empty' });
    }

    const newShoppingList = await shoppingListModel.createShoppingList(userId, list_name);
    res.status(201).json(newShoppingList);
  } catch (error) {
    console.error('Create shopping list error:', error);
    res.status(500).json({ error: 'Failed to create shopping list' });
  }
}

// ********************************************
// *   Get all of the user's shopping lists   *
// ********************************************
async function getAllShoppingLists(req, res) {
  try {
    const userId = req.user.userId;
    const shoppingLists = await shoppingListModel.getShoppingListsByUserId(userId);
    res.json(shoppingLists);
  } catch (error) {
    console.error('Get all shopping lists error:', error);
    res.status(500).json({ error: 'Failed to retrieve shopping lists' });
  }
}

// *************************************
// *       Get a shopping list         *
// *************************************
async function getShoppingList(req, res) {
  try {
    const { listId } = req.params;
    const userId = req.user.userId;

    const shoppingList = await shoppingListModel.getShoppingListById(listId, userId);
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
async function deleteShoppingList(req, res) {
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

// ***************************************
// * Create an item and add it to a list *
// ***************************************
async function createAndAddShoppingListItem(req, res) {
  try {
     const { listId } = req.params;
     const { product_id, custom_product_id, text, quantity } = req.body;

    // Validate: can't have both productId and customProductId
    if (product_id && custom_product_id) {
      return res.status(400).json({
        error: 'Cannot provide both product_id and custom_product_id for the same item'
      });
    }

    // Validate: must provide at least one of productId, customProductId, or text
    if(!product_id && !custom_product_id && !text) {
      return  res.status(400).json({ error: 'Must provide product_id, custom_product_id, or text to add an item' });
    }

    // Optional: Validate quantity if provided
    if (quantity !== undefined && (quantity < 1)) {
      return res.status(400).json({
        error: 'Quantity must be at least 1'
      });
    }

    // If text-only item, ensure it's not empty
    if (!product_id && !custom_product_id && text) {
      if (text.trim() === '') {
        return res.status(400).json({
          error: 'Text cannot be empty'
        });
      }
    }

    const newItem = await shoppingListModel.createAndAddShoppingListItem(
      listId,
      product_id || null,
      custom_product_id || null,
      text || null,
      quantity || null,
    );

    res.status(201).json(newItem);
  } catch (error) {
    if (error.code === '23503') { // foreign key violation
      return res.status(404).json({ error: 'Product ID does not exist' });
    }
    console.error('Add shopping list item error:', error);
    res.status(500).json({ error: 'Failed to add item to shopping list' });
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

// *****************************************************
// *   Toggle all items in a list (mark all complete)   *
// *****************************************************
async function toggleAllItems(req, res) {
  try {
    const { listId } = req.params;
    const result = await shoppingListModel.toggleAllItems(listId);

    if (!result.toggled) {
      return res.status(200).json({ message: 'No items to toggle', item_count: 0 });
    }

    res.json({
      message: result.new_state === 'all_checked'
        ? 'All items marked as complete'
        : 'All items marked as incomplete',
      new_state: result.new_state,
      item_count: result.item_count
    });
  } catch (error) {
    console.error('Toggle all items error:', error);
    res.status(500).json({ error: 'Failed to toggle all items' });
  }
}

module.exports = {
  getAllShoppingLists,
  createShoppingList,
  getShoppingList,
  deleteShoppingList,
  createAndAddShoppingListItem,
  toggleItemChecked,
  toggleAllItems,
  removeShoppingListItem
};