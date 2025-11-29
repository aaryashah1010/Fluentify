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
import contestService from '../services/contestService.js';
import { successResponse, errorResponse, createdResponse, deletedResponse } from '../utils/response.js';
class ContestController {
  /**
   * Admin: Create a new contest
   * POST /api/contests/admin
   */
  async handleAdminCreateContest(req, res, next) {
    if (stryMutAct_9fa48("724")) {
      {}
    } else {
      stryCov_9fa48("724");
      try {
        if (stryMutAct_9fa48("725")) {
          {}
        } else {
          stryCov_9fa48("725");
          const {
            title,
            description,
            start_time,
            end_time
          } = req.body;
          if (stryMutAct_9fa48("728") ? (!title || !start_time) && !end_time : stryMutAct_9fa48("727") ? false : stryMutAct_9fa48("726") ? true : (stryCov_9fa48("726", "727", "728"), (stryMutAct_9fa48("730") ? !title && !start_time : stryMutAct_9fa48("729") ? false : (stryCov_9fa48("729", "730"), (stryMutAct_9fa48("731") ? title : (stryCov_9fa48("731"), !title)) || (stryMutAct_9fa48("732") ? start_time : (stryCov_9fa48("732"), !start_time)))) || (stryMutAct_9fa48("733") ? end_time : (stryCov_9fa48("733"), !end_time)))) {
            if (stryMutAct_9fa48("734")) {
              {}
            } else {
              stryCov_9fa48("734");
              return res.status(400).json(errorResponse(stryMutAct_9fa48("735") ? "" : (stryCov_9fa48("735"), 'Title, start time, and end time are required')));
            }
          }
          const contest = await contestService.createContest(title, description, start_time, end_time);
          return res.status(201).json(createdResponse(contest, stryMutAct_9fa48("736") ? "" : (stryCov_9fa48("736"), 'Contest created successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("737")) {
          {}
        } else {
          stryCov_9fa48("737");
          next(error);
        }
      }
    }
  }

  /**
   * Admin: Add question to contest
   * POST /api/contests/admin/:contestId/questions
   */
  async handleAdminAddQuestion(req, res, next) {
    if (stryMutAct_9fa48("738")) {
      {}
    } else {
      stryCov_9fa48("738");
      try {
        if (stryMutAct_9fa48("739")) {
          {}
        } else {
          stryCov_9fa48("739");
          const {
            contestId
          } = req.params;
          const {
            question_text,
            options,
            correct_option_id
          } = req.body;
          if (stryMutAct_9fa48("742") ? (!question_text || !options) && correct_option_id === undefined : stryMutAct_9fa48("741") ? false : stryMutAct_9fa48("740") ? true : (stryCov_9fa48("740", "741", "742"), (stryMutAct_9fa48("744") ? !question_text && !options : stryMutAct_9fa48("743") ? false : (stryCov_9fa48("743", "744"), (stryMutAct_9fa48("745") ? question_text : (stryCov_9fa48("745"), !question_text)) || (stryMutAct_9fa48("746") ? options : (stryCov_9fa48("746"), !options)))) || (stryMutAct_9fa48("748") ? correct_option_id !== undefined : stryMutAct_9fa48("747") ? false : (stryCov_9fa48("747", "748"), correct_option_id === undefined)))) {
            if (stryMutAct_9fa48("749")) {
              {}
            } else {
              stryCov_9fa48("749");
              return res.status(400).json(errorResponse(stryMutAct_9fa48("750") ? "" : (stryCov_9fa48("750"), 'Question text, options, and correct option ID are required')));
            }
          }
          const question = await contestService.addQuestion(parseInt(contestId), question_text, options, correct_option_id);
          return res.status(201).json(createdResponse(question, stryMutAct_9fa48("751") ? "" : (stryCov_9fa48("751"), 'Question added successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("752")) {
          {}
        } else {
          stryCov_9fa48("752");
          next(error);
        }
      }
    }
  }

  /**
   * Admin: Update contest details
   * PUT /api/contests/admin/:contestId
   */
  async handleAdminUpdateContest(req, res, next) {
    if (stryMutAct_9fa48("753")) {
      {}
    } else {
      stryCov_9fa48("753");
      try {
        if (stryMutAct_9fa48("754")) {
          {}
        } else {
          stryCov_9fa48("754");
          const {
            contestId
          } = req.params;
          const {
            title,
            description,
            start_time,
            end_time
          } = req.body;
          const contest = await contestService.updateContest(parseInt(contestId), stryMutAct_9fa48("755") ? {} : (stryCov_9fa48("755"), {
            title,
            description,
            start_time,
            end_time
          }));
          return res.json(successResponse(contest, stryMutAct_9fa48("756") ? "" : (stryCov_9fa48("756"), 'Contest updated successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("757")) {
          {}
        } else {
          stryCov_9fa48("757");
          next(error);
        }
      }
    }
  }

  /**
   * Admin: Publish contest
   * PATCH /api/contests/admin/:contestId/publish
   */
  async handleAdminPublishContest(req, res, next) {
    if (stryMutAct_9fa48("758")) {
      {}
    } else {
      stryCov_9fa48("758");
      try {
        if (stryMutAct_9fa48("759")) {
          {}
        } else {
          stryCov_9fa48("759");
          const {
            contestId
          } = req.params;
          const contest = await contestService.publishContest(parseInt(contestId));
          return res.json(successResponse(contest, stryMutAct_9fa48("760") ? "" : (stryCov_9fa48("760"), 'Contest published successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("761")) {
          {}
        } else {
          stryCov_9fa48("761");
          next(error);
        }
      }
    }
  }

  /**
   * Admin: Get all contests
   * GET /api/contests/admin
   */
  async handleAdminGetContests(req, res, next) {
    if (stryMutAct_9fa48("762")) {
      {}
    } else {
      stryCov_9fa48("762");
      try {
        if (stryMutAct_9fa48("763")) {
          {}
        } else {
          stryCov_9fa48("763");
          const contests = await contestService.getAllContests();
          return res.json(successResponse(contests, stryMutAct_9fa48("764") ? "" : (stryCov_9fa48("764"), 'Contests retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("765")) {
          {}
        } else {
          stryCov_9fa48("765");
          next(error);
        }
      }
    }
  }

  /**
   * Admin: Get contest details
   * GET /api/contests/admin/:contestId
   */
  async handleAdminGetContestDetails(req, res, next) {
    if (stryMutAct_9fa48("766")) {
      {}
    } else {
      stryCov_9fa48("766");
      try {
        if (stryMutAct_9fa48("767")) {
          {}
        } else {
          stryCov_9fa48("767");
          const {
            contestId
          } = req.params;
          const contest = await contestService.getContestDetails(parseInt(contestId));
          return res.json(successResponse(contest, stryMutAct_9fa48("768") ? "" : (stryCov_9fa48("768"), 'Contest details retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("769")) {
          {}
        } else {
          stryCov_9fa48("769");
          next(error);
        }
      }
    }
  }

  /**
   * Admin: Delete contest
   * DELETE /api/contests/admin/:contestId
   */
  async handleAdminDeleteContest(req, res, next) {
    if (stryMutAct_9fa48("770")) {
      {}
    } else {
      stryCov_9fa48("770");
      try {
        if (stryMutAct_9fa48("771")) {
          {}
        } else {
          stryCov_9fa48("771");
          const {
            contestId
          } = req.params;
          await contestService.deleteContest(parseInt(contestId));
          return res.json(deletedResponse(stryMutAct_9fa48("772") ? "" : (stryCov_9fa48("772"), 'Contest deleted successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("773")) {
          {}
        } else {
          stryCov_9fa48("773");
          next(error);
        }
      }
    }
  }

  /**
   * Learner: Get available contests
   * GET /api/contests
   */
  async handleGetAvailableContests(req, res, next) {
    if (stryMutAct_9fa48("774")) {
      {}
    } else {
      stryCov_9fa48("774");
      try {
        if (stryMutAct_9fa48("775")) {
          {}
        } else {
          stryCov_9fa48("775");
          const learnerId = req.user.id;
          const contests = await contestService.getAvailableContests(learnerId);
          return res.json(successResponse(contests, stryMutAct_9fa48("776") ? "" : (stryCov_9fa48("776"), 'Contests retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("777")) {
          {}
        } else {
          stryCov_9fa48("777");
          next(error);
        }
      }
    }
  }

  /**
   * Learner: Get contest details for participation
   * GET /api/contests/:contestId
   */
  async handleGetContestDetails(req, res, next) {
    if (stryMutAct_9fa48("778")) {
      {}
    } else {
      stryCov_9fa48("778");
      try {
        if (stryMutAct_9fa48("779")) {
          {}
        } else {
          stryCov_9fa48("779");
          const {
            contestId
          } = req.params;
          const learnerId = req.user.id;
          const contestData = await contestService.getContestForLearner(parseInt(contestId), learnerId);
          return res.json(successResponse(contestData, stryMutAct_9fa48("780") ? "" : (stryCov_9fa48("780"), 'Contest details retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("781")) {
          {}
        } else {
          stryCov_9fa48("781");
          next(error);
        }
      }
    }
  }

  /**
   * Learner: Submit contest
   * POST /api/contests/:contestId/submit
   */
  async handleSubmitContest(req, res, next) {
    if (stryMutAct_9fa48("782")) {
      {}
    } else {
      stryCov_9fa48("782");
      try {
        if (stryMutAct_9fa48("783")) {
          {}
        } else {
          stryCov_9fa48("783");
          const {
            contestId
          } = req.params;
          const {
            submissions,
            start_time
          } = req.body;
          const learnerId = req.user.id;
          if (stryMutAct_9fa48("786") ? (!submissions || !Array.isArray(submissions)) && submissions.length === 0 : stryMutAct_9fa48("785") ? false : stryMutAct_9fa48("784") ? true : (stryCov_9fa48("784", "785", "786"), (stryMutAct_9fa48("788") ? !submissions && !Array.isArray(submissions) : stryMutAct_9fa48("787") ? false : (stryCov_9fa48("787", "788"), (stryMutAct_9fa48("789") ? submissions : (stryCov_9fa48("789"), !submissions)) || (stryMutAct_9fa48("790") ? Array.isArray(submissions) : (stryCov_9fa48("790"), !Array.isArray(submissions))))) || (stryMutAct_9fa48("792") ? submissions.length !== 0 : stryMutAct_9fa48("791") ? false : (stryCov_9fa48("791", "792"), submissions.length === 0)))) {
            if (stryMutAct_9fa48("793")) {
              {}
            } else {
              stryCov_9fa48("793");
              return res.status(400).json(errorResponse(stryMutAct_9fa48("794") ? "" : (stryCov_9fa48("794"), 'Submissions are required')));
            }
          }
          if (stryMutAct_9fa48("797") ? false : stryMutAct_9fa48("796") ? true : stryMutAct_9fa48("795") ? start_time : (stryCov_9fa48("795", "796", "797"), !start_time)) {
            if (stryMutAct_9fa48("798")) {
              {}
            } else {
              stryCov_9fa48("798");
              return res.status(400).json(errorResponse(stryMutAct_9fa48("799") ? "" : (stryCov_9fa48("799"), 'Start time is required')));
            }
          }
          const result = await contestService.submitContest(learnerId, parseInt(contestId), submissions, start_time);
          return res.json(successResponse(result, stryMutAct_9fa48("800") ? "" : (stryCov_9fa48("800"), 'Contest submitted successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("801")) {
          {}
        } else {
          stryCov_9fa48("801");
          next(error);
        }
      }
    }
  }

  /**
   * Get leaderboard for a contest
   * GET /api/contests/:contestId/leaderboard
   */
  async handleGetLeaderboard(req, res, next) {
    if (stryMutAct_9fa48("802")) {
      {}
    } else {
      stryCov_9fa48("802");
      try {
        if (stryMutAct_9fa48("803")) {
          {}
        } else {
          stryCov_9fa48("803");
          const {
            contestId
          } = req.params;
          const leaderboard = await contestService.getLeaderboard(parseInt(contestId));
          return res.json(successResponse(leaderboard, stryMutAct_9fa48("804") ? "" : (stryCov_9fa48("804"), 'Leaderboard retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("805")) {
          {}
        } else {
          stryCov_9fa48("805");
          next(error);
        }
      }
    }
  }

  /**
   * Learner: Get contest history
   * GET /api/contests/my-contests
   */
  async handleGetUserContestHistory(req, res, next) {
    if (stryMutAct_9fa48("806")) {
      {}
    } else {
      stryCov_9fa48("806");
      try {
        if (stryMutAct_9fa48("807")) {
          {}
        } else {
          stryCov_9fa48("807");
          const learnerId = req.user.id;
          const contests = await contestService.getUserContestHistory(learnerId);
          return res.json(successResponse(contests, stryMutAct_9fa48("808") ? "" : (stryCov_9fa48("808"), 'Contest history retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("809")) {
          {}
        } else {
          stryCov_9fa48("809");
          next(error);
        }
      }
    }
  }

  /**
   * Learner: Get user's contest result details
   * GET /api/contests/:contestId/my-result
   */
  async handleGetUserContestDetails(req, res, next) {
    if (stryMutAct_9fa48("810")) {
      {}
    } else {
      stryCov_9fa48("810");
      try {
        if (stryMutAct_9fa48("811")) {
          {}
        } else {
          stryCov_9fa48("811");
          const {
            contestId
          } = req.params;
          const learnerId = req.user.id;
          const details = await contestService.getUserContestDetails(learnerId, parseInt(contestId));
          return res.json(successResponse(details, stryMutAct_9fa48("812") ? "" : (stryCov_9fa48("812"), 'Contest result retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("813")) {
          {}
        } else {
          stryCov_9fa48("813");
          next(error);
        }
      }
    }
  }
}
export default new ContestController();