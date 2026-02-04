const pantryModel = require('../models/pantryModel');
const productModel = require('../models/productModel');
const recipeModel = require('../models/recipeModel');

// ***************************************************************
// *      Validate user owns both pantry and custom product      *
// * Used for routes that operate on custom products in a pantry *
// ***************************************************************
async function validateCustomProductAccess(req, res, next) {
  try {
    const { customProductId } = req.params;
    const userId = req.user.userId;

    // Verify custom product ownership
    const ownsProduct = await productModel.verifyCustomProductAccess(customProductId, userId);
    if (!ownsProduct) {
      return res.status(404).json({ error: 'Custom product not found or access denied' });
    }

    next();
  } catch (error) {
    console.error('Custom product access validation error:', error);
    res.status(500).json({ error: 'Custom product access validation failed' });
  }
}

// ***************************************************************
// *      Validate user owns pantry (for regular products)       *
// * For routes that operate on regular products within a pantry *
// ***************************************************************
async function validatePantryAccess(req, res, next) {
  try {
    const { pantryId } = req.params;
    const userId = req.user.userId;

    const ownsPantry = await pantryModel.verifyPantryOwnership(pantryId, userId);
    if (!ownsPantry) {
      return res.status(404).json({ error: 'Pantry not found or access denied' });
    }

    next();
  } catch (error) {
    console.error('Pantry access validation error:', error);
    res.status(500).json({ error: 'Pantry access validation failed' });
  }
}

// ***************************************************************
// *                  Validate user owns recipe                  *
// * For routes that operate on a recipe or its sub-resources    *
// ***************************************************************
async function validateRecipeAccess(req, res, next) {
  try {
    const { recipeId } = req.params;
    const userId = req.user.userId;

    const ownsRecipe = await recipeModel.verifyRecipeOwnership(recipeId, userId);
    if (!ownsRecipe) {
      return res.status(404).json({ error: 'Recipe not found or access denied' });
    }

    next();
  } catch (error) {
    console.error('Recipe access validation error:', error);
    res.status(500).json({ error: 'Recipe access validation failed' });
  }
}

module.exports = {
  validateCustomProductAccess,
  validatePantryAccess,
  validateRecipeAccess
};