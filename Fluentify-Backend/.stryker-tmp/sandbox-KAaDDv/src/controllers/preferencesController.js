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
import preferencesRepository from '../repositories/preferencesRepository.js';
import { createdResponse, listResponse, updatedResponse, deletedResponse } from '../utils/response.js';
import { ERRORS } from '../utils/error.js';
class PreferencesController {
  /**
   * Save learner preferences
   */
  async savePreferences(req, res, next) {
    if (stryMutAct_9fa48("1433")) {
      {}
    } else {
      stryCov_9fa48("1433");
      try {
        if (stryMutAct_9fa48("1434")) {
          {}
        } else {
          stryCov_9fa48("1434");
          const {
            language,
            expected_duration
          } = req.body;
          const {
            id,
            role
          } = req.user;

          // Check if user is learner
          if (stryMutAct_9fa48("1437") ? role === 'learner' : stryMutAct_9fa48("1436") ? false : stryMutAct_9fa48("1435") ? true : (stryCov_9fa48("1435", "1436", "1437"), role !== (stryMutAct_9fa48("1438") ? "" : (stryCov_9fa48("1438"), 'learner')))) {
            if (stryMutAct_9fa48("1439")) {
              {}
            } else {
              stryCov_9fa48("1439");
              throw ERRORS.LEARNER_ONLY_ROUTE;
            }
          }

          // Validate input
          if (stryMutAct_9fa48("1442") ? !language && !expected_duration : stryMutAct_9fa48("1441") ? false : stryMutAct_9fa48("1440") ? true : (stryCov_9fa48("1440", "1441", "1442"), (stryMutAct_9fa48("1443") ? language : (stryCov_9fa48("1443"), !language)) || (stryMutAct_9fa48("1444") ? expected_duration : (stryCov_9fa48("1444"), !expected_duration)))) {
            if (stryMutAct_9fa48("1445")) {
              {}
            } else {
              stryCov_9fa48("1445");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Save preferences
          await preferencesRepository.createPreferences(id, language, expected_duration);
          res.json(createdResponse(stryMutAct_9fa48("1446") ? {} : (stryCov_9fa48("1446"), {
            language,
            expected_duration
          }), stryMutAct_9fa48("1447") ? "" : (stryCov_9fa48("1447"), 'Preferences saved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1448")) {
          {}
        } else {
          stryCov_9fa48("1448");
          console.error(stryMutAct_9fa48("1449") ? "" : (stryCov_9fa48("1449"), 'Error saving preferences:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get learner preferences
   */
  async getPreferences(req, res, next) {
    if (stryMutAct_9fa48("1450")) {
      {}
    } else {
      stryCov_9fa48("1450");
      try {
        if (stryMutAct_9fa48("1451")) {
          {}
        } else {
          stryCov_9fa48("1451");
          const {
            id,
            role
          } = req.user;

          // Check if user is learner
          if (stryMutAct_9fa48("1454") ? role === 'learner' : stryMutAct_9fa48("1453") ? false : stryMutAct_9fa48("1452") ? true : (stryCov_9fa48("1452", "1453", "1454"), role !== (stryMutAct_9fa48("1455") ? "" : (stryCov_9fa48("1455"), 'learner')))) {
            if (stryMutAct_9fa48("1456")) {
              {}
            } else {
              stryCov_9fa48("1456");
              throw ERRORS.LEARNER_ONLY_ROUTE;
            }
          }

          // Get preferences
          const preferences = await preferencesRepository.findByLearnerId(id);
          res.json(listResponse(preferences, stryMutAct_9fa48("1457") ? "" : (stryCov_9fa48("1457"), 'Preferences retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1458")) {
          {}
        } else {
          stryCov_9fa48("1458");
          console.error(stryMutAct_9fa48("1459") ? "" : (stryCov_9fa48("1459"), 'Error fetching preferences:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Update learner preferences
   */
  async updatePreferences(req, res, next) {
    if (stryMutAct_9fa48("1460")) {
      {}
    } else {
      stryCov_9fa48("1460");
      try {
        if (stryMutAct_9fa48("1461")) {
          {}
        } else {
          stryCov_9fa48("1461");
          const {
            language,
            expected_duration
          } = req.body;
          const {
            id,
            role
          } = req.user;

          // Check if user is learner
          if (stryMutAct_9fa48("1464") ? role === 'learner' : stryMutAct_9fa48("1463") ? false : stryMutAct_9fa48("1462") ? true : (stryCov_9fa48("1462", "1463", "1464"), role !== (stryMutAct_9fa48("1465") ? "" : (stryCov_9fa48("1465"), 'learner')))) {
            if (stryMutAct_9fa48("1466")) {
              {}
            } else {
              stryCov_9fa48("1466");
              throw ERRORS.LEARNER_ONLY_ROUTE;
            }
          }

          // Validate input
          if (stryMutAct_9fa48("1469") ? !language && !expected_duration : stryMutAct_9fa48("1468") ? false : stryMutAct_9fa48("1467") ? true : (stryCov_9fa48("1467", "1468", "1469"), (stryMutAct_9fa48("1470") ? language : (stryCov_9fa48("1470"), !language)) || (stryMutAct_9fa48("1471") ? expected_duration : (stryCov_9fa48("1471"), !expected_duration)))) {
            if (stryMutAct_9fa48("1472")) {
              {}
            } else {
              stryCov_9fa48("1472");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Update preferences
          await preferencesRepository.updatePreferences(id, language, expected_duration);
          res.json(updatedResponse(stryMutAct_9fa48("1473") ? {} : (stryCov_9fa48("1473"), {
            language,
            expected_duration
          }), stryMutAct_9fa48("1474") ? "" : (stryCov_9fa48("1474"), 'Preferences updated successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1475")) {
          {}
        } else {
          stryCov_9fa48("1475");
          console.error(stryMutAct_9fa48("1476") ? "" : (stryCov_9fa48("1476"), 'Error updating preferences:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Delete learner preferences
   */
  async deletePreferences(req, res, next) {
    if (stryMutAct_9fa48("1477")) {
      {}
    } else {
      stryCov_9fa48("1477");
      try {
        if (stryMutAct_9fa48("1478")) {
          {}
        } else {
          stryCov_9fa48("1478");
          const {
            id,
            role
          } = req.user;

          // Check if user is learner
          if (stryMutAct_9fa48("1481") ? role === 'learner' : stryMutAct_9fa48("1480") ? false : stryMutAct_9fa48("1479") ? true : (stryCov_9fa48("1479", "1480", "1481"), role !== (stryMutAct_9fa48("1482") ? "" : (stryCov_9fa48("1482"), 'learner')))) {
            if (stryMutAct_9fa48("1483")) {
              {}
            } else {
              stryCov_9fa48("1483");
              throw ERRORS.LEARNER_ONLY_ROUTE;
            }
          }

          // Delete preferences
          await preferencesRepository.deletePreferences(id);
          res.json(deletedResponse(stryMutAct_9fa48("1484") ? "" : (stryCov_9fa48("1484"), 'Preferences deleted successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1485")) {
          {}
        } else {
          stryCov_9fa48("1485");
          console.error(stryMutAct_9fa48("1486") ? "" : (stryCov_9fa48("1486"), 'Error deleting preferences:'), error);
          next(error);
        }
      }
    }
  }
}
export default new PreferencesController();