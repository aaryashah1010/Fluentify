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
    if (stryMutAct_9fa48("2348")) {
      {}
    } else {
      stryCov_9fa48("2348");
      const result = await db.query(stryMutAct_9fa48("2349") ? "" : (stryCov_9fa48("2349"), 'SELECT * FROM courses WHERE learner_id = $1 AND language = $2 AND is_active = $3'), stryMutAct_9fa48("2350") ? [] : (stryCov_9fa48("2350"), [userId, language, stryMutAct_9fa48("2351") ? false : (stryCov_9fa48("2351"), true)]));
      return stryMutAct_9fa48("2354") ? result.rows[0] && null : stryMutAct_9fa48("2353") ? false : stryMutAct_9fa48("2352") ? true : (stryCov_9fa48("2352", "2353", "2354"), result.rows[0] || null);
    }
  }

  /**
   * Create a new course
   */
  async createCourse(userId, language, expectedDuration, courseData) {
    if (stryMutAct_9fa48("2355")) {
      {}
    } else {
      stryCov_9fa48("2355");
      // Extract metadata from courseData
      const title = stryMutAct_9fa48("2358") ? courseData.course?.title && `${language} Learning Journey` : stryMutAct_9fa48("2357") ? false : stryMutAct_9fa48("2356") ? true : (stryCov_9fa48("2356", "2357", "2358"), (stryMutAct_9fa48("2359") ? courseData.course.title : (stryCov_9fa48("2359"), courseData.course?.title)) || (stryMutAct_9fa48("2360") ? `` : (stryCov_9fa48("2360"), `${language} Learning Journey`)));
      const description = stryMutAct_9fa48("2363") ? courseData.course?.description && `Learn ${language} in ${expectedDuration}` : stryMutAct_9fa48("2362") ? false : stryMutAct_9fa48("2361") ? true : (stryCov_9fa48("2361", "2362", "2363"), (stryMutAct_9fa48("2364") ? courseData.course.description : (stryCov_9fa48("2364"), courseData.course?.description)) || (stryMutAct_9fa48("2365") ? `` : (stryCov_9fa48("2365"), `Learn ${language} in ${expectedDuration}`)));
      const totalLessons = stryMutAct_9fa48("2368") ? courseData.metadata?.totalLessons && 0 : stryMutAct_9fa48("2367") ? false : stryMutAct_9fa48("2366") ? true : (stryCov_9fa48("2366", "2367", "2368"), (stryMutAct_9fa48("2369") ? courseData.metadata.totalLessons : (stryCov_9fa48("2369"), courseData.metadata?.totalLessons)) || 0);
      const totalUnits = stryMutAct_9fa48("2372") ? courseData.metadata?.totalUnits && 0 : stryMutAct_9fa48("2371") ? false : stryMutAct_9fa48("2370") ? true : (stryCov_9fa48("2370", "2371", "2372"), (stryMutAct_9fa48("2373") ? courseData.metadata.totalUnits : (stryCov_9fa48("2373"), courseData.metadata?.totalUnits)) || 0);
      const estimatedTotalTime = stryMutAct_9fa48("2376") ? courseData.metadata?.estimatedTotalTime && 0 : stryMutAct_9fa48("2375") ? false : stryMutAct_9fa48("2374") ? true : (stryCov_9fa48("2374", "2375", "2376"), (stryMutAct_9fa48("2377") ? courseData.metadata.estimatedTotalTime : (stryCov_9fa48("2377"), courseData.metadata?.estimatedTotalTime)) || 0);
      const result = await db.query(stryMutAct_9fa48("2378") ? `` : (stryCov_9fa48("2378"), `INSERT INTO courses (
        learner_id, language, expected_duration, title, description,
        total_lessons, total_units, estimated_total_time,
        course_data, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING id`), stryMutAct_9fa48("2379") ? [] : (stryCov_9fa48("2379"), [userId, language, expectedDuration, title, description, totalLessons, totalUnits, estimatedTotalTime, courseData, stryMutAct_9fa48("2380") ? false : (stryCov_9fa48("2380"), true)]));
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
    if (stryMutAct_9fa48("2381")) {
      {}
    } else {
      stryCov_9fa48("2381");
      const totalLessons = stryMutAct_9fa48("2384") ? courseData.metadata?.totalLessons && 0 : stryMutAct_9fa48("2383") ? false : stryMutAct_9fa48("2382") ? true : (stryCov_9fa48("2382", "2383", "2384"), (stryMutAct_9fa48("2385") ? courseData.metadata.totalLessons : (stryCov_9fa48("2385"), courseData.metadata?.totalLessons)) || 0);
      const totalUnits = stryMutAct_9fa48("2388") ? courseData.metadata?.totalUnits && 0 : stryMutAct_9fa48("2387") ? false : stryMutAct_9fa48("2386") ? true : (stryCov_9fa48("2386", "2387", "2388"), (stryMutAct_9fa48("2389") ? courseData.metadata.totalUnits : (stryCov_9fa48("2389"), courseData.metadata?.totalUnits)) || 0);
      const estimatedTotalTime = stryMutAct_9fa48("2392") ? courseData.metadata?.estimatedTotalTime && 0 : stryMutAct_9fa48("2391") ? false : stryMutAct_9fa48("2390") ? true : (stryCov_9fa48("2390", "2391", "2392"), (stryMutAct_9fa48("2393") ? courseData.metadata.estimatedTotalTime : (stryCov_9fa48("2393"), courseData.metadata?.estimatedTotalTime)) || 0);
      await db.query(stryMutAct_9fa48("2394") ? `` : (stryCov_9fa48("2394"), `UPDATE courses 
       SET course_data = $1, 
           total_lessons = $2, 
           total_units = $3, 
           estimated_total_time = $4,
           updated_at = NOW()
       WHERE id = $5`), stryMutAct_9fa48("2395") ? [] : (stryCov_9fa48("2395"), [courseData, totalLessons, totalUnits, estimatedTotalTime, courseId]));
    }
  }

  /**
   * Populate course_units and course_lessons tables from courseData
   */
  async populateCourseStructure(courseId, courseData) {
    if (stryMutAct_9fa48("2396")) {
      {}
    } else {
      stryCov_9fa48("2396");
      const units = stryMutAct_9fa48("2399") ? courseData.course?.units && [] : stryMutAct_9fa48("2398") ? false : stryMutAct_9fa48("2397") ? true : (stryCov_9fa48("2397", "2398", "2399"), (stryMutAct_9fa48("2400") ? courseData.course.units : (stryCov_9fa48("2400"), courseData.course?.units)) || (stryMutAct_9fa48("2401") ? ["Stryker was here"] : (stryCov_9fa48("2401"), [])));
      for (const unit of units) {
        if (stryMutAct_9fa48("2402")) {
          {}
        } else {
          stryCov_9fa48("2402");
          // Insert unit
          const unitResult = await db.query(stryMutAct_9fa48("2403") ? `` : (stryCov_9fa48("2403"), `INSERT INTO course_units (
          course_id, unit_id, title, description, difficulty, estimated_time, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`), stryMutAct_9fa48("2404") ? [] : (stryCov_9fa48("2404"), [courseId, unit.id, unit.title, unit.description, unit.difficulty, stryMutAct_9fa48("2407") ? (parseInt(unit.estimatedTime) || unit.estimatedTime?.match(/\d+/)?.[0]) && 150 : stryMutAct_9fa48("2406") ? false : stryMutAct_9fa48("2405") ? true : (stryCov_9fa48("2405", "2406", "2407"), (stryMutAct_9fa48("2409") ? parseInt(unit.estimatedTime) && unit.estimatedTime?.match(/\d+/)?.[0] : stryMutAct_9fa48("2408") ? false : (stryCov_9fa48("2408", "2409"), parseInt(unit.estimatedTime) || (stryMutAct_9fa48("2411") ? unit.estimatedTime.match(/\d+/)?.[0] : stryMutAct_9fa48("2410") ? unit.estimatedTime?.match(/\d+/)[0] : (stryCov_9fa48("2410", "2411"), unit.estimatedTime?.match(stryMutAct_9fa48("2413") ? /\D+/ : stryMutAct_9fa48("2412") ? /\d/ : (stryCov_9fa48("2412", "2413"), /\d+/))?.[0])))) || 150)]));
          const unitDbId = unitResult.rows[0].id;

          // Insert lessons for this unit
          const lessons = stryMutAct_9fa48("2416") ? unit.lessons && [] : stryMutAct_9fa48("2415") ? false : stryMutAct_9fa48("2414") ? true : (stryCov_9fa48("2414", "2415", "2416"), unit.lessons || (stryMutAct_9fa48("2417") ? ["Stryker was here"] : (stryCov_9fa48("2417"), [])));
          for (const lesson of lessons) {
            if (stryMutAct_9fa48("2418")) {
              {}
            } else {
              stryCov_9fa48("2418");
              await db.query(stryMutAct_9fa48("2419") ? `` : (stryCov_9fa48("2419"), `INSERT INTO course_lessons (
            course_id, unit_id, lesson_id, title, lesson_type, description,
            key_phrases, vocabulary, grammar_points, exercises,
            estimated_duration, xp_reward, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, $11, $12, NOW(), NOW())`), stryMutAct_9fa48("2420") ? [] : (stryCov_9fa48("2420"), [courseId, unitDbId, lesson.id, lesson.title, stryMutAct_9fa48("2423") ? (lesson.type || lesson.lessonType) && 'vocabulary' : stryMutAct_9fa48("2422") ? false : stryMutAct_9fa48("2421") ? true : (stryCov_9fa48("2421", "2422", "2423"), (stryMutAct_9fa48("2425") ? lesson.type && lesson.lessonType : stryMutAct_9fa48("2424") ? false : (stryCov_9fa48("2424", "2425"), lesson.type || lesson.lessonType)) || (stryMutAct_9fa48("2426") ? "" : (stryCov_9fa48("2426"), 'vocabulary'))), stryMutAct_9fa48("2429") ? lesson.description && '' : stryMutAct_9fa48("2428") ? false : stryMutAct_9fa48("2427") ? true : (stryCov_9fa48("2427", "2428", "2429"), lesson.description || (stryMutAct_9fa48("2430") ? "Stryker was here!" : (stryCov_9fa48("2430"), ''))), stryMutAct_9fa48("2433") ? (lesson.keyPhrases || lesson.key_phrases) && [] : stryMutAct_9fa48("2432") ? false : stryMutAct_9fa48("2431") ? true : (stryCov_9fa48("2431", "2432", "2433"), (stryMutAct_9fa48("2435") ? lesson.keyPhrases && lesson.key_phrases : stryMutAct_9fa48("2434") ? false : (stryCov_9fa48("2434", "2435"), lesson.keyPhrases || lesson.key_phrases)) || (stryMutAct_9fa48("2436") ? ["Stryker was here"] : (stryCov_9fa48("2436"), []))), JSON.stringify(stryMutAct_9fa48("2439") ? lesson.vocabulary && {} : stryMutAct_9fa48("2438") ? false : stryMutAct_9fa48("2437") ? true : (stryCov_9fa48("2437", "2438", "2439"), lesson.vocabulary || {})), JSON.stringify(stryMutAct_9fa48("2442") ? (lesson.grammarPoints || lesson.grammar_points) && {} : stryMutAct_9fa48("2441") ? false : stryMutAct_9fa48("2440") ? true : (stryCov_9fa48("2440", "2441", "2442"), (stryMutAct_9fa48("2444") ? lesson.grammarPoints && lesson.grammar_points : stryMutAct_9fa48("2443") ? false : (stryCov_9fa48("2443", "2444"), lesson.grammarPoints || lesson.grammar_points)) || {})), JSON.stringify(stryMutAct_9fa48("2447") ? lesson.exercises && [] : stryMutAct_9fa48("2446") ? false : stryMutAct_9fa48("2445") ? true : (stryCov_9fa48("2445", "2446", "2447"), lesson.exercises || (stryMutAct_9fa48("2448") ? ["Stryker was here"] : (stryCov_9fa48("2448"), [])))), stryMutAct_9fa48("2451") ? (lesson.estimatedDuration || lesson.duration) && 15 : stryMutAct_9fa48("2450") ? false : stryMutAct_9fa48("2449") ? true : (stryCov_9fa48("2449", "2450", "2451"), (stryMutAct_9fa48("2453") ? lesson.estimatedDuration && lesson.duration : stryMutAct_9fa48("2452") ? false : (stryCov_9fa48("2452", "2453"), lesson.estimatedDuration || lesson.duration)) || 15), stryMutAct_9fa48("2456") ? (lesson.xpReward || lesson.xp_reward) && 50 : stryMutAct_9fa48("2455") ? false : stryMutAct_9fa48("2454") ? true : (stryCov_9fa48("2454", "2455", "2456"), (stryMutAct_9fa48("2458") ? lesson.xpReward && lesson.xp_reward : stryMutAct_9fa48("2457") ? false : (stryCov_9fa48("2457", "2458"), lesson.xpReward || lesson.xp_reward)) || 50)]));
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
    if (stryMutAct_9fa48("2459")) {
      {}
    } else {
      stryCov_9fa48("2459");
      const result = await db.query(stryMutAct_9fa48("2460") ? `` : (stryCov_9fa48("2460"), `SELECT cl.id 
       FROM course_lessons cl
       JOIN course_units cu ON cl.unit_id = cu.id
       WHERE cl.course_id = $1 AND cu.unit_id = $2 AND cl.lesson_id = $3
       LIMIT 1`), stryMutAct_9fa48("2461") ? [] : (stryCov_9fa48("2461"), [courseId, unitNumber, lessonNumber]));
      return stryMutAct_9fa48("2464") ? result.rows[0]?.id && null : stryMutAct_9fa48("2463") ? false : stryMutAct_9fa48("2462") ? true : (stryCov_9fa48("2462", "2463", "2464"), (stryMutAct_9fa48("2465") ? result.rows[0].id : (stryCov_9fa48("2465"), result.rows[0]?.id)) || null);
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
    if (stryMutAct_9fa48("2466")) {
      {}
    } else {
      stryCov_9fa48("2466");
      const result = await db.query(stryMutAct_9fa48("2467") ? `` : (stryCov_9fa48("2467"), `-- Part 1: AI-generated courses for this learner
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
       
       ORDER BY created_at DESC`), stryMutAct_9fa48("2468") ? [] : (stryCov_9fa48("2468"), [userId]));
      return result.rows;
    }
  }

  /**
   * Find course by ID and user
   */
  async findCourseById(courseId, userId) {
    if (stryMutAct_9fa48("2469")) {
      {}
    } else {
      stryCov_9fa48("2469");
      const result = await db.query(stryMutAct_9fa48("2470") ? "" : (stryCov_9fa48("2470"), 'SELECT * FROM courses WHERE id = $1 AND learner_id = $2 AND is_active = $3'), stryMutAct_9fa48("2471") ? [] : (stryCov_9fa48("2471"), [courseId, userId, stryMutAct_9fa48("2472") ? false : (stryCov_9fa48("2472"), true)]));
      return stryMutAct_9fa48("2475") ? result.rows[0] && null : stryMutAct_9fa48("2474") ? false : stryMutAct_9fa48("2473") ? true : (stryCov_9fa48("2473", "2474", "2475"), result.rows[0] || null);
    }
  }

  /**
   * Find course data by ID and user
   */
  async findCourseDataById(courseId, userId) {
    if (stryMutAct_9fa48("2476")) {
      {}
    } else {
      stryCov_9fa48("2476");
      const result = await db.query(stryMutAct_9fa48("2477") ? "" : (stryCov_9fa48("2477"), 'SELECT course_data FROM courses WHERE id = $1 AND learner_id = $2 AND is_active = $3'), stryMutAct_9fa48("2478") ? [] : (stryCov_9fa48("2478"), [courseId, userId, stryMutAct_9fa48("2479") ? false : (stryCov_9fa48("2479"), true)]));
      const row = result.rows[0];
      return row ? stryMutAct_9fa48("2480") ? {} : (stryCov_9fa48("2480"), {
        course_data: row.course_data
      }) : null;
    }
  }

  /**
   * Delete course and all related data (CASCADE)
   */
  async deleteCourse(courseId, userId) {
    if (stryMutAct_9fa48("2481")) {
      {}
    } else {
      stryCov_9fa48("2481");
      // Verify course belongs to user
      const course = await db.query(stryMutAct_9fa48("2482") ? "" : (stryCov_9fa48("2482"), 'SELECT * FROM courses WHERE id = $1 AND learner_id = $2'), stryMutAct_9fa48("2483") ? [] : (stryCov_9fa48("2483"), [courseId, userId]));
      if (stryMutAct_9fa48("2486") ? course.rows.length !== 0 : stryMutAct_9fa48("2485") ? false : stryMutAct_9fa48("2484") ? true : (stryCov_9fa48("2484", "2485", "2486"), course.rows.length === 0)) {
        if (stryMutAct_9fa48("2487")) {
          {}
        } else {
          stryCov_9fa48("2487");
          return stryMutAct_9fa48("2488") ? true : (stryCov_9fa48("2488"), false); // Course not found or doesn't belong to user
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
      await db.query(stryMutAct_9fa48("2489") ? "" : (stryCov_9fa48("2489"), 'DELETE FROM courses WHERE id = $1 AND learner_id = $2'), stryMutAct_9fa48("2490") ? [] : (stryCov_9fa48("2490"), [courseId, userId]));
      return stryMutAct_9fa48("2491") ? false : (stryCov_9fa48("2491"), true);
    }
  }

  /**
   * Update lesson exercises
   */
  async updateLessonExercises(lessonDbId, exercises) {
    if (stryMutAct_9fa48("2492")) {
      {}
    } else {
      stryCov_9fa48("2492");
      await db.query(stryMutAct_9fa48("2493") ? `` : (stryCov_9fa48("2493"), `UPDATE course_lessons 
       SET exercises = $1::jsonb, updated_at = NOW()
       WHERE id = $2`), stryMutAct_9fa48("2494") ? [] : (stryCov_9fa48("2494"), [JSON.stringify(exercises), lessonDbId]));
    }
  }

  /**
   * Find all active courses: AI courses (user-specific) + Admin courses (shared)
   */
  async findAllActiveCourses(userId) {
    if (stryMutAct_9fa48("2495")) {
      {}
    } else {
      stryCov_9fa48("2495");
      console.log(stryMutAct_9fa48("2496") ? "" : (stryCov_9fa48("2496"), '📊 Fetching courses for userId:'), userId);
      const result = await db.query(stryMutAct_9fa48("2497") ? `` : (stryCov_9fa48("2497"), `-- Part 1: AI-generated courses (ONLY for this specific user)
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
       
       ORDER BY created_at DESC`), stryMutAct_9fa48("2498") ? [] : (stryCov_9fa48("2498"), [userId]));
      console.log(stryMutAct_9fa48("2499") ? `` : (stryCov_9fa48("2499"), `✅ Found ${result.rows.length} courses for user ${userId}`));
      result.rows.forEach(course => {
        if (stryMutAct_9fa48("2500")) {
          {}
        } else {
          stryCov_9fa48("2500");
          console.log(stryMutAct_9fa48("2501") ? `` : (stryCov_9fa48("2501"), `  - ${course.title} (${course.source_type}) - learner_id: ${stryMutAct_9fa48("2504") ? course.learner_id && 'N/A (admin course)' : stryMutAct_9fa48("2503") ? false : stryMutAct_9fa48("2502") ? true : (stryCov_9fa48("2502", "2503", "2504"), course.learner_id || (stryMutAct_9fa48("2505") ? "" : (stryCov_9fa48("2505"), 'N/A (admin course)')))}`));
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
    if (stryMutAct_9fa48("2506")) {
      {}
    } else {
      stryCov_9fa48("2506");
      const result = await db.query(stryMutAct_9fa48("2507") ? `` : (stryCov_9fa48("2507"), `SELECT DISTINCT language, COUNT(*) as course_count
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
    if (stryMutAct_9fa48("2508")) {
      {}
    } else {
      stryCov_9fa48("2508");
      const result = await db.query(stryMutAct_9fa48("2509") ? `` : (stryCov_9fa48("2509"), `SELECT id, language, level, title, description, thumbnail_url, estimated_duration,
              is_published, total_units, total_lessons, created_at, updated_at
       FROM language_modules
       WHERE language = $1 AND is_published = true
       ORDER BY created_at DESC`), stryMutAct_9fa48("2510") ? [] : (stryCov_9fa48("2510"), [language]));
      return result.rows;
    }
  }

  /**
   * Get published course details with units and lessons
   */
  async getPublishedCourseDetails(courseId) {
    if (stryMutAct_9fa48("2511")) {
      {}
    } else {
      stryCov_9fa48("2511");
      const result = await db.query(stryMutAct_9fa48("2512") ? `` : (stryCov_9fa48("2512"), `SELECT id, language, level, title, description, thumbnail_url, estimated_duration,
              is_published, total_units, total_lessons, created_at, updated_at
       FROM language_modules
       WHERE id = $1 AND is_published = true`), stryMutAct_9fa48("2513") ? [] : (stryCov_9fa48("2513"), [courseId]));
      if (stryMutAct_9fa48("2516") ? result.rows.length !== 0 : stryMutAct_9fa48("2515") ? false : stryMutAct_9fa48("2514") ? true : (stryCov_9fa48("2514", "2515", "2516"), result.rows.length === 0)) {
        if (stryMutAct_9fa48("2517")) {
          {}
        } else {
          stryCov_9fa48("2517");
          return null;
        }
      }
      const course = result.rows[0];

      // Fetch units for this course (using module_id, not course_id)
      const unitsResult = await db.query(stryMutAct_9fa48("2518") ? `` : (stryCov_9fa48("2518"), `SELECT id, module_id, title, description, difficulty, estimated_time, created_at
       FROM module_units
       WHERE module_id = $1
       ORDER BY created_at ASC`), stryMutAct_9fa48("2519") ? [] : (stryCov_9fa48("2519"), [courseId]));
      const units = unitsResult.rows;

      // Fetch lessons for each unit
      const unitsWithLessons = await Promise.all(units.map(async unit => {
        if (stryMutAct_9fa48("2520")) {
          {}
        } else {
          stryCov_9fa48("2520");
          const lessonsResult = await db.query(stryMutAct_9fa48("2521") ? `` : (stryCov_9fa48("2521"), `SELECT id, unit_id, title, content_type, description, media_url, 
                  key_phrases, vocabulary, grammar_points, exercises, xp_reward, created_at
           FROM module_lessons
           WHERE unit_id = $1
           ORDER BY created_at ASC`), stryMutAct_9fa48("2522") ? [] : (stryCov_9fa48("2522"), [unit.id]));
          return stryMutAct_9fa48("2523") ? {} : (stryCov_9fa48("2523"), {
            ...unit,
            lessons: lessonsResult.rows
          });
        }
      }));
      return stryMutAct_9fa48("2524") ? {} : (stryCov_9fa48("2524"), {
        ...course,
        units: unitsWithLessons
      });
    }
  }
}
export default new CourseRepository();