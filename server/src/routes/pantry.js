const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');

// *************************************
// *         Pantry Endpoints          *
// *************************************
router.get('/pantry', pantryController.getPantryItems);
router.post('/pantry', pantryController.addPantryItem);



module.exports = router;