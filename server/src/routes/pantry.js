const express = require('express');

const router = express.Router();

// Mock database
const pantryItems = [
   { id: 1, title: 'Apples', quantity: 10 },
   { id: 2, title: 'Bananas', quantity: 6 },
   { id: 3, title: 'asdf', quantity: 4 },
   { id: 3, title: 'asdf', quantity: 4 },
   { id: 3, title: 'asdf', quantity: 4 },
   { id: 3, title: 'asdf', quantity: 4 },
   { id: 3, title: 'asdf', quantity: 4 },
   { id: 3, title: 'asdf', quantity: 4 },
   { id: 3, title: 'asdf', quantity: 4 },
   { id: 3, title: 'asdf', quantity: 4 },
   { id: 3, title: 'asdf', quantity: 4 },
   { id: 3, title: 'asdf', quantity: 4 },
];

// GET /pantry
router.get('/pantry', async (req, res) => {
   try {
      res.status(200).json(pantryItems);
   } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching pantry items.' });
   }
});

// POST /pantry
router.post('/pantry', async (req, res) => {
   try {
      const { title, quantity } = req.body;

      if (!title || !quantity) {
         return res.status(400).json({ error: 'title and quantity are required.' });
      }

      const newItem = { id: pantryItems.length + 1, title, quantity };
      pantryItems.push(newItem);

      res.status(201).json({ message: 'Item added to pantry.', item: newItem });
   } catch (error) {
      res.status(500).json({ error: 'An error occurred while adding the item.' });
   }
});

module.exports = router;