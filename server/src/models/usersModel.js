const db = require('../config/database'); 
const bcrypt = require('bcrypt'); 

// Get user by ID
async function getUserById(userId) {
  try {
    const query = 'SELECT user_id, username, email FROM app_user WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

// Update user profile
async function updateUserProfile(userId, profileData) {
  try {
    const { name, email } = profileData;
    const query = `
      UPDATE app_user
      SET username = $1, email = $2
      WHERE user_id = $3
      RETURNING user_id, username, email
    `;

    const result = await db.query(query, [name, email, userId]);
    return result.rows[0] || null;
  } catch (error) {
    // Check for unique email error
    if (error.code === '23505') {
      throw new Error('Email already in use');
    }
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Get user by user_id for password change
 async function getUserByIdPassword(userId) {
    try {
      const query = 'SELECT user_id, username, email, password_hash, created_at FROM app_user WHERE user_id = $1';
      const result = await db.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Update user password
  async function updateUserPassword(userId, newPasswordHash) {
    try {
      const query = 'UPDATE app_user SET password_hash = $1 WHERE user_id = $2';
      const result = await db.query(query, [newPasswordHash, userId]);
      return result.rowCount > 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

// Delete user
async function deleteUser(userId) {
  try {
    const query = 'DELETE FROM app_user WHERE user_id = $1 RETURNING user_id';
    const result = await db.query(query, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

module.exports = {
  getUserById,
  updateUserProfile,
  getUserByIdPassword,
  updateUserPassword,
  deleteUser,
};