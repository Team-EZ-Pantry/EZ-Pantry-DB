const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');

// *************************************
// *         Pantry Endpoints          *
// *************************************
router.get('/', pantryController.getPantryItems);
router.post('/', pantryController.addPantryItem);
//put and patch here
// edit and delete ?


module.exports = router;