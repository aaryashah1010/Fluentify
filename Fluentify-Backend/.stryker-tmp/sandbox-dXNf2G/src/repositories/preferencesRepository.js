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
class PreferencesRepository {
  /**
   * Find learner preferences by learner ID
   */
  async findByLearnerId(learnerId) {
    if (stryMutAct_9fa48("2630")) {
      {}
    } else {
      stryCov_9fa48("2630");
      const result = await db.query(stryMutAct_9fa48("2631") ? "" : (stryCov_9fa48("2631"), 'SELECT * FROM learner_preferences WHERE learner_id = $1'), stryMutAct_9fa48("2632") ? [] : (stryCov_9fa48("2632"), [learnerId]));
      return result.rows;
    }
  }

  /**
   * Create learner preferences
   */
  async createPreferences(learnerId, language, expectedDuration) {
    if (stryMutAct_9fa48("2633")) {
      {}
    } else {
      stryCov_9fa48("2633");
      await db.query(stryMutAct_9fa48("2634") ? "" : (stryCov_9fa48("2634"), 'INSERT INTO learner_preferences (learner_id, language, expected_duration) VALUES ($1, $2, $3)'), stryMutAct_9fa48("2635") ? [] : (stryCov_9fa48("2635"), [learnerId, language, expectedDuration]));
    }
  }

  /**
   * Update learner preferences
   */
  async updatePreferences(learnerId, language, expectedDuration) {
    if (stryMutAct_9fa48("2636")) {
      {}
    } else {
      stryCov_9fa48("2636");
      await db.query(stryMutAct_9fa48("2637") ? "" : (stryCov_9fa48("2637"), 'UPDATE learner_preferences SET language = $2, expected_duration = $3, updated_at = NOW() WHERE learner_id = $1'), stryMutAct_9fa48("2638") ? [] : (stryCov_9fa48("2638"), [learnerId, language, expectedDuration]));
    }
  }

  /**
   * Delete learner preferences
   */
  async deletePreferences(learnerId) {
    if (stryMutAct_9fa48("2639")) {
      {}
    } else {
      stryCov_9fa48("2639");
      await db.query(stryMutAct_9fa48("2640") ? "" : (stryCov_9fa48("2640"), 'DELETE FROM learner_preferences WHERE learner_id = $1'), stryMutAct_9fa48("2641") ? [] : (stryCov_9fa48("2641"), [learnerId]));
    }
  }

  /**
   * Check if preferences exist for learner
   */
  async preferencesExist(learnerId) {
    if (stryMutAct_9fa48("2642")) {
      {}
    } else {
      stryCov_9fa48("2642");
      const result = await db.query(stryMutAct_9fa48("2643") ? "" : (stryCov_9fa48("2643"), 'SELECT EXISTS(SELECT 1 FROM learner_preferences WHERE learner_id = $1) as exists'), stryMutAct_9fa48("2644") ? [] : (stryCov_9fa48("2644"), [learnerId]));
      return result.rows[0].exists;
    }
  }
}
export default new PreferencesRepository();