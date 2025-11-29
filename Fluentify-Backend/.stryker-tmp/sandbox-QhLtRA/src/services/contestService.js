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
import contestRepository from '../repositories/contestRepository.js';
import { ERRORS } from '../utils/error.js';
class ContestService {
  /**
   * Admin: Create a new contest
   */
  async createContest(title, description, startTime, endTime) {
    if (stryMutAct_9fa48("307")) {
      {}
    } else {
      stryCov_9fa48("307");
      // Validate times
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (stryMutAct_9fa48("311") ? start < end : stryMutAct_9fa48("310") ? start > end : stryMutAct_9fa48("309") ? false : stryMutAct_9fa48("308") ? true : (stryCov_9fa48("308", "309", "310", "311"), start >= end)) {
        if (stryMutAct_9fa48("312")) {
          {}
        } else {
          stryCov_9fa48("312");
          throw new Error(stryMutAct_9fa48("313") ? "" : (stryCov_9fa48("313"), 'End time must be after start time'));
        }
      }
      if (stryMutAct_9fa48("317") ? start >= new Date() : stryMutAct_9fa48("316") ? start <= new Date() : stryMutAct_9fa48("315") ? false : stryMutAct_9fa48("314") ? true : (stryCov_9fa48("314", "315", "316", "317"), start < new Date())) {
        if (stryMutAct_9fa48("318")) {
          {}
        } else {
          stryCov_9fa48("318");
          throw new Error(stryMutAct_9fa48("319") ? "" : (stryCov_9fa48("319"), 'Start time cannot be in the past'));
        }
      }
      return await contestRepository.adminCreateContest(title, description, startTime, endTime);
    }
  }

  /**
   * Admin: Add question to contest
   */
  async addQuestion(contestId, questionText, options, correctOptionId) {
    if (stryMutAct_9fa48("320")) {
      {}
    } else {
      stryCov_9fa48("320");
      // Validate contest exists
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("323") ? false : stryMutAct_9fa48("322") ? true : stryMutAct_9fa48("321") ? contest : (stryCov_9fa48("321", "322", "323"), !contest)) {
        if (stryMutAct_9fa48("324")) {
          {}
        } else {
          stryCov_9fa48("324");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Validate contest is in DRAFT status
      if (stryMutAct_9fa48("327") ? contest.status === 'DRAFT' : stryMutAct_9fa48("326") ? false : stryMutAct_9fa48("325") ? true : (stryCov_9fa48("325", "326", "327"), contest.status !== (stryMutAct_9fa48("328") ? "" : (stryCov_9fa48("328"), 'DRAFT')))) {
        if (stryMutAct_9fa48("329")) {
          {}
        } else {
          stryCov_9fa48("329");
          throw ERRORS.INVALID_INPUT;
        }
      }

      // Validate options
      if (stryMutAct_9fa48("332") ? !Array.isArray(options) && options.length < 2 : stryMutAct_9fa48("331") ? false : stryMutAct_9fa48("330") ? true : (stryCov_9fa48("330", "331", "332"), (stryMutAct_9fa48("333") ? Array.isArray(options) : (stryCov_9fa48("333"), !Array.isArray(options))) || (stryMutAct_9fa48("336") ? options.length >= 2 : stryMutAct_9fa48("335") ? options.length <= 2 : stryMutAct_9fa48("334") ? false : (stryCov_9fa48("334", "335", "336"), options.length < 2)))) {
        if (stryMutAct_9fa48("337")) {
          {}
        } else {
          stryCov_9fa48("337");
          throw ERRORS.INVALID_INPUT;
        }
      }

      // Validate correct option ID exists in options
      const optionIds = options.map(stryMutAct_9fa48("338") ? () => undefined : (stryCov_9fa48("338"), opt => opt.id));
      if (stryMutAct_9fa48("341") ? false : stryMutAct_9fa48("340") ? true : stryMutAct_9fa48("339") ? optionIds.includes(correctOptionId) : (stryCov_9fa48("339", "340", "341"), !optionIds.includes(correctOptionId))) {
        if (stryMutAct_9fa48("342")) {
          {}
        } else {
          stryCov_9fa48("342");
          throw ERRORS.INVALID_INPUT;
        }
      }
      return await contestRepository.adminAddQuestion(contestId, questionText, options, correctOptionId);
    }
  }

  /**
   * Admin: Update contest details
   */
  async updateContest(contestId, updates) {
    if (stryMutAct_9fa48("343")) {
      {}
    } else {
      stryCov_9fa48("343");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("346") ? false : stryMutAct_9fa48("345") ? true : stryMutAct_9fa48("344") ? contest : (stryCov_9fa48("344", "345", "346"), !contest)) {
        if (stryMutAct_9fa48("347")) {
          {}
        } else {
          stryCov_9fa48("347");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Validate times if provided
      if (stryMutAct_9fa48("350") ? updates.start_time || updates.end_time : stryMutAct_9fa48("349") ? false : stryMutAct_9fa48("348") ? true : (stryCov_9fa48("348", "349", "350"), updates.start_time && updates.end_time)) {
        if (stryMutAct_9fa48("351")) {
          {}
        } else {
          stryCov_9fa48("351");
          const start = new Date(updates.start_time);
          const end = new Date(updates.end_time);
          if (stryMutAct_9fa48("355") ? start < end : stryMutAct_9fa48("354") ? start > end : stryMutAct_9fa48("353") ? false : stryMutAct_9fa48("352") ? true : (stryCov_9fa48("352", "353", "354", "355"), start >= end)) {
            if (stryMutAct_9fa48("356")) {
              {}
            } else {
              stryCov_9fa48("356");
              throw new Error(stryMutAct_9fa48("357") ? "" : (stryCov_9fa48("357"), 'End time must be after start time'));
            }
          }
        }
      }
      return await contestRepository.adminUpdateContest(contestId, updates);
    }
  }

  /**
   * Admin: Publish contest
   */
  async publishContest(contestId) {
    if (stryMutAct_9fa48("358")) {
      {}
    } else {
      stryCov_9fa48("358");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("361") ? false : stryMutAct_9fa48("360") ? true : stryMutAct_9fa48("359") ? contest : (stryCov_9fa48("359", "360", "361"), !contest)) {
        if (stryMutAct_9fa48("362")) {
          {}
        } else {
          stryCov_9fa48("362");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      if (stryMutAct_9fa48("365") ? contest.status === 'DRAFT' : stryMutAct_9fa48("364") ? false : stryMutAct_9fa48("363") ? true : (stryCov_9fa48("363", "364", "365"), contest.status !== (stryMutAct_9fa48("366") ? "" : (stryCov_9fa48("366"), 'DRAFT')))) {
        if (stryMutAct_9fa48("367")) {
          {}
        } else {
          stryCov_9fa48("367");
          throw ERRORS.INVALID_INPUT;
        }
      }

      // Check if contest has questions
      const questions = await contestRepository.learnerGetContestQuestions(contestId);
      if (stryMutAct_9fa48("370") ? questions.length !== 0 : stryMutAct_9fa48("369") ? false : stryMutAct_9fa48("368") ? true : (stryCov_9fa48("368", "369", "370"), questions.length === 0)) {
        if (stryMutAct_9fa48("371")) {
          {}
        } else {
          stryCov_9fa48("371");
          throw ERRORS.INVALID_INPUT;
        }
      }
      return await contestRepository.adminPublishContest(contestId);
    }
  }

  /**
   * Admin: Get all contests
   */
  async getAllContests() {
    if (stryMutAct_9fa48("372")) {
      {}
    } else {
      stryCov_9fa48("372");
      return await contestRepository.adminGetAllContests();
    }
  }

  /**
   * Admin: Get contest details with questions
   */
  async getContestDetails(contestId) {
    if (stryMutAct_9fa48("373")) {
      {}
    } else {
      stryCov_9fa48("373");
      const contest = await contestRepository.adminGetContestById(contestId);
      if (stryMutAct_9fa48("376") ? false : stryMutAct_9fa48("375") ? true : stryMutAct_9fa48("374") ? contest : (stryCov_9fa48("374", "375", "376"), !contest)) {
        if (stryMutAct_9fa48("377")) {
          {}
        } else {
          stryCov_9fa48("377");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      return contest;
    }
  }

  /**
   * Admin: Delete contest
   */
  async deleteContest(contestId) {
    if (stryMutAct_9fa48("378")) {
      {}
    } else {
      stryCov_9fa48("378");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("381") ? false : stryMutAct_9fa48("380") ? true : stryMutAct_9fa48("379") ? contest : (stryCov_9fa48("379", "380", "381"), !contest)) {
        if (stryMutAct_9fa48("382")) {
          {}
        } else {
          stryCov_9fa48("382");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      return await contestRepository.adminDeleteContest(contestId);
    }
  }

  /**
   * Learner: Get available contests
   */
  async getAvailableContests(learnerId) {
    if (stryMutAct_9fa48("383")) {
      {}
    } else {
      stryCov_9fa48("383");
      const contests = await contestRepository.learnerGetAvailableContests(learnerId);

      // Update contest status based on current time
      const now = new Date();
      for (const contest of contests) {
        if (stryMutAct_9fa48("384")) {
          {}
        } else {
          stryCov_9fa48("384");
          const startTime = new Date(contest.start_time);
          const endTime = new Date(contest.end_time);
          if (stryMutAct_9fa48("387") ? contest.status === 'PUBLISHED' && now >= startTime || now < endTime : stryMutAct_9fa48("386") ? false : stryMutAct_9fa48("385") ? true : (stryCov_9fa48("385", "386", "387"), (stryMutAct_9fa48("389") ? contest.status === 'PUBLISHED' || now >= startTime : stryMutAct_9fa48("388") ? true : (stryCov_9fa48("388", "389"), (stryMutAct_9fa48("391") ? contest.status !== 'PUBLISHED' : stryMutAct_9fa48("390") ? true : (stryCov_9fa48("390", "391"), contest.status === (stryMutAct_9fa48("392") ? "" : (stryCov_9fa48("392"), 'PUBLISHED')))) && (stryMutAct_9fa48("395") ? now < startTime : stryMutAct_9fa48("394") ? now > startTime : stryMutAct_9fa48("393") ? true : (stryCov_9fa48("393", "394", "395"), now >= startTime)))) && (stryMutAct_9fa48("398") ? now >= endTime : stryMutAct_9fa48("397") ? now <= endTime : stryMutAct_9fa48("396") ? true : (stryCov_9fa48("396", "397", "398"), now < endTime)))) {
            if (stryMutAct_9fa48("399")) {
              {}
            } else {
              stryCov_9fa48("399");
              await contestRepository.updateContestStatus(contest.id, stryMutAct_9fa48("400") ? "" : (stryCov_9fa48("400"), 'ACTIVE'));
              contest.status = stryMutAct_9fa48("401") ? "" : (stryCov_9fa48("401"), 'ACTIVE');
            }
          } else if (stryMutAct_9fa48("404") ? contest.status === 'ACTIVE' || now >= endTime : stryMutAct_9fa48("403") ? false : stryMutAct_9fa48("402") ? true : (stryCov_9fa48("402", "403", "404"), (stryMutAct_9fa48("406") ? contest.status !== 'ACTIVE' : stryMutAct_9fa48("405") ? true : (stryCov_9fa48("405", "406"), contest.status === (stryMutAct_9fa48("407") ? "" : (stryCov_9fa48("407"), 'ACTIVE')))) && (stryMutAct_9fa48("410") ? now < endTime : stryMutAct_9fa48("409") ? now > endTime : stryMutAct_9fa48("408") ? true : (stryCov_9fa48("408", "409", "410"), now >= endTime)))) {
            if (stryMutAct_9fa48("411")) {
              {}
            } else {
              stryCov_9fa48("411");
              await contestRepository.updateContestStatus(contest.id, stryMutAct_9fa48("412") ? "" : (stryCov_9fa48("412"), 'ENDED'));
              contest.status = stryMutAct_9fa48("413") ? "" : (stryCov_9fa48("413"), 'ENDED');
            }
          }
        }
      }
      return contests;
    }
  }

  /**
   * Learner: Get contest for participation
   */
  async getContestForLearner(contestId, learnerId) {
    if (stryMutAct_9fa48("414")) {
      {}
    } else {
      stryCov_9fa48("414");
      let contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("417") ? false : stryMutAct_9fa48("416") ? true : stryMutAct_9fa48("415") ? contest : (stryCov_9fa48("415", "416", "417"), !contest)) {
        if (stryMutAct_9fa48("418")) {
          {}
        } else {
          stryCov_9fa48("418");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Check if contest is accessible
      const now = new Date();
      const startTime = new Date(contest.start_time);
      const endTime = new Date(contest.end_time);

      // Update status if needed (and refetch so we rely on repository state)
      if (stryMutAct_9fa48("421") ? contest.status === 'PUBLISHED' && now >= startTime || now < endTime : stryMutAct_9fa48("420") ? false : stryMutAct_9fa48("419") ? true : (stryCov_9fa48("419", "420", "421"), (stryMutAct_9fa48("423") ? contest.status === 'PUBLISHED' || now >= startTime : stryMutAct_9fa48("422") ? true : (stryCov_9fa48("422", "423"), (stryMutAct_9fa48("425") ? contest.status !== 'PUBLISHED' : stryMutAct_9fa48("424") ? true : (stryCov_9fa48("424", "425"), contest.status === (stryMutAct_9fa48("426") ? "" : (stryCov_9fa48("426"), 'PUBLISHED')))) && (stryMutAct_9fa48("429") ? now < startTime : stryMutAct_9fa48("428") ? now > startTime : stryMutAct_9fa48("427") ? true : (stryCov_9fa48("427", "428", "429"), now >= startTime)))) && (stryMutAct_9fa48("432") ? now >= endTime : stryMutAct_9fa48("431") ? now <= endTime : stryMutAct_9fa48("430") ? true : (stryCov_9fa48("430", "431", "432"), now < endTime)))) {
        if (stryMutAct_9fa48("433")) {
          {}
        } else {
          stryCov_9fa48("433");
          await contestRepository.updateContestStatus(contestId, stryMutAct_9fa48("434") ? "" : (stryCov_9fa48("434"), 'ACTIVE'));
          contest = await contestRepository.getContestById(contestId);
        }
      } else if (stryMutAct_9fa48("437") ? contest.status === 'ACTIVE' || now >= endTime : stryMutAct_9fa48("436") ? false : stryMutAct_9fa48("435") ? true : (stryCov_9fa48("435", "436", "437"), (stryMutAct_9fa48("439") ? contest.status !== 'ACTIVE' : stryMutAct_9fa48("438") ? true : (stryCov_9fa48("438", "439"), contest.status === (stryMutAct_9fa48("440") ? "" : (stryCov_9fa48("440"), 'ACTIVE')))) && (stryMutAct_9fa48("443") ? now < endTime : stryMutAct_9fa48("442") ? now > endTime : stryMutAct_9fa48("441") ? true : (stryCov_9fa48("441", "442", "443"), now >= endTime)))) {
        if (stryMutAct_9fa48("444")) {
          {}
        } else {
          stryCov_9fa48("444");
          await contestRepository.updateContestStatus(contestId, stryMutAct_9fa48("445") ? "" : (stryCov_9fa48("445"), 'ENDED'));
          contest = await contestRepository.getContestById(contestId);
        }
      }

      // Check if contest is active
      if (stryMutAct_9fa48("449") ? now >= startTime : stryMutAct_9fa48("448") ? now <= startTime : stryMutAct_9fa48("447") ? false : stryMutAct_9fa48("446") ? true : (stryCov_9fa48("446", "447", "448", "449"), now < startTime)) {
        if (stryMutAct_9fa48("450")) {
          {}
        } else {
          stryCov_9fa48("450");
          throw ERRORS.CONTEST_NOT_ACTIVE;
        }
      }
      if (stryMutAct_9fa48("454") ? now <= endTime : stryMutAct_9fa48("453") ? now >= endTime : stryMutAct_9fa48("452") ? false : stryMutAct_9fa48("451") ? true : (stryCov_9fa48("451", "452", "453", "454"), now > endTime)) {
        if (stryMutAct_9fa48("455")) {
          {}
        } else {
          stryCov_9fa48("455");
          throw ERRORS.CONTEST_ENDED;
        }
      }
      if (stryMutAct_9fa48("458") ? contest.status === 'ACTIVE' : stryMutAct_9fa48("457") ? false : stryMutAct_9fa48("456") ? true : (stryCov_9fa48("456", "457", "458"), contest.status !== (stryMutAct_9fa48("459") ? "" : (stryCov_9fa48("459"), 'ACTIVE')))) {
        if (stryMutAct_9fa48("460")) {
          {}
        } else {
          stryCov_9fa48("460");
          throw ERRORS.CONTEST_NOT_ACTIVE;
        }
      }

      // Check if user has already submitted
      const hasSubmitted = await contestRepository.hasUserSubmitted(learnerId, contestId);
      if (stryMutAct_9fa48("462") ? false : stryMutAct_9fa48("461") ? true : (stryCov_9fa48("461", "462"), hasSubmitted)) {
        if (stryMutAct_9fa48("463")) {
          {}
        } else {
          stryCov_9fa48("463");
          throw ERRORS.CONTEST_ALREADY_SUBMITTED;
        }
      }

      // Get questions (without correct answers)
      const questions = await contestRepository.learnerGetContestQuestions(contestId);
      return stryMutAct_9fa48("464") ? {} : (stryCov_9fa48("464"), {
        contest: stryMutAct_9fa48("465") ? {} : (stryCov_9fa48("465"), {
          id: contest.id,
          title: contest.title,
          description: contest.description,
          start_time: contest.start_time,
          end_time: contest.end_time,
          reward_points: contest.reward_points
        }),
        questions
      });
    }
  }

  /**
   * Learner: Submit contest
   */
  async submitContest(learnerId, contestId, submissions, startTime) {
    if (stryMutAct_9fa48("466")) {
      {}
    } else {
      stryCov_9fa48("466");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("469") ? false : stryMutAct_9fa48("468") ? true : stryMutAct_9fa48("467") ? contest : (stryCov_9fa48("467", "468", "469"), !contest)) {
        if (stryMutAct_9fa48("470")) {
          {}
        } else {
          stryCov_9fa48("470");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Check if contest is still active
      const now = new Date();
      const endTime = new Date(contest.end_time);
      if (stryMutAct_9fa48("474") ? now <= endTime : stryMutAct_9fa48("473") ? now >= endTime : stryMutAct_9fa48("472") ? false : stryMutAct_9fa48("471") ? true : (stryCov_9fa48("471", "472", "473", "474"), now > endTime)) {
        if (stryMutAct_9fa48("475")) {
          {}
        } else {
          stryCov_9fa48("475");
          throw ERRORS.CONTEST_ENDED;
        }
      }

      // Check if user has already submitted
      const hasSubmitted = await contestRepository.hasUserSubmitted(learnerId, contestId);
      if (stryMutAct_9fa48("477") ? false : stryMutAct_9fa48("476") ? true : (stryCov_9fa48("476", "477"), hasSubmitted)) {
        if (stryMutAct_9fa48("478")) {
          {}
        } else {
          stryCov_9fa48("478");
          throw ERRORS.CONTEST_ALREADY_SUBMITTED;
        }
      }

      // Calculate time taken
      const timeTakenMs = stryMutAct_9fa48("479") ? Date.now() + startTime : (stryCov_9fa48("479"), Date.now() - startTime);

      // Get correct answers
      const correctAnswers = await contestRepository.getCorrectAnswers(contestId);
      const correctAnswersMap = {};
      correctAnswers.forEach(qa => {
        if (stryMutAct_9fa48("480")) {
          {}
        } else {
          stryCov_9fa48("480");
          correctAnswersMap[qa.id] = qa.correct_option_id;
        }
      });

      // Calculate score and prepare submissions with correctness
      let score = 0;
      const submissionsWithStatus = stryMutAct_9fa48("481") ? ["Stryker was here"] : (stryCov_9fa48("481"), []);
      for (const submission of submissions) {
        if (stryMutAct_9fa48("482")) {
          {}
        } else {
          stryCov_9fa48("482");
          const isCorrect = stryMutAct_9fa48("485") ? correctAnswersMap[submission.question_id] !== submission.selected_option_id : stryMutAct_9fa48("484") ? false : stryMutAct_9fa48("483") ? true : (stryCov_9fa48("483", "484", "485"), correctAnswersMap[submission.question_id] === submission.selected_option_id);
          if (stryMutAct_9fa48("487") ? false : stryMutAct_9fa48("486") ? true : (stryCov_9fa48("486", "487"), isCorrect)) {
            if (stryMutAct_9fa48("488")) {
              {}
            } else {
              stryCov_9fa48("488");
              stryMutAct_9fa48("489") ? score-- : (stryCov_9fa48("489"), score++);
            }
          }
          submissionsWithStatus.push(stryMutAct_9fa48("490") ? {} : (stryCov_9fa48("490"), {
            question_id: submission.question_id,
            selected_option_id: submission.selected_option_id,
            is_correct: isCorrect
          }));
        }
      }

      // Save score and submissions
      await contestRepository.saveContestScore(learnerId, contestId, score, timeTakenMs);
      await contestRepository.saveContestSubmissions(learnerId, contestId, submissionsWithStatus);

      // Get user's result with rank
      const result = await contestRepository.getUserContestResult(learnerId, contestId);
      return stryMutAct_9fa48("491") ? {} : (stryCov_9fa48("491"), {
        score,
        total_questions: correctAnswers.length,
        time_taken_ms: timeTakenMs,
        rank: result.rank,
        total_participants: result.total_participants
      });
    }
  }

  /**
   * Get leaderboard for a contest
   */
  async getLeaderboard(contestId) {
    if (stryMutAct_9fa48("492")) {
      {}
    } else {
      stryCov_9fa48("492");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("495") ? false : stryMutAct_9fa48("494") ? true : stryMutAct_9fa48("493") ? contest : (stryCov_9fa48("493", "494", "495"), !contest)) {
        if (stryMutAct_9fa48("496")) {
          {}
        } else {
          stryCov_9fa48("496");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      const leaderboard = await contestRepository.getLeaderboard(contestId);
      return stryMutAct_9fa48("497") ? {} : (stryCov_9fa48("497"), {
        contest: stryMutAct_9fa48("498") ? {} : (stryCov_9fa48("498"), {
          id: contest.id,
          title: contest.title,
          description: contest.description,
          status: contest.status,
          start_time: contest.start_time,
          end_time: contest.end_time
        }),
        leaderboard
      });
    }
  }

  /**
   * Get user's contest history
   */
  async getUserContestHistory(learnerId) {
    if (stryMutAct_9fa48("499")) {
      {}
    } else {
      stryCov_9fa48("499");
      return await contestRepository.getUserContests(learnerId);
    }
  }

  /**
   * Get user's contest result details
   */
  async getUserContestDetails(learnerId, contestId) {
    if (stryMutAct_9fa48("500")) {
      {}
    } else {
      stryCov_9fa48("500");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("503") ? false : stryMutAct_9fa48("502") ? true : stryMutAct_9fa48("501") ? contest : (stryCov_9fa48("501", "502", "503"), !contest)) {
        if (stryMutAct_9fa48("504")) {
          {}
        } else {
          stryCov_9fa48("504");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      const result = await contestRepository.getUserContestResult(learnerId, contestId);
      if (stryMutAct_9fa48("507") ? false : stryMutAct_9fa48("506") ? true : stryMutAct_9fa48("505") ? result : (stryCov_9fa48("505", "506", "507"), !result)) {
        if (stryMutAct_9fa48("508")) {
          {}
        } else {
          stryCov_9fa48("508");
          throw ERRORS.NOT_FOUND;
        }
      }
      const submissions = await contestRepository.getUserSubmissions(learnerId, contestId);
      return stryMutAct_9fa48("509") ? {} : (stryCov_9fa48("509"), {
        contest: stryMutAct_9fa48("510") ? {} : (stryCov_9fa48("510"), {
          id: contest.id,
          title: contest.title,
          description: contest.description,
          status: contest.status
        }),
        result: stryMutAct_9fa48("511") ? {} : (stryCov_9fa48("511"), {
          score: result.score,
          time_taken_ms: result.time_taken_ms,
          submitted_at: result.submitted_at,
          rank: result.rank,
          total_participants: result.total_participants
        }),
        submissions
      });
    }
  }
}
export default new ContestService();