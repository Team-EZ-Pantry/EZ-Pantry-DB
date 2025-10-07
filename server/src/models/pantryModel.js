// *************************************
// *      User-related functions       *
// *************************************
// get user's pantry items
// add item to user's pantry
// remove item from user's pantry
// update item in user's pantry

const pantryController = require('../controllers/pantryController');
const pool = require('../config/database');

const token = pantryController.token; // user token

async function getAllItems(userToken) {
  const result = await pool.query(
    'SELECT * FROM pantry_items WHERE user_id = $1',
    [userId]
  );
  return result.rows;
}
