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
class CourseRepository {
  /**
   * Find active course by language and user
   */
  async findActiveCourseByLanguage(userId, language) {
    if (stryMutAct_9fa48("2510")) {
      {}
    } else {
      stryCov_9fa48("2510");
      const result = await db.query(stryMutAct_9fa48("2511") ? "" : (stryCov_9fa48("2511"), 'SELECT * FROM courses WHERE learner_id = $1 AND language = $2 AND is_active = $3'), stryMutAct_9fa48("2512") ? [] : (stryCov_9fa48("2512"), [userId, language, stryMutAct_9fa48("2513") ? false : (stryCov_9fa48("2513"), true)]));
      return stryMutAct_9fa48("2516") ? result.rows[0] && null : stryMutAct_9fa48("2515") ? false : stryMutAct_9fa48("2514") ? true : (stryCov_9fa48("2514", "2515", "2516"), result.rows[0] || null);
    }
  }

  /**
   * Create a new course
   */
  async createCourse(userId, language, expectedDuration, courseData) {
    if (stryMutAct_9fa48("2517")) {
      {}
    } else {
      stryCov_9fa48("2517");
      // Extract metadata from courseData
      const title = stryMutAct_9fa48("2520") ? courseData.course?.title && `${language} Learning Journey` : stryMutAct_9fa48("2519") ? false : stryMutAct_9fa48("2518") ? true : (stryCov_9fa48("2518", "2519", "2520"), (stryMutAct_9fa48("2521") ? courseData.course.title : (stryCov_9fa48("2521"), courseData.course?.title)) || (stryMutAct_9fa48("2522") ? `` : (stryCov_9fa48("2522"), `${language} Learning Journey`)));
      const description = stryMutAct_9fa48("2525") ? courseData.course?.description && `Learn ${language} in ${expectedDuration}` : stryMutAct_9fa48("2524") ? false : stryMutAct_9fa48("2523") ? true : (stryCov_9fa48("2523", "2524", "2525"), (stryMutAct_9fa48("2526") ? courseData.course.description : (stryCov_9fa48("2526"), courseData.course?.description)) || (stryMutAct_9fa48("2527") ? `` : (stryCov_9fa48("2527"), `Learn ${language} in ${expectedDuration}`)));
      const totalLessons = stryMutAct_9fa48("2530") ? courseData.metadata?.totalLessons && 0 : stryMutAct_9fa48("2529") ? false : stryMutAct_9fa48("2528") ? true : (stryCov_9fa48("2528", "2529", "2530"), (stryMutAct_9fa48("2531") ? courseData.metadata.totalLessons : (stryCov_9fa48("2531"), courseData.metadata?.totalLessons)) || 0);
      const totalUnits = stryMutAct_9fa48("2534") ? courseData.metadata?.totalUnits && 0 : stryMutAct_9fa48("2533") ? false : stryMutAct_9fa48("2532") ? true : (stryCov_9fa48("2532", "2533", "2534"), (stryMutAct_9fa48("2535") ? courseData.metadata.totalUnits : (stryCov_9fa48("2535"), courseData.metadata?.totalUnits)) || 0);
      const estimatedTotalTime = stryMutAct_9fa48("2538") ? courseData.metadata?.estimatedTotalTime && 0 : stryMutAct_9fa48("2537") ? false : stryMutAct_9fa48("2536") ? true : (stryCov_9fa48("2536", "2537", "2538"), (stryMutAct_9fa48("2539") ? courseData.metadata.estimatedTotalTime : (stryCov_9fa48("2539"), courseData.metadata?.estimatedTotalTime)) || 0);
      const result = await db.query(stryMutAct_9fa48("2540") ? `` : (stryCov_9fa48("2540"), `INSERT INTO courses (
        learner_id, language, expected_duration, title, description,
        total_lessons, total_units, estimated_total_time,
        course_data, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING id`), stryMutAct_9fa48("2541") ? [] : (stryCov_9fa48("2541"), [userId, language, expectedDuration, title, description, totalLessons, totalUnits, estimatedTotalTime, courseData, stryMutAct_9fa48("2542") ? false : (stryCov_9fa48("2542"), true)]));
      const courseId = result.rows[0].id;

      // Populate course_units and course_lessons tables
      await this.populateCourseStructure(courseId, courseData);
      return courseId;
    }
  }

  /**
   * Update course data (for streaming generation)
   */
  async updateCourseData(courseId, courseData) {
    if (stryMutAct_9fa48("2543")) {
      {}
    } else {
      stryCov_9fa48("2543");
      const totalLessons = stryMutAct_9fa48("2546") ? courseData.metadata?.totalLessons && 0 : stryMutAct_9fa48("2545") ? false : stryMutAct_9fa48("2544") ? true : (stryCov_9fa48("2544", "2545", "2546"), (stryMutAct_9fa48("2547") ? courseData.metadata.totalLessons : (stryCov_9fa48("2547"), courseData.metadata?.totalLessons)) || 0);
      const totalUnits = stryMutAct_9fa48("2550") ? courseData.metadata?.totalUnits && 0 : stryMutAct_9fa48("2549") ? false : stryMutAct_9fa48("2548") ? true : (stryCov_9fa48("2548", "2549", "2550"), (stryMutAct_9fa48("2551") ? courseData.metadata.totalUnits : (stryCov_9fa48("2551"), courseData.metadata?.totalUnits)) || 0);
      const estimatedTotalTime = stryMutAct_9fa48("2554") ? courseData.metadata?.estimatedTotalTime && 0 : stryMutAct_9fa48("2553") ? false : stryMutAct_9fa48("2552") ? true : (stryCov_9fa48("2552", "2553", "2554"), (stryMutAct_9fa48("2555") ? courseData.metadata.estimatedTotalTime : (stryCov_9fa48("2555"), courseData.metadata?.estimatedTotalTime)) || 0);
      await db.query(stryMutAct_9fa48("2556") ? `` : (stryCov_9fa48("2556"), `UPDATE courses 
       SET course_data = $1, 
           total_lessons = $2, 
           total_units = $3, 
           estimated_total_time = $4,
           updated_at = NOW()
       WHERE id = $5`), stryMutAct_9fa48("2557") ? [] : (stryCov_9fa48("2557"), [courseData, totalLessons, totalUnits, estimatedTotalTime, courseId]));
    }
  }

  /**
   * Populate course_units and course_lessons tables from courseData
   */
  async populateCourseStructure(courseId, courseData) {
    if (stryMutAct_9fa48("2558")) {
      {}
    } else {
      stryCov_9fa48("2558");
      const units = stryMutAct_9fa48("2561") ? courseData.course?.units && [] : stryMutAct_9fa48("2560") ? false : stryMutAct_9fa48("2559") ? true : (stryCov_9fa48("2559", "2560", "2561"), (stryMutAct_9fa48("2562") ? courseData.course.units : (stryCov_9fa48("2562"), courseData.course?.units)) || (stryMutAct_9fa48("2563") ? ["Stryker was here"] : (stryCov_9fa48("2563"), [])));
      for (const unit of units) {
        if (stryMutAct_9fa48("2564")) {
          {}
        } else {
          stryCov_9fa48("2564");
          // Insert unit
          const unitResult = await db.query(stryMutAct_9fa48("2565") ? `` : (stryCov_9fa48("2565"), `INSERT INTO course_units (
          course_id, unit_id, title, description, difficulty, estimated_time, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`), stryMutAct_9fa48("2566") ? [] : (stryCov_9fa48("2566"), [courseId, unit.id, unit.title, unit.description, unit.difficulty, stryMutAct_9fa48("2569") ? (parseInt(unit.estimatedTime) || unit.estimatedTime?.match(/\d+/)?.[0]) && 150 : stryMutAct_9fa48("2568") ? false : stryMutAct_9fa48("2567") ? true : (stryCov_9fa48("2567", "2568", "2569"), (stryMutAct_9fa48("2571") ? parseInt(unit.estimatedTime) && unit.estimatedTime?.match(/\d+/)?.[0] : stryMutAct_9fa48("2570") ? false : (stryCov_9fa48("2570", "2571"), parseInt(unit.estimatedTime) || (stryMutAct_9fa48("2573") ? unit.estimatedTime.match(/\d+/)?.[0] : stryMutAct_9fa48("2572") ? unit.estimatedTime?.match(/\d+/)[0] : (stryCov_9fa48("2572", "2573"), unit.estimatedTime?.match(stryMutAct_9fa48("2575") ? /\D+/ : stryMutAct_9fa48("2574") ? /\d/ : (stryCov_9fa48("2574", "2575"), /\d+/))?.[0])))) || 150)]));
          const unitDbId = unitResult.rows[0].id;

          // Insert lessons for this unit
          const lessons = stryMutAct_9fa48("2578") ? unit.lessons && [] : stryMutAct_9fa48("2577") ? false : stryMutAct_9fa48("2576") ? true : (stryCov_9fa48("2576", "2577", "2578"), unit.lessons || (stryMutAct_9fa48("2579") ? ["Stryker was here"] : (stryCov_9fa48("2579"), [])));
          for (const lesson of lessons) {
            if (stryMutAct_9fa48("2580")) {
              {}
            } else {
              stryCov_9fa48("2580");
              await db.query(stryMutAct_9fa48("2581") ? `` : (stryCov_9fa48("2581"), `INSERT INTO course_lessons (
            course_id, unit_id, lesson_id, title, lesson_type, description,
            key_phrases, vocabulary, grammar_points, exercises,
            estimated_duration, xp_reward, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, $11, $12, NOW(), NOW())`), stryMutAct_9fa48("2582") ? [] : (stryCov_9fa48("2582"), [courseId, unitDbId, lesson.id, lesson.title, stryMutAct_9fa48("2585") ? (lesson.type || lesson.lessonType) && 'vocabulary' : stryMutAct_9fa48("2584") ? false : stryMutAct_9fa48("2583") ? true : (stryCov_9fa48("2583", "2584", "2585"), (stryMutAct_9fa48("2587") ? lesson.type && lesson.lessonType : stryMutAct_9fa48("2586") ? false : (stryCov_9fa48("2586", "2587"), lesson.type || lesson.lessonType)) || (stryMutAct_9fa48("2588") ? "" : (stryCov_9fa48("2588"), 'vocabulary'))), stryMutAct_9fa48("2591") ? lesson.description && '' : stryMutAct_9fa48("2590") ? false : stryMutAct_9fa48("2589") ? true : (stryCov_9fa48("2589", "2590", "2591"), lesson.description || (stryMutAct_9fa48("2592") ? "Stryker was here!" : (stryCov_9fa48("2592"), ''))), stryMutAct_9fa48("2595") ? (lesson.keyPhrases || lesson.key_phrases) && [] : stryMutAct_9fa48("2594") ? false : stryMutAct_9fa48("2593") ? true : (stryCov_9fa48("2593", "2594", "2595"), (stryMutAct_9fa48("2597") ? lesson.keyPhrases && lesson.key_phrases : stryMutAct_9fa48("2596") ? false : (stryCov_9fa48("2596", "2597"), lesson.keyPhrases || lesson.key_phrases)) || (stryMutAct_9fa48("2598") ? ["Stryker was here"] : (stryCov_9fa48("2598"), []))), JSON.stringify(stryMutAct_9fa48("2601") ? lesson.vocabulary && {} : stryMutAct_9fa48("2600") ? false : stryMutAct_9fa48("2599") ? true : (stryCov_9fa48("2599", "2600", "2601"), lesson.vocabulary || {})), JSON.stringify(stryMutAct_9fa48("2604") ? (lesson.grammarPoints || lesson.grammar_points) && {} : stryMutAct_9fa48("2603") ? false : stryMutAct_9fa48("2602") ? true : (stryCov_9fa48("2602", "2603", "2604"), (stryMutAct_9fa48("2606") ? lesson.grammarPoints && lesson.grammar_points : stryMutAct_9fa48("2605") ? false : (stryCov_9fa48("2605", "2606"), lesson.grammarPoints || lesson.grammar_points)) || {})), JSON.stringify(stryMutAct_9fa48("2609") ? lesson.exercises && [] : stryMutAct_9fa48("2608") ? false : stryMutAct_9fa48("2607") ? true : (stryCov_9fa48("2607", "2608", "2609"), lesson.exercises || (stryMutAct_9fa48("2610") ? ["Stryker was here"] : (stryCov_9fa48("2610"), [])))), stryMutAct_9fa48("2613") ? (lesson.estimatedDuration || lesson.duration) && 15 : stryMutAct_9fa48("2612") ? false : stryMutAct_9fa48("2611") ? true : (stryCov_9fa48("2611", "2612", "2613"), (stryMutAct_9fa48("2615") ? lesson.estimatedDuration && lesson.duration : stryMutAct_9fa48("2614") ? false : (stryCov_9fa48("2614", "2615"), lesson.estimatedDuration || lesson.duration)) || 15), stryMutAct_9fa48("2618") ? (lesson.xpReward || lesson.xp_reward) && 50 : stryMutAct_9fa48("2617") ? false : stryMutAct_9fa48("2616") ? true : (stryCov_9fa48("2616", "2617", "2618"), (stryMutAct_9fa48("2620") ? lesson.xpReward && lesson.xp_reward : stryMutAct_9fa48("2619") ? false : (stryCov_9fa48("2619", "2620"), lesson.xpReward || lesson.xp_reward)) || 50)]));
            }
          }
        }
      }
    }
  }

  /**
   * Find lesson database ID by course, unit number, and lesson number
   */
  async findLessonDbId(courseId, unitNumber, lessonNumber) {
    if (stryMutAct_9fa48("2621")) {
      {}
    } else {
      stryCov_9fa48("2621");
      const result = await db.query(stryMutAct_9fa48("2622") ? `` : (stryCov_9fa48("2622"), `SELECT cl.id 
       FROM course_lessons cl
       JOIN course_units cu ON cl.unit_id = cu.id
       WHERE cl.course_id = $1 AND cu.unit_id = $2 AND cl.lesson_id = $3
       LIMIT 1`), stryMutAct_9fa48("2623") ? [] : (stryCov_9fa48("2623"), [courseId, unitNumber, lessonNumber]));
      return stryMutAct_9fa48("2626") ? result.rows[0]?.id && null : stryMutAct_9fa48("2625") ? false : stryMutAct_9fa48("2624") ? true : (stryCov_9fa48("2624", "2625", "2626"), (stryMutAct_9fa48("2627") ? result.rows[0].id : (stryCov_9fa48("2627"), result.rows[0]?.id)) || null);
    }
  }

  /**
   * Find learner courses with stats
   */
  /**
   * FIX: Find all learner courses with stats - includes both AI courses and enrolled admin courses
   * This ensures user management shows all enrolled courses, not just AI-generated ones
   */
  async findLearnerCoursesWithStats(userId) {
    if (stryMutAct_9fa48("2628")) {
      {}
    } else {
      stryCov_9fa48("2628");
      const result = await db.query(stryMutAct_9fa48("2629") ? `` : (stryCov_9fa48("2629"), `-- Part 1: AI-generated courses for this learner
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
        COALESCE((
          SELECT MAX(current_streak) FROM user_stats us
          WHERE us.learner_id = c.learner_id
        ), 0) as current_streak,
        ROUND(
          COALESCE((
            SELECT COUNT(*) FROM lesson_progress lp 
            WHERE lp.learner_id = c.learner_id AND lp.course_id = c.id AND lp.is_completed = true
          ), 0) * 100.0 / GREATEST(c.total_lessons, 1), 0
        ) as progress_percentage
       FROM courses c
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
        COALESCE((
          SELECT MAX(current_streak) FROM user_stats us
          WHERE us.learner_id = $1
        ), 0) as current_streak,
        ROUND(
          COALESCE((
            SELECT COUNT(*) FROM lesson_progress lp 
            WHERE lp.learner_id = $1 AND lp.course_id = lm.id AND lp.is_completed = true
          ), 0) * 100.0 / GREATEST(lm.total_lessons, 1), 0
        ) as progress_percentage
       FROM learner_enrollments le
       INNER JOIN language_modules lm ON le.module_id = lm.id
       WHERE le.learner_id = $1
       
       ORDER BY created_at DESC`), stryMutAct_9fa48("2630") ? [] : (stryCov_9fa48("2630"), [userId]));
      return result.rows;
    }
  }

  /**
   * Find course by ID and user
   */
  async findCourseById(courseId, userId) {
    if (stryMutAct_9fa48("2631")) {
      {}
    } else {
      stryCov_9fa48("2631");
      const result = await db.query(stryMutAct_9fa48("2632") ? "" : (stryCov_9fa48("2632"), 'SELECT * FROM courses WHERE id = $1 AND learner_id = $2 AND is_active = $3'), stryMutAct_9fa48("2633") ? [] : (stryCov_9fa48("2633"), [courseId, userId, stryMutAct_9fa48("2634") ? false : (stryCov_9fa48("2634"), true)]));
      return stryMutAct_9fa48("2637") ? result.rows[0] && null : stryMutAct_9fa48("2636") ? false : stryMutAct_9fa48("2635") ? true : (stryCov_9fa48("2635", "2636", "2637"), result.rows[0] || null);
    }
  }

  /**
   * Find course data by ID and user
   */
  async findCourseDataById(courseId, userId) {
    if (stryMutAct_9fa48("2638")) {
      {}
    } else {
      stryCov_9fa48("2638");
      const result = await db.query(stryMutAct_9fa48("2639") ? "" : (stryCov_9fa48("2639"), 'SELECT course_data FROM courses WHERE id = $1 AND learner_id = $2 AND is_active = $3'), stryMutAct_9fa48("2640") ? [] : (stryCov_9fa48("2640"), [courseId, userId, stryMutAct_9fa48("2641") ? false : (stryCov_9fa48("2641"), true)]));
      const row = result.rows[0];
      return row ? stryMutAct_9fa48("2642") ? {} : (stryCov_9fa48("2642"), {
        course_data: row.course_data
      }) : null;
    }
  }

  /**
   * Delete course and all related data (CASCADE)
   */
  async deleteCourse(courseId, userId) {
    if (stryMutAct_9fa48("2643")) {
      {}
    } else {
      stryCov_9fa48("2643");
      // Verify course belongs to user
      const course = await db.query(stryMutAct_9fa48("2644") ? "" : (stryCov_9fa48("2644"), 'SELECT * FROM courses WHERE id = $1 AND learner_id = $2'), stryMutAct_9fa48("2645") ? [] : (stryCov_9fa48("2645"), [courseId, userId]));
      if (stryMutAct_9fa48("2648") ? course.rows.length !== 0 : stryMutAct_9fa48("2647") ? false : stryMutAct_9fa48("2646") ? true : (stryCov_9fa48("2646", "2647", "2648"), course.rows.length === 0)) {
        if (stryMutAct_9fa48("2649")) {
          {}
        } else {
          stryCov_9fa48("2649");
          return stryMutAct_9fa48("2650") ? true : (stryCov_9fa48("2650"), false); // Course not found or doesn't belong to user
        }
      }

      // Delete course (CASCADE will handle all related tables)
      // The database foreign keys with ON DELETE CASCADE will automatically delete:
      // - course_units
      // - course_lessons
      // - unit_progress
      // - lesson_progress
      // - exercise_attempts
      // - user_stats
      await db.query(stryMutAct_9fa48("2651") ? "" : (stryCov_9fa48("2651"), 'DELETE FROM courses WHERE id = $1 AND learner_id = $2'), stryMutAct_9fa48("2652") ? [] : (stryCov_9fa48("2652"), [courseId, userId]));
      return stryMutAct_9fa48("2653") ? false : (stryCov_9fa48("2653"), true);
    }
  }

  /**
   * Update lesson exercises
   */
  async updateLessonExercises(lessonDbId, exercises) {
    if (stryMutAct_9fa48("2654")) {
      {}
    } else {
      stryCov_9fa48("2654");
      await db.query(stryMutAct_9fa48("2655") ? `` : (stryCov_9fa48("2655"), `UPDATE course_lessons 
       SET exercises = $1::jsonb, updated_at = NOW()
       WHERE id = $2`), stryMutAct_9fa48("2656") ? [] : (stryCov_9fa48("2656"), [JSON.stringify(exercises), lessonDbId]));
    }
  }

  /**
   * Find all active courses: AI courses (user-specific) + Admin courses (shared)
   */
  async findAllActiveCourses(userId) {
    if (stryMutAct_9fa48("2657")) {
      {}
    } else {
      stryCov_9fa48("2657");
      console.log(stryMutAct_9fa48("2658") ? "" : (stryCov_9fa48("2658"), '📊 Fetching courses for userId:'), userId);
      const result = await db.query(stryMutAct_9fa48("2659") ? `` : (stryCov_9fa48("2659"), `-- Part 1: AI-generated courses (ONLY for this specific user)
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
        COALESCE((
          SELECT MAX(current_streak) FROM user_stats us
          WHERE us.learner_id = $1
        ), 0) as current_streak
       FROM courses c
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
        COALESCE((
          SELECT MAX(current_streak) FROM user_stats us
          WHERE us.learner_id = $1
        ), 0) as current_streak
       FROM language_modules lm
       WHERE lm.is_published = true
       
       ORDER BY created_at DESC`), stryMutAct_9fa48("2660") ? [] : (stryCov_9fa48("2660"), [userId]));
      console.log(stryMutAct_9fa48("2661") ? `` : (stryCov_9fa48("2661"), `✅ Found ${result.rows.length} courses for user ${userId}`));
      result.rows.forEach(course => {
        if (stryMutAct_9fa48("2662")) {
          {}
        } else {
          stryCov_9fa48("2662");
          console.log(stryMutAct_9fa48("2663") ? `` : (stryCov_9fa48("2663"), `  - ${course.title} (${course.source_type}) - learner_id: ${stryMutAct_9fa48("2666") ? course.learner_id && 'N/A (admin course)' : stryMutAct_9fa48("2665") ? false : stryMutAct_9fa48("2664") ? true : (stryCov_9fa48("2664", "2665", "2666"), course.learner_id || (stryMutAct_9fa48("2667") ? "" : (stryCov_9fa48("2667"), 'N/A (admin course)')))}`));
        }
      });
      return result.rows;
    }
  }

  // ==================== PUBLIC METHODS (For Published Courses) ====================

  /**
   * Get all unique languages with published courses
   */
  async getPublishedLanguages() {
    if (stryMutAct_9fa48("2668")) {
      {}
    } else {
      stryCov_9fa48("2668");
      const result = await db.query(stryMutAct_9fa48("2669") ? `` : (stryCov_9fa48("2669"), `SELECT DISTINCT language, COUNT(*) as course_count
       FROM language_modules
       WHERE is_published = true
       GROUP BY language
       ORDER BY language ASC`));
      return result.rows;
    }
  }

  /**
   * Get all published courses for a specific language
   */
  async getPublishedCoursesByLanguage(language) {
    if (stryMutAct_9fa48("2670")) {
      {}
    } else {
      stryCov_9fa48("2670");
      const result = await db.query(stryMutAct_9fa48("2671") ? `` : (stryCov_9fa48("2671"), `SELECT id, language, level, title, description, thumbnail_url, estimated_duration,
              is_published, total_units, total_lessons, created_at, updated_at
       FROM language_modules
       WHERE language = $1 AND is_published = true
       ORDER BY created_at DESC`), stryMutAct_9fa48("2672") ? [] : (stryCov_9fa48("2672"), [language]));
      return result.rows;
    }
  }

  /**
   * Get published course details with units and lessons
   */
  async getPublishedCourseDetails(courseId) {
    if (stryMutAct_9fa48("2673")) {
      {}
    } else {
      stryCov_9fa48("2673");
      const result = await db.query(stryMutAct_9fa48("2674") ? `` : (stryCov_9fa48("2674"), `SELECT id, language, level, title, description, thumbnail_url, estimated_duration,
              is_published, total_units, total_lessons, created_at, updated_at
       FROM language_modules
       WHERE id = $1 AND is_published = true`), stryMutAct_9fa48("2675") ? [] : (stryCov_9fa48("2675"), [courseId]));
      if (stryMutAct_9fa48("2678") ? result.rows.length !== 0 : stryMutAct_9fa48("2677") ? false : stryMutAct_9fa48("2676") ? true : (stryCov_9fa48("2676", "2677", "2678"), result.rows.length === 0)) {
        if (stryMutAct_9fa48("2679")) {
          {}
        } else {
          stryCov_9fa48("2679");
          return null;
        }
      }
      const course = result.rows[0];

      // Fetch units for this course (using module_id, not course_id)
      const unitsResult = await db.query(stryMutAct_9fa48("2680") ? `` : (stryCov_9fa48("2680"), `SELECT id, module_id, title, description, difficulty, estimated_time, created_at
       FROM module_units
       WHERE module_id = $1
       ORDER BY created_at ASC`), stryMutAct_9fa48("2681") ? [] : (stryCov_9fa48("2681"), [courseId]));
      const units = unitsResult.rows;

      // Fetch lessons for each unit
      const unitsWithLessons = await Promise.all(units.map(async unit => {
        if (stryMutAct_9fa48("2682")) {
          {}
        } else {
          stryCov_9fa48("2682");
          const lessonsResult = await db.query(stryMutAct_9fa48("2683") ? `` : (stryCov_9fa48("2683"), `SELECT id, unit_id, title, content_type, description, media_url, 
                  key_phrases, vocabulary, grammar_points, exercises, xp_reward, created_at
           FROM module_lessons
           WHERE unit_id = $1
           ORDER BY created_at ASC`), stryMutAct_9fa48("2684") ? [] : (stryCov_9fa48("2684"), [unit.id]));
          return stryMutAct_9fa48("2685") ? {} : (stryCov_9fa48("2685"), {
            ...unit,
            lessons: lessonsResult.rows
          });
        }
      }));
      return stryMutAct_9fa48("2686") ? {} : (stryCov_9fa48("2686"), {
        ...course,
        units: unitsWithLessons
      });
    }
  }
}
export default new CourseRepository();