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

async function getAllItems() {
  console.log('Connecting to DB:', process.env.DB_NAME);
  const result = await pool.query(
    'SELECT * FROM pantry',
    //[userId]
  );
  console.log('Query result:', result.rows);
  return result.rows;
}

module.exports = {
  getAllItems
};