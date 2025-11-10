// *************************************
// *    Product-related Controllers    *
// *************************************

const productModel = require('../models/productModel');

// *************************************
// *         Regular Products          *
// *************************************

// ***************************************************************
// * Search products and custom products by name (partial match) *
// ***************************************************************
// Query params: ?q=milk (required) and ?limit=10 (optional)
// Returns unified format with product_type field
async function searchProducts(req, res) {
  try {
    const { q, limit } = req.query;
    const userId = req.user.userId; // for debugging/logging if needed

    // Validate search query
    if (!q || q.trim() === '') {
      return res.status(400).json({ 
        error: 'Search query is required' 
      });
    }

    // Minimum 2 characters to prevent too many results
    if (q.length < 2) {
      return res.json({ 
        query: q,
        count: 0,
        products: [] 
      });
    }
    // Search both regular products and user's custom products
    const products = await productModel.searchProducts(
      q.trim(), 
      userId,
      parseInt(limit) || 10
    );

    res.json({
      query: q,
      count: products.length,
      products
    });

  } catch (error) {
    console.error({
        message: error.message,
        userId,
        query: q,
        limit
      });
    res.status(500).json({ error: 'Failed to search products' });
  }
}

// *****************************************
// * Get product by barcode (for scanning) *
// *****************************************
async function getProductByBarcode(req, res) {
    try {
      const { barcode } = req.params;
  
      const product = await productModel.findByBarcode(barcode);
  
      if (!product) {
        return res.status(404).json({ 
          error: 'Product not found',
          barcode 
        });
      }
  
      res.json({ product });
  
    } catch (error) {
      console.error('Get product by barcode error:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

// *************************************
// *          Custom Products          *
// *************************************

// *********************************************************
// *     Create a custom product associated with a user    *
// *********************************************************
async function createCustomProduct(req, res) {
  try {
    const userId = req.user.userId;
    const productData = req.body;

    // Validate required fields
    if (!productData.product_name || productData.product_name.trim() === '') {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const customProduct = await productModel.createCustomProduct(userId, productData);

    res.status(201).json({ customProduct });
  } catch (error) {
    console.error('Create custom product error:', error);
    res.status(500).json({ error: 'Failed to create custom product' });
  }
}

// ******************************************************************
// * Get all custom products associated with the authenticated user *
// ******************************************************************
async function getMyCustomProducts(req, res) {
  try {
    const userId = req.user.userId;

    const customProducts = await productModel.getMyCustomProducts(userId);

    res.status(200).json({ customProducts });
  } catch (error) {
    console.error('Error getting custom products:', error);
    res.status(500).json({ error: 'Failed to fetch custom products' });
  }
}

// ******************************************************************
// *             Modify a custom product's information              *
// ******************************************************************
async function modifyCustomProduct(req, res) {
  try {
    const userId = req.user.userId;
    const { customProductId } = req.params;
    const updateData = req.body;

    // Validate that at least one field was provided
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    // Validate that product name was provided
    if (!updateData.product_name || updateData.product_name.trim() === '') {
      return res.status(400).json({ error: 'Product name cannot be empty' });
    }

    // Validate numeric fields if provided
    const numericFields = ['calories_per_100g', 'protein_per_100g', 'carbs_per_100g', 'fat_per_100g'];
    for (const field of numericFields) {
      if (updateData[field] !== undefined && updateData[field] !== null) {
        const value = parseFloat(updateData[field]); // Convert to number
        if (isNaN(value) || value < 0) {
          return res.status(400).json({ 
            error: `${field} must be a positive number` 
          });
        }
        updateData[field] = value; 
      }
    }

    const updatedProduct = await productModel.modifyCustomProduct(
      userId,
      customProductId,
      updateData
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Custom product not found' });
    }

    res.json({
      message: 'Custom product updated successfully',
      customProduct: updatedProduct
    });

  } catch (error) {
    console.error('Modify custom product error:', error);

    // Catch error from model when no valid fields to update 
    // (shouldn't run because product name is validated above)
    if (error.message === 'No valid fields to update') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Failed to modify custom product' });
  }
}


// ******************************************************************
// *           Permanently delete a user's custom product           *
// ******************************************************************
async function deleteCustomProduct(req, res) {
  try {
    const userId = req.user.userId;
    const { customProductId } = req.params;

    const deletedCustomProduct = await productModel.deleteCustomProduct(userId, customProductId);

    res.status(200).json({ deletedCustomProduct });
  } catch (error) {
    console.error('Delete custom product error:', error);
    res.status(500).json({ error: 'Failed to delete custom product' });
  }
}

module.exports = {
  searchProducts,
  getProductByBarcode,
  createCustomProduct,
  getMyCustomProducts,
  modifyCustomProduct,
  deleteCustomProduct
};
