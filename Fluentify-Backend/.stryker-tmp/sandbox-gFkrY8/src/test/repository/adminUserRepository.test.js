// @ts-nocheck
import { jest } from '@jest/globals';

// Mock db
const queryMock = jest.fn();
await jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));

const repo = (await import('../../repositories/adminUserRepository.js')).default;

describe('adminUserRepository', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('findLearners', () => {
    it('returns rows without search and parses limit/offset', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const rows = await repo.findLearners({ limit: '200', offset: '-3' });
      expect(rows).toEqual([{ id: 1 }]);
      const params = queryMock.mock.calls[0][1];
      // last two params are limitInt (capped to 100) and offsetInt (>=0)
      expect(params.slice(-2)).toEqual([100, 0]);
    });

    it('applies search filter and uses parameterized where', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 2 }] });
      const rows = await repo.findLearners({ search: 'abc', limit: 10, offset: 5 });
      expect(rows).toEqual([{ id: 2 }]);
      const [sql, params] = queryMock.mock.calls[0];
      // first two params are search terms, then limit/offset
      expect(params).toEqual(['%abc%', '%abc%', 10, 5]);
      expect(sql).toMatch(/LIMIT \$\d+ OFFSET \$\d+/);
    });

    it('uses default limit/offset when not provided', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      await repo.findLearners({});
      const params = queryMock.mock.calls[0][1];
      // defaults: limit 20, offset 0
      expect(params.slice(-2)).toEqual([20, 0]);
    });
  });

  describe('countLearners', () => {
    it('counts without search', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ count: 3 }] });
      const c = await repo.countLearners({});
      expect(c).toBe(3);
    });
    it('counts with search and returns 0 when empty', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      const c = await repo.countLearners({ search: 'x' });
      expect(c).toBe(0);
    });
  });

  it('getLearnerBasicById returns row or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 7 }] });
    expect(await repo.getLearnerBasicById(7)).toEqual({ id: 7 });
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.getLearnerBasicById(7)).toBeNull();
  });

  describe('getLearnerProgressSummary', () => {
    it('returns summarized row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ total_xp: 1, lessons_completed: 2, units_completed: 3, current_streak: 4, longest_streak: 5, last_activity_date: 'now' }] });
      const r = await repo.getLearnerProgressSummary(1);
      expect(r.total_xp).toBe(1);
    });
    it('returns default object when no rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      const r = await repo.getLearnerProgressSummary(1);
      expect(r).toEqual({ total_xp: 0, lessons_completed: 0, units_completed: 0, current_streak: 0, longest_streak: 0, last_activity_date: null });
    });
  });

  describe('updateLearnerProfile', () => {
    it('throws 409 error when email exists', async () => {
      // First SELECT check finds existing
      queryMock
        .mockResolvedValueOnce({ rows: [{ '1': 1 }] });
      await expect(repo.updateLearnerProfile(1, { name: 'New', email: 'dup@mail.com' })).rejects.toMatchObject({ message: 'Email already in use', statusCode: 409 });
    });

    it('updates and returns row with normalized email', async () => {
      // First SELECT finds none, second UPDATE returns row
      queryMock
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ id: 1, email: 'new@mail.com', name: 'New' }] });
      const r = await repo.updateLearnerProfile(1, { name: 'New', email: 'New@Mail.com' });
      expect(r).toEqual({ id: 1, email: 'new@mail.com', name: 'New' });
      // verify lowercasing passed to query
      const params = queryMock.mock.calls[1][1];
      expect(params).toEqual(['New', 'new@mail.com', 1]);
    });

    it('returns null when UPDATE yields no row', async () => {
      queryMock
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });
      const r = await repo.updateLearnerProfile(2, { name: 'N' });
      expect(r).toBeNull();
    });

    it('updates when only email is provided', async () => {
      queryMock
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      await repo.updateLearnerProfile(3, { email: 'Only@Mail.com' });

      const params = queryMock.mock.calls[1][1];
      expect(params).toEqual([null, 'only@mail.com', 3]);
    });
  });
});
