const recipeModel = require('../models/recipeModel');

// *************************************
// *       Create a new recipe         *
// *************************************
async function createRecipe(req, res) {
  try {
    const userId = req.user.userId;
    const { name, ingredients, directions } = req.body;
    const newRecipe = await recipeModel.createRecipe(userId, name, ingredients, directions);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
}  

// ********************************************
// *   Get all of the user's recipes     *
// ******************************************** 
async function getAllRecipes(req, res) {
  try {
    const userId = req.user.userId;
    const recipes = await recipeModel.getAllRecipes(userId);
    res.json(recipes);
  } catch (error) {
    console.error('Get all recipes error:', error);
    res.status(500).json({ error: 'Failed to retrieve recipes' });
  }
}

// *************************************
// *       Get a recipe by ID          *
// *************************************
async function getRecipeById(req, res) {
  try {
    const userId = req.user.userId;
    const { recipeId } = req.params;
    const recipe = await recipeModel.getRecipeById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Get recipe by ID error:', error);
    res.status(500).json({ error: 'Failed to retrieve recipe' });
  }
}

// *************************************
// *       Update a recipe            *
// *************************************
async function updateRecipe(req, res) {
  try {
    const userId = req.user.userId;
    const { recipeId } = req.params;
    const { name, ingredients, directions } = req.body;
    const updatedRecipe = await recipeModel.updateRecipe(recipeId, name, ingredients, directions);
    if(!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(updatedRecipe);
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
}

// *************************************
// *       Delete a recipe            *
// *************************************
async function deleteRecipe(req, res) {
  try {
    const userId = req.user.userId;
    const { recipeId } = req.params;
    const deleted = await recipeModel.deleteRecipe(recipeId);
    if (!deleted) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
}

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
};