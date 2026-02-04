// *************************************
// *       Recipe Controllers          *
// *************************************

const recipeModel = require('../models/recipeModel');

// *************************************
// *        Create a recipe            *
// *************************************
async function createRecipe(req, res) {
  try {
    const userId = req.user.userId;
    const { recipe_name, servings, prep_time_minutes, cook_time_minutes, image_url, ingredients, instructions } = req.body;

    if (!recipe_name || recipe_name.trim() === '') {
      return res.status(400).json({ error: 'recipe_name is required' });
    }

    // Validate ingredients if provided
    if (ingredients && ingredients.length > 0) {
      for (const ing of ingredients) {
        if (ing.product_id && ing.custom_product_id) {
          return res.status(400).json({ error: 'Cannot provide both product_id and custom_product_id for an ingredient' });
        }
        if (!ing.product_id && !ing.custom_product_id && !ing.free_text) {
          return res.status(400).json({ error: 'Each ingredient must have product_id, custom_product_id, or free_text' });
        }
      }
    }

    // Validate instructions if provided
    if (instructions && instructions.length > 0) {
      for (const inst of instructions) {
        if (!inst.content || inst.content.trim() === '') {
          return res.status(400).json({ error: 'Each instruction must have content' });
        }
      }
    }

    const recipe = await recipeModel.createRecipe(userId, {
      recipe_name, servings, prep_time_minutes, cook_time_minutes, image_url, ingredients, instructions
    });

    res.status(201).json(recipe);
  } catch (error) {
    if (error.code === '23503') {
      return res.status(404).json({ error: 'Referenced product ID does not exist' });
    }
    console.error('Create recipe error:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
}

// *************************************
// *      Get all user recipes         *
// *************************************
async function getAllRecipes(req, res) {
  try {
    const userId = req.user.userId;
    const recipes = await recipeModel.getRecipesByUserId(userId);
    res.json(recipes);
  } catch (error) {
    console.error('Get all recipes error:', error);
    res.status(500).json({ error: 'Failed to retrieve recipes' });
  }
}

// *************************************
// *       Get a single recipe         *
// *************************************
async function getRecipe(req, res) {
  try {
    const { recipeId } = req.params;
    const scale = parseFloat(req.query.scale);

    const recipe = await recipeModel.getRecipeById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Apply serving scaling if requested
    if (scale && scale > 0 && recipe.servings > 0) {
      const scaleFactor = scale / recipe.servings;
      recipe.ingredients = recipe.ingredients.map(ing => ({
        ...ing,
        scaled_quantity: ing.quantity ? parseFloat((ing.quantity * scaleFactor).toFixed(2)) : null
      }));
      recipe.scaled_servings = scale;
    }

    res.json(recipe);
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ error: 'Failed to retrieve recipe' });
  }
}

// *************************************
// *       Update a recipe             *
// *************************************
async function updateRecipe(req, res) {
  try {
    const { recipeId } = req.params;
    const updateData = req.body;

    const updated = await recipeModel.updateRecipe(recipeId, updateData);
    if (!updated) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(updated);
  } catch (error) {
    if (error.message === 'No valid fields to update') {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    console.error('Update recipe error:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
}

// *************************************
// *       Delete a recipe             *
// *************************************
async function deleteRecipe(req, res) {
  try {
    const userId = req.user.userId;
    const { recipeId } = req.params;

    const deleted = await recipeModel.deleteRecipe(recipeId, userId);
    if (!deleted) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
}

// *************************************
// *     Ingredient Controllers        *
// *************************************

async function addIngredient(req, res) {
  try {
    const { recipeId } = req.params;
    const { product_id, custom_product_id, free_text, quantity, unit, display_order } = req.body;

    if (product_id && custom_product_id) {
      return res.status(400).json({ error: 'Cannot provide both product_id and custom_product_id' });
    }
    if (!product_id && !custom_product_id && !free_text) {
      return res.status(400).json({ error: 'Must provide product_id, custom_product_id, or free_text' });
    }

    const ingredient = await recipeModel.addIngredient(recipeId, {
      product_id, custom_product_id, free_text, quantity, unit, display_order
    });

    res.status(201).json(ingredient);
  } catch (error) {
    if (error.code === '23503') {
      return res.status(404).json({ error: 'Referenced product ID does not exist' });
    }
    console.error('Add ingredient error:', error);
    res.status(500).json({ error: 'Failed to add ingredient' });
  }
}

async function updateIngredient(req, res) {
  try {
    const { recipeId, ingredientId } = req.params;
    const updateData = req.body;

    // Validate dual-product constraint if both are being set
    if (updateData.product_id && updateData.custom_product_id) {
      return res.status(400).json({ error: 'Cannot provide both product_id and custom_product_id' });
    }

    const updated = await recipeModel.updateIngredient(ingredientId, recipeId, updateData);
    if (!updated) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    res.json(updated);
  } catch (error) {
    if (error.message === 'No valid fields to update') {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    if (error.code === '23503') {
      return res.status(404).json({ error: 'Referenced product ID does not exist' });
    }
    console.error('Update ingredient error:', error);
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
}

async function removeIngredient(req, res) {
  try {
    const { recipeId, ingredientId } = req.params;

    const removed = await recipeModel.removeIngredient(ingredientId, recipeId);
    if (!removed) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    res.json({ message: 'Ingredient removed successfully' });
  } catch (error) {
    console.error('Remove ingredient error:', error);
    res.status(500).json({ error: 'Failed to remove ingredient' });
  }
}

// *************************************
// *     Instruction Controllers       *
// *************************************

async function addInstruction(req, res) {
  try {
    const { recipeId } = req.params;
    const { content, metadata } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Instruction content is required' });
    }

    const instruction = await recipeModel.addInstruction(recipeId, { content, metadata });
    res.status(201).json(instruction);
  } catch (error) {
    console.error('Add instruction error:', error);
    res.status(500).json({ error: 'Failed to add instruction' });
  }
}

async function updateInstruction(req, res) {
  try {
    const { recipeId, instructionId } = req.params;
    const updateData = req.body;

    const updated = await recipeModel.updateInstruction(instructionId, recipeId, updateData);
    if (!updated) {
      return res.status(404).json({ error: 'Instruction not found' });
    }
    res.json(updated);
  } catch (error) {
    if (error.message === 'No valid fields to update') {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    console.error('Update instruction error:', error);
    res.status(500).json({ error: 'Failed to update instruction' });
  }
}

async function removeInstruction(req, res) {
  try {
    const { recipeId, instructionId } = req.params;

    const result = await recipeModel.removeInstruction(instructionId, recipeId);
    if (!result) {
      return res.status(404).json({ error: 'Instruction not found' });
    }
    res.json({ message: 'Instruction removed successfully' });
  } catch (error) {
    console.error('Remove instruction error:', error);
    res.status(500).json({ error: 'Failed to remove instruction' });
  }
}

async function reorderInstructions(req, res) {
  try {
    const { recipeId } = req.params;
    const { order } = req.body;

    if (!order || !Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ error: 'Must provide an array of instruction IDs in "order"' });
    }

    const instructions = await recipeModel.reorderInstructions(recipeId, order);
    res.json(instructions);
  } catch (error) {
    if (error.message && error.message.includes('does not belong to this recipe')) {
      return res.status(400).json({ error: error.message });
    }
    if (error.message && error.message.includes('Must include all instruction IDs')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Reorder instructions error:', error);
    res.status(500).json({ error: 'Failed to reorder instructions' });
  }
}

// *************************************
// *     Availability Controller       *
// *************************************

async function checkAvailability(req, res) {
  try {
    const userId = req.user.userId;
    const { recipeId } = req.params;
    const scale = parseFloat(req.query.scale);

    const recipe = await recipeModel.getRecipeById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const ingredients = await recipeModel.checkAvailability(recipeId, userId);

    // Classify availability
    const linkedIngredients = ingredients.filter(i => i.product_id || i.custom_product_id);
    const freeTextOnly = ingredients.filter(i => !i.product_id && !i.custom_product_id);
    const availableCount = linkedIngredients.filter(i => i.is_available).length;
    const missingCount = linkedIngredients.filter(i => !i.is_available).length;

    let status;
    if (linkedIngredients.length === 0) {
      status = 'unknown';
    } else if (availableCount === linkedIngredients.length) {
      status = 'can_cook';
    } else if (availableCount > 0) {
      status = 'partially_available';
    } else {
      status = 'missing_all';
    }

    // Apply scaling to needed quantities if requested
    const scaleFactor = (scale && scale > 0 && recipe.servings > 0) ? scale / recipe.servings : 1;

    const formattedIngredients = ingredients.map(i => ({
      ingredient_id: i.ingredient_id,
      free_text: i.free_text,
      product_id: i.product_id,
      custom_product_id: i.custom_product_id,
      product_recipe_name: i.product_recipe_name,
      needed_quantity: i.recipe_quantity ? parseFloat((i.recipe_quantity * scaleFactor).toFixed(2)) : null,
      unit: i.unit,
      available_quantity: parseInt(i.available_quantity) || 0,
      is_available: i.is_available,
      pantry_sources: i.pantry_sources || []
    }));

    res.json({
      recipe_id: recipe.recipe_id,
      recipe_recipe_name: recipe.recipe_name,
      servings: recipe.servings,
      status,
      summary: {
        total_linked_ingredients: linkedIngredients.length,
        available_count: availableCount,
        missing_count: missingCount,
        free_text_only_count: freeTextOnly.length
      },
      ingredients: formattedIngredients
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ error: 'Failed to check ingredient availability' });
  }
}

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  addIngredient,
  updateIngredient,
  removeIngredient,
  addInstruction,
  updateInstruction,
  removeInstruction,
  reorderInstructions,
  checkAvailability
};
