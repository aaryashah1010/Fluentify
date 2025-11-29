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
import analyticsService from '../services/analyticsService.js';
import { successResponse } from '../utils/response.js';
class AnalyticsController {
  /**
   * Get platform analytics
   * GET /api/admin/analytics
   */
  async getPlatformAnalytics(req, res, next) {
    if (stryMutAct_9fa48("103")) {
      {}
    } else {
      stryCov_9fa48("103");
      try {
        if (stryMutAct_9fa48("104")) {
          {}
        } else {
          stryCov_9fa48("104");
          const analytics = await analyticsService.getAnalytics();
          res.json(successResponse(analytics, stryMutAct_9fa48("105") ? "" : (stryCov_9fa48("105"), 'Platform analytics retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("106")) {
          {}
        } else {
          stryCov_9fa48("106");
          console.error(stryMutAct_9fa48("107") ? "" : (stryCov_9fa48("107"), 'Error fetching platform analytics:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get analytics for a specific time period
   * GET /api/admin/analytics/period?days=30
   */
  async getAnalyticsForPeriod(req, res, next) {
    if (stryMutAct_9fa48("108")) {
      {}
    } else {
      stryCov_9fa48("108");
      try {
        if (stryMutAct_9fa48("109")) {
          {}
        } else {
          stryCov_9fa48("109");
          const {
            days = 30
          } = req.query;
          const analytics = await analyticsService.getAnalyticsForPeriod(parseInt(days));
          res.json(successResponse(analytics, stryMutAct_9fa48("110") ? `` : (stryCov_9fa48("110"), `Analytics for ${days} days retrieved successfully`)));
        }
      } catch (error) {
        if (stryMutAct_9fa48("111")) {
          {}
        } else {
          stryCov_9fa48("111");
          console.error(stryMutAct_9fa48("112") ? "" : (stryCov_9fa48("112"), 'Error fetching period analytics:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get language distribution
   * GET /api/admin/analytics/languages
   */
  async getLanguageDistribution(req, res, next) {
    if (stryMutAct_9fa48("113")) {
      {}
    } else {
      stryCov_9fa48("113");
      try {
        if (stryMutAct_9fa48("114")) {
          {}
        } else {
          stryCov_9fa48("114");
          const languageData = await analyticsService.getAnalytics();
          res.json(successResponse(stryMutAct_9fa48("115") ? {} : (stryCov_9fa48("115"), {
            languageDistribution: languageData.languageDistribution
          }), stryMutAct_9fa48("116") ? "" : (stryCov_9fa48("116"), 'Language distribution retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("117")) {
          {}
        } else {
          stryCov_9fa48("117");
          console.error(stryMutAct_9fa48("118") ? "" : (stryCov_9fa48("118"), 'Error fetching language distribution:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get module usage statistics
   * GET /api/admin/analytics/modules
   */
  async getModuleUsage(req, res, next) {
    if (stryMutAct_9fa48("119")) {
      {}
    } else {
      stryCov_9fa48("119");
      try {
        if (stryMutAct_9fa48("120")) {
          {}
        } else {
          stryCov_9fa48("120");
          const moduleData = await analyticsService.getAnalytics();
          res.json(successResponse(stryMutAct_9fa48("121") ? {} : (stryCov_9fa48("121"), {
            moduleUsage: moduleData.moduleUsage,
            aiPerformance: moduleData.aiPerformance
          }), stryMutAct_9fa48("122") ? "" : (stryCov_9fa48("122"), 'Module usage statistics retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("123")) {
          {}
        } else {
          stryCov_9fa48("123");
          console.error(stryMutAct_9fa48("124") ? "" : (stryCov_9fa48("124"), 'Error fetching module usage:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get user engagement metrics
   * GET /api/admin/analytics/engagement
   */
  async getUserEngagement(req, res, next) {
    if (stryMutAct_9fa48("125")) {
      {}
    } else {
      stryCov_9fa48("125");
      try {
        if (stryMutAct_9fa48("126")) {
          {}
        } else {
          stryCov_9fa48("126");
          const engagementData = await analyticsService.getAnalytics();
          res.json(successResponse(stryMutAct_9fa48("127") ? {} : (stryCov_9fa48("127"), {
            userEngagement: engagementData.userEngagement,
            dailyActivity: engagementData.dailyActivity
          }), stryMutAct_9fa48("128") ? "" : (stryCov_9fa48("128"), 'User engagement metrics retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("129")) {
          {}
        } else {
          stryCov_9fa48("129");
          console.error(stryMutAct_9fa48("130") ? "" : (stryCov_9fa48("130"), 'Error fetching user engagement:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get lesson completion trends
   * GET /api/admin/analytics/trends?days=30
   */
  async getLessonCompletionTrends(req, res, next) {
    if (stryMutAct_9fa48("131")) {
      {}
    } else {
      stryCov_9fa48("131");
      try {
        if (stryMutAct_9fa48("132")) {
          {}
        } else {
          stryCov_9fa48("132");
          const {
            days = 30
          } = req.query;
          const trendsData = await analyticsService.getAnalyticsForPeriod(parseInt(days));
          res.json(successResponse(stryMutAct_9fa48("133") ? {} : (stryCov_9fa48("133"), {
            lessonCompletionTrends: trendsData.lessonCompletionTrends
          }), stryMutAct_9fa48("134") ? "" : (stryCov_9fa48("134"), 'Lesson completion trends retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("135")) {
          {}
        } else {
          stryCov_9fa48("135");
          console.error(stryMutAct_9fa48("136") ? "" : (stryCov_9fa48("136"), 'Error fetching lesson completion trends:'), error);
          next(error);
        }
      }
    }
  }
}
export default new AnalyticsController();