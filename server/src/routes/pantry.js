const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');

// *************************************
// *         Pantry Endpoints          *
// *************************************
router.get('/', pantryController.getPantryItems);
router.post('/', pantryController.addPantryItem);



module.exports = router;