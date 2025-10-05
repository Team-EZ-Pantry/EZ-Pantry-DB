// *************************************
// *    Aunthentication Controllers    *
// *************************************
// Register
// Login

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// *************************************
// *        Register New User          *
// *************************************
const MAX_USERNAME_LENGTH = 30;
const MIN_PASSWORD_LENGTH = 6;
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, email, and password are required' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Trim and validate username
    const trimmedUsername = username.trim();
    if (trimmedUsername.length === 0) {
        return res.status(400).json({ 
        error: 'Username cannot contain only spaces' 
        });
    }

    // Username length validation
    if (username.length > MAX_USERNAME_LENGTH) {
        return res.status(400).json({ 
        error: 'Username may not be longer than 30 characters' 
        });
    }

    // Password strength check
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists (MODEL CALL)
    const exists = await userModel.checkEmailExists(email);
    if (exists) {
      return res.status(409).json({ 
        error: 'A user with this email address already exists' 
      });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in database (MODEL CALL)
    const newUser = await userModel.createUser(username, email, passwordHash);

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.created_at
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      error: 'An error occurred during registration' 
    });
  }
}

module.exports = {
  register
};