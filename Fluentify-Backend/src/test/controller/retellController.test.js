import { jest } from '@jest/globals';

const postMock = jest.fn();
await jest.unstable_mockModule('axios', () => ({ default: { post: postMock } }));

const responseUtils = await import('../../utils/response.js');
const { createdResponse } = responseUtils;
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

describe('retellController.createRetellCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when agentId missing', async () => {
    const req = { body: {}, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await createRetellCall(req, res, next);
    expect(next).toHaveBeenCalledWith(ERRORS.RETELL_AGENT_ID_REQUIRED);
  });

  it('throws when RETELL_API_KEY not configured', async () => {
    delete process.env.RETELL_API_KEY;
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await createRetellCall(req, res, next);
    expect(next).toHaveBeenCalledWith(ERRORS.RETELL_API_NOT_CONFIGURED);
  });

  it('creates call and returns createdResponse', async () => {
    process.env.RETELL_API_KEY = 'key';
    postMock.mockResolvedValueOnce({ data: { access_token: 't', call_id: 'c', agent_id: 'a' } });
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await createRetellCall(req, res, next);
    expect(postMock).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  function makeError(status, message = 'err') {
    return {
      response: {
        status,
        data: { message },
      },
    };
  }

  it('maps 401/403 to RETELL_AUTHENTICATION_FAILED', async () => {
    process.env.RETELL_API_KEY = 'key';
    postMock.mockRejectedValueOnce(makeError(401));
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await createRetellCall(req, res, next);
    expect(next).toHaveBeenCalledWith(ERRORS.RETELL_AUTHENTICATION_FAILED);
  });

  it('maps 429 to RETELL_RATE_LIMIT', async () => {
    process.env.RETELL_API_KEY = 'key';
    postMock.mockRejectedValueOnce(makeError(429));
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await createRetellCall(req, res, next);
    expect(next).toHaveBeenCalledWith(ERRORS.RETELL_RATE_LIMIT);
  });

  it('maps 400 agent error to RETELL_INVALID_AGENT', async () => {
    process.env.RETELL_API_KEY = 'key';
    postMock.mockRejectedValueOnce(makeError(400, 'agent not found'));
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await createRetellCall(req, res, next);
    expect(next).toHaveBeenCalledWith(ERRORS.RETELL_INVALID_AGENT);
  });

  it('maps other Retell errors to generic error with status and code', async () => {
    process.env.RETELL_API_KEY = 'key';
    postMock.mockRejectedValueOnce(makeError(500, 'oops'));
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await createRetellCall(req, res, next);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(500);
  });

  it('passes non-response errors to next', async () => {
    process.env.RETELL_API_KEY = 'key';
    const networkError = new Error('net');
    postMock.mockRejectedValueOnce(networkError);
    const req = { body: { agentId: 'a' }, user: { id: 1 } };
    const res = createRes();
    const next = createNext();
    await createRetellCall(req, res, next);
    expect(next).toHaveBeenCalledWith(networkError);
  });
});
