// *************************************
// *    Product-related Controllers    *
// *************************************

const productModel = require('../models/productModel');

// Search products for autocomplete
// Query params: ?q=milk and ?limit=10 (optional)
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

// Get product details by ID
async function getProductById(req, res) {
  try {
    const { productId } = req.params;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

// Get product by barcode (for scanning)
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

module.exports = {
  searchProducts,
  getProductByBarcode,
  getProductById
};