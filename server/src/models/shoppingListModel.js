// *************************************
// *      Shopping list Functions      *
// *************************************

const pool = require('../config/database');

// Create a new shopping list for a user
async function createShoppingList(userId, name) {
   const result = await pool.query(
      'INSERT INTO shopping_list (user_id, name) VALUES ($1, $2) RETURNING *',
      [userId, name]
   );
   return result.rows[0];
}

// Get all of a user's shopping lists
async function getAllShoppingLists(userId) {
  const result = await pool.query(
    'SELECT * FROM shopping_list WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

// Get a specific shopping list for a user
async function getShoppingList(listId) {
  const result = await pool.query(
    'SELECT shopping_list_item.*, product.product_name FROM shopping_list_item JOIN product ON shopping_list_item.product_id = product.product_id WHERE shopping_list_item.list_id = $1',
    [listId]
  );
  return result.rows;
}

// Delete a shopping list and its associated items for a user
async function deleteShoppingList(userId, listId) {
  const result = await pool.query(
    'DELETE FROM shopping_list WHERE list_id = $1 AND user_id = $2 RETURNING *',
    [listId, userId]
  );
  return result.rows[0];
}

// Toggle the checked status of an item on a list
async function toggleItemChecked(listId, itemId) {
  // 1. Toggle the checked status
  const updatedItemResult = await pool.query(
    `UPDATE shopping_list_item
     SET checked = NOT COALESCE(checked, FALSE)
     WHERE item_id = $1 AND list_id = $2
     RETURNING *`,
    [itemId, listId]
  );

  const updatedItem = updatedItemResult.rows[0];
  if (!updatedItem) return null;

  // 2. Check whether all items in the list are now checked
  const completionCheck = await pool.query(
    `SELECT
       BOOL_AND(checked) AS all_checked
     FROM shopping_list_item
     WHERE list_id = $1`,
    [listId]
  );

  const allChecked = completionCheck.rows[0].all_checked || false;

  // 3. Update shopping_list.is_complete based on that result
  await pool.query(
    `UPDATE shopping_list
     SET is_complete = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE list_id = $2`,
    [allChecked, listId]
  );

  // 4. Return the updated item
  return updatedItem;
}


// Add an item to a shopping list
async function createAndAddShoppingListItem(listId, productId, customProductId, text, quantity) {
  
    const result = await pool.query(
      `INSERT INTO shopping_list_item (list_id, product_id, text, quantity)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [listId, productId, text, quantity]
   );
  
  /*
  if(customProductId) {
    const result = await pool.query(
      `INSERT INTO shopping_list_item (list_id, custom_product_id, text, quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [listId, customProductId, text, quantity]
    );
  }*/
   
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
  createShoppingList,
  getAllShoppingLists,
  getShoppingList,
  deleteShoppingList,
  toggleItemChecked,
  createAndAddShoppingListItem,
  removeShoppingListItem,
};