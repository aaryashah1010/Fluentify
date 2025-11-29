// @ts-nocheck
import db from '../config/db.js';

class ModuleAdminRepository {
  // ==================== Language Operations ====================
  
  /**
   * Get all unique languages from language_modules
   */
  async getLanguages() {
    const result = await db.query(
      `SELECT DISTINCT language, COUNT(*) as course_count
       FROM language_modules
       GROUP BY language
       ORDER BY language`
    );
    return result.rows;
  }

  /**
   * Get all courses for a specific language
   */
  async getCoursesByLanguage(language) {
    const result = await db.query(
      `SELECT lm.*, 
              COUNT(DISTINCT mu.id) as unit_count,
              COUNT(DISTINCT ml.id) as lesson_count
       FROM language_modules lm
       LEFT JOIN module_units mu ON lm.id = mu.module_id
       LEFT JOIN module_lessons ml ON mu.id = ml.unit_id
       WHERE lm.language = $1
       GROUP BY lm.id
       ORDER BY lm.created_at DESC`,
      [language]
    );
    return result.rows;
  }

  // ==================== Course (Module) Operations ====================
  
  /**
   * Create a new course
   */
  async createCourse(courseData) {
    const { admin_id, language, level, title, description, thumbnail_url, estimated_duration, is_published } = courseData;
    
    const result = await db.query(
      `INSERT INTO language_modules 
       (admin_id, language, level, title, description, thumbnail_url, estimated_duration, is_published, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [admin_id, language, level, title, description, thumbnail_url, estimated_duration, is_published || false]
    );
    return result.rows[0];
  }

  /**
   * Get course details with all units and lessons
   */
  async getCourseDetails(courseId) {
    // Get course
    const courseResult = await db.query(
      'SELECT * FROM language_modules WHERE id = $1',
      [courseId]
    );
    
    if (courseResult.rows.length === 0) {
      return null;
    }
    
    const course = courseResult.rows[0];
    
    // Get units with lessons
    const unitsResult = await db.query(
      `SELECT mu.*,
              COUNT(ml.id) as lesson_count
       FROM module_units mu
       LEFT JOIN module_lessons ml ON mu.id = ml.unit_id
       WHERE mu.module_id = $1
       GROUP BY mu.id
       ORDER BY mu.id`,
      [courseId]
    );
    
    const units = unitsResult.rows;
    
    // Get lessons for each unit
    for (const unit of units) {
      const lessonsResult = await db.query(
        `SELECT * FROM module_lessons 
         WHERE unit_id = $1 
         ORDER BY id`,
        [unit.id]
      );
      unit.lessons = lessonsResult.rows;
    }
    
    course.units = units;
    return course;
  }

  /**
   * Update a course
   */
  async updateCourse(courseId, courseData) {
    const { language, level, title, description, thumbnail_url, estimated_duration, is_published } = courseData;
    
    const result = await db.query(
      `UPDATE language_modules 
       SET language = COALESCE($1, language),
           level = COALESCE($2, level),
           title = COALESCE($3, title),
           description = COALESCE($4, description),
           thumbnail_url = COALESCE($5, thumbnail_url),
           estimated_duration = COALESCE($6, estimated_duration),
           is_published = COALESCE($7, is_published),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [language, level, title, description, thumbnail_url, estimated_duration, is_published, courseId]
    );
    
    return result.rows[0];
  }

  /**
   * Delete a course (cascade will delete units and lessons)
   */
  async deleteCourse(courseId) {
    const result = await db.query(
      'DELETE FROM language_modules WHERE id = $1 RETURNING *',
      [courseId]
    );
    return result.rows[0];
  }

  /**
   * Update course counts
   */
  async updateCourseCounts(courseId) {
    await db.query(
      `UPDATE language_modules
       SET total_units = (SELECT COUNT(*) FROM module_units WHERE module_id = $1),
           total_lessons = (SELECT COUNT(*) FROM module_lessons ml 
                           JOIN module_units mu ON ml.unit_id = mu.id 
                           WHERE mu.module_id = $1),
           updated_at = NOW()
       WHERE id = $1`,
      [courseId]
    );
  }

  // ==================== Unit Operations ====================
  
  /**
   * Create a new unit
   */
  async createUnit(unitData) {
    const { module_id, title, description, difficulty, estimated_time } = unitData;
    
    const result = await db.query(
      `INSERT INTO module_units 
       (module_id, title, description, difficulty, estimated_time, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [module_id, title, description, difficulty, estimated_time || 0]
    );
    
    // Update course counts
    await this.updateCourseCounts(module_id);
    
    return result.rows[0];
  }

  /**
   * Get unit by ID
   */
  async getUnitById(unitId) {
    const result = await db.query(
      'SELECT * FROM module_units WHERE id = $1',
      [unitId]
    );
    return result.rows[0];
  }

  /**
   * Update a unit
   */
  async updateUnit(unitId, unitData) {
    const { title, description, difficulty, estimated_time } = unitData;
    
    const result = await db.query(
      `UPDATE module_units 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           difficulty = COALESCE($3, difficulty),
           estimated_time = COALESCE($4, estimated_time),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [title, description, difficulty, estimated_time, unitId]
    );
    
    return result.rows[0];
  }

  /**
   * Delete a unit (cascade will delete lessons)
   */
  async deleteUnit(unitId) {
    // Get module_id before deletion
    const unit = await this.getUnitById(unitId);
    if (!unit) return null;
    
    const result = await db.query(
      'DELETE FROM module_units WHERE id = $1 RETURNING *',
      [unitId]
    );
    
    // Update course counts
    await this.updateCourseCounts(unit.module_id);
    
    return result.rows[0];
  }

  // ==================== Lesson Operations ====================
  
  /**
   * Create a new lesson
   */
  async createLesson(lessonData) {
    const { 
      unit_id, title, content_type, description, media_url, 
      key_phrases, vocabulary, grammar_points, exercises, xp_reward 
    } = lessonData;
    
    const result = await db.query(
      `INSERT INTO module_lessons 
       (unit_id, title, content_type, description, media_url, key_phrases, 
        vocabulary, grammar_points, exercises, xp_reward, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
       RETURNING *`,
      [
        unit_id, title, content_type, description, media_url,
        key_phrases || [], vocabulary || {}, grammar_points || {}, 
        exercises || {}, xp_reward || 0
      ]
    );
    
    // Get module_id and update course counts
    const unit = await this.getUnitById(unit_id);
    if (unit) {
      await this.updateCourseCounts(unit.module_id);
    }
    
    return result.rows[0];
  }

  /**
   * Get lesson by ID
   */
  async getLessonById(lessonId) {
    const result = await db.query(
      'SELECT * FROM module_lessons WHERE id = $1',
      [lessonId]
    );
    return result.rows[0];
  }

  /**
   * Update a lesson
   */
  async updateLesson(lessonId, lessonData) {
    const { 
      title, content_type, description, media_url, 
      key_phrases, vocabulary, grammar_points, exercises, xp_reward 
    } = lessonData;
    
    const result = await db.query(
      `UPDATE module_lessons 
       SET title = COALESCE($1, title),
           content_type = COALESCE($2, content_type),
           description = COALESCE($3, description),
           media_url = COALESCE($4, media_url),
           key_phrases = COALESCE($5, key_phrases),
           vocabulary = COALESCE($6, vocabulary),
           grammar_points = COALESCE($7, grammar_points),
           exercises = COALESCE($8, exercises),
           xp_reward = COALESCE($9, xp_reward),
           updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [title, content_type, description, media_url, key_phrases, vocabulary, 
       grammar_points, exercises, xp_reward, lessonId]
    );
    
    return result.rows[0];
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(lessonId) {
    // Get unit_id and module_id before deletion
    const lesson = await this.getLessonById(lessonId);
    if (!lesson) return null;
    
    const unit = await this.getUnitById(lesson.unit_id);
    
    const result = await db.query(
      'DELETE FROM module_lessons WHERE id = $1 RETURNING *',
      [lessonId]
    );
    
    // Update course counts
    if (unit) {
      await this.updateCourseCounts(unit.module_id);
    }
    
    return result.rows[0];
  }

  // ==================== Published Courses (Learner View) ====================

  /**
   * Get all published languages for learners
   */
  async getPublishedLanguages() {
    const result = await db.query(
      `SELECT DISTINCT language, COUNT(*) as course_count
       FROM language_modules
       WHERE is_published = true
       GROUP BY language
       ORDER BY language`
    );
    return result.rows;
  }

  /**
   * Get published courses for a specific language for learners
   */
  async getPublishedCoursesByLanguage(language) {
    const result = await db.query(
      `SELECT lm.*, 
              COUNT(DISTINCT mu.id) as total_units,
              COUNT(DISTINCT ml.id) as total_lessons
       FROM language_modules lm
       LEFT JOIN module_units mu ON lm.id = mu.module_id
       LEFT JOIN module_lessons ml ON mu.id = ml.unit_id
       WHERE lm.language = $1 AND lm.is_published = true
       GROUP BY lm.id
       ORDER BY lm.created_at DESC`,
      [language]
    );
    return result.rows;
  }

  /**
   * Get published course details with units and lessons for learners
   */
  async getPublishedCourseDetails(courseId) {
    // Get course
    const courseResult = await db.query(
      'SELECT * FROM language_modules WHERE id = $1 AND is_published = true',
      [courseId]
    );
    
    if (courseResult.rows.length === 0) {
      return null;
    }
    
    const course = courseResult.rows[0];
    
    // Get units with lessons
    const unitsResult = await db.query(
      `SELECT mu.*,
              COUNT(ml.id) as lesson_count
       FROM module_units mu
       LEFT JOIN module_lessons ml ON mu.id = ml.unit_id
       WHERE mu.module_id = $1
       GROUP BY mu.id
       ORDER BY mu.id`,
      [courseId]
    );
    
    const units = unitsResult.rows;
    
    // Get lessons for each unit
    for (const unit of units) {
      const lessonsResult = await db.query(
        `SELECT * FROM module_lessons 
         WHERE unit_id = $1 
         ORDER BY id`,
        [unit.id]
      );
      unit.lessons = lessonsResult.rows;
    }
    
    course.units = units;
    return course;
  }
}

export default new ModuleAdminRepository();
