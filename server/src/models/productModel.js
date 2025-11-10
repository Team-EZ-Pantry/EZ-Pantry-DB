// *************************************
// *     Product-related Functions     *
// *************************************

const pool = require('../config/database');

// Search both regular products and user's custom products
async function searchProducts(query, userId, limit = 10) {
  const result = await pool.query(
    `
    SELECT 
      product_id AS id,
      'product' AS product_type,
      product_name,
      brand,
      image_url,
      barcode,
      categories,
      allergens,
      calories_per_100g
    FROM product
    WHERE product_name ILIKE $1
    
    UNION ALL
    
    SELECT 
      custom_product_id AS id,
      'custom_product' AS product_type,
      product_name,
      brand,
      image_url,
      barcode,
      categories,
      allergens,
      calories_per_100g
    FROM custom_product
    WHERE user_id = $2 AND product_name ILIKE $1
    
    ORDER BY product_name ASC
    LIMIT $3
    `,
    [`%${query}%`, userId, limit]
  );
  
  return result.rows;
}

// Find product by exact barcode (for barcode scanning)
async function findByBarcode(barcode) {
  const result = await pool.query(
    'SELECT * FROM product WHERE barcode = $1',
    [barcode]
  );
  return result.rows[0];
}

// Verify a user has access to a custom product
async function verifyCustomProductAccess(customProductId, userId) {
  const result = await pool.query(
    'SELECT custom_product_id FROM custom_product WHERE custom_product_id = $1 AND user_id = $2',
    [customProductId, userId]
  );
  return result.rows.length > 0;
}

// Create a custom product associated with a user
async function createCustomProduct(userId, productData) {
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
    `INSERT INTO custom_product (
      user_id, barcode, product_name, brand, image_url,
      categories, allergens, calories_per_100g,
      protein_per_100g, carbs_per_100g, fat_per_100g, nutrition
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      userId, barcode, product_name, brand, image_url,
      categories, allergens, calories_per_100g,
      protein_per_100g, carbs_per_100g, fat_per_100g,
      nutrition
    ]
  );
  return result.rows[0];
}

// Delete a custom product
async function deleteCustomProduct(userId, customProductId) {
  const result = await pool.query(
    'DELETE FROM custom_product WHERE user_id = $1 AND custom_product_id = $2 RETURNING *',
    [userId, customProductId]
  );
  return result.rows[0];
}

// Get all of a user's custom products and their pantry locations
async function getMyCustomProducts(userId) {
  const result = await pool.query(
    `SELECT 
      cp.custom_product_id,
      cp.product_name,
      cp.brand,
      cp.image_url,
      cp.categories,
      cp.allergens,
      cp.calories_per_100g,
      cp.protein_per_100g,
      cp.carbs_per_100g,
      cp.fat_per_100g,
      cp.nutrition,
      COALESCE(
        json_agg(
          json_build_object(
            'pantry_id', p.pantry_id,
            'pantry_name', p.name,
            'quantity', pp.quantity,
            'expiration_date', pp.expiration_date
          ) ORDER BY p.name
        ) FILTER (WHERE p.pantry_id IS NOT NULL), 
        '[]'
      ) as pantry_locations
    FROM custom_product cp
    LEFT JOIN pantry_product pp ON pp.custom_product_id = cp.custom_product_id
    LEFT JOIN pantry p ON pp.pantry_id = p.pantry_id AND p.user_id = $1
    WHERE cp.user_id = $1
    GROUP BY cp.custom_product_id
    ORDER BY cp.created_at DESC`,
    [userId]
  );
  return result.rows;
}

// Modify a custom product's information. Partial updates allowed.
async function modifyCustomProduct(userId, customProductId, updateData) {
  // Build dynamic UPDATE query based on what fields are provided
  const allowedFields = [
    'product_name',
    'brand',
    'image_url',
    'categories',
    'allergens',
    'calories_per_100g',
    'protein_per_100g',
    'carbs_per_100g',
    'fat_per_100g',
    'nutrition'
  ];

  const updates = [];
  const values = [];
  let paramIndex = 1; // Track parameter position for SQL query

  // Build SET clause dynamically
  for (const field of allowedFields) {
    if (updateData.hasOwnProperty(field)) {
      updates.push(`${field} = $${paramIndex}`);
      values.push(updateData[field]);
      paramIndex++;
    }
  }

  // If no valid fields to update
  if (updates.length === 0) {
    throw new Error('No valid fields to update');
  }

  // Add WHERE clause parameters ['New name', ..., customProductId, userId]
  values.push(customProductId);  // at paramIndex
  values.push(userId);           // at paramIndex+1

  const query = `
    UPDATE custom_product
    SET ${updates.join(', ')}
    WHERE custom_product_id = $${paramIndex} AND user_id = $${paramIndex+1}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

// Permanently delete a user's custom product
async function deleteCustomProduct(userId, customProductId) {
  const result = await pool.query(
    'DELETE FROM custom_product WHERE user_id = $1 AND custom_product_id = $2 RETURNING *',
    [userId, customProductId]
  );
  return result.rows[0];
}

module.exports = {
  searchProducts,
  findByBarcode,
  verifyCustomProductAccess,
  createCustomProduct,
  deleteCustomProduct,
  getMyCustomProducts,
  modifyCustomProduct,
  deleteCustomProduct
};
