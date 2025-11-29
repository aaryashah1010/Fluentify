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
class ProgressRepository {
  /**
   * Get all unit progress for a course
   */
  async findUnitProgress(userId, courseId) {
    if (stryMutAct_9fa48("2645")) {
      {}
    } else {
      stryCov_9fa48("2645");
      const result = await db.query(stryMutAct_9fa48("2646") ? `` : (stryCov_9fa48("2646"), `SELECT unit_id, is_unlocked, is_completed 
       FROM unit_progress 
       WHERE learner_id = $1 AND course_id = $2
       ORDER BY unit_id`), stryMutAct_9fa48("2647") ? [] : (stryCov_9fa48("2647"), [userId, courseId]));
      return result.rows;
    }
  }

  /**
   * Get all lesson progress for a course
   */
  async findLessonProgress(userId, courseId) {
    if (stryMutAct_9fa48("2648")) {
      {}
    } else {
      stryCov_9fa48("2648");
      const result = await db.query(stryMutAct_9fa48("2649") ? `` : (stryCov_9fa48("2649"), `SELECT cu.unit_id, cl.lesson_id, lp.is_completed, lp.score, lp.xp_earned
       FROM lesson_progress lp
       JOIN course_lessons cl ON lp.lesson_id = cl.id
       JOIN course_units cu ON cl.unit_id = cu.id
       WHERE lp.learner_id = $1 AND lp.course_id = $2
       ORDER BY cu.unit_id, cl.lesson_id`), stryMutAct_9fa48("2650") ? [] : (stryCov_9fa48("2650"), [userId, courseId]));
      return result.rows;
    }
  }

  /**
   * Get specific lesson progress
   */
  async findSpecificLessonProgress(userId, courseId, unitNumber, lessonNumber) {
    if (stryMutAct_9fa48("2651")) {
      {}
    } else {
      stryCov_9fa48("2651");
      const result = await db.query(stryMutAct_9fa48("2652") ? `` : (stryCov_9fa48("2652"), `SELECT lp.* 
       FROM lesson_progress lp
       JOIN course_lessons cl ON lp.lesson_id = cl.id
       JOIN course_units cu ON cl.unit_id = cu.id
       WHERE lp.learner_id = $1 AND lp.course_id = $2 AND cu.unit_id = $3 AND cl.lesson_id = $4`), stryMutAct_9fa48("2653") ? [] : (stryCov_9fa48("2653"), [userId, courseId, unitNumber, lessonNumber]));
      return stryMutAct_9fa48("2656") ? result.rows[0] && null : stryMutAct_9fa48("2655") ? false : stryMutAct_9fa48("2654") ? true : (stryCov_9fa48("2654", "2655", "2656"), result.rows[0] || null);
    }
  }

  /**
   * Get user stats for a course
   */
  async findUserStats(userId, courseId) {
    if (stryMutAct_9fa48("2657")) {
      {}
    } else {
      stryCov_9fa48("2657");
      const result = await db.query(stryMutAct_9fa48("2658") ? `` : (stryCov_9fa48("2658"), `SELECT * FROM user_stats WHERE learner_id = $1 AND course_id = $2`), stryMutAct_9fa48("2659") ? [] : (stryCov_9fa48("2659"), [userId, courseId]));
      return stryMutAct_9fa48("2662") ? result.rows[0] && null : stryMutAct_9fa48("2661") ? false : stryMutAct_9fa48("2660") ? true : (stryCov_9fa48("2660", "2661", "2662"), result.rows[0] || null);
    }
  }

  /**
   * Create or update lesson progress
   */
  async upsertLessonProgress(userId, courseId, unitId, lessonId, score, xpEarned, vocabularyMastered = 0, totalVocabulary = 0) {
    if (stryMutAct_9fa48("2663")) {
      {}
    } else {
      stryCov_9fa48("2663");
      await db.query(stryMutAct_9fa48("2664") ? `` : (stryCov_9fa48("2664"), `INSERT INTO lesson_progress (learner_id, course_id, unit_id, lesson_id, is_completed, score, xp_earned, vocabulary_mastered, total_vocabulary, completion_time)
       VALUES ($1, $2, $3, $4, TRUE, $5, $6, $7, $8, NOW())
       ON CONFLICT (learner_id, lesson_id)
       DO UPDATE SET is_completed = TRUE, score = $5, xp_earned = $6, vocabulary_mastered = $7, total_vocabulary = $8, completion_time = NOW()`), stryMutAct_9fa48("2665") ? [] : (stryCov_9fa48("2665"), [userId, courseId, unitId, lessonId, score, xpEarned, vocabularyMastered, totalVocabulary]));
    }
  }

  /**
   * Save exercise attempt
   */
  async createExerciseAttempt(userId, courseId, unitId, lessonId, exerciseIndex, isCorrect, userAnswer) {
    if (stryMutAct_9fa48("2666")) {
      {}
    } else {
      stryCov_9fa48("2666");
      await db.query(stryMutAct_9fa48("2667") ? `` : (stryCov_9fa48("2667"), `INSERT INTO exercise_attempts (learner_id, course_id, unit_id, lesson_id, exercise_index, is_correct, user_answer)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`), stryMutAct_9fa48("2668") ? [] : (stryCov_9fa48("2668"), [userId, courseId, unitId, lessonId, exerciseIndex, isCorrect, userAnswer]));
    }
  }

  /**
   * Count completed lessons in a unit
   */
  async countCompletedLessonsInUnit(userId, courseId, unitNumber) {
    if (stryMutAct_9fa48("2669")) {
      {}
    } else {
      stryCov_9fa48("2669");
      const result = await db.query(stryMutAct_9fa48("2670") ? `` : (stryCov_9fa48("2670"), `SELECT COUNT(*) as total 
       FROM lesson_progress lp
       JOIN course_lessons cl ON lp.lesson_id = cl.id
       JOIN course_units cu ON cl.unit_id = cu.id
       WHERE lp.learner_id = $1 AND lp.course_id = $2 AND cu.unit_id = $3 AND lp.is_completed = TRUE`), stryMutAct_9fa48("2671") ? [] : (stryCov_9fa48("2671"), [userId, courseId, unitNumber]));
      return parseInt(result.rows[0].total);
    }
  }

  /**
   * Mark unit as complete
   */
  async markUnitComplete(userId, courseId, unitId) {
    if (stryMutAct_9fa48("2672")) {
      {}
    } else {
      stryCov_9fa48("2672");
      await db.query(stryMutAct_9fa48("2673") ? `` : (stryCov_9fa48("2673"), `INSERT INTO unit_progress (learner_id, course_id, unit_id, is_unlocked, is_completed, completed_at)
       VALUES ($1, $2, $3, TRUE, TRUE, NOW())
       ON CONFLICT (learner_id, course_id, unit_id)
       DO UPDATE SET is_completed = TRUE, completed_at = NOW()`), stryMutAct_9fa48("2674") ? [] : (stryCov_9fa48("2674"), [userId, courseId, unitId]));
    }
  }

  /**
   * Unlock next unit
   */
  async unlockUnit(userId, courseId, unitId) {
    if (stryMutAct_9fa48("2675")) {
      {}
    } else {
      stryCov_9fa48("2675");
      await db.query(stryMutAct_9fa48("2676") ? `` : (stryCov_9fa48("2676"), `INSERT INTO unit_progress (learner_id, course_id, unit_id, is_unlocked, is_completed)
       VALUES ($1, $2, $3, TRUE, FALSE)
       ON CONFLICT (learner_id, course_id, unit_id)
       DO UPDATE SET is_unlocked = TRUE`), stryMutAct_9fa48("2677") ? [] : (stryCov_9fa48("2677"), [userId, courseId, unitId]));
    }
  }

  /**
   * Create initial user stats
   */
  async createUserStats(userId, courseId, xpEarned, unitsCompleted, today) {
    if (stryMutAct_9fa48("2678")) {
      {}
    } else {
      stryCov_9fa48("2678");
      await db.query(stryMutAct_9fa48("2679") ? `` : (stryCov_9fa48("2679"), `INSERT INTO user_stats (learner_id, course_id, total_xp, lessons_completed, units_completed, current_streak, last_activity_date)
       VALUES ($1, $2, $3, 1, $4, 1, $5)`), stryMutAct_9fa48("2680") ? [] : (stryCov_9fa48("2680"), [userId, courseId, xpEarned, unitsCompleted, today]));
    }
  }

  /**
   * Update user streak only
   */
  async updateUserStreak(userId, courseId, newStreak, today) {
    if (stryMutAct_9fa48("2681")) {
      {}
    } else {
      stryCov_9fa48("2681");
      await db.query(stryMutAct_9fa48("2682") ? `` : (stryCov_9fa48("2682"), `UPDATE user_stats SET
        current_streak = $1,
        longest_streak = GREATEST(longest_streak, $1),
        last_activity_date = $2,
        updated_at = NOW()
       WHERE learner_id = $3 AND course_id = $4`), stryMutAct_9fa48("2683") ? [] : (stryCov_9fa48("2683"), [newStreak, today, userId, courseId]));
    }
  }

  /**
   * Initialize course progress (unlock first unit and create stats)
   */
  async initializeCourseProgress(courseId, userId) {
    if (stryMutAct_9fa48("2684")) {
      {}
    } else {
      stryCov_9fa48("2684");
      // Unlock first unit
      await db.query(stryMutAct_9fa48("2685") ? `` : (stryCov_9fa48("2685"), `INSERT INTO unit_progress (learner_id, course_id, unit_id, is_unlocked, is_completed)
       VALUES ($1, $2, 1, TRUE, FALSE)
       ON CONFLICT (learner_id, course_id, unit_id) DO NOTHING`), stryMutAct_9fa48("2686") ? [] : (stryCov_9fa48("2686"), [userId, courseId]));

      // Initialize user stats
      await db.query(stryMutAct_9fa48("2687") ? `` : (stryCov_9fa48("2687"), `INSERT INTO user_stats (learner_id, course_id, total_xp, lessons_completed, units_completed, current_streak, longest_streak)
       VALUES ($1, $2, 0, 0, 0, 0, 0)
       ON CONFLICT (learner_id, course_id) DO NOTHING`), stryMutAct_9fa48("2688") ? [] : (stryCov_9fa48("2688"), [userId, courseId]));
    }
  }

  /**
   * Get summary KPIs for progress report
   * Can be filtered by courseId
   */
  async getSummaryKPIs(userId, days = null, courseId = null) {
    if (stryMutAct_9fa48("2689")) {
      {}
    } else {
      stryCov_9fa48("2689");
      const dateFilter = days ? stryMutAct_9fa48("2690") ? `` : (stryCov_9fa48("2690"), `AND completion_time >= NOW() - INTERVAL '${days} days'`) : stryMutAct_9fa48("2691") ? "Stryker was here!" : (stryCov_9fa48("2691"), '');
      const courseFilter = courseId ? stryMutAct_9fa48("2692") ? `` : (stryCov_9fa48("2692"), `AND course_id = ${parseInt(courseId)}`) : stryMutAct_9fa48("2693") ? "Stryker was here!" : (stryCov_9fa48("2693"), '');
      const result = await db.query(stryMutAct_9fa48("2694") ? `` : (stryCov_9fa48("2694"), `SELECT 
        COALESCE(SUM(xp_earned), 0)::INTEGER as total_xp,
        COUNT(DISTINCT CASE WHEN is_completed THEN lesson_id END)::INTEGER as lessons_completed,
        COALESCE(SUM(vocabulary_mastered), 0)::INTEGER as total_vocabulary,
        (SELECT COALESCE(MAX(current_streak), 0) FROM user_stats WHERE learner_id = $1 ${courseId ? stryMutAct_9fa48("2695") ? `` : (stryCov_9fa48("2695"), `AND course_id = ${parseInt(courseId)}`) : stryMutAct_9fa48("2696") ? "Stryker was here!" : (stryCov_9fa48("2696"), '')})::INTEGER as current_streak,
        (SELECT COALESCE(MAX(longest_streak), 0) FROM user_stats WHERE learner_id = $1 ${courseId ? stryMutAct_9fa48("2697") ? `` : (stryCov_9fa48("2697"), `AND course_id = ${parseInt(courseId)}`) : stryMutAct_9fa48("2698") ? "Stryker was here!" : (stryCov_9fa48("2698"), '')})::INTEGER as longest_streak
      FROM lesson_progress
      WHERE learner_id = $1 ${dateFilter} ${courseFilter}`), stryMutAct_9fa48("2699") ? [] : (stryCov_9fa48("2699"), [userId]));
      return stryMutAct_9fa48("2702") ? result.rows[0] && {
        total_xp: 0,
        lessons_completed: 0,
        total_vocabulary: 0,
        current_streak: 0,
        longest_streak: 0
      } : stryMutAct_9fa48("2701") ? false : stryMutAct_9fa48("2700") ? true : (stryCov_9fa48("2700", "2701", "2702"), result.rows[0] || (stryMutAct_9fa48("2703") ? {} : (stryCov_9fa48("2703"), {
        total_xp: 0,
        lessons_completed: 0,
        total_vocabulary: 0,
        current_streak: 0,
        longest_streak: 0
      })));
    }
  }

  /**
   * Get progress over time (grouped by date)
   * Can be filtered by courseId
   */
  async getProgressOverTime(userId, days = null, courseId = null) {
    if (stryMutAct_9fa48("2704")) {
      {}
    } else {
      stryCov_9fa48("2704");
      const dateFilter = days ? stryMutAct_9fa48("2705") ? `` : (stryCov_9fa48("2705"), `AND lp.completion_time >= NOW() - INTERVAL '${days} days'`) : stryMutAct_9fa48("2706") ? "Stryker was here!" : (stryCov_9fa48("2706"), '');
      const courseFilter = courseId ? stryMutAct_9fa48("2707") ? `` : (stryCov_9fa48("2707"), `AND lp.course_id = ${parseInt(courseId)}`) : stryMutAct_9fa48("2708") ? "Stryker was here!" : (stryCov_9fa48("2708"), '');
      const result = await db.query(stryMutAct_9fa48("2709") ? `` : (stryCov_9fa48("2709"), `SELECT 
        DATE(lp.completion_time) as date,
        SUM(lp.vocabulary_mastered)::INTEGER as vocabulary_learned,
        ROUND(AVG(lp.score), 1)::NUMERIC as avg_score,
        COUNT(*)::INTEGER as lessons_count
      FROM lesson_progress lp
      WHERE lp.learner_id = $1
        AND lp.is_completed = true
        AND lp.completion_time IS NOT NULL
        ${dateFilter}
        ${courseFilter}
      GROUP BY DATE(lp.completion_time)
      ORDER BY date ASC`), stryMutAct_9fa48("2710") ? [] : (stryCov_9fa48("2710"), [userId]));
      return result.rows;
    }
  }

  /**
   * Get recent activity
   * Can be filtered by courseId
   */
  async getRecentActivity(userId, limit = 5, courseId = null) {
    if (stryMutAct_9fa48("2711")) {
      {}
    } else {
      stryCov_9fa48("2711");
      const courseFilter = courseId ? stryMutAct_9fa48("2712") ? `` : (stryCov_9fa48("2712"), `AND lp.course_id = ${parseInt(courseId)}`) : stryMutAct_9fa48("2713") ? "Stryker was here!" : (stryCov_9fa48("2713"), '');
      const result = await db.query(stryMutAct_9fa48("2714") ? `` : (stryCov_9fa48("2714"), `SELECT 
        cl.title as lesson_title,
        c.language,
        c.title as course_title,
        lp.score,
        lp.xp_earned,
        lp.vocabulary_mastered,
        lp.completion_time
      FROM lesson_progress lp
      JOIN course_lessons cl ON lp.lesson_id = cl.id
      JOIN courses c ON lp.course_id = c.id
      WHERE lp.learner_id = $1
        AND lp.is_completed = true
        ${courseFilter}
      ORDER BY lp.completion_time DESC
      LIMIT $2`), stryMutAct_9fa48("2715") ? [] : (stryCov_9fa48("2715"), [userId, limit]));
      return result.rows;
    }
  }
}
export default new ProgressRepository();