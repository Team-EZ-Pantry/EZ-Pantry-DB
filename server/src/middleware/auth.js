const { verifyToken } = require('../utils/jwt');

// *************************************
// *         Authenticate JWT          *
// *************************************
/*
 * Authentication Middleware
 * 
 * This middleware protects routes that require a logged-in user.
 * It runs before the controller and checks if the request has a valid JWT token.
 * 
 * Usage in routes:
 * router.get('/protected-route', authenticateToken, controller.someFunction);
 *      
 * 1. Extract token from Authorization header (format: "Bearer <token>")
 * 2. Verify token is valid and not expired
 * 3. If valid: add user info to req.user and call next()
 * 4. If invalid: return error and DON'T call next() (controller never runs)
 */
function authenticateToken(req, res, next) {
  try {
    // Step 1: Get the Authorization header
    // Format: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = req.headers['authorization'];

    // Step 2: Extract the token
    // If header exists, split by space and get the second part (after "Bearer")
    const token = authHeader && authHeader.split(' ')[1];

    // Step 3: Check if token exists
    if (!token) {
      // No token provided
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    // Step 4: Verify the token
    // This calls verifyToken() from utils/jwt.js
    // If token is invalid or expired, this throws an error
    const decoded = verifyToken(token);

    // Step 5: Token is valid, add user info to request object
    // decoded contains: { user_id, email, iat, exp }
    req.user = decoded;

    // Step 6: Call next() to continue to the next middleware/controller
    // Without this, the request stops here
    next();

  } catch (err) {
    return res.status(403).json({
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
      details: err.message
    });
  }
}

module.exports = {
  authenticateToken
};