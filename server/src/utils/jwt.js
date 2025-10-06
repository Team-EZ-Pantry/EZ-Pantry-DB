const jwt = require('jsonwebtoken');

function generateToken(userId, email) {
    return jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }        
    );
  }
  
  function verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
  
  module.exports = {
    generateToken,
    verifyToken
  };