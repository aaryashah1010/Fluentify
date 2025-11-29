import { jest } from '@jest/globals';

// Mock jsonwebtoken
const verifyMock = jest.fn();
await jest.unstable_mockModule('jsonwebtoken', () => ({ default: { verify: verifyMock } }));

const { ERRORS } = await import('../../utils/error.js');
const authMiddlewareModule = await import('../../middlewares/authMiddleware.js');
const authMiddleware = authMiddlewareModule.default;
const { adminOnly } = authMiddlewareModule;

function createReq(headers = {}, user = undefined) {
  return { headers, user };
}

function createRes() {
  const res = {};
  res.statusCode = 200;
  res.headers = {};
  res.status = jest.fn().mockImplementation((code) => { res.statusCode = code; return res; });
  res.json = jest.fn().mockImplementation((body) => { res.body = body; return res; });
  return res;
}

function createNext() {
  return jest.fn();
}

describe('authMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls next with NO_TOKEN_PROVIDED when header missing', () => {
    const req = createReq({});
    const res = createRes();
    const next = createNext();
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(ERRORS.NO_TOKEN_PROVIDED);
  });

  it('maps TokenExpiredError to TOKEN_EXPIRED', () => {
    const req = createReq({ authorization: 'Bearer token' });
    const res = createRes();
    const next = createNext();
    const err = new Error('expired');
    err.name = 'TokenExpiredError';
    verifyMock.mockImplementation((token, secret, cb) => cb(err));

    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(ERRORS.TOKEN_EXPIRED);
  });

  it('maps other verify errors to INVALID_AUTH_TOKEN', () => {
    const req = createReq({ authorization: 'Bearer token' });
    const res = createRes();
    const next = createNext();
    const err = new Error('bad');
    verifyMock.mockImplementation((token, secret, cb) => cb(err));

    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith(ERRORS.INVALID_AUTH_TOKEN);
  });

  it('attaches user and calls next on success', () => {
    const req = createReq({ authorization: 'Bearer token' });
    const res = createRes();
    const next = createNext();
    const user = { id: 1, email: 'u', role: 'learner' };
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    verifyMock.mockImplementation((token, secret, cb) => cb(null, user));

    authMiddleware(req, res, next);
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalledWith();
    expect(logSpy).toHaveBeenCalledWith(
      `🔐 Auth: User ${user.id} (${user.email}) authenticated - Role: ${user.role}`
    );
    logSpy.mockRestore();
  });

  it('extracts bearer token from Authorization header correctly', () => {
    const req = createReq({ authorization: 'Bearer mytoken123' });
    const res = createRes();
    const next = createNext();
    const user = { id: 2, email: 'e@example.com', role: 'admin' };

    verifyMock.mockImplementation((token, secret, cb) => {
      cb(null, user);
    });

    authMiddleware(req, res, next);

    expect(verifyMock).toHaveBeenCalledTimes(1);
    const [tokenArg, secretArg, cb] = verifyMock.mock.calls[0];
    expect(tokenArg).toBe('mytoken123');
    expect(typeof cb).toBe('function');
  });
});

describe('adminOnly', () => {
  it('allows when user role is admin', () => {
    const req = createReq({}, { id: 1, role: 'admin' });
    const res = createRes();
    const next = createNext();
    adminOnly(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('blocks when user missing or non-admin', () => {
    const res = createRes();
    const next = createNext();

    adminOnly(createReq({}, null), res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Forbidden: Admin access required',
    });

    jest.clearAllMocks();
    const req2 = createReq({}, { id: 1, role: 'learner' });
    const res2 = createRes();
    const next2 = createNext();
    adminOnly(req2, res2, next2);
    expect(res2.status).toHaveBeenCalledWith(403);
    expect(res2.json).toHaveBeenCalledWith({
      success: false,
      message: 'Forbidden: Admin access required',
    });
  });
});
