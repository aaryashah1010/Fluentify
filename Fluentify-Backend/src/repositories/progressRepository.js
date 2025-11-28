import db from '../config/db.js';

class ProgressRepository {
  /**
   * Get all unit progress for a course
   */
  async findUnitProgress(userId, courseId) {
    const result = await db.query(
      `SELECT unit_id, is_unlocked, is_completed 
       FROM unit_progress 
       WHERE learner_id = $1 AND course_id = $2
       ORDER BY unit_id`,
      [userId, courseId]
    );
    return result.rows;
  }

  /**
   * Get all lesson progress for a course
   */
  async findLessonProgress(userId, courseId) {
    const result = await db.query(
      `SELECT cu.unit_id, cl.lesson_id, lp.is_completed, lp.score, lp.xp_earned
       FROM lesson_progress lp
       JOIN course_lessons cl ON lp.lesson_id = cl.id
       JOIN course_units cu ON cl.unit_id = cu.id
       WHERE lp.learner_id = $1 AND lp.course_id = $2
       ORDER BY cu.unit_id, cl.lesson_id`,
      [userId, courseId]
    );
    return result.rows;
  }

  /**
   * Get specific lesson progress
   */
  async findSpecificLessonProgress(userId, courseId, unitNumber, lessonNumber) {
    const result = await db.query(
      `SELECT lp.* 
       FROM lesson_progress lp
       JOIN course_lessons cl ON lp.lesson_id = cl.id
       JOIN course_units cu ON cl.unit_id = cu.id
       WHERE lp.learner_id = $1 AND lp.course_id = $2 AND cu.unit_id = $3 AND cl.lesson_id = $4`,
      [userId, courseId, unitNumber, lessonNumber]
    );
    return result.rows[0] || null;
  }

  /**
   * Get user stats for a course
   */
  async findUserStats(userId, courseId) {
    const result = await db.query(
      `SELECT * FROM user_stats WHERE learner_id = $1 AND course_id = $2`,
      [userId, courseId]
    );
    return result.rows[0] || null;
  }

  /**
   * Create or update lesson progress
   */
  async upsertLessonProgress(userId, courseId, unitId, lessonId, score, xpEarned, vocabularyMastered = 0, totalVocabulary = 0) {
    await db.query(
      `INSERT INTO lesson_progress (learner_id, course_id, unit_id, lesson_id, is_completed, score, xp_earned, vocabulary_mastered, total_vocabulary, completion_time)
       VALUES ($1, $2, $3, $4, TRUE, $5, $6, $7, $8, NOW())
       ON CONFLICT (learner_id, lesson_id)
       DO UPDATE SET is_completed = TRUE, score = $5, xp_earned = $6, vocabulary_mastered = $7, total_vocabulary = $8, completion_time = NOW()`,
      [userId, courseId, unitId, lessonId, score, xpEarned, vocabularyMastered, totalVocabulary]
    );
  }

  /**
   * Save exercise attempt
   */
  async createExerciseAttempt(userId, courseId, unitId, lessonId, exerciseIndex, isCorrect, userAnswer) {
    await db.query(
      `INSERT INTO exercise_attempts (learner_id, course_id, unit_id, lesson_id, exercise_index, is_correct, user_answer)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, courseId, unitId, lessonId, exerciseIndex, isCorrect, userAnswer]
    );
  }

  /**
   * Count completed lessons in a unit
   */
  async countCompletedLessonsInUnit(userId, courseId, unitNumber) {
    const result = await db.query(
      `SELECT COUNT(*) as total 
       FROM lesson_progress lp
       JOIN course_lessons cl ON lp.lesson_id = cl.id
       JOIN course_units cu ON cl.unit_id = cu.id
       WHERE lp.learner_id = $1 AND lp.course_id = $2 AND cu.unit_id = $3 AND lp.is_completed = TRUE`,
      [userId, courseId, unitNumber]
    );
    return parseInt(result.rows[0].total);
  }

  /**
   * Mark unit as complete
   */
  async markUnitComplete(userId, courseId, unitId) {
    await db.query(
      `INSERT INTO unit_progress (learner_id, course_id, unit_id, is_unlocked, is_completed, completed_at)
       VALUES ($1, $2, $3, TRUE, TRUE, NOW())
       ON CONFLICT (learner_id, course_id, unit_id)
       DO UPDATE SET is_completed = TRUE, completed_at = NOW()`,
      [userId, courseId, unitId]
    );
  }

  /**
   * Unlock next unit
   */
  async unlockUnit(userId, courseId, unitId) {
    await db.query(
      `INSERT INTO unit_progress (learner_id, course_id, unit_id, is_unlocked, is_completed)
       VALUES ($1, $2, $3, TRUE, FALSE)
       ON CONFLICT (learner_id, course_id, unit_id)
       DO UPDATE SET is_unlocked = TRUE`,
      [userId, courseId, unitId]
    );
  }

  /**
   * Create initial user stats
   */
  async createUserStats(userId, courseId, xpEarned, unitsCompleted, today) {
    await db.query(
      `INSERT INTO user_stats (learner_id, course_id, total_xp, lessons_completed, units_completed, current_streak, last_activity_date)
       VALUES ($1, $2, $3, 1, $4, 1, $5)`,
      [userId, courseId, xpEarned, unitsCompleted, today]
    );
  }

  /**
   * Update user streak only
   */
  async updateUserStreak(userId, courseId, newStreak, today) {
    await db.query(
      `UPDATE user_stats SET
        current_streak = $1,
        longest_streak = GREATEST(longest_streak, $1),
        last_activity_date = $2,
        updated_at = NOW()
       WHERE learner_id = $3 AND course_id = $4`,
      [newStreak, today, userId, courseId]
    );
  }

  /**
   * Initialize course progress (unlock first unit and create stats)
   */
  async initializeCourseProgress(courseId, userId) {
    // Unlock first unit
    await db.query(
      `INSERT INTO unit_progress (learner_id, course_id, unit_id, is_unlocked, is_completed)
       VALUES ($1, $2, 1, TRUE, FALSE)
       ON CONFLICT (learner_id, course_id, unit_id) DO NOTHING`,
      [userId, courseId]
    );

    // Initialize user stats with streak = 1 for new users
    const today = new Date().toISOString().split('T')[0];
    await db.query(
      `INSERT INTO user_stats (learner_id, course_id, total_xp, lessons_completed, units_completed, current_streak, longest_streak, last_activity_date)
       VALUES ($1, $2, 0, 0, 0, 1, 1, $3)
       ON CONFLICT (learner_id, course_id) DO NOTHING`,
      [userId, courseId, today]
    );
  }

  /**
   * Get summary KPIs for progress report
   * Can be filtered by courseId
   */
  async getSummaryKPIs(userId, days = null, courseId = null) {
    const dateFilter = days ? `AND completion_time >= NOW() - INTERVAL '${days} days'` : '';
    const courseFilter = courseId ? `AND course_id = ${parseInt(courseId)}` : '';
    
    const result = await db.query(
      `SELECT 
        COALESCE(SUM(lp.xp_earned), 0)::INTEGER as total_xp,
        COUNT(DISTINCT CASE WHEN lp.is_completed THEN lp.lesson_id END)::INTEGER as lessons_completed,
        COALESCE(SUM(lp.vocabulary_mastered), 0)::INTEGER as total_vocabulary,
        (SELECT COALESCE(MAX(current_streak), 1) FROM user_stats WHERE learner_id = $1 ${courseId ? `AND course_id = ${parseInt(courseId)}` : ''})::INTEGER as current_streak,
        (SELECT COALESCE(MAX(longest_streak), 0) FROM user_stats WHERE learner_id = $1 ${courseId ? `AND course_id = ${parseInt(courseId)}` : ''})::INTEGER as longest_streak
      FROM lesson_progress lp
      WHERE lp.learner_id = $1 ${dateFilter} ${courseFilter}`,
      [userId]
    );
    
    return result.rows[0] || {
      total_xp: 0,
      lessons_completed: 0,
      total_vocabulary: 0,
      current_streak: 1,
      longest_streak: 0
    };
  }

  /**
   * Get progress over time (grouped by date)
   * Can be filtered by courseId
   */
  async getProgressOverTime(userId, days = null, courseId = null) {
    const dateFilter = days ? `AND lp.completion_time >= NOW() - INTERVAL '${days} days'` : '';
    const courseFilter = courseId ? `AND lp.course_id = ${parseInt(courseId)}` : '';
    
    const result = await db.query(
      `SELECT 
        DATE(lp.completion_time) as date,
        SUM(lp.vocabulary_mastered)::INTEGER as vocabulary_learned,
        ROUND(AVG(lp.score), 1)::NUMERIC as avg_score,
        COUNT(*)::INTEGER as lessons_count
      FROM lesson_progress lp
      WHERE lp.learner_id = $1
        AND lp.is_completed = true
        AND lp.completion_time IS NOT NULL
        ${dateFilter}
        ${courseFilter}
      GROUP BY DATE(lp.completion_time)
      ORDER BY date ASC`,
      [userId]
    );
    
    return result.rows;
  }

  /**
   * Get recent activity
   * Can be filtered by courseId
   */
  async getRecentActivity(userId, limit = 5, courseId = null) {
    const courseFilter = courseId ? `AND lp.course_id = ${parseInt(courseId)}` : '';
    
    const result = await db.query(
      `SELECT 
        cl.title as lesson_title,
        c.language,
        c.title as course_title,
        lp.score,
        lp.xp_earned,
        lp.vocabulary_mastered,
        lp.completion_time
      FROM lesson_progress lp
      JOIN course_lessons cl ON lp.lesson_id = cl.id
      JOIN courses c ON lp.course_id = c.id
      WHERE lp.learner_id = $1
        AND lp.is_completed = true
        ${courseFilter}
      ORDER BY lp.completion_time DESC
      LIMIT $2`,
      [userId, limit]
    );
    
    return result.rows;
  }
}

export default new ProgressRepository();
