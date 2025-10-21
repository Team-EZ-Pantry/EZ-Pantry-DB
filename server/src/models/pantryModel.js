// *************************************
// *    Pantry Management Functions    *
// *************************************

const pool = require('../config/database');

// Get all pantries for a specific user
async function getPantriesByUserId(userId) {
  const result = await pool.query(
    'SELECT * FROM pantry WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

// Get a specific pantry with ALL its products
async function getPantryWithProducts(pantryId, userId) {
  // First, verify this pantry belongs to this user (security!)
  const pantry = await pool.query(
    'SELECT * FROM pantry WHERE pantry_id = $1 AND user_id = $2',
    [pantryId, userId]
  );

  if (pantry.rows.length === 0) {
    return null; // Pantry not found or doesn't belong to user
  }

  // Get all products in this pantry
  const products = await pool.query(
    `SELECT 
      p.product_id,
      p.product_name,
      p.brand,
      p.barcode,
      p.image_url,
      p.calories_per_100g,
      pp.quantity,
      pp.expiration_date
    FROM pantry_product pp
    JOIN product p ON pp.product_id = p.product_id
    WHERE pp.pantry_id = $1
    ORDER BY p.product_name ASC`,
    [pantryId]
  );

  return {
    ...pantry.rows[0],
    products: products.rows
  };
}

// Create a new pantry for a user
async function createPantry(userId, name) {
  const result = await pool.query(
    'INSERT INTO pantry (user_id, name) VALUES ($1, $2) RETURNING *',
    [userId, name]
  );
  return result.rows[0];
}

// Update pantry name
async function updatePantry(pantryId, userId, name) {
  const result = await pool.query(
    'UPDATE pantry SET name = $1 WHERE pantry_id = $2 AND user_id = $3 RETURNING *',
    [name, pantryId, userId]
  );
  return result.rows[0];
}

// Delete a pantry
async function deletePantry(pantryId, userId) {
  const result = await pool.query(
    'DELETE FROM pantry WHERE pantry_id = $1 AND user_id = $2 RETURNING *',
    [pantryId, userId]
  );
  return result.rows[0];
}

// *************************************
// * Pantry Product Functions          *
// *************************************

/*
 * Add a product to a pantry
 * If product exists, increment quantity
 * If product doesn't exist, create it in pantry_product
 */
async function addProductToPantry(pantryId, productId, quantity, expirationDate) {
  // Check if product already in this pantry
  const exists = await pool.query(
    'SELECT * FROM pantry_product WHERE pantry_id = $1 AND product_id = $2',
    [pantryId, productId]
  );

  if (exists.rows.length > 0) {
    // Product already exists, update quantity
    const result = await pool.query(
      'UPDATE pantry_product SET quantity = quantity + $1, expiration_date = $2 WHERE pantry_id = $3 AND product_id = $4 RETURNING *',
      [quantity, expirationDate, pantryId, productId]
    );
    return result.rows[0];
  } else {
    // New product for this pantry
    const result = await pool.query(
      'INSERT INTO pantry_product (pantry_id, product_id, quantity, expiration_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [pantryId, productId, quantity, expirationDate]
    );
    return result.rows[0];
  }
}

// Remove a product from pantry
async function removeProductFromPantry(pantryId, productId) {
  const result = await pool.query(
    'DELETE FROM pantry_product WHERE pantry_id = $1 AND product_id = $2 RETURNING *',
    [pantryId, productId]
  );
  return result.rows[0];
}

// Update product quantity in pantry (Products won't be removed when quantity goes to zero)
async function updateProductQuantity(pantryId, productId, quantity) {
  const result = await pool.query(
    'UPDATE pantry_product SET quantity = $1 WHERE pantry_id = $2 AND product_id = $3 RETURNING *',
    [quantity, pantryId, productId]
  );
  return result.rows[0];
}

// Update product expiration date
async function updateProductExpiration(pantryId, productId, expirationDate) {
  const result = await pool.query(
    'UPDATE pantry_product SET expiration_date = $1 WHERE pantry_id = $2 AND product_id = $3 RETURNING *',
    [expirationDate, pantryId, productId]
  );
  return result.rows[0];
}

module.exports = {
  // Pantry management
  getPantriesByUserId,
  getPantryWithProducts,
  createPantry,
  updatePantry,
  deletePantry,
  // Product management
  addProductToPantry,
  removeProductFromPantry,
  updateProductQuantity,
  updateProductExpiration
};