// *************************************
// *   Pantry Management Controllers   *
// *************************************

const pantryModel = require('../models/pantryModel');

// *************************************
// *       Create a New Pantry         *
// *************************************
async function createPantry(req, res) {
  try {
    const { name } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Pantry name is required' });
    }

    const newPantry = await pantryModel.createPantry(userId, name);

    res.status(201).json({
      message: 'Pantry created successfully',
      pantry: newPantry
    });
  } catch (error) {
    console.error('Create pantry error:', error);
    res.status(500).json({ error: 'Failed to create pantry' });
  }
}

// *************************************
// *         Delete a Pantry           *
// *************************************
async function deletePantry(req, res) {
  try {
    const { pantryId } = req.params;
    const userId = req.user.userId;

    const deletedPantry = await pantryModel.deletePantry(pantryId, userId);

    if (!deletedPantry) {
      return res.status(404).json({ error: 'Pantry not found' });
    }

    res.json({
      message: 'Pantry deleted successfully',
      pantry: deletedPantry
    });
  } catch (error) {
    console.error('Delete pantry error:', error);
    res.status(500).json({ error: 'Failed to delete pantry' });
  }
}

// *************************************
// *       Update Pantry Name          *
// *************************************
async function updatePantry(req, res) {
  try {
    const { pantryId } = req.params;
    const { name } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Pantry name is required' });
    }

    const updatedPantry = await pantryModel.updatePantry(pantryId, userId, name);

    if (!updatedPantry) {
      return res.status(404).json({ error: 'Pantry not found' });
    }

    res.json({
      message: 'Pantry updated successfully',
      pantry: updatedPantry
    });
  } catch (error) {
    console.error('Update pantry error:', error);
    res.status(500).json({ error: 'Failed to update pantry' });
  }
}

// *************************************
// *    Get all Pantries for a User    *
// *************************************
async function getAllPantries(req, res) {
  try {
    const userId = req.user.userId; // From authenticated token
    const pantries = await pantryModel.getPantriesByUserId(userId);
    
    res.json({
      message: 'Pantries retrieved successfully',
      pantries
    });
  } catch (error) {
    console.error('Get pantries error:', error);
    res.status(500).json({ error: 'Failed to retrieve pantries' });
  }
}

// *************************************
// *   Get a Pantry and its Products   *
// *************************************
async function getPantry(req, res) {
  try {
    const { pantryId } = req.params;
    const userId = req.user.userId;

    const pantryWithProducts = await pantryModel.getPantryWithProducts(pantryId, userId);
    
    if (!pantryWithProducts) {
      return res.status(404).json({ error: 'Pantry not found' });
    }

    res.json({
      message: 'Pantry retrieved successfully',
      pantry: pantryWithProducts
    });
  } catch (error) {
    console.error('Get pantry error:', error);
    res.status(500).json({ error: 'Failed to retrieve pantry' });
  }
}

// *************************************
// *  Product Management Controllers   *
// *************************************

// *************************************
// *     Add a Product to a Pantry     *
// *************************************
async function addProductToPantry(req, res) {
  try {
    const { pantryId } = req.params;
    const { productId, quantity, expirationDate } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    // Verify pantry belongs to user (security check)
    const pantry = await pantryModel.getPantryWithProducts(pantryId, userId);
    if (!pantry) {
      return res.status(404).json({ error: 'Pantry not found' });
    }

    // MODEL CALL
    const result = await pantryModel.addProductToPantry(
      pantryId,
      productId,
      quantity,
      expirationDate || null
    );

    res.status(201).json({
      message: 'Product added to pantry',
      product: result
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product to pantry' });
  }
}

// *************************************
// *   Remove a Product from Pantry    *
// *************************************
async function removeProductFromPantry(req, res) {
  try {
    const { pantryId, productId } = req.params;
    const userId = req.user.userId;

    // Verify pantry belongs to user
    const pantry = await pantryModel.getPantryWithProducts(pantryId, userId);
    if (!pantry) {
      return res.status(404).json({ error: 'Pantry not found' });
    }

    const result = await pantryModel.removeProductFromPantry(pantryId, productId);

    res.json({
      message: 'Product removed from pantry',
      product: result
    });
  } catch (error) {
    console.error('Remove product error:', error);
    res.status(500).json({ error: 'Failed to remove product from pantry' });
  }
}

// *************************************
// * Update a Pantry Product Quantity  *
// *************************************
async function updateProductQuantity(req, res) {
  try {
    const { pantryId, productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ error: 'Quantity is required' });
    }

    // Verify pantry belongs to user
    const pantry = await pantryModel.getPantryWithProducts(pantryId, userId);
    if (!pantry) {
      return res.status(404).json({ error: 'Pantry not found' });
    }

    const result = await pantryModel.updateProductQuantity(pantryId, productId, quantity);

    if (!result) {
      return res.status(404).json({ error: 'Product not found in pantry' });
    }

    res.json({
      message: 'Product quantity updated',
      product: result
    });
  } catch (error) {
    console.error('Update quantity error:', error);
    res.status(500).json({ error: 'Failed to update product quantity' });
  }
}

// *************************************
// * Update Pantry Product Expiration  *
// *************************************
async function updateProductExpiration(req, res) {
  try {
    const { pantryId, productId } = req.params;
    const { expirationDate } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!expirationDate) {
      return res.status(400).json({ error: 'Expiration date is required' });
    }

    // Verify pantry belongs to user
    const pantry = await pantryModel.getPantryWithProducts(pantryId, userId);
    if (!pantry) {
      return res.status(404).json({ error: 'Pantry not found' });
    }

    const result = await pantryModel.updateProductExpiration(pantryId, productId, expirationDate);

    if (!result) {
      return res.status(404).json({ error: 'Product not found in pantry' });
    }

    res.json({
      message: 'Product expiration date updated',
      product: result
    });
  } catch (error) {
    console.error('Update expiration error:', error);
    res.status(500).json({ error: 'Failed to update product expiration' });
  }
}

module.exports = {
  getAllPantries,
  getPantry,
  createPantry,
  updatePantry,
  deletePantry,
  addProductToPantry,
  removeProductFromPantry,
  updateProductQuantity,
  updateProductExpiration
};