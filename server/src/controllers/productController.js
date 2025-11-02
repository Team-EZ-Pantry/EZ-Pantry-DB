// *************************************
// *    Product-related Controllers    *
// *************************************

const productModel = require('../models/productModel');

// *************************************
// *         Regular Products          *
// *************************************

// *******************************************
// * Search products by name (partial match) *
// *******************************************
// Query params: ?q=milk (required) and ?limit=10 (optional)
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
      return res.json({ products: [] });
    }

    const products = await productModel.searchProducts(
      q.trim(), 
      parseInt(limit) || 10
    );

    res.json({
      query: q,
      count: products.length,
      products
    });

  } catch (error) {
    console.error({
        message: 'Product search error',
        userId,
        query: q,
        limit,
        error: error.message
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
/*async function modifyCustomProduct(req, res) {
  try {
    const userId = req.user.userId;
    const { customProductId } = req.params;
    const updateData = req.body;

    const updatedCustomProduct = await productModel.modifyCustomProduct(
      userId,
      customProductId,
      updateData
    );

    res.status(200).json({ updatedCustomProduct });
  } catch (error) {
    console.error('Modify custom product error:', error);
    res.status(500).json({ error: 'Failed to modify custom product' });
  }
}*/


module.exports = {
  searchProducts,
  getProductByBarcode,
  createCustomProduct,
  deleteCustomProduct,
  getMyCustomProducts,
  //modifyCustomProduct
};