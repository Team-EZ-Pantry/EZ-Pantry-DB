const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticateToken } = require('../middleware/auth');

// *************************************
// *         Profile Endpoints          *
// *************************************
// Profile management
router.get('/profile', authenticateToken, usersController.getUserProfile);
router.put('/profile', authenticateToken, usersController.updateUserProfile);
router.put('/password', authenticateToken, usersController.changeUserPassword);
router.delete('/account', authenticateToken, usersController.deleteUserProfile); 

// User-specific pantry retrieval
//router.get('/:userId/pantries', authenticateToken, usersController.getUserPantries);    


module.exports = router;