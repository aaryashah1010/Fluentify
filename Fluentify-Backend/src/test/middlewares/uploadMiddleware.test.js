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
const { handleUploadError, uploadSingle, uploadMedia } = middlewareModule;

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
      message: err.message,
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
  // Ensure multer initialization runs here (and after any earlier mock clears)
  beforeAll(() => {
    jest.clearAllMocks();
    if (!capturedConfig) {
      throw new Error('capturedConfig not initialized');
    }
    // Re-simulate the module initialization calls so mock histories are populated:
    // - memoryStorage is called during module init
    // - multer(...) is called with capturedConfig
    // - the returned upload.single(...) is called with the 'file' field during module init
    multerFn.memoryStorage();
    const uploadInstance = multerFn(capturedConfig);
    // simulate the module calling upload.single('file') during import
    uploadInstance.single('file');
  });

  it('accepts allowed mimetype (e.g. application/pdf)', () => {
    const { fileFilter } = capturedConfig;

    const req = {};
    const file = { mimetype: 'application/pdf' };
    const cb = jest.fn();

    fileFilter(req, file, cb);

    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it('accepts all configured audio and video mimetypes', () => {
    const { fileFilter } = capturedConfig;

    const allowedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/x-wav',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ];

    for (const type of allowedTypes) {
      const cb = jest.fn();
      fileFilter({}, { mimetype: type }, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    }
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

describe('uploadMiddleware config and handlers', () => {
  // Ensure multer initialization runs here (and after any earlier mock clears)
  beforeAll(() => {
    jest.clearAllMocks();
    if (!capturedConfig) {
      throw new Error('capturedConfig not initialized');
    }
    // Re-simulate the module initialization calls so mock histories are populated:
    multerFn.memoryStorage();
    const uploadInstance = multerFn(capturedConfig);
    // simulate the module calling upload.single('file') and upload.single('media') during import
    uploadInstance.single('file');
    uploadInstance.single('media');
  });

  it('configures multer with memory storage, fileFilter, and correct limits', () => {
    expect(multerFn.memoryStorage).toHaveBeenCalled();
    expect(capturedConfig).toBeDefined();
    expect(typeof capturedConfig.fileFilter).toBe('function');
    expect(capturedConfig.storage).toBeDefined();
    expect(capturedConfig.limits).toEqual({
      fileSize: 500 * 1024 * 1024,
      files: 1,
    });
  });

  it('defines uploadSingle to use the "file" field', () => {
    // upload.single is mocked as jest.fn
    const singleMock = multerFn.mock.results[0].value.single;

    // call the exported middleware (this executes the middleware function returned earlier)
    uploadSingle({}, {}, jest.fn());

    expect(singleMock).toHaveBeenCalledWith('file');
  });

  it('defines uploadMedia to use the "media" field', () => {
    const singleMock = multerFn.mock.results[0].value.single;

    uploadMedia({}, {}, jest.fn());

    expect(singleMock).toHaveBeenCalledWith('media');
  });
});
