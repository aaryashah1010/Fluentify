import authRepository from '../repositories/authRepository.js';
import chatRepository from '../repositories/chatRepository.js';
import courseRepository from '../repositories/courseRepository.js';

/**
 * Resolves a learner's language/level context for AI tutors (voice + chat).
 * Shared so both use the same course lookup instead of two drifting copies.
 *
 * @param {number} userId
 * @param {number|null} courseId - a specific course to use, if known
 * @returns {Promise<{learner_name, target_language, proficiency_level, base_language, resolvedCourseId: number|null}>}
 */
export async function getLearnerCourseContext(userId, courseId = null) {
  const learner = await authRepository.findLearnerById(userId);

  let course = null;
  if (courseId) {
    course = await courseRepository.findCourseByIdForUser(userId, courseId);
  }
  if (!course) {
    course = await courseRepository.findMostRecentlyActiveCourse(userId);
  }

  if (course) {
    const data = course.course_data || {};
    return {
      learner_name: learner?.name || 'there',
      target_language: data.metadata?.language || data.course?.language || course.language || 'English',
      proficiency_level: data.metadata?.expertise || data.course?.expertise || 'Beginner',
      base_language: data.metadata?.baseLanguage || data.course?.baseLanguage || 'English',
      resolvedCourseId: course.id ?? courseId ?? null,
    };
  }

  // No courses generated yet - fall back to onboarding preferences
  const languageInfo = await chatRepository.getUserLanguageInfo(userId);
  return {
    learner_name: learner?.name || 'there',
    target_language: languageInfo.language,
    proficiency_level: languageInfo.proficiency,
    base_language: 'English',
    resolvedCourseId: null,
  };
}
