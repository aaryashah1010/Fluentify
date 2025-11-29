// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import db from '../config/db.js';
class ModuleAdminRepository {
  // ==================== Language Operations ====================

  /**
   * Get all unique languages from language_modules
   */
  async getLanguages() {
    if (stryMutAct_9fa48("2687")) {
      {}
    } else {
      stryCov_9fa48("2687");
      const result = await db.query(stryMutAct_9fa48("2688") ? `` : (stryCov_9fa48("2688"), `SELECT DISTINCT language, COUNT(*) as course_count
       FROM language_modules
       GROUP BY language
       ORDER BY language`));
      return result.rows;
    }
  }

  /**
   * Get all courses for a specific language
   */
  async getCoursesByLanguage(language) {
    if (stryMutAct_9fa48("2689")) {
      {}
    } else {
      stryCov_9fa48("2689");
      const result = await db.query(stryMutAct_9fa48("2690") ? `` : (stryCov_9fa48("2690"), `SELECT lm.*, 
              COUNT(DISTINCT mu.id) as unit_count,
              COUNT(DISTINCT ml.id) as lesson_count
       FROM language_modules lm
       LEFT JOIN module_units mu ON lm.id = mu.module_id
       LEFT JOIN module_lessons ml ON mu.id = ml.unit_id
       WHERE lm.language = $1
       GROUP BY lm.id
       ORDER BY lm.created_at DESC`), stryMutAct_9fa48("2691") ? [] : (stryCov_9fa48("2691"), [language]));
      return result.rows;
    }
  }

  // ==================== Course (Module) Operations ====================

  /**
   * Create a new course
   */
  async createCourse(courseData) {
    if (stryMutAct_9fa48("2692")) {
      {}
    } else {
      stryCov_9fa48("2692");
      const {
        admin_id,
        language,
        level,
        title,
        description,
        thumbnail_url,
        estimated_duration,
        is_published
      } = courseData;
      const result = await db.query(stryMutAct_9fa48("2693") ? `` : (stryCov_9fa48("2693"), `INSERT INTO language_modules 
       (admin_id, language, level, title, description, thumbnail_url, estimated_duration, is_published, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`), stryMutAct_9fa48("2694") ? [] : (stryCov_9fa48("2694"), [admin_id, language, level, title, description, thumbnail_url, estimated_duration, stryMutAct_9fa48("2697") ? is_published && false : stryMutAct_9fa48("2696") ? false : stryMutAct_9fa48("2695") ? true : (stryCov_9fa48("2695", "2696", "2697"), is_published || (stryMutAct_9fa48("2698") ? true : (stryCov_9fa48("2698"), false)))]));
      return result.rows[0];
    }
  }

  /**
   * Get course details with all units and lessons
   */
  async getCourseDetails(courseId) {
    if (stryMutAct_9fa48("2699")) {
      {}
    } else {
      stryCov_9fa48("2699");
      // Get course
      const courseResult = await db.query(stryMutAct_9fa48("2700") ? "" : (stryCov_9fa48("2700"), 'SELECT * FROM language_modules WHERE id = $1'), stryMutAct_9fa48("2701") ? [] : (stryCov_9fa48("2701"), [courseId]));
      if (stryMutAct_9fa48("2704") ? courseResult.rows.length !== 0 : stryMutAct_9fa48("2703") ? false : stryMutAct_9fa48("2702") ? true : (stryCov_9fa48("2702", "2703", "2704"), courseResult.rows.length === 0)) {
        if (stryMutAct_9fa48("2705")) {
          {}
        } else {
          stryCov_9fa48("2705");
          return null;
        }
      }
      const course = courseResult.rows[0];

      // Get units with lessons
      const unitsResult = await db.query(stryMutAct_9fa48("2706") ? `` : (stryCov_9fa48("2706"), `SELECT mu.*,
              COUNT(ml.id) as lesson_count
       FROM module_units mu
       LEFT JOIN module_lessons ml ON mu.id = ml.unit_id
       WHERE mu.module_id = $1
       GROUP BY mu.id
       ORDER BY mu.id`), stryMutAct_9fa48("2707") ? [] : (stryCov_9fa48("2707"), [courseId]));
      const units = unitsResult.rows;

      // Get lessons for each unit
      for (const unit of units) {
        if (stryMutAct_9fa48("2708")) {
          {}
        } else {
          stryCov_9fa48("2708");
          const lessonsResult = await db.query(stryMutAct_9fa48("2709") ? `` : (stryCov_9fa48("2709"), `SELECT * FROM module_lessons 
         WHERE unit_id = $1 
         ORDER BY id`), stryMutAct_9fa48("2710") ? [] : (stryCov_9fa48("2710"), [unit.id]));
          unit.lessons = lessonsResult.rows;
        }
      }
      course.units = units;
      return course;
    }
  }

  /**
   * Update a course
   */
  async updateCourse(courseId, courseData) {
    if (stryMutAct_9fa48("2711")) {
      {}
    } else {
      stryCov_9fa48("2711");
      const {
        language,
        level,
        title,
        description,
        thumbnail_url,
        estimated_duration,
        is_published
      } = courseData;
      const result = await db.query(stryMutAct_9fa48("2712") ? `` : (stryCov_9fa48("2712"), `UPDATE language_modules 
       SET language = COALESCE($1, language),
           level = COALESCE($2, level),
           title = COALESCE($3, title),
           description = COALESCE($4, description),
           thumbnail_url = COALESCE($5, thumbnail_url),
           estimated_duration = COALESCE($6, estimated_duration),
           is_published = COALESCE($7, is_published),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`), stryMutAct_9fa48("2713") ? [] : (stryCov_9fa48("2713"), [language, level, title, description, thumbnail_url, estimated_duration, is_published, courseId]));
      return result.rows[0];
    }
  }

  /**
   * Delete a course (cascade will delete units and lessons)
   */
  async deleteCourse(courseId) {
    if (stryMutAct_9fa48("2714")) {
      {}
    } else {
      stryCov_9fa48("2714");
      const result = await db.query(stryMutAct_9fa48("2715") ? "" : (stryCov_9fa48("2715"), 'DELETE FROM language_modules WHERE id = $1 RETURNING *'), stryMutAct_9fa48("2716") ? [] : (stryCov_9fa48("2716"), [courseId]));
      return result.rows[0];
    }
  }

  /**
   * Update course counts
   */
  async updateCourseCounts(courseId) {
    if (stryMutAct_9fa48("2717")) {
      {}
    } else {
      stryCov_9fa48("2717");
      await db.query(stryMutAct_9fa48("2718") ? `` : (stryCov_9fa48("2718"), `UPDATE language_modules
       SET total_units = (SELECT COUNT(*) FROM module_units WHERE module_id = $1),
           total_lessons = (SELECT COUNT(*) FROM module_lessons ml 
                           JOIN module_units mu ON ml.unit_id = mu.id 
                           WHERE mu.module_id = $1),
           updated_at = NOW()
       WHERE id = $1`), stryMutAct_9fa48("2719") ? [] : (stryCov_9fa48("2719"), [courseId]));
    }
  }

  // ==================== Unit Operations ====================

  /**
   * Create a new unit
   */
  async createUnit(unitData) {
    if (stryMutAct_9fa48("2720")) {
      {}
    } else {
      stryCov_9fa48("2720");
      const {
        module_id,
        title,
        description,
        difficulty,
        estimated_time
      } = unitData;
      const result = await db.query(stryMutAct_9fa48("2721") ? `` : (stryCov_9fa48("2721"), `INSERT INTO module_units 
       (module_id, title, description, difficulty, estimated_time, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`), stryMutAct_9fa48("2722") ? [] : (stryCov_9fa48("2722"), [module_id, title, description, difficulty, stryMutAct_9fa48("2725") ? estimated_time && 0 : stryMutAct_9fa48("2724") ? false : stryMutAct_9fa48("2723") ? true : (stryCov_9fa48("2723", "2724", "2725"), estimated_time || 0)]));

      // Update course counts
      await this.updateCourseCounts(module_id);
      return result.rows[0];
    }
  }

  /**
   * Get unit by ID
   */
  async getUnitById(unitId) {
    if (stryMutAct_9fa48("2726")) {
      {}
    } else {
      stryCov_9fa48("2726");
      const result = await db.query(stryMutAct_9fa48("2727") ? "" : (stryCov_9fa48("2727"), 'SELECT * FROM module_units WHERE id = $1'), stryMutAct_9fa48("2728") ? [] : (stryCov_9fa48("2728"), [unitId]));
      return result.rows[0];
    }
  }

  /**
   * Update a unit
   */
  async updateUnit(unitId, unitData) {
    if (stryMutAct_9fa48("2729")) {
      {}
    } else {
      stryCov_9fa48("2729");
      const {
        title,
        description,
        difficulty,
        estimated_time
      } = unitData;
      const result = await db.query(stryMutAct_9fa48("2730") ? `` : (stryCov_9fa48("2730"), `UPDATE module_units 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           difficulty = COALESCE($3, difficulty),
           estimated_time = COALESCE($4, estimated_time),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`), stryMutAct_9fa48("2731") ? [] : (stryCov_9fa48("2731"), [title, description, difficulty, estimated_time, unitId]));
      return result.rows[0];
    }
  }

  /**
   * Delete a unit (cascade will delete lessons)
   */
  async deleteUnit(unitId) {
    if (stryMutAct_9fa48("2732")) {
      {}
    } else {
      stryCov_9fa48("2732");
      // Get module_id before deletion
      const unit = await this.getUnitById(unitId);
      if (stryMutAct_9fa48("2735") ? false : stryMutAct_9fa48("2734") ? true : stryMutAct_9fa48("2733") ? unit : (stryCov_9fa48("2733", "2734", "2735"), !unit)) return null;
      const result = await db.query(stryMutAct_9fa48("2736") ? "" : (stryCov_9fa48("2736"), 'DELETE FROM module_units WHERE id = $1 RETURNING *'), stryMutAct_9fa48("2737") ? [] : (stryCov_9fa48("2737"), [unitId]));

      // Update course counts
      await this.updateCourseCounts(unit.module_id);
      return result.rows[0];
    }
  }

  // ==================== Lesson Operations ====================

  /**
   * Create a new lesson
   */
  async createLesson(lessonData) {
    if (stryMutAct_9fa48("2738")) {
      {}
    } else {
      stryCov_9fa48("2738");
      const {
        unit_id,
        title,
        content_type,
        description,
        media_url,
        key_phrases,
        vocabulary,
        grammar_points,
        exercises,
        xp_reward
      } = lessonData;
      const result = await db.query(stryMutAct_9fa48("2739") ? `` : (stryCov_9fa48("2739"), `INSERT INTO module_lessons 
       (unit_id, title, content_type, description, media_url, key_phrases, 
        vocabulary, grammar_points, exercises, xp_reward, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
       RETURNING *`), stryMutAct_9fa48("2740") ? [] : (stryCov_9fa48("2740"), [unit_id, title, content_type, description, media_url, stryMutAct_9fa48("2743") ? key_phrases && [] : stryMutAct_9fa48("2742") ? false : stryMutAct_9fa48("2741") ? true : (stryCov_9fa48("2741", "2742", "2743"), key_phrases || (stryMutAct_9fa48("2744") ? ["Stryker was here"] : (stryCov_9fa48("2744"), []))), stryMutAct_9fa48("2747") ? vocabulary && {} : stryMutAct_9fa48("2746") ? false : stryMutAct_9fa48("2745") ? true : (stryCov_9fa48("2745", "2746", "2747"), vocabulary || {}), stryMutAct_9fa48("2750") ? grammar_points && {} : stryMutAct_9fa48("2749") ? false : stryMutAct_9fa48("2748") ? true : (stryCov_9fa48("2748", "2749", "2750"), grammar_points || {}), stryMutAct_9fa48("2753") ? exercises && {} : stryMutAct_9fa48("2752") ? false : stryMutAct_9fa48("2751") ? true : (stryCov_9fa48("2751", "2752", "2753"), exercises || {}), stryMutAct_9fa48("2756") ? xp_reward && 0 : stryMutAct_9fa48("2755") ? false : stryMutAct_9fa48("2754") ? true : (stryCov_9fa48("2754", "2755", "2756"), xp_reward || 0)]));

      // Get module_id and update course counts
      const unit = await this.getUnitById(unit_id);
      if (stryMutAct_9fa48("2758") ? false : stryMutAct_9fa48("2757") ? true : (stryCov_9fa48("2757", "2758"), unit)) {
        if (stryMutAct_9fa48("2759")) {
          {}
        } else {
          stryCov_9fa48("2759");
          await this.updateCourseCounts(unit.module_id);
        }
      }
      return result.rows[0];
    }
  }

  /**
   * Get lesson by ID
   */
  async getLessonById(lessonId) {
    if (stryMutAct_9fa48("2760")) {
      {}
    } else {
      stryCov_9fa48("2760");
      const result = await db.query(stryMutAct_9fa48("2761") ? "" : (stryCov_9fa48("2761"), 'SELECT * FROM module_lessons WHERE id = $1'), stryMutAct_9fa48("2762") ? [] : (stryCov_9fa48("2762"), [lessonId]));
      return result.rows[0];
    }
  }

  /**
   * Update a lesson
   */
  async updateLesson(lessonId, lessonData) {
    if (stryMutAct_9fa48("2763")) {
      {}
    } else {
      stryCov_9fa48("2763");
      const {
        title,
        content_type,
        description,
        media_url,
        key_phrases,
        vocabulary,
        grammar_points,
        exercises,
        xp_reward
      } = lessonData;
      const result = await db.query(stryMutAct_9fa48("2764") ? `` : (stryCov_9fa48("2764"), `UPDATE module_lessons 
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
       RETURNING *`), stryMutAct_9fa48("2765") ? [] : (stryCov_9fa48("2765"), [title, content_type, description, media_url, key_phrases, vocabulary, grammar_points, exercises, xp_reward, lessonId]));
      return result.rows[0];
    }
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(lessonId) {
    if (stryMutAct_9fa48("2766")) {
      {}
    } else {
      stryCov_9fa48("2766");
      // Get unit_id and module_id before deletion
      const lesson = await this.getLessonById(lessonId);
      if (stryMutAct_9fa48("2769") ? false : stryMutAct_9fa48("2768") ? true : stryMutAct_9fa48("2767") ? lesson : (stryCov_9fa48("2767", "2768", "2769"), !lesson)) return null;
      const unit = await this.getUnitById(lesson.unit_id);
      const result = await db.query(stryMutAct_9fa48("2770") ? "" : (stryCov_9fa48("2770"), 'DELETE FROM module_lessons WHERE id = $1 RETURNING *'), stryMutAct_9fa48("2771") ? [] : (stryCov_9fa48("2771"), [lessonId]));

      // Update course counts
      if (stryMutAct_9fa48("2773") ? false : stryMutAct_9fa48("2772") ? true : (stryCov_9fa48("2772", "2773"), unit)) {
        if (stryMutAct_9fa48("2774")) {
          {}
        } else {
          stryCov_9fa48("2774");
          await this.updateCourseCounts(unit.module_id);
        }
      }
      return result.rows[0];
    }
  }

  // ==================== Published Courses (Learner View) ====================

  /**
   * Get all published languages for learners
   */
  async getPublishedLanguages() {
    if (stryMutAct_9fa48("2775")) {
      {}
    } else {
      stryCov_9fa48("2775");
      const result = await db.query(stryMutAct_9fa48("2776") ? `` : (stryCov_9fa48("2776"), `SELECT DISTINCT language, COUNT(*) as course_count
       FROM language_modules
       WHERE is_published = true
       GROUP BY language
       ORDER BY language`));
      return result.rows;
    }
  }

  /**
   * Get published courses for a specific language for learners
   */
  async getPublishedCoursesByLanguage(language) {
    if (stryMutAct_9fa48("2777")) {
      {}
    } else {
      stryCov_9fa48("2777");
      const result = await db.query(stryMutAct_9fa48("2778") ? `` : (stryCov_9fa48("2778"), `SELECT lm.*, 
              COUNT(DISTINCT mu.id) as total_units,
              COUNT(DISTINCT ml.id) as total_lessons
       FROM language_modules lm
       LEFT JOIN module_units mu ON lm.id = mu.module_id
       LEFT JOIN module_lessons ml ON mu.id = ml.unit_id
       WHERE lm.language = $1 AND lm.is_published = true
       GROUP BY lm.id
       ORDER BY lm.created_at DESC`), stryMutAct_9fa48("2779") ? [] : (stryCov_9fa48("2779"), [language]));
      return result.rows;
    }
  }

  /**
   * Get published course details with units and lessons for learners
   */
  async getPublishedCourseDetails(courseId) {
    if (stryMutAct_9fa48("2780")) {
      {}
    } else {
      stryCov_9fa48("2780");
      // Get course
      const courseResult = await db.query(stryMutAct_9fa48("2781") ? "" : (stryCov_9fa48("2781"), 'SELECT * FROM language_modules WHERE id = $1 AND is_published = true'), stryMutAct_9fa48("2782") ? [] : (stryCov_9fa48("2782"), [courseId]));
      if (stryMutAct_9fa48("2785") ? courseResult.rows.length !== 0 : stryMutAct_9fa48("2784") ? false : stryMutAct_9fa48("2783") ? true : (stryCov_9fa48("2783", "2784", "2785"), courseResult.rows.length === 0)) {
        if (stryMutAct_9fa48("2786")) {
          {}
        } else {
          stryCov_9fa48("2786");
          return null;
        }
      }
      const course = courseResult.rows[0];

      // Get units with lessons
      const unitsResult = await db.query(stryMutAct_9fa48("2787") ? `` : (stryCov_9fa48("2787"), `SELECT mu.*,
              COUNT(ml.id) as lesson_count
       FROM module_units mu
       LEFT JOIN module_lessons ml ON mu.id = ml.unit_id
       WHERE mu.module_id = $1
       GROUP BY mu.id
       ORDER BY mu.id`), stryMutAct_9fa48("2788") ? [] : (stryCov_9fa48("2788"), [courseId]));
      const units = unitsResult.rows;

      // Get lessons for each unit
      for (const unit of units) {
        if (stryMutAct_9fa48("2789")) {
          {}
        } else {
          stryCov_9fa48("2789");
          const lessonsResult = await db.query(stryMutAct_9fa48("2790") ? `` : (stryCov_9fa48("2790"), `SELECT * FROM module_lessons 
         WHERE unit_id = $1 
         ORDER BY id`), stryMutAct_9fa48("2791") ? [] : (stryCov_9fa48("2791"), [unit.id]));
          unit.lessons = lessonsResult.rows;
        }
      }
      course.units = units;
      return course;
    }
  }
}
export default new ModuleAdminRepository();