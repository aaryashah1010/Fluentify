// @ts-nocheck
import { jest } from '@jest/globals';

const { RequestError, ERRORS } = await import('../../utils/error.js');

describe('utils/error', () => {
  it('RequestError sets name, code, status', () => {
    const err = new RequestError('msg', 123, 418);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('RequestError');
    expect(err.message).toBe('msg');
    expect(err.code).toBe(123);
    expect(err.statusCode).toBe(418);
  });

  it('ERRORS contain expected instances', () => {
    expect(ERRORS.MISSING_REQUIRED_FIELDS).toBeInstanceOf(RequestError);
    expect(ERRORS.COURSE_NOT_FOUND.statusCode).toBe(404);
    expect(ERRORS.INVALID_CREDENTIALS.code).toBe(20006);
  });

  it('RequestError without captureStackTrace branch', () => {
    const orig = Error.captureStackTrace;
    // simulate environments without captureStackTrace
    // eslint-disable-next-line no-global-assign
    Error.captureStackTrace = undefined;
    const err = new RequestError('x', 1, 400);
    expect(err.name).toBe('RequestError');
    // restore
    Error.captureStackTrace = orig;
  });
});
