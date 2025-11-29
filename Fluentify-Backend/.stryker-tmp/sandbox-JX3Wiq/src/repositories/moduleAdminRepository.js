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
    if (stryMutAct_9fa48("2525")) {
      {}
    } else {
      stryCov_9fa48("2525");
      const result = await db.query(stryMutAct_9fa48("2526") ? `` : (stryCov_9fa48("2526"), `SELECT DISTINCT language, COUNT(*) as course_count
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
    if (stryMutAct_9fa48("2527")) {
      {}
    } else {
      stryCov_9fa48("2527");
      const result = await db.query(stryMutAct_9fa48("2528") ? `` : (stryCov_9fa48("2528"), `SELECT lm.*, 
              COUNT(DISTINCT mu.id) as unit_count,
              COUNT(DISTINCT ml.id) as lesson_count
       FROM language_modules lm
       LEFT JOIN module_units mu ON lm.id = mu.module_id
       LEFT JOIN module_lessons ml ON mu.id = ml.unit_id
       WHERE lm.language = $1
       GROUP BY lm.id
       ORDER BY lm.created_at DESC`), stryMutAct_9fa48("2529") ? [] : (stryCov_9fa48("2529"), [language]));
      return result.rows;
    }
  }

  // ==================== Course (Module) Operations ====================

  /**
   * Create a new course
   */
  async createCourse(courseData) {
    if (stryMutAct_9fa48("2530")) {
      {}
    } else {
      stryCov_9fa48("2530");
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
      const result = await db.query(stryMutAct_9fa48("2531") ? `` : (stryCov_9fa48("2531"), `INSERT INTO language_modules 
       (admin_id, language, level, title, description, thumbnail_url, estimated_duration, is_published, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`), stryMutAct_9fa48("2532") ? [] : (stryCov_9fa48("2532"), [admin_id, language, level, title, description, thumbnail_url, estimated_duration, stryMutAct_9fa48("2535") ? is_published && false : stryMutAct_9fa48("2534") ? false : stryMutAct_9fa48("2533") ? true : (stryCov_9fa48("2533", "2534", "2535"), is_published || (stryMutAct_9fa48("2536") ? true : (stryCov_9fa48("2536"), false)))]));
      return result.rows[0];
    }
  }

  /**
   * Get course details with all units and lessons
   */
  async getCourseDetails(courseId) {
    if (stryMutAct_9fa48("2537")) {
      {}
    } else {
      stryCov_9fa48("2537");
      // Get course
      const courseResult = await db.query(stryMutAct_9fa48("2538") ? "" : (stryCov_9fa48("2538"), 'SELECT * FROM language_modules WHERE id = $1'), stryMutAct_9fa48("2539") ? [] : (stryCov_9fa48("2539"), [courseId]));
      if (stryMutAct_9fa48("2542") ? courseResult.rows.length !== 0 : stryMutAct_9fa48("2541") ? false : stryMutAct_9fa48("2540") ? true : (stryCov_9fa48("2540", "2541", "2542"), courseResult.rows.length === 0)) {
        if (stryMutAct_9fa48("2543")) {
          {}
        } else {
          stryCov_9fa48("2543");
          return null;
        }
      }
      const course = courseResult.rows[0];

      // Get units with lessons
      const unitsResult = await db.query(stryMutAct_9fa48("2544") ? `` : (stryCov_9fa48("2544"), `SELECT mu.*,
              COUNT(ml.id) as lesson_count
       FROM module_units mu
       LEFT JOIN module_lessons ml ON mu.id = ml.unit_id
       WHERE mu.module_id = $1
       GROUP BY mu.id
       ORDER BY mu.id`), stryMutAct_9fa48("2545") ? [] : (stryCov_9fa48("2545"), [courseId]));
      const units = unitsResult.rows;

      // Get lessons for each unit
      for (const unit of units) {
        if (stryMutAct_9fa48("2546")) {
          {}
        } else {
          stryCov_9fa48("2546");
          const lessonsResult = await db.query(stryMutAct_9fa48("2547") ? `` : (stryCov_9fa48("2547"), `SELECT * FROM module_lessons 
         WHERE unit_id = $1 
         ORDER BY id`), stryMutAct_9fa48("2548") ? [] : (stryCov_9fa48("2548"), [unit.id]));
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
    if (stryMutAct_9fa48("2549")) {
      {}
    } else {
      stryCov_9fa48("2549");
      const {
        language,
        level,
        title,
        description,
        thumbnail_url,
        estimated_duration,
        is_published
      } = courseData;
      const result = await db.query(stryMutAct_9fa48("2550") ? `` : (stryCov_9fa48("2550"), `UPDATE language_modules 
       SET language = COALESCE($1, language),
           level = COALESCE($2, level),
           title = COALESCE($3, title),
           description = COALESCE($4, description),
           thumbnail_url = COALESCE($5, thumbnail_url),
           estimated_duration = COALESCE($6, estimated_duration),
           is_published = COALESCE($7, is_published),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`), stryMutAct_9fa48("2551") ? [] : (stryCov_9fa48("2551"), [language, level, title, description, thumbnail_url, estimated_duration, is_published, courseId]));
      return result.rows[0];
    }
  }

  /**
   * Delete a course (cascade will delete units and lessons)
   */
  async deleteCourse(courseId) {
    if (stryMutAct_9fa48("2552")) {
      {}
    } else {
      stryCov_9fa48("2552");
      const result = await db.query(stryMutAct_9fa48("2553") ? "" : (stryCov_9fa48("2553"), 'DELETE FROM language_modules WHERE id = $1 RETURNING *'), stryMutAct_9fa48("2554") ? [] : (stryCov_9fa48("2554"), [courseId]));
      return result.rows[0];
    }
  }

  /**
   * Update course counts
   */
  async updateCourseCounts(courseId) {
    if (stryMutAct_9fa48("2555")) {
      {}
    } else {
      stryCov_9fa48("2555");
      await db.query(stryMutAct_9fa48("2556") ? `` : (stryCov_9fa48("2556"), `UPDATE language_modules
       SET total_units = (SELECT COUNT(*) FROM module_units WHERE module_id = $1),
           total_lessons = (SELECT COUNT(*) FROM module_lessons ml 
                           JOIN module_units mu ON ml.unit_id = mu.id 
                           WHERE mu.module_id = $1),
           updated_at = NOW()
       WHERE id = $1`), stryMutAct_9fa48("2557") ? [] : (stryCov_9fa48("2557"), [courseId]));
    }
  }

  // ==================== Unit Operations ====================

  /**
   * Create a new unit
   */
  async createUnit(unitData) {
    if (stryMutAct_9fa48("2558")) {
      {}
    } else {
      stryCov_9fa48("2558");
      const {
        module_id,
        title,
        description,
        difficulty,
        estimated_time
      } = unitData;
      const result = await db.query(stryMutAct_9fa48("2559") ? `` : (stryCov_9fa48("2559"), `INSERT INTO module_units 
       (module_id, title, description, difficulty, estimated_time, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`), stryMutAct_9fa48("2560") ? [] : (stryCov_9fa48("2560"), [module_id, title, description, difficulty, stryMutAct_9fa48("2563") ? estimated_time && 0 : stryMutAct_9fa48("2562") ? false : stryMutAct_9fa48("2561") ? true : (stryCov_9fa48("2561", "2562", "2563"), estimated_time || 0)]));

      // Update course counts
      await this.updateCourseCounts(module_id);
      return result.rows[0];
    }
  }

  /**
   * Get unit by ID
   */
  async getUnitById(unitId) {
    if (stryMutAct_9fa48("2564")) {
      {}
    } else {
      stryCov_9fa48("2564");
      const result = await db.query(stryMutAct_9fa48("2565") ? "" : (stryCov_9fa48("2565"), 'SELECT * FROM module_units WHERE id = $1'), stryMutAct_9fa48("2566") ? [] : (stryCov_9fa48("2566"), [unitId]));
      return result.rows[0];
    }
  }

  /**
   * Update a unit
   */
  async updateUnit(unitId, unitData) {
    if (stryMutAct_9fa48("2567")) {
      {}
    } else {
      stryCov_9fa48("2567");
      const {
        title,
        description,
        difficulty,
        estimated_time
      } = unitData;
      const result = await db.query(stryMutAct_9fa48("2568") ? `` : (stryCov_9fa48("2568"), `UPDATE module_units 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           difficulty = COALESCE($3, difficulty),
           estimated_time = COALESCE($4, estimated_time),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`), stryMutAct_9fa48("2569") ? [] : (stryCov_9fa48("2569"), [title, description, difficulty, estimated_time, unitId]));
      return result.rows[0];
    }
  }

  /**
   * Delete a unit (cascade will delete lessons)
   */
  async deleteUnit(unitId) {
    if (stryMutAct_9fa48("2570")) {
      {}
    } else {
      stryCov_9fa48("2570");
      // Get module_id before deletion
      const unit = await this.getUnitById(unitId);
      if (stryMutAct_9fa48("2573") ? false : stryMutAct_9fa48("2572") ? true : stryMutAct_9fa48("2571") ? unit : (stryCov_9fa48("2571", "2572", "2573"), !unit)) return null;
      const result = await db.query(stryMutAct_9fa48("2574") ? "" : (stryCov_9fa48("2574"), 'DELETE FROM module_units WHERE id = $1 RETURNING *'), stryMutAct_9fa48("2575") ? [] : (stryCov_9fa48("2575"), [unitId]));

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
    if (stryMutAct_9fa48("2576")) {
      {}
    } else {
      stryCov_9fa48("2576");
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
      const result = await db.query(stryMutAct_9fa48("2577") ? `` : (stryCov_9fa48("2577"), `INSERT INTO module_lessons 
       (unit_id, title, content_type, description, media_url, key_phrases, 
        vocabulary, grammar_points, exercises, xp_reward, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
       RETURNING *`), stryMutAct_9fa48("2578") ? [] : (stryCov_9fa48("2578"), [unit_id, title, content_type, description, media_url, stryMutAct_9fa48("2581") ? key_phrases && [] : stryMutAct_9fa48("2580") ? false : stryMutAct_9fa48("2579") ? true : (stryCov_9fa48("2579", "2580", "2581"), key_phrases || (stryMutAct_9fa48("2582") ? ["Stryker was here"] : (stryCov_9fa48("2582"), []))), stryMutAct_9fa48("2585") ? vocabulary && {} : stryMutAct_9fa48("2584") ? false : stryMutAct_9fa48("2583") ? true : (stryCov_9fa48("2583", "2584", "2585"), vocabulary || {}), stryMutAct_9fa48("2588") ? grammar_points && {} : stryMutAct_9fa48("2587") ? false : stryMutAct_9fa48("2586") ? true : (stryCov_9fa48("2586", "2587", "2588"), grammar_points || {}), stryMutAct_9fa48("2591") ? exercises && {} : stryMutAct_9fa48("2590") ? false : stryMutAct_9fa48("2589") ? true : (stryCov_9fa48("2589", "2590", "2591"), exercises || {}), stryMutAct_9fa48("2594") ? xp_reward && 0 : stryMutAct_9fa48("2593") ? false : stryMutAct_9fa48("2592") ? true : (stryCov_9fa48("2592", "2593", "2594"), xp_reward || 0)]));

      // Get module_id and update course counts
      const unit = await this.getUnitById(unit_id);
      if (stryMutAct_9fa48("2596") ? false : stryMutAct_9fa48("2595") ? true : (stryCov_9fa48("2595", "2596"), unit)) {
        if (stryMutAct_9fa48("2597")) {
          {}
        } else {
          stryCov_9fa48("2597");
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
    if (stryMutAct_9fa48("2598")) {
      {}
    } else {
      stryCov_9fa48("2598");
      const result = await db.query(stryMutAct_9fa48("2599") ? "" : (stryCov_9fa48("2599"), 'SELECT * FROM module_lessons WHERE id = $1'), stryMutAct_9fa48("2600") ? [] : (stryCov_9fa48("2600"), [lessonId]));
      return result.rows[0];
    }
  }

  /**
   * Update a lesson
   */
  async updateLesson(lessonId, lessonData) {
    if (stryMutAct_9fa48("2601")) {
      {}
    } else {
      stryCov_9fa48("2601");
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
      const result = await db.query(stryMutAct_9fa48("2602") ? `` : (stryCov_9fa48("2602"), `UPDATE module_lessons 
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
       RETURNING *`), stryMutAct_9fa48("2603") ? [] : (stryCov_9fa48("2603"), [title, content_type, description, media_url, key_phrases, vocabulary, grammar_points, exercises, xp_reward, lessonId]));
      return result.rows[0];
    }
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(lessonId) {
    if (stryMutAct_9fa48("2604")) {
      {}
    } else {
      stryCov_9fa48("2604");
      // Get unit_id and module_id before deletion
      const lesson = await this.getLessonById(lessonId);
      if (stryMutAct_9fa48("2607") ? false : stryMutAct_9fa48("2606") ? true : stryMutAct_9fa48("2605") ? lesson : (stryCov_9fa48("2605", "2606", "2607"), !lesson)) return null;
      const unit = await this.getUnitById(lesson.unit_id);
      const result = await db.query(stryMutAct_9fa48("2608") ? "" : (stryCov_9fa48("2608"), 'DELETE FROM module_lessons WHERE id = $1 RETURNING *'), stryMutAct_9fa48("2609") ? [] : (stryCov_9fa48("2609"), [lessonId]));

      // Update course counts
      if (stryMutAct_9fa48("2611") ? false : stryMutAct_9fa48("2610") ? true : (stryCov_9fa48("2610", "2611"), unit)) {
        if (stryMutAct_9fa48("2612")) {
          {}
        } else {
          stryCov_9fa48("2612");
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
    if (stryMutAct_9fa48("2613")) {
      {}
    } else {
      stryCov_9fa48("2613");
      const result = await db.query(stryMutAct_9fa48("2614") ? `` : (stryCov_9fa48("2614"), `SELECT DISTINCT language, COUNT(*) as course_count
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
    if (stryMutAct_9fa48("2615")) {
      {}
    } else {
      stryCov_9fa48("2615");
      const result = await db.query(stryMutAct_9fa48("2616") ? `` : (stryCov_9fa48("2616"), `SELECT lm.*, 
              COUNT(DISTINCT mu.id) as total_units,
              COUNT(DISTINCT ml.id) as total_lessons
       FROM language_modules lm
       LEFT JOIN module_units mu ON lm.id = mu.module_id
       LEFT JOIN module_lessons ml ON mu.id = ml.unit_id
       WHERE lm.language = $1 AND lm.is_published = true
       GROUP BY lm.id
       ORDER BY lm.created_at DESC`), stryMutAct_9fa48("2617") ? [] : (stryCov_9fa48("2617"), [language]));
      return result.rows;
    }
  }

  /**
   * Get published course details with units and lessons for learners
   */
  async getPublishedCourseDetails(courseId) {
    if (stryMutAct_9fa48("2618")) {
      {}
    } else {
      stryCov_9fa48("2618");
      // Get course
      const courseResult = await db.query(stryMutAct_9fa48("2619") ? "" : (stryCov_9fa48("2619"), 'SELECT * FROM language_modules WHERE id = $1 AND is_published = true'), stryMutAct_9fa48("2620") ? [] : (stryCov_9fa48("2620"), [courseId]));
      if (stryMutAct_9fa48("2623") ? courseResult.rows.length !== 0 : stryMutAct_9fa48("2622") ? false : stryMutAct_9fa48("2621") ? true : (stryCov_9fa48("2621", "2622", "2623"), courseResult.rows.length === 0)) {
        if (stryMutAct_9fa48("2624")) {
          {}
        } else {
          stryCov_9fa48("2624");
          return null;
        }
      }
      const course = courseResult.rows[0];

      // Get units with lessons
      const unitsResult = await db.query(stryMutAct_9fa48("2625") ? `` : (stryCov_9fa48("2625"), `SELECT mu.*,
              COUNT(ml.id) as lesson_count
       FROM module_units mu
       LEFT JOIN module_lessons ml ON mu.id = ml.unit_id
       WHERE mu.module_id = $1
       GROUP BY mu.id
       ORDER BY mu.id`), stryMutAct_9fa48("2626") ? [] : (stryCov_9fa48("2626"), [courseId]));
      const units = unitsResult.rows;

      // Get lessons for each unit
      for (const unit of units) {
        if (stryMutAct_9fa48("2627")) {
          {}
        } else {
          stryCov_9fa48("2627");
          const lessonsResult = await db.query(stryMutAct_9fa48("2628") ? `` : (stryCov_9fa48("2628"), `SELECT * FROM module_lessons 
         WHERE unit_id = $1 
         ORDER BY id`), stryMutAct_9fa48("2629") ? [] : (stryCov_9fa48("2629"), [unit.id]));
          unit.lessons = lessonsResult.rows;
        }
      }
      course.units = units;
      return course;
    }
  }
}
export default new ModuleAdminRepository();