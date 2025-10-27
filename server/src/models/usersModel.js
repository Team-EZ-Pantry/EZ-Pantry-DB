const db = require('../config/database'); // Assuming you have a database connection module

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Validate password strength 
function validatePasswordStrength(password) { // Simple example, can be enhanced. Probably should be in utils and called in AuthController too.
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  return true;
}

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

  // DEBUG: Log the query and parameters
    console.log('Query:', query);
    console.log('Parameters:', [name, email, userId]);

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

// Change user password
async function changePassword(userId, currentPassword, newPassword) {
  try {
    // Validate new password strength
    validatePasswordStrength(newPassword);

    // Verify current password
    const fetchQuery = 'SELECT password_hash FROM app_user WHERE user_id = $1';
    const userResult = await db.query(fetchQuery, [userId]);

    if (userResult.rows.length === 0) {
      return false; // User not found
    }

    const isPasswordValid = await verifyPassword(currentPassword, userResult.rows[0].password); // Assuming verifyPassword is a utility function
    if (!isPasswordValid) {
      return false; // Current password is incorrect
    }

    // Update to new password
    const hashedPassword = await hashPassword(newPassword); // Assuming hashPassword is a utility function
    const updateQuery = `
      UPDATE app_user
      SET password_hash = $1
      WHERE user_id = $2
    `;
    await db.query(updateQuery, [hashedPassword, userId]);
    return true;
  } catch (error) {

    console.error('Error changing password:', error);
    throw error;
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

// Utility functions for password hashing and verification
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyUserPassword(userId, password) {
  try {
    const query = 'SELECT password_hash FROM app_user WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return false; // User not found
    }
    
    return await verifyPassword(password, result.rows[0].password);
  } catch (error) {
    console.error('Error verifying user password:', error);
    throw error;
  }
}

module.exports = {
  getUserById,
  updateUserProfile,
  changePassword,
  deleteUser,
  verifyUserPassword,
};