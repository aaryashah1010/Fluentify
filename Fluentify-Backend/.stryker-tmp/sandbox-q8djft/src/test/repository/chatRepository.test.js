// @ts-nocheck
import { jest } from '@jest/globals';

// Mock db
const queryMock = jest.fn();
await jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));

const repo = (await import('../../repositories/chatRepository.js')).default;

describe('chatRepository', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('createSession', () => {
    it('creates session and returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1, title: 'English Chat Session' }] });
      const r = await repo.createSession(9, 'English', 'Beginner');
      expect(r).toEqual({ id: 1, title: 'English Chat Session' });
      const [sql, params] = queryMock.mock.calls[0];
      expect(params).toEqual([9, 'English', 'Beginner', 'English Chat Session']);
    });
    it('propagates error', async () => {
      queryMock.mockRejectedValueOnce(new Error('db'));
      await expect(repo.createSession(1, 'English', 'Beginner')).rejects.toThrow('db');
    });
  });

  describe('getRecentMessages', () => {
    it('returns reversed chronological messages', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 2 }, { id: 1 }] });
      const rows = await repo.getRecentMessages(1, 2);
      expect(rows).toEqual([{ id: 1 }, { id: 2 }]);
      const params = queryMock.mock.calls[0][1];
      expect(params).toEqual([1, 2]);
    });
    it('uses default limit when not provided', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      await repo.getRecentMessages(5);
      const params = queryMock.mock.calls[0][1];
      expect(params).toEqual([5, 8]);
    });
    it('propagates error', async () => {
      queryMock.mockRejectedValueOnce(new Error('db'));
      await expect(repo.getRecentMessages(1, 2)).rejects.toThrow('db');
    });
  });

  describe('saveMessage', () => {
    it('saves message and returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 5, content: 'hi' }] });
      const r = await repo.saveMessage(1, 2, 'user', 'hi');
      expect(r).toEqual({ id: 5, content: 'hi' });
    });
    it('propagates error', async () => {
      queryMock.mockRejectedValueOnce(new Error('db'));
      await expect(repo.saveMessage(1, 2, 'user', 'hi')).rejects.toThrow('db');
    });
  });

  describe('getUserSessions', () => {
    it('returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const rows = await repo.getUserSessions(3, 5);
      expect(rows).toEqual([{ id: 1 }]);
    });
    it('uses default limit when not provided', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      await repo.getUserSessions(9);
      const params = queryMock.mock.calls[0][1];
      expect(params).toEqual([9, 10]);
    });
    it('propagates error', async () => {
      queryMock.mockRejectedValueOnce(new Error('db'));
      await expect(repo.getUserSessions(3, 5)).rejects.toThrow('db');
    });
  });

  describe('getSessionById', () => {
    it('returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 7 }] });
      expect(await repo.getSessionById(7, 2)).toEqual({ id: 7 });
    });
    it('propagates error', async () => {
      queryMock.mockRejectedValueOnce(new Error('db'));
      await expect(repo.getSessionById(7, 2)).rejects.toThrow('db');
    });
  });

  describe('getUserLanguageInfo', () => {
    it('maps expected_duration to proficiency and returns defaults when no rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ language: 'Spanish', expected_duration: '6 months' }] });
      const r = await repo.getUserLanguageInfo(1);
      expect(r).toEqual({ language: 'Spanish', proficiency: 'Intermediate' });
      queryMock.mockResolvedValueOnce({ rows: [] });
      const d = await repo.getUserLanguageInfo(1);
      expect(d).toEqual({ language: 'English', proficiency: 'Beginner' });
    });
    it('handles other expected_duration mappings', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ language: 'French', expected_duration: '1 month' }] });
      const oneMonth = await repo.getUserLanguageInfo(2);
      expect(oneMonth).toEqual({ language: 'French', proficiency: 'Beginner' });

      queryMock.mockResolvedValueOnce({ rows: [{ language: 'German', expected_duration: '3 months' }] });
      const threeMonths = await repo.getUserLanguageInfo(3);
      expect(threeMonths).toEqual({ language: 'German', proficiency: 'Beginner' });

      queryMock.mockResolvedValueOnce({ rows: [{ language: 'Italian', expected_duration: '1 year' }] });
      const oneYear = await repo.getUserLanguageInfo(4);
      expect(oneYear).toEqual({ language: 'Italian', proficiency: 'Advanced' });

      queryMock.mockResolvedValueOnce({ rows: [{ language: 'Japanese', expected_duration: '2 years' }] });
      const other = await repo.getUserLanguageInfo(5);
      expect(other).toEqual({ language: 'Japanese', proficiency: 'Beginner' });
    });
    it('propagates error', async () => {
      queryMock.mockRejectedValueOnce(new Error('db'));
      await expect(repo.getUserLanguageInfo(1)).rejects.toThrow('db');
    });
  });

  describe('deleteOldSessions', () => {
    it('returns rowCount', async () => {
      queryMock.mockResolvedValueOnce({ rowCount: 3 });
      const n = await repo.deleteOldSessions(15);
      expect(n).toBe(3);
    });
    it('uses default daysOld when not provided', async () => {
      queryMock.mockResolvedValueOnce({ rowCount: 0 });
      const n = await repo.deleteOldSessions();
      expect(n).toBe(0);
      expect(queryMock).toHaveBeenCalledTimes(1);
    });
    it('propagates error', async () => {
      queryMock.mockRejectedValueOnce(new Error('db'));
      await expect(repo.deleteOldSessions(15)).rejects.toThrow('db');
    });
  });
});
