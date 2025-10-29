// *************************************
// *       User Profile Controllers    *
// *************************************

const usersModel = require('../models/usersModel');
const { hashPassword, verifyPassword, validatePassword } = require('../utils/passwordUtils');

// Get user profile
async function getUserProfile(req, res) {
  try {
    const userId = req.user.userId; // From authenticated token
    const userProfile = await usersModel.getUserById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User profile retrieved successfully',
      profile: userProfile,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
}

// Update user profile
async function updateUserProfile(req, res) {
  try {
    const userId = req.user.userId;
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ error: 'UserName and email are required' });
    }

    const updatedProfile = await usersModel.updateUserProfile(userId, { name, email });

    if (!updatedProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('Update user profile error:', error);

    // Handle email already in use
    if (error.message === 'Email already in use') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: 'Failed to update user profile' });
  }
}

// Change user password
async function changeUserPassword(req, res) {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    // Validate input
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'User ID, current password, and new password are required'
      });
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // Get user from database
    const user = await usersModel.getUserByIdPassword(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password in database
    const updateSuccess = await usersModel.updateUserPassword(userId, newPasswordHash);
    if (!updateSuccess) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update password'
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while changing password'
    });
  }
}

// Delete user profile
async function deleteUserProfile(req, res) {
  try {
    const userId = req.user.userId;
    const { password, confirmDelete } = req.body;

    // Validate confirmation flag
    if (confirmDelete !== true) {
      return res.status(400).json({ 
        error: 'Account deletion must be confirmed. Set confirmDelete to true.' 
      });
    }

    // Validate password confirmation
    if (!password) {
      return res.status(400).json({ 
        error: 'Password confirmation is required to delete your account' 
      });
    }

    // Verify password before deletion
    const isPasswordValid = await usersModel.verifyUserPassword(userId, password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid password. Account deletion cancelled.' 
      });
    }

    // Proceed with deletion
    const deletedUser = await usersModel.deleteUser(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User account deleted successfully',
    });
  } catch (error) {
    console.error('Delete user profile error:', error);
    res.status(500).json({ error: 'Failed to delete user account' });
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUserProfile,
};