const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { authenticateToken } = require('../middleware/auth');
const { validateRecipeAccess } = require('../middleware/validation');

// ********************************************
// *           Recipe Endpoints               *
// ********************************************

router.post('/', authenticateToken, recipeController.createRecipe);
router.get('/', authenticateToken, recipeController.getAllRecipes);
router.get('/:recipeId', authenticateToken, validateRecipeAccess, recipeController.getRecipe);
router.patch('/:recipeId', authenticateToken, validateRecipeAccess, recipeController.updateRecipe);
router.delete('/:recipeId', authenticateToken, validateRecipeAccess, recipeController.deleteRecipe);

// ********************************************
// *        Ingredient Endpoints              *
// ********************************************

router.post('/:recipeId/ingredients', authenticateToken, validateRecipeAccess, recipeController.addIngredient);
router.patch('/:recipeId/ingredients/:ingredientId', authenticateToken, validateRecipeAccess, recipeController.updateIngredient);
router.delete('/:recipeId/ingredients/:ingredientId', authenticateToken, validateRecipeAccess, recipeController.removeIngredient);

// ********************************************
// *        Instruction Endpoints             *
// ********************************************

router.post('/:recipeId/instructions', authenticateToken, validateRecipeAccess, recipeController.addInstruction);
router.patch('/:recipeId/instructions/:instructionId', authenticateToken, validateRecipeAccess, recipeController.updateInstruction);
router.delete('/:recipeId/instructions/:instructionId', authenticateToken, validateRecipeAccess, recipeController.removeInstruction);
router.put('/:recipeId/instructions/reorder', authenticateToken, validateRecipeAccess, recipeController.reorderInstructions);

// ********************************************
// *        Availability Endpoint             *
// ********************************************

router.get('/:recipeId/availability', authenticateToken, validateRecipeAccess, recipeController.checkAvailability);

module.exports = router;
