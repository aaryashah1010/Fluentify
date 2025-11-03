import db from '../config/db.js';

class AdminUserRepository {
  async findLearners({ search = '', limit = 20, offset = 0 }) {
    const params = [];
    let where = '';
    if (search) {
      params.push(`%${search}%`);
      params.push(`%${search}%`);
      where = 'WHERE LOWER(name) ILIKE LOWER($1) OR LOWER(email) ILIKE LOWER($2)';
    }

    const result = await db.query(
      `SELECT id, name, email, created_at,
              (
                SELECT MAX(us.last_activity_date)
                FROM user_stats us
                WHERE us.learner_id = learners.id
              ) AS last_activity_date
       FROM learners
       ${where}
       ORDER BY created_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params
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

  async getLearnerProgressSummary(id) {
    // First try aggregations from user_stats for speed; fallback to progress tables
    const stats = await db.query(
      `SELECT 
         COALESCE(SUM(us.total_xp), 0) AS total_xp,
         COALESCE(SUM(us.lessons_completed), 0) AS lessons_completed,
         COALESCE(SUM(us.units_completed), 0) AS units_completed,
         COALESCE(MAX(us.current_streak), 0) AS current_streak,
         COALESCE(MAX(us.longest_streak), 0) AS longest_streak,
         MAX(us.last_activity_date) AS last_activity_date
       FROM user_stats us
       WHERE us.learner_id = $1`,
      [id]
    );

    const row = stats.rows[0] || {};

    // Fallbacks if user_stats is empty
    const needFallback = !row || (
      row.total_xp === null && row.lessons_completed === null && row.units_completed === null
    );

    if (needFallback) {
      const fallback = await db.query(
        `SELECT
           COALESCE(SUM(lp.xp_earned), 0) AS total_xp,
           COALESCE(SUM(CASE WHEN lp.is_completed THEN 1 ELSE 0 END), 0) AS lessons_completed,
           COALESCE((
             SELECT COUNT(*) FROM unit_progress up
             WHERE up.learner_id = $1 AND up.is_completed = true
           ), 0) AS units_completed,
           NULL::int AS current_streak,
           NULL::int AS longest_streak,
           MAX(lp.last_accessed) AS last_activity_date
         FROM lesson_progress lp
         WHERE lp.learner_id = $1`,
        [id]
      );
      return fallback.rows[0];
    }

    return row;
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


