import db from '../config/db.js';

class ProgressReportRepository {
  /**
   * Get vocabulary progress over time
   * Counts unique vocabulary items learned from completed lessons
   */
  async getVocabularyProgressOverTime(userId, courseId, startDate, endDate) {
    const query = `
      SELECT 
        DATE(lp.completion_time) as date,
        COUNT(DISTINCT vocab_item) as words_learned
      FROM lesson_progress lp
      JOIN course_lessons cl ON lp.lesson_id = cl.id
      CROSS JOIN LATERAL jsonb_array_elements(cl.vocabulary) as vocab_item
      WHERE lp.learner_id = $1 
        AND lp.course_id = $2
        AND lp.is_completed = TRUE
        AND lp.completion_time >= $3
        AND lp.completion_time <= $4
        AND cl.vocabulary IS NOT NULL
      GROUP BY DATE(lp.completion_time)
      ORDER BY date ASC
    `;
    
    const result = await db.query(query, [userId, courseId, startDate, endDate]);
    return result.rows;
  }

  /**
   * Get total vocabulary learned
   */
  async getTotalVocabularyLearned(userId, courseId) {
    const query = `
      SELECT 
        COUNT(DISTINCT vocab_item) as total_words
      FROM lesson_progress lp
      JOIN course_lessons cl ON lp.lesson_id = cl.id
      CROSS JOIN LATERAL jsonb_array_elements(cl.vocabulary) as vocab_item
      WHERE lp.learner_id = $1 
        AND lp.course_id = $2
        AND lp.is_completed = TRUE
        AND cl.vocabulary IS NOT NULL
    `;
    
    const result = await db.query(query, [userId, courseId]);
    return parseInt(result.rows[0]?.total_words || 0);
  }

  /**
   * Get exercise accuracy statistics
   */
  async getExerciseAccuracyStats(userId, courseId) {
    const query = `
      SELECT 
        COUNT(*) as total_attempts,
        SUM(CASE WHEN is_correct = TRUE THEN 1 ELSE 0 END) as correct_attempts,
        ROUND(
          (SUM(CASE WHEN is_correct = TRUE THEN 1 ELSE 0 END)::DECIMAL / 
          NULLIF(COUNT(*), 0) * 100), 2
        ) as accuracy_percentage
      FROM exercise_attempts
      WHERE learner_id = $1 AND course_id = $2
    `;
    
    const result = await db.query(query, [userId, courseId]);
    return result.rows[0] || { total_attempts: 0, correct_attempts: 0, accuracy_percentage: 0 };
  }

  /**
   * Get lesson completion timeline
   */
  async getLessonCompletionTimeline(userId, courseId, startDate, endDate) {
    const query = `
      SELECT 
        DATE(completion_time) as date,
        COUNT(*) as lessons_completed,
        SUM(xp_earned) as xp_earned,
        SUM(EXTRACT(EPOCH FROM (completion_time - created_at))/60)::INTEGER as time_spent_minutes
      FROM lesson_progress
      WHERE learner_id = $1 
        AND course_id = $2
        AND is_completed = TRUE
        AND completion_time >= $3
        AND completion_time <= $4
      GROUP BY DATE(completion_time)
      ORDER BY date ASC
    `;
    
    const result = await db.query(query, [userId, courseId, startDate, endDate]);
    return result.rows;
  }

  /**
   * Get time spent by topic (unit)
   */
  async getTimeSpentByTopic(userId, courseId) {
    const query = `
      SELECT 
        cu.unit_id,
        cu.title as topic,
        COUNT(lp.id) as lessons_completed,
        SUM(lp.xp_earned) as total_xp,
        ROUND(
          (COUNT(lp.id)::DECIMAL / 
          (SELECT COUNT(*) FROM course_lessons WHERE unit_id = cu.unit_id) * 100), 2
        ) as progress_percentage,
        ROUND(
          (SUM(CASE WHEN ea.is_correct = TRUE THEN 1 ELSE 0 END)::DECIMAL / 
          NULLIF(COUNT(ea.id), 0) * 100), 2
        ) as accuracy
      FROM course_units cu
      LEFT JOIN lesson_progress lp ON lp.unit_id = cu.unit_id 
        AND lp.course_id = cu.course_id 
        AND lp.learner_id = $1
        AND lp.is_completed = TRUE
      LEFT JOIN exercise_attempts ea ON ea.unit_id = cu.unit_id 
        AND ea.course_id = cu.course_id 
        AND ea.learner_id = $1
      WHERE cu.course_id = $2
      GROUP BY cu.unit_id, cu.title
      ORDER BY cu.unit_id ASC
    `;
    
    const result = await db.query(query, [userId, courseId]);
    return result.rows;
  }

  /**
   * Get streak history
   */
  async getStreakHistory(userId, courseId) {
    const query = `
      SELECT 
        current_streak,
        longest_streak,
        last_activity_date
      FROM user_stats
      WHERE learner_id = $1 AND course_id = $2
    `;
    
    const result = await db.query(query, [userId, courseId]);
    return result.rows[0] || { current_streak: 0, longest_streak: 0, last_activity_date: null };
  }

  /**
   * Get overall progress statistics
   */
  async getOverallStats(userId, courseId) {
    const query = `
      SELECT 
        COALESCE(us.total_xp, 0) as total_xp,
        COALESCE(us.current_streak, 0) as current_streak,
        COALESCE(us.longest_streak, 0) as longest_streak,
        c.total_lessons,
        c.total_units,
        COUNT(lp.id) FILTER (WHERE lp.is_completed = TRUE) as lessons_completed,
        COUNT(DISTINCT lp.unit_id) FILTER (WHERE lp.is_completed = TRUE) as units_completed,
        ROUND((COUNT(lp.id) FILTER (WHERE lp.is_completed = TRUE)::DECIMAL / NULLIF(c.total_lessons, 0) * 100), 2) as overall_progress
      FROM courses c
      LEFT JOIN user_stats us ON us.course_id = c.id AND us.learner_id = $1
      LEFT JOIN lesson_progress lp ON lp.course_id = c.id AND lp.learner_id = $1
      WHERE c.id = $2
      GROUP BY c.id, c.total_lessons, c.total_units, us.total_xp, us.current_streak, us.longest_streak
    `;
    
    const result = await db.query(query, [userId, courseId]);
    return result.rows[0] || {
      total_xp: 0,
      lessons_completed: 0,
      units_completed: 0,
      current_streak: 0,
      longest_streak: 0,
      total_lessons: 0,
      total_units: 0,
      overall_progress: 0
    };
  }

  /**
   * Get weak areas (topics with low accuracy)
   */
  async getWeakAreas(userId, courseId, threshold = 60) {
    const query = `
      SELECT 
        cu.title as topic,
        cu.unit_id,
        COUNT(ea.id) as total_attempts,
        SUM(CASE WHEN ea.is_correct = TRUE THEN 1 ELSE 0 END) as correct_attempts,
        ROUND(
          (SUM(CASE WHEN ea.is_correct = TRUE THEN 1 ELSE 0 END)::DECIMAL / 
          NULLIF(COUNT(ea.id), 0) * 100), 2
        ) as accuracy
      FROM course_units cu
      JOIN exercise_attempts ea ON ea.unit_id = cu.unit_id 
        AND ea.course_id = cu.course_id
      WHERE ea.learner_id = $1 
        AND ea.course_id = $2
      GROUP BY cu.unit_id, cu.title
      HAVING ROUND(
        (SUM(CASE WHEN ea.is_correct = TRUE THEN 1 ELSE 0 END)::DECIMAL / 
        NULLIF(COUNT(ea.id), 0) * 100), 2
      ) < $3
      ORDER BY accuracy ASC
    `;
    
    const result = await db.query(query, [userId, courseId, threshold]);
    return result.rows;
  }

  /**
   * Get achievements for user
   */
  async getUserAchievements(userId) {
    const query = `
      SELECT 
        achievement_type,
        title,
        description,
        icon,
        earned_at
      FROM user_achievements
      WHERE learner_id = $1
      ORDER BY earned_at DESC
      LIMIT 10
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  /**
   * Get learning analytics from learning_logs
   */
  async getLearningAnalytics(userId, courseId, startDate, endDate) {
    const query = `
      SELECT 
        DATE(completion_time) as date,
        COUNT(*) as activities,
        AVG(EXTRACT(EPOCH FROM (completion_time - created_at))) as avg_duration
      FROM lesson_progress
      WHERE learner_id = $1 
        AND course_id = $2
        AND is_completed = TRUE
        AND completion_time >= $3
        AND completion_time <= $4
      GROUP BY DATE(completion_time)
      ORDER BY date ASC
    `;
    
    const result = await db.query(query, [userId, courseId, startDate, endDate]);
    return result.rows;
  }

  /**
   * Get vocabulary learned in specific time period
   */
  async getVocabularyInPeriod(userId, courseId, startDate, endDate) {
    const query = `
      SELECT 
        COUNT(DISTINCT vocab_item) as words_learned
      FROM lesson_progress lp
      JOIN course_lessons cl ON lp.lesson_id = cl.id
      CROSS JOIN LATERAL jsonb_array_elements(cl.vocabulary) as vocab_item
      WHERE lp.learner_id = $1 
        AND lp.course_id = $2
        AND lp.is_completed = TRUE
        AND lp.completion_time >= $3
        AND lp.completion_time <= $4
        AND cl.vocabulary IS NOT NULL
    `;
    
    const result = await db.query(query, [userId, courseId, startDate, endDate]);
    return parseInt(result.rows[0]?.words_learned || 0);
  }
}

export default new ProgressReportRepository();
