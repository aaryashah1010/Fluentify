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
    if (stryMutAct_9fa48("3209")) {
      {}
    } else {
      stryCov_9fa48("3209");
      // Validate times
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (stryMutAct_9fa48("3213") ? start < end : stryMutAct_9fa48("3212") ? start > end : stryMutAct_9fa48("3211") ? false : stryMutAct_9fa48("3210") ? true : (stryCov_9fa48("3210", "3211", "3212", "3213"), start >= end)) {
        if (stryMutAct_9fa48("3214")) {
          {}
        } else {
          stryCov_9fa48("3214");
          throw new Error(stryMutAct_9fa48("3215") ? "" : (stryCov_9fa48("3215"), 'End time must be after start time'));
        }
      }
      if (stryMutAct_9fa48("3219") ? start >= new Date() : stryMutAct_9fa48("3218") ? start <= new Date() : stryMutAct_9fa48("3217") ? false : stryMutAct_9fa48("3216") ? true : (stryCov_9fa48("3216", "3217", "3218", "3219"), start < new Date())) {
        if (stryMutAct_9fa48("3220")) {
          {}
        } else {
          stryCov_9fa48("3220");
          throw new Error(stryMutAct_9fa48("3221") ? "" : (stryCov_9fa48("3221"), 'Start time cannot be in the past'));
        }
      }
      return await contestRepository.adminCreateContest(title, description, startTime, endTime);
    }
  }

  /**
   * Admin: Add question to contest
   */
  async addQuestion(contestId, questionText, options, correctOptionId) {
    if (stryMutAct_9fa48("3222")) {
      {}
    } else {
      stryCov_9fa48("3222");
      // Validate contest exists
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3225") ? false : stryMutAct_9fa48("3224") ? true : stryMutAct_9fa48("3223") ? contest : (stryCov_9fa48("3223", "3224", "3225"), !contest)) {
        if (stryMutAct_9fa48("3226")) {
          {}
        } else {
          stryCov_9fa48("3226");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Validate contest is in DRAFT status
      if (stryMutAct_9fa48("3229") ? contest.status === 'DRAFT' : stryMutAct_9fa48("3228") ? false : stryMutAct_9fa48("3227") ? true : (stryCov_9fa48("3227", "3228", "3229"), contest.status !== (stryMutAct_9fa48("3230") ? "" : (stryCov_9fa48("3230"), 'DRAFT')))) {
        if (stryMutAct_9fa48("3231")) {
          {}
        } else {
          stryCov_9fa48("3231");
          throw ERRORS.INVALID_INPUT;
        }
      }

      // Validate options
      if (stryMutAct_9fa48("3234") ? !Array.isArray(options) && options.length < 2 : stryMutAct_9fa48("3233") ? false : stryMutAct_9fa48("3232") ? true : (stryCov_9fa48("3232", "3233", "3234"), (stryMutAct_9fa48("3235") ? Array.isArray(options) : (stryCov_9fa48("3235"), !Array.isArray(options))) || (stryMutAct_9fa48("3238") ? options.length >= 2 : stryMutAct_9fa48("3237") ? options.length <= 2 : stryMutAct_9fa48("3236") ? false : (stryCov_9fa48("3236", "3237", "3238"), options.length < 2)))) {
        if (stryMutAct_9fa48("3239")) {
          {}
        } else {
          stryCov_9fa48("3239");
          throw ERRORS.INVALID_INPUT;
        }
      }

      // Validate correct option ID exists in options
      const optionIds = options.map(stryMutAct_9fa48("3240") ? () => undefined : (stryCov_9fa48("3240"), opt => opt.id));
      if (stryMutAct_9fa48("3243") ? false : stryMutAct_9fa48("3242") ? true : stryMutAct_9fa48("3241") ? optionIds.includes(correctOptionId) : (stryCov_9fa48("3241", "3242", "3243"), !optionIds.includes(correctOptionId))) {
        if (stryMutAct_9fa48("3244")) {
          {}
        } else {
          stryCov_9fa48("3244");
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
    if (stryMutAct_9fa48("3245")) {
      {}
    } else {
      stryCov_9fa48("3245");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3248") ? false : stryMutAct_9fa48("3247") ? true : stryMutAct_9fa48("3246") ? contest : (stryCov_9fa48("3246", "3247", "3248"), !contest)) {
        if (stryMutAct_9fa48("3249")) {
          {}
        } else {
          stryCov_9fa48("3249");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Validate times if provided
      if (stryMutAct_9fa48("3252") ? updates.start_time || updates.end_time : stryMutAct_9fa48("3251") ? false : stryMutAct_9fa48("3250") ? true : (stryCov_9fa48("3250", "3251", "3252"), updates.start_time && updates.end_time)) {
        if (stryMutAct_9fa48("3253")) {
          {}
        } else {
          stryCov_9fa48("3253");
          const start = new Date(updates.start_time);
          const end = new Date(updates.end_time);
          if (stryMutAct_9fa48("3257") ? start < end : stryMutAct_9fa48("3256") ? start > end : stryMutAct_9fa48("3255") ? false : stryMutAct_9fa48("3254") ? true : (stryCov_9fa48("3254", "3255", "3256", "3257"), start >= end)) {
            if (stryMutAct_9fa48("3258")) {
              {}
            } else {
              stryCov_9fa48("3258");
              throw new Error(stryMutAct_9fa48("3259") ? "" : (stryCov_9fa48("3259"), 'End time must be after start time'));
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
    if (stryMutAct_9fa48("3260")) {
      {}
    } else {
      stryCov_9fa48("3260");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3263") ? false : stryMutAct_9fa48("3262") ? true : stryMutAct_9fa48("3261") ? contest : (stryCov_9fa48("3261", "3262", "3263"), !contest)) {
        if (stryMutAct_9fa48("3264")) {
          {}
        } else {
          stryCov_9fa48("3264");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      if (stryMutAct_9fa48("3267") ? contest.status === 'DRAFT' : stryMutAct_9fa48("3266") ? false : stryMutAct_9fa48("3265") ? true : (stryCov_9fa48("3265", "3266", "3267"), contest.status !== (stryMutAct_9fa48("3268") ? "" : (stryCov_9fa48("3268"), 'DRAFT')))) {
        if (stryMutAct_9fa48("3269")) {
          {}
        } else {
          stryCov_9fa48("3269");
          throw ERRORS.INVALID_INPUT;
        }
      }

      // Check if contest has questions
      const questions = await contestRepository.learnerGetContestQuestions(contestId);
      if (stryMutAct_9fa48("3272") ? questions.length !== 0 : stryMutAct_9fa48("3271") ? false : stryMutAct_9fa48("3270") ? true : (stryCov_9fa48("3270", "3271", "3272"), questions.length === 0)) {
        if (stryMutAct_9fa48("3273")) {
          {}
        } else {
          stryCov_9fa48("3273");
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
    if (stryMutAct_9fa48("3274")) {
      {}
    } else {
      stryCov_9fa48("3274");
      return await contestRepository.adminGetAllContests();
    }
  }

  /**
   * Admin: Get contest details with questions
   */
  async getContestDetails(contestId) {
    if (stryMutAct_9fa48("3275")) {
      {}
    } else {
      stryCov_9fa48("3275");
      const contest = await contestRepository.adminGetContestById(contestId);
      if (stryMutAct_9fa48("3278") ? false : stryMutAct_9fa48("3277") ? true : stryMutAct_9fa48("3276") ? contest : (stryCov_9fa48("3276", "3277", "3278"), !contest)) {
        if (stryMutAct_9fa48("3279")) {
          {}
        } else {
          stryCov_9fa48("3279");
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
    if (stryMutAct_9fa48("3280")) {
      {}
    } else {
      stryCov_9fa48("3280");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3283") ? false : stryMutAct_9fa48("3282") ? true : stryMutAct_9fa48("3281") ? contest : (stryCov_9fa48("3281", "3282", "3283"), !contest)) {
        if (stryMutAct_9fa48("3284")) {
          {}
        } else {
          stryCov_9fa48("3284");
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
    if (stryMutAct_9fa48("3285")) {
      {}
    } else {
      stryCov_9fa48("3285");
      const contests = await contestRepository.learnerGetAvailableContests(learnerId);

      // Update contest status based on current time
      const now = new Date();
      for (const contest of contests) {
        if (stryMutAct_9fa48("3286")) {
          {}
        } else {
          stryCov_9fa48("3286");
          const startTime = new Date(contest.start_time);
          const endTime = new Date(contest.end_time);
          if (stryMutAct_9fa48("3289") ? contest.status === 'PUBLISHED' && now >= startTime || now < endTime : stryMutAct_9fa48("3288") ? false : stryMutAct_9fa48("3287") ? true : (stryCov_9fa48("3287", "3288", "3289"), (stryMutAct_9fa48("3291") ? contest.status === 'PUBLISHED' || now >= startTime : stryMutAct_9fa48("3290") ? true : (stryCov_9fa48("3290", "3291"), (stryMutAct_9fa48("3293") ? contest.status !== 'PUBLISHED' : stryMutAct_9fa48("3292") ? true : (stryCov_9fa48("3292", "3293"), contest.status === (stryMutAct_9fa48("3294") ? "" : (stryCov_9fa48("3294"), 'PUBLISHED')))) && (stryMutAct_9fa48("3297") ? now < startTime : stryMutAct_9fa48("3296") ? now > startTime : stryMutAct_9fa48("3295") ? true : (stryCov_9fa48("3295", "3296", "3297"), now >= startTime)))) && (stryMutAct_9fa48("3300") ? now >= endTime : stryMutAct_9fa48("3299") ? now <= endTime : stryMutAct_9fa48("3298") ? true : (stryCov_9fa48("3298", "3299", "3300"), now < endTime)))) {
            if (stryMutAct_9fa48("3301")) {
              {}
            } else {
              stryCov_9fa48("3301");
              await contestRepository.updateContestStatus(contest.id, stryMutAct_9fa48("3302") ? "" : (stryCov_9fa48("3302"), 'ACTIVE'));
              contest.status = stryMutAct_9fa48("3303") ? "" : (stryCov_9fa48("3303"), 'ACTIVE');
            }
          } else if (stryMutAct_9fa48("3306") ? contest.status === 'ACTIVE' || now >= endTime : stryMutAct_9fa48("3305") ? false : stryMutAct_9fa48("3304") ? true : (stryCov_9fa48("3304", "3305", "3306"), (stryMutAct_9fa48("3308") ? contest.status !== 'ACTIVE' : stryMutAct_9fa48("3307") ? true : (stryCov_9fa48("3307", "3308"), contest.status === (stryMutAct_9fa48("3309") ? "" : (stryCov_9fa48("3309"), 'ACTIVE')))) && (stryMutAct_9fa48("3312") ? now < endTime : stryMutAct_9fa48("3311") ? now > endTime : stryMutAct_9fa48("3310") ? true : (stryCov_9fa48("3310", "3311", "3312"), now >= endTime)))) {
            if (stryMutAct_9fa48("3313")) {
              {}
            } else {
              stryCov_9fa48("3313");
              await contestRepository.updateContestStatus(contest.id, stryMutAct_9fa48("3314") ? "" : (stryCov_9fa48("3314"), 'ENDED'));
              contest.status = stryMutAct_9fa48("3315") ? "" : (stryCov_9fa48("3315"), 'ENDED');
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
    if (stryMutAct_9fa48("3316")) {
      {}
    } else {
      stryCov_9fa48("3316");
      let contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3319") ? false : stryMutAct_9fa48("3318") ? true : stryMutAct_9fa48("3317") ? contest : (stryCov_9fa48("3317", "3318", "3319"), !contest)) {
        if (stryMutAct_9fa48("3320")) {
          {}
        } else {
          stryCov_9fa48("3320");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Check if contest is accessible
      const now = new Date();
      const startTime = new Date(contest.start_time);
      const endTime = new Date(contest.end_time);

      // Update status if needed (and refetch so we rely on repository state)
      if (stryMutAct_9fa48("3323") ? contest.status === 'PUBLISHED' && now >= startTime || now < endTime : stryMutAct_9fa48("3322") ? false : stryMutAct_9fa48("3321") ? true : (stryCov_9fa48("3321", "3322", "3323"), (stryMutAct_9fa48("3325") ? contest.status === 'PUBLISHED' || now >= startTime : stryMutAct_9fa48("3324") ? true : (stryCov_9fa48("3324", "3325"), (stryMutAct_9fa48("3327") ? contest.status !== 'PUBLISHED' : stryMutAct_9fa48("3326") ? true : (stryCov_9fa48("3326", "3327"), contest.status === (stryMutAct_9fa48("3328") ? "" : (stryCov_9fa48("3328"), 'PUBLISHED')))) && (stryMutAct_9fa48("3331") ? now < startTime : stryMutAct_9fa48("3330") ? now > startTime : stryMutAct_9fa48("3329") ? true : (stryCov_9fa48("3329", "3330", "3331"), now >= startTime)))) && (stryMutAct_9fa48("3334") ? now >= endTime : stryMutAct_9fa48("3333") ? now <= endTime : stryMutAct_9fa48("3332") ? true : (stryCov_9fa48("3332", "3333", "3334"), now < endTime)))) {
        if (stryMutAct_9fa48("3335")) {
          {}
        } else {
          stryCov_9fa48("3335");
          await contestRepository.updateContestStatus(contestId, stryMutAct_9fa48("3336") ? "" : (stryCov_9fa48("3336"), 'ACTIVE'));
          contest = await contestRepository.getContestById(contestId);
        }
      } else if (stryMutAct_9fa48("3339") ? contest.status === 'ACTIVE' || now >= endTime : stryMutAct_9fa48("3338") ? false : stryMutAct_9fa48("3337") ? true : (stryCov_9fa48("3337", "3338", "3339"), (stryMutAct_9fa48("3341") ? contest.status !== 'ACTIVE' : stryMutAct_9fa48("3340") ? true : (stryCov_9fa48("3340", "3341"), contest.status === (stryMutAct_9fa48("3342") ? "" : (stryCov_9fa48("3342"), 'ACTIVE')))) && (stryMutAct_9fa48("3345") ? now < endTime : stryMutAct_9fa48("3344") ? now > endTime : stryMutAct_9fa48("3343") ? true : (stryCov_9fa48("3343", "3344", "3345"), now >= endTime)))) {
        if (stryMutAct_9fa48("3346")) {
          {}
        } else {
          stryCov_9fa48("3346");
          await contestRepository.updateContestStatus(contestId, stryMutAct_9fa48("3347") ? "" : (stryCov_9fa48("3347"), 'ENDED'));
          contest = await contestRepository.getContestById(contestId);
        }
      }

      // Check if contest is active
      if (stryMutAct_9fa48("3351") ? now >= startTime : stryMutAct_9fa48("3350") ? now <= startTime : stryMutAct_9fa48("3349") ? false : stryMutAct_9fa48("3348") ? true : (stryCov_9fa48("3348", "3349", "3350", "3351"), now < startTime)) {
        if (stryMutAct_9fa48("3352")) {
          {}
        } else {
          stryCov_9fa48("3352");
          throw ERRORS.CONTEST_NOT_ACTIVE;
        }
      }
      if (stryMutAct_9fa48("3356") ? now <= endTime : stryMutAct_9fa48("3355") ? now >= endTime : stryMutAct_9fa48("3354") ? false : stryMutAct_9fa48("3353") ? true : (stryCov_9fa48("3353", "3354", "3355", "3356"), now > endTime)) {
        if (stryMutAct_9fa48("3357")) {
          {}
        } else {
          stryCov_9fa48("3357");
          throw ERRORS.CONTEST_ENDED;
        }
      }
      if (stryMutAct_9fa48("3360") ? contest.status === 'ACTIVE' : stryMutAct_9fa48("3359") ? false : stryMutAct_9fa48("3358") ? true : (stryCov_9fa48("3358", "3359", "3360"), contest.status !== (stryMutAct_9fa48("3361") ? "" : (stryCov_9fa48("3361"), 'ACTIVE')))) {
        if (stryMutAct_9fa48("3362")) {
          {}
        } else {
          stryCov_9fa48("3362");
          throw ERRORS.CONTEST_NOT_ACTIVE;
        }
      }

      // Check if user has already submitted
      const hasSubmitted = await contestRepository.hasUserSubmitted(learnerId, contestId);
      if (stryMutAct_9fa48("3364") ? false : stryMutAct_9fa48("3363") ? true : (stryCov_9fa48("3363", "3364"), hasSubmitted)) {
        if (stryMutAct_9fa48("3365")) {
          {}
        } else {
          stryCov_9fa48("3365");
          throw ERRORS.CONTEST_ALREADY_SUBMITTED;
        }
      }

      // Get questions (without correct answers)
      const questions = await contestRepository.learnerGetContestQuestions(contestId);
      return stryMutAct_9fa48("3366") ? {} : (stryCov_9fa48("3366"), {
        contest: stryMutAct_9fa48("3367") ? {} : (stryCov_9fa48("3367"), {
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
    if (stryMutAct_9fa48("3368")) {
      {}
    } else {
      stryCov_9fa48("3368");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3371") ? false : stryMutAct_9fa48("3370") ? true : stryMutAct_9fa48("3369") ? contest : (stryCov_9fa48("3369", "3370", "3371"), !contest)) {
        if (stryMutAct_9fa48("3372")) {
          {}
        } else {
          stryCov_9fa48("3372");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Check if contest is still active
      const now = new Date();
      const endTime = new Date(contest.end_time);
      if (stryMutAct_9fa48("3376") ? now <= endTime : stryMutAct_9fa48("3375") ? now >= endTime : stryMutAct_9fa48("3374") ? false : stryMutAct_9fa48("3373") ? true : (stryCov_9fa48("3373", "3374", "3375", "3376"), now > endTime)) {
        if (stryMutAct_9fa48("3377")) {
          {}
        } else {
          stryCov_9fa48("3377");
          throw ERRORS.CONTEST_ENDED;
        }
      }

      // Check if user has already submitted
      const hasSubmitted = await contestRepository.hasUserSubmitted(learnerId, contestId);
      if (stryMutAct_9fa48("3379") ? false : stryMutAct_9fa48("3378") ? true : (stryCov_9fa48("3378", "3379"), hasSubmitted)) {
        if (stryMutAct_9fa48("3380")) {
          {}
        } else {
          stryCov_9fa48("3380");
          throw ERRORS.CONTEST_ALREADY_SUBMITTED;
        }
      }

      // Calculate time taken
      const timeTakenMs = stryMutAct_9fa48("3381") ? Date.now() + startTime : (stryCov_9fa48("3381"), Date.now() - startTime);

      // Get correct answers
      const correctAnswers = await contestRepository.getCorrectAnswers(contestId);
      const correctAnswersMap = {};
      correctAnswers.forEach(qa => {
        if (stryMutAct_9fa48("3382")) {
          {}
        } else {
          stryCov_9fa48("3382");
          correctAnswersMap[qa.id] = qa.correct_option_id;
        }
      });

      // Calculate score and prepare submissions with correctness
      let score = 0;
      const submissionsWithStatus = stryMutAct_9fa48("3383") ? ["Stryker was here"] : (stryCov_9fa48("3383"), []);
      for (const submission of submissions) {
        if (stryMutAct_9fa48("3384")) {
          {}
        } else {
          stryCov_9fa48("3384");
          const isCorrect = stryMutAct_9fa48("3387") ? correctAnswersMap[submission.question_id] !== submission.selected_option_id : stryMutAct_9fa48("3386") ? false : stryMutAct_9fa48("3385") ? true : (stryCov_9fa48("3385", "3386", "3387"), correctAnswersMap[submission.question_id] === submission.selected_option_id);
          if (stryMutAct_9fa48("3389") ? false : stryMutAct_9fa48("3388") ? true : (stryCov_9fa48("3388", "3389"), isCorrect)) {
            if (stryMutAct_9fa48("3390")) {
              {}
            } else {
              stryCov_9fa48("3390");
              stryMutAct_9fa48("3391") ? score-- : (stryCov_9fa48("3391"), score++);
            }
          }
          submissionsWithStatus.push(stryMutAct_9fa48("3392") ? {} : (stryCov_9fa48("3392"), {
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
      return stryMutAct_9fa48("3393") ? {} : (stryCov_9fa48("3393"), {
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
    if (stryMutAct_9fa48("3394")) {
      {}
    } else {
      stryCov_9fa48("3394");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3397") ? false : stryMutAct_9fa48("3396") ? true : stryMutAct_9fa48("3395") ? contest : (stryCov_9fa48("3395", "3396", "3397"), !contest)) {
        if (stryMutAct_9fa48("3398")) {
          {}
        } else {
          stryCov_9fa48("3398");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      const leaderboard = await contestRepository.getLeaderboard(contestId);
      return stryMutAct_9fa48("3399") ? {} : (stryCov_9fa48("3399"), {
        contest: stryMutAct_9fa48("3400") ? {} : (stryCov_9fa48("3400"), {
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
    if (stryMutAct_9fa48("3401")) {
      {}
    } else {
      stryCov_9fa48("3401");
      return await contestRepository.getUserContests(learnerId);
    }
  }

  /**
   * Get user's contest result details
   */
  async getUserContestDetails(learnerId, contestId) {
    if (stryMutAct_9fa48("3402")) {
      {}
    } else {
      stryCov_9fa48("3402");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3405") ? false : stryMutAct_9fa48("3404") ? true : stryMutAct_9fa48("3403") ? contest : (stryCov_9fa48("3403", "3404", "3405"), !contest)) {
        if (stryMutAct_9fa48("3406")) {
          {}
        } else {
          stryCov_9fa48("3406");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      const result = await contestRepository.getUserContestResult(learnerId, contestId);
      if (stryMutAct_9fa48("3409") ? false : stryMutAct_9fa48("3408") ? true : stryMutAct_9fa48("3407") ? result : (stryCov_9fa48("3407", "3408", "3409"), !result)) {
        if (stryMutAct_9fa48("3410")) {
          {}
        } else {
          stryCov_9fa48("3410");
          throw ERRORS.NOT_FOUND;
        }
      }
      const submissions = await contestRepository.getUserSubmissions(learnerId, contestId);
      return stryMutAct_9fa48("3411") ? {} : (stryCov_9fa48("3411"), {
        contest: stryMutAct_9fa48("3412") ? {} : (stryCov_9fa48("3412"), {
          id: contest.id,
          title: contest.title,
          description: contest.description,
          status: contest.status
        }),
        result: stryMutAct_9fa48("3413") ? {} : (stryCov_9fa48("3413"), {
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