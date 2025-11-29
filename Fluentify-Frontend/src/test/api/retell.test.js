/**
 * @jest-environment jsdom
 */

import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('retell API - working version', () => {
  let retellApi;

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
    retellApi = await import('../../api/retell.js');

    jest.clearAllMocks();
  });

  it('should export expected functions', () => {
    expect(typeof retellApi.createRetellCall).toBe('function');
  });

  it('should call createRetellCall with correct payload', async () => {
    const agentData = { agentId: 'agent-123', userId: 'user-456' };
    await retellApi.createRetellCall(agentData);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/retell/create-call',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agentId: agentData }),
      }
    );
  });
});
