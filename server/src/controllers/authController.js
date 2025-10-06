// *************************************
// *    Aunthentication Controllers    *
// *************************************
// Register
// Login

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { generateToken } = require('../utils/jwt');

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

// *************************************
// *            User Login             *
// *************************************
// 1. User sends email + password
// 2. We find user in database by email
// 3. We compare the password they sent with the hashed password in DB
// 4. If match, generate a JWT token and send it back
// 5. Frontend stores this token and sends it with future requests
async function login(req, res) {
 try {
   const { email, password } = req.body;

   // Validate input
   if (!email || !password) {
     return res.status(400).json({ 
       error: 'Email and password are required' 
     });
   }

   // Find user by email (MODEL CALL)
   const user = await userModel.findUserByEmail(email);
   
   // If user doesn't exist, return error
   // We say "Invalid email or password", not "email doesn't exist"
   // This prevents attackers from knowing which emails are registered
   if (!user) {
     return res.status(401).json({ 
       error: 'Invalid email or password' 
     });
   }

   // Compare password with stored hash
   const isValidPassword = await bcrypt.compare(password, user.password_hash);
   
   if (!isValidPassword) {
     return res.status(401).json({ 
       error: 'Invalid email or password' 
     });
   }

   // Password is correct: Generate JWT token
   const token = generateToken(user.id, user.email);

   // Send response
   res.json({
     message: 'Login successful',
     user: {
       id: user.id,
       username: user.username,
       email: user.email,
       createdAt: user.created_at
     },
     token  // JWT for future requests
   });

 } catch (err) {
   console.error('Login error:', err);
   res.status(500).json({ 
     error: 'An error occurred during login' 
   });
 }
}

module.exports = {
  register,
  login
};