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
    if (stryMutAct_9fa48("1454")) {
      {}
    } else {
      stryCov_9fa48("1454");
      try {
        if (stryMutAct_9fa48("1455")) {
          {}
        } else {
          stryCov_9fa48("1455");
          const {
            language,
            expected_duration
          } = req.body;
          const {
            id,
            role
          } = req.user;

          // Check if user is learner
          if (stryMutAct_9fa48("1458") ? role === 'learner' : stryMutAct_9fa48("1457") ? false : stryMutAct_9fa48("1456") ? true : (stryCov_9fa48("1456", "1457", "1458"), role !== (stryMutAct_9fa48("1459") ? "" : (stryCov_9fa48("1459"), 'learner')))) {
            if (stryMutAct_9fa48("1460")) {
              {}
            } else {
              stryCov_9fa48("1460");
              throw ERRORS.LEARNER_ONLY_ROUTE;
            }
          }

          // Validate input
          if (stryMutAct_9fa48("1463") ? !language && !expected_duration : stryMutAct_9fa48("1462") ? false : stryMutAct_9fa48("1461") ? true : (stryCov_9fa48("1461", "1462", "1463"), (stryMutAct_9fa48("1464") ? language : (stryCov_9fa48("1464"), !language)) || (stryMutAct_9fa48("1465") ? expected_duration : (stryCov_9fa48("1465"), !expected_duration)))) {
            if (stryMutAct_9fa48("1466")) {
              {}
            } else {
              stryCov_9fa48("1466");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Save preferences
          await preferencesRepository.createPreferences(id, language, expected_duration);
          res.json(createdResponse(stryMutAct_9fa48("1467") ? {} : (stryCov_9fa48("1467"), {
            language,
            expected_duration
          }), stryMutAct_9fa48("1468") ? "" : (stryCov_9fa48("1468"), 'Preferences saved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1469")) {
          {}
        } else {
          stryCov_9fa48("1469");
          console.error(stryMutAct_9fa48("1470") ? "" : (stryCov_9fa48("1470"), 'Error saving preferences:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get learner preferences
   */
  async getPreferences(req, res, next) {
    if (stryMutAct_9fa48("1471")) {
      {}
    } else {
      stryCov_9fa48("1471");
      try {
        if (stryMutAct_9fa48("1472")) {
          {}
        } else {
          stryCov_9fa48("1472");
          const {
            id,
            role
          } = req.user;

          // Check if user is learner
          if (stryMutAct_9fa48("1475") ? role === 'learner' : stryMutAct_9fa48("1474") ? false : stryMutAct_9fa48("1473") ? true : (stryCov_9fa48("1473", "1474", "1475"), role !== (stryMutAct_9fa48("1476") ? "" : (stryCov_9fa48("1476"), 'learner')))) {
            if (stryMutAct_9fa48("1477")) {
              {}
            } else {
              stryCov_9fa48("1477");
              throw ERRORS.LEARNER_ONLY_ROUTE;
            }
          }

          // Get preferences
          const preferences = await preferencesRepository.findByLearnerId(id);
          res.json(listResponse(preferences, stryMutAct_9fa48("1478") ? "" : (stryCov_9fa48("1478"), 'Preferences retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1479")) {
          {}
        } else {
          stryCov_9fa48("1479");
          console.error(stryMutAct_9fa48("1480") ? "" : (stryCov_9fa48("1480"), 'Error fetching preferences:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Update learner preferences
   */
  async updatePreferences(req, res, next) {
    if (stryMutAct_9fa48("1481")) {
      {}
    } else {
      stryCov_9fa48("1481");
      try {
        if (stryMutAct_9fa48("1482")) {
          {}
        } else {
          stryCov_9fa48("1482");
          const {
            language,
            expected_duration
          } = req.body;
          const {
            id,
            role
          } = req.user;

          // Check if user is learner
          if (stryMutAct_9fa48("1485") ? role === 'learner' : stryMutAct_9fa48("1484") ? false : stryMutAct_9fa48("1483") ? true : (stryCov_9fa48("1483", "1484", "1485"), role !== (stryMutAct_9fa48("1486") ? "" : (stryCov_9fa48("1486"), 'learner')))) {
            if (stryMutAct_9fa48("1487")) {
              {}
            } else {
              stryCov_9fa48("1487");
              throw ERRORS.LEARNER_ONLY_ROUTE;
            }
          }

          // Validate input
          if (stryMutAct_9fa48("1490") ? !language && !expected_duration : stryMutAct_9fa48("1489") ? false : stryMutAct_9fa48("1488") ? true : (stryCov_9fa48("1488", "1489", "1490"), (stryMutAct_9fa48("1491") ? language : (stryCov_9fa48("1491"), !language)) || (stryMutAct_9fa48("1492") ? expected_duration : (stryCov_9fa48("1492"), !expected_duration)))) {
            if (stryMutAct_9fa48("1493")) {
              {}
            } else {
              stryCov_9fa48("1493");
              throw ERRORS.MISSING_REQUIRED_FIELDS;
            }
          }

          // Update preferences
          await preferencesRepository.updatePreferences(id, language, expected_duration);
          res.json(updatedResponse(stryMutAct_9fa48("1494") ? {} : (stryCov_9fa48("1494"), {
            language,
            expected_duration
          }), stryMutAct_9fa48("1495") ? "" : (stryCov_9fa48("1495"), 'Preferences updated successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1496")) {
          {}
        } else {
          stryCov_9fa48("1496");
          console.error(stryMutAct_9fa48("1497") ? "" : (stryCov_9fa48("1497"), 'Error updating preferences:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Delete learner preferences
   */
  async deletePreferences(req, res, next) {
    if (stryMutAct_9fa48("1498")) {
      {}
    } else {
      stryCov_9fa48("1498");
      try {
        if (stryMutAct_9fa48("1499")) {
          {}
        } else {
          stryCov_9fa48("1499");
          const {
            id,
            role
          } = req.user;

          // Check if user is learner
          if (stryMutAct_9fa48("1502") ? role === 'learner' : stryMutAct_9fa48("1501") ? false : stryMutAct_9fa48("1500") ? true : (stryCov_9fa48("1500", "1501", "1502"), role !== (stryMutAct_9fa48("1503") ? "" : (stryCov_9fa48("1503"), 'learner')))) {
            if (stryMutAct_9fa48("1504")) {
              {}
            } else {
              stryCov_9fa48("1504");
              throw ERRORS.LEARNER_ONLY_ROUTE;
            }
          }

          // Delete preferences
          await preferencesRepository.deletePreferences(id);
          res.json(deletedResponse(stryMutAct_9fa48("1505") ? "" : (stryCov_9fa48("1505"), 'Preferences deleted successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1506")) {
          {}
        } else {
          stryCov_9fa48("1506");
          console.error(stryMutAct_9fa48("1507") ? "" : (stryCov_9fa48("1507"), 'Error deleting preferences:'), error);
          next(error);
        }
      }
    }
  }
}
export default new PreferencesController();