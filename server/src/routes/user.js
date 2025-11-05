const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// *************************************
// *          User Endpoints           *
// *************************************
router.get('/me', authenticateToken, userController.getMe);
router.patch('/username', authenticateToken, userController.updateUsername);
router.patch('/password', authenticateToken, userController.updatePassword);
router.delete('/me', authenticateToken, userController.deleteMe); 

module.exports = router;
