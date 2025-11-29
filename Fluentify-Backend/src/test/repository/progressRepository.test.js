import { jest } from '@jest/globals';

// Mock db
const queryMock = jest.fn();
await jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));

const repo = (await import('../../repositories/progressRepository.js')).default;

describe('progressRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryMock.mockReset();
  });

  it('findUnitProgress returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ unit_id: 1 }] });
    const res = await repo.findUnitProgress(7, 1);
    expect(res).toEqual([{ unit_id: 1 }]);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('SELECT unit_id, is_unlocked, is_completed');
    expect(sql).toContain('FROM unit_progress');
    expect(sql).toContain('WHERE learner_id = $1 AND course_id = $2');
    expect(sql).toContain('ORDER BY unit_id');
    expect(params).toEqual([7, 1]);
  });

  it('findLessonProgress returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ unit_id: 1, lesson_id: 2 }] });
    const res = await repo.findLessonProgress(7, 1);
    expect(res[0].lesson_id).toBe(2);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('SELECT cu.unit_id, cl.lesson_id, lp.is_completed, lp.score, lp.xp_earned');
    expect(sql).toContain('FROM lesson_progress lp');
    expect(sql).toContain('JOIN course_lessons cl ON lp.lesson_id = cl.id');
    expect(sql).toContain('JOIN course_units cu ON cl.unit_id = cu.id');
    expect(sql).toContain('WHERE lp.learner_id = $1 AND lp.course_id = $2');
    expect(sql).toContain('ORDER BY cu.unit_id, cl.lesson_id');
    expect(params).toEqual([7, 1]);
  });

  it('findSpecificLessonProgress returns row or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 10 }] });
    const first = await repo.findSpecificLessonProgress(7, 1, 2, 3);
    expect(first).toEqual({ id: 10 });
    const [sql1, params1] = queryMock.mock.calls[0];
    expect(sql1).toContain('SELECT lp.*');
    expect(sql1).toContain('FROM lesson_progress lp');
    expect(sql1).toContain('JOIN course_lessons cl ON lp.lesson_id = cl.id');
    expect(sql1).toContain('JOIN course_units cu ON cl.unit_id = cu.id');
    expect(sql1).toContain('WHERE lp.learner_id = $1 AND lp.course_id = $2 AND cu.unit_id = $3 AND cl.lesson_id = $4');
    expect(params1).toEqual([7, 1, 2, 3]);
    queryMock.mockResolvedValueOnce({ rows: [] });
    const second = await repo.findSpecificLessonProgress(7, 1, 2, 3);
    expect(second).toBeNull();
    const [sql2, params2] = queryMock.mock.calls[1];
    expect(sql2).toBe(sql1);
    expect(params2).toEqual([7, 1, 2, 3]);
  });

  it('findUserStats returns row or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const first = await repo.findUserStats(7, 1);
    expect(first).toEqual({ id: 1 });
    const [sql1, params1] = queryMock.mock.calls[0];
    expect(sql1).toBe('SELECT * FROM user_stats WHERE learner_id = $1 AND course_id = $2');
    expect(params1).toEqual([7, 1]);
    queryMock.mockResolvedValueOnce({ rows: [] });
    const second = await repo.findUserStats(7, 1);
    expect(second).toBeNull();
    const [sql2, params2] = queryMock.mock.calls[1];
    expect(sql2).toBe(sql1);
    expect(params2).toEqual([7, 1]);
  });

  it('upsertLessonProgress performs upsert', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.upsertLessonProgress(7, 1, 2, 3, 90, 10, 5, 20);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('INSERT INTO lesson_progress');
    expect(sql).toContain('VALUES ($1, $2, $3, $4, TRUE, $5, $6, $7, $8, NOW())');
    expect(sql).toContain('ON CONFLICT (learner_id, lesson_id)');
    expect(sql).toContain('DO UPDATE SET is_completed = TRUE');
    expect(params).toEqual([7, 1, 2, 3, 90, 10, 5, 20]);
  });

  it('upsertLessonProgress uses default vocabulary values when omitted', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.upsertLessonProgress(7, 1, 2, 3, 90, 10);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('INSERT INTO lesson_progress');
    // [userId, courseId, unitId, lessonId, score, xpEarned, vocabularyMastered, totalVocabulary]
    expect(params.slice(-2)).toEqual([0, 0]);
  });

  it('createExerciseAttempt inserts attempt', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.createExerciseAttempt(7, 1, 2, 3, 0, true, 'answer');
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('INSERT INTO exercise_attempts');
    expect(sql).toContain('VALUES ($1, $2, $3, $4, $5, $6, $7)');
    expect(params).toEqual([7, 1, 2, 3, 0, true, 'answer']);
  });

  it('countCompletedLessonsInUnit parses total', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ total: '5' }] });
    const total = await repo.countCompletedLessonsInUnit(7, 1, 2);
    expect(total).toBe(5);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('SELECT COUNT(*) as total');
    expect(sql).toContain('FROM lesson_progress lp');
    expect(sql).toContain('JOIN course_lessons cl ON lp.lesson_id = cl.id');
    expect(sql).toContain('JOIN course_units cu ON cl.unit_id = cu.id');
    expect(sql).toContain('WHERE lp.learner_id = $1 AND lp.course_id = $2 AND cu.unit_id = $3 AND lp.is_completed = TRUE');
    expect(params).toEqual([7, 1, 2]);
  });

  it('markUnitComplete upserts unit_progress', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.markUnitComplete(7, 1, 2);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('INSERT INTO unit_progress');
    expect(sql).toContain('VALUES ($1, $2, $3, TRUE, TRUE, NOW())');
    expect(sql).toContain('ON CONFLICT (learner_id, course_id, unit_id)');
    expect(sql).toContain('DO UPDATE SET is_completed = TRUE, completed_at = NOW()');
    expect(params).toEqual([7, 1, 2]);
  });

  it('unlockUnit upserts unlock flag', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.unlockUnit(7, 1, 2);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('INSERT INTO unit_progress');
    expect(sql).toContain('VALUES ($1, $2, $3, TRUE, FALSE)');
    expect(sql).toContain('ON CONFLICT (learner_id, course_id, unit_id)');
    expect(sql).toContain('DO UPDATE SET is_unlocked = TRUE');
    expect(params).toEqual([7, 1, 2]);
  });

  it('createUserStats inserts stats', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.createUserStats(7, 1, 10, 1, '2025-01-01');
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('INSERT INTO user_stats');
    expect(sql).toContain('total_xp, lessons_completed, units_completed, current_streak, last_activity_date');
    expect(sql).toContain('VALUES ($1, $2, $3, 1, $4, 1, $5)');
    expect(params).toEqual([7, 1, 10, 1, '2025-01-01']);
  });

  it('updateUserStreak updates streak fields', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.updateUserStreak(7, 1, 3, '2025-01-02');
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('UPDATE user_stats SET');
    expect(sql).toContain('current_streak = $1');
    expect(sql).toContain('longest_streak = GREATEST(longest_streak, $1)');
    expect(sql).toContain('WHERE learner_id = $3 AND course_id = $4');
    expect(params).toEqual([3, '2025-01-02', 7, 1]);
  });

  describe('initializeCourseProgress', () => {
    it('inserts unit_progress and user_stats with ON CONFLICT DO NOTHING', async () => {
      queryMock
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});
      await repo.initializeCourseProgress(1, 7);
      expect(queryMock).toHaveBeenCalledTimes(2);
      const [unitSql, unitParams] = queryMock.mock.calls[0];
      expect(unitSql).toContain('INSERT INTO unit_progress');
      expect(unitSql).toContain('VALUES ($1, $2, 1, TRUE, FALSE)');
      expect(unitSql).toContain('ON CONFLICT (learner_id, course_id, unit_id) DO NOTHING');
      expect(unitParams).toEqual([7, 1]);
      const [statsSql, statsParams] = queryMock.mock.calls[1];
      expect(statsSql).toContain('INSERT INTO user_stats');
      expect(statsSql).toContain('total_xp, lessons_completed, units_completed, current_streak, longest_streak');
      expect(statsSql).toContain('VALUES ($1, $2, 0, 0, 0, 0, 0)');
      expect(statsSql).toContain('ON CONFLICT (learner_id, course_id) DO NOTHING');
      expect(statsParams).toEqual([7, 1]);
    });
  });

  describe('getSummaryKPIs', () => {
    it('returns default object when no rows', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      const res = await repo.getSummaryKPIs(7);
      expect(res).toEqual({
        total_xp: 0,
        lessons_completed: 0,
        total_vocabulary: 0,
        current_streak: 0,
        longest_streak: 0,
      });
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('FROM lesson_progress');
      // no days or course filters when not provided
      expect(sql).not.toContain('completion_time >= NOW() - INTERVAL');
      expect(sql).not.toContain('course_id =');
      // guard against mutated strings
      expect(sql).not.toContain('Stryker was here!');
      expect(params).toEqual([7]);
    });

    it('applies days and courseId filters and returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ total_xp: 10, lessons_completed: 2, total_vocabulary: 5, current_streak: 3, longest_streak: 4 }] });
      const res = await repo.getSummaryKPIs(7, 7, '3');
      const [sql] = queryMock.mock.calls[0];
      expect(sql).toContain("completion_time >= NOW() - INTERVAL '7 days'");
      expect(sql).toContain('course_id = 3');
      // courseId filter should also apply in streak subqueries
      expect(sql).toContain('FROM user_stats WHERE learner_id = $1 AND course_id = 3');
      expect(sql).not.toContain('Stryker was here!');
      expect(res.total_xp).toBe(10);
    });
  });

  describe('getProgressOverTime', () => {
    it('returns rows without filters', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ date: '2025-01-01' }] });
      const res = await repo.getProgressOverTime(7);
      expect(res).toEqual([{ date: '2025-01-01' }] );
      const [sql, params] = queryMock.mock.calls[0];
      // no filters when days and courseId are not provided
      expect(sql).not.toContain('lp.completion_time >= NOW() - INTERVAL');
      expect(sql).not.toContain('lp.course_id =');
      expect(sql).not.toContain('Stryker was here!');
      expect(params).toEqual([7]);
    });

    it('applies days and courseId filters', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ date: '2025-01-02' }] });
      const res = await repo.getProgressOverTime(7, 30, '5');
      const [sql] = queryMock.mock.calls[0];
      expect(sql).toContain("lp.completion_time >= NOW() - INTERVAL '30 days'");
      expect(sql).toContain('lp.course_id = 5');
      expect(sql).not.toContain('Stryker was here!');
      expect(res[0].date).toBe('2025-01-02');
    });
  });

  describe('getRecentActivity', () => {
    it('returns rows without filter', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ lesson_title: 'L1' }] });
      const res = await repo.getRecentActivity(7, 5);
      expect(res).toEqual([{ lesson_title: 'L1' }]);
      const [sql, params] = queryMock.mock.calls[0];
      // No courseId filter should be applied when courseId is not provided
      expect(sql).not.toContain('AND lp.course_id =');
      expect(sql).not.toContain('Stryker was here!');
      expect(params).toEqual([7, 5]);
    });

    it('uses default limit when only userId is provided', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ lesson_title: 'L0' }] });
      const res = await repo.getRecentActivity(7);
      const params = queryMock.mock.calls[0][1];
      expect(params).toEqual([7, 5]);
      const [sql] = queryMock.mock.calls[0];
      expect(sql).not.toContain('Stryker was here!');
      expect(res).toEqual([{ lesson_title: 'L0' }]);
    });

    it('applies courseId filter', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ lesson_title: 'L2' }] });
      const res = await repo.getRecentActivity(7, 10, '4');
      const [sql] = queryMock.mock.calls[0];
      expect(sql).toContain('lp.course_id = 4');
      expect(sql).not.toContain('Stryker was here!');
      expect(res[0].lesson_title).toBe('L2');
    });
  });
});
