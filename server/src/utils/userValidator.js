function validateUsername(username) {
  const errors = [];
  
  const trimmed = username.trim();
  if (trimmed.length === 0) {
    errors.push('Username cannot be empty or only spaces');
  }
  if (trimmed.length > 30) {
    errors.push('Username must be 30 characters or less');
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    errors.push('Username can only contain letters, numbers, underscores, or hyphens');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    cleaned: trimmed
  };
};

function validateEmail(email) {
  const errors = [];
  
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    errors.push('Invalid email format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    cleaned: trimmed.toLowerCase()
  };
}

function validatePassword(password){
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateUsername,
  validateEmail,
  validatePassword
};