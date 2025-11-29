/**
 * @jest-environment jsdom
 */

import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('progress API - working version', () => {
  let progressApi;

  beforeEach(async () => {
    // Mock localStorage for auth
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue('test-token'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    delete global.localStorage;
    global.localStorage = localStorageMock;

    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({ 
      ok: true, 
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: jest.fn().mockResolvedValue({})
    });

    // Import the API after mocking
    progressApi = await import('../../api/progress.js');

    jest.clearAllMocks();
  });

  it('should export expected functions', () => {
    expect(typeof progressApi.fetchProgressReport).toBe('function');
  });

  it('should call fetchProgressReport', async () => {
    await progressApi.fetchProgressReport();

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/progress/report?range=all',
      {
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        }
      }
    );
  });

  it('should include courseId when provided', async () => {
    await progressApi.fetchProgressReport('30d', 'course-123');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/progress/report?range=30d&courseId=course-123',
      {
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        }
      }
    );
  });
});
