// @ts-nocheck
import { API_BASE_URL, handleResponse } from './apiHelpers';

/**
 * Auth API Client
 * Clean API functions for authentication
 */

/**
 * Login user
 * @param {Object} credentials
 * @param {string} credentials.role - 'learner' or 'admin'
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{success: boolean, data: {token: string, user: object}}>}
 */
export const loginUser = async ({ role, email, password }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/${role}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  return handleResponse(response);
};

/**
 * Sign up new user - Step 1: Send OTP
 * @param {Object} credentials
 * @param {string} credentials.role - 'learner' or 'admin'
 * @param {string} credentials.name
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{success: boolean, data: {email: string, message: string}}>}
 */
export const signupUser = async ({ role, name, email, password }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup/${role}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  
  return handleResponse(response);
};

/**
 * Verify OTP and complete signup - Step 2
 * @param {Object} credentials
 * @param {string} credentials.role - 'learner' or 'admin'
 * @param {string} credentials.name
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @param {string} credentials.otp
 * @returns {Promise<{success: boolean, data: {token: string, user: object}}>}
 */
export const verifySignupOTP = async ({ role, name, email, password, otp }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup/${role}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, otp }),
  });
  
  return handleResponse(response);
};

/**
 * Forgot password - Send OTP
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.role
 * @returns {Promise<{success: boolean, data: {email: string, message: string}}>}
 */
export const forgotPassword = async ({ email, role }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, role }),
  });
  
  return handleResponse(response);
};

/**
 * Verify reset OTP
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.otp
 * @param {string} data.role
 * @returns {Promise<{success: boolean, data: {email: string, verified: boolean}}>}
 */
export const verifyResetOTP = async ({ email, otp, role }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-reset-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, role }),
  });
  
  return handleResponse(response);
};

/**
 * Reset password
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.otp
 * @param {string} data.newPassword
 * @param {string} data.confirmPassword
 * @param {string} data.role
 * @returns {Promise<{success: boolean, data: {message: string}}>}
 */
export const resetPassword = async ({ email, otp, newPassword, confirmPassword, role }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword, confirmPassword, role }),
  });
  
  return handleResponse(response);
};

/**
 * Resend OTP
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.otpType - 'signup' or 'password_reset'
 * @param {string} data.role
 * @param {string} data.name
 * @returns {Promise<{success: boolean, data: {message: string}}>}
 */
export const resendOTP = async ({ email, otpType, role, name }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otpType, role, name }),
  });
  
  return handleResponse(response);
};

/**
 * Get password suggestions
 * @returns {Promise<{success: boolean, data: {suggestions: string[]}}>}
 */
export const getPasswordSuggestions = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/password-suggestions`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  return handleResponse(response);
};

/**
 * Get current user profile
 * @param {string} token - JWT token
 * @returns {Promise<{success: boolean, data: {user: object}}>}
 */
export const getUserProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  
  return handleResponse(response);
};

/**
 * Update current user profile
 * @param {string} token - JWT token
 * @param {Object} updates - Profile updates
 * @param {string} updates.name - Updated name
 * @param {string} updates.contest_name - Contest display name (learners only)
 * @returns {Promise<{success: boolean, data: {user: object}}>}
 */
export const updateUserProfile = async (token, updates) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates),
  });
  
  return handleResponse(response);
};

/**
 * Logout user (client-side)
 */
export const logoutUser = () => {
  localStorage.removeItem('jwt');
};
