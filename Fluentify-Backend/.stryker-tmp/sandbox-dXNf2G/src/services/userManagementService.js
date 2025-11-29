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
class UserManagementService {
  async getUsersList(page = 1, limit = 20) {
    if (stryMutAct_9fa48("3731")) {
      {}
    } else {
      stryCov_9fa48("3731");
      const offset = stryMutAct_9fa48("3732") ? (page - 1) / limit : (stryCov_9fa48("3732"), (stryMutAct_9fa48("3733") ? page + 1 : (stryCov_9fa48("3733"), page - 1)) * limit);
      const {
        rows: users
      } = await db.query(stryMutAct_9fa48("3734") ? `` : (stryCov_9fa48("3734"), `SELECT id, name, email, created_at, updated_at 
             FROM learners 
             ORDER BY created_at DESC 
             LIMIT $1 OFFSET $2`), stryMutAct_9fa48("3735") ? [] : (stryCov_9fa48("3735"), [limit, offset]));
      const {
        rows: [{
          count
        }]
      } = await db.query(stryMutAct_9fa48("3736") ? "" : (stryCov_9fa48("3736"), 'SELECT COUNT(*) FROM learners'));
      return stryMutAct_9fa48("3737") ? {} : (stryCov_9fa48("3737"), {
        users,
        pagination: stryMutAct_9fa48("3738") ? {} : (stryCov_9fa48("3738"), {
          total: parseInt(count),
          page,
          limit,
          totalPages: Math.ceil(stryMutAct_9fa48("3739") ? count * limit : (stryCov_9fa48("3739"), count / limit))
        })
      });
    }
  }
  async findUsers(searchTerm) {
    if (stryMutAct_9fa48("3740")) {
      {}
    } else {
      stryCov_9fa48("3740");
      const {
        rows
      } = await db.query(stryMutAct_9fa48("3741") ? `` : (stryCov_9fa48("3741"), `SELECT id, name, email, created_at 
             FROM learners 
             WHERE name ILIKE $1 OR email ILIKE $2 
             ORDER BY name`), stryMutAct_9fa48("3742") ? [] : (stryCov_9fa48("3742"), [stryMutAct_9fa48("3743") ? `` : (stryCov_9fa48("3743"), `%${searchTerm}%`), stryMutAct_9fa48("3744") ? `` : (stryCov_9fa48("3744"), `%${searchTerm}%`)]));
      return rows;
    }
  }
  async getUserWithProgress(userId) {
    if (stryMutAct_9fa48("3745")) {
      {}
    } else {
      stryCov_9fa48("3745");
      // Get user details
      const {
        rows: [user]
      } = await db.query(stryMutAct_9fa48("3746") ? `` : (stryCov_9fa48("3746"), `SELECT id, name, email, created_at, updated_at, is_email_verified 
             FROM learners 
             WHERE id = $1`), stryMutAct_9fa48("3747") ? [] : (stryCov_9fa48("3747"), [userId]));
      if (stryMutAct_9fa48("3750") ? false : stryMutAct_9fa48("3749") ? true : stryMutAct_9fa48("3748") ? user : (stryCov_9fa48("3748", "3749", "3750"), !user)) return null;

      // Get user's course progress with statistics (calculated dynamically)
      const {
        rows: courses
      } = await db.query(stryMutAct_9fa48("3751") ? `` : (stryCov_9fa48("3751"), `SELECT 
                c.id, 
                c.title, 
                c.language,
                c.expected_duration,
                c.course_data,
                c.is_completed,
                c.total_lessons,
                c.total_units,
                c.created_at,
                c.updated_at as last_accessed,
                'ai' as course_type,
                COALESCE((
                    SELECT COUNT(*) 
                    FROM lesson_progress lp 
                    WHERE lp.learner_id = c.learner_id AND lp.course_id = c.id AND lp.is_completed = true
                ), 0) as lessons_completed,
                COALESCE((
                    SELECT COUNT(*) 
                    FROM unit_progress up 
                    WHERE up.learner_id = c.learner_id AND up.course_id = c.id AND up.is_completed = true
                ), 0) as units_completed,
                ROUND(
                    COALESCE((
                        SELECT COUNT(*) 
                        FROM lesson_progress lp 
                        WHERE lp.learner_id = c.learner_id AND lp.course_id = c.id AND lp.is_completed = true
                    ), 0) * 100.0 /
                    GREATEST(c.total_lessons, 1), 1
                ) as progress_percentage
             FROM courses c
             WHERE c.learner_id = $1
             ORDER BY c.updated_at DESC`), stryMutAct_9fa48("3752") ? [] : (stryCov_9fa48("3752"), [userId]));

      // Get overall summary statistics (fixed to avoid row multiplication)
      const {
        rows: [summary]
      } = await db.query(stryMutAct_9fa48("3753") ? `` : (stryCov_9fa48("3753"), `SELECT 
                COALESCE((SELECT SUM(xp_earned) FROM lesson_progress WHERE learner_id = $1), 0) as total_xp,
                COALESCE((SELECT COUNT(DISTINCT lesson_id) FROM lesson_progress WHERE learner_id = $1 AND is_completed = true), 0) as lessons_completed,
                COALESCE((SELECT COUNT(DISTINCT unit_id) FROM unit_progress WHERE learner_id = $1 AND is_completed = true), 0) as units_completed,
                COALESCE((SELECT MAX(current_streak) FROM user_stats WHERE learner_id = $1), 0) as current_streak,
                COALESCE((SELECT MAX(longest_streak) FROM user_stats WHERE learner_id = $1), 0) as longest_streak,
                (SELECT MAX(last_activity_date) FROM user_stats WHERE learner_id = $1) as last_activity_date`), stryMutAct_9fa48("3754") ? [] : (stryCov_9fa48("3754"), [userId]));
      return stryMutAct_9fa48("3755") ? {} : (stryCov_9fa48("3755"), {
        user,
        summary,
        courses
      });
    }
  }
  async updateUserData(userId, updateData) {
    if (stryMutAct_9fa48("3756")) {
      {}
    } else {
      stryCov_9fa48("3756");
      const {
        name,
        email
      } = updateData;
      const {
        rows: [updatedUser]
      } = await db.query(stryMutAct_9fa48("3757") ? `` : (stryCov_9fa48("3757"), `UPDATE learners 
             SET name = COALESCE($1, name),
                 email = COALESCE($2, email),
                 updated_at = NOW()
             WHERE id = $3
             RETURNING id, name, email, created_at, updated_at`), stryMutAct_9fa48("3758") ? [] : (stryCov_9fa48("3758"), [name, email, userId]));
      return updatedUser;
    }
  }
  async deleteUser(userId) {
    if (stryMutAct_9fa48("3759")) {
      {}
    } else {
      stryCov_9fa48("3759");
      await db.query(stryMutAct_9fa48("3760") ? "" : (stryCov_9fa48("3760"), 'DELETE FROM learners WHERE id = $1'), stryMutAct_9fa48("3761") ? [] : (stryCov_9fa48("3761"), [userId]));
    }
  }
}
export default new UserManagementService();