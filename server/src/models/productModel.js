// *************************************
// *     Product-related Functions     *
// *************************************

const pool = require('../config/database');

// Search products by name (partial match)
async function searchProducts(query, limit = 10) {
  const result = await pool.query(
    `SELECT 
      product_id,
      product_name,
      brand,
      barcode,
      image_url,
      calories_per_100g
    FROM product
    WHERE product_name ILIKE LOWER($1)
    ORDER BY product_name ASC
    LIMIT $2`,
    [`%${query}%`, limit]
  );
  return result.rows;
}

// Get product by ID (for details view)
async function findById(productId) {
    const result = await pool.query(
      'SELECT * FROM product WHERE product_id = $1',
      [productId]
    );
    return result.rows[0];
  }

// Find product by exact barcode (for barcode scanning)
async function findByBarcode(barcode) {
  const result = await pool.query(
    'SELECT * FROM product WHERE barcode = $1',
    [barcode]
  );
  return result.rows[0];
}

// Create a new product (when barcode not found)
/*async function createProduct(productData) {
  const {
    barcode,
    product_name,
    brand,
    image_url,
    categories,
    allergens,
    calories_per_100g,
    protein_per_100g,
    carbs_per_100g,
    fat_per_100g,
    nutrition
  } = productData;

  const result = await pool.query(
    `INSERT INTO product (
      barcode, product_name, brand, image_url,
      categories, allergens, calories_per_100g,
      protein_per_100g, carbs_per_100g, fat_per_100g, nutrition
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      barcode, product_name, brand, image_url,
      categories, allergens, calories_per_100g,
      protein_per_100g, carbs_per_100g, fat_per_100g,
      nutrition
    ]
  );
  return result.rows[0];
}*/

module.exports = {
  searchProducts,
  findById,
  findByBarcode
  // createProduct
};