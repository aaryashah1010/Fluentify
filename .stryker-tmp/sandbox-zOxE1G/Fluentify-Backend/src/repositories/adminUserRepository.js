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
class AdminUserRepository {
  /**
   * FIX: Find learners with accurate last activity date
   * Checks multiple sources: user_stats, lesson_progress, and learner_enrollments
   * Uses parameterized queries to prevent SQL injection
   */
  async findLearners({
    search = stryMutAct_9fa48("2060") ? "Stryker was here!" : (stryCov_9fa48("2060"), ''),
    limit = 20,
    offset = 0
  }) {
    if (stryMutAct_9fa48("2061")) {
      {}
    } else {
      stryCov_9fa48("2061");
      // Ensure limit and offset are valid integers
      const limitInt = stryMutAct_9fa48("2062") ? Math.max(Math.max(parseInt(limit, 10) || 20, 1), 100) : (stryCov_9fa48("2062"), Math.min(stryMutAct_9fa48("2063") ? Math.min(parseInt(limit, 10) || 20, 1) : (stryCov_9fa48("2063"), Math.max(stryMutAct_9fa48("2066") ? parseInt(limit, 10) && 20 : stryMutAct_9fa48("2065") ? false : stryMutAct_9fa48("2064") ? true : (stryCov_9fa48("2064", "2065", "2066"), parseInt(limit, 10) || 20), 1)), 100));
      const offsetInt = stryMutAct_9fa48("2067") ? Math.min(parseInt(offset, 10) || 0, 0) : (stryCov_9fa48("2067"), Math.max(stryMutAct_9fa48("2070") ? parseInt(offset, 10) && 0 : stryMutAct_9fa48("2069") ? false : stryMutAct_9fa48("2068") ? true : (stryCov_9fa48("2068", "2069", "2070"), parseInt(offset, 10) || 0), 0));
      const params = stryMutAct_9fa48("2071") ? ["Stryker was here"] : (stryCov_9fa48("2071"), []);
      let where = stryMutAct_9fa48("2072") ? "Stryker was here!" : (stryCov_9fa48("2072"), '');
      let paramIndex = 1;
      if (stryMutAct_9fa48("2074") ? false : stryMutAct_9fa48("2073") ? true : (stryCov_9fa48("2073", "2074"), search)) {
        if (stryMutAct_9fa48("2075")) {
          {}
        } else {
          stryCov_9fa48("2075");
          params.push(stryMutAct_9fa48("2076") ? `` : (stryCov_9fa48("2076"), `%${search}%`));
          params.push(stryMutAct_9fa48("2077") ? `` : (stryCov_9fa48("2077"), `%${search}%`));
          where = stryMutAct_9fa48("2078") ? `` : (stryCov_9fa48("2078"), `WHERE LOWER(name) ILIKE LOWER($${paramIndex}) OR LOWER(email) ILIKE LOWER($${stryMutAct_9fa48("2079") ? paramIndex - 1 : (stryCov_9fa48("2079"), paramIndex + 1)})`);
          stryMutAct_9fa48("2080") ? paramIndex -= 2 : (stryCov_9fa48("2080"), paramIndex += 2);
        }
      }

      // FIX: Get last activity from multiple sources for accuracy
      // FIX: Use parameterized queries for limit and offset
      const result = await db.query(stryMutAct_9fa48("2081") ? `` : (stryCov_9fa48("2081"), `SELECT 
        id, 
        name, 
        email, 
        created_at,
        (
          SELECT MAX(activity_date) FROM (
            SELECT MAX(us.last_activity_date) as activity_date
            FROM user_stats us
            WHERE us.learner_id = learners.id
            UNION ALL
            SELECT MAX(lp.last_accessed) as activity_date
            FROM lesson_progress lp
            WHERE lp.learner_id = learners.id
            UNION ALL
            SELECT MAX(le.enrolled_at) as activity_date
            FROM learner_enrollments le
            WHERE le.learner_id = learners.id
          ) combined_activities
        ) AS last_activity_date
       FROM learners
       ${where}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${stryMutAct_9fa48("2082") ? paramIndex - 1 : (stryCov_9fa48("2082"), paramIndex + 1)}`), stryMutAct_9fa48("2083") ? [] : (stryCov_9fa48("2083"), [...params, limitInt, offsetInt]));
      return result.rows;
    }
  }
  async countLearners({
    search = stryMutAct_9fa48("2084") ? "Stryker was here!" : (stryCov_9fa48("2084"), '')
  }) {
    if (stryMutAct_9fa48("2085")) {
      {}
    } else {
      stryCov_9fa48("2085");
      const params = stryMutAct_9fa48("2086") ? ["Stryker was here"] : (stryCov_9fa48("2086"), []);
      let where = stryMutAct_9fa48("2087") ? "Stryker was here!" : (stryCov_9fa48("2087"), '');
      if (stryMutAct_9fa48("2089") ? false : stryMutAct_9fa48("2088") ? true : (stryCov_9fa48("2088", "2089"), search)) {
        if (stryMutAct_9fa48("2090")) {
          {}
        } else {
          stryCov_9fa48("2090");
          params.push(stryMutAct_9fa48("2091") ? `` : (stryCov_9fa48("2091"), `%${search}%`));
          params.push(stryMutAct_9fa48("2092") ? `` : (stryCov_9fa48("2092"), `%${search}%`));
          where = stryMutAct_9fa48("2093") ? "" : (stryCov_9fa48("2093"), 'WHERE LOWER(name) ILIKE LOWER($1) OR LOWER(email) ILIKE LOWER($2)');
        }
      }
      const result = await db.query(stryMutAct_9fa48("2094") ? `` : (stryCov_9fa48("2094"), `SELECT COUNT(*)::int AS count FROM learners ${where}`), params);
      return stryMutAct_9fa48("2097") ? result.rows[0]?.count && 0 : stryMutAct_9fa48("2096") ? false : stryMutAct_9fa48("2095") ? true : (stryCov_9fa48("2095", "2096", "2097"), (stryMutAct_9fa48("2098") ? result.rows[0].count : (stryCov_9fa48("2098"), result.rows[0]?.count)) || 0);
    }
  }
  async getLearnerBasicById(id) {
    if (stryMutAct_9fa48("2099")) {
      {}
    } else {
      stryCov_9fa48("2099");
      const result = await db.query(stryMutAct_9fa48("2100") ? `` : (stryCov_9fa48("2100"), `SELECT id, name, email, created_at, updated_at, is_email_verified, email_verified_at
       FROM learners WHERE id = $1`), stryMutAct_9fa48("2101") ? [] : (stryCov_9fa48("2101"), [id]));
      return stryMutAct_9fa48("2104") ? result.rows[0] && null : stryMutAct_9fa48("2103") ? false : stryMutAct_9fa48("2102") ? true : (stryCov_9fa48("2102", "2103", "2104"), result.rows[0] || null);
    }
  }

  /**
   * FIX: Get learner progress summary with accurate last activity
   * Directly aggregates from lesson_progress and unit_progress for accuracy
   * Falls back to user_stats only for streak data
   */
  async getLearnerProgressSummary(id) {
    if (stryMutAct_9fa48("2105")) {
      {}
    } else {
      stryCov_9fa48("2105");
      const result = await db.query(stryMutAct_9fa48("2106") ? `` : (stryCov_9fa48("2106"), `SELECT 
         -- XP: Direct sum from lesson_progress (source of truth)
         COALESCE((
           SELECT SUM(lp.xp_earned) 
           FROM lesson_progress lp 
           WHERE lp.learner_id = $1
         ), 0) AS total_xp,
         
         -- Lessons completed: Direct count from lesson_progress
         COALESCE((
           SELECT COUNT(*) 
           FROM lesson_progress lp 
           WHERE lp.learner_id = $1 AND lp.is_completed = true
         ), 0) AS lessons_completed,
         
         -- Units completed: Direct count from unit_progress
         COALESCE((
           SELECT COUNT(*) 
           FROM unit_progress up
           WHERE up.learner_id = $1 AND up.is_completed = true
         ), 0) AS units_completed,
         
         -- Streaks: Get max from user_stats (these are maintained per course)
         COALESCE((
           SELECT MAX(current_streak)
           FROM user_stats 
           WHERE learner_id = $1
         ), 0) AS current_streak,
         
         COALESCE((
           SELECT MAX(longest_streak)
           FROM user_stats 
           WHERE learner_id = $1
         ), 0) AS longest_streak,
         
         -- Last activity: Most recent from all sources
         (
           SELECT MAX(activity_date) FROM (
             SELECT MAX(last_activity_date) as activity_date
             FROM user_stats WHERE learner_id = $1
             UNION ALL
             SELECT MAX(last_accessed) as activity_date
             FROM lesson_progress WHERE learner_id = $1
             UNION ALL
             SELECT MAX(completion_time) as activity_date
             FROM lesson_progress WHERE learner_id = $1 AND is_completed = true
             UNION ALL
             SELECT MAX(enrolled_at) as activity_date
             FROM learner_enrollments WHERE learner_id = $1
           ) combined
         ) AS last_activity_date`), stryMutAct_9fa48("2107") ? [] : (stryCov_9fa48("2107"), [id]));
      return stryMutAct_9fa48("2110") ? result.rows[0] && {
        total_xp: 0,
        lessons_completed: 0,
        units_completed: 0,
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null
      } : stryMutAct_9fa48("2109") ? false : stryMutAct_9fa48("2108") ? true : (stryCov_9fa48("2108", "2109", "2110"), result.rows[0] || (stryMutAct_9fa48("2111") ? {} : (stryCov_9fa48("2111"), {
        total_xp: 0,
        lessons_completed: 0,
        units_completed: 0,
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null
      })));
    }
  }
  async updateLearnerProfile(id, {
    name,
    email
  }) {
    if (stryMutAct_9fa48("2112")) {
      {}
    } else {
      stryCov_9fa48("2112");
      let newEmail = email;
      if (stryMutAct_9fa48("2114") ? false : stryMutAct_9fa48("2113") ? true : (stryCov_9fa48("2113", "2114"), newEmail)) newEmail = stryMutAct_9fa48("2115") ? newEmail.toUpperCase() : (stryCov_9fa48("2115"), newEmail.toLowerCase());
      if (stryMutAct_9fa48("2117") ? false : stryMutAct_9fa48("2116") ? true : (stryCov_9fa48("2116", "2117"), newEmail)) {
        if (stryMutAct_9fa48("2118")) {
          {}
        } else {
          stryCov_9fa48("2118");
          const exists = await db.query(stryMutAct_9fa48("2119") ? `` : (stryCov_9fa48("2119"), `SELECT 1 FROM learners WHERE LOWER(email) = LOWER($1) AND id <> $2 LIMIT 1`), stryMutAct_9fa48("2120") ? [] : (stryCov_9fa48("2120"), [newEmail, id]));
          if (stryMutAct_9fa48("2124") ? exists.rows.length <= 0 : stryMutAct_9fa48("2123") ? exists.rows.length >= 0 : stryMutAct_9fa48("2122") ? false : stryMutAct_9fa48("2121") ? true : (stryCov_9fa48("2121", "2122", "2123", "2124"), exists.rows.length > 0)) {
            if (stryMutAct_9fa48("2125")) {
              {}
            } else {
              stryCov_9fa48("2125");
              const err = new Error(stryMutAct_9fa48("2126") ? "" : (stryCov_9fa48("2126"), 'Email already in use'));
              err.statusCode = 409;
              throw err;
            }
          }
        }
      }
      const result = await db.query(stryMutAct_9fa48("2127") ? `` : (stryCov_9fa48("2127"), `UPDATE learners
       SET name = COALESCE($1, name),
           email = COALESCE(LOWER($2), email),
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email, created_at, updated_at, is_email_verified, email_verified_at`), stryMutAct_9fa48("2128") ? [] : (stryCov_9fa48("2128"), [stryMutAct_9fa48("2131") ? name && null : stryMutAct_9fa48("2130") ? false : stryMutAct_9fa48("2129") ? true : (stryCov_9fa48("2129", "2130", "2131"), name || null), stryMutAct_9fa48("2134") ? newEmail && null : stryMutAct_9fa48("2133") ? false : stryMutAct_9fa48("2132") ? true : (stryCov_9fa48("2132", "2133", "2134"), newEmail || null), id]));
      return stryMutAct_9fa48("2137") ? result.rows[0] && null : stryMutAct_9fa48("2136") ? false : stryMutAct_9fa48("2135") ? true : (stryCov_9fa48("2135", "2136", "2137"), result.rows[0] || null);
    }
  }
}
export default new AdminUserRepository();