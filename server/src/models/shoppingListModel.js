// *************************************
// *      Shopping list Functions      *
// *************************************

const pool = require('../config/database');

// Create a new shopping list for a user
async function createShoppingList(userId, listName) {
   const result = await pool.query(
      'INSERT INTO shopping_list (user_id, list_name) VALUES ($1, $2) RETURNING *',
      [userId, listName]
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

// Verify shopping list ownership
async function verifyShoppingListOwnership(listId, userId) {
  const result = await pool.query(
    'SELECT list_id FROM shopping_list WHERE list_id = $1 AND user_id = $2',
    [listId, userId]
  );
  return result.rows.length > 0;
}

// Get a specific shopping list for a user
async function getShoppingList(listId, userId) {
  // Verify shopping list belongs to user
  const list = await pool.query(
    'SELECT * FROM shopping_list WHERE list_id = $1 AND user_id = $2',
    [listId, userId]
  );

  if (list.rows.length === 0) {
    return null;
  }

  const result = await pool.query(
    `SELECT
       shopping_list.list_id,
       shopping_list.list_name,
       shopping_list.is_complete,
       shopping_list.created_at,
       shopping_list.updated_at,
       shopping_list_item.item_id,
       shopping_list_item.product_id,
       shopping_list_item.custom_product_id,
       shopping_list_item.text,
       shopping_list_item.quantity,
       shopping_list_item.checked,
       shopping_list_item.created_at AS item_created_at,
       shopping_list_item.updated_at AS item_updated_at,
       product.product_name,
       custom_product.product_name AS custom_product_name
     FROM shopping_list
     LEFT JOIN shopping_list_item ON shopping_list.list_id = shopping_list_item.list_id
     LEFT JOIN product ON shopping_list_item.product_id = product.product_id
     LEFT JOIN custom_product ON shopping_list_item.custom_product_id = custom_product.custom_product_id
     WHERE shopping_list.list_id = $1
     ORDER BY shopping_list_item.created_at DESC`,
    [listId]
  );

  
  const firstRow = result.rows[0];
  return {
    list_id: firstRow.list_id,
    list_name: firstRow.list_name,
    is_complete: firstRow.is_complete,
    created_at: firstRow.created_at,
    updated_at: firstRow.updated_at,
    shopping_list_items: result.rows.map(row => ({
        item_id: row.item_id,
        product_id: row.product_id,
        custom_product_id: row.custom_product_id,
        text: row.text,
        quantity: row.quantity,
        checked: row.checked,
        created_at: row.item_created_at,
        updated_at: row.item_updated_at,
        product_name: row.product_name,
        custom_product_name: row.custom_product_name
      }))
  };
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
    `INSERT INTO shopping_list_item (list_id, product_id, custom_product_id, text, quantity)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
    [listId, productId, customProductId, text, quantity]
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
  createShoppingList,
  getAllShoppingLists,
  getShoppingList,
  verifyShoppingListOwnership,
  deleteShoppingList,
  toggleItemChecked,
  createAndAddShoppingListItem,
  removeShoppingListItem,
};