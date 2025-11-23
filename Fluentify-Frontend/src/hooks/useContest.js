import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  apiAdminCreateContest,
  apiAdminUpdateContest,
  apiAdminAddQuestion,
  apiAdminPublishContest,
  apiAdminGetContests,
  apiAdminGetContestDetails,
  apiAdminDeleteContest,
  apiGetAvailableContests,
  apiGetContestDetails,
  apiSubmitContest,
  apiGetLeaderboard,
  apiGetUserContestHistory,
  apiGetUserContestResult
} from '../api/contest';

/**
 * Hook to get all contests (Admin view)
 * @returns {Object} query object with data, isLoading, error, etc.
 */
export const useAdminContests = () => {
  return useQuery({
    queryKey: ['admin-contests'],
    queryFn: apiAdminGetContests,
    select: (response) => response.data,
  });
};

/**
 * Hook to get contest details (Admin view)
 * @param {number} contestId
 * @returns {Object} query object
 */
export const useAdminContestDetails = (contestId) => {
  return useQuery({
    queryKey: ['admin-contest', contestId],
    queryFn: () => apiAdminGetContestDetails(contestId),
    enabled: !!contestId,
    select: (response) => response.data,
  });
};

/**
 * Hook to create a new contest (Admin)
 * @returns {Object} mutation object
 */
export const useCreateContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiAdminCreateContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
    },
  });
};

/**
 * Hook to update contest details (Admin)
 * @returns {Object} mutation object
 */
export const useUpdateContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contestId, data }) => apiAdminUpdateContest(contestId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-contest', variables.contestId] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
    },
  });
};

/**
 * Hook to add a question to a contest (Admin)
 * @returns {Object} mutation object
 */
export const useAddQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contestId, data }) => apiAdminAddQuestion(contestId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-contest', variables.contestId] });
    },
  });
};

/**
 * Hook to publish a contest (Admin)
 * @returns {Object} mutation object
 */
export const usePublishContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiAdminPublishContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['available-contests'] });
    },
  });
};

/**
 * Hook to delete a contest (Admin)
 * @returns {Object} mutation object
 */
export const useDeleteContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiAdminDeleteContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
    },
  });
};

/**
 * Hook to get available contests for learners
 * @returns {Object} query object
 */
export const useAvailableContests = () => {
  return useQuery({
    queryKey: ['available-contests'],
    queryFn: apiGetAvailableContests,
    select: (response) => response.data,
    refetchInterval: 30000, // Refetch every 30 seconds to update status
  });
};

/**
 * Hook to get contest details for participation
 * @param {number} contestId
 * @returns {Object} query object
 */
export const useContestDetails = (contestId) => {
  return useQuery({
    queryKey: ['contest-details', contestId],
    queryFn: () => apiGetContestDetails(contestId),
    enabled: !!contestId,
    select: (response) => response.data,
  });
};

/**
 * Hook to submit contest answers
 * @returns {Object} mutation object
 */
export const useSubmitContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contestId, data }) => apiSubmitContest(contestId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard', variables.contestId] });
      queryClient.invalidateQueries({ queryKey: ['user-contest-history'] });
      queryClient.invalidateQueries({ queryKey: ['available-contests'] });
    },
  });
};

/**
 * Hook to get leaderboard for a contest
 * @param {number} contestId
 * @returns {Object} query object
 */
export const useLeaderboard = (contestId) => {
  return useQuery({
    queryKey: ['leaderboard', contestId],
    queryFn: () => apiGetLeaderboard(contestId),
    enabled: !!contestId,
    select: (response) => response.data,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });
};

/**
 * Hook to get user's contest history
 * @returns {Object} query object
 */
export const useUserContestHistory = () => {
  return useQuery({
    queryKey: ['user-contest-history'],
    queryFn: apiGetUserContestHistory,
    select: (response) => response.data,
  });
};

/**
 * Hook to get user's result for a specific contest
 * @param {number} contestId
 * @returns {Object} query object
 */
export const useUserContestResult = (contestId) => {
  return useQuery({
    queryKey: ['user-contest-result', contestId],
    queryFn: () => apiGetUserContestResult(contestId),
    enabled: !!contestId,
    select: (response) => response.data,
  });
};
