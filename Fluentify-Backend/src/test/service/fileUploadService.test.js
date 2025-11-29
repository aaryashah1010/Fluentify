import { jest } from '@jest/globals';

// Mock axios and form-data for HTTP upload behaviour
const mockPost = jest.fn();

await jest.unstable_mockModule('axios', () => ({
  default: {
    post: mockPost,
  },
}));

class MockFormData {
  constructor() {
    this.fields = [];
  }
  append(name, value, options) {
    this.fields.push({ name, value, options });
  }
  getHeaders() {
    return { 'x-mock-header': 'formdata' };
  }
}

await jest.unstable_mockModule('form-data', () => ({ default: MockFormData }));

const fileUploadService = (await import('../../services/fileUploadService.js')).default;

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

function createBasicPathInfo() {
  return {
    language: 'Hindi',
    courseNumber: 1,
    unitNumber: 2,
    lessonNumber: 3,
  };
}

describe('fileUploadService helpers', () => {
  it('exposes default configuration values', () => {
    expect(fileUploadService.publicBaseUrl).toBe('https://inventory.newtechtest.in/LanguagePDF');
    expect(fileUploadService.uploadEndpoint).toBe('https://inventory.newtechtest.in/upload.php');
    expect(fileUploadService.uploadApiKey).toBe('fluentify_secure_upload_key_2024');
  });

  it('generateFolderPath builds correct folder structure', () => {
    const pathInfo = createBasicPathInfo();
    const folder = fileUploadService.generateFolderPath(
      pathInfo.language,
      pathInfo.courseNumber,
      pathInfo.unitNumber,
      pathInfo.lessonNumber,
    );
    expect(folder).toBe('Hindi1/Unit2/L3');
  });

  it('generatePublicUrl composes URL from base and folder', () => {
    const pathInfo = createBasicPathInfo();
    const url = fileUploadService.generatePublicUrl(
      pathInfo.language,
      pathInfo.courseNumber,
      pathInfo.unitNumber,
      pathInfo.lessonNumber,
      'file.pdf',
    );
    expect(url).toBe('https://inventory.newtechtest.in/LanguagePDF/Hindi1/Unit2/L3/file.pdf');
  });

  it('sanitizeFilename removes special chars, collapses underscores and lowercases', () => {
    const sanitized = fileUploadService.sanitizeFilename('My File (Final)!! v2.PDF');
    expect(sanitized).toMatch(/^[a-z0-9_\-]+\.pdf$/);
    expect(sanitized).toBe(sanitized.toLowerCase());
    expect(sanitized).toContain('.pdf');
  });

  it('sanitizeFilename trims overly long names down to 50 characters before extension', () => {
    const name = `${'VeryLongName_'.repeat(6)}Attachment.mp3`;
    const sanitized = fileUploadService.sanitizeFilename(name);
    const [base, ext] = sanitized.split('.');
    expect(sanitized.endsWith('.mp3')).toBe(true);
    expect(base.length).toBeLessThanOrEqual(50);
  });

  it('getContentType returns correct mime type or default', () => {
    expect(fileUploadService.getContentType('doc.pdf')).toBe('application/pdf');
    expect(fileUploadService.getContentType('song.mp3')).toBe('audio/mpeg');
    expect(fileUploadService.getContentType('clip.mp4')).toBe('video/mp4');
    expect(fileUploadService.getContentType('voice.wav')).toBe('audio/wav');
    expect(fileUploadService.getContentType('track.ogg')).toBe('audio/ogg');
    expect(fileUploadService.getContentType('movie.webm')).toBe('video/webm');
    expect(fileUploadService.getContentType('photo.jpg')).toBe('image/jpeg');
    expect(fileUploadService.getContentType('photo.jpeg')).toBe('image/jpeg');
    expect(fileUploadService.getContentType('photo.png')).toBe('image/png');
    expect(fileUploadService.getContentType('photo.gif')).toBe('image/gif');
    expect(fileUploadService.getContentType('unknown.bin')).toBe('application/octet-stream');
  });

  it('validateFileType checks mime type against content type map', () => {
    expect(fileUploadService.validateFileType('application/pdf', 'pdf')).toBe(true);
    expect(fileUploadService.validateFileType('audio/mpeg', 'audio')).toBe(true);
    expect(fileUploadService.validateFileType('audio/wav', 'audio')).toBe(true);
    expect(fileUploadService.validateFileType('audio/ogg', 'audio')).toBe(true);
    expect(fileUploadService.validateFileType('audio/mp3', 'audio')).toBe(true);
    expect(fileUploadService.validateFileType('video/mp4', 'video')).toBe(true);
    expect(fileUploadService.validateFileType('video/webm', 'video')).toBe(true);
    expect(fileUploadService.validateFileType('video/quicktime', 'video')).toBe(true);
    expect(fileUploadService.validateFileType('application/pdf', 'audio')).toBe(false);
    expect(fileUploadService.validateFileType('Stryker was here', 'unknown')).toBe(false);
  });

  it('getMaxFileSize returns correct size for type and default', () => {
    expect(fileUploadService.getMaxFileSize('pdf')).toBe(50 * 1024 * 1024);
    expect(fileUploadService.getMaxFileSize('audio')).toBe(100 * 1024 * 1024);
    expect(fileUploadService.getMaxFileSize('video')).toBe(500 * 1024 * 1024);
    expect(fileUploadService.getMaxFileSize('other')).toBe(50 * 1024 * 1024);
  });
});

describe('fileUploadService.uploadFile', () => {
  const buffer = Buffer.from('test');
  const filename = 'My File.pdf';
  const mimeType = 'application/pdf';
  const pathInfo = createBasicPathInfo();

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  it('uploads successfully when backend returns success', async () => {
    mockPost.mockResolvedValueOnce({ data: { success: true } });

    const result = await fileUploadService.uploadFile(buffer, filename, mimeType, pathInfo);

    expect(mockPost).toHaveBeenCalledTimes(1);
    const [url, formData, config] = mockPost.mock.calls[0];
    expect(url).toBe(fileUploadService.uploadEndpoint);
    expect(formData).toBeInstanceOf(MockFormData);
    expect(config.headers.Authorization).toBe(`Bearer ${fileUploadService.uploadApiKey}`);

    const fileField = formData.fields.find((f) => f.name === 'file');
    const pathField = formData.fields.find((f) => f.name === 'path');
    const keyField = formData.fields.find((f) => f.name === 'api_key');
    expect(fileField.options).toEqual({ filename: 'my_file.pdf', contentType: mimeType });
    expect(pathField.value).toBe('Hindi1/Unit2/L3');
    expect(keyField.value).toBe(fileUploadService.uploadApiKey);
    expect(consoleLogSpy).toHaveBeenCalledWith(`Uploading to: ${fileUploadService.uploadEndpoint}`);
    expect(consoleLogSpy).toHaveBeenCalledWith('Target folder: Hindi1/Unit2/L3');

    expect(result.success).toBe(true);
    expect(result.url).toContain('Hindi1/Unit2/L3');
    expect(result.message).toBe('File uploaded successfully');
  });

  it('throws with server message when success flag is false', async () => {
    mockPost.mockResolvedValueOnce({ data: { success: false, message: 'Bad upload' } });

    await expect(
      fileUploadService.uploadFile(buffer, filename, mimeType, pathInfo),
    ).rejects.toThrow('Bad upload');
  });

  it('uses default error message when server omits message', async () => {
    mockPost.mockResolvedValueOnce({ data: { success: false } });

    await expect(
      fileUploadService.uploadFile(buffer, filename, mimeType, pathInfo),
    ).rejects.toThrow('Upload failed');
  });

  it('throws Invalid API Key when status is 401', async () => {
    const error = new Error('unauthorized');
    error.response = { status: 401, data: { message: 'bad key' } };
    mockPost.mockRejectedValueOnce(error);

    await expect(
      fileUploadService.uploadFile(buffer, filename, mimeType, pathInfo),
    ).rejects.toThrow('Upload failed: Invalid API Key');

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP upload error:', 'bad key');
  });

  it('throws detailed server error when status is 500', async () => {
    const error = new Error('server error');
    error.response = { status: 500, data: { message: 'disk full' } };
    mockPost.mockRejectedValueOnce(error);

    await expect(
      fileUploadService.uploadFile(buffer, filename, mimeType, pathInfo),
    ).rejects.toThrow('Upload failed: Server error (disk full). Check folder permissions.');

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP upload error:', 'disk full');
  });

  it('throws generic failed-to-upload message for other errors', async () => {
    const error = new Error('network down');
    mockPost.mockRejectedValueOnce(error);

    await expect(
      fileUploadService.uploadFile(buffer, filename, mimeType, pathInfo),
    ).rejects.toThrow('Failed to upload file: network down');

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP upload error:', 'network down');
  });

  it('falls back to generic message when response object exists without data message', async () => {
    const error = new Error('boom');
    error.response = { status: 400, data: {} };
    mockPost.mockRejectedValueOnce(error);

    await expect(
      fileUploadService.uploadFile(buffer, filename, mimeType, pathInfo),
    ).rejects.toThrow('Failed to upload file: boom');

    expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP upload error:', 'boom');
  });
});

afterAll(() => {
  consoleLogSpy.mockRestore();
  consoleErrorSpy.mockRestore();
});
