// *************************************
// *         Recipe Functions          *
// *************************************

const pool = require('../config/database');

// Create a recipe
async function createRecipe(userId, name, ingredients, directions) {
  const result = await pool.query(
    'INSERT INTO recipes (user_id, name, ingredients, directions) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, name, ingredients, directions]
  );
  return result.rows[0];
}

// Get all recipes associated with a user
async function getAllRecipes(userId) {
  const result = await pool.query(
    'SELECT * FROM recipes WHERE user_id = $1',
    [userId]
  );
  return result.rows;
}

// Get a certain recipe
async function getRecipeById(recipeId) {
  const result = await pool.query(
    'SELECT * FROM recipes WHERE recipe_id = $1',
    [recipeId]
  );
  return result.rows[0];
}

// 
async function updateRecipe(recipeId, name, ingredients, directions) {
  const result = await pool.query(
    'UPDATE recipes SET name = $1, ingredients = $2, directions = $3 WHERE recipe_id = $4 RETURNING *',
    [name, ingredients, directions, recipeId]
  );
  return result.rows[0];
}

async function deleteRecipe(recipeId) {
  const result = await pool.query(
    'DELETE FROM recipes WHERE recipe_id = $1 RETURNING *',
    [recipeId]
  );
  return result.rows[0];
}

module.exports = {
   createRecipe,
   getAllRecipes,
   getRecipeById,
   updateRecipe,
   deleteRecipe
}