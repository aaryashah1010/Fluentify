import { jest } from '@jest/globals';

// ------------------------------
// Mocks
// ------------------------------

const mockHandleResponse = jest.fn(async (response) => ({ ok: true, response }));
const mockGetAuthHeader = jest.fn(() => ({ Authorization: 'Bearer test-token', 'Content-Type': 'application/json' }));

await jest.unstable_mockModule('../../api/apiHelpers.js', () => ({
  API_BASE_URL: 'http://test-base',
  handleResponse: mockHandleResponse,
  getAuthHeader: mockGetAuthHeader,
}));

// Import module under test AFTER mocks
const adminApi = await import('../../api/admin.js');

describe('admin API client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('User management', () => {
    it('getUsers calls correct URL and headers and delegates to handleResponse', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getUsers(2, 50);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/users?page=2&limit=50',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('getUsers uses default page and limit when not provided', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getUsers();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/users?page=1&limit=20',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('searchUsers URL-encodes query and delegates to handleResponse', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.searchUsers('john doe+admin');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/users/search?q=john%20doe%2Badmin',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('getCoursesByLanguage calls language courses endpoint', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getCoursesByLanguage('en');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/languages/en/courses',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('getAnalyticsForPeriod uses default days when not provided', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getAnalyticsForPeriod();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/analytics/period?days=30',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('User details and updates', () => {
    it('getUserDetails calls correct URL and headers', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getUserDetails(42);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/users/42',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('updateUser sends PUT with merged headers and JSON body', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const userData = { name: 'New', email: 'n@example.com' };
      await adminApi.updateUser(5, userData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/users/5',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...mockGetAuthHeader(),
          },
          body: JSON.stringify(userData),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('deleteUser sends DELETE with auth header', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.deleteUser(7);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/users/7',
        {
          method: 'DELETE',
          headers: mockGetAuthHeader(),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('Language & course operations', () => {
    it('getLanguages uses auth header and handleResponse', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getLanguages();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/languages',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('createCourse sends POST with body and auth header', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const data = { title: 'Course', language: 'en' };
      await adminApi.createCourse(data);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/courses',
        {
          method: 'POST',
          headers: { ...mockGetAuthHeader() },
          body: JSON.stringify(data),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('Analytics operations', () => {
    it('getAnalyticsForPeriod passes days as query param', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getAnalyticsForPeriod(7);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/analytics/period?days=7',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('Email campaign CSV export', () => {
    it('exportLearnersCSV returns blob when response is ok', async () => {
      const blob = new Blob(['csv']);
      const mockResponse = {
        ok: true,
        blob: jest.fn(async () => blob),
      };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const result = await adminApi.exportLearnersCSV();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/email-campaign/export-csv',
        { headers: mockGetAuthHeader() }
      );
      expect(result).toBe(blob);
    });

    it('exportLearnersCSV throws when response not ok', async () => {
      const mockResponse = {
        ok: false,
        blob: jest.fn(),
      };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await expect(adminApi.exportLearnersCSV()).rejects.toThrow('Failed to export CSV');
    });
  });

  describe('Analytics summary endpoints', () => {
    it('getAnalytics uses analytics endpoint', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getAnalytics();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/analytics',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('getLanguageDistribution uses languages analytics endpoint', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getLanguageDistribution();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/analytics/languages',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('getModuleUsage uses modules analytics endpoint', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getModuleUsage();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/analytics/modules',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('getUserEngagement uses engagement analytics endpoint', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getUserEngagement();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/analytics/engagement',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('getLessonCompletionTrends uses trends analytics endpoint with days', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getLessonCompletionTrends(14);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/analytics/trends?days=14',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('Learner admin management', () => {
    it('getLearners builds query params and calls handleResponse', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getLearners({ search: 'abc', page: 3, limit: 15 });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/users?search=abc&page=3&limit=15',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('getLearnerDetails hits learner details endpoint', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getLearnerDetails(99);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/users/99',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('updateLearner sends PUT with name and email only', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.updateLearner(100, { name: 'N', email: 'e@example.com', ignored: 'x' });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/users/100',
        {
          method: 'PUT',
          headers: { ...mockGetAuthHeader() },
          body: JSON.stringify({ name: 'N', email: 'e@example.com' }),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('Email campaign admin endpoints', () => {
    it('getLearnersForCampaign uses campaign learners endpoint', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getLearnersForCampaign();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/email-campaign/learners',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('triggerEmailCampaign posts to trigger endpoint with auth header', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.triggerEmailCampaign();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/email-campaign/trigger',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...mockGetAuthHeader(),
          },
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('Course details and updates', () => {
    it('getCourseDetails fetches course by ID with auth header', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.getCourseDetails(55);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/courses/55',
        { headers: mockGetAuthHeader() }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('updateCourse sends PUT with course data JSON body', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const courseData = { title: 'Updated course' };
      await adminApi.updateCourse(56, courseData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/courses/56',
        {
          method: 'PUT',
          headers: { ...mockGetAuthHeader() },
          body: JSON.stringify(courseData),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('deleteCourse sends DELETE with auth header', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.deleteCourse(57);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/courses/57',
        {
          method: 'DELETE',
          headers: { ...mockGetAuthHeader() },
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('Unit operations', () => {
    it('createUnit posts to course units endpoint', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const unitData = { title: 'Unit 1' };
      await adminApi.createUnit(10, unitData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/courses/10/units',
        {
          method: 'POST',
          headers: { ...mockGetAuthHeader() },
          body: JSON.stringify(unitData),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('updateUnit puts to unit endpoint', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const unitData = { title: 'Updated unit' };
      await adminApi.updateUnit(11, unitData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/units/11',
        {
          method: 'PUT',
          headers: { ...mockGetAuthHeader() },
          body: JSON.stringify(unitData),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('deleteUnit deletes unit endpoint', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.deleteUnit(12);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/units/12',
        {
          method: 'DELETE',
          headers: { ...mockGetAuthHeader() },
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe('Lesson operations', () => {
    it('createLesson posts to lessons endpoint under unit', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const lessonData = { title: 'L1' };
      await adminApi.createLesson(70, lessonData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/units/70/lessons',
        {
          method: 'POST',
          headers: { ...mockGetAuthHeader() },
          body: JSON.stringify(lessonData),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('updateLesson sends PUT to lesson endpoint', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const lessonData = { title: 'Updated L1' };
      await adminApi.updateLesson(71, lessonData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/lessons/71',
        {
          method: 'PUT',
          headers: { ...mockGetAuthHeader() },
          body: JSON.stringify(lessonData),
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });

    it('deleteLesson sends DELETE to lesson endpoint', async () => {
      const mockResponse = { ok: true, headers: { get: () => 'application/json' } };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await adminApi.deleteLesson(72);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://test-base/api/admin/lessons/72',
        {
          method: 'DELETE',
          headers: { ...mockGetAuthHeader() },
        }
      );
      expect(mockHandleResponse).toHaveBeenCalledWith(mockResponse);
    });
  });
});
