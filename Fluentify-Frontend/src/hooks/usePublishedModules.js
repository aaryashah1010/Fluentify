import { useQuery } from '@tanstack/react-query';
import * as coursesApi from '../api/courses';

/**
 * Custom hook for fetching published languages
 */
export const usePublishedLanguages = () => {
  return useQuery({
    queryKey: ['publishedLanguages'],
    queryFn: async () => {
      try {
        const response = await coursesApi.fetchPublishedLanguages();
        console.log('Published languages response:', response);
        const data = response.data || [];
        console.log('Extracted data:', data);
        return data;
      } catch (error) {
        console.error('Error fetching published languages:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Custom hook for fetching published courses by language
 */
export const usePublishedCoursesByLanguage = (language) => {
  return useQuery({
    queryKey: ['publishedCourses', language],
    queryFn: async () => {
      const response = await coursesApi.fetchPublishedCoursesByLanguage(language);
      return response.data || [];
    },
    enabled: !!language,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Custom hook for fetching published course details
 */
export const usePublishedCourseDetails = (courseId) => {
  return useQuery({
    queryKey: ['publishedCourseDetails', courseId],
    queryFn: async () => {
      const response = await coursesApi.fetchPublishedCourseDetails(courseId);
      return response.data || {};
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
