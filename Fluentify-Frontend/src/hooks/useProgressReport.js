import { useQuery } from '@tanstack/react-query';
import { fetchProgressReport } from '../api/progress';

/**
 * Custom hook to fetch progress report data
 * @param {number} courseId - Course ID
 * @param {string} timeRange - Time range (7days, 30days, 90days, all)
 * @returns {Object} React Query result with progress report data
 */
export const useProgressReport = (courseId, timeRange = '30days') => {
  return useQuery({
    queryKey: ['progressReport', courseId, timeRange],
    queryFn: () => fetchProgressReport(courseId, timeRange),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
