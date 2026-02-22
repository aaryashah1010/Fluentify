import { jest } from '@jest/globals';

// Minimal mock for multer so uploadMiddleware module can be loaded
class MockMulterError extends Error {
  constructor(code, message) {
    super(message || code);
    this.name = 'MulterError';
    this.code = code;
  }
}

let capturedConfig;

const multerFn = jest.fn((config) => {
  capturedConfig = config;
  return {
    single: jest.fn(() => (req, res, next) => next()),
  };
});

multerFn.memoryStorage = jest.fn(() => ({}));
multerFn.MulterError = MockMulterError;

await jest.unstable_mockModule('multer', () => ({ default: multerFn }));

const middlewareModule = await import('../../middlewares/uploadMiddleware.js');
const { handleUploadError } = middlewareModule;

function createRes() {
  const res = {};
  res.statusCode = 200;
  res.body = undefined;
  res.status = jest.fn().mockImplementation((code) => { res.statusCode = code; return res; });
  res.json = jest.fn().mockImplementation((payload) => { res.body = payload; return res; });
  return res;
}

function createNext() {
  return jest.fn();
}

describe('uploadMiddleware handleUploadError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 with specific message when MulterError LIMIT_FILE_SIZE', () => {
    const err = new MockMulterError('LIMIT_FILE_SIZE');
    const req = {};
    const res = createRes();
    const next = createNext();

    handleUploadError(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body).toEqual({
      success: false,
      message: 'File size exceeds the maximum allowed limit',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 with generic upload error for other MulterError codes', () => {
    const err = new MockMulterError('OTHER_CODE', 'some upload issue');
    const req = {};
    const res = createRes();
    const next = createNext();

    handleUploadError(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body).toEqual({
      success: false,
      message: 'Upload error: some upload issue',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 with raw error message for non-multer errors', () => {
    const err = new Error('not allowed');
    const req = {};
    const res = createRes();
    const next = createNext();

    handleUploadError(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body).toEqual({
      success: false,
      message: 'not allowed',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next with no arguments when there is no error', () => {
    const req = {};
    const res = createRes();
    const next = createNext();

    handleUploadError(null, req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });
});

describe('uploadMiddleware fileFilter', () => {
  it('accepts allowed mimetype (e.g. application/pdf)', () => {
    const { fileFilter } = capturedConfig;

    const req = {};
    const file = { mimetype: 'application/pdf' };
    const cb = jest.fn();

    fileFilter(req, file, cb);

    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it('rejects disallowed mimetype and returns descriptive error', () => {
    const { fileFilter } = capturedConfig;

    const req = {};
    const file = { mimetype: 'image/png' };
    const cb = jest.fn();

    fileFilter(req, file, cb);

    expect(cb).toHaveBeenCalled();
    const [err, allowed] = cb.mock.calls[0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toContain('File type image/png is not allowed');
    expect(allowed).toBe(false);
  });
});
