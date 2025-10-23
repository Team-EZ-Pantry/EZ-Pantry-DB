// *************************************
// *      Shopping list Functions      *
// *************************************

const pool = require('../config/database');

// Get all of a user's shopping lists
async function getAllShoppingLists(userId) {
  const result = await pool.query(
    'SELECT * FROM shopping_list WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

// Create a new shopping list for a user
async function createShoppingList(userId, name) {
   const result = await pool.query(
      'INSERT INTO shopping_list (user_id, name) VALUES ($1, $2) RETURNING *',
      [userId, name]
   );
   return result.rows[0];
}

// Get a specific shopping list for a user
async function getShoppingList(userId, listId) {
  const result = await pool.query(
    'SELECT * FROM shopping_list WHERE list_id = $1 AND user_id = $2',
    [listId, userId]
  );
  return result.rows[0];
}

// Delete a shopping list and its associated items for a user
async function deleteShoppingList(userId, listId) {
  // First delete associated items
   await pool.query(
    'DELETE FROM shopping_list_item WHERE list_id = $1 AND user_id = $2',
    [listId, userId]
  );

  // Then delete the shopping list itself
  const result = await pool.query(
    'DELETE FROM shopping_list WHERE list_id = $1 AND user_id = $2 RETURNING *',
    [listId, userId]
  );
  return result.rows[0];
}

// Toggle the checked status of an item on a list
async function toggleItemChecked(listId, itemId) { // need to implement list complete checking !!
   const result = await pool.query(
      `UPDATE shopping_list_item
       SET checked = NOT COALESCE(checked, FALSE)
       WHERE item_id = $1 AND list_id = $2
       RETURNING *`,
      [itemId, listId, userId]
   );
   
   return result.rows[0];
}

// Add an item to a shopping list
async function addShoppingListItem(listId, productId, quantity) {
   const result = await pool.query(
      `INSERT INTO shopping_list_item (list_id, product_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [listId, productId, quantity]
   );
   return result.rows[0];
}

// Remove an item from a shopping list
async function removeShoppingListItem(listId, itemId) {
   const result = await pool.query(
      'DELETE FROM shopping_list_item WHERE item_id = $1 AND list_id = $2 RETURNING *',
      [itemId, listId]
   );
   return result.rows[0];
}

module.exports = {
  getAllShoppingLists,
  createShoppingList,
  getShoppingList,
  deleteShoppingList,
  toggleItemChecked,
  addShoppingListItem,
  removeShoppingListItem,
};