import { jest } from '@jest/globals';

// Mock db
const queryMock = jest.fn();
await jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));

const repo = (await import('../../repositories/chatRepository.js')).default;

describe('chatRepository', () => {
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('createSession', () => {
    it('creates session and returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1, title: 'English Chat Session' }] });
      const r = await repo.createSession(9, 'English', 'Beginner');
      expect(r).toEqual({ id: 1, title: 'English Chat Session' });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('INSERT INTO chat_sessions');
      expect(sql).toContain('(user_id, language, proficiency_level, title)');
      expect(sql).toContain('VALUES ($1, $2, $3, $4)');
      expect(sql).toContain('RETURNING *');
      expect(params).toEqual([9, 'English', 'Beginner', 'English Chat Session']);
    });
    it('propagates error', async () => {
      const err = new Error('db');
      queryMock.mockRejectedValueOnce(err);
      await expect(repo.createSession(1, 'English', 'Beginner')).rejects.toThrow('db');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating chat session:', err);
    });
  });

  describe('getRecentMessages', () => {
    it('returns reversed chronological messages', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 2 }, { id: 1 }] });
      const rows = await repo.getRecentMessages(1, 2);
      expect(rows).toEqual([{ id: 1 }, { id: 2 }]);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('SELECT id, sender_type, content, created_at');
      expect(sql).toContain('FROM chat_messages');
      expect(sql).toContain('WHERE session_id = $1');
      expect(sql).toContain('ORDER BY created_at DESC');
      expect(sql).toContain('LIMIT $2');
      expect(params).toEqual([1, 2]);
    });
    it('uses default limit when not provided', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      await repo.getRecentMessages(5);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('FROM chat_messages');
      expect(sql).toContain('LIMIT $2');
      expect(params).toEqual([5, 8]);
    });
    it('propagates error', async () => {
      const err = new Error('db');
      queryMock.mockRejectedValueOnce(err);
      await expect(repo.getRecentMessages(1, 2)).rejects.toThrow('db');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching recent messages:', err);
    });
  });

  describe('saveMessage', () => {
    it('saves message and returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 5, content: 'hi' }] });
      const r = await repo.saveMessage(1, 2, 'user', 'hi');
      expect(r).toEqual({ id: 5, content: 'hi' });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('INSERT INTO chat_messages (session_id, user_id, sender_type, content)');
      expect(sql).toContain('VALUES ($1, $2, $3, $4)');
      expect(sql).toContain('RETURNING *');
      expect(params).toEqual([1, 2, 'user', 'hi']);
    });
    it('propagates error', async () => {
      const err = new Error('db');
      queryMock.mockRejectedValueOnce(err);
      await expect(repo.saveMessage(1, 2, 'user', 'hi')).rejects.toThrow('db');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving chat message:', err);
    });
  });

  describe('getUserSessions', () => {
    it('returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const rows = await repo.getUserSessions(3, 5);
      expect(rows).toEqual([{ id: 1 }]);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('SELECT id, title, language, proficiency_level, message_count');
      expect(sql).toContain('FROM chat_sessions');
      expect(sql).toContain('WHERE user_id = $1');
      expect(sql).toContain('ORDER BY last_activity DESC');
      expect(sql).toContain('LIMIT $2');
      expect(params).toEqual([3, 5]);
    });
    it('uses default limit when not provided', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      await repo.getUserSessions(9);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('FROM chat_sessions');
      expect(sql).toContain('LIMIT $2');
      expect(params).toEqual([9, 10]);
    });
    it('propagates error', async () => {
      const err = new Error('db');
      queryMock.mockRejectedValueOnce(err);
      await expect(repo.getUserSessions(3, 5)).rejects.toThrow('db');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user sessions:', err);
    });
  });

  describe('getSessionById', () => {
    it('returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 7 }] });
      const r = await repo.getSessionById(7, 2);
      expect(r).toEqual({ id: 7 });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('SELECT * FROM chat_sessions');
      expect(sql).toContain('WHERE id = $1 AND user_id = $2');
      expect(params).toEqual([7, 2]);
    });
    it('propagates error', async () => {
      const err = new Error('db');
      queryMock.mockRejectedValueOnce(err);
      await expect(repo.getSessionById(7, 2)).rejects.toThrow('db');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching session:', err);
    });
  });

  describe('getUserLanguageInfo', () => {
    it('maps expected_duration to proficiency and returns defaults when no rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ language: 'Spanish', expected_duration: '6 months' }] });
      const r = await repo.getUserLanguageInfo(1);
      expect(r).toEqual({ language: 'Spanish', proficiency: 'Intermediate' });
      const [sqlFirst, paramsFirst] = queryMock.mock.calls[0];
      expect(sqlFirst).toContain('SELECT language, expected_duration');
      expect(sqlFirst).toContain('FROM learner_preferences');
      expect(sqlFirst).toContain('WHERE learner_id = $1');
      expect(sqlFirst).toContain('ORDER BY created_at DESC');
      expect(sqlFirst).toContain('LIMIT 1');
      expect(paramsFirst).toEqual([1]);
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
      const err = new Error('db');
      queryMock.mockRejectedValueOnce(err);
      await expect(repo.getUserLanguageInfo(1)).rejects.toThrow('db');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user language info:', err);
    });
  });

  describe('deleteOldSessions', () => {
    it('returns rowCount', async () => {
      queryMock.mockResolvedValueOnce({ rowCount: 3 });
      const n = await repo.deleteOldSessions(15);
      expect(n).toBe(3);
      const [sql] = queryMock.mock.calls[0];
      expect(sql).toContain('DELETE FROM chat_sessions');
      expect(sql).toContain("WHERE last_activity < NOW() - INTERVAL '15 days'");
    });
    it('uses default daysOld when not provided', async () => {
      queryMock.mockResolvedValueOnce({ rowCount: 0 });
      const n = await repo.deleteOldSessions();
      expect(n).toBe(0);
      expect(queryMock).toHaveBeenCalledTimes(1);
      const [sql] = queryMock.mock.calls[0];
      expect(sql).toContain("WHERE last_activity < NOW() - INTERVAL '30 days'");
    });
    it('propagates error', async () => {
      const err = new Error('db');
      queryMock.mockRejectedValueOnce(err);
      await expect(repo.deleteOldSessions(15)).rejects.toThrow('db');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting old sessions:', err);
    });
  });
});
