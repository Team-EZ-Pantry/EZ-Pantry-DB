// *************************************
// *   Pantry Management Controllers   *
// *************************************

const pantryModel = require('../models/pantryModel');

// Get all pantries for the authenticated user
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

// Get a specific pantry with all its products
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

// Create a new pantry
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

// Update pantry name
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

// Delete a pantry
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
// *  Product Management Controllers   *
// *************************************

// Add a product to a pantry
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

// Remove a product from pantry
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

    if (!result) {
      return res.status(404).json({ error: 'Product not found in pantry' });
    }

    res.json({
      message: 'Product removed from pantry',
      product: result
    });
  } catch (error) {
    console.error('Remove product error:', error);
    res.status(500).json({ error: 'Failed to remove product from pantry' });
  }
}

// Update product quantity in pantry
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

// Update product expiration date
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