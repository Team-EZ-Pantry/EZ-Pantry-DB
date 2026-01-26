const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { authenticateToken } = require('../middleware/auth');

// ********************************************
// *         Recipe Endpoints               *
// ********************************************
router.post('/', authenticateToken, recipeController.createRecipe);
router.get('/', authenticateToken, recipeController.getAllRecipes);
router.get('/:recipeId', authenticateToken, recipeController.getRecipeById);
router.patch('/:recipeId', authenticateToken, recipeController.updateRecipe);
router.delete('/:recipeId', authenticateToken, recipeController.deleteRecipe);

module.exports = router;