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
    if (stryMutAct_9fa48("2863")) {
      {}
    } else {
      stryCov_9fa48("2863");
      // Validate times
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (stryMutAct_9fa48("2867") ? start < end : stryMutAct_9fa48("2866") ? start > end : stryMutAct_9fa48("2865") ? false : stryMutAct_9fa48("2864") ? true : (stryCov_9fa48("2864", "2865", "2866", "2867"), start >= end)) {
        if (stryMutAct_9fa48("2868")) {
          {}
        } else {
          stryCov_9fa48("2868");
          throw new Error(stryMutAct_9fa48("2869") ? "" : (stryCov_9fa48("2869"), 'End time must be after start time'));
        }
      }
      if (stryMutAct_9fa48("2873") ? start >= new Date() : stryMutAct_9fa48("2872") ? start <= new Date() : stryMutAct_9fa48("2871") ? false : stryMutAct_9fa48("2870") ? true : (stryCov_9fa48("2870", "2871", "2872", "2873"), start < new Date())) {
        if (stryMutAct_9fa48("2874")) {
          {}
        } else {
          stryCov_9fa48("2874");
          throw new Error(stryMutAct_9fa48("2875") ? "" : (stryCov_9fa48("2875"), 'Start time cannot be in the past'));
        }
      }
      return await contestRepository.adminCreateContest(title, description, startTime, endTime);
    }
  }

  /**
   * Admin: Add question to contest
   */
  async addQuestion(contestId, questionText, options, correctOptionId) {
    if (stryMutAct_9fa48("2876")) {
      {}
    } else {
      stryCov_9fa48("2876");
      // Validate contest exists
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("2879") ? false : stryMutAct_9fa48("2878") ? true : stryMutAct_9fa48("2877") ? contest : (stryCov_9fa48("2877", "2878", "2879"), !contest)) {
        if (stryMutAct_9fa48("2880")) {
          {}
        } else {
          stryCov_9fa48("2880");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Validate contest is in DRAFT status
      if (stryMutAct_9fa48("2883") ? contest.status === 'DRAFT' : stryMutAct_9fa48("2882") ? false : stryMutAct_9fa48("2881") ? true : (stryCov_9fa48("2881", "2882", "2883"), contest.status !== (stryMutAct_9fa48("2884") ? "" : (stryCov_9fa48("2884"), 'DRAFT')))) {
        if (stryMutAct_9fa48("2885")) {
          {}
        } else {
          stryCov_9fa48("2885");
          throw ERRORS.INVALID_INPUT;
        }
      }

      // Validate options
      if (stryMutAct_9fa48("2888") ? !Array.isArray(options) && options.length < 2 : stryMutAct_9fa48("2887") ? false : stryMutAct_9fa48("2886") ? true : (stryCov_9fa48("2886", "2887", "2888"), (stryMutAct_9fa48("2889") ? Array.isArray(options) : (stryCov_9fa48("2889"), !Array.isArray(options))) || (stryMutAct_9fa48("2892") ? options.length >= 2 : stryMutAct_9fa48("2891") ? options.length <= 2 : stryMutAct_9fa48("2890") ? false : (stryCov_9fa48("2890", "2891", "2892"), options.length < 2)))) {
        if (stryMutAct_9fa48("2893")) {
          {}
        } else {
          stryCov_9fa48("2893");
          throw ERRORS.INVALID_INPUT;
        }
      }

      // Validate correct option ID exists in options
      const optionIds = options.map(stryMutAct_9fa48("2894") ? () => undefined : (stryCov_9fa48("2894"), opt => opt.id));
      if (stryMutAct_9fa48("2897") ? false : stryMutAct_9fa48("2896") ? true : stryMutAct_9fa48("2895") ? optionIds.includes(correctOptionId) : (stryCov_9fa48("2895", "2896", "2897"), !optionIds.includes(correctOptionId))) {
        if (stryMutAct_9fa48("2898")) {
          {}
        } else {
          stryCov_9fa48("2898");
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
    if (stryMutAct_9fa48("2899")) {
      {}
    } else {
      stryCov_9fa48("2899");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("2902") ? false : stryMutAct_9fa48("2901") ? true : stryMutAct_9fa48("2900") ? contest : (stryCov_9fa48("2900", "2901", "2902"), !contest)) {
        if (stryMutAct_9fa48("2903")) {
          {}
        } else {
          stryCov_9fa48("2903");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Validate times if provided
      if (stryMutAct_9fa48("2906") ? updates.start_time || updates.end_time : stryMutAct_9fa48("2905") ? false : stryMutAct_9fa48("2904") ? true : (stryCov_9fa48("2904", "2905", "2906"), updates.start_time && updates.end_time)) {
        if (stryMutAct_9fa48("2907")) {
          {}
        } else {
          stryCov_9fa48("2907");
          const start = new Date(updates.start_time);
          const end = new Date(updates.end_time);
          if (stryMutAct_9fa48("2911") ? start < end : stryMutAct_9fa48("2910") ? start > end : stryMutAct_9fa48("2909") ? false : stryMutAct_9fa48("2908") ? true : (stryCov_9fa48("2908", "2909", "2910", "2911"), start >= end)) {
            if (stryMutAct_9fa48("2912")) {
              {}
            } else {
              stryCov_9fa48("2912");
              throw new Error(stryMutAct_9fa48("2913") ? "" : (stryCov_9fa48("2913"), 'End time must be after start time'));
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
    if (stryMutAct_9fa48("2914")) {
      {}
    } else {
      stryCov_9fa48("2914");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("2917") ? false : stryMutAct_9fa48("2916") ? true : stryMutAct_9fa48("2915") ? contest : (stryCov_9fa48("2915", "2916", "2917"), !contest)) {
        if (stryMutAct_9fa48("2918")) {
          {}
        } else {
          stryCov_9fa48("2918");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      if (stryMutAct_9fa48("2921") ? contest.status === 'DRAFT' : stryMutAct_9fa48("2920") ? false : stryMutAct_9fa48("2919") ? true : (stryCov_9fa48("2919", "2920", "2921"), contest.status !== (stryMutAct_9fa48("2922") ? "" : (stryCov_9fa48("2922"), 'DRAFT')))) {
        if (stryMutAct_9fa48("2923")) {
          {}
        } else {
          stryCov_9fa48("2923");
          throw ERRORS.INVALID_INPUT;
        }
      }

      // Check if contest has questions
      const questions = await contestRepository.learnerGetContestQuestions(contestId);
      if (stryMutAct_9fa48("2926") ? questions.length !== 0 : stryMutAct_9fa48("2925") ? false : stryMutAct_9fa48("2924") ? true : (stryCov_9fa48("2924", "2925", "2926"), questions.length === 0)) {
        if (stryMutAct_9fa48("2927")) {
          {}
        } else {
          stryCov_9fa48("2927");
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
    if (stryMutAct_9fa48("2928")) {
      {}
    } else {
      stryCov_9fa48("2928");
      return await contestRepository.adminGetAllContests();
    }
  }

  /**
   * Admin: Get contest details with questions
   */
  async getContestDetails(contestId) {
    if (stryMutAct_9fa48("2929")) {
      {}
    } else {
      stryCov_9fa48("2929");
      const contest = await contestRepository.adminGetContestById(contestId);
      if (stryMutAct_9fa48("2932") ? false : stryMutAct_9fa48("2931") ? true : stryMutAct_9fa48("2930") ? contest : (stryCov_9fa48("2930", "2931", "2932"), !contest)) {
        if (stryMutAct_9fa48("2933")) {
          {}
        } else {
          stryCov_9fa48("2933");
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
    if (stryMutAct_9fa48("2934")) {
      {}
    } else {
      stryCov_9fa48("2934");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("2937") ? false : stryMutAct_9fa48("2936") ? true : stryMutAct_9fa48("2935") ? contest : (stryCov_9fa48("2935", "2936", "2937"), !contest)) {
        if (stryMutAct_9fa48("2938")) {
          {}
        } else {
          stryCov_9fa48("2938");
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
    if (stryMutAct_9fa48("2939")) {
      {}
    } else {
      stryCov_9fa48("2939");
      const contests = await contestRepository.learnerGetAvailableContests(learnerId);

      // Update contest status based on current time
      const now = new Date();
      for (const contest of contests) {
        if (stryMutAct_9fa48("2940")) {
          {}
        } else {
          stryCov_9fa48("2940");
          const startTime = new Date(contest.start_time);
          const endTime = new Date(contest.end_time);
          if (stryMutAct_9fa48("2943") ? contest.status === 'PUBLISHED' && now >= startTime || now < endTime : stryMutAct_9fa48("2942") ? false : stryMutAct_9fa48("2941") ? true : (stryCov_9fa48("2941", "2942", "2943"), (stryMutAct_9fa48("2945") ? contest.status === 'PUBLISHED' || now >= startTime : stryMutAct_9fa48("2944") ? true : (stryCov_9fa48("2944", "2945"), (stryMutAct_9fa48("2947") ? contest.status !== 'PUBLISHED' : stryMutAct_9fa48("2946") ? true : (stryCov_9fa48("2946", "2947"), contest.status === (stryMutAct_9fa48("2948") ? "" : (stryCov_9fa48("2948"), 'PUBLISHED')))) && (stryMutAct_9fa48("2951") ? now < startTime : stryMutAct_9fa48("2950") ? now > startTime : stryMutAct_9fa48("2949") ? true : (stryCov_9fa48("2949", "2950", "2951"), now >= startTime)))) && (stryMutAct_9fa48("2954") ? now >= endTime : stryMutAct_9fa48("2953") ? now <= endTime : stryMutAct_9fa48("2952") ? true : (stryCov_9fa48("2952", "2953", "2954"), now < endTime)))) {
            if (stryMutAct_9fa48("2955")) {
              {}
            } else {
              stryCov_9fa48("2955");
              await contestRepository.updateContestStatus(contest.id, stryMutAct_9fa48("2956") ? "" : (stryCov_9fa48("2956"), 'ACTIVE'));
              contest.status = stryMutAct_9fa48("2957") ? "" : (stryCov_9fa48("2957"), 'ACTIVE');
            }
          } else if (stryMutAct_9fa48("2960") ? contest.status === 'ACTIVE' || now >= endTime : stryMutAct_9fa48("2959") ? false : stryMutAct_9fa48("2958") ? true : (stryCov_9fa48("2958", "2959", "2960"), (stryMutAct_9fa48("2962") ? contest.status !== 'ACTIVE' : stryMutAct_9fa48("2961") ? true : (stryCov_9fa48("2961", "2962"), contest.status === (stryMutAct_9fa48("2963") ? "" : (stryCov_9fa48("2963"), 'ACTIVE')))) && (stryMutAct_9fa48("2966") ? now < endTime : stryMutAct_9fa48("2965") ? now > endTime : stryMutAct_9fa48("2964") ? true : (stryCov_9fa48("2964", "2965", "2966"), now >= endTime)))) {
            if (stryMutAct_9fa48("2967")) {
              {}
            } else {
              stryCov_9fa48("2967");
              await contestRepository.updateContestStatus(contest.id, stryMutAct_9fa48("2968") ? "" : (stryCov_9fa48("2968"), 'ENDED'));
              contest.status = stryMutAct_9fa48("2969") ? "" : (stryCov_9fa48("2969"), 'ENDED');
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
    if (stryMutAct_9fa48("2970")) {
      {}
    } else {
      stryCov_9fa48("2970");
      let contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("2973") ? false : stryMutAct_9fa48("2972") ? true : stryMutAct_9fa48("2971") ? contest : (stryCov_9fa48("2971", "2972", "2973"), !contest)) {
        if (stryMutAct_9fa48("2974")) {
          {}
        } else {
          stryCov_9fa48("2974");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Check if contest is accessible
      const now = new Date();
      const startTime = new Date(contest.start_time);
      const endTime = new Date(contest.end_time);

      // Update status if needed (and refetch so we rely on repository state)
      if (stryMutAct_9fa48("2977") ? contest.status === 'PUBLISHED' && now >= startTime || now < endTime : stryMutAct_9fa48("2976") ? false : stryMutAct_9fa48("2975") ? true : (stryCov_9fa48("2975", "2976", "2977"), (stryMutAct_9fa48("2979") ? contest.status === 'PUBLISHED' || now >= startTime : stryMutAct_9fa48("2978") ? true : (stryCov_9fa48("2978", "2979"), (stryMutAct_9fa48("2981") ? contest.status !== 'PUBLISHED' : stryMutAct_9fa48("2980") ? true : (stryCov_9fa48("2980", "2981"), contest.status === (stryMutAct_9fa48("2982") ? "" : (stryCov_9fa48("2982"), 'PUBLISHED')))) && (stryMutAct_9fa48("2985") ? now < startTime : stryMutAct_9fa48("2984") ? now > startTime : stryMutAct_9fa48("2983") ? true : (stryCov_9fa48("2983", "2984", "2985"), now >= startTime)))) && (stryMutAct_9fa48("2988") ? now >= endTime : stryMutAct_9fa48("2987") ? now <= endTime : stryMutAct_9fa48("2986") ? true : (stryCov_9fa48("2986", "2987", "2988"), now < endTime)))) {
        if (stryMutAct_9fa48("2989")) {
          {}
        } else {
          stryCov_9fa48("2989");
          await contestRepository.updateContestStatus(contestId, stryMutAct_9fa48("2990") ? "" : (stryCov_9fa48("2990"), 'ACTIVE'));
          contest = await contestRepository.getContestById(contestId);
        }
      } else if (stryMutAct_9fa48("2993") ? contest.status === 'ACTIVE' || now >= endTime : stryMutAct_9fa48("2992") ? false : stryMutAct_9fa48("2991") ? true : (stryCov_9fa48("2991", "2992", "2993"), (stryMutAct_9fa48("2995") ? contest.status !== 'ACTIVE' : stryMutAct_9fa48("2994") ? true : (stryCov_9fa48("2994", "2995"), contest.status === (stryMutAct_9fa48("2996") ? "" : (stryCov_9fa48("2996"), 'ACTIVE')))) && (stryMutAct_9fa48("2999") ? now < endTime : stryMutAct_9fa48("2998") ? now > endTime : stryMutAct_9fa48("2997") ? true : (stryCov_9fa48("2997", "2998", "2999"), now >= endTime)))) {
        if (stryMutAct_9fa48("3000")) {
          {}
        } else {
          stryCov_9fa48("3000");
          await contestRepository.updateContestStatus(contestId, stryMutAct_9fa48("3001") ? "" : (stryCov_9fa48("3001"), 'ENDED'));
          contest = await contestRepository.getContestById(contestId);
        }
      }

      // Check if contest is active
      if (stryMutAct_9fa48("3005") ? now >= startTime : stryMutAct_9fa48("3004") ? now <= startTime : stryMutAct_9fa48("3003") ? false : stryMutAct_9fa48("3002") ? true : (stryCov_9fa48("3002", "3003", "3004", "3005"), now < startTime)) {
        if (stryMutAct_9fa48("3006")) {
          {}
        } else {
          stryCov_9fa48("3006");
          throw ERRORS.CONTEST_NOT_ACTIVE;
        }
      }
      if (stryMutAct_9fa48("3010") ? now <= endTime : stryMutAct_9fa48("3009") ? now >= endTime : stryMutAct_9fa48("3008") ? false : stryMutAct_9fa48("3007") ? true : (stryCov_9fa48("3007", "3008", "3009", "3010"), now > endTime)) {
        if (stryMutAct_9fa48("3011")) {
          {}
        } else {
          stryCov_9fa48("3011");
          throw ERRORS.CONTEST_ENDED;
        }
      }
      if (stryMutAct_9fa48("3014") ? contest.status === 'ACTIVE' : stryMutAct_9fa48("3013") ? false : stryMutAct_9fa48("3012") ? true : (stryCov_9fa48("3012", "3013", "3014"), contest.status !== (stryMutAct_9fa48("3015") ? "" : (stryCov_9fa48("3015"), 'ACTIVE')))) {
        if (stryMutAct_9fa48("3016")) {
          {}
        } else {
          stryCov_9fa48("3016");
          throw ERRORS.CONTEST_NOT_ACTIVE;
        }
      }

      // Check if user has already submitted
      const hasSubmitted = await contestRepository.hasUserSubmitted(learnerId, contestId);
      if (stryMutAct_9fa48("3018") ? false : stryMutAct_9fa48("3017") ? true : (stryCov_9fa48("3017", "3018"), hasSubmitted)) {
        if (stryMutAct_9fa48("3019")) {
          {}
        } else {
          stryCov_9fa48("3019");
          throw ERRORS.CONTEST_ALREADY_SUBMITTED;
        }
      }

      // Get questions (without correct answers)
      const questions = await contestRepository.learnerGetContestQuestions(contestId);
      return stryMutAct_9fa48("3020") ? {} : (stryCov_9fa48("3020"), {
        contest: stryMutAct_9fa48("3021") ? {} : (stryCov_9fa48("3021"), {
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
    if (stryMutAct_9fa48("3022")) {
      {}
    } else {
      stryCov_9fa48("3022");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3025") ? false : stryMutAct_9fa48("3024") ? true : stryMutAct_9fa48("3023") ? contest : (stryCov_9fa48("3023", "3024", "3025"), !contest)) {
        if (stryMutAct_9fa48("3026")) {
          {}
        } else {
          stryCov_9fa48("3026");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }

      // Check if contest is still active
      const now = new Date();
      const endTime = new Date(contest.end_time);
      if (stryMutAct_9fa48("3030") ? now <= endTime : stryMutAct_9fa48("3029") ? now >= endTime : stryMutAct_9fa48("3028") ? false : stryMutAct_9fa48("3027") ? true : (stryCov_9fa48("3027", "3028", "3029", "3030"), now > endTime)) {
        if (stryMutAct_9fa48("3031")) {
          {}
        } else {
          stryCov_9fa48("3031");
          throw ERRORS.CONTEST_ENDED;
        }
      }

      // Check if user has already submitted
      const hasSubmitted = await contestRepository.hasUserSubmitted(learnerId, contestId);
      if (stryMutAct_9fa48("3033") ? false : stryMutAct_9fa48("3032") ? true : (stryCov_9fa48("3032", "3033"), hasSubmitted)) {
        if (stryMutAct_9fa48("3034")) {
          {}
        } else {
          stryCov_9fa48("3034");
          throw ERRORS.CONTEST_ALREADY_SUBMITTED;
        }
      }

      // Calculate time taken
      const timeTakenMs = stryMutAct_9fa48("3035") ? Date.now() + startTime : (stryCov_9fa48("3035"), Date.now() - startTime);

      // Get correct answers
      const correctAnswers = await contestRepository.getCorrectAnswers(contestId);
      const correctAnswersMap = {};
      correctAnswers.forEach(qa => {
        if (stryMutAct_9fa48("3036")) {
          {}
        } else {
          stryCov_9fa48("3036");
          correctAnswersMap[qa.id] = qa.correct_option_id;
        }
      });

      // Calculate score and prepare submissions with correctness
      let score = 0;
      const submissionsWithStatus = stryMutAct_9fa48("3037") ? ["Stryker was here"] : (stryCov_9fa48("3037"), []);
      for (const submission of submissions) {
        if (stryMutAct_9fa48("3038")) {
          {}
        } else {
          stryCov_9fa48("3038");
          const isCorrect = stryMutAct_9fa48("3041") ? correctAnswersMap[submission.question_id] !== submission.selected_option_id : stryMutAct_9fa48("3040") ? false : stryMutAct_9fa48("3039") ? true : (stryCov_9fa48("3039", "3040", "3041"), correctAnswersMap[submission.question_id] === submission.selected_option_id);
          if (stryMutAct_9fa48("3043") ? false : stryMutAct_9fa48("3042") ? true : (stryCov_9fa48("3042", "3043"), isCorrect)) {
            if (stryMutAct_9fa48("3044")) {
              {}
            } else {
              stryCov_9fa48("3044");
              stryMutAct_9fa48("3045") ? score-- : (stryCov_9fa48("3045"), score++);
            }
          }
          submissionsWithStatus.push(stryMutAct_9fa48("3046") ? {} : (stryCov_9fa48("3046"), {
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
      return stryMutAct_9fa48("3047") ? {} : (stryCov_9fa48("3047"), {
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
    if (stryMutAct_9fa48("3048")) {
      {}
    } else {
      stryCov_9fa48("3048");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3051") ? false : stryMutAct_9fa48("3050") ? true : stryMutAct_9fa48("3049") ? contest : (stryCov_9fa48("3049", "3050", "3051"), !contest)) {
        if (stryMutAct_9fa48("3052")) {
          {}
        } else {
          stryCov_9fa48("3052");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      const leaderboard = await contestRepository.getLeaderboard(contestId);
      return stryMutAct_9fa48("3053") ? {} : (stryCov_9fa48("3053"), {
        contest: stryMutAct_9fa48("3054") ? {} : (stryCov_9fa48("3054"), {
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
    if (stryMutAct_9fa48("3055")) {
      {}
    } else {
      stryCov_9fa48("3055");
      return await contestRepository.getUserContests(learnerId);
    }
  }

  /**
   * Get user's contest result details
   */
  async getUserContestDetails(learnerId, contestId) {
    if (stryMutAct_9fa48("3056")) {
      {}
    } else {
      stryCov_9fa48("3056");
      const contest = await contestRepository.getContestById(contestId);
      if (stryMutAct_9fa48("3059") ? false : stryMutAct_9fa48("3058") ? true : stryMutAct_9fa48("3057") ? contest : (stryCov_9fa48("3057", "3058", "3059"), !contest)) {
        if (stryMutAct_9fa48("3060")) {
          {}
        } else {
          stryCov_9fa48("3060");
          throw ERRORS.CONTEST_NOT_FOUND;
        }
      }
      const result = await contestRepository.getUserContestResult(learnerId, contestId);
      if (stryMutAct_9fa48("3063") ? false : stryMutAct_9fa48("3062") ? true : stryMutAct_9fa48("3061") ? result : (stryCov_9fa48("3061", "3062", "3063"), !result)) {
        if (stryMutAct_9fa48("3064")) {
          {}
        } else {
          stryCov_9fa48("3064");
          throw ERRORS.NOT_FOUND;
        }
      }
      const submissions = await contestRepository.getUserSubmissions(learnerId, contestId);
      return stryMutAct_9fa48("3065") ? {} : (stryCov_9fa48("3065"), {
        contest: stryMutAct_9fa48("3066") ? {} : (stryCov_9fa48("3066"), {
          id: contest.id,
          title: contest.title,
          description: contest.description,
          status: contest.status
        }),
        result: stryMutAct_9fa48("3067") ? {} : (stryCov_9fa48("3067"), {
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