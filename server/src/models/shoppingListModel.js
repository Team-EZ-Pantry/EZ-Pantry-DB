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
async function getShoppingListsByUserId(userId) {
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
async function getShoppingListById(listId, userId) {
  const list = await pool.query(
    'SELECT * FROM shopping_list WHERE list_id = $1 AND user_id = $2',
    [listId, userId]
  );

  if (list.rows.length === 0) {
    return null;
  }

  const items = await pool.query(
    `SELECT
       sli.item_id,
       sli.product_id,
       sli.custom_product_id,
       sli.text,
       sli.quantity,
       sli.checked,
       sli.created_at,
       sli.updated_at,
       p.product_name,
       cp.product_name AS custom_product_name
     FROM shopping_list_item sli
     LEFT JOIN product p ON sli.product_id = p.product_id
     LEFT JOIN custom_product cp ON sli.custom_product_id = cp.custom_product_id
     WHERE sli.list_id = $1
     ORDER BY sli.created_at DESC`,
    [listId]
  );

  return {
    ...list.rows[0],
    shopping_list_items: items.rows
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
  // 1. Toggle the checked status and update item's updated_at
  const updatedItemResult = await pool.query(
    `UPDATE shopping_list_item
     SET checked = NOT COALESCE(checked, FALSE),
         updated_at = CURRENT_TIMESTAMP
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

  // 3. Update shopping_list.is_complete and updated_at
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

  // Update shopping list's updated_at
  await pool.query(
    'UPDATE shopping_list SET updated_at = CURRENT_TIMESTAMP WHERE list_id = $1',
    [listId]
  );

  return result.rows[0];
}

// Remove an item from a shopping list
async function removeShoppingListItem(listId, itemId) {
  const result = await pool.query(
    'DELETE FROM shopping_list_item WHERE item_id = $1 AND list_id = $2 RETURNING *',
    [itemId, listId]
  );

  if (result.rows.length > 0) {
    // Update shopping list's updated_at
    await pool.query(
      'UPDATE shopping_list SET updated_at = CURRENT_TIMESTAMP WHERE list_id = $1',
      [listId]
    );
  }

  return result.rows[0];
}

// Toggle all items in a shopping list (mark all complete or all incomplete)
// If any item is unchecked, marks all as checked. If all are checked, marks all as unchecked.
async function toggleAllItems(listId) {
  // 1. Check if all items are currently checked
  const statusCheck = await pool.query(
    `SELECT
       BOOL_AND(checked) AS all_checked,
       COUNT(*) AS item_count
     FROM shopping_list_item
     WHERE list_id = $1`,
    [listId]
  );

  const { all_checked, item_count } = statusCheck.rows[0];

  // If no items, nothing to toggle
  if (parseInt(item_count) === 0) {
    return { toggled: false, new_state: null, item_count: 0 };
  }

  // 2. Determine new state: if all checked, uncheck all; otherwise check all
  const newCheckedState = !all_checked;

  // 3. Update all items
  await pool.query(
    `UPDATE shopping_list_item
     SET checked = $1, updated_at = CURRENT_TIMESTAMP
     WHERE list_id = $2`,
    [newCheckedState, listId]
  );

  // 4. Update the shopping list's is_complete and updated_at
  await pool.query(
    `UPDATE shopping_list
     SET is_complete = $1, updated_at = CURRENT_TIMESTAMP
     WHERE list_id = $2`,
    [newCheckedState, listId]
  );

  return {
    toggled: true,
    new_state: newCheckedState ? 'all_checked' : 'all_unchecked',
    item_count: parseInt(item_count)
  };
}

module.exports = {
  createShoppingList,
  getShoppingListsByUserId,
  getShoppingListById,
  verifyShoppingListOwnership,
  deleteShoppingList,
  toggleItemChecked,
  toggleAllItems,
  createAndAddShoppingListItem,
  removeShoppingListItem,
};