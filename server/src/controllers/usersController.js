// *************************************
// *       User Profile Controllers    *
// *************************************

const usersModel = require('../models/usersModel');

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
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    const passwordChanged = await usersModel.changePassword(userId, currentPassword, newPassword);

    if (!passwordChanged) {
      return res.status(400).json({ error: 'Failed to change password. Check your current password.' });
    }

    res.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
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