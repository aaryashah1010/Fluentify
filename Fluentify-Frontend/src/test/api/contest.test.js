/**
 * @jest-environment jsdom
 */

import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('contest API', () => {
  let contestApi;
  let mockFetch;

  beforeEach(async () => {
    // Mock localStorage for auth
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue('test-token'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    // Mock fetch
    mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: jest.fn().mockResolvedValue({ success: true, data: {} })
    });
    global.fetch = mockFetch;

    // Import the API after mocking
    contestApi = await import('../../api/contest.js');

    jest.clearAllMocks();
  });

  describe('Admin Endpoints', () => {
    it('should call apiAdminCreateContest', async () => {
      const contestData = { title: 'Test Contest', description: 'Test' };
      await contestApi.apiAdminCreateContest(contestData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests/admin',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contestData),
        }
      );
    });

    it('should call apiAdminUpdateContest', async () => {
      const updateData = { title: 'Updated Contest' };
      await contestApi.apiAdminUpdateContest(1, updateData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests/admin/1',
        {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );
    });

    it('should call apiAdminAddQuestion', async () => {
      const questionData = {
        question_text: 'What is 2+2?',
        options: [{ id: 0, text: '4' }],
        correct_option_id: 0
      };
      await contestApi.apiAdminAddQuestion(1, questionData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests/admin/1/questions',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(questionData),
        }
      );
    });

    it('should call apiAdminPublishContest with PATCH method', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: { get: jest.fn().mockReturnValue('application/json') },
        json: jest.fn().mockResolvedValue({ success: true })
      });

      await contestApi.apiAdminPublishContest(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests/admin/1/publish',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
        })
      );
    });

    it('should fallback to POST when PATCH fails with 404', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          headers: { get: jest.fn().mockReturnValue('application/json') },
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: jest.fn().mockReturnValue('application/json') },
          json: jest.fn().mockResolvedValue({ success: true })
        });

      await contestApi.apiAdminPublishContest(1);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(2,
        'http://localhost:5000/api/contests/admin/1/publish',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should fallback to PUT when PATCH and POST fail with 404', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 404, headers: { get: jest.fn() } })
        .mockResolvedValueOnce({ ok: false, status: 404, headers: { get: jest.fn() } })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: jest.fn().mockReturnValue('application/json') },
          json: jest.fn().mockResolvedValue({ success: true })
        });

      await contestApi.apiAdminPublishContest(1);

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenNthCalledWith(3,
        'http://localhost:5000/api/contests/admin/1/publish',
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('should handle 405 status and try next method', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false, status: 405, headers: { get: jest.fn() } })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: jest.fn().mockReturnValue('application/json') },
          json: jest.fn().mockResolvedValue({ success: true })
        });

      await contestApi.apiAdminPublishContest(1);

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should throw error when all publish methods fail', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        headers: { get: jest.fn() }
      });

      await expect(contestApi.apiAdminPublishContest(1)).rejects.toEqual({
        status: 404,
        message: 'Publish route not found on server. Please ensure the backend exposes a publish endpoint.'
      });
    });

    it('should handle network errors in publish and try next method', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          headers: { get: jest.fn().mockReturnValue('application/json') },
          json: jest.fn().mockResolvedValue({ success: true })
        });

      await contestApi.apiAdminPublishContest(1);

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle server errors (not 404/405) in publish', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: { get: jest.fn().mockReturnValue('application/json') },
        json: jest.fn().mockResolvedValue({ error: 'Server error' })
      });

      await expect(contestApi.apiAdminPublishContest(1)).rejects.toBeDefined();
    });

    it('should call apiAdminGetContests', async () => {
      await contestApi.apiAdminGetContests();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests/admin',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should call apiAdminGetContestDetails', async () => {
      await contestApi.apiAdminGetContestDetails(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests/admin/1',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should call apiAdminDeleteContest', async () => {
      await contestApi.apiAdminDeleteContest(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests/admin/1',
        {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });
  });

  describe('Learner Endpoints', () => {
    it('should call apiGetAvailableContests', async () => {
      await contestApi.apiGetAvailableContests();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should call apiGetContestDetails', async () => {
      await contestApi.apiGetContestDetails(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests/1',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should call apiSubmitContest with correct payload', async () => {
      const submissionData = {
        start_time: Date.now(),
        submissions: [{ question_id: 1, selected_option_id: 0 }]
      };
      await contestApi.apiSubmitContest(1, submissionData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests/1/submit',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        }
      );
    });

    it('should call apiGetLeaderboard', async () => {
      await contestApi.apiGetLeaderboard(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests/1/leaderboard',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should call apiGetUserContestHistory', async () => {
      await contestApi.apiGetUserContestHistory();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests/my-contests',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should call apiGetUserContestResult', async () => {
      await contestApi.apiGetUserContestResult(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/contests/1/my-result',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        }
      );
    });
  });
});
