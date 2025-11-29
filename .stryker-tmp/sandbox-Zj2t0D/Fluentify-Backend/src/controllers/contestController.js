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
    if (stryMutAct_9fa48("764")) {
      {}
    } else {
      stryCov_9fa48("764");
      try {
        if (stryMutAct_9fa48("765")) {
          {}
        } else {
          stryCov_9fa48("765");
          const {
            title,
            description,
            start_time,
            end_time
          } = req.body;
          if (stryMutAct_9fa48("768") ? (!title || !start_time) && !end_time : stryMutAct_9fa48("767") ? false : stryMutAct_9fa48("766") ? true : (stryCov_9fa48("766", "767", "768"), (stryMutAct_9fa48("770") ? !title && !start_time : stryMutAct_9fa48("769") ? false : (stryCov_9fa48("769", "770"), (stryMutAct_9fa48("771") ? title : (stryCov_9fa48("771"), !title)) || (stryMutAct_9fa48("772") ? start_time : (stryCov_9fa48("772"), !start_time)))) || (stryMutAct_9fa48("773") ? end_time : (stryCov_9fa48("773"), !end_time)))) {
            if (stryMutAct_9fa48("774")) {
              {}
            } else {
              stryCov_9fa48("774");
              return res.status(400).json(errorResponse(stryMutAct_9fa48("775") ? "" : (stryCov_9fa48("775"), 'Title, start time, and end time are required')));
            }
          }
          const contest = await contestService.createContest(title, description, start_time, end_time);
          return res.status(201).json(createdResponse(contest, stryMutAct_9fa48("776") ? "" : (stryCov_9fa48("776"), 'Contest created successfully')));
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
   * Admin: Add question to contest
   * POST /api/contests/admin/:contestId/questions
   */
  async handleAdminAddQuestion(req, res, next) {
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
          const {
            question_text,
            options,
            correct_option_id
          } = req.body;
          if (stryMutAct_9fa48("782") ? (!question_text || !options) && correct_option_id === undefined : stryMutAct_9fa48("781") ? false : stryMutAct_9fa48("780") ? true : (stryCov_9fa48("780", "781", "782"), (stryMutAct_9fa48("784") ? !question_text && !options : stryMutAct_9fa48("783") ? false : (stryCov_9fa48("783", "784"), (stryMutAct_9fa48("785") ? question_text : (stryCov_9fa48("785"), !question_text)) || (stryMutAct_9fa48("786") ? options : (stryCov_9fa48("786"), !options)))) || (stryMutAct_9fa48("788") ? correct_option_id !== undefined : stryMutAct_9fa48("787") ? false : (stryCov_9fa48("787", "788"), correct_option_id === undefined)))) {
            if (stryMutAct_9fa48("789")) {
              {}
            } else {
              stryCov_9fa48("789");
              return res.status(400).json(errorResponse(stryMutAct_9fa48("790") ? "" : (stryCov_9fa48("790"), 'Question text, options, and correct option ID are required')));
            }
          }
          const question = await contestService.addQuestion(parseInt(contestId), question_text, options, correct_option_id);
          return res.status(201).json(createdResponse(question, stryMutAct_9fa48("791") ? "" : (stryCov_9fa48("791"), 'Question added successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("792")) {
          {}
        } else {
          stryCov_9fa48("792");
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
    if (stryMutAct_9fa48("793")) {
      {}
    } else {
      stryCov_9fa48("793");
      try {
        if (stryMutAct_9fa48("794")) {
          {}
        } else {
          stryCov_9fa48("794");
          const {
            contestId
          } = req.params;
          const {
            title,
            description,
            start_time,
            end_time
          } = req.body;
          const contest = await contestService.updateContest(parseInt(contestId), stryMutAct_9fa48("795") ? {} : (stryCov_9fa48("795"), {
            title,
            description,
            start_time,
            end_time
          }));
          return res.json(successResponse(contest, stryMutAct_9fa48("796") ? "" : (stryCov_9fa48("796"), 'Contest updated successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("797")) {
          {}
        } else {
          stryCov_9fa48("797");
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
    if (stryMutAct_9fa48("798")) {
      {}
    } else {
      stryCov_9fa48("798");
      try {
        if (stryMutAct_9fa48("799")) {
          {}
        } else {
          stryCov_9fa48("799");
          const {
            contestId
          } = req.params;
          const contest = await contestService.publishContest(parseInt(contestId));
          return res.json(successResponse(contest, stryMutAct_9fa48("800") ? "" : (stryCov_9fa48("800"), 'Contest published successfully')));
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
   * Admin: Get all contests
   * GET /api/contests/admin
   */
  async handleAdminGetContests(req, res, next) {
    if (stryMutAct_9fa48("802")) {
      {}
    } else {
      stryCov_9fa48("802");
      try {
        if (stryMutAct_9fa48("803")) {
          {}
        } else {
          stryCov_9fa48("803");
          const contests = await contestService.getAllContests();
          return res.json(successResponse(contests, stryMutAct_9fa48("804") ? "" : (stryCov_9fa48("804"), 'Contests retrieved successfully')));
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
   * Admin: Get contest details
   * GET /api/contests/admin/:contestId
   */
  async handleAdminGetContestDetails(req, res, next) {
    if (stryMutAct_9fa48("806")) {
      {}
    } else {
      stryCov_9fa48("806");
      try {
        if (stryMutAct_9fa48("807")) {
          {}
        } else {
          stryCov_9fa48("807");
          const {
            contestId
          } = req.params;
          const contest = await contestService.getContestDetails(parseInt(contestId));
          return res.json(successResponse(contest, stryMutAct_9fa48("808") ? "" : (stryCov_9fa48("808"), 'Contest details retrieved successfully')));
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
   * Admin: Delete contest
   * DELETE /api/contests/admin/:contestId
   */
  async handleAdminDeleteContest(req, res, next) {
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
          await contestService.deleteContest(parseInt(contestId));
          return res.json(deletedResponse(stryMutAct_9fa48("812") ? "" : (stryCov_9fa48("812"), 'Contest deleted successfully')));
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

  /**
   * Learner: Get available contests
   * GET /api/contests
   */
  async handleGetAvailableContests(req, res, next) {
    if (stryMutAct_9fa48("814")) {
      {}
    } else {
      stryCov_9fa48("814");
      try {
        if (stryMutAct_9fa48("815")) {
          {}
        } else {
          stryCov_9fa48("815");
          const learnerId = req.user.id;
          const contests = await contestService.getAvailableContests(learnerId);
          return res.json(successResponse(contests, stryMutAct_9fa48("816") ? "" : (stryCov_9fa48("816"), 'Contests retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("817")) {
          {}
        } else {
          stryCov_9fa48("817");
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
    if (stryMutAct_9fa48("818")) {
      {}
    } else {
      stryCov_9fa48("818");
      try {
        if (stryMutAct_9fa48("819")) {
          {}
        } else {
          stryCov_9fa48("819");
          const {
            contestId
          } = req.params;
          const learnerId = req.user.id;
          const contestData = await contestService.getContestForLearner(parseInt(contestId), learnerId);
          return res.json(successResponse(contestData, stryMutAct_9fa48("820") ? "" : (stryCov_9fa48("820"), 'Contest details retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("821")) {
          {}
        } else {
          stryCov_9fa48("821");
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
    if (stryMutAct_9fa48("822")) {
      {}
    } else {
      stryCov_9fa48("822");
      try {
        if (stryMutAct_9fa48("823")) {
          {}
        } else {
          stryCov_9fa48("823");
          const {
            contestId
          } = req.params;
          const {
            submissions,
            start_time
          } = req.body;
          const learnerId = req.user.id;
          if (stryMutAct_9fa48("826") ? (!submissions || !Array.isArray(submissions)) && submissions.length === 0 : stryMutAct_9fa48("825") ? false : stryMutAct_9fa48("824") ? true : (stryCov_9fa48("824", "825", "826"), (stryMutAct_9fa48("828") ? !submissions && !Array.isArray(submissions) : stryMutAct_9fa48("827") ? false : (stryCov_9fa48("827", "828"), (stryMutAct_9fa48("829") ? submissions : (stryCov_9fa48("829"), !submissions)) || (stryMutAct_9fa48("830") ? Array.isArray(submissions) : (stryCov_9fa48("830"), !Array.isArray(submissions))))) || (stryMutAct_9fa48("832") ? submissions.length !== 0 : stryMutAct_9fa48("831") ? false : (stryCov_9fa48("831", "832"), submissions.length === 0)))) {
            if (stryMutAct_9fa48("833")) {
              {}
            } else {
              stryCov_9fa48("833");
              return res.status(400).json(errorResponse(stryMutAct_9fa48("834") ? "" : (stryCov_9fa48("834"), 'Submissions are required')));
            }
          }
          if (stryMutAct_9fa48("837") ? false : stryMutAct_9fa48("836") ? true : stryMutAct_9fa48("835") ? start_time : (stryCov_9fa48("835", "836", "837"), !start_time)) {
            if (stryMutAct_9fa48("838")) {
              {}
            } else {
              stryCov_9fa48("838");
              return res.status(400).json(errorResponse(stryMutAct_9fa48("839") ? "" : (stryCov_9fa48("839"), 'Start time is required')));
            }
          }
          const result = await contestService.submitContest(learnerId, parseInt(contestId), submissions, start_time);
          return res.json(successResponse(result, stryMutAct_9fa48("840") ? "" : (stryCov_9fa48("840"), 'Contest submitted successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("841")) {
          {}
        } else {
          stryCov_9fa48("841");
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
    if (stryMutAct_9fa48("842")) {
      {}
    } else {
      stryCov_9fa48("842");
      try {
        if (stryMutAct_9fa48("843")) {
          {}
        } else {
          stryCov_9fa48("843");
          const {
            contestId
          } = req.params;
          const leaderboard = await contestService.getLeaderboard(parseInt(contestId));
          return res.json(successResponse(leaderboard, stryMutAct_9fa48("844") ? "" : (stryCov_9fa48("844"), 'Leaderboard retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("845")) {
          {}
        } else {
          stryCov_9fa48("845");
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
    if (stryMutAct_9fa48("846")) {
      {}
    } else {
      stryCov_9fa48("846");
      try {
        if (stryMutAct_9fa48("847")) {
          {}
        } else {
          stryCov_9fa48("847");
          const learnerId = req.user.id;
          const contests = await contestService.getUserContestHistory(learnerId);
          return res.json(successResponse(contests, stryMutAct_9fa48("848") ? "" : (stryCov_9fa48("848"), 'Contest history retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("849")) {
          {}
        } else {
          stryCov_9fa48("849");
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
    if (stryMutAct_9fa48("850")) {
      {}
    } else {
      stryCov_9fa48("850");
      try {
        if (stryMutAct_9fa48("851")) {
          {}
        } else {
          stryCov_9fa48("851");
          const {
            contestId
          } = req.params;
          const learnerId = req.user.id;
          const details = await contestService.getUserContestDetails(learnerId, parseInt(contestId));
          return res.json(successResponse(details, stryMutAct_9fa48("852") ? "" : (stryCov_9fa48("852"), 'Contest result retrieved successfully')));
        }
      } catch (error) {
        if (stryMutAct_9fa48("853")) {
          {}
        } else {
          stryCov_9fa48("853");
          next(error);
        }
      }
    }
  }
}
export default new ContestController();