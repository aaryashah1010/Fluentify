// @ts-nocheck
import { jest } from '@jest/globals';

const mockTutorService = {
  validateMessage: jest.fn(),
  getOrCreateSession: jest.fn(),
  generateStreamingResponse: jest.fn(),
  sanitizeResponse: jest.fn((t) => t),
  saveConversation: jest.fn(),
  getUserChatHistory: jest.fn(),
};

await jest.unstable_mockModule('../../services/tutorService.js', () => ({ default: mockTutorService }));
const tutorController = (await import('../../controllers/tutorController.js')).default;

function createRes() {
  const chunks = [];
  const res = {};
  res.headers = {};
  res.setHeader = jest.fn((k, v) => { res.headers[k] = v; });
  res.write = jest.fn((c) => { chunks.push(c); });
  res.end = jest.fn(() => { res.body = chunks.join(''); });
  res.status = jest.fn(() => res);
  res.json = jest.fn((body) => { res.body = body; return res; });
  return res;
}

function createNext() { return jest.fn(); }

function createStream(chunks) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const c of chunks) {
        yield { text: () => c };
      }
    },
  };
}

describe('TutorController.sendMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 for validation errors', async () => {
    const err = new Error('Message is required');
    mockTutorService.validateMessage.mockImplementation(() => { throw err; });
    const req = { body: { message: '', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.sendMessage(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 503 for AI service error', async () => {
    const err = new Error('AI service error');
    mockTutorService.validateMessage.mockImplementation(() => { throw err; });
    const req = { body: { message: 'hi', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.sendMessage(req, res, next);
    expect(res.status).toHaveBeenCalledWith(503);
  });

  it('streams AI response and saves conversation on success', async () => {
    mockTutorService.validateMessage.mockReturnValue('hi');
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 10 });
    mockTutorService.generateStreamingResponse.mockResolvedValueOnce(createStream(['A', 'B']));
    mockTutorService.saveConversation.mockResolvedValueOnce();
    const req = { body: { message: 'hi', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.sendMessage(req, res, next);
    expect(res.body).toContain('AB');
    expect(mockTutorService.saveConversation).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('does not send SESSION_ID prefix when sessionId is provided', async () => {
    mockTutorService.validateMessage.mockReturnValue('hi');
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 10 });
    mockTutorService.generateStreamingResponse.mockResolvedValueOnce(createStream(['X']));
    const req = { body: { message: 'hi', sessionId: 'existing' }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.sendMessage(req, res, next);
    expect(res.body.startsWith('SESSION_ID:')).toBe(false);
  });

  it('skips empty chunks from AI stream', async () => {
    mockTutorService.validateMessage.mockReturnValue('hi');
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 10 });
    mockTutorService.generateStreamingResponse.mockResolvedValueOnce(createStream(['', 'Y']));
    const req = { body: { message: 'hi', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.sendMessage(req, res, next);
    expect(res.body).toContain('Y');
  });

  it('logs error when saveConversation rejects after success', async () => {
    mockTutorService.validateMessage.mockReturnValue('hi');
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 10 });
    mockTutorService.generateStreamingResponse.mockResolvedValueOnce(createStream(['OK']));
    mockTutorService.saveConversation.mockRejectedValueOnce(new Error('db')); // triggers .catch in controller

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const req = { body: { message: 'hi', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();

    await tutorController.sendMessage(req, res, next);
    await new Promise((r) => setImmediate(r));

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('handles AI generation error and still saves conversation', async () => {
    mockTutorService.validateMessage.mockReturnValue('hi');
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 10 });
    mockTutorService.generateStreamingResponse.mockRejectedValueOnce(new Error('gen fail'));
    const req = { body: { message: 'hi', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.sendMessage(req, res, next);
    expect(res.body).toMatch(/trouble responding/);
    expect(mockTutorService.saveConversation).toHaveBeenCalled();
  });

  it('logs error when saving error conversation fails', async () => {
    mockTutorService.validateMessage.mockReturnValue('hi');
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 10 });
    mockTutorService.generateStreamingResponse.mockRejectedValueOnce(new Error('gen fail'));
    mockTutorService.saveConversation.mockRejectedValueOnce(new Error('db')); // error path save rejects

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const req = { body: { message: 'hi', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();

    await tutorController.sendMessage(req, res, next);
    await new Promise((r) => setImmediate(r));

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('falls back to INTERNAL_SERVER_ERROR for other errors', async () => {
    const err = new Error('other');
    mockTutorService.validateMessage.mockImplementation(() => { throw err; });
    const req = { body: { message: 'x', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    // tweak message so it does not match validation or AI patterns
    err.message = 'unexpected';
    await tutorController.sendMessage(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('TutorController.getChatHistory', () => {
  it('returns sessions and handles errors', async () => {
    mockTutorService.getUserChatHistory.mockResolvedValueOnce([{ id: 1 }]);
    const req = { user: { id: 1 }, query: { limit: '5' } };
    const res = createRes();
    const next = createNext();
    await tutorController.getChatHistory(req, res, next);
    expect(res.body.data.sessions).toHaveLength(1);

    // error path
    jest.clearAllMocks();
    const err = new Error('db');
    mockTutorService.getUserChatHistory.mockRejectedValueOnce(err);
    await tutorController.getChatHistory(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('uses default limit when not provided', async () => {
    mockTutorService.getUserChatHistory.mockResolvedValueOnce([]);
    const req = { user: { id: 1 }, query: {} };
    const res = createRes();
    const next = createNext();
    await tutorController.getChatHistory(req, res, next);
    expect(mockTutorService.getUserChatHistory).toHaveBeenCalledWith(1, 10);
  });
});

describe('TutorController.createSession', () => {
  it('creates session and handles errors', async () => {
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 1 });
    const req = { user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.createSession(req, res, next);
    expect(res.body.data.session.id).toBe(1);

    // error path
    jest.clearAllMocks();
    const err = new Error('db');
    mockTutorService.getOrCreateSession.mockRejectedValueOnce(err);
    await tutorController.createSession(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('TutorController.healthCheck', () => {
  it('returns ok and handles catch path', async () => {
    const req = {};
    const res = createRes();
    await tutorController.healthCheck(req, res);
    expect(res.body.success).toBe(true);

    // Force catch path: first json throws, second succeeds
    const res2 = createRes();
    res2.json = jest
      .fn()
      .mockImplementationOnce(() => { throw new Error('fail'); })
      .mockImplementation((body) => { res2.body = body; return res2; });
    await tutorController.healthCheck(req, res2);
    expect(res2.status).toHaveBeenCalledWith(503);
  });
});
