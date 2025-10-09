// *************************************
// *      User-related functions       *
// *************************************
// get user's pantry items
// add item to user's pantry
// remove item from user's pantry
// update item in user's pantry

//const pantryController = require('../controllers/pantryController');
const pool = require('../config/database');

//const token = pantryController.token; // user token

async function getAllItems(user_id) {
  console.log('Connecting to DB:', process.env.DB_NAME);

  const result = await pool.query(
    `
    SELECT 
      p.pantry_id,
      p.quantity,
      p.product_id,
      COALESCE(pr.product_name, p.name) AS display_name,  -- Use product name if available, else pantry item name
      pr.barcode,
      pr.brand,
      pr.image_url,
      pr.categories,
      pr.allergens,
      pr.calories_per_100g,
      pr.protein_per_100g,
      pr.carbs_per_100g,
      pr.fat_per_100g,
      pr.nutrition
    FROM pantry p
    LEFT JOIN product pr ON p.product_id = pr.product_id
    WHERE p.user_id = $1
    ORDER BY display_name ASC
    `,
    [user_id]
  );

  console.log('Query result:', result.rows);
  return result.rows;
}

  
async function addItem(user_id, name, quantity) {
  console.log('Connecting to DB:', process.env.DB_NAME);
  const result = await pool.query(
    'INSERT INTO pantry (user_id, name, quantity) VALUES ($1, $2, $3) RETURNING *',
    [user_id, name, quantity]
  );
  console.log('Query result:', result.rows);
  return result.rows[0];
}

async function updateItem(user_id, item_id, name, quantity) {
  console.log('Connecting to DB:', process.env.DB_NAME);

  const updates = [];
  const values = [];
  let index = 1;

  if (name !== undefined) {
    updates.push(`name = $${index++}`);
    values.push(name);
  }

  if (quantity !== undefined) {
    updates.push(`quantity = $${index++}`);
    values.push(quantity);
  }

  if (updates.length === 0) {
    console.log('No fields provided to update.');
    return null;
  }

  // Add identifiers for WHERE clause
  values.push(user_id);
  values.push(item_id);

  const query = `
    UPDATE pantry
    SET ${updates.join(', ')}
    WHERE user_id = $${index++} AND pantry_id = $${index}
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  console.log('Query result:', result.rows);
  return result.rows[0];
}

async function deletePantryItem(user_id, item_id) {
  console.log('Connecting to DB:', process.env.DB_NAME);
  const result = await pool.query(
    'DELETE FROM pantry WHERE user_id = $1 AND pantry_id = $2 RETURNING *',
    [user_id, item_id]
  );
  console.log('Query result:', result.rows);
  return result.rows[0];
}

module.exports = {
  getAllItems,
  addItem,
  updateItem,
  deletePantryItem
};