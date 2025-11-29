import { jest } from '@jest/globals';

const postMock = jest.fn();
const createdResponseMock = jest.fn((data, message) => ({ success: true, data, message }));
const successResponseMock = jest.fn((data, message) => ({ success: true, data, message }));

await jest.unstable_mockModule('axios', () => ({ default: { post: postMock } }));
await jest.unstable_mockModule('../../utils/response.js', () => ({ createdResponse: createdResponseMock, successResponse: successResponseMock }));

const { ERRORS } = await import('../../utils/error.js');
const { createRetellCall } = await import('../../controllers/retellController.js');

function createRes() {
  const res = {};
  res.statusCode = 200;
  res.body = undefined;
  res.status = jest.fn().mockImplementation((code) => { res.statusCode = code; return res; });
  res.json = jest.fn().mockImplementation((payload) => { res.body = payload; return res; });
  return res;
}

function createNext() { return jest.fn(); }

const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

function makeError(status, data = { message: 'err' }) {
  const normalizedData = typeof data === 'string' ? { message: data } : data;
  return {
    response: {
      status,
      data: normalizedData,
    },
  };
}

describe('retellController.createRetellCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.RETELL_API_KEY;
    jest.useRealTimers();
  });

  afterAll(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('throws when agentId missing and logs creation attempt', async () => {
    const req = { body: {}, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await createRetellCall(req, res, next);
    expect(logSpy).toHaveBeenCalledWith('📞 Creating Retell AI call...');
    expect(next).toHaveBeenCalledWith(ERRORS.RETELL_AGENT_ID_REQUIRED);
  });

  it('throws when RETELL_API_KEY not configured and logs config error', async () => {
    const req = { body: { agentId: 'agent' }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();

    await createRetellCall(req, res, next);

    expect(errorSpy).toHaveBeenCalledWith('❌ RETELL_API_KEY not configured in environment variables');
    expect(next).toHaveBeenCalledWith(ERRORS.RETELL_API_NOT_CONFIGURED);
  });

  it('logs creation lifecycle, sends metadata and headers, and returns createdResponse payload', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-05-06T12:00:00Z'));
    process.env.RETELL_API_KEY = 'secret';
    postMock.mockResolvedValueOnce({ data: { access_token: 'token-123', call_id: 'call-456', agent_id: 'agent-remote' } });

    const req = { body: { agentId: 'agent-local' }, user: { id: 99 } };
    const res = createRes();
    const next = createNext();

    await createRetellCall(req, res, next);

    const expectedIso = new Date('2025-05-06T12:00:00Z').toISOString();
    expect(postMock).toHaveBeenCalledWith(
      'https://api.retellai.com/v2/create-web-call',
      {
        agent_id: 'agent-local',
        metadata: {
          user_id: 99,
          created_at: expectedIso,
        },
      },
      {
        headers: {
          Authorization: 'Bearer secret',
          'Content-Type': 'application/json',
        },
      }
    );

    expect(logSpy).toHaveBeenNthCalledWith(1, '📞 Creating Retell AI call...');
    expect(logSpy).toHaveBeenNthCalledWith(2, '✅ Retell call created successfully');

    const expectedData = {
      accessToken: 'token-123',
      callId: 'call-456',
      agentId: 'agent-remote',
    };
    expect(createdResponseMock).toHaveBeenCalledWith(expectedData, 'Call session created successfully! You can now start your pronunciation practice.');
    expect(res.json).toHaveBeenCalledWith({ success: true, data: expectedData, message: 'Call session created successfully! You can now start your pronunciation practice.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('logs error payload and maps 401 to authentication error', async () => {
    process.env.RETELL_API_KEY = 'key';
    const errorPayload = { message: 'invalid token', reason: 'bad auth' };
    postMock.mockRejectedValueOnce(makeError(401, errorPayload));

    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const next = createNext();
    await createRetellCall(req, createRes(), next);

    expect(errorSpy).toHaveBeenCalledWith('❌ Error creating Retell call:', errorPayload);
    expect(next).toHaveBeenCalledWith(ERRORS.RETELL_AUTHENTICATION_FAILED);
  });

  it('maps 403 to RETELL_AUTHENTICATION_FAILED', async () => {
    process.env.RETELL_API_KEY = 'key';
    postMock.mockRejectedValueOnce(makeError(403));
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const next = createNext();
    await createRetellCall(req, createRes(), next);
    expect(next).toHaveBeenCalledWith(ERRORS.RETELL_AUTHENTICATION_FAILED);
  });

  it('maps 429 to RETELL_RATE_LIMIT', async () => {
    process.env.RETELL_API_KEY = 'key';
    postMock.mockRejectedValueOnce(makeError(429));
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const next = createNext();
    await createRetellCall(req, createRes(), next);
    expect(next).toHaveBeenCalledWith(ERRORS.RETELL_RATE_LIMIT);
  });

  it('maps 400 agent error to RETELL_INVALID_AGENT only when message mentions agent', async () => {
    process.env.RETELL_API_KEY = 'key';
    postMock.mockRejectedValueOnce(makeError(400, 'agent not found'));
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const next = createNext();
    await createRetellCall(req, createRes(), next);
    expect(next).toHaveBeenCalledWith(ERRORS.RETELL_INVALID_AGENT);
  });

  it('does not treat 400 without agent keyword as RETELL_INVALID_AGENT', async () => {
    process.env.RETELL_API_KEY = 'key';
    postMock.mockRejectedValueOnce(makeError(400, 'other error'));
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const next = createNext();
    await createRetellCall(req, createRes(), next);

    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('other error');
    expect(err.code).toBe(ERRORS.RETELL_API_ERROR.code);
    expect(err.statusCode).toBe(400);
  });

  it('does not treat non-400 agent message as invalid agent', async () => {
    process.env.RETELL_API_KEY = 'key';
    postMock.mockRejectedValueOnce(makeError(500, 'agent misconfigured elsewhere'));
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const next = createNext();
    await createRetellCall(req, createRes(), next);

    const err = next.mock.calls[0][0];
    expect(err.code).toBe(ERRORS.RETELL_API_ERROR.code);
    expect(err.statusCode).toBe(500);
  });

  it('falls back to generic message when Retell error lacks message and optional chaining prevents crashes', async () => {
    process.env.RETELL_API_KEY = 'key';
    postMock.mockRejectedValueOnce(makeError(400, {}));
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const next = createNext();
    await createRetellCall(req, createRes(), next);

    const err = next.mock.calls[0][0];
    expect(err.message).toBe(ERRORS.RETELL_CALL_CREATION_FAILED.message);
    expect(err.code).toBe(ERRORS.RETELL_API_ERROR.code);
    expect(err.statusCode).toBe(400);
  });

  it('logs error message string and passes network errors to next', async () => {
    process.env.RETELL_API_KEY = 'key';
    const networkError = new Error('net');
    postMock.mockRejectedValueOnce(networkError);
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const next = createNext();
    await createRetellCall(req, createRes(), next);

    expect(errorSpy).toHaveBeenCalledWith('❌ Error creating Retell call:', 'net');
    expect(next).toHaveBeenCalledWith(networkError);
  });
});
