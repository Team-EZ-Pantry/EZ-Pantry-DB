const pantryModel = require('../models/pantryModel');
const productModel = require('../models/productModel');

// ***************************************************************
// *      Validate user owns both pantry and custom product      *
// * Used for routes that operate on custom products in a pantry *
// ***************************************************************
async function validateCustomProductAccess(req, res, next) {
  try {
    const { customProductId } = req.params;
    const userId = req.user.userId;

    // Verify custom product ownership
    const ownsProduct = await productModel.verifyCustomProductOwnership(customProductId, userId);
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

module.exports = {
  validateCustomProductAccess,
  validatePantryAccess
};