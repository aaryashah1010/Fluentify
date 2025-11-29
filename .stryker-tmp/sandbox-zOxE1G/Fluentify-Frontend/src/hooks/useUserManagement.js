// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, searchUsers, getUserDetails, updateUser, deleteUser } from '../api/admin';

/**
 * Hook for fetching paginated user list
 */
export const useUsers = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => getUsers(page, limit),
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook for searching users
 */
export const useSearchUsers = (query) => {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => searchUsers(query),
    enabled: !!query && query.length > 0,
    staleTime: 10000,
  });
};

/**
 * Hook for fetching user details with progress
 */
export const useUserDetails = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserDetails(userId),
    enabled: !!userId,
    staleTime: 30000,
  });
};

/**
 * Hook for updating user profile
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }) => updateUser(userId, userData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user details
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      // Invalidate user list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

/**
 * Hook for deleting a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      // Invalidate user list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
