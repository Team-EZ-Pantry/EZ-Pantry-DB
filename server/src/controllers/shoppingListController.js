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
    const shoppingLists = await shoppingListModel.getAllShoppingLists(userId);
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
    const userId = req.user.userId;
    const { listId } = req.params;

    const shoppingList = await shoppingListModel.getShoppingList(listId);
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

// ***************************************
// * Create an item and add it to a list *
// ***************************************
async function createAndAddShoppingListItem(req, res) {
  try {
     const { listId } = req.params;
     const { productId, customProductId, text, quantity } = req.body;
    
    // Validate: can't have both productId and customProductId
    if (productId && customProductId) {
      return res.status(400).json({ 
        error: 'Cannot provide both productId and customProductId' 
      });
    }

    // Validate: must provide at least one of productId, customProductId, or text
    if(!productId && !customProductId && !text) {
      return  res.status(400).json({ error: 'Must provide productId, customProductId, or text to add an item' });
    }
    
    // Optional: Validate quantity if provided
    if (quantity !== undefined && (quantity < 1)) {
      return res.status(400).json({ 
        error: 'Quantity must be at least 1' 
      });
    }

    // If text-only item, ensure it's not empty
    if (!productId && !customProductId && text) {
    if (text.trim() === '') {
      return res.status(400).json({ 
        error: 'Text cannot be empty' 
      });
    }
  }

    // Custom product validation block to be added later (pantry sharing sprint)
    /*
    // Validate custom product exists AND user owns it (if provided)
    if (customProductId) {
      const customProduct = await productModel.getCustomProductById(customProductId);
      
      if (!customProduct) {
        return res.status(404).json({ 
          error: 'Custom product not found' 
        });
      }

      // Check ownership (user must own the custom product)
      if (customProduct.user_id !== userId) {
        return res.status(403).json({ 
          error: 'You do not have access to this custom product' 
        });
      }
    */

    const newItem = await shoppingListModel.createAndAddShoppingListItem(
      listId, 
      productId || null,
      customProductId || null,
      text || null,
      quantity
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

module.exports = {
  getAllShoppingLists,
  createShoppingList,
  getShoppingList,
  deleteShoppingList,
  createAndAddShoppingListItem,
  toggleItemChecked,
  removeShoppingListItem
};