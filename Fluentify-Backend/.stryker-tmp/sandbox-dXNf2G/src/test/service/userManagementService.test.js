// @ts-nocheck
import { jest } from '@jest/globals';

// Mock db
const queryMock = jest.fn();
await jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));

const service = (await import('../../services/userManagementService.js')).default;

describe('userManagementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsersList', () => {
    it('returns users and pagination', async () => {
      queryMock
        .mockResolvedValueOnce({ rows: [ { id: 1, name: 'A' } ] })
        .mockResolvedValueOnce({ rows: [ { count: '5' } ] });
      const res = await service.getUsersList(2, 2);
      expect(res.users).toEqual([{ id: 1, name: 'A' }]);
      expect(res.pagination).toEqual({ total: 5, page: 2, limit: 2, totalPages: Math.ceil(5/2) });
      // Ensure limit/offset bound variables were passed
      expect(queryMock.mock.calls[0][1]).toEqual([2, 2]);
    });

    it('uses default page and limit when not provided', async () => {
      queryMock
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [ { count: '0' } ] });
      await service.getUsersList();
      // default limit=20, page=1 -> offset=0
      expect(queryMock.mock.calls[0][1]).toEqual([20, 0]);
    });
  });

  describe('findUsers', () => {
    it('queries with ILIKE for search term', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 2, name: 'B' } ] });
      const res = await service.findUsers('term');
      expect(res).toEqual([{ id: 2, name: 'B' }]);
      const params = queryMock.mock.calls[0][1];
      expect(params).toEqual(['%term%', '%term%']);
    });
  });

  describe('getUserWithProgress', () => {
    it('returns null when user not found', async () => {
      queryMock
        .mockResolvedValueOnce({ rows: [ undefined ] });
      const res = await service.getUserWithProgress(9);
      expect(res).toBeNull();
    });

    it('returns user, summary and courses when found', async () => {
      // user
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1, name: 'U' } ] });
      // courses
      queryMock.mockResolvedValueOnce({ rows: [ { id: 10, title: 'T' } ] });
      // summary
      queryMock.mockResolvedValueOnce({ rows: [ { total_xp: 0, lessons_completed: 0, units_completed: 0, current_streak: 0, longest_streak: 0, last_activity_date: null } ] });
      const res = await service.getUserWithProgress(1);
      expect(res.user.id).toBe(1);
      expect(res.courses[0].id).toBe(10);
      expect(res.summary.total_xp).toBe(0);
    });
  });

  describe('updateUserData', () => {
    it('updates and returns updated user', async () => {
      queryMock.mockResolvedValueOnce({ rows: [ { id: 1, name: 'New', email: 'new@mail.com' } ] });
      const res = await service.updateUserData(1, { name: 'New', email: 'new@mail.com' });
      expect(res).toEqual({ id: 1, name: 'New', email: 'new@mail.com' });
      const params = queryMock.mock.calls[0][1];
      expect(params).toEqual(['New', 'new@mail.com', 1]);
    });
  });

  describe('deleteUser', () => {
    it('executes delete query', async () => {
      queryMock.mockResolvedValueOnce({});
      await service.deleteUser(3);
      expect(queryMock).toHaveBeenCalled();
      const params = queryMock.mock.calls[0][1];
      expect(params).toEqual([3]);
    });
  });
});
