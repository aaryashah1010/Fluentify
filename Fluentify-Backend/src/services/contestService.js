import contestRepository from '../repositories/contestRepository.js';
import { ERRORS } from '../utils/error.js';

class ContestService {
  /**
   * Admin: Create a new contest
   */
  async createContest(title, description, startTime, endTime) {
    // Validate times
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      throw new Error('End time must be after start time');
    }
    
    if (start < new Date()) {
      throw new Error('Start time cannot be in the past');
    }

    return await contestRepository.adminCreateContest(title, description, startTime, endTime);
  }

  /**
   * Admin: Add question to contest
   */
  async addQuestion(contestId, questionText, options, correctOptionId) {
    // Validate contest exists
    const contest = await contestRepository.getContestById(contestId);
    if (!contest) {
      throw ERRORS.CONTEST_NOT_FOUND;
    }

    // Validate contest is in DRAFT status
    if (contest.status !== 'DRAFT') {
      throw ERRORS.INVALID_INPUT;
    }

    // Validate options
    if (!Array.isArray(options) || options.length < 2) {
      throw ERRORS.INVALID_INPUT;
    }

    // Validate correct option ID exists in options
    const optionIds = options.map(opt => opt.id);
    if (!optionIds.includes(correctOptionId)) {
      throw ERRORS.INVALID_INPUT;
    }

    return await contestRepository.adminAddQuestion(contestId, questionText, options, correctOptionId);
  }

  /**
   * Admin: Update contest details
   */
  async updateContest(contestId, updates) {
    const contest = await contestRepository.getContestById(contestId);
    if (!contest) {
      throw ERRORS.CONTEST_NOT_FOUND;
    }

    // Validate times if provided
    if (updates.start_time && updates.end_time) {
      const start = new Date(updates.start_time);
      const end = new Date(updates.end_time);
      
      if (start >= end) {
        throw new Error('End time must be after start time');
      }
    }

    return await contestRepository.adminUpdateContest(contestId, updates);
  }

  /**
   * Admin: Publish contest
   */
  async publishContest(contestId) {
    const contest = await contestRepository.getContestById(contestId);
    if (!contest) {
      throw ERRORS.CONTEST_NOT_FOUND;
    }

    if (contest.status !== 'DRAFT') {
      throw ERRORS.INVALID_INPUT;
    }

    // Check if contest has questions
    const questions = await contestRepository.learnerGetContestQuestions(contestId);
    if (questions.length === 0) {
      throw ERRORS.INVALID_INPUT;
    }

    return await contestRepository.adminPublishContest(contestId);
  }

  /**
   * Admin: Get all contests
   */
  async getAllContests() {
    return await contestRepository.adminGetAllContests();
  }

  /**
   * Admin: Get contest details with questions
   */
  async getContestDetails(contestId) {
    const contest = await contestRepository.adminGetContestById(contestId);
    if (!contest) {
      throw ERRORS.CONTEST_NOT_FOUND;
    }
    return contest;
  }

  /**
   * Admin: Delete contest
   */
  async deleteContest(contestId) {
    const contest = await contestRepository.getContestById(contestId);
    if (!contest) {
      throw ERRORS.CONTEST_NOT_FOUND;
    }

    return await contestRepository.adminDeleteContest(contestId);
  }

  /**
   * Learner: Get available contests
   */
  async getAvailableContests(learnerId) {
    const contests = await contestRepository.learnerGetAvailableContests(learnerId);
    
    // Update contest status based on current time
    const now = new Date();
    for (const contest of contests) {
      const startTime = new Date(contest.start_time);
      const endTime = new Date(contest.end_time);
      
      if (contest.status === 'PUBLISHED' && now >= startTime && now < endTime) {
        await contestRepository.updateContestStatus(contest.id, 'ACTIVE');
        contest.status = 'ACTIVE';
      } else if (contest.status === 'ACTIVE' && now >= endTime) {
        await contestRepository.updateContestStatus(contest.id, 'ENDED');
        contest.status = 'ENDED';
      }
    }
    
    return contests;
  }

  /**
   * Learner: Get contest for participation
   */
  async getContestForLearner(contestId, learnerId) {
    const contest = await contestRepository.getContestById(contestId);
    if (!contest) {
      throw ERRORS.CONTEST_NOT_FOUND;
    }

    // Check if contest is accessible
    const now = new Date();
    const startTime = new Date(contest.start_time);
    const endTime = new Date(contest.end_time);

    // Update status if needed
    if (contest.status === 'PUBLISHED' && now >= startTime && now < endTime) {
      await contestRepository.updateContestStatus(contestId, 'ACTIVE');
      contest.status = 'ACTIVE';
    } else if (contest.status === 'ACTIVE' && now >= endTime) {
      await contestRepository.updateContestStatus(contestId, 'ENDED');
      contest.status = 'ENDED';
    }

    // Check if contest is active
    if (now < startTime) {
      throw ERRORS.CONTEST_NOT_ACTIVE;
    }

    if (now > endTime) {
      throw ERRORS.CONTEST_ENDED;
    }

    if (contest.status !== 'ACTIVE') {
      throw ERRORS.CONTEST_NOT_ACTIVE;
    }

    // Check if user has already submitted
    const hasSubmitted = await contestRepository.hasUserSubmitted(learnerId, contestId);
    if (hasSubmitted) {
      throw ERRORS.CONTEST_ALREADY_SUBMITTED;
    }

    // Get questions (without correct answers)
    const questions = await contestRepository.learnerGetContestQuestions(contestId);

    return {
      contest: {
        id: contest.id,
        title: contest.title,
        description: contest.description,
        start_time: contest.start_time,
        end_time: contest.end_time,
        reward_points: contest.reward_points
      },
      questions
    };
  }

  /**
   * Learner: Submit contest
   */
  async submitContest(learnerId, contestId, submissions, startTime) {
    const contest = await contestRepository.getContestById(contestId);
    if (!contest) {
      throw ERRORS.CONTEST_NOT_FOUND;
    }

    // Check if contest is still active
    const now = new Date();
    const endTime = new Date(contest.end_time);
    
    if (now > endTime) {
      throw ERRORS.CONTEST_ENDED;
    }

    // Check if user has already submitted
    const hasSubmitted = await contestRepository.hasUserSubmitted(learnerId, contestId);
    if (hasSubmitted) {
      throw ERRORS.CONTEST_ALREADY_SUBMITTED;
    }

    // Calculate time taken
    const timeTakenMs = Date.now() - startTime;

    // Get correct answers
    const correctAnswers = await contestRepository.getCorrectAnswers(contestId);
    const correctAnswersMap = {};
    for (const qa of correctAnswers) {
      correctAnswersMap[qa.id] = qa.correct_option_id;
    }

    // Calculate score and prepare submissions with correctness
    let score = 0;
    const submissionsWithStatus = [];

    for (const submission of submissions) {
      const isCorrect = correctAnswersMap[submission.question_id] === submission.selected_option_id;
      if (isCorrect) {
        score++;
      }
      submissionsWithStatus.push({
        question_id: submission.question_id,
        selected_option_id: submission.selected_option_id,
        is_correct: isCorrect
      });
    }

    // Save score and submissions
    await contestRepository.saveContestScore(learnerId, contestId, score, timeTakenMs);
    await contestRepository.saveContestSubmissions(learnerId, contestId, submissionsWithStatus);

    // Get user's result with rank
    const result = await contestRepository.getUserContestResult(learnerId, contestId);

    return {
      score,
      total_questions: correctAnswers.length,
      time_taken_ms: timeTakenMs,
      rank: result.rank,
      total_participants: result.total_participants
    };
  }

  /**
   * Get leaderboard for a contest
   */
  async getLeaderboard(contestId) {
    const contest = await contestRepository.getContestById(contestId);
    if (!contest) {
      throw ERRORS.CONTEST_NOT_FOUND;
    }

    const leaderboard = await contestRepository.getLeaderboard(contestId);
    
    return {
      contest: {
        id: contest.id,
        title: contest.title,
        description: contest.description,
        status: contest.status,
        start_time: contest.start_time,
        end_time: contest.end_time
      },
      leaderboard
    };
  }

  /**
   * Get user's contest history
   */
  async getUserContestHistory(learnerId) {
    return await contestRepository.getUserContests(learnerId);
  }

  /**
   * Get user's contest result details
   */
  async getUserContestDetails(learnerId, contestId) {
    const contest = await contestRepository.getContestById(contestId);
    if (!contest) {
      throw ERRORS.CONTEST_NOT_FOUND;
    }

    const result = await contestRepository.getUserContestResult(learnerId, contestId);
    if (!result) {
      throw ERRORS.NOT_FOUND;
    }

    const submissions = await contestRepository.getUserSubmissions(learnerId, contestId);

    return {
      contest: {
        id: contest.id,
        title: contest.title,
        description: contest.description,
        status: contest.status
      },
      result: {
        score: result.score,
        time_taken_ms: result.time_taken_ms,
        submitted_at: result.submitted_at,
        rank: result.rank,
        total_participants: result.total_participants
      },
      submissions
    };
  }
}

export default new ContestService();
