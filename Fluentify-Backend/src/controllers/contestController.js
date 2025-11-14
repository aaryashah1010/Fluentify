import contestService from '../services/contestService.js';
import { successResponse, errorResponse, createdResponse, deletedResponse } from '../utils/response.js';

class ContestController {
  /**
   * Admin: Create a new contest
   * POST /api/contests/admin
   */
  async handleAdminCreateContest(req, res, next) {
    try {
      const { title, description, start_time, end_time } = req.body;

      if (!title || !start_time || !end_time) {
        return res.status(400).json(errorResponse('Title, start time, and end time are required'));
      }

      const contest = await contestService.createContest(title, description, start_time, end_time);
      
      return res.status(201).json(createdResponse(contest, 'Contest created successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Add question to contest
   * POST /api/contests/admin/:contestId/questions
   */
  async handleAdminAddQuestion(req, res, next) {
    try {
      const { contestId } = req.params;
      const { question_text, options, correct_option_id } = req.body;

      if (!question_text || !options || correct_option_id === undefined) {
        return res.status(400).json(errorResponse('Question text, options, and correct option ID are required'));
      }

      const question = await contestService.addQuestion(
        parseInt(contestId),
        question_text,
        options,
        correct_option_id
      );
      
      return res.status(201).json(createdResponse(question, 'Question added successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Update contest details
   * PUT /api/contests/admin/:contestId
   */
  async handleAdminUpdateContest(req, res, next) {
    try {
      const { contestId } = req.params;
      const { title, description, start_time, end_time } = req.body;

      const contest = await contestService.updateContest(
        parseInt(contestId),
        { title, description, start_time, end_time }
      );
      
      return res.json(successResponse(contest, 'Contest updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Publish contest
   * PATCH /api/contests/admin/:contestId/publish
   */
  async handleAdminPublishContest(req, res, next) {
    try {
      const { contestId } = req.params;

      const contest = await contestService.publishContest(parseInt(contestId));
      
      return res.json(successResponse(contest, 'Contest published successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Get all contests
   * GET /api/contests/admin
   */
  async handleAdminGetContests(req, res, next) {
    try {
      const contests = await contestService.getAllContests();
      
      return res.json(successResponse(contests, 'Contests retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Get contest details
   * GET /api/contests/admin/:contestId
   */
  async handleAdminGetContestDetails(req, res, next) {
    try {
      const { contestId } = req.params;

      const contest = await contestService.getContestDetails(parseInt(contestId));
      
      return res.json(successResponse(contest, 'Contest details retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Delete contest
   * DELETE /api/contests/admin/:contestId
   */
  async handleAdminDeleteContest(req, res, next) {
    try {
      const { contestId } = req.params;

      await contestService.deleteContest(parseInt(contestId));
      
      return res.json(deletedResponse('Contest deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Learner: Get available contests
   * GET /api/contests
   */
  async handleGetAvailableContests(req, res, next) {
    try {
      const learnerId = req.user.id;
      const contests = await contestService.getAvailableContests(learnerId);
      
      return res.json(successResponse(contests, 'Contests retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Learner: Get contest details for participation
   * GET /api/contests/:contestId
   */
  async handleGetContestDetails(req, res, next) {
    try {
      const { contestId } = req.params;
      const learnerId = req.user.id;

      const contestData = await contestService.getContestForLearner(
        parseInt(contestId),
        learnerId
      );
      
      return res.json(successResponse(contestData, 'Contest details retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Learner: Submit contest
   * POST /api/contests/:contestId/submit
   */
  async handleSubmitContest(req, res, next) {
    try {
      const { contestId } = req.params;
      const { submissions, start_time } = req.body;
      const learnerId = req.user.id;

      if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
        return res.status(400).json(errorResponse('Submissions are required'));
      }

      if (!start_time) {
        return res.status(400).json(errorResponse('Start time is required'));
      }

      const result = await contestService.submitContest(
        learnerId,
        parseInt(contestId),
        submissions,
        start_time
      );
      
      return res.json(successResponse(result, 'Contest submitted successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get leaderboard for a contest
   * GET /api/contests/:contestId/leaderboard
   */
  async handleGetLeaderboard(req, res, next) {
    try {
      const { contestId } = req.params;

      const leaderboard = await contestService.getLeaderboard(parseInt(contestId));
      
      return res.json(successResponse(leaderboard, 'Leaderboard retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Learner: Get contest history
   * GET /api/contests/my-contests
   */
  async handleGetUserContestHistory(req, res, next) {
    try {
      const learnerId = req.user.id;

      const contests = await contestService.getUserContestHistory(learnerId);
      
      return res.json(successResponse(contests, 'Contest history retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Learner: Get user's contest result details
   * GET /api/contests/:contestId/my-result
   */
  async handleGetUserContestDetails(req, res, next) {
    try {
      const { contestId } = req.params;
      const learnerId = req.user.id;

      const details = await contestService.getUserContestDetails(
        learnerId,
        parseInt(contestId)
      );
      
      return res.json(successResponse(details, 'Contest result retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new ContestController();
