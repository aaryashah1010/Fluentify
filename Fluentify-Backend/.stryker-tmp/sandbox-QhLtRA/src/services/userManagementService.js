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
    if (stryMutAct_9fa48("1175")) {
      {}
    } else {
      stryCov_9fa48("1175");
      const offset = stryMutAct_9fa48("1176") ? (page - 1) / limit : (stryCov_9fa48("1176"), (stryMutAct_9fa48("1177") ? page + 1 : (stryCov_9fa48("1177"), page - 1)) * limit);
      const {
        rows: users
      } = await db.query(stryMutAct_9fa48("1178") ? `` : (stryCov_9fa48("1178"), `SELECT id, name, email, created_at, updated_at 
             FROM learners 
             ORDER BY created_at DESC 
             LIMIT $1 OFFSET $2`), stryMutAct_9fa48("1179") ? [] : (stryCov_9fa48("1179"), [limit, offset]));
      const {
        rows: [{
          count
        }]
      } = await db.query(stryMutAct_9fa48("1180") ? "" : (stryCov_9fa48("1180"), 'SELECT COUNT(*) FROM learners'));
      return stryMutAct_9fa48("1181") ? {} : (stryCov_9fa48("1181"), {
        users,
        pagination: stryMutAct_9fa48("1182") ? {} : (stryCov_9fa48("1182"), {
          total: parseInt(count),
          page,
          limit,
          totalPages: Math.ceil(stryMutAct_9fa48("1183") ? count * limit : (stryCov_9fa48("1183"), count / limit))
        })
      });
    }
  }
  async findUsers(searchTerm) {
    if (stryMutAct_9fa48("1184")) {
      {}
    } else {
      stryCov_9fa48("1184");
      const {
        rows
      } = await db.query(stryMutAct_9fa48("1185") ? `` : (stryCov_9fa48("1185"), `SELECT id, name, email, created_at 
             FROM learners 
             WHERE name ILIKE $1 OR email ILIKE $2 
             ORDER BY name`), stryMutAct_9fa48("1186") ? [] : (stryCov_9fa48("1186"), [stryMutAct_9fa48("1187") ? `` : (stryCov_9fa48("1187"), `%${searchTerm}%`), stryMutAct_9fa48("1188") ? `` : (stryCov_9fa48("1188"), `%${searchTerm}%`)]));
      return rows;
    }
  }
  async getUserWithProgress(userId) {
    if (stryMutAct_9fa48("1189")) {
      {}
    } else {
      stryCov_9fa48("1189");
      // Get user details
      const {
        rows: [user]
      } = await db.query(stryMutAct_9fa48("1190") ? `` : (stryCov_9fa48("1190"), `SELECT id, name, email, created_at, updated_at, is_email_verified 
             FROM learners 
             WHERE id = $1`), stryMutAct_9fa48("1191") ? [] : (stryCov_9fa48("1191"), [userId]));
      if (stryMutAct_9fa48("1194") ? false : stryMutAct_9fa48("1193") ? true : stryMutAct_9fa48("1192") ? user : (stryCov_9fa48("1192", "1193", "1194"), !user)) return null;

      // Get user's course progress with statistics (calculated dynamically)
      const {
        rows: courses
      } = await db.query(stryMutAct_9fa48("1195") ? `` : (stryCov_9fa48("1195"), `SELECT 
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
             ORDER BY c.updated_at DESC`), stryMutAct_9fa48("1196") ? [] : (stryCov_9fa48("1196"), [userId]));

      // Get overall summary statistics (fixed to avoid row multiplication)
      const {
        rows: [summary]
      } = await db.query(stryMutAct_9fa48("1197") ? `` : (stryCov_9fa48("1197"), `SELECT 
                COALESCE((SELECT SUM(xp_earned) FROM lesson_progress WHERE learner_id = $1), 0) as total_xp,
                COALESCE((SELECT COUNT(DISTINCT lesson_id) FROM lesson_progress WHERE learner_id = $1 AND is_completed = true), 0) as lessons_completed,
                COALESCE((SELECT COUNT(DISTINCT unit_id) FROM unit_progress WHERE learner_id = $1 AND is_completed = true), 0) as units_completed,
                COALESCE((SELECT MAX(current_streak) FROM user_stats WHERE learner_id = $1), 0) as current_streak,
                COALESCE((SELECT MAX(longest_streak) FROM user_stats WHERE learner_id = $1), 0) as longest_streak,
                (SELECT MAX(last_activity_date) FROM user_stats WHERE learner_id = $1) as last_activity_date`), stryMutAct_9fa48("1198") ? [] : (stryCov_9fa48("1198"), [userId]));
      return stryMutAct_9fa48("1199") ? {} : (stryCov_9fa48("1199"), {
        user,
        summary,
        courses
      });
    }
  }
  async updateUserData(userId, updateData) {
    if (stryMutAct_9fa48("1200")) {
      {}
    } else {
      stryCov_9fa48("1200");
      const {
        name,
        email
      } = updateData;
      const {
        rows: [updatedUser]
      } = await db.query(stryMutAct_9fa48("1201") ? `` : (stryCov_9fa48("1201"), `UPDATE learners 
             SET name = COALESCE($1, name),
                 email = COALESCE($2, email),
                 updated_at = NOW()
             WHERE id = $3
             RETURNING id, name, email, created_at, updated_at`), stryMutAct_9fa48("1202") ? [] : (stryCov_9fa48("1202"), [name, email, userId]));
      return updatedUser;
    }
  }
  async deleteUser(userId) {
    if (stryMutAct_9fa48("1203")) {
      {}
    } else {
      stryCov_9fa48("1203");
      await db.query(stryMutAct_9fa48("1204") ? "" : (stryCov_9fa48("1204"), 'DELETE FROM learners WHERE id = $1'), stryMutAct_9fa48("1205") ? [] : (stryCov_9fa48("1205"), [userId]));
    }
  }
}
export default new UserManagementService();