const pantryModel = require('../models/pantryModel');
const authController = require('../controllers/authController');

const token = authController.token; // user token

// *************************************
// *         Pantry Controller         *
// *************************************

// need to send user token along with get request ?

async function getPantryItems (req, res) {
  try {
    const user_id = req.params.user_id;
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }
    const items = await pantryModel.getAllItems(user_id);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching pantry items.' });
  }
}

async function addPantryItem (req, res) {
  try {
    const { user_id, name, quantity } = req.body;
    if (!name || !quantity) {
      return res.status(400).json({ error: 'Name and quantity are required.' });
    }
    const newItem = await pantryModel.addItem(user_id, name, quantity);
    res.status(201).json({ message: 'Item added to pantry.', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding the item.' });
  }
}

async function updateItem (req, res) {
  try {
    const { user_id, item_id } = req.params;
    const { name, quantity } = req.body;

    const updatedItem = await pantryModel.updateItem(user_id, item_id, name, quantity);

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({
      message: 'Item updated.',
      item: updatedItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the item.' });
  }
}



async function deletePantryItem (req, res) {
  try {
    const { user_id, item_id } = req.params;
    const deletedItem = await pantryModel.deletePantryItem(user_id, item_id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    res.status(200).json({ message: 'Item deleted from pantry.', item: deletedItem });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the item.' });
  }
}

module.exports = {
  getPantryItems,
  addPantryItem,
  updateItem,
  deletePantryItem
};