import { jest } from '@jest/globals';

const mockSuccessResponse = jest.fn((data, message) => ({ success: true, data, message }));
const mockCreatedResponse = jest.fn((data, message) => ({ success: true, data, message }));
const mockDeletedResponse = jest.fn((message) => ({ success: true, message }));
const mockErrorResponse = jest.fn((message) => ({ success: false, error: { message } }));

await jest.unstable_mockModule('../../utils/response.js', () => ({
  successResponse: mockSuccessResponse,
  createdResponse: mockCreatedResponse,
  deletedResponse: mockDeletedResponse,
  errorResponse: mockErrorResponse,
}));

const mockContestService = {
  createContest: jest.fn(),
  addQuestion: jest.fn(),
  updateContest: jest.fn(),
  publishContest: jest.fn(),
  getAllContests: jest.fn(),
  getContestDetails: jest.fn(),
  deleteContest: jest.fn(),
  getAvailableContests: jest.fn(),
  getContestForLearner: jest.fn(),
  submitContest: jest.fn(),
  getLeaderboard: jest.fn(),
  getUserContestHistory: jest.fn(),
  getUserContestDetails: jest.fn(),
};

await jest.unstable_mockModule('../../services/contestService.js', () => ({ default: mockContestService }));

const controller = (await import('../../controllers/contestController.js')).default;

const createRes = () => ({
  statusCode: 200,
  body: undefined,
  status: jest.fn(function (code) {
    this.statusCode = code;
    return this;
  }),
  json: jest.fn(function (payload) {
    this.body = payload;
    return this;
  }),
});

const createNext = () => jest.fn();

const resetServiceDefaults = () => {
  mockContestService.createContest.mockResolvedValue({ id: 1, title: 'Mock Contest' });
  mockContestService.addQuestion.mockResolvedValue({ id: 2, question_text: 'Question' });
  mockContestService.updateContest.mockResolvedValue({ id: 3, title: 'Updated Contest' });
  mockContestService.publishContest.mockResolvedValue({ id: 4, status: 'PUBLISHED' });
  mockContestService.getAllContests.mockResolvedValue([{ id: 5 }]);
  mockContestService.getContestDetails.mockResolvedValue({ id: 6 });
  mockContestService.deleteContest.mockResolvedValue({ deleted: true });
  mockContestService.getAvailableContests.mockResolvedValue([{ id: 7 }]);
  mockContestService.getContestForLearner.mockResolvedValue({ contest: { id: 8 }, questions: [] });
  mockContestService.submitContest.mockResolvedValue({ score: 10 });
  mockContestService.getLeaderboard.mockResolvedValue({ contest: { id: 9 }, leaderboard: [] });
  mockContestService.getUserContestHistory.mockResolvedValue([{ id: 10 }]);
  mockContestService.getUserContestDetails.mockResolvedValue({ contest: { id: 11 }, result: {}, submissions: [] });
};

resetServiceDefaults();

describe('contestController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetServiceDefaults();
  });

  describe('handleAdminCreateContest', () => {
    const baseBody = { title: 'Title', description: 'Desc', start_time: '2025-01-01', end_time: '2025-01-02' };

    it('returns 400 when title missing even if times exist', async () => {
      const req = { body: { ...baseBody, title: undefined } };
      const res = createRes();
      const next = createNext();

      await controller.handleAdminCreateContest(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockErrorResponse).toHaveBeenCalledWith('Title, start time, and end time are required');
      expect(res.body).toEqual({ success: false, error: { message: 'Title, start time, and end time are required' } });
      expect(mockContestService.createContest).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 when start_time missing but other fields provided', async () => {
      const { start_time, ...rest } = baseBody;
      const req = { body: rest };
      const res = createRes();

      await controller.handleAdminCreateContest(req, res, createNext());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockContestService.createContest).not.toHaveBeenCalled();
    });

    it('returns 400 when end_time missing but other fields provided', async () => {
      const { end_time, ...rest } = baseBody;
      const req = { body: rest };
      const res = createRes();

      await controller.handleAdminCreateContest(req, res, createNext());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockContestService.createContest).not.toHaveBeenCalled();
    });

    it('creates contest successfully with exact message', async () => {
      const req = { body: baseBody };
      const res = createRes();
      const next = createNext();

      await controller.handleAdminCreateContest(req, res, next);

      expect(mockContestService.createContest).toHaveBeenCalledWith('Title', 'Desc', '2025-01-01', '2025-01-02');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockCreatedResponse).toHaveBeenCalledWith({ id: 1, title: 'Mock Contest' }, 'Contest created successfully');
      expect(res.body).toEqual({ success: true, data: { id: 1, title: 'Mock Contest' }, message: 'Contest created successfully' });
      expect(next).not.toHaveBeenCalled();
    });

    it('forwards service errors via next', async () => {
      const err = new Error('boom');
      mockContestService.createContest.mockRejectedValueOnce(err);
      const res = createRes();
      const next = createNext();

      await controller.handleAdminCreateContest({ body: baseBody }, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('handleAdminAddQuestion', () => {
    const baseReq = {
      params: { contestId: '9' },
      body: { question_text: 'Q', options: [{ id: 1 }], correct_option_id: 1 },
    };

    it('returns 400 when question_text missing', async () => {
      const req = { ...baseReq, body: { ...baseReq.body, question_text: '' } };
      const res = createRes();

      await controller.handleAdminAddQuestion(req, res, createNext());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockErrorResponse).toHaveBeenCalledWith('Question text, options, and correct option ID are required');
    });

    it('returns 400 when options missing despite question text', async () => {
      const req = { ...baseReq, body: { question_text: 'Q', options: null, correct_option_id: 1 } };
      const res = createRes();

      await controller.handleAdminAddQuestion(req, res, createNext());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockContestService.addQuestion).not.toHaveBeenCalled();
    });

    it('returns 400 when correct_option_id is undefined', async () => {
      const req = { ...baseReq, body: { question_text: 'Q', options: [{ id: 1 }] } };
      const res = createRes();

      await controller.handleAdminAddQuestion(req, res, createNext());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(mockContestService.addQuestion).not.toHaveBeenCalled();
    });

    it('adds question successfully with expected payload', async () => {
      const res = createRes();
      await controller.handleAdminAddQuestion(baseReq, res, createNext());

      expect(mockContestService.addQuestion).toHaveBeenCalledWith(9, 'Q', [{ id: 1 }], 1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.body).toEqual({ success: true, data: { id: 2, question_text: 'Question' }, message: 'Question added successfully' });
    });

    it('passes service errors to next', async () => {
      const err = new Error('add fail');
      mockContestService.addQuestion.mockRejectedValueOnce(err);
      const next = createNext();

      await controller.handleAdminAddQuestion(baseReq, createRes(), next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('handleAdminUpdateContest', () => {
    it('updates contest and returns success message', async () => {
      const req = { params: { contestId: '7' }, body: { title: 'New', description: 'Desc', start_time: 's', end_time: 'e' } };
      const res = createRes();

      await controller.handleAdminUpdateContest(req, res, createNext());

      expect(mockContestService.updateContest).toHaveBeenCalledWith(7, req.body);
      expect(res.body).toEqual({ success: true, data: { id: 3, title: 'Updated Contest' }, message: 'Contest updated successfully' });
    });

    it('forwards update errors', async () => {
      const err = new Error('update fail');
      mockContestService.updateContest.mockRejectedValueOnce(err);
      const next = createNext();

      await controller.handleAdminUpdateContest({ params: { contestId: '7' }, body: {} }, createRes(), next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('handleAdminPublishContest', () => {
    it('publishes contest and returns exact message', async () => {
      const res = createRes();
      await controller.handleAdminPublishContest({ params: { contestId: '3' } }, res, createNext());

      expect(mockContestService.publishContest).toHaveBeenCalledWith(3);
      expect(res.body).toEqual({ success: true, data: { id: 4, status: 'PUBLISHED' }, message: 'Contest published successfully' });
    });

    it('forwards publish errors', async () => {
      const err = new Error('publish fail');
      mockContestService.publishContest.mockRejectedValueOnce(err);
      const next = createNext();

      await controller.handleAdminPublishContest({ params: { contestId: '3' } }, createRes(), next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('handleAdminGetContests', () => {
    it('returns contests with exact message', async () => {
      const res = createRes();
      await controller.handleAdminGetContests({}, res, createNext());

      expect(res.body).toEqual({ success: true, data: [{ id: 5 }], message: 'Contests retrieved successfully' });
    });

    it('forwards errors', async () => {
      const err = new Error('list fail');
      mockContestService.getAllContests.mockRejectedValueOnce(err);
      const next = createNext();

      await controller.handleAdminGetContests({}, createRes(), next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('handleAdminGetContestDetails', () => {
    it('returns contest details message', async () => {
      const res = createRes();
      await controller.handleAdminGetContestDetails({ params: { contestId: '2' } }, res, createNext());

      expect(mockContestService.getContestDetails).toHaveBeenCalledWith(2);
      expect(res.body).toEqual({ success: true, data: { id: 6 }, message: 'Contest details retrieved successfully' });
    });

    it('handles service error', async () => {
      const err = new Error('details fail');
      mockContestService.getContestDetails.mockRejectedValueOnce(err);
      const next = createNext();

      await controller.handleAdminGetContestDetails({ params: { contestId: '2' } }, createRes(), next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('handleAdminDeleteContest', () => {
    it('deletes contest and responds with exact message', async () => {
      const res = createRes();
      await controller.handleAdminDeleteContest({ params: { contestId: '4' } }, res, createNext());

      expect(mockContestService.deleteContest).toHaveBeenCalledWith(4);
      expect(res.body).toEqual({ success: true, message: 'Contest deleted successfully' });
    });

    it('forwards delete errors', async () => {
      const err = new Error('delete fail');
      mockContestService.deleteContest.mockRejectedValueOnce(err);
      const next = createNext();

      await controller.handleAdminDeleteContest({ params: { contestId: '4' } }, createRes(), next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('handleGetAvailableContests', () => {
    it('returns available contests with message', async () => {
      const res = createRes();
      await controller.handleGetAvailableContests({ user: { id: 42 } }, res, createNext());

      expect(mockContestService.getAvailableContests).toHaveBeenCalledWith(42);
      expect(res.body).toEqual({ success: true, data: [{ id: 7 }], message: 'Contests retrieved successfully' });
    });

    it('forwards errors', async () => {
      const err = new Error('available fail');
      mockContestService.getAvailableContests.mockRejectedValueOnce(err);
      const next = createNext();

      await controller.handleGetAvailableContests({ user: { id: 42 } }, createRes(), next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('handleGetContestDetails (learner)', () => {
    it('returns learner contest details with message', async () => {
      const res = createRes();
      await controller.handleGetContestDetails({ params: { contestId: '8' }, user: { id: 15 } }, res, createNext());

      expect(mockContestService.getContestForLearner).toHaveBeenCalledWith(8, 15);
      expect(res.body).toEqual({ success: true, data: { contest: { id: 8 }, questions: [] }, message: 'Contest details retrieved successfully' });
    });

    it('forwards learner detail errors', async () => {
      const err = new Error('learner fail');
      mockContestService.getContestForLearner.mockRejectedValueOnce(err);
      const next = createNext();

      await controller.handleGetContestDetails({ params: { contestId: '8' }, user: { id: 15 } }, createRes(), next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('handleSubmitContest', () => {
    const params = { contestId: '12' };
    const user = { id: 77 };

    it('returns 400 when submissions missing', async () => {
      const res = createRes();
      await controller.handleSubmitContest({ params, body: { start_time: 't' }, user }, res, createNext());
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({ success: false, error: { message: 'Submissions are required' } });
    });

    it('returns 400 when submissions empty array', async () => {
      const res = createRes();
      await controller.handleSubmitContest({ params, body: { submissions: [], start_time: 't' }, user }, res, createNext());
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 400 when submissions not array', async () => {
      const res = createRes();
      await controller.handleSubmitContest({ params, body: { submissions: 'oops', start_time: 't' }, user }, res, createNext());
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 400 when start_time missing', async () => {
      const res = createRes();
      await controller.handleSubmitContest({ params, body: { submissions: [{}] }, user }, res, createNext());
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({ success: false, error: { message: 'Start time is required' } });
    });

    it('submits contest successfully with exact message', async () => {
      const body = { submissions: [{ question_id: 1, selected_option_id: 2 }], start_time: '123' };
      const res = createRes();

      await controller.handleSubmitContest({ params, body, user }, res, createNext());

      expect(mockContestService.submitContest).toHaveBeenCalledWith(77, 12, body.submissions, '123');
      expect(res.body).toEqual({ success: true, data: { score: 10 }, message: 'Contest submitted successfully' });
    });

    it('forwards submit errors', async () => {
      const err = new Error('submit fail');
      mockContestService.submitContest.mockRejectedValueOnce(err);
      const next = createNext();

      await controller.handleSubmitContest({ params, body: { submissions: [{}], start_time: 't' }, user }, createRes(), next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('handleGetLeaderboard', () => {
    it('returns leaderboard with message', async () => {
      const res = createRes();
      await controller.handleGetLeaderboard({ params: { contestId: '13' } }, res, createNext());

      expect(mockContestService.getLeaderboard).toHaveBeenCalledWith(13);
      expect(res.body).toEqual({ success: true, data: { contest: { id: 9 }, leaderboard: [] }, message: 'Leaderboard retrieved successfully' });
    });

    it('forwards leaderboard errors', async () => {
      const err = new Error('leaderboard fail');
      mockContestService.getLeaderboard.mockRejectedValueOnce(err);

      const next = createNext();
      await controller.handleGetLeaderboard({ params: { contestId: '13' } }, createRes(), next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('handleGetUserContestHistory', () => {
    it('returns history with message', async () => {
      const res = createRes();
      await controller.handleGetUserContestHistory({ user: { id: 31 } }, res, createNext());
      expect(mockContestService.getUserContestHistory).toHaveBeenCalledWith(31);
      expect(res.body).toEqual({ success: true, data: [{ id: 10 }], message: 'Contest history retrieved successfully' });
    });

    it('forwards history errors', async () => {
      const err = new Error('history fail');
      mockContestService.getUserContestHistory.mockRejectedValueOnce(err);
      const next = createNext();

      await controller.handleGetUserContestHistory({ user: { id: 31 } }, createRes(), next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('handleGetUserContestDetails', () => {
    it('returns user contest details with message', async () => {
      const res = createRes();
      await controller.handleGetUserContestDetails({ params: { contestId: '17' }, user: { id: 3 } }, res, createNext());
      expect(mockContestService.getUserContestDetails).toHaveBeenCalledWith(3, 17);
      expect(res.body).toEqual({ success: true, data: { contest: { id: 11 }, result: {}, submissions: [] }, message: 'Contest result retrieved successfully' });
    });

    it('forwards detail errors', async () => {
      const err = new Error('user details fail');
      mockContestService.getUserContestDetails.mockRejectedValueOnce(err);
      const next = createNext();

      await controller.handleGetUserContestDetails({ params: { contestId: '17' }, user: { id: 3 } }, createRes(), next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
