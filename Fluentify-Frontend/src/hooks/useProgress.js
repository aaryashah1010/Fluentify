import { useQuery } from '@tanstack/react-query';
import { fetchProgressReport } from '../api/progress';

/**
 * Hook to fetch progress report data
 * @param {string} timeRange - Time range filter ('7d', '30d', 'all')
 * @param {string|null} courseId - Optional course ID to filter by specific course
 */
export const useProgressReport = (timeRange, courseId = null) => {
  return useQuery({
    queryKey: ['progress-report', timeRange, courseId],
    queryFn: () => fetchProgressReport(timeRange, courseId),
    staleTime: 60000, // 1 minute
    select: (data) => data.data || { summary: {}, timeline: [], recentActivity: [] },
  });
};
