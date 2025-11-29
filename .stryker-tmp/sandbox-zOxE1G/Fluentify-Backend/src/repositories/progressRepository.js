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
    if (stryMutAct_9fa48("2807")) {
      {}
    } else {
      stryCov_9fa48("2807");
      const result = await db.query(stryMutAct_9fa48("2808") ? `` : (stryCov_9fa48("2808"), `SELECT unit_id, is_unlocked, is_completed 
       FROM unit_progress 
       WHERE learner_id = $1 AND course_id = $2
       ORDER BY unit_id`), stryMutAct_9fa48("2809") ? [] : (stryCov_9fa48("2809"), [userId, courseId]));
      return result.rows;
    }
  }

  /**
   * Get all lesson progress for a course
   */
  async findLessonProgress(userId, courseId) {
    if (stryMutAct_9fa48("2810")) {
      {}
    } else {
      stryCov_9fa48("2810");
      const result = await db.query(stryMutAct_9fa48("2811") ? `` : (stryCov_9fa48("2811"), `SELECT cu.unit_id, cl.lesson_id, lp.is_completed, lp.score, lp.xp_earned
       FROM lesson_progress lp
       JOIN course_lessons cl ON lp.lesson_id = cl.id
       JOIN course_units cu ON cl.unit_id = cu.id
       WHERE lp.learner_id = $1 AND lp.course_id = $2
       ORDER BY cu.unit_id, cl.lesson_id`), stryMutAct_9fa48("2812") ? [] : (stryCov_9fa48("2812"), [userId, courseId]));
      return result.rows;
    }
  }

  /**
   * Get specific lesson progress
   */
  async findSpecificLessonProgress(userId, courseId, unitNumber, lessonNumber) {
    if (stryMutAct_9fa48("2813")) {
      {}
    } else {
      stryCov_9fa48("2813");
      const result = await db.query(stryMutAct_9fa48("2814") ? `` : (stryCov_9fa48("2814"), `SELECT lp.* 
       FROM lesson_progress lp
       JOIN course_lessons cl ON lp.lesson_id = cl.id
       JOIN course_units cu ON cl.unit_id = cu.id
       WHERE lp.learner_id = $1 AND lp.course_id = $2 AND cu.unit_id = $3 AND cl.lesson_id = $4`), stryMutAct_9fa48("2815") ? [] : (stryCov_9fa48("2815"), [userId, courseId, unitNumber, lessonNumber]));
      return stryMutAct_9fa48("2818") ? result.rows[0] && null : stryMutAct_9fa48("2817") ? false : stryMutAct_9fa48("2816") ? true : (stryCov_9fa48("2816", "2817", "2818"), result.rows[0] || null);
    }
  }

  /**
   * Get user stats for a course
   */
  async findUserStats(userId, courseId) {
    if (stryMutAct_9fa48("2819")) {
      {}
    } else {
      stryCov_9fa48("2819");
      const result = await db.query(stryMutAct_9fa48("2820") ? `` : (stryCov_9fa48("2820"), `SELECT * FROM user_stats WHERE learner_id = $1 AND course_id = $2`), stryMutAct_9fa48("2821") ? [] : (stryCov_9fa48("2821"), [userId, courseId]));
      return stryMutAct_9fa48("2824") ? result.rows[0] && null : stryMutAct_9fa48("2823") ? false : stryMutAct_9fa48("2822") ? true : (stryCov_9fa48("2822", "2823", "2824"), result.rows[0] || null);
    }
  }

  /**
   * Create or update lesson progress
   */
  async upsertLessonProgress(userId, courseId, unitId, lessonId, score, xpEarned, vocabularyMastered = 0, totalVocabulary = 0) {
    if (stryMutAct_9fa48("2825")) {
      {}
    } else {
      stryCov_9fa48("2825");
      await db.query(stryMutAct_9fa48("2826") ? `` : (stryCov_9fa48("2826"), `INSERT INTO lesson_progress (learner_id, course_id, unit_id, lesson_id, is_completed, score, xp_earned, vocabulary_mastered, total_vocabulary, completion_time)
       VALUES ($1, $2, $3, $4, TRUE, $5, $6, $7, $8, NOW())
       ON CONFLICT (learner_id, lesson_id)
       DO UPDATE SET is_completed = TRUE, score = $5, xp_earned = $6, vocabulary_mastered = $7, total_vocabulary = $8, completion_time = NOW()`), stryMutAct_9fa48("2827") ? [] : (stryCov_9fa48("2827"), [userId, courseId, unitId, lessonId, score, xpEarned, vocabularyMastered, totalVocabulary]));
    }
  }

  /**
   * Save exercise attempt
   */
  async createExerciseAttempt(userId, courseId, unitId, lessonId, exerciseIndex, isCorrect, userAnswer) {
    if (stryMutAct_9fa48("2828")) {
      {}
    } else {
      stryCov_9fa48("2828");
      await db.query(stryMutAct_9fa48("2829") ? `` : (stryCov_9fa48("2829"), `INSERT INTO exercise_attempts (learner_id, course_id, unit_id, lesson_id, exercise_index, is_correct, user_answer)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`), stryMutAct_9fa48("2830") ? [] : (stryCov_9fa48("2830"), [userId, courseId, unitId, lessonId, exerciseIndex, isCorrect, userAnswer]));
    }
  }

  /**
   * Count completed lessons in a unit
   */
  async countCompletedLessonsInUnit(userId, courseId, unitNumber) {
    if (stryMutAct_9fa48("2831")) {
      {}
    } else {
      stryCov_9fa48("2831");
      const result = await db.query(stryMutAct_9fa48("2832") ? `` : (stryCov_9fa48("2832"), `SELECT COUNT(*) as total 
       FROM lesson_progress lp
       JOIN course_lessons cl ON lp.lesson_id = cl.id
       JOIN course_units cu ON cl.unit_id = cu.id
       WHERE lp.learner_id = $1 AND lp.course_id = $2 AND cu.unit_id = $3 AND lp.is_completed = TRUE`), stryMutAct_9fa48("2833") ? [] : (stryCov_9fa48("2833"), [userId, courseId, unitNumber]));
      return parseInt(result.rows[0].total);
    }
  }

  /**
   * Mark unit as complete
   */
  async markUnitComplete(userId, courseId, unitId) {
    if (stryMutAct_9fa48("2834")) {
      {}
    } else {
      stryCov_9fa48("2834");
      await db.query(stryMutAct_9fa48("2835") ? `` : (stryCov_9fa48("2835"), `INSERT INTO unit_progress (learner_id, course_id, unit_id, is_unlocked, is_completed, completed_at)
       VALUES ($1, $2, $3, TRUE, TRUE, NOW())
       ON CONFLICT (learner_id, course_id, unit_id)
       DO UPDATE SET is_completed = TRUE, completed_at = NOW()`), stryMutAct_9fa48("2836") ? [] : (stryCov_9fa48("2836"), [userId, courseId, unitId]));
    }
  }

  /**
   * Unlock next unit
   */
  async unlockUnit(userId, courseId, unitId) {
    if (stryMutAct_9fa48("2837")) {
      {}
    } else {
      stryCov_9fa48("2837");
      await db.query(stryMutAct_9fa48("2838") ? `` : (stryCov_9fa48("2838"), `INSERT INTO unit_progress (learner_id, course_id, unit_id, is_unlocked, is_completed)
       VALUES ($1, $2, $3, TRUE, FALSE)
       ON CONFLICT (learner_id, course_id, unit_id)
       DO UPDATE SET is_unlocked = TRUE`), stryMutAct_9fa48("2839") ? [] : (stryCov_9fa48("2839"), [userId, courseId, unitId]));
    }
  }

  /**
   * Create initial user stats
   */
  async createUserStats(userId, courseId, xpEarned, unitsCompleted, today) {
    if (stryMutAct_9fa48("2840")) {
      {}
    } else {
      stryCov_9fa48("2840");
      await db.query(stryMutAct_9fa48("2841") ? `` : (stryCov_9fa48("2841"), `INSERT INTO user_stats (learner_id, course_id, total_xp, lessons_completed, units_completed, current_streak, last_activity_date)
       VALUES ($1, $2, $3, 1, $4, 1, $5)`), stryMutAct_9fa48("2842") ? [] : (stryCov_9fa48("2842"), [userId, courseId, xpEarned, unitsCompleted, today]));
    }
  }

  /**
   * Update user streak only
   */
  async updateUserStreak(userId, courseId, newStreak, today) {
    if (stryMutAct_9fa48("2843")) {
      {}
    } else {
      stryCov_9fa48("2843");
      await db.query(stryMutAct_9fa48("2844") ? `` : (stryCov_9fa48("2844"), `UPDATE user_stats SET
        current_streak = $1,
        longest_streak = GREATEST(longest_streak, $1),
        last_activity_date = $2,
        updated_at = NOW()
       WHERE learner_id = $3 AND course_id = $4`), stryMutAct_9fa48("2845") ? [] : (stryCov_9fa48("2845"), [newStreak, today, userId, courseId]));
    }
  }

  /**
   * Initialize course progress (unlock first unit and create stats)
   */
  async initializeCourseProgress(courseId, userId) {
    if (stryMutAct_9fa48("2846")) {
      {}
    } else {
      stryCov_9fa48("2846");
      // Unlock first unit
      await db.query(stryMutAct_9fa48("2847") ? `` : (stryCov_9fa48("2847"), `INSERT INTO unit_progress (learner_id, course_id, unit_id, is_unlocked, is_completed)
       VALUES ($1, $2, 1, TRUE, FALSE)
       ON CONFLICT (learner_id, course_id, unit_id) DO NOTHING`), stryMutAct_9fa48("2848") ? [] : (stryCov_9fa48("2848"), [userId, courseId]));

      // Initialize user stats
      await db.query(stryMutAct_9fa48("2849") ? `` : (stryCov_9fa48("2849"), `INSERT INTO user_stats (learner_id, course_id, total_xp, lessons_completed, units_completed, current_streak, longest_streak)
       VALUES ($1, $2, 0, 0, 0, 0, 0)
       ON CONFLICT (learner_id, course_id) DO NOTHING`), stryMutAct_9fa48("2850") ? [] : (stryCov_9fa48("2850"), [userId, courseId]));
    }
  }

  /**
   * Get summary KPIs for progress report
   * Can be filtered by courseId
   */
  async getSummaryKPIs(userId, days = null, courseId = null) {
    if (stryMutAct_9fa48("2851")) {
      {}
    } else {
      stryCov_9fa48("2851");
      const dateFilter = days ? stryMutAct_9fa48("2852") ? `` : (stryCov_9fa48("2852"), `AND completion_time >= NOW() - INTERVAL '${days} days'`) : stryMutAct_9fa48("2853") ? "Stryker was here!" : (stryCov_9fa48("2853"), '');
      const courseFilter = courseId ? stryMutAct_9fa48("2854") ? `` : (stryCov_9fa48("2854"), `AND course_id = ${parseInt(courseId)}`) : stryMutAct_9fa48("2855") ? "Stryker was here!" : (stryCov_9fa48("2855"), '');
      const result = await db.query(stryMutAct_9fa48("2856") ? `` : (stryCov_9fa48("2856"), `SELECT 
        COALESCE(SUM(xp_earned), 0)::INTEGER as total_xp,
        COUNT(DISTINCT CASE WHEN is_completed THEN lesson_id END)::INTEGER as lessons_completed,
        COALESCE(SUM(vocabulary_mastered), 0)::INTEGER as total_vocabulary,
        COALESCE((
          SELECT MAX(current_streak) FROM user_stats WHERE learner_id = $1
        ), 0)::INTEGER as current_streak,
        COALESCE((
          SELECT MAX(longest_streak) FROM user_stats WHERE learner_id = $1
        ), 0)::INTEGER as longest_streak
      FROM lesson_progress
      WHERE learner_id = $1 ${dateFilter} ${courseFilter}`), stryMutAct_9fa48("2857") ? [] : (stryCov_9fa48("2857"), [userId]));
      return stryMutAct_9fa48("2860") ? result.rows[0] && {
        total_xp: 0,
        lessons_completed: 0,
        total_vocabulary: 0,
        current_streak: 0,
        longest_streak: 0
      } : stryMutAct_9fa48("2859") ? false : stryMutAct_9fa48("2858") ? true : (stryCov_9fa48("2858", "2859", "2860"), result.rows[0] || (stryMutAct_9fa48("2861") ? {} : (stryCov_9fa48("2861"), {
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
    if (stryMutAct_9fa48("2862")) {
      {}
    } else {
      stryCov_9fa48("2862");
      const dateFilter = days ? stryMutAct_9fa48("2863") ? `` : (stryCov_9fa48("2863"), `AND lp.completion_time >= NOW() - INTERVAL '${days} days'`) : stryMutAct_9fa48("2864") ? "Stryker was here!" : (stryCov_9fa48("2864"), '');
      const courseFilter = courseId ? stryMutAct_9fa48("2865") ? `` : (stryCov_9fa48("2865"), `AND lp.course_id = ${parseInt(courseId)}`) : stryMutAct_9fa48("2866") ? "Stryker was here!" : (stryCov_9fa48("2866"), '');
      const result = await db.query(stryMutAct_9fa48("2867") ? `` : (stryCov_9fa48("2867"), `SELECT 
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
      ORDER BY date ASC`), stryMutAct_9fa48("2868") ? [] : (stryCov_9fa48("2868"), [userId]));
      return result.rows;
    }
  }

  /**
   * Get recent activity
   * Can be filtered by courseId
   */
  async getRecentActivity(userId, limit = 5, courseId = null) {
    if (stryMutAct_9fa48("2869")) {
      {}
    } else {
      stryCov_9fa48("2869");
      const courseFilter = courseId ? stryMutAct_9fa48("2870") ? `` : (stryCov_9fa48("2870"), `AND lp.course_id = ${parseInt(courseId)}`) : stryMutAct_9fa48("2871") ? "Stryker was here!" : (stryCov_9fa48("2871"), '');
      const result = await db.query(stryMutAct_9fa48("2872") ? `` : (stryCov_9fa48("2872"), `SELECT 
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
      LIMIT $2`), stryMutAct_9fa48("2873") ? [] : (stryCov_9fa48("2873"), [userId, limit]));
      return result.rows;
    }
  }
}
export default new ProgressRepository();