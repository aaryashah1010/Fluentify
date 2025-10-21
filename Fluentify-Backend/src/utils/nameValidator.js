/**
 * Name Validation Utility
 * Validates that names contain only letters and spaces (no numbers or special characters)
 */

/**
 * Validates name format - only letters and spaces allowed
 * @param {string} name - Name to validate
 * @returns {Object} Validation result with details
 */
export function validateName(name) {
  const errors = [];
  
  // Check if name is provided
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
    return {
      isValid: false,
      errors
    };
  }

  // Trim and check minimum length
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (trimmedName.length > 100) {
    errors.push('Name must not exceed 100 characters');
  }

  // Check for numbers
  if (/\d/.test(trimmedName)) {
    errors.push('Name cannot contain numbers');
  }

  // Check for special characters (allow only letters, spaces, hyphens, and apostrophes)
  // This allows names like "Mary-Jane" or "O'Connor"
  if (!/^[a-zA-Z\s'-]+$/.test(trimmedName)) {
    errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
  }

  // Check for multiple consecutive spaces
  if (/\s{2,}/.test(trimmedName)) {
    errors.push('Name cannot contain multiple consecutive spaces');
  }

  // Check if name starts or ends with space (after trim, this shouldn't happen, but double-check)
  if (trimmedName !== name) {
    errors.push('Name cannot start or end with spaces');
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    sanitizedName: isValid ? trimmedName : null
  };
}

/**
 * Sanitizes name by removing extra spaces and trimming
 * @param {string} name - Name to sanitize
 * @returns {string} Sanitized name
 */
export function sanitizeName(name) {
  if (!name) return '';
  
  return name
    .trim()
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
}

export default {
  validateName,
  sanitizeName
};
