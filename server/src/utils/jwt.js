const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(user_id, email) {
    return jwt.sign(
      { user_id, email },
      JWT_SECRET,
      { expiresIn: '30d' }        
    );
  }
  
  function verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
  
  module.exports = {
    generateToken,
    verifyToken
  };