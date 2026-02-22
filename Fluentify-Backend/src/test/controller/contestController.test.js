import { jest } from '@jest/globals';

// Mock response helpers
const mockSuccess = jest.fn((data, message) => ({ success: true, data, message }));
const mockCreated = jest.fn((data, message) => ({ success: true, data, message }));
const mockDeleted = jest.fn((message) => ({ success: true, message }));
const mockError = jest.fn((message) => ({ success: false, error: { message } }));
await jest.unstable_mockModule('../../utils/response.js', () => ({
  successResponse: mockSuccess,
  createdResponse: mockCreated,
  deletedResponse: mockDeleted,
  errorResponse: mockError,
}));

// Mock service
const mockContestService = {
  createContest: jest.fn(async (...args) => ({ id: 1, title: args[0] })),
  addQuestion: jest.fn(async () => ({ id: 2, question_text: 'Q' })),
  updateContest: jest.fn(async () => ({ id: 1 })),
  publishContest: jest.fn(async () => ({ id: 1, published: true })),
  getAllContests: jest.fn(async () => [{ id: 1 }]),
  getContestDetails: jest.fn(async () => ({ id: 1 })),
  deleteContest: jest.fn(async () => {}),
  getAvailableContests: jest.fn(async () => [{ id: 1 }]),
  getContestForLearner: jest.fn(async () => ({ id: 1, questions: [] })),
  submitContest: jest.fn(async () => ({ score: 10 })),
  getLeaderboard: jest.fn(async () => [{ id: 9 }]),
  getUserContestHistory: jest.fn(async () => [{ id: 1 }]),
  getUserContestDetails: jest.fn(async () => ({ id: 1, score: 10 }))
};
await jest.unstable_mockModule('../../services/contestService.js', () => ({ default: mockContestService }));

const controller = (await import('../../controllers/contestController.js')).default;

function resMock() {
  return { statusCode: 200, status: jest.fn(function(c){this.statusCode=c;return this;}), json: jest.fn() };
}
const nextMock = () => jest.fn();

describe('contestController', () => {
  beforeEach(() => jest.clearAllMocks());

  it('handleAdminCreateContest 400 on missing fields', async () => {
    const req = { body: { title: '', start_time: '', end_time: '' } };
    const res = resMock(); const next = nextMock();
    await controller.handleAdminCreateContest(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('handleAdminCreateContest error path (next)', async () => {
    const req = { body: { title: 'T', description: 'D', start_time: 's', end_time: 'e' } };
    const res = resMock(); const next = nextMock();
    const err = new Error('create fail');
    mockContestService.createContest.mockRejectedValueOnce(err);
    await controller.handleAdminCreateContest(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('handleAdminAddQuestion error path (next)', async () => {
    const req = { params: { contestId: '1' }, body: { question_text: 'Q', options: [], correct_option_id: 0 } };
    const res = resMock(); const next = nextMock();
    const err = new Error('add fail');
    mockContestService.addQuestion.mockRejectedValueOnce(err);
    await controller.handleAdminAddQuestion(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('handleAdminCreateContest success', async () => {
    const req = { body: { title: 'T', description: 'D', start_time: 's', end_time: 'e' } };
    const res = resMock(); const next = nextMock();
    await controller.handleAdminCreateContest(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('handleAdminAddQuestion 400 on missing fields', async () => {
    const req = { params: { contestId: '1' }, body: { question_text: '', options: null } };
    const res = resMock(); const next = nextMock();
    await controller.handleAdminAddQuestion(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('handleAdminAddQuestion success', async () => {
    const req = { params: { contestId: '1' }, body: { question_text: 'Q', options: [], correct_option_id: 0 } };
    const res = resMock(); const next = nextMock();
    await controller.handleAdminAddQuestion(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('update/publish/list/get/details/delete admin flows', async () => {
    const res = resMock(); const next = nextMock();
    await controller.handleAdminUpdateContest({ params: { contestId: '1' }, body: {} }, res, next);
    expect(res.json).toHaveBeenCalled();
    await controller.handleAdminPublishContest({ params: { contestId: '1' } }, res, next);
    expect(res.json).toHaveBeenCalled();
    await controller.handleAdminGetContests({}, res, next);
    expect(res.json).toHaveBeenCalled();
    await controller.handleAdminGetContestDetails({ params: { contestId: '1' } }, res, next);
    expect(res.json).toHaveBeenCalled();
    await controller.handleAdminDeleteContest({ params: { contestId: '1' } }, res, next);
    expect(res.json).toHaveBeenCalled();
  });

  it('learner flows available/details/submit/leaderboard/history/my-details', async () => {
    const res = resMock(); const next = nextMock();
    await controller.handleGetAvailableContests({ user: { id: 7 } }, res, next);
    expect(res.json).toHaveBeenCalled();

    await controller.handleGetContestDetails({ params: { contestId: '1' }, user: { id: 7 } }, res, next);
    expect(res.json).toHaveBeenCalled();

    // submit validation
    await controller.handleSubmitContest({ params: { contestId: '1' }, body: { submissions: [], start_time: 't' }, user: { id: 7 } }, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    await controller.handleSubmitContest({ params: { contestId: '1' }, body: { submissions: [{}] }, user: { id: 7 } }, res, next);
    expect(res.status).toHaveBeenCalledWith(400);

    await controller.handleSubmitContest({ params: { contestId: '1' }, body: { submissions: [{}], start_time: 't' }, user: { id: 7 } }, res, next);
    expect(res.json).toHaveBeenCalled();

    await controller.handleGetLeaderboard({ params: { contestId: '1' } }, res, next);
    expect(res.json).toHaveBeenCalled();

    await controller.handleGetUserContestHistory({ user: { id: 7 } }, res, next);
    expect(res.json).toHaveBeenCalled();

    await controller.handleGetUserContestDetails({ params: { contestId: '1' }, user: { id: 7 } }, res, next);
    expect(res.json).toHaveBeenCalled();
  });

  it('error paths (catch -> next) for all handlers', async () => {
    const res = resMock(); const next = nextMock();
    const err = new Error('fail');

    mockContestService.updateContest.mockRejectedValueOnce(err);
    await controller.handleAdminUpdateContest({ params: { contestId: '1' }, body: {} }, res, next);
    expect(next).toHaveBeenCalledWith(err);

    mockContestService.publishContest.mockRejectedValueOnce(err);
    await controller.handleAdminPublishContest({ params: { contestId: '1' } }, res, next);
    expect(next).toHaveBeenCalledWith(err);

    mockContestService.getAllContests.mockRejectedValueOnce(err);
    await controller.handleAdminGetContests({}, res, next);
    expect(next).toHaveBeenCalledWith(err);

    mockContestService.getContestDetails.mockRejectedValueOnce(err);
    await controller.handleAdminGetContestDetails({ params: { contestId: '1' } }, res, next);
    expect(next).toHaveBeenCalledWith(err);

    mockContestService.deleteContest.mockRejectedValueOnce(err);
    await controller.handleAdminDeleteContest({ params: { contestId: '1' } }, res, next);
    expect(next).toHaveBeenCalledWith(err);

    mockContestService.getAvailableContests.mockRejectedValueOnce(err);
    await controller.handleGetAvailableContests({ user: { id: 7 } }, res, next);
    expect(next).toHaveBeenCalledWith(err);

    mockContestService.getContestForLearner.mockRejectedValueOnce(err);
    await controller.handleGetContestDetails({ params: { contestId: '1' }, user: { id: 7 } }, res, next);
    expect(next).toHaveBeenCalledWith(err);

    mockContestService.submitContest.mockRejectedValueOnce(err);
    await controller.handleSubmitContest({ params: { contestId: '1' }, body: { submissions: [{}], start_time: 't' }, user: { id: 7 } }, res, next);
    expect(next).toHaveBeenCalledWith(err);

    mockContestService.getLeaderboard.mockRejectedValueOnce(err);
    await controller.handleGetLeaderboard({ params: { contestId: '1' } }, res, next);
    expect(next).toHaveBeenCalledWith(err);

    mockContestService.getUserContestHistory.mockRejectedValueOnce(err);
    await controller.handleGetUserContestHistory({ user: { id: 7 } }, res, next);
    expect(next).toHaveBeenCalledWith(err);

    mockContestService.getUserContestDetails.mockRejectedValueOnce(err);
    await controller.handleGetUserContestDetails({ params: { contestId: '1' }, user: { id: 7 } }, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
