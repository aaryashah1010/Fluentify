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
                total: parseInt(count),
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
            `SELECT id, name, email, created_at, updated_at 
             FROM learners 
             WHERE id = $1`,
            [userId]
        );

        if (!user) return null;

        // Get user's course progress with statistics (calculated dynamically)
        const { rows: progress } = await db.query(
            `SELECT 
                c.id, 
                c.title, 
                c.language,
                c.is_completed,
                c.total_lessons,
                c.total_units,
                c.updated_at as last_accessed,
                COALESCE((
                    SELECT SUM(lp.xp_earned) 
                    FROM lesson_progress lp 
                    WHERE lp.learner_id = c.learner_id AND lp.course_id = c.id
                ), 0) as total_xp,
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
                COALESCE(us.current_streak, 0) as current_streak,
                us.last_activity_date,
                ROUND(
                    COALESCE((
                        SELECT COUNT(*) 
                        FROM lesson_progress lp 
                        WHERE lp.learner_id = c.learner_id AND lp.course_id = c.id AND lp.is_completed = true
                    ), 0) * 100.0 /
                    GREATEST((c.course_data->'metadata'->>'totalLessons')::int, 1), 1
                ) as progress_percentage
             FROM courses c
             LEFT JOIN user_stats us ON c.id = us.course_id AND c.learner_id = us.learner_id
             WHERE c.learner_id = $1
             ORDER BY c.updated_at DESC`,
            [userId]
        );

        return {
            ...user,
            courses: progress
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
