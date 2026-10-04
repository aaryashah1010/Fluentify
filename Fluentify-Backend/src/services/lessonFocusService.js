import courseRepository from '../repositories/courseRepository.js';
import progressRepository from '../repositories/progressRepository.js';

/**
 * Works out the learner's current lesson (the first one they haven't completed in
 * their most recently active course) and returns what the AI tutors should drill.
 *
 * @returns {Promise<{courseId, language, lessonTitle, keyPhrases, grammarTopics, speakingPrompts}|null>}
 */
export async function getLessonFocus(userId, courseId = null) {
  let course = null;
  if (courseId) {
    course = await courseRepository.findCourseByIdForUser(userId, courseId);
  }
  if (!course) {
    course = await courseRepository.findMostRecentlyActiveCourse(userId);
  }
  if (!course) return null;

  const data = course.course_data?.course || {};
  const units = Array.isArray(data.units) ? data.units : [];
  if (units.length === 0) return null;

  const dbCourseId = course.id ?? courseId;
  const progressRows = dbCourseId
    ? await progressRepository.findLessonProgress(userId, dbCourseId)
    : [];
  const completed = new Set(
    progressRows.filter((r) => r.is_completed).map((r) => `${r.unit_id}:${r.lesson_id}`)
  );

  // Walk the course in order; the first lesson not yet completed is the current one
  let current = null;
  let currentUnit = null;
  outer: for (const unit of units) {
    for (const lesson of unit.lessons || []) {
      if (!completed.has(`${unit.id}:${lesson.id}`)) {
        current = lesson;
        currentUnit = unit;
        break outer;
      }
    }
  }
  // Everything completed - drill the last lesson
  if (!current) {
    const lastUnit = units[units.length - 1];
    currentUnit = lastUnit;
    current = (lastUnit.lessons || []).slice(-1)[0] || null;
  }
  if (!current) return null;

  return {
    courseId: dbCourseId,
    language: data.language || course.language || 'the target language',
    unitTitle: currentUnit?.title || '',
    lessonTitle: current.title || '',
    keyPhrases: (current.keyPhrases || []).slice(0, 8),
    grammarTopics: (current.grammarPoints || []).map((g) => g.topic).filter(Boolean).slice(0, 3),
    speakingPrompts: (current.speakingPrompts || []).slice(0, 3),
  };
}

/**
 * Plain-text summary of the lesson focus, for use in a prompt or a dynamic variable.
 */
export function formatLessonFocus(focus) {
  if (!focus) return 'General conversation practice - no specific lesson in progress.';
  const parts = [
    `Current lesson: "${focus.lessonTitle}" (${focus.unitTitle}) in ${focus.language}.`,
  ];
  if (focus.keyPhrases.length) parts.push(`Key phrases to practise: ${focus.keyPhrases.join('; ')}.`);
  if (focus.grammarTopics.length) parts.push(`Grammar focus: ${focus.grammarTopics.join('; ')}.`);
  if (focus.speakingPrompts.length) parts.push(`Speaking tasks to set: ${focus.speakingPrompts.join(' | ')}.`);
  return parts.join(' ');
}
