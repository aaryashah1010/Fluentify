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
    search = stryMutAct_9fa48("1900") ? "Stryker was here!" : (stryCov_9fa48("1900"), ''),
    limit = 20,
    offset = 0
  }) {
    if (stryMutAct_9fa48("1901")) {
      {}
    } else {
      stryCov_9fa48("1901");
      // Ensure limit and offset are valid integers
      const limitInt = stryMutAct_9fa48("1902") ? Math.max(Math.max(parseInt(limit, 10) || 20, 1), 100) : (stryCov_9fa48("1902"), Math.min(stryMutAct_9fa48("1903") ? Math.min(parseInt(limit, 10) || 20, 1) : (stryCov_9fa48("1903"), Math.max(stryMutAct_9fa48("1906") ? parseInt(limit, 10) && 20 : stryMutAct_9fa48("1905") ? false : stryMutAct_9fa48("1904") ? true : (stryCov_9fa48("1904", "1905", "1906"), parseInt(limit, 10) || 20), 1)), 100));
      const offsetInt = stryMutAct_9fa48("1907") ? Math.min(parseInt(offset, 10) || 0, 0) : (stryCov_9fa48("1907"), Math.max(stryMutAct_9fa48("1910") ? parseInt(offset, 10) && 0 : stryMutAct_9fa48("1909") ? false : stryMutAct_9fa48("1908") ? true : (stryCov_9fa48("1908", "1909", "1910"), parseInt(offset, 10) || 0), 0));
      const params = stryMutAct_9fa48("1911") ? ["Stryker was here"] : (stryCov_9fa48("1911"), []);
      let where = stryMutAct_9fa48("1912") ? "Stryker was here!" : (stryCov_9fa48("1912"), '');
      let paramIndex = 1;
      if (stryMutAct_9fa48("1914") ? false : stryMutAct_9fa48("1913") ? true : (stryCov_9fa48("1913", "1914"), search)) {
        if (stryMutAct_9fa48("1915")) {
          {}
        } else {
          stryCov_9fa48("1915");
          params.push(stryMutAct_9fa48("1916") ? `` : (stryCov_9fa48("1916"), `%${search}%`));
          params.push(stryMutAct_9fa48("1917") ? `` : (stryCov_9fa48("1917"), `%${search}%`));
          where = stryMutAct_9fa48("1918") ? `` : (stryCov_9fa48("1918"), `WHERE LOWER(name) ILIKE LOWER($${paramIndex}) OR LOWER(email) ILIKE LOWER($${stryMutAct_9fa48("1919") ? paramIndex - 1 : (stryCov_9fa48("1919"), paramIndex + 1)})`);
          stryMutAct_9fa48("1920") ? paramIndex -= 2 : (stryCov_9fa48("1920"), paramIndex += 2);
        }
      }

      // FIX: Get last activity from multiple sources for accuracy
      // FIX: Use parameterized queries for limit and offset
      const result = await db.query(stryMutAct_9fa48("1921") ? `` : (stryCov_9fa48("1921"), `SELECT 
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
       LIMIT $${paramIndex} OFFSET $${stryMutAct_9fa48("1922") ? paramIndex - 1 : (stryCov_9fa48("1922"), paramIndex + 1)}`), stryMutAct_9fa48("1923") ? [] : (stryCov_9fa48("1923"), [...params, limitInt, offsetInt]));
      return result.rows;
    }
  }
  async countLearners({
    search = stryMutAct_9fa48("1924") ? "Stryker was here!" : (stryCov_9fa48("1924"), '')
  }) {
    if (stryMutAct_9fa48("1925")) {
      {}
    } else {
      stryCov_9fa48("1925");
      const params = stryMutAct_9fa48("1926") ? ["Stryker was here"] : (stryCov_9fa48("1926"), []);
      let where = stryMutAct_9fa48("1927") ? "Stryker was here!" : (stryCov_9fa48("1927"), '');
      if (stryMutAct_9fa48("1929") ? false : stryMutAct_9fa48("1928") ? true : (stryCov_9fa48("1928", "1929"), search)) {
        if (stryMutAct_9fa48("1930")) {
          {}
        } else {
          stryCov_9fa48("1930");
          params.push(stryMutAct_9fa48("1931") ? `` : (stryCov_9fa48("1931"), `%${search}%`));
          params.push(stryMutAct_9fa48("1932") ? `` : (stryCov_9fa48("1932"), `%${search}%`));
          where = stryMutAct_9fa48("1933") ? "" : (stryCov_9fa48("1933"), 'WHERE LOWER(name) ILIKE LOWER($1) OR LOWER(email) ILIKE LOWER($2)');
        }
      }
      const result = await db.query(stryMutAct_9fa48("1934") ? `` : (stryCov_9fa48("1934"), `SELECT COUNT(*)::int AS count FROM learners ${where}`), params);
      return stryMutAct_9fa48("1937") ? result.rows[0]?.count && 0 : stryMutAct_9fa48("1936") ? false : stryMutAct_9fa48("1935") ? true : (stryCov_9fa48("1935", "1936", "1937"), (stryMutAct_9fa48("1938") ? result.rows[0].count : (stryCov_9fa48("1938"), result.rows[0]?.count)) || 0);
    }
  }
  async getLearnerBasicById(id) {
    if (stryMutAct_9fa48("1939")) {
      {}
    } else {
      stryCov_9fa48("1939");
      const result = await db.query(stryMutAct_9fa48("1940") ? `` : (stryCov_9fa48("1940"), `SELECT id, name, email, created_at, updated_at, is_email_verified, email_verified_at
       FROM learners WHERE id = $1`), stryMutAct_9fa48("1941") ? [] : (stryCov_9fa48("1941"), [id]));
      return stryMutAct_9fa48("1944") ? result.rows[0] && null : stryMutAct_9fa48("1943") ? false : stryMutAct_9fa48("1942") ? true : (stryCov_9fa48("1942", "1943", "1944"), result.rows[0] || null);
    }
  }

  /**
   * FIX: Get learner progress summary with accurate last activity
   * Directly aggregates from lesson_progress and unit_progress for accuracy
   * Falls back to user_stats only for streak data
   */
  async getLearnerProgressSummary(id) {
    if (stryMutAct_9fa48("1945")) {
      {}
    } else {
      stryCov_9fa48("1945");
      const result = await db.query(stryMutAct_9fa48("1946") ? `` : (stryCov_9fa48("1946"), `SELECT 
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
         ) AS last_activity_date`), stryMutAct_9fa48("1947") ? [] : (stryCov_9fa48("1947"), [id]));
      return stryMutAct_9fa48("1950") ? result.rows[0] && {
        total_xp: 0,
        lessons_completed: 0,
        units_completed: 0,
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null
      } : stryMutAct_9fa48("1949") ? false : stryMutAct_9fa48("1948") ? true : (stryCov_9fa48("1948", "1949", "1950"), result.rows[0] || (stryMutAct_9fa48("1951") ? {} : (stryCov_9fa48("1951"), {
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
    if (stryMutAct_9fa48("1952")) {
      {}
    } else {
      stryCov_9fa48("1952");
      let newEmail = email;
      if (stryMutAct_9fa48("1954") ? false : stryMutAct_9fa48("1953") ? true : (stryCov_9fa48("1953", "1954"), newEmail)) newEmail = stryMutAct_9fa48("1955") ? newEmail.toUpperCase() : (stryCov_9fa48("1955"), newEmail.toLowerCase());
      if (stryMutAct_9fa48("1957") ? false : stryMutAct_9fa48("1956") ? true : (stryCov_9fa48("1956", "1957"), newEmail)) {
        if (stryMutAct_9fa48("1958")) {
          {}
        } else {
          stryCov_9fa48("1958");
          const exists = await db.query(stryMutAct_9fa48("1959") ? `` : (stryCov_9fa48("1959"), `SELECT 1 FROM learners WHERE LOWER(email) = LOWER($1) AND id <> $2 LIMIT 1`), stryMutAct_9fa48("1960") ? [] : (stryCov_9fa48("1960"), [newEmail, id]));
          if (stryMutAct_9fa48("1964") ? exists.rows.length <= 0 : stryMutAct_9fa48("1963") ? exists.rows.length >= 0 : stryMutAct_9fa48("1962") ? false : stryMutAct_9fa48("1961") ? true : (stryCov_9fa48("1961", "1962", "1963", "1964"), exists.rows.length > 0)) {
            if (stryMutAct_9fa48("1965")) {
              {}
            } else {
              stryCov_9fa48("1965");
              const err = new Error(stryMutAct_9fa48("1966") ? "" : (stryCov_9fa48("1966"), 'Email already in use'));
              err.statusCode = 409;
              throw err;
            }
          }
        }
      }
      const result = await db.query(stryMutAct_9fa48("1967") ? `` : (stryCov_9fa48("1967"), `UPDATE learners
       SET name = COALESCE($1, name),
           email = COALESCE(LOWER($2), email),
           updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email, created_at, updated_at, is_email_verified, email_verified_at`), stryMutAct_9fa48("1968") ? [] : (stryCov_9fa48("1968"), [stryMutAct_9fa48("1971") ? name && null : stryMutAct_9fa48("1970") ? false : stryMutAct_9fa48("1969") ? true : (stryCov_9fa48("1969", "1970", "1971"), name || null), stryMutAct_9fa48("1974") ? newEmail && null : stryMutAct_9fa48("1973") ? false : stryMutAct_9fa48("1972") ? true : (stryCov_9fa48("1972", "1973", "1974"), newEmail || null), id]));
      return stryMutAct_9fa48("1977") ? result.rows[0] && null : stryMutAct_9fa48("1976") ? false : stryMutAct_9fa48("1975") ? true : (stryCov_9fa48("1975", "1976", "1977"), result.rows[0] || null);
    }
  }
}
export default new AdminUserRepository();