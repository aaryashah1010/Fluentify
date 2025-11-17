import courseRepository from '../repositories/courseRepository.js';
import progressRepository from '../repositories/progressRepository.js';
import analyticsService from '../services/analyticsService.js';
import { successResponse, listResponse } from '../utils/response.js';
import { ERRORS } from '../utils/error.js';

/**
 * Get user's course progress
 */
const getCourseProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    // Get course data
    const course = await courseRepository.findCourseById(courseId, userId);

    if (!course) {
      throw ERRORS.COURSE_NOT_FOUND;
    }

    // Get unit progress
    const unitProgress = await progressRepository.findUnitProgress(userId, courseId);

    // Get lesson progress
    const lessonProgress = await progressRepository.findLessonProgress(userId, courseId);

    // Get user stats
    const stats = await progressRepository.findUserStats(userId, courseId);

    res.json(successResponse({
      course: course.course_data || {},
      unitProgress: unitProgress,
      lessonProgress: lessonProgress,
      stats: stats || {
        total_xp: 0,
        lessons_completed: 0,
        units_completed: 0,
        current_streak: 0,
        longest_streak: 0
      }
    }, 'Course progress retrieved successfully'));
  } catch (error) {
    console.error('Error fetching course progress:', error);
    next(error);
  }
};

/**
 * Validate exercise score - must get at least 3/5 correct
 */
const validateExerciseScore = (exercises) => {
  if (exercises && exercises.length > 0) {
    const correctAnswers = exercises.filter(ex => ex.isCorrect === true).length;
    const totalExercises = exercises.length;
    
    if (totalExercises >= 5 && correctAnswers < 3) {
      return {
        valid: false,
        correctAnswers,
        totalExercises
      };
    }
  }
  return { valid: true };
};

/**
 * Track lesson completion analytics
 */
const trackLessonAnalytics = async (params) => {
  const { userId, courseResult, courseData, unitId, lessonId, score, xpEarned, exercises } = params;
  try {
    const moduleType = courseResult.course_data?.metadata?.createdBy === 'admin' ? 'ADMIN' : 'AI';
    const languageName = courseResult.language 
      || courseData?.course?.language 
      || courseData?.metadata?.language 
      || null;
    
    console.log('🔍 Analytics Debug - Tracking lesson completion:', {
      userId,
      language: languageName,
      moduleType,
      lessonId: Number.parseInt(lessonId),
      courseId: courseResult.id
    });
    
    await analyticsService.trackLessonCompletion(
      userId,
      languageName,
      moduleType,
      null,
      {
        lessonId: Number.parseInt(lessonId),
        unitId: Number.parseInt(unitId),
        courseId: courseResult.id,
        score,
        xpEarned,
        exercisesCompleted: exercises.length
      }
    );
    
    console.log('✅ Analytics - Lesson completion tracked successfully');
  } catch (analyticsError) {
    console.error('❌ Error tracking lesson completion analytics:', analyticsError);
  }
};

/**
 * Handle unit completion and unlocking next unit
 */
const handleUnitCompletion = async (userId, courseId, unitId, courseData) => {
  const unit = courseData.course.units.find(u => u.id === Number.parseInt(unitId));
  const totalLessonsInUnit = unit.lessons.length;
  const completedLessons = await progressRepository.countCompletedLessonsInUnit(userId, courseId, Number.parseInt(unitId));

  if (completedLessons >= totalLessonsInUnit) {
    await progressRepository.markUnitComplete(userId, courseId, Number.parseInt(unitId));

    const nextUnitId = Number.parseInt(unitId) + 1;
    const nextUnit = courseData.course.units.find(u => u.id === nextUnitId);
    
    if (nextUnit) {
      await progressRepository.unlockUnit(userId, courseId, nextUnitId);
    }

    return true;
  }

  return false;
};

/**
 * Update user streak information
 */
const updateUserStreak = async (userId, courseId) => {
  const today = new Date().toISOString().split('T')[0];
  const stats = await progressRepository.findUserStats(userId, courseId);

  if (stats) {
    const lastDate = stats.last_activity_date ? new Date(stats.last_activity_date).toISOString().split('T')[0] : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (lastDate === yesterdayStr) {
      newStreak = stats.current_streak + 1;
    } else if (lastDate === today) {
      newStreak = stats.current_streak;
    }

    await progressRepository.updateUserStreak(userId, courseId, newStreak, today);
  } else {
    await progressRepository.createUserStats(userId, courseId, 0, 0, today);
  }
};

/**
 * Mark lesson as complete
 */
const markLessonComplete = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId, unitId, lessonId } = req.params;
    const { score = 100, exercises = [] } = req.body || {};

    // Validate exercise score
    const exerciseValidation = validateExerciseScore(exercises);
    if (!exerciseValidation.valid) {
      return res.status(400).json({
        success: false,
        message: 'You need at least 3 out of 5 correct answers to complete this lesson',
        data: {
          correctAnswers: exerciseValidation.correctAnswers,
          totalExercises: exerciseValidation.totalExercises,
          passed: false
        }
      });
    }

    // Get course data
    const courseResult = await courseRepository.findCourseDataById(courseId, userId);
    if (!courseResult) {
      throw ERRORS.COURSE_NOT_FOUND;
    }

    const courseData = courseResult.course_data;
    const unit = courseData.course.units.find(u => u.id === Number.parseInt(unitId));
    const lesson = unit?.lessons.find(l => l.id === Number.parseInt(lessonId));

    if (!lesson) {
      throw ERRORS.LESSON_NOT_FOUND;
    }

    const xpEarned = lesson.xpReward || 50;
    const vocabularyCount = lesson.vocabulary?.length || 0;
    const vocabularyMastered = Math.round(vocabularyCount * (score / 100));

    // Get lesson database ID
    const lessonDbId = await courseRepository.findLessonDbId(courseId, Number.parseInt(unitId), Number.parseInt(lessonId));
    if (!lessonDbId) {
      throw ERRORS.LESSON_NOT_FOUND;
    }

    // Check if lesson already completed
    const existingProgress = await progressRepository.findSpecificLessonProgress(userId, courseId, Number.parseInt(unitId), Number.parseInt(lessonId));
    if (existingProgress?.is_completed) {
      throw ERRORS.LESSON_ALREADY_COMPLETED;
    }

    // Mark lesson as complete
    await progressRepository.upsertLessonProgress(
      userId, 
      courseId, 
      Number.parseInt(unitId), 
      lessonDbId, 
      score, 
      xpEarned, 
      vocabularyMastered, 
      vocabularyCount
    );

    // Track analytics
    await trackLessonAnalytics({ userId, courseResult, courseData, unitId, lessonId, score, xpEarned, exercises });

    // Save exercise attempts
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      await progressRepository.createExerciseAttempt(
        userId, courseId, Number.parseInt(unitId), lessonDbId, i, 
        exercise.isCorrect, exercise.userAnswer
      );
    }

    // Handle unit completion
    const unitCompleted = await handleUnitCompletion(userId, courseId, unitId, courseData);

    // Update user streak
    await updateUserStreak(userId, courseId);

    res.json(successResponse({
      xpEarned,
      unitCompleted
    }, unitCompleted ? 'Unit completed! Next unit unlocked!' : 'Lesson completed!'));
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    next(error);
  }
};

/**
 * Get available courses for user
 */
const getUserCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log('👤 getUserCourses called for userId:', userId);

    const courses = await courseRepository.findAllActiveCourses(userId);

    const coursesWithProgress = courses.map(course => ({
      id: course.id,
      language: course.language,
      title: course.title,
      description: course.description,
      sourceType: course.source_type, // 'ai' or 'admin' - important for frontend!
      totalLessons: course.total_lessons,
      totalUnits: course.total_units,
      createdAt: course.created_at,
      progress: {
        totalXp: course.total_xp || 0,
        lessonsCompleted: course.lessons_completed || 0,
        unitsCompleted: course.units_completed || 0,
        currentStreak: course.current_streak || 0
      }
    }));

    console.log(`📦 Returning ${coursesWithProgress.length} courses to user ${userId}`);
    res.json(listResponse(coursesWithProgress, 'User courses retrieved successfully'));
  } catch (error) {
    console.error('Error fetching user courses:', error);
    next(error);
  }
};

/**
 * Initialize progress for a new course
 */
const initializeCourseProgress = async (courseId, userId) => {
  try {
    await progressRepository.initializeCourseProgress(courseId, userId);
  } catch (error) {
    console.error('Error initializing course progress:', error);
    throw error;
  }
};

/**
 * Get progress report with summary, timeline, and recent activity
 * Can be filtered by course
 */
const getProgressReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { range = 'all', courseId } = req.query;
    
    // Convert range to days (7d -> 7, 30d -> 30, all -> null)
    const days = range === 'all' ? null : Number.parseInt(range.replace('d', ''));
    
    const summary = await progressRepository.getSummaryKPIs(userId, days, courseId);
    const timeline = await progressRepository.getProgressOverTime(userId, days, courseId);
    const recentActivity = await progressRepository.getRecentActivity(userId, 5, courseId);
    
    res.json(successResponse({
      summary,
      timeline,
      recentActivity
    }, 'Progress report retrieved successfully'));
  } catch (error) {
    console.error('Error fetching progress report:', error);
    next(error);
  }
};

export {
  getCourseProgress,
  markLessonComplete,
  getUserCourses,
  initializeCourseProgress,
  getProgressReport
};
