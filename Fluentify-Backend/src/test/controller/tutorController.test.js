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
const { ERRORS } = await import('../../utils/error.js');
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

const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

const flushAsyncTasks = () => new Promise((resolve) => setImmediate(resolve));

const resetTutorServiceMocks = () => {
  Object.values(mockTutorService).forEach((mockFn) => {
    mockFn.mockReset();
  });
};

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
    resetTutorServiceMocks();
    consoleErrorSpy.mockClear();
    mockTutorService.sanitizeResponse.mockImplementation((t) => t);
    mockTutorService.saveConversation.mockResolvedValue(undefined);
  });

  it('returns 400 for validation errors with exact payload', async () => {
    const err = new Error('Message is required');
    mockTutorService.validateMessage.mockImplementation(() => { throw err; });
    const req = { body: { message: '', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.sendMessage(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body).toEqual({ success: false, error: 'validation_error', message: 'Message is required' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Chat controller error:', err);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 503 for AI service error with exact body', async () => {
    const err = new Error('AI service error');
    mockTutorService.validateMessage.mockImplementation(() => { throw err; });
    const req = { body: { message: 'hi', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.sendMessage(req, res, next);
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.body).toEqual({ success: false, error: 'ai_failure', message: 'Our AI tutor is temporarily unavailable.' });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Chat controller error:', err);
  });

  it('streams AI response, sets headers, writes session ID and full response, and saves conversation', async () => {
    mockTutorService.validateMessage.mockReturnValue('hi');
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 10 });
    mockTutorService.generateStreamingResponse.mockResolvedValueOnce(createStream(['A', 'B']));
    mockTutorService.saveConversation.mockResolvedValueOnce();
    const req = { body: { message: 'hi', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.sendMessage(req, res, next);
    expect(res.headers).toEqual({
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    expect(res.write).toHaveBeenNthCalledWith(1, 'SESSION_ID:10\n');
    expect(res.body).toBe('SESSION_ID:10\nAB');
    expect(mockTutorService.saveConversation).toHaveBeenCalledWith(10, 1, 'hi', 'AB');
    expect(next).not.toHaveBeenCalled();
  });

  it('does not send SESSION_ID prefix when sessionId is provided and still streams chunks', async () => {
    mockTutorService.validateMessage.mockReturnValue('hi');
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 10 });
    mockTutorService.generateStreamingResponse.mockResolvedValueOnce(createStream(['X']));
    const req = { body: { message: 'hi', sessionId: 'existing' }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.sendMessage(req, res, next);
    expect(res.write).not.toHaveBeenCalledWith(expect.stringMatching(/^SESSION_ID:/));
    expect(res.body).toBe('X');
  });

  it('skips empty chunks from AI stream', async () => {
    mockTutorService.validateMessage.mockReturnValue('hi');
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 10 });
    mockTutorService.generateStreamingResponse.mockResolvedValueOnce(createStream(['', 'Y']));
    const req = { body: { message: 'hi', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.sendMessage(req, res, next);
    expect(res.body).toContain('SESSION_ID:10\nY');
    const writePayloads = res.write.mock.calls.map(([payload]) => payload);
    expect(writePayloads).not.toContain('');
  });

  it('logs error when saveConversation rejects after success', async () => {
    mockTutorService.validateMessage.mockReturnValue('hi');
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 10 });
    mockTutorService.generateStreamingResponse.mockResolvedValueOnce(createStream(['OK']));
    mockTutorService.saveConversation.mockRejectedValueOnce(new Error('db')); // triggers .catch in controller
    const req = { body: { message: 'hi', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();

    await tutorController.sendMessage(req, res, next);
    await flushAsyncTasks();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save conversation:', expect.any(Error));
  });

  it('handles AI generation error and still saves conversation', async () => {
    mockTutorService.validateMessage.mockReturnValue('hi');
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 10 });
    mockTutorService.generateStreamingResponse.mockRejectedValueOnce(new Error('gen fail'));
    const req = { body: { message: 'hi', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.sendMessage(req, res, next);
    const expectedErrorMessage = "I apologize, but I'm having trouble responding right now. Please try again in a moment.";
    expect(res.body).toBe(`SESSION_ID:10\n${expectedErrorMessage}`);
    expect(mockTutorService.saveConversation).toHaveBeenCalledWith(10, 1, 'hi', expectedErrorMessage);
    expect(consoleErrorSpy).toHaveBeenCalledWith('AI generation error:', expect.any(Error));
  });

  it('logs error when saving error conversation fails', async () => {
    mockTutorService.validateMessage.mockReturnValue('hi');
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 10 });
    mockTutorService.generateStreamingResponse.mockRejectedValueOnce(new Error('gen fail'));
    mockTutorService.saveConversation.mockRejectedValueOnce(new Error('db')); // error path save rejects

    const req = { body: { message: 'hi', sessionId: null }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();

    await tutorController.sendMessage(req, res, next);
    await flushAsyncTasks();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save error conversation:', expect.any(Error));
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
    expect(consoleErrorSpy).toHaveBeenCalledWith('Chat controller error:', err);
    expect(next).toHaveBeenCalledWith(ERRORS.INTERNAL_SERVER_ERROR);
  });
});

describe('TutorController.getChatHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetTutorServiceMocks();
    consoleErrorSpy.mockClear();
  });

  it('returns sessions with exact payload and respects parsed limit', async () => {
    mockTutorService.getUserChatHistory.mockResolvedValueOnce([{ id: 1 }]);
    const req = { user: { id: 1 }, query: { limit: '5' } };
    const res = createRes();
    const next = createNext();
    await tutorController.getChatHistory(req, res, next);
    expect(mockTutorService.getUserChatHistory).toHaveBeenCalledWith(1, 5);
    expect(res.body).toEqual({ success: true, data: { sessions: [{ id: 1 }] } });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('logs error and forwards when getChatHistory repository fails', async () => {
    const err = new Error('db');
    mockTutorService.getUserChatHistory.mockRejectedValueOnce(err);
    const req = { user: { id: 2 }, query: { limit: '7' } };
    const res = createRes();
    const next = createNext();
    await tutorController.getChatHistory(req, res, next);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching chat history:', err);
    expect(next).toHaveBeenCalledWith(ERRORS.INTERNAL_SERVER_ERROR);
  });

  it('uses default limit when not provided', async () => {
    mockTutorService.getUserChatHistory.mockResolvedValueOnce([]);
    const req = { user: { id: 1 }, query: {} };
    const res = createRes();
    const next = createNext();
    await tutorController.getChatHistory(req, res, next);
    expect(mockTutorService.getUserChatHistory).toHaveBeenCalledWith(1, 10);
    expect(res.body).toEqual({ success: true, data: { sessions: [] } });
  });
});

describe('TutorController.createSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetTutorServiceMocks();
    consoleErrorSpy.mockClear();
  });

  it('creates session successfully', async () => {
    mockTutorService.getOrCreateSession.mockResolvedValueOnce({ id: 1 });
    const req = { user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await tutorController.createSession(req, res, next);
    expect(res.body).toEqual({ success: true, data: { session: { id: 1 } } });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('logs error and forwards when createSession fails', async () => {
    const err = new Error('db');
    mockTutorService.getOrCreateSession.mockRejectedValueOnce(err);
    const req = { user: { id: 3 } };
    const res = createRes();
    const next = createNext();
    await tutorController.createSession(req, res, next);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating chat session:', err);
    expect(next).toHaveBeenCalledWith(ERRORS.INTERNAL_SERVER_ERROR);
  });
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

describe('TutorController.healthCheck', () => {
  it('returns ok and handles catch path with exact bodies', async () => {
    const req = {};
    const res = createRes();
    await tutorController.healthCheck(req, res);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('AI Tutor service is operational');
    expect(typeof res.body.timestamp).toBe('string');

    const res2 = createRes();
    res2.json = jest
      .fn()
      .mockImplementationOnce(() => { throw new Error('fail'); })
      .mockImplementation(function (body) { this.body = body; return this; });
    await tutorController.healthCheck(req, res2);
    expect(res2.status).toHaveBeenCalledWith(503);
    expect(res2.body).toEqual({
      success: false,
      error: 'service_unavailable',
      message: 'AI Tutor service is currently unavailable',
    });
  });
});
