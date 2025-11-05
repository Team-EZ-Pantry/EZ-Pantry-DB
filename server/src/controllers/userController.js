// *************************************
// *       User Profile Controllers    *
// *************************************

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { validateUsername, validatePassword } = require('../utils/userValidator');

// *************************************
// *     Get a user's information      *
// *************************************
async function getMe(req, res) {
  try {
    const userId = req.user.userId; 

    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      username: user.username,
      email: user.email,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
}

// **************************************
// *       Update a user's name         *
// **************************************
async function updateUsername(req, res) {
  try {
    const userId = req.user.userId;
    const { username } = req.body;

    // Validate input
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return res.status(400).json({ errors: usernameValidation.errors });
    }

    const updatedUser = await userModel.updateUsername(userId, usernameValidation.cleaned);
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user info
    res.json({
      username: updatedUser.username,
      email: updatedUser.email,
      createdAt: updatedUser.created_at
    });
  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({ error: 'Failed to update username' });
  }
}

// ************************************************
// * Change user password - old password required *
// ************************************************
async function updatePassword(req, res) {
  try {
    const userId = req.user.userId;
    const { password, newPassword } = req.body;

    // Validate input
    if (!password || !newPassword) {
      return res.status(400).json({
        error: 'Current and new password are required'
      });
    }

    // Check if new password is same as current
    if (password === newPassword) {
      return res.status(400).json({
        error: 'New password must be different from the old password'
      });
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ errors: passwordValidation.errors });
    }
    
    // Fetch user to get current password hash
    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidCurrentPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidCurrentPassword) {
      return res.status(401).json({ error: 'Current password incorrect' });
    }

    // Update password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const updated = await userModel.updatePassword(userId, newPasswordHash);

    if(!updated) {
      return res.status(500).json({error: 'Failed to update password'});
    }

    return res.status(200).json({message: 'Password updated successfully'});
  } catch (error) {
    console.error('Password update error:', error);
    return res.status(500).json({error: 'Failed to update password'});
  }
}

// *************************************
// *      Permanently delete user      *
// *************************************
async function deleteMe(req, res) {
  try {
    const userId = req.user.userId; 
    const { password } = req.body;
    
    // Make sure user exists
    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not Found' 
      });
    }

    // Password required for deletion
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Password is incorrect' 
      });
    }
    
    // Delete user from database
    const deletedUser = await userModel.deleteUserById(userId);

    return res.status(200).json({
      message: 'User deleted successfully',
      deletedUser: deletedUser
    });
    
  } catch (error) {
    console.error('User delete error:', error);
    return res.status(500).json({ error: 'An error occurred while deleting the user'});
  }
}

module.exports = {
  getMe,
  updateUsername,
  updatePassword,
  deleteMe
};