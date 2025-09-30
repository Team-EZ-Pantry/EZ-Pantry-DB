const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const MAX_USERNAME_LENGTH = 30;
const MIN_PASSWORD_LENGTH = 6;

// Initialize the router with database pool
let pool;
function initializeAuthRoutes(dbPool) {
  router.pool = dbPool;
  return router;
}

// This router does everything for now for simplicity's sake, but this logic will be put into controllers and models soon

// *************************************
// *     Authentication Endpoints      *
// *************************************
router.post('/register', async (req, res) => {
  try {
    const pool = router.pool;

    const { username, email, password } = req.body;

    // Ensure input
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

    // Password strength check (minimum 6 characters)
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const userCheck = await pool.query(
      'SELECT id FROM app_user WHERE email = $1',
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(409).json({ 
        error: 'User with this email already exists' // I'm thinking we should allow duplicate usernames for user convenience
      });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user into database
    const result = await pool.query(
      `INSERT INTO app_user (username, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, username, email, created_at`,
      [username, email, passwordHash]
    );

    const newUser = result.rows[0];

    // Send success response
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
});

module.exports = initializeAuthRoutes;
