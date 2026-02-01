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
      user: {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
      }
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

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Validate new username structure
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return res.status(400).json({ error: usernameValidation.error });
    }

    // Fetch current username to compare
    const currentUser = await userModel.findUserById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent same username update
    if (currentUser.username === usernameValidation.cleaned) {
      return res.status(400).json({ error: 'New username must be different' });
    }

    const updatedUser = await userModel.updateUsername(userId, usernameValidation.cleaned);
    res.json({user: updatedUser});
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

    // Validate new password structure
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ error: passwordValidation.error });
    }
    
    // Fetch user to get current password hash
    const user = await userModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidCurrentPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidCurrentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    const updatedUser = await userModel.updatePassword(userId, newPasswordHash);

    if(!updatedUser) {
      return res.status(500).json({error: 'Failed to update password'});
    }

    res.json({
      message: 'Password updated successfully',
      user: updatedUser
    });
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

    // Delete user from database and check if actually deleted
    const deletedCount = await userModel.deleteUserById(userId);
    if (deletedCount === 0) {
      return res.status(404).json({
        error: 'User not found or already deleted'
      });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('User delete error:', error);
    return res.status(500).json({ error: 'An error occurred while deleting the user'});
  }
}

// *************************************
// *    Get user theme preferences     *
// *************************************
async function getThemePreferences(req, res) {
  try {
    const userId = req.user.userId;

    const preferences = await userModel.getThemePreferences(userId);
    if (!preferences) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ preferences });
  } catch (error) {
    console.error('Get theme preferences error:', error);
    res.status(500).json({ error: 'Failed to retrieve theme preferences' });
  }
}

// *************************************
// *   Update user theme preferences   *
// *************************************
async function updateThemePreferences(req, res) {
  try {
    const userId = req.user.userId;
    const { themeMode, accentColor } = req.body;

    // Validate themeMode
    const validThemeModes = ['light', 'dark'];
    if (themeMode && !validThemeModes.includes(themeMode)) {
      return res.status(400).json({
        error: 'Invalid theme mode. Must be one of: light, dark'
      });
    }

    // Validate accentColor (expecting integer color value)
    if (accentColor !== undefined && typeof accentColor !== 'number') {
      return res.status(400).json({
        error: 'Invalid accent color. Must be an integer color value'
      });
    }

    const updatedPreferences = await userModel.updateThemePreferences(
      userId,
      themeMode,
      accentColor
    );

    if (!updatedPreferences) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ preferences: updatedPreferences });
  } catch (error) {
    console.error('Update theme preferences error:', error);
    res.status(500).json({ error: 'Failed to update theme preferences' });
  }
}

module.exports = {
  getMe,
  updateUsername,
  updatePassword,
  deleteMe,
  getThemePreferences,
  updateThemePreferences
};