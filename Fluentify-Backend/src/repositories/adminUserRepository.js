import db from '../config/db.js';

class AdminUserRepository {
  /**
   * FIX: Find learners with accurate last activity date
   * Checks multiple sources: user_stats, lesson_progress, and learner_enrollments
   * Uses parameterized queries to prevent SQL injection
   */
  async findLearners({ search = '', limit = 20, offset = 0 }) {
    // Ensure limit and offset are valid integers
    const limitInt = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const offsetInt = Math.max(parseInt(offset, 10) || 0, 0);
    
    const params = [];
    let where = '';
    let paramIndex = 1;
    
    if (search) {
      params.push(`%${search}%`);
      params.push(`%${search}%`);
      where = `WHERE LOWER(name) ILIKE LOWER($${paramIndex}) OR LOWER(email) ILIKE LOWER($${paramIndex + 1})`;
      paramIndex += 2;
    }

    // FIX: Get last activity from multiple sources for accuracy
    // FIX: Use parameterized queries for limit and offset
    const result = await db.query(
      `SELECT 
        id, 
        name, 
        email, 
        created_at,
        (
          SELECT MAX(activity_date) FROM (
            SELECT MAX(us.last_activity_date) as activity_date
            FROM user_stats us
            WHERE us.learner_id = learners.id
            UNION ALL
            SELECT MAX(lp.last_accessed) as activity_date
            FROM lesson_progress lp
            WHERE lp.learner_id = learners.id
            UNION ALL
            SELECT MAX(le.enrolled_at) as activity_date
            FROM learner_enrollments le
            WHERE le.learner_id = learners.id
          ) combined_activities
        ) AS last_activity_date
       FROM learners
       ${where}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limitInt, offsetInt]
    );
    return result.rows;
  }

  async countLearners({ search = '' }) {
    const params = [];
    let where = '';
    if (search) {
      params.push(`%${search}%`);
      params.push(`%${search}%`);
      where = 'WHERE LOWER(name) ILIKE LOWER($1) OR LOWER(email) ILIKE LOWER($2)';
    }
    const result = await db.query(
      `SELECT COUNT(*)::int AS count FROM learners ${where}`,
      params
    );
    return result.rows[0]?.count || 0;
  }

  async getLearnerBasicById(id) {
    const result = await db.query(
      `SELECT id, name, email, created_at, updated_at, is_email_verified, email_verified_at
       FROM learners WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * FIX: Get learner progress summary with accurate last activity
   * Directly aggregates from lesson_progress and unit_progress for accuracy
   * Falls back to user_stats only for streak data
   */
  async getLearnerProgressSummary(id) {
    const result = await db.query(
      `SELECT 
         -- XP: Direct sum from lesson_progress (source of truth)
         COALESCE((
           SELECT SUM(lp.xp_earned) 
           FROM lesson_progress lp 
           WHERE lp.learner_id = $1
         ), 0) AS total_xp,
         
         -- Lessons completed: Direct count from lesson_progress
         COALESCE((
           SELECT COUNT(*) 
           FROM lesson_progress lp 
           WHERE lp.learner_id = $1 AND lp.is_completed = true
         ), 0) AS lessons_completed,
         
         -- Units completed: Direct count from unit_progress
         COALESCE((
           SELECT COUNT(*) 
           FROM unit_progress up
           WHERE up.learner_id = $1 AND up.is_completed = true
         ), 0) AS units_completed,
         
         -- Streaks: Get max from user_stats (these are maintained per course)
         COALESCE((
           SELECT MAX(current_streak) 
           FROM user_stats 
           WHERE learner_id = $1
         ), 0) AS current_streak,
         
         COALESCE((
           SELECT MAX(longest_streak) 
           FROM user_stats 
           WHERE learner_id = $1
         ), 0) AS longest_streak,
         
         -- Last activity: Most recent from all sources
         (
           SELECT MAX(activity_date) FROM (
             SELECT MAX(last_activity_date) as activity_date
             FROM user_stats WHERE learner_id = $1
             UNION ALL
             SELECT MAX(last_accessed) as activity_date
             FROM lesson_progress WHERE learner_id = $1
             UNION ALL
             SELECT MAX(completion_time) as activity_date
             FROM lesson_progress WHERE learner_id = $1 AND is_completed = true
             UNION ALL
             SELECT MAX(enrolled_at) as activity_date
             FROM learner_enrollments WHERE learner_id = $1
           ) combined
         ) AS last_activity_date`,
      [id]
    );

    return result.rows[0] || {
      total_xp: 0,
      lessons_completed: 0,
      units_completed: 0,
      current_streak: 0,
      longest_streak: 0,
      last_activity_date: null
    };
  }

  async updateLearnerProfile(id, { name, email }) {
    let newEmail = email;
    if (newEmail) newEmail = newEmail.toLowerCase();

    if (newEmail) {
      const exists = await db.query(
        `SELECT 1 FROM learners WHERE LOWER(email) = LOWER($1) AND id <> $2 LIMIT 1`,
        [newEmail, id]
      );
      if (exists.rows.length > 0) {
        const err = new Error('Email already in use');
        err.statusCode = 409;
        throw err;
      }
    }

    const result = await db.query(
      `UPDATE learners
       SET name = COALESCE($1, name),
           email = COALESCE(LOWER($2), email),
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email, created_at, updated_at, is_email_verified, email_verified_at`,
      [name || null, newEmail || null, id]
    );
    return result.rows[0] || null;
  }
}

export default new AdminUserRepository();


