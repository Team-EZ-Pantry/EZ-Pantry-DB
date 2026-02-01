// *************************************
// *      User-related functions       *
// *************************************

const pool = require('../config/database');

// Check if an email is already in user
async function checkEmailExists(email) {
    const result = await pool.query(
      'SELECT user_id FROM app_user WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    return result.rows.length > 0;
  }

// Create a new user
async function createUser(username, email, passwordHash) {
  const result = await pool.query(
    `INSERT INTO app_user (username, email, password_hash) 
     VALUES ($1, LOWER($2), $3) 
     RETURNING user_id, username, email, created_at`,
    [username, email, passwordHash]
  );
  return result.rows[0];
}

// Find User By ID           
async function findUserById(userId) {
  const result = await pool.query(
    'SELECT user_id, username, email, password_hash, created_at FROM app_user WHERE user_id = $1',
    [userId]
  );
  return result.rows[0]; // Returns undefined if not found
}


// Find user by email
async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT user_id, username, email, password_hash, created_at FROM app_user WHERE LOWER(email) = LOWER($1)',
    [email]
  );
  return result.rows[0]; // Returns undefined if not found
}

// Update username
async function updateUsername(userId, username) {
    const result = await pool.query(
      `UPDATE app_user
       SET username = $1
       WHERE user_id = $2
       RETURNING user_id, username, email`,
      [username, userId]
    );
    return result.rows[0];
}

// Update user password
async function updatePassword(userId, newPasswordHash) {
  const result = await pool.query(
    `UPDATE app_user
     SET password_hash = $1
     WHERE user_id = $2
     RETURNING user_id, username, email`,
    [newPasswordHash, userId]
  );
  return result.rows[0];
}

// Delete user from database
async function deleteUserById(userId) {
  const result = await pool.query(
    `DELETE FROM app_user
     WHERE user_id = $1`,
    [userId]
  );
  return result.rowCount;
}

// Get user theme preferences
async function getThemePreferences(userId) {
  const result = await pool.query(
    `SELECT theme_mode, accent_color FROM app_user WHERE user_id = $1`,
    [userId]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return {
    themeMode: result.rows[0].theme_mode,
    accentColor: result.rows[0].accent_color
  };
}

// Update user theme preferences
async function updateThemePreferences(userId, themeMode, accentColor) {
  const result = await pool.query(
    `UPDATE app_user
     SET theme_mode = $1, accent_color = $2
     WHERE user_id = $3
     RETURNING user_id, theme_mode, accent_color`,
    [themeMode, accentColor, userId]
  );
  if (result.rows.length === 0) {
    return null;
  }
  return {
    themeMode: result.rows[0].theme_mode,
    accentColor: result.rows[0].accent_color
  };
}

module.exports = {
  checkEmailExists,
  createUser,
  findUserById,
  findUserByEmail,
  updateUsername,
  updatePassword,
  deleteUserById,
  getThemePreferences,
  updateThemePreferences
};
