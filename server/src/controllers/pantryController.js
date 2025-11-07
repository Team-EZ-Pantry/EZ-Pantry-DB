// *************************************
// *   Pantry Management Controllers   *
// *************************************

const pantryModel = require('../models/pantryModel');
const productModel = require('../models/productModel');

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

    res.status(201).json({pantry: newPantry});
  } catch (error) {
    console.error('Create pantry error:', error);
    res.status(500).json({ error: 'Failed to create pantry' });
  }
}

// *************************************
// *    Get all Pantries for a User    *
// *************************************
async function getAllPantriesForUser(req, res) {
  try {
    const userId = req.user.userId; // From authenticated token
    const pantries = await pantryModel.getPantriesByUserId(userId);
    
    res.json({pantries});
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

    res.json({pantry: pantryWithProducts});
  } catch (error) {
    console.error('Get pantry error:', error);
    res.status(500).json({ error: 'Failed to retrieve pantry' });
  }
}

// *************************************
// *      Update A Pantry's Name       *
// *************************************
async function updatePantryName(req, res) {
  try {
    const { pantryId } = req.params;
    const { name } = req.body;
    const userId = req.user.userId;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await pantryModel.updatePantryName(pantryId, userId, name);

    res.json({ message: 'Pantry name updated', pantry: result });
  } catch (error) {
    console.error('Update pantry name error:', error);
    res.status(500).json({ error: 'Failed to update pantry name' });
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
// *    Pantry Product Controllers     *
// *************************************

// *************************************
// *     Add a Product to a Pantry     *
// *************************************
async function addProduct(req, res) {
  try {
    const { productId, pantryId } = req.params;
    const { quantity, expirationDate } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    // Add product to pantry
    const result = await pantryModel.addProductToPantry(
      pantryId,
      productId,
      null, // No custom product ID
      quantity,
      expirationDate || null
    );

    res.status(201).json({
      message: 'Product added to pantry',
      product: result
    });
  } catch (error) {
    if (error.code === '23503') { // foreign key violation
      return res.status(404).json({ error: 'Invalid product ID' });
    }
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product to pantry' });
  }
}

// *************************************
// *   Remove a Product from Pantry    *
// *************************************
async function removeProduct(req, res) {
  try {
    const { pantryId, productId } = req.params;

    const result = await pantryModel.removeProductFromPantry(
      pantryId,
      productId,            
      null  // no custom product ID
    );
    if (!result) {
      return res.status(404).json({ error: 'Product not found in pantry' });
    }

    res.json({
      message: 'Product removed from pantry',
      product: result
    });
  } catch (error) {
    if (error.code === '23503') { // foreign key violation
      return res.status(404).json({ error: 'Invalid product ID' });
    }
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

    // Validate input
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ error: 'Quantity is required' });
    }

    const result = await pantryModel.updateProductQuantity(
      pantryId, 
      productId,
      null,  // no custom product ID
      quantity
    );

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

    // Validate input
    if (!expirationDate) {
      return res.status(400).json({ error: 'Expiration date is required' });
    }

    const result = await pantryModel.updateProductExpiration(
      pantryId, 
      productId,
      null,  // no custom product ID 
      expirationDate
    );

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

// *************************************
// * Custom Pantry Product Controllers *
// *************************************

// *************************************
// *    Add a Custom Pantry Product    *
// *************************************
async function addCustomProduct(req, res) {
  try {
    const { pantryId, customProductId } = req.params;
    const { quantity, expirationDate } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    // Same shared function, different parameters!
    const result = await pantryModel.addProductToPantry(
      pantryId,
      null,              // No regular product ID
      customProductId,   // custom product ID
      quantity,
      expirationDate
    );

    res.status(201).json({
      message: 'Custom product added to pantry',
      product: result
    });
  } catch (error) {
    console.error('Add custom product error:', error);
    res.status(500).json({ error: 'Failed to add custom product' });
  }
}

// *************************************
// *   Remove a Custom Pantry Product  *
// *************************************
async function removeCustomProduct(req, res) {
  try {
    const { pantryId, customProductId } = req.params;

    const result = await pantryModel.removeProductFromPantry(
      pantryId,
      null, // no regular product ID
      customProductId  
    );

    if (!result) {
      return res.status(404).json({ error: 'Custom product not found in pantry' });
    }

    res.json({ message: 'Custom product removed', product: result });
  } catch (error) {
    console.error('Remove custom product error:', error);
    res.status(500).json({ error: 'Failed to remove custom product' });
  }
}

// *************************************
// * Update Custom Product Quantity    *
// *************************************
async function updateCustomProductQuantity(req, res) {
  try {
    const { pantryId, customProductId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ error: 'Quantity is required' });
    }

    const result = await pantryModel.updateProductQuantity(
      pantryId,
      null,
      customProductId,
      quantity
    );

    res.json({ message: 'Quantity updated', product: result });
  } catch (error) {
    console.error('Update quantity error:', error);
    res.status(500).json({ error: 'Failed to update quantity' });
  }
}

// *************************************
// * Update Custom Product Expiration  *
// *************************************
async function updateCustomProductExpiration(req, res) {
  try {
    const { pantryId, customProductId } = req.params;
    const { expirationDate } = req.body;

    // Validate input
    if (!expirationDate) {
      return res.status(400).json({ error: 'Expiration date is required' });
    }

    const result = await pantryModel.updateProductExpiration(
      pantryId, 
      null, // no regular product ID 
      customProductId,  
      expirationDate
    );

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
  createPantry,
  getAllPantriesForUser,
  getPantry,
  updatePantryName,
  deletePantry,
  // Pantry Product Controllers
  addProduct,
  removeProduct,
  updateProductQuantity,
  updateProductExpiration,
  // Custom Pantry Product Controllers
  addCustomProduct,
  removeCustomProduct,
  updateCustomProductQuantity,
  updateCustomProductExpiration
};