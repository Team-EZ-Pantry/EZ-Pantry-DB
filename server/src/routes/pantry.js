const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');

// *************************************
// *         Pantry Endpoints          *
// *************************************
router.get('/:user_id', pantryController.getPantryItems); 
router.post('/:user_id', pantryController.addPantryItem);
router.patch('/:user_id/:item_id', pantryController.updateItem);;
router.delete('/:user_id/:item_id', pantryController.deletePantryItem);

/*
router.put('/:user_id/:item_id', pantryController.updatePantryItem);
router.patch('/:user_id/:item_id', pantryController.updatePantryItem);
router.delete('/:user_id/:item_id', pantryController.deletePantryItem);
*/

module.exports = router;