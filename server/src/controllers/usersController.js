// *************************************
// *       User Profile Controllers    *
// *************************************

const usersModel = require('../models/usersModel');
const { hashPassword, verifyPassword, validatePassword } = require('../utils/passwordUtils');

// Get user profile
async function getUserProfile(req, res) {
  try {
    const userId = req.user.userId; 
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
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
  const userId = req.user.userId; // Get from authenticated token
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
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

    // Get user password hash from database
    const passwordHash = await usersModel.getUserPasswordHash(userId);
    if (!passwordHash) {
      return res.status(401).json({
        error: 'Invalid password'
      });
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, passwordHash);
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
    
    // Validate user ID format
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({
        error: 'User ID must be a valid positive number'
      });
    }
    
    // Step 1: Validate confirmation flag
    if (confirmDelete !== true) {
      return res.status(400).json({
        error: 'Account deletion must be confirmed. Set confirmDelete to true'
      });
    }
    
    // Step 2: Validate password is provided
    if (!password) {
      return res.status(400).json({
        error: 'Password confirmation is required to delete your account'
      });
    }
    
    // Step 3: Verify the user exists
    const userExists = await usersModel.verifyUserExists(userId);
    if (!userExists) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Step 4: Verify the user ID matches the authenticated user 
    if (req.user && req.user.userId !== userId) {
      return res.status(403).json({
        error: 'You can only delete your own account'
      });
    }
    
    // Step 5: Verify the password is correct
    const passwordHash = await usersModel.getUserPasswordHash(userId);
    if (!passwordHash) {
      return res.status(401).json({
        error: 'Invalid password'
      });
    }
    
    const passwordValid = await verifyPassword(password, passwordHash);
    if (!passwordValid) {
      return res.status(401).json({
        error: 'Invalid password'
      });
    }

    // Step 6: All checks passed - delete the user
    const result = await usersModel.deleteUserById(userId);
    
    if (!result.success) {
      return res.status(500).json({
        error: result.message
      });
    }
    
    return res.status(200).json({
      message: 'User deleted successfully',
      deletedUser: result.deletedUser
    });
    
  } catch (error) {
    console.error('Error in deleteUserProfile:', error);
    
    // Handle specific database errors
    if (error.code === '23503') {
      return res.status(409).json({
        error: 'Cannot delete user due to existing related records'
      });
    }
    
    return res.status(500).json({
      error: 'An error occurred while deleting the user'
    });
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUserProfile,
};