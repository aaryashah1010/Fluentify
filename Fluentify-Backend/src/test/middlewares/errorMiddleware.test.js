import { jest } from '@jest/globals';

const responseUtils = await import('../../utils/response.js');
const { RequestError } = await import('../../utils/error.js');
const { errorHandler, notFoundHandler } = await import('../../middlewares/errorMiddleware.js');

function createRes() {
  const res = {};
  res.statusCode = 200;
  res.status = jest.fn().mockImplementation((code) => { res.statusCode = code; return res; });
  res.json = jest.fn().mockImplementation((body) => { res.body = body; return res; });
  return res;
}

const baseReq = { url: '/x', method: 'GET', body: {}, params: {}, query: {}, path: '/x' };

describe('errorHandler', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('handles RequestError with its status and code', () => {
    const err = new RequestError('msg', 123, 418);
    const req = { ...baseReq };
    const res = createRes();

    errorHandler(err, req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 123, message: 'msg' },
    });

    // Structured logging should include message and request context
    expect(console.error).toHaveBeenCalledTimes(1);
    const [logMessage, meta] = console.error.mock.calls[0];
    expect(logMessage).toBe(`Error occurred: ${err.message}`);
    expect(meta).toEqual(
      expect.objectContaining({
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
        timestamp: expect.any(String),
      }),
    );
  });

  it('maps JsonWebTokenError to 401 Invalid authentication token', () => {
    const err = new Error('jwt');
    err.name = 'JsonWebTokenError';
    const res = createRes();

    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 20002, message: 'Invalid authentication token' },
    });
  });

  it('maps TokenExpiredError to 401 token expired', () => {
    const err = new Error('expired');
    err.name = 'TokenExpiredError';
    const res = createRes();

    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 20003, message: 'Authentication token has expired' },
    });
  });

  it('handles PG error codes 23505,23503,23502,22P02', () => {
    const expectations = {
      '23505': { status: 409, message: 'Duplicate entry detected', code: 10009 },
      '23503': { status: 400, message: 'Referenced record not found', code: 10001 },
      '23502': { status: 400, message: 'Required field is missing', code: 10011 },
      '22P02': { status: 400, message: 'Invalid data format', code: 10002 },
    };

    for (const [code, expected] of Object.entries(expectations)) {
      const err = { message: 'db', code };
      const res = createRes();
      errorHandler(err, baseReq, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(expected.status);
      expect(res.body).toMatchObject({
        success: false,
        error: { code: expected.code, message: expected.message },
      });
    }
  });

  it('handles ValidationError', () => {
    const err = new Error('validation');
    err.name = 'ValidationError';
    const res = createRes();
    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(422);
     expect(res.body).toMatchObject({
       success: false,
       error: { code: 10008, message: 'validation' },
     });
  });

  it('handles JSON SyntaxError body', () => {
    const err = new SyntaxError('bad');
    err.status = 400;
    err.body = {};
    const res = createRes();
    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
     expect(res.body).toMatchObject({
       success: false,
       error: { code: 10012, message: 'Invalid JSON in request body' },
     });
  });

  it('handles generic error, exposing message in non-production', () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const err = new Error('boom');
    const res = createRes();

    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 10005, message: 'boom' },
    });
    process.env.NODE_ENV = oldEnv;
  });

  it('handles generic error, hiding message in production', () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const err = new Error('boom');
    const res = createRes();

    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 10005, message: 'Internal server error' },
    });
    process.env.NODE_ENV = oldEnv;
  });

  it('does not treat non-SyntaxError with body as JSON error', () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    const err = { message: 'plain', status: 400, body: {} };
    const res = createRes();

    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 10005, message: 'plain' },
    });
    process.env.NODE_ENV = oldEnv;
  });

  it('does not treat SyntaxError without 400 status as JSON body error', () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    const err = new SyntaxError('bad');
    err.status = 500;
    err.body = {};
    const res = createRes();

    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.body).toMatchObject({
      success: false,
      error: { code: 10005, message: 'bad' },
    });
    process.env.NODE_ENV = oldEnv;
  });
});

describe('notFoundHandler', () => {
  it('returns 404 with route info', () => {
    const req = { ...baseReq };
    const res = createRes();
    notFoundHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.body).toMatchObject({
      success: false,
      error: {
        code: 10006,
        message: `Route ${req.method} ${req.path} not found`,
      },
    });
  });
});
