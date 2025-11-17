import db from '../config/db.js';

class UserManagementService {
    async getUsersList(page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        
        const { rows: users } = await db.query(
            `SELECT id, name, email, created_at, updated_at 
             FROM learners 
             ORDER BY created_at DESC 
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const { rows: [{ count }] } = await db.query('SELECT COUNT(*) FROM learners');
        
        return {
            users,
            pagination: {
                total: Number.parseInt(count),
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    async findUsers(searchTerm) {
        const { rows } = await db.query(
            `SELECT id, name, email, created_at 
             FROM learners 
             WHERE name ILIKE $1 OR email ILIKE $2 
             ORDER BY name`,
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        return rows;
    }

    async getUserWithProgress(userId) {
        // Get user details
        const { rows: [user] } = await db.query(
            `SELECT id, name, email, created_at, updated_at, is_email_verified 
             FROM learners 
             WHERE id = $1`,
            [userId]
        );

        if (!user) return null;

        // Get user's course progress with statistics (calculated dynamically)
        const { rows: courses } = await db.query(
            `SELECT 
                c.id, 
                c.title, 
                c.language,
                c.expected_duration,
                c.course_data,
                c.is_completed,
                c.total_lessons,
                c.total_units,
                c.created_at,
                c.updated_at as last_accessed,
                'ai' as course_type,
                COALESCE((
                    SELECT COUNT(*) 
                    FROM lesson_progress lp 
                    WHERE lp.learner_id = c.learner_id AND lp.course_id = c.id AND lp.is_completed = true
                ), 0) as lessons_completed,
                COALESCE((
                    SELECT COUNT(*) 
                    FROM unit_progress up 
                    WHERE up.learner_id = c.learner_id AND up.course_id = c.id AND up.is_completed = true
                ), 0) as units_completed,
                ROUND(
                    COALESCE((
                        SELECT COUNT(*) 
                        FROM lesson_progress lp 
                        WHERE lp.learner_id = c.learner_id AND lp.course_id = c.id AND lp.is_completed = true
                    ), 0) * 100.0 /
                    GREATEST(c.total_lessons, 1), 1
                ) as progress_percentage
             FROM courses c
             WHERE c.learner_id = $1
             ORDER BY c.updated_at DESC`,
            [userId]
        );

        // Get overall summary statistics (fixed to avoid row multiplication)
        const { rows: [summary] } = await db.query(
            `SELECT 
                COALESCE((SELECT SUM(xp_earned) FROM lesson_progress WHERE learner_id = $1), 0) as total_xp,
                COALESCE((SELECT COUNT(DISTINCT lesson_id) FROM lesson_progress WHERE learner_id = $1 AND is_completed = true), 0) as lessons_completed,
                COALESCE((SELECT COUNT(DISTINCT unit_id) FROM unit_progress WHERE learner_id = $1 AND is_completed = true), 0) as units_completed,
                COALESCE((SELECT MAX(current_streak) FROM user_stats WHERE learner_id = $1), 0) as current_streak,
                COALESCE((SELECT MAX(longest_streak) FROM user_stats WHERE learner_id = $1), 0) as longest_streak,
                (SELECT MAX(last_activity_date) FROM user_stats WHERE learner_id = $1) as last_activity_date`,
            [userId]
        );

        return {
            user,
            summary,
            courses
        };
    }

    async updateUserData(userId, updateData) {
        const { name, email } = updateData;
        const { rows: [updatedUser] } = await db.query(
            `UPDATE learners 
             SET name = COALESCE($1, name),
                 email = COALESCE($2, email),
                 updated_at = NOW()
             WHERE id = $3
             RETURNING id, name, email, created_at, updated_at`,
            [name, email, userId]
        );
        return updatedUser;
    }

    async deleteUser(userId) {
        await db.query(
            'DELETE FROM learners WHERE id = $1',
            [userId]
        );
    }
}

export default new UserManagementService();
