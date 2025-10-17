const pool = require('../config/database');

// *************************************
// *      User-related functions       *
// *************************************
// checkEmailExists(email) 
// checkUsernameExists(username)
// createUser(username, email, passwordHash)
// findUserByEmail(email)

// *************************************
// *    Check if user email exists     *
// *************************************
async function checkEmailExists(email) {
    const result = await pool.query(
      'SELECT user_id FROM app_user WHERE email = $1',
      [email]
    );
    return result.rows.length > 0;
  }

// *************************************
// *     Check if username exists      *
// *************************************
async function checkUsernameExists(username) {
const result = await pool.query(
    'SELECT user_id FROM app_user WHERE username = $1', 
    [username]
);
return result.rows.length > 0;
}

// *************************************
// *           Create User             *
// *************************************
async function createUser(username, email, passwordHash) {
  const result = await pool.query(
    `INSERT INTO app_user (username, email, password_hash) 
     VALUES ($1, $2, $3) 
     RETURNING user_id, username, email, created_at`,
    [username, email, passwordHash]
  );
  return result.rows[0];
}

// *************************************
// *         Find User By ID           *
// *************************************
async function findUserById(userId) {
  const result = await pool.query(
    'SELECT user_id, username, email, password_hash, created_at FROM app_user WHERE user_id = $1',
    [userId]
  );
  return result.rows[0]; // Returns undefined if not found
}


// *************************************
// *        Find User By Email         *
// *************************************
async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT user_id, username, email, password_hash, created_at FROM app_user WHERE email = $1',
    [email]
  );
  return result.rows[0]; // Returns undefined if not found
}


module.exports = {
  checkEmailExists,
  checkUsernameExists,
  createUser,
  findUserById,
  findUserByEmail
};
