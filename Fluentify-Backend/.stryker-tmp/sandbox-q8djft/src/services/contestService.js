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
    if (stryMutAct_9fa48("2880")) {
      {}
    } else {
      stryCov_9fa48("2880");
      // Validate times
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (stryMutAct_9fa48("2884") ? start < end : stryMutAct_9fa48("2883") ? start > end : stryMutAct_9fa48("2882") ? false : stryMutAct_9fa48("2881") ? true : (stryCov_9fa48("2881", "2882", "2883", "2884"), start >= end)) {
        if (stryMutAct_9fa48("2885")) {
          {}
        } else {
          stryCov_9fa48("2885");
          throw new Error(stryMutAct_9fa48("2886") ? "" : (stryCov_9fa48("2886"), 'End time must be after start time'));
        }
      }
      if (stryMutAct_9fa48("2890") ? start >= new Date() : stryMutAct_9fa48("2889") ? start <= new Date() : stryMutAct_9fa48("2888") ? false : stryMutAct_9fa48("2887") ? true : (stryCov_9fa48("2887", "2888", "2889", "2890"), start < new Date())) {
        if (stryMutAct_9fa48("2891")) {
          {}
        } else {
          stryCov_9fa48("2891");
          throw new Error(stryMutAct_9fa48("2892") ? "" : (stryCov_9fa48("2892"), 'Start time cannot be in the past'));
        }
      }
      return await contestRepository.adminCreateContest(title, description, startTime, endTime);
    }
  }

  /**
   * Admin: Add question to contest
   */
  async addQuestion(contestId, questionText, options, correctOptionId) {
    if (stryMutAct_9fa48("2893")) {
      {}
    } else {
      stryCov_9fa48("2893");
      // Validate contest exists
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("2896") ? false : stryMutAct_9fa48("2895") ? true : stryMutAct_9fa48("2894") ? contest : (stryCov_9fa48("2894", "2895", "2896"), !contest)) {
        if (stryMutAct_9fa48("2897")) {
          {}
        } else {
          stryCov_9fa48("2897");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Validate contest is in DRAFT status
      if (stryMutAct_9fa48("2900") ? contest.status === 'DRAFT' : stryMutAct_9fa48("2899") ? false : stryMutAct_9fa48("2898") ? true : (stryCov_9fa48("2898", "2899", "2900"), contest.status !== (stryMutAct_9fa48("2901") ? "" : (stryCov_9fa48("2901"), 'DRAFT')))) {
        if (stryMutAct_9fa48("2902")) {
          {}
        } else {
          stryCov_9fa48("2902");
          throw ERRORS.INVALID_INPUT;
        }
      }

      // Validate options
      if (stryMutAct_9fa48("2905") ? !Array.isArray(options) && options.length < 2 : stryMutAct_9fa48("2904") ? false : stryMutAct_9fa48("2903") ? true : (stryCov_9fa48("2903", "2904", "2905"), (stryMutAct_9fa48("2906") ? Array.isArray(options) : (stryCov_9fa48("2906"), !Array.isArray(options))) || (stryMutAct_9fa48("2909") ? options.length >= 2 : stryMutAct_9fa48("2908") ? options.length <= 2 : stryMutAct_9fa48("2907") ? false : (stryCov_9fa48("2907", "2908", "2909"), options.length < 2)))) {
        if (stryMutAct_9fa48("2910")) {
          {}
        } else {
          stryCov_9fa48("2910");
          throw ERRORS.INVALID_INPUT;
        }
      }

      // Validate correct option ID exists in options
      const optionIds = options.map(stryMutAct_9fa48("2911") ? () => undefined : (stryCov_9fa48("2911"), opt => opt.id));
      if (stryMutAct_9fa48("2914") ? false : stryMutAct_9fa48("2913") ? true : stryMutAct_9fa48("2912") ? optionIds.includes(correctOptionId) : (stryCov_9fa48("2912", "2913", "2914"), !optionIds.includes(correctOptionId))) {
        if (stryMutAct_9fa48("2915")) {
          {}
        } else {
          stryCov_9fa48("2915");
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
    if (stryMutAct_9fa48("2916")) {
      {}
    } else {
      stryCov_9fa48("2916");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("2919") ? false : stryMutAct_9fa48("2918") ? true : stryMutAct_9fa48("2917") ? contest : (stryCov_9fa48("2917", "2918", "2919"), !contest)) {
        if (stryMutAct_9fa48("2920")) {
          {}
        } else {
          stryCov_9fa48("2920");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Validate times if provided
      if (stryMutAct_9fa48("2923") ? updates.start_time || updates.end_time : stryMutAct_9fa48("2922") ? false : stryMutAct_9fa48("2921") ? true : (stryCov_9fa48("2921", "2922", "2923"), updates.start_time && updates.end_time)) {
        if (stryMutAct_9fa48("2924")) {
          {}
        } else {
          stryCov_9fa48("2924");
          const start = new Date(updates.start_time);
          const end = new Date(updates.end_time);
          if (stryMutAct_9fa48("2928") ? start < end : stryMutAct_9fa48("2927") ? start > end : stryMutAct_9fa48("2926") ? false : stryMutAct_9fa48("2925") ? true : (stryCov_9fa48("2925", "2926", "2927", "2928"), start >= end)) {
            if (stryMutAct_9fa48("2929")) {
              {}
            } else {
              stryCov_9fa48("2929");
              throw new Error(stryMutAct_9fa48("2930") ? "" : (stryCov_9fa48("2930"), 'End time must be after start time'));
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
    if (stryMutAct_9fa48("2931")) {
      {}
    } else {
      stryCov_9fa48("2931");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("2934") ? false : stryMutAct_9fa48("2933") ? true : stryMutAct_9fa48("2932") ? contest : (stryCov_9fa48("2932", "2933", "2934"), !contest)) {
        if (stryMutAct_9fa48("2935")) {
          {}
        } else {
          stryCov_9fa48("2935");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      if (stryMutAct_9fa48("2938") ? contest.status === 'DRAFT' : stryMutAct_9fa48("2937") ? false : stryMutAct_9fa48("2936") ? true : (stryCov_9fa48("2936", "2937", "2938"), contest.status !== (stryMutAct_9fa48("2939") ? "" : (stryCov_9fa48("2939"), 'DRAFT')))) {
        if (stryMutAct_9fa48("2940")) {
          {}
        } else {
          stryCov_9fa48("2940");
          throw ERRORS.INVALID_INPUT;
        }
      }

      // Check if contest has questions
      const questions = await contestRepository.learnerGetContestQuestions(contestId);
      if (stryMutAct_9fa48("2943") ? questions.length !== 0 : stryMutAct_9fa48("2942") ? false : stryMutAct_9fa48("2941") ? true : (stryCov_9fa48("2941", "2942", "2943"), questions.length === 0)) {
        if (stryMutAct_9fa48("2944")) {
          {}
        } else {
          stryCov_9fa48("2944");
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
    if (stryMutAct_9fa48("2945")) {
      {}
    } else {
      stryCov_9fa48("2945");
      return await contestRepository.adminGetAllContests();
    }
  }

  /**
   * Admin: Get contest details with questions
   */
  async getContestDetails(contestId) {
    if (stryMutAct_9fa48("2946")) {
      {}
    } else {
      stryCov_9fa48("2946");
      const contest = await contestRepository.adminGetContestById(contestId);
      if (stryMutAct_9fa48("2949") ? false : stryMutAct_9fa48("2948") ? true : stryMutAct_9fa48("2947") ? contest : (stryCov_9fa48("2947", "2948", "2949"), !contest)) {
        if (stryMutAct_9fa48("2950")) {
          {}
        } else {
          stryCov_9fa48("2950");
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
    if (stryMutAct_9fa48("2951")) {
      {}
    } else {
      stryCov_9fa48("2951");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("2954") ? false : stryMutAct_9fa48("2953") ? true : stryMutAct_9fa48("2952") ? contest : (stryCov_9fa48("2952", "2953", "2954"), !contest)) {
        if (stryMutAct_9fa48("2955")) {
          {}
        } else {
          stryCov_9fa48("2955");
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
    if (stryMutAct_9fa48("2956")) {
      {}
    } else {
      stryCov_9fa48("2956");
      const contests = await contestRepository.learnerGetAvailableContests(learnerId);

      // Update contest status based on current time
      const now = new Date();
      for (const contest of contests) {
        if (stryMutAct_9fa48("2957")) {
          {}
        } else {
          stryCov_9fa48("2957");
          const startTime = new Date(contest.start_time);
          const endTime = new Date(contest.end_time);
          if (stryMutAct_9fa48("2960") ? contest.status === 'PUBLISHED' && now >= startTime || now < endTime : stryMutAct_9fa48("2959") ? false : stryMutAct_9fa48("2958") ? true : (stryCov_9fa48("2958", "2959", "2960"), (stryMutAct_9fa48("2962") ? contest.status === 'PUBLISHED' || now >= startTime : stryMutAct_9fa48("2961") ? true : (stryCov_9fa48("2961", "2962"), (stryMutAct_9fa48("2964") ? contest.status !== 'PUBLISHED' : stryMutAct_9fa48("2963") ? true : (stryCov_9fa48("2963", "2964"), contest.status === (stryMutAct_9fa48("2965") ? "" : (stryCov_9fa48("2965"), 'PUBLISHED')))) && (stryMutAct_9fa48("2968") ? now < startTime : stryMutAct_9fa48("2967") ? now > startTime : stryMutAct_9fa48("2966") ? true : (stryCov_9fa48("2966", "2967", "2968"), now >= startTime)))) && (stryMutAct_9fa48("2971") ? now >= endTime : stryMutAct_9fa48("2970") ? now <= endTime : stryMutAct_9fa48("2969") ? true : (stryCov_9fa48("2969", "2970", "2971"), now < endTime)))) {
            if (stryMutAct_9fa48("2972")) {
              {}
            } else {
              stryCov_9fa48("2972");
              await contestRepository.updateContestStatus(contest.id, stryMutAct_9fa48("2973") ? "" : (stryCov_9fa48("2973"), 'ACTIVE'));
              contest.status = stryMutAct_9fa48("2974") ? "" : (stryCov_9fa48("2974"), 'ACTIVE');
            }
          } else if (stryMutAct_9fa48("2977") ? contest.status === 'ACTIVE' || now >= endTime : stryMutAct_9fa48("2976") ? false : stryMutAct_9fa48("2975") ? true : (stryCov_9fa48("2975", "2976", "2977"), (stryMutAct_9fa48("2979") ? contest.status !== 'ACTIVE' : stryMutAct_9fa48("2978") ? true : (stryCov_9fa48("2978", "2979"), contest.status === (stryMutAct_9fa48("2980") ? "" : (stryCov_9fa48("2980"), 'ACTIVE')))) && (stryMutAct_9fa48("2983") ? now < endTime : stryMutAct_9fa48("2982") ? now > endTime : stryMutAct_9fa48("2981") ? true : (stryCov_9fa48("2981", "2982", "2983"), now >= endTime)))) {
            if (stryMutAct_9fa48("2984")) {
              {}
            } else {
              stryCov_9fa48("2984");
              await contestRepository.updateContestStatus(contest.id, stryMutAct_9fa48("2985") ? "" : (stryCov_9fa48("2985"), 'ENDED'));
              contest.status = stryMutAct_9fa48("2986") ? "" : (stryCov_9fa48("2986"), 'ENDED');
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
    if (stryMutAct_9fa48("2987")) {
      {}
    } else {
      stryCov_9fa48("2987");
      let contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("2990") ? false : stryMutAct_9fa48("2989") ? true : stryMutAct_9fa48("2988") ? contest : (stryCov_9fa48("2988", "2989", "2990"), !contest)) {
        if (stryMutAct_9fa48("2991")) {
          {}
        } else {
          stryCov_9fa48("2991");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Check if contest is accessible
      const now = new Date();
      const startTime = new Date(contest.start_time);
      const endTime = new Date(contest.end_time);

      // Update status if needed (and refetch so we rely on repository state)
      if (stryMutAct_9fa48("2994") ? contest.status === 'PUBLISHED' && now >= startTime || now < endTime : stryMutAct_9fa48("2993") ? false : stryMutAct_9fa48("2992") ? true : (stryCov_9fa48("2992", "2993", "2994"), (stryMutAct_9fa48("2996") ? contest.status === 'PUBLISHED' || now >= startTime : stryMutAct_9fa48("2995") ? true : (stryCov_9fa48("2995", "2996"), (stryMutAct_9fa48("2998") ? contest.status !== 'PUBLISHED' : stryMutAct_9fa48("2997") ? true : (stryCov_9fa48("2997", "2998"), contest.status === (stryMutAct_9fa48("2999") ? "" : (stryCov_9fa48("2999"), 'PUBLISHED')))) && (stryMutAct_9fa48("3002") ? now < startTime : stryMutAct_9fa48("3001") ? now > startTime : stryMutAct_9fa48("3000") ? true : (stryCov_9fa48("3000", "3001", "3002"), now >= startTime)))) && (stryMutAct_9fa48("3005") ? now >= endTime : stryMutAct_9fa48("3004") ? now <= endTime : stryMutAct_9fa48("3003") ? true : (stryCov_9fa48("3003", "3004", "3005"), now < endTime)))) {
        if (stryMutAct_9fa48("3006")) {
          {}
        } else {
          stryCov_9fa48("3006");
          await contestRepository.updateContestStatus(contestId, stryMutAct_9fa48("3007") ? "" : (stryCov_9fa48("3007"), 'ACTIVE'));
          contest = await contestRepository.getContestById(contestId);
        }
      } else if (stryMutAct_9fa48("3010") ? contest.status === 'ACTIVE' || now >= endTime : stryMutAct_9fa48("3009") ? false : stryMutAct_9fa48("3008") ? true : (stryCov_9fa48("3008", "3009", "3010"), (stryMutAct_9fa48("3012") ? contest.status !== 'ACTIVE' : stryMutAct_9fa48("3011") ? true : (stryCov_9fa48("3011", "3012"), contest.status === (stryMutAct_9fa48("3013") ? "" : (stryCov_9fa48("3013"), 'ACTIVE')))) && (stryMutAct_9fa48("3016") ? now < endTime : stryMutAct_9fa48("3015") ? now > endTime : stryMutAct_9fa48("3014") ? true : (stryCov_9fa48("3014", "3015", "3016"), now >= endTime)))) {
        if (stryMutAct_9fa48("3017")) {
          {}
        } else {
          stryCov_9fa48("3017");
          await contestRepository.updateContestStatus(contestId, stryMutAct_9fa48("3018") ? "" : (stryCov_9fa48("3018"), 'ENDED'));
          contest = await contestRepository.getContestById(contestId);
        }
      }

      // Check if contest is active
      if (stryMutAct_9fa48("3022") ? now >= startTime : stryMutAct_9fa48("3021") ? now <= startTime : stryMutAct_9fa48("3020") ? false : stryMutAct_9fa48("3019") ? true : (stryCov_9fa48("3019", "3020", "3021", "3022"), now < startTime)) {
        if (stryMutAct_9fa48("3023")) {
          {}
        } else {
          stryCov_9fa48("3023");
          throw ERRORS.CONTEST_NOT_ACTIVE;
        }
      }
      if (stryMutAct_9fa48("3027") ? now <= endTime : stryMutAct_9fa48("3026") ? now >= endTime : stryMutAct_9fa48("3025") ? false : stryMutAct_9fa48("3024") ? true : (stryCov_9fa48("3024", "3025", "3026", "3027"), now > endTime)) {
        if (stryMutAct_9fa48("3028")) {
          {}
        } else {
          stryCov_9fa48("3028");
          throw ERRORS.CONTEST_ENDED;
        }
      }
      if (stryMutAct_9fa48("3031") ? contest.status === 'ACTIVE' : stryMutAct_9fa48("3030") ? false : stryMutAct_9fa48("3029") ? true : (stryCov_9fa48("3029", "3030", "3031"), contest.status !== (stryMutAct_9fa48("3032") ? "" : (stryCov_9fa48("3032"), 'ACTIVE')))) {
        if (stryMutAct_9fa48("3033")) {
          {}
        } else {
          stryCov_9fa48("3033");
          throw ERRORS.CONTEST_NOT_ACTIVE;
        }
      }

      // Check if user has already submitted
      const hasSubmitted = await contestRepository.hasUserSubmitted(learnerId, contestId);
      if (stryMutAct_9fa48("3035") ? false : stryMutAct_9fa48("3034") ? true : (stryCov_9fa48("3034", "3035"), hasSubmitted)) {
        if (stryMutAct_9fa48("3036")) {
          {}
        } else {
          stryCov_9fa48("3036");
          throw ERRORS.CONTEST_ALREADY_SUBMITTED;
        }
      }

      // Get questions (without correct answers)
      const questions = await contestRepository.learnerGetContestQuestions(contestId);
      return stryMutAct_9fa48("3037") ? {} : (stryCov_9fa48("3037"), {
        contest: stryMutAct_9fa48("3038") ? {} : (stryCov_9fa48("3038"), {
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
    if (stryMutAct_9fa48("3039")) {
      {}
    } else {
      stryCov_9fa48("3039");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3042") ? false : stryMutAct_9fa48("3041") ? true : stryMutAct_9fa48("3040") ? contest : (stryCov_9fa48("3040", "3041", "3042"), !contest)) {
        if (stryMutAct_9fa48("3043")) {
          {}
        } else {
          stryCov_9fa48("3043");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Check if contest is still active
      const now = new Date();
      const endTime = new Date(contest.end_time);
      if (stryMutAct_9fa48("3047") ? now <= endTime : stryMutAct_9fa48("3046") ? now >= endTime : stryMutAct_9fa48("3045") ? false : stryMutAct_9fa48("3044") ? true : (stryCov_9fa48("3044", "3045", "3046", "3047"), now > endTime)) {
        if (stryMutAct_9fa48("3048")) {
          {}
        } else {
          stryCov_9fa48("3048");
          throw ERRORS.CONTEST_ENDED;
        }
      }

      // Check if user has already submitted
      const hasSubmitted = await contestRepository.hasUserSubmitted(learnerId, contestId);
      if (stryMutAct_9fa48("3050") ? false : stryMutAct_9fa48("3049") ? true : (stryCov_9fa48("3049", "3050"), hasSubmitted)) {
        if (stryMutAct_9fa48("3051")) {
          {}
        } else {
          stryCov_9fa48("3051");
          throw ERRORS.CONTEST_ALREADY_SUBMITTED;
        }
      }

      // Calculate time taken
      const timeTakenMs = stryMutAct_9fa48("3052") ? Date.now() + startTime : (stryCov_9fa48("3052"), Date.now() - startTime);

      // Get correct answers
      const correctAnswers = await contestRepository.getCorrectAnswers(contestId);
      const correctAnswersMap = {};
      correctAnswers.forEach(qa => {
        if (stryMutAct_9fa48("3053")) {
          {}
        } else {
          stryCov_9fa48("3053");
          correctAnswersMap[qa.id] = qa.correct_option_id;
        }
      });

      // Calculate score and prepare submissions with correctness
      let score = 0;
      const submissionsWithStatus = stryMutAct_9fa48("3054") ? ["Stryker was here"] : (stryCov_9fa48("3054"), []);
      for (const submission of submissions) {
        if (stryMutAct_9fa48("3055")) {
          {}
        } else {
          stryCov_9fa48("3055");
          const isCorrect = stryMutAct_9fa48("3058") ? correctAnswersMap[submission.question_id] !== submission.selected_option_id : stryMutAct_9fa48("3057") ? false : stryMutAct_9fa48("3056") ? true : (stryCov_9fa48("3056", "3057", "3058"), correctAnswersMap[submission.question_id] === submission.selected_option_id);
          if (stryMutAct_9fa48("3060") ? false : stryMutAct_9fa48("3059") ? true : (stryCov_9fa48("3059", "3060"), isCorrect)) {
            if (stryMutAct_9fa48("3061")) {
              {}
            } else {
              stryCov_9fa48("3061");
              stryMutAct_9fa48("3062") ? score-- : (stryCov_9fa48("3062"), score++);
            }
          }
          submissionsWithStatus.push(stryMutAct_9fa48("3063") ? {} : (stryCov_9fa48("3063"), {
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
      return stryMutAct_9fa48("3064") ? {} : (stryCov_9fa48("3064"), {
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
    if (stryMutAct_9fa48("3065")) {
      {}
    } else {
      stryCov_9fa48("3065");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3068") ? false : stryMutAct_9fa48("3067") ? true : stryMutAct_9fa48("3066") ? contest : (stryCov_9fa48("3066", "3067", "3068"), !contest)) {
        if (stryMutAct_9fa48("3069")) {
          {}
        } else {
          stryCov_9fa48("3069");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      const leaderboard = await contestRepository.getLeaderboard(contestId);
      return stryMutAct_9fa48("3070") ? {} : (stryCov_9fa48("3070"), {
        contest: stryMutAct_9fa48("3071") ? {} : (stryCov_9fa48("3071"), {
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
    if (stryMutAct_9fa48("3072")) {
      {}
    } else {
      stryCov_9fa48("3072");
      return await contestRepository.getUserContests(learnerId);
    }
  }

  /**
   * Get user's contest result details
   */
  async getUserContestDetails(learnerId, contestId) {
    if (stryMutAct_9fa48("3073")) {
      {}
    } else {
      stryCov_9fa48("3073");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3076") ? false : stryMutAct_9fa48("3075") ? true : stryMutAct_9fa48("3074") ? contest : (stryCov_9fa48("3074", "3075", "3076"), !contest)) {
        if (stryMutAct_9fa48("3077")) {
          {}
        } else {
          stryCov_9fa48("3077");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      const result = await contestRepository.getUserContestResult(learnerId, contestId);
      if (stryMutAct_9fa48("3080") ? false : stryMutAct_9fa48("3079") ? true : stryMutAct_9fa48("3078") ? result : (stryCov_9fa48("3078", "3079", "3080"), !result)) {
        if (stryMutAct_9fa48("3081")) {
          {}
        } else {
          stryCov_9fa48("3081");
          throw ERRORS.NOT_FOUND;
        }
      }
      const submissions = await contestRepository.getUserSubmissions(learnerId, contestId);
      return stryMutAct_9fa48("3082") ? {} : (stryCov_9fa48("3082"), {
        contest: stryMutAct_9fa48("3083") ? {} : (stryCov_9fa48("3083"), {
          id: contest.id,
          title: contest.title,
          description: contest.description,
          status: contest.status
        }),
        result: stryMutAct_9fa48("3084") ? {} : (stryCov_9fa48("3084"), {
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