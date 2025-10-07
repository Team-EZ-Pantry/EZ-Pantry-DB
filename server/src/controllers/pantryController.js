const pantryModel = require('../models/pantryModel');
const authController = require('../controllers/authController');

const token = authController.token; // user token

// *************************************
// *         Pantry Controller         *
// *************************************

// need to send user token along with get request ?
const pantryController = {
  getPantryItems: async (req, res) => {
    try {
      const items = await pantryModel.getAllItems(token);
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching pantry items.' });
    }
  },

  addPantryItem: async (req, res) => {
    try {
      const { title, quantity } = req.body;
      if (!title || !quantity) {
        return res.status(400).json({ error: 'Title and quantity are required.' });
      }
      const newItem = await pantryModel.addItem(title, quantity);
      res.status(201).json({ message: 'Item added to pantry.', item: newItem });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while adding the item.' });
    }
  }
};

module.exports = pantryController;
