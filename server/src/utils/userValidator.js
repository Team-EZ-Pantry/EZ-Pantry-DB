const USERNAME_REGEX = /^[\p{L}\p{N} ._'’-]+$/u;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate username structure
function validateUsername(username) {
  const errors = [];
  
  const trimmed = username.trim();
  if (trimmed.length === 0) {
    errors.push('Username cannot be empty');
  }
  if (trimmed.length > 30) {
    errors.push('Username must be 30 characters or less');
  }

  // Allow Unicode letters, Unicode numbers, spaces, period, underscore, apostrophe, hyphen
  if (!USERNAME_REGEX.test(trimmed)) {
    errors.push(
      'Invalid characters'
    );
  }

  return {
    isValid: errors.length === 0,
    error: errors[0] || null,
    cleaned: trimmed
  };
};

// Validate email (email verification to be added later)
function validateEmail(email) {
  const errors = [];
  
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(trimmed)) {
    errors.push('Invalid email format');
  }
  
  return {
    isValid: errors.length === 0,
    error: errors[0] || null,
    cleaned: trimmed.toLowerCase()
  };
}

// Validate password structure
function validatePassword(password){
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be 6+ characters long');
  }
  
  return {
    isValid: errors.length === 0,
    error: errors[0] || null
  };
};

module.exports = {
  validateUsername,
  validateEmail,
  validatePassword
};