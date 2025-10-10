const pantryModel = require('../models/pantryModel');

// *************************************
// *         Pantry Controller         *
// *************************************
async function getPantryItems (req, res) {
  try {
    const items = await pantryModel.getAllItems();
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


module.exports = {
  getPantryItems,
  addPantryItem
};