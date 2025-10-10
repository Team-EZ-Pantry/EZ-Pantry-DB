const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// *************************************
// *     Authentication Endpoints      *
// *************************************
router.post('/register', authController.register);
router.post('/login', authController.login);

// PROTECTED route - requires valid token
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;