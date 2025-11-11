// *************************************
// *         Pantry Functions          *
// *************************************

const pool = require('../config/database');

// Verify a pantry belongs to a user
async function verifyPantryOwnership(pantryId, userId) {
  const result = await pool.query(
    'SELECT pantry_id FROM pantry WHERE pantry_id = $1 AND user_id = $2',
    [pantryId, userId]
  );
  return result.rows.length > 0;
}

// Create a new pantry associated with a user
async function createPantry(userId, name) {
  const result = await pool.query(
    'INSERT INTO pantry (user_id, name) VALUES ($1, $2) RETURNING *',
    [userId, name]
  );
  return result.rows[0];
}

// Get all pantries for a specific user
async function getPantriesByUserId(userId) {
  const result = await pool.query(
    'SELECT * FROM pantry WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

// Get a pantry with its products
async function getPantryWithProducts(pantryId, userId, sortBy, category) {
  // Verify pantry belongs to user
  const pantry = await pool.query(
    'SELECT * FROM pantry WHERE pantry_id = $1 AND user_id = $2',
    [pantryId, userId]
  );

  if (pantry.rows.length === 0) {
    return null; // Pantry not found or doesn't belong to user
  }

  // Build ORDER BY clause based on sortBy parameter
  const sortOptions = {
    'name_asc': 'ORDER BY COALESCE(p.product_name, cp.product_name) ASC',
    'name_desc': 'ORDER BY COALESCE(p.product_name, cp.product_name) DESC', 
    'date_asc': 'ORDER BY pp.added_at ASC',
    'date_desc': 'ORDER BY pp.added_at DESC'
  };
  const orderByClause = sortOptions[sortBy] || sortOptions['name_asc'];

  // Build WHERE clause for category filter (future implementation)
  // For now, just select all products
  const categoryFilter = category 
    ? `AND ($3 = ANY(COALESCE(p.categories, cp.categories)))`
    : '';
  
  // Also, maybe add Pagination? and Caching?

  // Query parameters
  const queryParams = [pantryId];
  if (category) {
    queryParams.push(category);
  }

  // Get products with dynamic sorting
  const products = await pool.query(
    `SELECT 
      COALESCE(p.product_id, cp.custom_product_id) AS id,
      CASE 
        WHEN p.product_id IS NOT NULL THEN 'product'
        ELSE 'custom_product' 
      END AS product_type,
      COALESCE(p.product_name, cp.product_name) AS product_name,
      COALESCE(p.brand, cp.brand) AS brand,
      COALESCE(p.image_url, cp.image_url) AS image_url,
      COALESCE(p.categories, cp.categories) AS categories,
      COALESCE(p.allergens, cp.allergens) AS allergens,
      COALESCE(p.calories_per_100g, cp.calories_per_100g) AS calories_per_100g,
      pp.quantity,
      pp.expiration_date,
      pp.added_at
    FROM pantry_product pp
    LEFT JOIN product p ON pp.product_id = p.product_id
    LEFT JOIN custom_product cp ON pp.custom_product_id = cp.custom_product_id
    WHERE pp.pantry_id = $1
    ${categoryFilter}
    ${orderByClause}`,
    queryParams
  );

  return {
    ...pantry.rows[0],
    products: products.rows
  };
}

// Update a pantry's name
async function updatePantryName(pantryId, userId, name) {
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
// *     Pantry Product Functions      *
// *************************************

// *********************************************************
// *              Add a product to a pantry                *
// *        If product exists, increment quantity          *
// * If product doesn't exist, create it in pantry_product *
// *********************************************************
async function addProductToPantry(pantryId, productId, customProductId, quantity, expirationDate) {
  // Check if product already in this pantry
  const exists = await pool.query(
    `SELECT * FROM pantry_product 
     WHERE pantry_id = $1 
     AND (
       (product_id = $2 AND $2 IS NOT NULL)
       OR 
       (custom_product_id = $3 AND $3 IS NOT NULL)
     )`,
    [pantryId, productId, customProductId]
  );

  if (exists.rows.length > 0) {
    // Product already exists, update quantity
    const result = await pool.query(
      `UPDATE pantry_product 
       SET quantity = quantity + $1, 
           expiration_date = $2 
       WHERE pantry_id = $3 
       AND (
         (product_id = $4 AND $4 IS NOT NULL)
         OR 
         (custom_product_id = $5 AND $5 IS NOT NULL)
       )
       RETURNING *`,
      [quantity, expirationDate, pantryId, productId, customProductId]
    );
    return result.rows[0];
  } else {
    // New product for this pantry
    const result = await pool.query(
      `INSERT INTO pantry_product (
         pantry_id, 
         product_id, 
         custom_product_id, 
         quantity, 
         expiration_date
       ) VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [pantryId, productId, customProductId, quantity, expirationDate]
    );
    return result.rows[0];
  }
}

// Remove a product from pantry
async function removeProductFromPantry(pantryId, productId, customProductId) {
  const result = await pool.query(
    `DELETE FROM pantry_product 
    WHERE pantry_id = $1 
    AND ( 
    (product_id = $2 AND $2 IS NOT NULL)
      OR 
    (custom_product_id = $3 AND $3 IS NOT NULL) 
    )
    RETURNING *`,
    [pantryId, productId, customProductId]
  );
  return result.rows[0];
}

// Update product quantity in pantry (Products won't be removed when quantity goes to zero)
async function updateProductQuantity(pantryId, productId, customProductId, quantity) {
  const result = await pool.query(
    `UPDATE pantry_product 
     SET quantity = $1 
     WHERE pantry_id = $2 
     AND (
       (product_id = $3 AND $3 IS NOT NULL)
       OR 
       (custom_product_id = $4 AND $4 IS NOT NULL)
     )
     RETURNING *`,
    [quantity, pantryId, productId, customProductId]
  );
  return result.rows[0];
}

// Update product expiration date
async function updateProductExpiration(pantryId, productId, customProductId, expirationDate) {
  const result = await pool.query(
    `UPDATE pantry_product 
     SET expiration_date = $1 
     WHERE pantry_id = $2 
     AND (
       (product_id = $3 AND $3 IS NOT NULL)
       OR 
       (custom_product_id = $4 AND $4 IS NOT NULL)
     )
     RETURNING *`,
    [expirationDate, pantryId, productId, customProductId]
  );
  return result.rows[0];
}

module.exports = {
  // Pantry management
  verifyPantryOwnership,
  getPantriesByUserId,
  getPantryWithProducts,
  createPantry,
  updatePantryName,
  deletePantry,
  // Pantry Product management
  addProductToPantry,
  removeProductFromPantry,
  updateProductQuantity,
  updateProductExpiration
};