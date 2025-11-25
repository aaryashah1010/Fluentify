import { jest } from '@jest/globals';

// Mock db and pool
const queryMock = jest.fn();
const clientQueryMock = jest.fn();
const releaseMock = jest.fn();
const connectMock = jest.fn(async () => ({ query: clientQueryMock, release: releaseMock }));
await jest.unstable_mockModule('../../config/db.js', () => ({
  default: { query: queryMock },
  pool: { connect: connectMock }
}));

const repo = (await import('../../repositories/contestRepository.js')).default;

describe('contestRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('admin create/update operations', () => {
    it('adminCreateContest returns created row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const r = await repo.adminCreateContest('T', 'D', 's', 'e');
      expect(r).toEqual({ id: 1 });
      const params = queryMock.mock.calls[0][1];
      expect(params).toEqual(['T','D','s','e']);
    });

    it('adminAddQuestion returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 2 }] });
      const r = await repo.adminAddQuestion(1, 'Q', [{ id: 1 }], 1);
      expect(r).toEqual({ id: 2 });
      const params = queryMock.mock.calls[0][1];
      expect(params[2]).toBe(JSON.stringify([{ id: 1 }]));
    });

    it('adminUpdateContest builds dynamic fields and returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1, title: 'New' }] });
      const r = await repo.adminUpdateContest(1, { title: 'New', description: 'D' });
      expect(r).toEqual({ id: 1, title: 'New' });
      const [sql] = queryMock.mock.calls[0];
      expect(sql).toMatch(/SET .*updated_at/);
    });

    it('adminUpdateContest works when no updatable fields are provided', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const r = await repo.adminUpdateContest(1, {});
      expect(r).toEqual({ id: 1 });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toMatch(/SET updated_at = CURRENT_TIMESTAMP/);
      expect(params).toEqual([1]);
    });

    it('adminUpdateContest includes start_time and end_time when provided', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const updates = {
        title: 'New',
        description: 'D',
        start_time: '2025-01-01T00:00:00Z',
        end_time: '2025-01-02T00:00:00Z',
      };
      await repo.adminUpdateContest(1, updates);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toMatch(/start_time = \$/);
      expect(sql).toMatch(/end_time = \$/);
      expect(params).toContain('2025-01-01T00:00:00Z');
      expect(params).toContain('2025-01-02T00:00:00Z');
    });

    it('adminPublishContest returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1, status: 'PUBLISHED' }] });
      const r = await repo.adminPublishContest(1);
      expect(r.status).toBe('PUBLISHED');
    });

    it('adminGetAllContests returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const rows = await repo.adminGetAllContests();
      expect(rows).toEqual([{ id: 1 }]);
    });

    it('adminGetContestById returns null when not found, and contest with questions', async () => {
      queryMock
        .mockResolvedValueOnce({ rows: [] });
      expect(await repo.adminGetContestById(1)).toBeNull();

      queryMock
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({ rows: [{ id: 11 }] });
      const r = await repo.adminGetContestById(1);
      expect(r).toEqual({ id: 1, questions: [{ id: 11 }] });
    });

    it('updateContestStatus returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1, status: 'ACTIVE' }] });
      const r = await repo.updateContestStatus(1, 'ACTIVE');
      expect(r.status).toBe('ACTIVE');
    });

    it('adminDeleteContest returns deleted row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const r = await repo.adminDeleteContest(1);
      expect(r).toEqual({ id: 1 });
    });
  });

  describe('learner queries', () => {
    it('learnerGetAvailableContests returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const rows = await repo.learnerGetAvailableContests(7);
      expect(rows).toEqual([{ id: 1 }]);
    });

    it('learnerGetContestQuestions returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 11 }] });
      const rows = await repo.learnerGetContestQuestions(1);
      expect(rows).toEqual([{ id: 11 }]);
    });

    it('getCorrectAnswers returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 11, correct_option_id: 1 }] });
      const rows = await repo.getCorrectAnswers(1);
      expect(rows).toEqual([{ id: 11, correct_option_id: 1 }]);
    });

    it('hasUserSubmitted returns boolean', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      expect(await repo.hasUserSubmitted(1, 1)).toBe(true);
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.hasUserSubmitted(1, 1)).toBe(false);
    });

    it('saveContestScore returns upserted row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 99 }] });
      const r = await repo.saveContestScore(1, 1, 10, 1000);
      expect(r).toEqual({ id: 99 });
    });

    it('saveContestSubmissions uses transaction and commits all', async () => {
      clientQueryMock
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({}) // insert #1
        .mockResolvedValueOnce({}) // insert #2
        .mockResolvedValueOnce({}); // COMMIT
      const submissions = [
        { question_id: 1, selected_option_id: 2, is_correct: true },
        { question_id: 2, selected_option_id: 1, is_correct: false },
      ];
      await repo.saveContestSubmissions(7, 1, submissions);
      expect(connectMock).toHaveBeenCalled();
      expect(clientQueryMock).toHaveBeenCalled();
      expect(releaseMock).toHaveBeenCalled();
    });

    it('saveContestSubmissions rolls back on error and releases client', async () => {
      // First insert throws
      clientQueryMock
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(new Error('insert fail'))
        .mockResolvedValueOnce({}); // ROLLBACK
      await expect(repo.saveContestSubmissions(7, 1, [{ question_id: 1, selected_option_id: 2, is_correct: true }])).rejects.toThrow('insert fail');
      expect(releaseMock).toHaveBeenCalled();
    });

    it('getLeaderboard returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ learner_id: 1, rank: 1 }] });
      const rows = await repo.getLeaderboard(1);
      expect(rows).toEqual([{ learner_id: 1, rank: 1 }]);
    });

    it('getUserContestResult returns row or null', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ score: 5, rank: 1, total_participants: 10 }] });
      expect(await repo.getUserContestResult(7, 1)).toEqual({ score: 5, rank: 1, total_participants: 10 });
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.getUserContestResult(7, 1)).toBeNull();
    });

    it('getContestById returns row or null', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      expect(await repo.getContestById(1)).toEqual({ id: 1 });
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.getContestById(1)).toBeNull();
    });

    it('getUserSubmissions returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ question_id: 1 }] });
      const rows = await repo.getUserSubmissions(7, 1);
      expect(rows).toEqual([{ question_id: 1 }]);
    });

    it('getUserContests returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const rows = await repo.getUserContests(7);
      expect(rows).toEqual([{ id: 1 }]);
    });
  });
});
