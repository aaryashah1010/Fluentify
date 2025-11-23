import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  loginUser, 
  signupUser, 
  verifySignupOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  resendOTP,
  getPasswordSuggestions,
  getUserProfile,
  updateUserProfile, 
  logoutUser 
} from '../api/auth';

/**
 * Hook for login mutation
 * @returns {Object} mutation object with mutate, isLoading, error, etc.
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Store token
      if (data.data?.token) {
        localStorage.setItem('jwt', data.data.token);
      }
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Hook for signup mutation - Step 1: Send OTP
 * @returns {Object} mutation object with mutate, isLoading, error, etc.
 */
export const useSignup = () => {
  return useMutation({
    mutationFn: signupUser,
  });
};

/**
 * Hook for verifying signup OTP - Step 2: Complete signup
 * @returns {Object} mutation object with mutate, isLoading, error, etc.
 */
export const useVerifySignupOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifySignupOTP,
    onSuccess: (data) => {
      // Store token
      if (data.data?.token) {
        localStorage.setItem('jwt', data.data.token);
      }
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

/**
 * Hook to get current user profile
 * @returns {Object} query object with data, isLoading, error, etc.
 */
export const useUserProfile = () => {
  const token = localStorage.getItem('jwt');

  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => getUserProfile(token),
    enabled: !!token, // Only run if token exists
    retry: false,
    staleTime: 30 * 1000, // 30 seconds - shorter to reflect admin changes faster
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true, // Refetch when component mounts
  });
};

/**
 * Hook for logout
 * @returns {Function} logout function
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    logoutUser();
    queryClient.clear(); // Clear all cached data
    navigate('/login');
  };
};

/**
 * Hook to check if user is authenticated
 * @returns {boolean} true if user has valid token
 */
export const useIsAuthenticated = () => {
  const token = localStorage.getItem('jwt');
  
  if (!token) return false;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    const payload = JSON.parse(atob(padded));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/**
 * Hook for forgot password mutation
 * @returns {Object} mutation object
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

/**
 * Hook for verifying reset OTP
 * @returns {Object} mutation object
 */
export const useVerifyResetOTP = () => {
  return useMutation({
    mutationFn: verifyResetOTP,
  });
};

/**
 * Hook for reset password mutation
 * @returns {Object} mutation object
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

/**
 * Hook for resending OTP
 * @returns {Object} mutation object
 */
export const useResendOTP = () => {
  return useMutation({
    mutationFn: resendOTP,
  });
};

/**
 * Hook to get password suggestions
 * @returns {Object} query object
 */
export const usePasswordSuggestions = () => {
  return useQuery({
    queryKey: ['password-suggestions'],
    queryFn: getPasswordSuggestions,
    enabled: false, // Only fetch when explicitly called
    staleTime: Infinity, // Suggestions don't change
  });
};

/**
 * Hook for updating user profile
 * @returns {Object} mutation object
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('jwt');

  return useMutation({
    mutationFn: (updates) => updateUserProfile(token, updates),
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });
};
