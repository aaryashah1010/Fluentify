// @ts-nocheck
import { jest } from '@jest/globals';

// Mocks for services and repositories used by fileUploadController
const mockFileUploadService = {
  validateFileType: jest.fn(),
  getMaxFileSize: jest.fn(),
  uploadFile: jest.fn(),
};

const mockModuleAdminRepository = {
  updateLesson: jest.fn(),
  getCoursesByLanguage: jest.fn(),
};

await jest.unstable_mockModule('../../services/fileUploadService.js', () => ({ default: mockFileUploadService }));
await jest.unstable_mockModule('../../repositories/moduleAdminRepository.js', () => ({ default: mockModuleAdminRepository }));

const controller = (await import('../../controllers/fileUploadController.js')).default;

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

function createReq(overrides = {}) {
  return {
    file: {
      buffer: Buffer.from('test'),
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024,
    },
    body: {
      language: 'en',
      courseNumber: '1',
      unitNumber: '2',
      lessonNumber: '3',
      contentType: 'pdf',
    },
    params: {},
    ...overrides,
  };
}

describe('fileUploadController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper: assert missing fields response
  function expectMissingFieldsResponse(res) {
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.body).toEqual({
      success: false,
      message: 'Missing required fields: language, courseNumber, unitNumber, lessonNumber',
    });
  }

  describe('uploadLessonMedia', () => {
    it('returns 400 when no file is provided', async () => {
      const req = createReq({ file: null });
      const res = createRes();
      const next = createNext();

      await controller.uploadLessonMedia(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({
        success: false,
        message: 'No file uploaded',
      });
      expect(next).not.toHaveBeenCalled();
    });

    // Single-missing-field tests to catch logical operator mutations
    it('returns 400 when courseNumber is missing', async () => {
      const base = createReq();
      const req = { ...base, body: { ...base.body, courseNumber: undefined } };
      const res = createRes(); const next = createNext();
      await controller.uploadLessonMedia(req, res, next);
      expectMissingFieldsResponse(res);
      expect(next).not.toHaveBeenCalled();
    });
    it('returns 400 when unitNumber is missing', async () => {
      const base = createReq();
      const req = { ...base, body: { ...base.body, unitNumber: undefined } };
      const res = createRes(); const next = createNext();
      await controller.uploadLessonMedia(req, res, next);
      expectMissingFieldsResponse(res);
      expect(next).not.toHaveBeenCalled();
    });
    it('returns 400 when lessonNumber is missing', async () => {
      const base = createReq();
      const req = { ...base, body: { ...base.body, lessonNumber: undefined } };
      const res = createRes(); const next = createNext();
      await controller.uploadLessonMedia(req, res, next);
      expectMissingFieldsResponse(res);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 when file type is invalid', async () => {
      mockFileUploadService.validateFileType.mockReturnValueOnce(false);

      const req = createReq();
      const res = createRes();
      const next = createNext();

      await controller.uploadLessonMedia(req, res, next);

      expect(mockFileUploadService.validateFileType).toHaveBeenCalledWith('application/pdf', 'pdf');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({
        success: false,
        message: 'Invalid file type for pdf content',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 when file size exceeds maximum allowed AND message contains correct MB value', async () => {
      mockFileUploadService.validateFileType.mockReturnValueOnce(true);
      mockFileUploadService.getMaxFileSize.mockReturnValueOnce(512); // bytes

      const req = createReq({ file: { buffer: Buffer.from('x'), originalname: 'big.pdf', mimetype: 'application/pdf', size: 1024 } });
      const res = createRes();
      const next = createNext();

      await controller.uploadLessonMedia(req, res, next);

      expect(mockFileUploadService.getMaxFileSize).toHaveBeenCalledWith('pdf');
      expect(res.status).toHaveBeenCalledWith(400);
      // exact formatted MB string check to catch arithmetic mutations
      const expectedMsg = `File size exceeds maximum allowed (${Math.round(512 / 1024 / 1024)}MB)`;
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe(expectedMsg);
      expect(next).not.toHaveBeenCalled();
    });

    it('allows file size exactly equal to maxSize (boundary)', async () => {
      mockFileUploadService.validateFileType.mockReturnValueOnce(true);
      mockFileUploadService.getMaxFileSize.mockReturnValueOnce(1024); // maxSize
      mockFileUploadService.uploadFile.mockResolvedValueOnce({
        url: 'http://example.com/file.pdf',
        message: 'Uploaded successfully',
        manualUploadRequired: true,
      });

      // file.size === maxSize should be accepted (controller uses > not >=)
      const req = createReq({ file: { buffer: Buffer.from('x'), originalname: 'eq.pdf', mimetype: 'application/pdf', size: 1024 } });
      const res = createRes();
      const next = createNext();

      await controller.uploadLessonMedia(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.filename).toBe('eq.pdf');
    });

    it('uploads file successfully and returns 200 with data', async () => {
      mockFileUploadService.validateFileType.mockReturnValueOnce(true);
      mockFileUploadService.getMaxFileSize.mockReturnValueOnce(1024 * 1024);
      mockFileUploadService.uploadFile.mockResolvedValueOnce({
        url: 'http://example.com/file.pdf',
        message: 'Uploaded successfully',
        manualUploadRequired: true,
      });

      const req = createReq();
      const res = createRes();
      const next = createNext();

      await controller.uploadLessonMedia(req, res, next);

      expect(mockFileUploadService.uploadFile).toHaveBeenCalledWith(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        {
          language: 'en',
          courseNumber: 1,
          unitNumber: 2,
          lessonNumber: 3,
        },
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body).toEqual({
        success: true,
        message: 'Uploaded successfully',
        data: {
          url: 'http://example.com/file.pdf',
          filename: 'test.pdf',
          size: 1024,
          mimeType: 'application/pdf',
          manualUploadRequired: true,
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('defaults contentType to pdf and manualUploadRequired to false when omitted', async () => {
      mockFileUploadService.validateFileType.mockReturnValueOnce(true);
      mockFileUploadService.getMaxFileSize.mockReturnValueOnce(1024 * 1024);
      // manualUploadRequired intentionally omitted
      mockFileUploadService.uploadFile.mockResolvedValueOnce({
        url: 'http://example.com/file.pdf',
        message: 'Uploaded successfully',
      });

      const baseReq = createReq();
      const { contentType, ...restBody } = baseReq.body;
      const req = { ...baseReq, body: restBody };
      const res = createRes();
      const next = createNext();

      await controller.uploadLessonMedia(req, res, next);

      expect(mockFileUploadService.validateFileType).toHaveBeenCalledWith('application/pdf', 'pdf');
      expect(mockFileUploadService.getMaxFileSize).toHaveBeenCalledWith('pdf');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body.data.manualUploadRequired).toBe(false);
      expect(next).not.toHaveBeenCalled();
    });

    it('forwards errors via next when upload fails and logs the original error', async () => {
      mockFileUploadService.validateFileType.mockReturnValueOnce(true);
      const err = new Error('upload failed');
      mockFileUploadService.uploadFile.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = createReq();
      const res = createRes();
      const next = createNext();

      await controller.uploadLessonMedia(req, res, next);

      // expect original log message format
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error uploading lesson media:'), err);
      expect(next).toHaveBeenCalledWith(err);
      consoleSpy.mockRestore();
    });
  });

  describe('uploadAndUpdateLesson', () => {
    it('returns 400 when no file is provided', async () => {
      const req = createReq({ file: null, params: { lessonId: '10' } });
      const res = createRes();
      const next = createNext();

      await controller.uploadAndUpdateLesson(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({
        success: false,
        message: 'No file uploaded',
      });
      expect(next).not.toHaveBeenCalled();
    });

    // Single-missing-field tests for uploadAndUpdateLesson as well
    it('returns 400 when courseNumber is missing (uploadAndUpdateLesson)', async () => {
      const base = createReq({ params: { lessonId: '10' } });
      const req = { ...base, body: { ...base.body, courseNumber: undefined } };
      const res = createRes(); const next = createNext();
      await controller.uploadAndUpdateLesson(req, res, next);
      expectMissingFieldsResponse(res);
      expect(next).not.toHaveBeenCalled();
    });
    it('returns 400 when unitNumber is missing (uploadAndUpdateLesson)', async () => {
      const base = createReq({ params: { lessonId: '10' } });
      const req = { ...base, body: { ...base.body, unitNumber: undefined } };
      const res = createRes(); const next = createNext();
      await controller.uploadAndUpdateLesson(req, res, next);
      expectMissingFieldsResponse(res);
      expect(next).not.toHaveBeenCalled();
    });
    it('returns 400 when lessonNumber is missing (uploadAndUpdateLesson)', async () => {
      const base = createReq({ params: { lessonId: '10' } });
      const req = { ...base, body: { ...base.body, lessonNumber: undefined } };
      const res = createRes(); const next = createNext();
      await controller.uploadAndUpdateLesson(req, res, next);
      expectMissingFieldsResponse(res);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 400 when file type is invalid', async () => {
      mockFileUploadService.validateFileType.mockReturnValueOnce(false);

      const req = createReq({ params: { lessonId: '10' } });
      const res = createRes();
      const next = createNext();

      await controller.uploadAndUpdateLesson(req, res, next);

      expect(mockFileUploadService.validateFileType).toHaveBeenCalledWith('application/pdf', 'pdf');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.body).toEqual({
        success: false,
        message: 'Invalid file type for pdf content',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('uploads file, updates lesson and returns 200 with data', async () => {
      mockFileUploadService.validateFileType.mockReturnValueOnce(true);
      mockFileUploadService.uploadFile.mockResolvedValueOnce({
        url: 'http://example.com/media.pdf',
        manualUploadRequired: false,
      });
      const updatedLesson = { id: 10, title: 'Lesson' };
      mockModuleAdminRepository.updateLesson.mockResolvedValueOnce(updatedLesson);

      const req = createReq({ params: { lessonId: '10' } });
      const res = createRes();
      const next = createNext();

      await controller.uploadAndUpdateLesson(req, res, next);

      expect(mockFileUploadService.uploadFile).toHaveBeenCalled();
      expect(mockModuleAdminRepository.updateLesson).toHaveBeenCalledWith('10', {
        media_url: 'http://example.com/media.pdf',
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body).toEqual({
        success: true,
        message: 'Media uploaded and lesson updated successfully',
        data: {
          lesson: updatedLesson,
          media: {
            url: 'http://example.com/media.pdf',
            filename: 'test.pdf',
            size: 1024,
            mimeType: 'application/pdf',
            manualUploadRequired: false,
          },
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('defaults contentType to pdf and manualUploadRequired to false when omitted', async () => {
      mockFileUploadService.validateFileType.mockReturnValueOnce(true);
      mockFileUploadService.uploadFile.mockResolvedValueOnce({
        url: 'http://example.com/media.pdf',
      });
      const updatedLesson = { id: 10, title: 'Lesson' };
      mockModuleAdminRepository.updateLesson.mockResolvedValueOnce(updatedLesson);

      const baseReq = createReq({ params: { lessonId: '10' } });
      const { contentType, ...restBody } = baseReq.body;
      const req = { ...baseReq, body: restBody };
      const res = createRes();
      const next = createNext();

      await controller.uploadAndUpdateLesson(req, res, next);

      expect(mockFileUploadService.validateFileType).toHaveBeenCalledWith('application/pdf', 'pdf');
      expect(mockModuleAdminRepository.updateLesson).toHaveBeenCalledWith('10', {
        media_url: 'http://example.com/media.pdf',
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body.data.media.manualUploadRequired).toBe(false);
      expect(next).not.toHaveBeenCalled();
    });

    it('forwards errors via next when upload fails and logs the original error', async () => {
      mockFileUploadService.validateFileType.mockReturnValueOnce(true);
      const err = new Error('upload error');
      mockFileUploadService.uploadFile.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = createReq({ params: { lessonId: '10' } });
      const res = createRes();
      const next = createNext();

      await controller.uploadAndUpdateLesson(req, res, next);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error uploading and updating lesson:'), err);
      expect(next).toHaveBeenCalledWith(err);
      consoleSpy.mockRestore();
    });

    it('forwards errors via next when updateLesson fails and logs the original error', async () => {
      mockFileUploadService.validateFileType.mockReturnValueOnce(true);
      mockFileUploadService.uploadFile.mockResolvedValueOnce({ url: 'x' });
      const err = new Error('update error');
      mockModuleAdminRepository.updateLesson.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = createReq({ params: { lessonId: '10' } });
      const res = createRes();
      const next = createNext();

      await controller.uploadAndUpdateLesson(req, res, next);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error uploading and updating lesson:'), err);
      expect(next).toHaveBeenCalledWith(err);
      consoleSpy.mockRestore();
    });
  });

  describe('getCourseCountForLanguage', () => {
    it('returns 200 with course count data', async () => {
      mockModuleAdminRepository.getCoursesByLanguage.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);

      const req = { params: { lang: 'en' } };
      const res = createRes();
      const next = createNext();

      await controller.getCourseCountForLanguage(req, res, next);

      expect(mockModuleAdminRepository.getCoursesByLanguage).toHaveBeenCalledWith('en');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.body).toEqual({
        success: true,
        data: {
          language: 'en',
          existingCourses: 2,
          nextCourseNumber: 3,
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('forwards errors via next when repository fails and logs the error', async () => {
      const err = new Error('repo fail');
      mockModuleAdminRepository.getCoursesByLanguage.mockRejectedValueOnce(err);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const req = { params: { lang: 'en' } };
      const res = createRes();
      const next = createNext();

      await controller.getCourseCountForLanguage(req, res, next);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error getting course count:'), err);
      expect(next).toHaveBeenCalledWith(err);
      consoleSpy.mockRestore();
    });
  });
});
