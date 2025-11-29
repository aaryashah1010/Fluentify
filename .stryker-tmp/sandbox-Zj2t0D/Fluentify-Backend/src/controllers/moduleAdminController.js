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
import moduleAdminService from '../services/moduleAdminService.js';
import analyticsService from '../services/analyticsService.js';
class ModuleAdminController {
  // ==================== Language Operations ====================

  /**
   * Get all unique languages
   * GET /api/admin/languages
   */
  async getLanguages(req, res, next) {
    if (stryMutAct_9fa48("1380")) {
      {}
    } else {
      stryCov_9fa48("1380");
      try {
        if (stryMutAct_9fa48("1381")) {
          {}
        } else {
          stryCov_9fa48("1381");
          const result = await moduleAdminService.getLanguages();
          res.status(200).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1382")) {
          {}
        } else {
          stryCov_9fa48("1382");
          next(error);
        }
      }
    }
  }

  /**
   * Get all courses for a specific language
   * GET /api/admin/languages/:lang/courses
   */
  async getCoursesByLanguage(req, res, next) {
    if (stryMutAct_9fa48("1383")) {
      {}
    } else {
      stryCov_9fa48("1383");
      try {
        if (stryMutAct_9fa48("1384")) {
          {}
        } else {
          stryCov_9fa48("1384");
          const {
            lang
          } = req.params;
          const result = await moduleAdminService.getCoursesByLanguage(lang);
          res.status(200).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1385")) {
          {}
        } else {
          stryCov_9fa48("1385");
          next(error);
        }
      }
    }
  }

  // ==================== Course (Module) Operations ====================

  /**
   * Create a new course
   * POST /api/admin/courses
   */
  /**
   * FIX: Create course with improved error handling
   * Analytics tracking failures won't prevent course creation or cause logout
   */
  async createCourse(req, res, next) {
    if (stryMutAct_9fa48("1386")) {
      {}
    } else {
      stryCov_9fa48("1386");
      try {
        if (stryMutAct_9fa48("1387")) {
          {}
        } else {
          stryCov_9fa48("1387");
          const adminId = req.user.id; // From auth middleware
          const result = await moduleAdminService.createCourse(adminId, req.body);

          // Track admin module usage for analytics (non-blocking, won't affect course creation)
          // FIX: Analytics errors are caught and logged but don't prevent success response
          analyticsService.trackAdminModuleUsage(adminId, req.body.language, stryMutAct_9fa48("1388") ? "" : (stryCov_9fa48("1388"), 'CREATE_COURSE'), stryMutAct_9fa48("1389") ? {} : (stryCov_9fa48("1389"), {
            courseId: stryMutAct_9fa48("1390") ? result.data.id : (stryCov_9fa48("1390"), result.data?.id),
            details: stryMutAct_9fa48("1391") ? {} : (stryCov_9fa48("1391"), {
              title: req.body.title,
              expectedDuration: req.body.expectedDuration
            })
          })).catch(analyticsError => {
            if (stryMutAct_9fa48("1392")) {
              {}
            } else {
              stryCov_9fa48("1392");
              // Log but don't throw - analytics failure shouldn't affect course creation
              console.warn(stryMutAct_9fa48("1393") ? "" : (stryCov_9fa48("1393"), 'Analytics tracking failed (non-critical):'), analyticsError.message);
            }
          });
          res.status(201).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1394")) {
          {}
        } else {
          stryCov_9fa48("1394");
          console.error(stryMutAct_9fa48("1395") ? "" : (stryCov_9fa48("1395"), 'Error creating course:'), error);
          next(error);
        }
      }
    }
  }

  /**
   * Get course details with units and lessons
   * GET /api/admin/courses/:courseId
   */
  async getCourseDetails(req, res, next) {
    if (stryMutAct_9fa48("1396")) {
      {}
    } else {
      stryCov_9fa48("1396");
      try {
        if (stryMutAct_9fa48("1397")) {
          {}
        } else {
          stryCov_9fa48("1397");
          const {
            courseId
          } = req.params;
          const result = await moduleAdminService.getCourseDetails(courseId);
          res.status(200).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1398")) {
          {}
        } else {
          stryCov_9fa48("1398");
          next(error);
        }
      }
    }
  }

  /**
   * Update a course
   * PUT /api/admin/courses/:courseId
   */
  async updateCourse(req, res, next) {
    if (stryMutAct_9fa48("1399")) {
      {}
    } else {
      stryCov_9fa48("1399");
      try {
        if (stryMutAct_9fa48("1400")) {
          {}
        } else {
          stryCov_9fa48("1400");
          const {
            courseId
          } = req.params;
          const result = await moduleAdminService.updateCourse(courseId, req.body);
          res.status(200).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1401")) {
          {}
        } else {
          stryCov_9fa48("1401");
          next(error);
        }
      }
    }
  }

  /**
   * Delete a course
   * DELETE /api/admin/courses/:courseId
   */
  async deleteCourse(req, res, next) {
    if (stryMutAct_9fa48("1402")) {
      {}
    } else {
      stryCov_9fa48("1402");
      try {
        if (stryMutAct_9fa48("1403")) {
          {}
        } else {
          stryCov_9fa48("1403");
          const {
            courseId
          } = req.params;
          const result = await moduleAdminService.deleteCourse(courseId);
          res.status(200).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1404")) {
          {}
        } else {
          stryCov_9fa48("1404");
          next(error);
        }
      }
    }
  }

  // ==================== Unit Operations ====================

  /**
   * Create a new unit
   * POST /api/admin/courses/:courseId/units
   */
  async createUnit(req, res, next) {
    if (stryMutAct_9fa48("1405")) {
      {}
    } else {
      stryCov_9fa48("1405");
      try {
        if (stryMutAct_9fa48("1406")) {
          {}
        } else {
          stryCov_9fa48("1406");
          const {
            courseId
          } = req.params;
          const adminId = req.user.id;
          const result = await moduleAdminService.createUnit(courseId, req.body);

          // Track admin module usage for analytics
          try {
            if (stryMutAct_9fa48("1407")) {
              {}
            } else {
              stryCov_9fa48("1407");
              await analyticsService.trackAdminModuleUsage(adminId, stryMutAct_9fa48("1410") ? req.body.language && 'Unknown' : stryMutAct_9fa48("1409") ? false : stryMutAct_9fa48("1408") ? true : (stryCov_9fa48("1408", "1409", "1410"), req.body.language || (stryMutAct_9fa48("1411") ? "" : (stryCov_9fa48("1411"), 'Unknown'))), stryMutAct_9fa48("1412") ? "" : (stryCov_9fa48("1412"), 'CREATE_UNIT'), stryMutAct_9fa48("1413") ? {} : (stryCov_9fa48("1413"), {
                courseId: parseInt(courseId),
                unitId: stryMutAct_9fa48("1414") ? result.data.id : (stryCov_9fa48("1414"), result.data?.id),
                details: stryMutAct_9fa48("1415") ? {} : (stryCov_9fa48("1415"), {
                  title: req.body.title,
                  difficulty: req.body.difficulty
                })
              }));
            }
          } catch (analyticsError) {
            if (stryMutAct_9fa48("1416")) {
              {}
            } else {
              stryCov_9fa48("1416");
              console.error(stryMutAct_9fa48("1417") ? "" : (stryCov_9fa48("1417"), 'Error tracking admin unit creation analytics:'), analyticsError);
            }
          }
          res.status(201).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1418")) {
          {}
        } else {
          stryCov_9fa48("1418");
          next(error);
        }
      }
    }
  }

  /**
   * Update a unit
   * PUT /api/admin/units/:unitId
   */
  async updateUnit(req, res, next) {
    if (stryMutAct_9fa48("1419")) {
      {}
    } else {
      stryCov_9fa48("1419");
      try {
        if (stryMutAct_9fa48("1420")) {
          {}
        } else {
          stryCov_9fa48("1420");
          const {
            unitId
          } = req.params;
          const result = await moduleAdminService.updateUnit(unitId, req.body);
          res.status(200).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1421")) {
          {}
        } else {
          stryCov_9fa48("1421");
          next(error);
        }
      }
    }
  }

  /**
   * Delete a unit
   * DELETE /api/admin/units/:unitId
   */
  async deleteUnit(req, res, next) {
    if (stryMutAct_9fa48("1422")) {
      {}
    } else {
      stryCov_9fa48("1422");
      try {
        if (stryMutAct_9fa48("1423")) {
          {}
        } else {
          stryCov_9fa48("1423");
          const {
            unitId
          } = req.params;
          const result = await moduleAdminService.deleteUnit(unitId);
          res.status(200).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1424")) {
          {}
        } else {
          stryCov_9fa48("1424");
          next(error);
        }
      }
    }
  }

  // ==================== Lesson Operations ====================

  /**
   * Create a new lesson
   * POST /api/admin/units/:unitId/lessons
   */
  async createLesson(req, res, next) {
    if (stryMutAct_9fa48("1425")) {
      {}
    } else {
      stryCov_9fa48("1425");
      try {
        if (stryMutAct_9fa48("1426")) {
          {}
        } else {
          stryCov_9fa48("1426");
          const {
            unitId
          } = req.params;
          const adminId = req.user.id;
          const result = await moduleAdminService.createLesson(unitId, req.body);

          // Track admin module usage for analytics
          try {
            if (stryMutAct_9fa48("1427")) {
              {}
            } else {
              stryCov_9fa48("1427");
              await analyticsService.trackAdminModuleUsage(adminId, stryMutAct_9fa48("1430") ? req.body.language && 'Unknown' : stryMutAct_9fa48("1429") ? false : stryMutAct_9fa48("1428") ? true : (stryCov_9fa48("1428", "1429", "1430"), req.body.language || (stryMutAct_9fa48("1431") ? "" : (stryCov_9fa48("1431"), 'Unknown'))), stryMutAct_9fa48("1432") ? "" : (stryCov_9fa48("1432"), 'CREATE_LESSON'), stryMutAct_9fa48("1433") ? {} : (stryCov_9fa48("1433"), {
                unitId: parseInt(unitId),
                lessonId: stryMutAct_9fa48("1434") ? result.data.id : (stryCov_9fa48("1434"), result.data?.id),
                details: stryMutAct_9fa48("1435") ? {} : (stryCov_9fa48("1435"), {
                  title: req.body.title,
                  lessonType: req.body.lessonType
                })
              }));
            }
          } catch (analyticsError) {
            if (stryMutAct_9fa48("1436")) {
              {}
            } else {
              stryCov_9fa48("1436");
              console.error(stryMutAct_9fa48("1437") ? "" : (stryCov_9fa48("1437"), 'Error tracking admin lesson creation analytics:'), analyticsError);
            }
          }
          res.status(201).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1438")) {
          {}
        } else {
          stryCov_9fa48("1438");
          next(error);
        }
      }
    }
  }

  /**
   * Update a lesson
   * PUT /api/admin/lessons/:lessonId
   */
  async updateLesson(req, res, next) {
    if (stryMutAct_9fa48("1439")) {
      {}
    } else {
      stryCov_9fa48("1439");
      try {
        if (stryMutAct_9fa48("1440")) {
          {}
        } else {
          stryCov_9fa48("1440");
          const {
            lessonId
          } = req.params;
          const result = await moduleAdminService.updateLesson(lessonId, req.body);
          res.status(200).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1441")) {
          {}
        } else {
          stryCov_9fa48("1441");
          next(error);
        }
      }
    }
  }

  /**
   * Delete a lesson
   * DELETE /api/admin/lessons/:lessonId
   */
  async deleteLesson(req, res, next) {
    if (stryMutAct_9fa48("1442")) {
      {}
    } else {
      stryCov_9fa48("1442");
      try {
        if (stryMutAct_9fa48("1443")) {
          {}
        } else {
          stryCov_9fa48("1443");
          const {
            lessonId
          } = req.params;
          const result = await moduleAdminService.deleteLesson(lessonId);
          res.status(200).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1444")) {
          {}
        } else {
          stryCov_9fa48("1444");
          next(error);
        }
      }
    }
  }

  // ==================== Published Courses (Learner View) ====================

  /**
   * Get all published languages for learners
   * GET /api/learner-modules/languages
   */
  async getPublishedLanguages(req, res, next) {
    if (stryMutAct_9fa48("1445")) {
      {}
    } else {
      stryCov_9fa48("1445");
      try {
        if (stryMutAct_9fa48("1446")) {
          {}
        } else {
          stryCov_9fa48("1446");
          const result = await moduleAdminService.getPublishedLanguages();
          res.status(200).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1447")) {
          {}
        } else {
          stryCov_9fa48("1447");
          next(error);
        }
      }
    }
  }

  /**
   * Get published courses for a specific language for learners
   * GET /api/learner-modules/languages/:lang/courses
   */
  async getPublishedCoursesByLanguage(req, res, next) {
    if (stryMutAct_9fa48("1448")) {
      {}
    } else {
      stryCov_9fa48("1448");
      try {
        if (stryMutAct_9fa48("1449")) {
          {}
        } else {
          stryCov_9fa48("1449");
          const {
            lang
          } = req.params;
          const result = await moduleAdminService.getPublishedCoursesByLanguage(lang);
          res.status(200).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1450")) {
          {}
        } else {
          stryCov_9fa48("1450");
          next(error);
        }
      }
    }
  }

  /**
   * Get published course details with units and lessons for learners
   * GET /api/learner-modules/courses/:courseId
   */
  async getPublishedCourseDetails(req, res, next) {
    if (stryMutAct_9fa48("1451")) {
      {}
    } else {
      stryCov_9fa48("1451");
      try {
        if (stryMutAct_9fa48("1452")) {
          {}
        } else {
          stryCov_9fa48("1452");
          const {
            courseId
          } = req.params;
          const result = await moduleAdminService.getPublishedCourseDetails(courseId);
          res.status(200).json(result);
        }
      } catch (error) {
        if (stryMutAct_9fa48("1453")) {
          {}
        } else {
          stryCov_9fa48("1453");
          next(error);
        }
      }
    }
  }
}
export default new ModuleAdminController();