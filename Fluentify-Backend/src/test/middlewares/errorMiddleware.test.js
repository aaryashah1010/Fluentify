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
    expect(res.body).toBeDefined();
  });

  it('maps JsonWebTokenError to 401 Invalid authentication token', () => {
    const err = new Error('jwt');
    err.name = 'JsonWebTokenError';
    const res = createRes();

    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('maps TokenExpiredError to 401 token expired', () => {
    const err = new Error('expired');
    err.name = 'TokenExpiredError';
    const res = createRes();

    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('handles PG error codes 23505,23503,23502,22P02', () => {
    const codes = {
      '23505': 409,
      '23503': 400,
      '23502': 400,
      '22P02': 400,
    };
    for (const [code, expected] of Object.entries(codes)) {
      const err = { message: 'db', code };
      const res = createRes();
      errorHandler(err, baseReq, res, jest.fn());
      expect(res.status).toHaveBeenCalledWith(expected);
    }
  });

  it('handles ValidationError', () => {
    const err = new Error('validation');
    err.name = 'ValidationError';
    const res = createRes();
    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(422);
  });

  it('handles JSON SyntaxError body', () => {
    const err = new SyntaxError('bad');
    err.status = 400;
    err.body = {};
    const res = createRes();
    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('handles generic error, exposing message in non-production', () => {
    const oldEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const err = new Error('boom');
    const res = createRes();

    errorHandler(err, baseReq, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.body).toBeDefined();
    process.env.NODE_ENV = oldEnv;
  });
});

describe('notFoundHandler', () => {
  it('returns 404 with route info', () => {
    const req = { ...baseReq };
    const res = createRes();
    notFoundHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.body).toBeDefined();
  });
});
