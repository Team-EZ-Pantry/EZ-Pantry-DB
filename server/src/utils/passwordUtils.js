// ==================== utils/passwordUtils.js ====================
const bcrypt = require('bcrypt');

// Hash a password using bcrypt
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Verify a password against a hash
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Validate password strength
function validatePassword(password) {
  if (!password || password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
//   if (!/[A-Z]/.test(password)) {
//     return { isValid: false, message: 'Password must contain at least one uppercase letter' };
//   }
  
//   if (!/[a-z]/.test(password)) {
//     return { isValid: false, message: 'Password must contain at least one lowercase letter' };
//   }
  
//   if (!/[0-9]/.test(password)) {
//     return { isValid: false, message: 'Password must contain at least one number' };
//   }
  
//   if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
//     return { isValid: false, message: 'Password must contain at least one special character' };
//   }
  
  return { isValid: true, message: 'Password is valid' };
}

module.exports = {
  hashPassword,
  verifyPassword,
  validatePassword
};