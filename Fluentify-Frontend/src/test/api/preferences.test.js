/**
 * @jest-environment jsdom
 */

import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('preferences API - working version', () => {
  let preferencesApi;

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
    preferencesApi = await import('../../api/preferences.js');

    jest.clearAllMocks();
  });

  it('should export expected functions', () => {
    const expectedExports = ['getLearnerPreferences', 'saveLearnerPreferences'];
    
    expectedExports.forEach(exportName => {
      expect(typeof preferencesApi[exportName]).toBe('function');
    });
  });

  it('should call getLearnerPreferences', async () => {
    await preferencesApi.getLearnerPreferences();

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/preferences/learner',
      {
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        }
      }
    );
  });

  it('should call saveLearnerPreferences with correct payload', async () => {
    const preferencesData = { language: 'Spanish', difficulty: 'beginner' };
    await preferencesApi.saveLearnerPreferences(preferencesData);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/preferences/learner',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferencesData),
      }
    );
  });
});
