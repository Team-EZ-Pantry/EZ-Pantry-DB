// *************************************
// *    Aunthentication Controllers    *
// *************************************

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { generateToken } = require('../utils/jwt');
const { validateEmail, validateUsername, validatePassword } = require('../utils/userValidator');

// *************************************
// *        Register New User          *
// *************************************
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, email, and password are required' 
      });
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ errors: emailValidation.errors });
    }

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      return res.status(400).json({ errors: usernameValidation.errors });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ errors: passwordValidation.errors });
    }

    // Check if user already exists
    const exists = await userModel.checkEmailExists(emailValidation.cleaned);
    if (exists) {
      return res.status(409).json({ 
        error: 'A user with this email address already exists' 
      });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in database
    const newUser = await userModel.createUser(usernameValidation.cleaned, emailValidation.cleaned, passwordHash);

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userId: newUser.user_id,
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

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return res.status(400).json({ errors: emailValidation.errors });
  }

  // Find user by email if it exists
  const user = await userModel.findUserByEmail(emailValidation.cleaned);
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
  const token = generateToken(user.user_id, user.email);

  // Send response
  res.json({
    message: 'Login successful',
    user: {
      userId: user.user_id,
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