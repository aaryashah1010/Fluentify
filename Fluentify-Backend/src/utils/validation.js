/**
 * Validation utilities for authentication
 */

// List of disposable/temporary email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'temp-mail.org', 'guerrillamail.com', '10minutemail.com',
  'throwaway.email', 'maildrop.cc', 'mailinator.com', 'trashmail.com',
  'yopmail.com', 'fakeinbox.com', 'getnada.com', 'temp-mail.io',
  'mohmal.com', 'sharklasers.com', 'guerrillamailblock.com', 'spam4.me',
  'grr.la', 'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.net',
  'guerrillamail.org', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
  'trbvm.com', 'tmails.net', 'tmpmail.net', 'tmpmail.org', 'emailondeck.com'
];

/**
 * Validate name - no special characters, no numbers, only letters and spaces
 */
export function validateName(name) {
  const errors = [];
  
  if (!name || !name.trim()) {
    errors.push('Name is required');
    return { isValid: false, errors };
  }

  const trimmedName = name.trim();

  // Check for minimum length
  if (trimmedName.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  // Check for maximum length
  if (trimmedName.length > 50) {
    errors.push('Name must not exceed 50 characters');
  }

  // Check for numbers
  if (/\d/.test(trimmedName)) {
    errors.push('Name cannot contain numbers');
  }

  // Check for special characters (allow only letters, spaces, hyphens, and apostrophes)
  if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
    errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
  }

  // Check for multiple consecutive spaces
  if (/\s{2,}/.test(trimmedName)) {
    errors.push('Name cannot contain multiple consecutive spaces');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate email - check format and block disposable emails
 */
export function validateEmail(email) {
  const errors = [];
  
  if (!email || !email.trim()) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }

  const trimmedEmail = email.trim().toLowerCase();

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    errors.push('Invalid email format');
    return { isValid: false, errors };
  }

  // Extract domain
  const domain = trimmedEmail.split('@')[1];

  // Check if it's a disposable email
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    errors.push('Disposable email addresses are not allowed. Please use a permanent email address');
  }

  // Additional checks for suspicious patterns
  if (domain.includes('temp') || domain.includes('fake') || domain.includes('trash')) {
    errors.push('Temporary email addresses are not allowed. Please use a permanent email address');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 * - Not same as email or name
 */
export function validatePassword(password, email = '', name = '') {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors, strength: 'weak' };
  }

  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)');
  }

  // Check if password is same as email (case insensitive)
  if (email && password.toLowerCase() === email.toLowerCase()) {
    errors.push('Password cannot be the same as your email');
  }

  // Password can contain name - restriction removed per user request
  // Users should be able to use their name in passwords if they want

  // Calculate password strength
  let strength = 'weak';
  if (errors.length === 0) {
    let score = 0;
    
    // Length bonus
    if (password.length >= 12) score += 2;
    else if (password.length >= 10) score += 1;
    
    // Complexity bonus
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    
    // Multiple character types
    const hasMultipleTypes = [
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    ].filter(Boolean).length;
    
    if (hasMultipleTypes >= 4) score += 1;
    
    if (score >= 7) strength = 'strong';
    else if (score >= 5) strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

/**
 * Generate strong password suggestions
 */
export function generatePasswordSuggestions(count = 3) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}';
  
  const suggestions = [];
  
  for (let i = 0; i < count; i++) {
    let password = '';
    
    // Ensure at least one of each required type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest with random characters (total length 12-16)
    const allChars = lowercase + uppercase + numbers + special;
    const remainingLength = 8 + Math.floor(Math.random() * 5); // 8-12 more characters
    
    for (let j = 0; j < remainingLength; j++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    suggestions.push(password);
  }
  
  return suggestions;
}

/**
 * Validate OTP code
 */
export function validateOTP(otp) {
  const errors = [];
  
  if (!otp) {
    errors.push('OTP is required');
    return { isValid: false, errors };
  }

  // OTP should be exactly 6 digits
  if (!/^\d{6}$/.test(otp)) {
    errors.push('OTP must be a 6-digit number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
