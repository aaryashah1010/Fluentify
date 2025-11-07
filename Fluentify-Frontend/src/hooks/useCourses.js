import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCourses,
  generateCourse,
  fetchCourseDetails,
  fetchLessonDetails,
  generateExercises,
  completeLesson,
  getPublishedLanguages,
  getPublishedCoursesByLanguage,
  getPublishedCourseDetails,
} from '../api/courses';

/**
 * Hook to fetch all courses
 */
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    select: (data) => data.data || [],
  });
};

/**
 * Hook to generate a new course
 */
export const useGenerateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateCourse,
    onSuccess: (data) => {
      // Invalidate and refetch courses
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

/**
 * Hook to fetch course details
 * @param {number} courseId
 */
export const useCourseDetails = (courseId) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseDetails(courseId),
    enabled: !!courseId,
  });
};

/**
 * Hook to fetch lesson details
 * @param {Object} params
 * @param {number} params.courseId
 * @param {number} params.unitId
 * @param {number} params.lessonId
 */
export const useLessonDetails = ({ courseId, unitId, lessonId }) => {
  return useQuery({
    queryKey: ['lesson', courseId, unitId, lessonId],
    queryFn: () => fetchLessonDetails({ courseId, unitId, lessonId }),
    enabled: !!(courseId && unitId && lessonId),
  });
};

/**
 * Hook to generate additional exercises
 */
export const useGenerateExercises = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateExercises,
    onSuccess: (data, variables) => {
      // Invalidate lesson details to refetch with new exercises
      queryClient.invalidateQueries({
        queryKey: ['lesson', variables.courseId, variables.unitId, variables.lessonId],
      });
    },
  });
};

/**
 * Hook to complete a lesson
 */
export const useCompleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeLesson,
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['lesson', variables.courseId, variables.unitId, variables.lessonId],
      });
      queryClient.invalidateQueries({
        queryKey: ['course', variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ['courses'],
      });
    },
  });
};

// ==================== PUBLIC HOOKS (For Published Courses) ====================

/**
 * Hook to fetch all languages with published courses (PUBLIC - No Auth Required)
 */
export const usePublishedLanguages = () => {
  return useQuery({
    queryKey: ['published-languages'],
    queryFn: getPublishedLanguages,
    select: (data) => data.data || [],
  });
};

/**
 * Hook to fetch published courses for a specific language (PUBLIC - No Auth Required)
 * @param {string} language - Language name
 */
export const usePublishedCoursesByLanguage = (language) => {
  return useQuery({
    queryKey: ['published-courses', language],
    queryFn: () => getPublishedCoursesByLanguage(language),
    enabled: !!language,
    select: (data) => data.data || [],
  });
};

/**
 * Hook to fetch published course details with units and lessons (PUBLIC - No Auth Required)
 * @param {number} courseId - Course ID
 */
export const usePublishedCourseDetails = (courseId) => {
  return useQuery({
    queryKey: ['published-course', courseId],
    queryFn: () => getPublishedCourseDetails(courseId),
    enabled: !!courseId,
    select: (data) => data.data || null,
  });
};
