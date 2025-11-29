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
      const [sql, params] = queryMock.mock.calls[0];
      // No search filter when search not provided
      expect(sql).toContain('FROM learners');
      expect(sql).not.toContain('WHERE LOWER(name) ILIKE LOWER($1) OR LOWER(email) ILIKE LOWER($2)');
      // When there is no search, limit/offset are the first parameters
      expect(sql).toContain('LIMIT $1 OFFSET $2');
      expect(params).toEqual([100, 0]);
    });

    it('applies search filter and uses parameterized where', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 2 }] });
      const rows = await repo.findLearners({ search: 'abc', limit: 10, offset: 5 });
      expect(rows).toEqual([{ id: 2 }]);
      const [sql, params] = queryMock.mock.calls[0];
      // first two params are search terms, then limit/offset
      expect(params).toEqual(['%abc%', '%abc%', 10, 5]);
      // WHERE clause must be correctly parameterized when search is present
      expect(sql).toContain('WHERE LOWER(name) ILIKE LOWER($1) OR LOWER(email) ILIKE LOWER($2)');
      // With two search params first, limit/offset should be at positions $3 and $4
      expect(sql).toContain('LIMIT $3 OFFSET $4');
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
       const [sql, params] = queryMock.mock.calls[0];
       // No search filter means plain COUNT query with no params
       expect(sql).toBe('SELECT COUNT(*)::int AS count FROM learners ');
       expect(params).toEqual([]);
    });
    it('counts with search and returns 0 when empty', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      const c = await repo.countLearners({ search: 'x' });
      expect(c).toBe(0);
       const [sql, params] = queryMock.mock.calls[0];
       expect(sql).toBe('SELECT COUNT(*)::int AS count FROM learners WHERE LOWER(name) ILIKE LOWER($1) OR LOWER(email) ILIKE LOWER($2)');
       expect(params).toEqual(['%x%', '%x%']);
    });
  });

  it('getLearnerBasicById returns row or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 7 }] });
    expect(await repo.getLearnerBasicById(7)).toEqual({ id: 7 });
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.getLearnerBasicById(7)).toBeNull();

    expect(queryMock).toHaveBeenCalledTimes(2);
    const [sql1, params1] = queryMock.mock.calls[0];
    const [sql2, params2] = queryMock.mock.calls[1];
    expect(sql1).toContain('SELECT id, name, email, created_at, updated_at, is_email_verified, email_verified_at');
    expect(sql1).toContain('FROM learners WHERE id = $1');
    expect(sql2).toContain('FROM learners WHERE id = $1');
    expect(params1).toEqual([7]);
    expect(params2).toEqual([7]);
  });

  describe('getLearnerProgressSummary', () => {
    it('returns summarized row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ total_xp: 1, lessons_completed: 2, units_completed: 3, current_streak: 4, longest_streak: 5, last_activity_date: 'now' }] });
      const r = await repo.getLearnerProgressSummary(1);
      expect(r.total_xp).toBe(1);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('SELECT');
      expect(sql).toContain('FROM lesson_progress lp');
      expect(sql).toContain('FROM unit_progress up');
      expect(sql).toContain('FROM user_stats WHERE learner_id = $1');
      expect(params).toEqual([1]);
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

      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('SELECT 1 FROM learners WHERE LOWER(email) = LOWER($1) AND id <> $2 LIMIT 1');
      expect(params).toEqual(['dup@mail.com', 1]);
    });

    it('updates and returns row with normalized email', async () => {
      // First SELECT finds none, second UPDATE returns row
      queryMock
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ id: 1, email: 'new@mail.com', name: 'New' }] });
      const r = await repo.updateLearnerProfile(1, { name: 'New', email: 'New@Mail.com' });
      expect(r).toEqual({ id: 1, email: 'new@mail.com', name: 'New' });
      // verify lowercasing passed to SELECT and UPDATE queries
      const [selectSql, selectParams] = queryMock.mock.calls[0];
      expect(selectSql).toContain('SELECT 1 FROM learners WHERE LOWER(email) = LOWER($1) AND id <> $2 LIMIT 1');
      expect(selectParams).toEqual(['new@mail.com', 1]);
      const updateParams = queryMock.mock.calls[1][1];
      expect(updateParams).toEqual(['New', 'new@mail.com', 1]);
    });

    it('returns null when UPDATE yields no row', async () => {
      queryMock
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });
      const r = await repo.updateLearnerProfile(2, { name: 'N' });
      expect(r).toBeNull();
      // When no email is provided, only the UPDATE should be executed
      expect(queryMock).toHaveBeenCalledTimes(1);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('UPDATE learners');
      expect(params).toEqual(['N', null, 2]);
    });

    it('updates when only email is provided', async () => {
      queryMock
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      await repo.updateLearnerProfile(3, { email: 'Only@Mail.com' });

      const [selectSql, selectParams] = queryMock.mock.calls[0];
      expect(selectSql).toContain('SELECT 1 FROM learners WHERE LOWER(email) = LOWER($1) AND id <> $2 LIMIT 1');
      expect(selectParams).toEqual(['only@mail.com', 3]);

      const params = queryMock.mock.calls[1][1];
      expect(params).toEqual([null, 'only@mail.com', 3]);
    });
  });
});
