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
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('INSERT INTO contests');
      expect(sql).toContain('(title, description, start_time, end_time, status, created_at, updated_at)');
      expect(sql).toContain("VALUES ($1, $2, $3, $4, 'DRAFT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)");
      expect(sql).toContain('RETURNING *');
      expect(params).toEqual(['T', 'D', 's', 'e']);
    });

    it('adminAddQuestion returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 2 }] });
      const r = await repo.adminAddQuestion(1, 'Q', [{ id: 1 }], 1);
      expect(r).toEqual({ id: 2 });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('INSERT INTO contest_questions');
      expect(sql).toContain('(contest_id, question_text, options, correct_option_id, created_at)');
      expect(sql).toContain('VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)');
      expect(sql).toContain('RETURNING *');
      expect(params).toEqual([1, 'Q', JSON.stringify([{ id: 1 }]), 1]);
    });

    it('adminUpdateContest builds dynamic fields and returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1, title: 'New' }] });
      const r = await repo.adminUpdateContest(1, { title: 'New', description: 'D' });
      expect(r).toEqual({ id: 1, title: 'New' });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('UPDATE contests');
      expect(sql).toContain('SET');
      expect(sql).toContain('title = $1');
      expect(sql).toContain('description = $2');
      expect(sql).toContain('updated_at = CURRENT_TIMESTAMP');
      expect(sql).toContain('WHERE id = $3');
      expect(sql).toContain('title = $1, description = $2');
      expect(params).toEqual(['New', 'D', 1]);
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
      expect(sql).toContain('UPDATE contests');
      expect(sql).toContain('title = $1');
      expect(sql).toContain('description = $2');
      expect(sql).toContain('start_time = $3');
      expect(sql).toContain('end_time = $4');
      expect(sql).toContain('updated_at = CURRENT_TIMESTAMP');
      expect(sql).toContain('WHERE id = $5');
      expect(sql).toContain('title = $1, description = $2, start_time = $3, end_time = $4, updated_at = CURRENT_TIMESTAMP');
      expect(params).toEqual([
        'New',
        'D',
        '2025-01-01T00:00:00Z',
        '2025-01-02T00:00:00Z',
        1,
      ]);
    });

    it('adminPublishContest returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1, status: 'PUBLISHED' }] });
      const r = await repo.adminPublishContest(1);
      expect(r.status).toBe('PUBLISHED');
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('UPDATE contests');
      expect(sql).toContain("SET status = 'PUBLISHED', updated_at = CURRENT_TIMESTAMP");
      expect(sql).toContain('WHERE id = $1');
      expect(params).toEqual([1]);
    });

    it('adminGetAllContests returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const rows = await repo.adminGetAllContests();
      expect(rows).toEqual([{ id: 1 }]);
      const [sql] = queryMock.mock.calls[0];
      expect(sql).toContain('SELECT c.*,');
      expect(sql).toContain('FROM contests c');
      expect(sql).toContain('ORDER BY c.created_at DESC');
    });

    it('adminGetContestById returns null when not found, and contest with questions', async () => {
      queryMock
        .mockResolvedValueOnce({ rows: [] });
      const rNull = await repo.adminGetContestById(1);
      expect(rNull).toBeNull();
      const [sqlMissing, paramsMissing] = queryMock.mock.calls[0];
      expect(sqlMissing).toBe('SELECT * FROM contests WHERE id = $1');
      expect(paramsMissing).toEqual([1]);

      queryMock
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({ rows: [{ id: 11 }] });
      const r = await repo.adminGetContestById(1);
      expect(r).toEqual({ id: 1, questions: [{ id: 11 }] });
      const [sqlContest, paramsContest] = queryMock.mock.calls[1];
      expect(sqlContest).toBe('SELECT * FROM contests WHERE id = $1');
      expect(paramsContest).toEqual([1]);
      const [sqlQuestions, paramsQuestions] = queryMock.mock.calls[2];
      expect(sqlQuestions).toBe('SELECT * FROM contest_questions WHERE contest_id = $1 ORDER BY id');
      expect(paramsQuestions).toEqual([1]);
    });

    it('updateContestStatus returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1, status: 'ACTIVE' }] });
      const r = await repo.updateContestStatus(1, 'ACTIVE');
      expect(r.status).toBe('ACTIVE');
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('UPDATE contests');
      expect(sql).toContain('SET status = $1, updated_at = CURRENT_TIMESTAMP');
      expect(sql).toContain('WHERE id = $2');
      expect(params).toEqual(['ACTIVE', 1]);
    });

    it('adminDeleteContest returns deleted row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const r = await repo.adminDeleteContest(1);
      expect(r).toEqual({ id: 1 });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toBe('DELETE FROM contests WHERE id = $1 RETURNING *');
      expect(params).toEqual([1]);
    });
  });

  describe('learner queries', () => {
    it('learnerGetAvailableContests returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const rows = await repo.learnerGetAvailableContests(7);
      expect(rows).toEqual([{ id: 1 }]);
       const [sql, params] = queryMock.mock.calls[0];
       expect(sql).toContain('SELECT c.id, c.title, c.description, c.start_time, c.end_time, c.status, c.reward_points');
       expect(sql).toContain('FROM contests c');
       expect(sql).toContain("WHERE c.status IN ('PUBLISHED', 'ACTIVE', 'ENDED')");
       expect(sql).toContain('ORDER BY c.start_time DESC');
       expect(params).toEqual([7]);
    });

    it('learnerGetContestQuestions returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 11 }] });
      const rows = await repo.learnerGetContestQuestions(1);
      expect(rows).toEqual([{ id: 11 }]);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('SELECT id, contest_id, question_text, options, created_at');
      expect(sql).toContain('FROM contest_questions');
      expect(sql).toContain('WHERE contest_id = $1');
      expect(sql).toContain('ORDER BY id');
      expect(params).toEqual([1]);
    });

    it('getCorrectAnswers returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 11, correct_option_id: 1 }] });
      const rows = await repo.getCorrectAnswers(1);
      expect(rows).toEqual([{ id: 11, correct_option_id: 1 }]);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toBe('SELECT id, correct_option_id FROM contest_questions WHERE contest_id = $1');
      expect(params).toEqual([1]);
    });

    it('hasUserSubmitted returns boolean', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const first = await repo.hasUserSubmitted(1, 1);
      expect(first).toBe(true);
      const [sql1, params1] = queryMock.mock.calls[0];
      expect(sql1).toBe('SELECT id FROM contest_scores WHERE learner_id = $1 AND contest_id = $2');
      expect(params1).toEqual([1, 1]);
      queryMock.mockResolvedValueOnce({ rows: [] });
      const second = await repo.hasUserSubmitted(1, 1);
      expect(second).toBe(false);
      const [sql2, params2] = queryMock.mock.calls[1];
      expect(sql2).toBe('SELECT id FROM contest_scores WHERE learner_id = $1 AND contest_id = $2');
      expect(params2).toEqual([1, 1]);
    });

    it('saveContestScore returns upserted row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 99 }] });
      const r = await repo.saveContestScore(1, 1, 10, 1000);
      expect(r).toEqual({ id: 99 });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('INSERT INTO contest_scores');
      expect(sql).toContain('VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)');
      expect(sql).toContain('ON CONFLICT (learner_id, contest_id)');
      expect(sql).toContain('DO UPDATE SET score = $3, time_taken_ms = $4, submitted_at = CURRENT_TIMESTAMP');
      expect(sql).toContain('RETURNING *');
      expect(params).toEqual([1, 1, 10, 1000]);
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
      expect(clientQueryMock).toHaveBeenCalledTimes(4);
      const [beginSql] = clientQueryMock.mock.calls[0];
      expect(beginSql).toBe('BEGIN');
      const [insertSql1, insertParams1] = clientQueryMock.mock.calls[1];
      expect(insertSql1).toContain('INSERT INTO contest_submissions');
      expect(insertParams1).toEqual([7, 1, 1, 2, true]);
      const [insertSql2, insertParams2] = clientQueryMock.mock.calls[2];
      expect(insertSql2).toContain('INSERT INTO contest_submissions');
      expect(insertParams2).toEqual([7, 1, 2, 1, false]);
      const [commitSql] = clientQueryMock.mock.calls[3];
      expect(commitSql).toBe('COMMIT');
    });

    it('saveContestSubmissions rolls back on error and releases client', async () => {
      // First insert throws
      clientQueryMock
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(new Error('insert fail'))
        .mockResolvedValueOnce({}); // ROLLBACK
      await expect(repo.saveContestSubmissions(7, 1, [{ question_id: 1, selected_option_id: 2, is_correct: true }])).rejects.toThrow('insert fail');
      expect(releaseMock).toHaveBeenCalled();
      expect(clientQueryMock).toHaveBeenCalledTimes(3);
      const [beginSql] = clientQueryMock.mock.calls[0];
      expect(beginSql).toBe('BEGIN');
      const [insertSql, insertParams] = clientQueryMock.mock.calls[1];
      expect(insertSql).toContain('INSERT INTO contest_submissions');
      expect(insertParams).toEqual([7, 1, 1, 2, true]);
      const [rollbackSql] = clientQueryMock.mock.calls[2];
      expect(rollbackSql).toBe('ROLLBACK');
    });

    it('getLeaderboard returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ learner_id: 1, rank: 1 }] });
      const rows = await repo.getLeaderboard(1);
      expect(rows).toEqual([{ learner_id: 1, rank: 1 }]);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('FROM contest_scores cs');
      expect(sql).toContain('JOIN learners l ON l.id = cs.learner_id');
      expect(sql).toContain('WHERE cs.contest_id = $1');
      expect(sql).toContain('ORDER BY cs.score DESC, cs.time_taken_ms ASC');
      expect(params).toEqual([1]);
    });

    it('getUserContestResult returns row or null', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ score: 5, rank: 1, total_participants: 10 }] });
      const first = await repo.getUserContestResult(7, 1);
      expect(first).toEqual({ score: 5, rank: 1, total_participants: 10 });
      const [sql1, params1] = queryMock.mock.calls[0];
      expect(sql1).toContain('FROM contest_scores cs');
      expect(sql1).toContain('WHERE cs.learner_id = $1 AND cs.contest_id = $2');
      expect(sql1).toContain('COUNT(*) + 1 FROM contest_scores');
      expect(sql1).toContain('COUNT(*) FROM contest_scores WHERE contest_id = cs.contest_id');
      expect(params1).toEqual([7, 1]);
      queryMock.mockResolvedValueOnce({ rows: [] });
      const second = await repo.getUserContestResult(7, 1);
      expect(second).toBeNull();
      const [sql2, params2] = queryMock.mock.calls[1];
      expect(sql2).toBe(sql1);
      expect(params2).toEqual([7, 1]);
    });

    it('getContestById returns row or null', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const first = await repo.getContestById(1);
      expect(first).toEqual({ id: 1 });
      const [sql1, params1] = queryMock.mock.calls[0];
      expect(sql1).toBe('SELECT * FROM contests WHERE id = $1');
      expect(params1).toEqual([1]);
      queryMock.mockResolvedValueOnce({ rows: [] });
      const second = await repo.getContestById(1);
      expect(second).toBeNull();
      const [sql2, params2] = queryMock.mock.calls[1];
      expect(sql2).toBe('SELECT * FROM contests WHERE id = $1');
      expect(params2).toEqual([1]);
    });

    it('getUserSubmissions returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ question_id: 1 }] });
      const rows = await repo.getUserSubmissions(7, 1);
      expect(rows).toEqual([{ question_id: 1 }]);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('FROM contest_submissions cs');
      expect(sql).toContain('JOIN contest_questions cq ON cq.id = cs.question_id');
      expect(sql).toContain('WHERE cs.learner_id = $1 AND cs.contest_id = $2');
      expect(sql).toContain('ORDER BY cs.question_id');
      expect(params).toEqual([7, 1]);
    });

    it('getUserContests returns rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const rows = await repo.getUserContests(7);
      expect(rows).toEqual([{ id: 1 }]);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('FROM contest_scores cs');
      expect(sql).toContain('JOIN contests c ON c.id = cs.contest_id');
      expect(sql).toContain('WHERE cs.learner_id = $1');
      expect(sql).toContain('ORDER BY cs.submitted_at DESC');
      expect(params).toEqual([7]);
    });
  });
});
