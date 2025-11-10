import db from '../config/db.js';

class CourseRepository {
  /**
   * Find active course by language and user
   */
  async findActiveCourseByLanguage(userId, language) {
    const result = await db.query(
      'SELECT * FROM courses WHERE learner_id = $1 AND language = $2 AND is_active = $3',
      [userId, language, true]
    );
    return result.rows[0] || null;
  }

  /**
   * Create a new course
   */
  async createCourse(userId, language, expectedDuration, courseData) {
    // Extract metadata from courseData
    const title = courseData.course?.title || `${language} Learning Journey`;
    const description = courseData.course?.description || `Learn ${language} in ${expectedDuration}`;
    const totalLessons = courseData.metadata?.totalLessons || 0;
    const totalUnits = courseData.metadata?.totalUnits || 0;
    const estimatedTotalTime = courseData.metadata?.estimatedTotalTime || 0;

    const result = await db.query(
      `INSERT INTO courses (
        learner_id, language, expected_duration, title, description,
        total_lessons, total_units, estimated_total_time,
        course_data, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING id`,
      [userId, language, expectedDuration, title, description, totalLessons, totalUnits, estimatedTotalTime, courseData, true]
    );
    const courseId = result.rows[0].id;

    // Populate course_units and course_lessons tables
    await this.populateCourseStructure(courseId, courseData);

    return courseId;
  }

  /**
   * Update course data (for streaming generation)
   */
  async updateCourseData(courseId, courseData) {
    const totalLessons = courseData.metadata?.totalLessons || 0;
    const totalUnits = courseData.metadata?.totalUnits || 0;
    const estimatedTotalTime = courseData.metadata?.estimatedTotalTime || 0;

    await db.query(
      `UPDATE courses 
       SET course_data = $1, 
           total_lessons = $2, 
           total_units = $3, 
           estimated_total_time = $4,
           updated_at = NOW()
       WHERE id = $5`,
      [courseData, totalLessons, totalUnits, estimatedTotalTime, courseId]
    );
  }

  /**
   * Populate course_units and course_lessons tables from courseData
   */
  async populateCourseStructure(courseId, courseData) {
    const units = courseData.course?.units || [];

    for (const unit of units) {
      // Insert unit
      const unitResult = await db.query(
        `INSERT INTO course_units (
          course_id, unit_id, title, description, difficulty, estimated_time, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`,
        [
          courseId,
          unit.id,
          unit.title,
          unit.description,
          unit.difficulty,
          parseInt(unit.estimatedTime) || unit.estimatedTime?.match(/\d+/)?.[0] || 150
        ]
      );
      const unitDbId = unitResult.rows[0].id;

      // Insert lessons for this unit
      const lessons = unit.lessons || [];
      for (const lesson of lessons) {
        await db.query(
          `INSERT INTO course_lessons (
            course_id, unit_id, lesson_id, title, lesson_type, description,
            key_phrases, vocabulary, grammar_points, exercises,
            estimated_duration, xp_reward, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, $11, $12, NOW(), NOW())`,
          [
            courseId,
            unitDbId,
            lesson.id,
            lesson.title,
            lesson.type || lesson.lessonType || 'vocabulary',
            lesson.description || '',
            lesson.keyPhrases || lesson.key_phrases || [],
            JSON.stringify(lesson.vocabulary || {}),
            JSON.stringify(lesson.grammarPoints || lesson.grammar_points || {}),
            JSON.stringify(lesson.exercises || []),
            lesson.estimatedDuration || lesson.duration || 15,
            lesson.xpReward || lesson.xp_reward || 50
          ]
        );
      }
    }
  }

  /**
   * Find lesson database ID by course, unit number, and lesson number
   */
  async findLessonDbId(courseId, unitNumber, lessonNumber) {
    const result = await db.query(
      `SELECT cl.id 
       FROM course_lessons cl
       JOIN course_units cu ON cl.unit_id = cu.id
       WHERE cl.course_id = $1 AND cu.unit_id = $2 AND cl.lesson_id = $3
       LIMIT 1`,
      [courseId, unitNumber, lessonNumber]
    );
    return result.rows[0]?.id || null;
  }

  /**
   * Find learner courses with stats
   */
  /**
   * FIX: Find all learner courses with stats - includes both AI courses and enrolled admin courses
   * This ensures user management shows all enrolled courses, not just AI-generated ones
   */
  async findLearnerCoursesWithStats(userId) {
    const result = await db.query(
      `-- Part 1: AI-generated courses for this learner
       SELECT 
        c.id,
        c.learner_id,
        c.language,
        c.title,
        c.description,
        c.course_data,
        c.total_lessons,
        c.total_units,
        c.created_at,
        c.expected_duration,
        'ai' as course_type,
        COALESCE((
          SELECT SUM(lp.xp_earned) FROM lesson_progress lp 
          WHERE lp.learner_id = c.learner_id AND lp.course_id = c.id
        ), 0) as total_xp,
        COALESCE((
          SELECT COUNT(*) FROM lesson_progress lp 
          WHERE lp.learner_id = c.learner_id AND lp.course_id = c.id AND lp.is_completed = true
        ), 0) as lessons_completed,
        COALESCE((
          SELECT COUNT(*) FROM unit_progress up 
          WHERE up.learner_id = c.learner_id AND up.course_id = c.id AND up.is_completed = true
        ), 0) as units_completed,
        COALESCE(us.current_streak, 0) as current_streak,
        ROUND(
          COALESCE((
            SELECT COUNT(*) FROM lesson_progress lp 
            WHERE lp.learner_id = c.learner_id AND lp.course_id = c.id AND lp.is_completed = true
          ), 0) * 100.0 / GREATEST(c.total_lessons, 1), 0
        ) as progress_percentage
       FROM courses c
       LEFT JOIN user_stats us ON c.id = us.course_id AND c.learner_id = us.learner_id
       WHERE c.learner_id = $1 AND c.is_active = true
       
       UNION ALL
       
       -- Part 2: Admin-created courses that this learner is enrolled in
       SELECT 
        lm.id,
        $1::int as learner_id,
        lm.language,
        lm.title,
        lm.description,
        NULL::jsonb as course_data,
        lm.total_lessons,
        lm.total_units,
        le.enrolled_at as created_at,
        lm.estimated_duration as expected_duration,
        'admin' as course_type,
        COALESCE((
          SELECT SUM(lp.xp_earned) FROM lesson_progress lp 
          WHERE lp.learner_id = $1 AND lp.course_id = lm.id
        ), 0) as total_xp,
        COALESCE((
          SELECT COUNT(*) FROM lesson_progress lp 
          WHERE lp.learner_id = $1 AND lp.course_id = lm.id AND lp.is_completed = true
        ), 0) as lessons_completed,
        COALESCE((
          SELECT COUNT(*) FROM unit_progress up 
          WHERE up.learner_id = $1 AND up.course_id = lm.id AND up.is_completed = true
        ), 0) as units_completed,
        COALESCE(us2.current_streak, 0) as current_streak,
        ROUND(
          COALESCE((
            SELECT COUNT(*) FROM lesson_progress lp 
            WHERE lp.learner_id = $1 AND lp.course_id = lm.id AND lp.is_completed = true
          ), 0) * 100.0 / GREATEST(lm.total_lessons, 1), 0
        ) as progress_percentage
       FROM learner_enrollments le
       INNER JOIN language_modules lm ON le.module_id = lm.id
       LEFT JOIN user_stats us2 ON lm.id = us2.course_id AND us2.learner_id = $1
       WHERE le.learner_id = $1
       
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  /**
   * Find course by ID and user
   */
  async findCourseById(courseId, userId) {
    const result = await db.query(
      'SELECT * FROM courses WHERE id = $1 AND learner_id = $2 AND is_active = $3',
      [courseId, userId, true]
    );
    return result.rows[0] || null;
  }

  /**
   * Find course data by ID and user
   */
  async findCourseDataById(courseId, userId) {
    const result = await db.query(
      'SELECT course_data FROM courses WHERE id = $1 AND learner_id = $2 AND is_active = $3',
      [courseId, userId, true]
    );
    const row = result.rows[0];
    return row ? { course_data: row.course_data } : null;
  }

  /**
   * Delete course and all related data (CASCADE)
   */
  async deleteCourse(courseId, userId) {
    // Verify course belongs to user
    const course = await db.query(
      'SELECT * FROM courses WHERE id = $1 AND learner_id = $2',
      [courseId, userId]
    );

    if (course.rows.length === 0) {
      return false; // Course not found or doesn't belong to user
    }

    // Delete course (CASCADE will handle all related tables)
    // The database foreign keys with ON DELETE CASCADE will automatically delete:
    // - course_units
    // - course_lessons
    // - unit_progress
    // - lesson_progress
    // - exercise_attempts
    // - user_stats
    await db.query('DELETE FROM courses WHERE id = $1 AND learner_id = $2', [courseId, userId]);

    return true;
  }

  /**
   * Update lesson exercises
   */
  async updateLessonExercises(lessonDbId, exercises) {
    await db.query(
      `UPDATE course_lessons 
       SET exercises = $1::jsonb, updated_at = NOW()
       WHERE id = $2`,
      [JSON.stringify(exercises), lessonDbId]
    );
  }

  /**
   * Find all active courses: AI courses (user-specific) + Admin courses (shared)
   */
  async findAllActiveCourses(userId) {
    console.log('📊 Fetching courses for userId:', userId);
    
    const result = await db.query(
      `-- Part 1: AI-generated courses (ONLY for this specific user)
       SELECT 
        c.id,
        c.language,
        c.title,
        c.description,
        c.total_lessons,
        c.total_units,
        c.learner_id,
        c.created_at,
        'ai' as source_type,
        COALESCE((
          SELECT SUM(lp.xp_earned) FROM lesson_progress lp 
          WHERE lp.learner_id = $1 AND lp.course_id = c.id
        ), 0) as total_xp,
        COALESCE((
          SELECT COUNT(*) FROM lesson_progress lp 
          WHERE lp.learner_id = $1 AND lp.course_id = c.id AND lp.is_completed = true
        ), 0) as lessons_completed,
        COALESCE((
          SELECT COUNT(*) FROM unit_progress up 
          WHERE up.learner_id = $1 AND up.course_id = c.id AND up.is_completed = true
        ), 0) as units_completed,
        COALESCE(us.current_streak, 0) as current_streak
       FROM courses c
       LEFT JOIN user_stats us ON c.id = us.course_id AND us.learner_id = $1
       WHERE c.learner_id = $1 AND c.is_active = true
       
       UNION ALL
       
       -- Part 2: Admin-created courses (visible to ALL users)
       SELECT 
        lm.id,
        lm.language,
        lm.title,
        lm.description,
        lm.total_lessons,
        lm.total_units,
        NULL as learner_id,
        lm.created_at,
        'admin' as source_type,
        0 as total_xp,
        0 as lessons_completed,
        0 as units_completed,
        0 as current_streak
       FROM language_modules lm
       WHERE lm.is_published = true
       
       ORDER BY created_at DESC`,
      [userId]
    );
    
    console.log(`✅ Found ${result.rows.length} courses for user ${userId}`);
    result.rows.forEach(course => {
      console.log(`  - ${course.title} (${course.source_type}) - learner_id: ${course.learner_id || 'N/A (admin course)'}`);
    });
    
    return result.rows;
  }

  // ==================== PUBLIC METHODS (For Published Courses) ====================

  /**
   * Get all unique languages with published courses
   */
  async getPublishedLanguages() {
    const result = await db.query(
      `SELECT DISTINCT language, COUNT(*) as course_count
       FROM language_modules
       WHERE is_published = true
       GROUP BY language
       ORDER BY language ASC`
    );
    return result.rows;
  }

  /**
   * Get all published courses for a specific language
   */
  async getPublishedCoursesByLanguage(language) {
    const result = await db.query(
      `SELECT id, language, level, title, description, thumbnail_url, estimated_duration,
              is_published, total_units, total_lessons, created_at, updated_at
       FROM language_modules
       WHERE language = $1 AND is_published = true
       ORDER BY created_at DESC`,
      [language]
    );
    return result.rows;
  }

  /**
   * Get published course details with units and lessons
   */
  async getPublishedCourseDetails(courseId) {
    const result = await db.query(
      `SELECT id, language, level, title, description, thumbnail_url, estimated_duration,
              is_published, total_units, total_lessons, created_at, updated_at
       FROM language_modules
       WHERE id = $1 AND is_published = true`,
      [courseId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const course = result.rows[0];

    // Fetch units for this course (using module_id, not course_id)
    const unitsResult = await db.query(
      `SELECT id, module_id, title, description, difficulty, estimated_time, created_at
       FROM module_units
       WHERE module_id = $1
       ORDER BY created_at ASC`,
      [courseId]
    );

    const units = unitsResult.rows;

    // Fetch lessons for each unit
    const unitsWithLessons = await Promise.all(
      units.map(async (unit) => {
        const lessonsResult = await db.query(
          `SELECT id, unit_id, title, content_type, description, media_url, 
                  key_phrases, vocabulary, grammar_points, exercises, xp_reward, created_at
           FROM module_lessons
           WHERE unit_id = $1
           ORDER BY created_at ASC`,
          [unit.id]
        );
        return {
          ...unit,
          lessons: lessonsResult.rows
        };
      })
    );

    return {
      ...course,
      units: unitsWithLessons
    };
  }
}

export default new CourseRepository();
