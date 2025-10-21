/**
 * Password Validation Utility
 * Validates password strength and generates secure password suggestions
 */

/**
 * Validates password strength according to security requirements
 * @param {string} password - The password to validate
 * @param {string} email - User's email to check against
 * @param {string} username - User's username/name to check against
 * @returns {Object} Validation result with success status, errors, and suggestions
 */
export function validatePassword(password, email = '', username = '') {
  const errors = [];
  const requirements = {
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    notMatchingEmail: true,
    notMatchingUsername: true
  };

  // Check minimum length
  if (password.length >= 8) {
    requirements.minLength = true;
  } else {
    errors.push('Password must be at least 8 characters long');
  }

  // Check for uppercase letter
  if (/[A-Z]/.test(password)) {
    requirements.hasUppercase = true;
  } else {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase letter
  if (/[a-z]/.test(password)) {
    requirements.hasLowercase = true;
  } else {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for number
  if (/[0-9]/.test(password)) {
    requirements.hasNumber = true;
  } else {
    errors.push('Password must contain at least one number');
  }

  // Check for special character
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    requirements.hasSpecialChar = true;
  } else {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  }

  // Check if password matches email (case-insensitive)
  if (email && password.toLowerCase() === email.toLowerCase()) {
    requirements.notMatchingEmail = false;
    errors.push('Password cannot be the same as your email');
  }

  // Check if password matches username (case-insensitive)
  if (username && password.toLowerCase() === username.toLowerCase()) {
    requirements.notMatchingUsername = false;
    errors.push('Password cannot be the same as your username');
  }

  // Check if password contains email or username
  if (email && password.toLowerCase().includes(email.toLowerCase())) {
    requirements.notMatchingEmail = false;
    errors.push('Password cannot contain your email');
  }

  if (username && password.toLowerCase().includes(username.toLowerCase())) {
    requirements.notMatchingUsername = false;
    errors.push('Password cannot contain your username');
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    requirements,
    suggestions: isValid ? [] : generatePasswordSuggestions()
  };
}

/**
 * Generates strong password suggestions
 * @param {number} count - Number of suggestions to generate (default: 3)
 * @returns {Array<string>} Array of suggested strong passwords
 */
export function generatePasswordSuggestions(count = 3) {
  const suggestions = [];
  
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*';
  
  // Predefined word lists for memorable passwords
  const adjectives = ['Swift', 'Brave', 'Bright', 'Quick', 'Smart', 'Bold', 'Wise', 'Strong'];
  const nouns = ['Tiger', 'Eagle', 'Phoenix', 'Dragon', 'Falcon', 'Wolf', 'Lion', 'Hawk'];
  
  for (let i = 0; i < count; i++) {
    let password = '';
    
    // Strategy 1: Adjective + Noun + Number + Special
    if (i === 0) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const num = Math.floor(Math.random() * 100);
      const special = specialChars[Math.floor(Math.random() * specialChars.length)];
      password = `${adj}${noun}${num}${special}`;
    }
    // Strategy 2: Random mix with pattern
    else if (i === 1) {
      const randomUpper = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
      const randomWord = lowercaseChars.split('').sort(() => Math.random() - 0.5).slice(0, 5).join('');
      const randomNum = Math.floor(Math.random() * 1000);
      const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];
      password = `${randomUpper}${randomWord}${randomNum}${randomSpecial}`;
    }
    // Strategy 3: Another memorable pattern
    else {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const num = Math.floor(Math.random() * 1000);
      const special1 = specialChars[Math.floor(Math.random() * specialChars.length)];
      const special2 = specialChars[Math.floor(Math.random() * specialChars.length)];
      password = `${special1}${adj}${num}${special2}`;
    }
    
    suggestions.push(password);
  }
  
  return suggestions;
}

/**
 * Calculates password strength score (0-100)
 * @param {string} password - The password to evaluate
 * @returns {Object} Strength score and level
 */
export function calculatePasswordStrength(password) {
  let score = 0;
  
  // Length score (max 30 points)
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  
  // Character variety (max 40 points)
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
  
  // Complexity bonus (max 30 points)
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 8) score += 10;
  if (uniqueChars >= 12) score += 10;
  if (uniqueChars >= 16) score += 10;
  
  // Determine strength level
  let level = 'weak';
  if (score >= 70) level = 'strong';
  else if (score >= 50) level = 'medium';
  
  return {
    score,
    level,
    percentage: score
  };
}

/**
 * Validates that password and confirm password match
 * @param {string} password - The password
 * @param {string} confirmPassword - The confirmation password
 * @returns {Object} Validation result
 */
export function validatePasswordMatch(password, confirmPassword) {
  const errors = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export default {
  validatePassword,
  validatePasswordMatch,
  generatePasswordSuggestions,
  calculatePasswordStrength
};
