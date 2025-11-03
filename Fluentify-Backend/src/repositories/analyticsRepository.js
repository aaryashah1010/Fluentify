import db from '../config/db.js';

class AnalyticsRepository {
  /**
   * Log a learning event
   */
  async logEvent(userId, eventType, languageName, moduleType, duration = null, metadata = {}) {
    try {
      const query = `
        INSERT INTO learning_logs (user_id, event_type, language_name, module_type, duration_seconds, metadata)
        VALUES ($1, $2, $3, $4, $5, $6);
      `;
      
      await db.query(query, [
        userId, 
        eventType, 
        languageName, 
        moduleType, 
        duration, 
        JSON.stringify(metadata)
      ]);
      return true;
    } catch (error) {
      console.error('Error logging analytics event:', error);
      throw error;
    }
  }

  /**
   * Get language distribution (how many lessons completed per language)
   */
  async getLanguageDistribution() {
    try {
      const query = `
        SELECT 
          language_name,
          COUNT(*)::int as count
        FROM learning_logs
        WHERE event_type = 'LESSON_COMPLETED'
          AND language_name IS NOT NULL
          AND TRIM(language_name) <> ''
        GROUP BY language_name
        ORDER BY count DESC;
      `;
      
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting language distribution:', error);
      throw error;
    }
  }

  /**
   * Get module usage statistics (Admin vs AI)
   */
  async getModuleUsage() {
    try {
      const query = `
        SELECT 
          module_type,
          COUNT(*) as count
        FROM learning_logs
        WHERE event_type = 'LESSON_COMPLETED'
        GROUP BY module_type
        ORDER BY count DESC;
      `;
      
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting module usage:', error);
      throw error;
    }
  }

  /**
   * Get AI performance metrics
   */
  async getAIPerformance() {
    try {
      const query = `
        SELECT
          COUNT(*) as total_generations,
          SUM(CASE WHEN metadata->>'success' = 'true' THEN 1 ELSE 0 END) as success_count,
          SUM(CASE WHEN metadata->>'success' = 'false' THEN 1 ELSE 0 END) as failure_count
        FROM learning_logs
        WHERE event_type = 'AI_MODULE_GENERATED';
      `;
      
      const result = await db.query(query);
      return result.rows[0] || { total_generations: 0, success_count: 0, failure_count: 0 };
    } catch (error) {
      console.error('Error getting AI performance:', error);
      throw error;
    }
  }

  /**
   * Get daily activity statistics
   */
  async getDailyActivity(days = 30) {
    try {
      const query = `
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as total_activities,
          COUNT(DISTINCT user_id) as active_users
        FROM learning_logs
        WHERE created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC;
      `;
      
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting daily activity:', error);
      throw error;
    }
  }

  /**
   * Get user engagement metrics
   */
  async getUserEngagement() {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT user_id) as total_active_users,
          AVG(daily_lessons) as avg_lessons_per_user,
          MAX(daily_lessons) as max_lessons_per_user
        FROM (
          SELECT 
            user_id,
            DATE(created_at) as date,
            COUNT(*) as daily_lessons
          FROM learning_logs
          WHERE event_type = 'LESSON_COMPLETED'
            AND created_at >= NOW() - INTERVAL '30 days'
          GROUP BY user_id, DATE(created_at)
        ) user_daily_stats;
      `;
      
      const result = await db.query(query);
      return result.rows[0] || { total_active_users: 0, avg_lessons_per_user: 0, max_lessons_per_user: 0 };
    } catch (error) {
      console.error('Error getting user engagement:', error);
      throw error;
    }
  }

  /**
   * Get lesson completion trends over time
   */
  async getLessonCompletionTrends(days = 30) {
    try {
      const query = `
        SELECT 
          DATE(created_at) as date,
          module_type,
          COUNT(*) as completions
        FROM learning_logs
        WHERE event_type = 'LESSON_COMPLETED'
          AND created_at >= NOW() - INTERVAL '${days} days'
        GROUP BY DATE(created_at), module_type
        ORDER BY date DESC, module_type;
      `;
      
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting lesson completion trends:', error);
      throw error;
    }
  }

  /**
   * Get average lesson duration by module type
   */
  async getAverageLessonDuration() {
    try {
      const query = `
        SELECT 
          module_type,
          language_name,
          AVG(duration_seconds) as avg_duration_seconds,
          COUNT(*) as total_lessons
        FROM learning_logs
        WHERE event_type = 'LESSON_COMPLETED'
          AND duration_seconds IS NOT NULL
        GROUP BY module_type, language_name
        ORDER BY module_type, language_name;
      `;
      
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting average lesson duration:', error);
      throw error;
    }
  }
}

export default new AnalyticsRepository();
