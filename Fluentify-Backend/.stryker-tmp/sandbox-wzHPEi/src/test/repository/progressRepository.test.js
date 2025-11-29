// @ts-nocheck
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
    expect(queryMock).toHaveBeenCalled();
    expect(res).toEqual([{ unit_id: 1 }]);
  });

  it('findLessonProgress returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ unit_id: 1, lesson_id: 2 }] });
    const res = await repo.findLessonProgress(7, 1);
    expect(res[0].lesson_id).toBe(2);
  });

  it('findSpecificLessonProgress returns row or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 10 }] });
    expect(await repo.findSpecificLessonProgress(7, 1, 2, 3)).toEqual({ id: 10 });
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.findSpecificLessonProgress(7, 1, 2, 3)).toBeNull();
  });

  it('findUserStats returns row or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    expect(await repo.findUserStats(7, 1)).toEqual({ id: 1 });
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.findUserStats(7, 1)).toBeNull();
  });

  it('upsertLessonProgress performs upsert', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.upsertLessonProgress(7, 1, 2, 3, 90, 10, 5, 20);
    expect(queryMock).toHaveBeenCalled();
  });

  it('upsertLessonProgress uses default vocabulary values when omitted', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.upsertLessonProgress(7, 1, 2, 3, 90, 10);
    const params = queryMock.mock.calls[0][1];
    // [userId, courseId, unitId, lessonId, score, xpEarned, vocabularyMastered, totalVocabulary]
    expect(params.slice(-2)).toEqual([0, 0]);
  });

  it('createExerciseAttempt inserts attempt', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.createExerciseAttempt(7, 1, 2, 3, 0, true, 'answer');
    expect(queryMock).toHaveBeenCalled();
  });

  it('countCompletedLessonsInUnit parses total', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ total: '5' }] });
    expect(await repo.countCompletedLessonsInUnit(7, 1, 2)).toBe(5);
  });

  it('markUnitComplete upserts unit_progress', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.markUnitComplete(7, 1, 2);
    expect(queryMock).toHaveBeenCalled();
  });

  it('unlockUnit upserts unlock flag', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.unlockUnit(7, 1, 2);
    expect(queryMock).toHaveBeenCalled();
  });

  it('createUserStats inserts stats', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.createUserStats(7, 1, 10, 1, '2025-01-01');
    expect(queryMock).toHaveBeenCalled();
  });

  it('updateUserStreak updates streak fields', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.updateUserStreak(7, 1, 3, '2025-01-02');
    expect(queryMock).toHaveBeenCalled();
  });

  describe('initializeCourseProgress', () => {
    it('inserts unit_progress and user_stats with ON CONFLICT DO NOTHING', async () => {
      queryMock
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});
      await repo.initializeCourseProgress(1, 7);
      expect(queryMock).toHaveBeenCalledTimes(2);
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
    });

    it('applies days and courseId filters and returns row', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ total_xp: 10, lessons_completed: 2, total_vocabulary: 5, current_streak: 3, longest_streak: 4 }] });
      const res = await repo.getSummaryKPIs(7, 7, '3');
      expect(queryMock).toHaveBeenCalled();
      const [sql] = queryMock.mock.calls[0];
      expect(sql).toContain("completion_time >= NOW() - INTERVAL '7 days'");
      expect(sql).toContain('course_id = 3');
      expect(res.total_xp).toBe(10);
    });
  });

  describe('getProgressOverTime', () => {
    it('returns rows without filters', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ date: '2025-01-01' }] });
      const res = await repo.getProgressOverTime(7);
      expect(res).toEqual([{ date: '2025-01-01' }] );
    });

    it('applies days and courseId filters', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ date: '2025-01-02' }] });
      const res = await repo.getProgressOverTime(7, 30, '5');
      const [sql] = queryMock.mock.calls[0];
      expect(sql).toContain("lp.completion_time >= NOW() - INTERVAL '30 days'");
      expect(sql).toContain('lp.course_id = 5');
      expect(res[0].date).toBe('2025-01-02');
    });
  });

  describe('getRecentActivity', () => {
    it('returns rows without filter', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ lesson_title: 'L1' }] });
      const res = await repo.getRecentActivity(7, 5);
      expect(res).toEqual([{ lesson_title: 'L1' }]);
    });

    it('uses default limit when only userId is provided', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ lesson_title: 'L0' }] });
      const res = await repo.getRecentActivity(7);
      const params = queryMock.mock.calls[0][1];
      expect(params).toEqual([7, 5]);
      expect(res).toEqual([{ lesson_title: 'L0' }]);
    });

    it('applies courseId filter', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ lesson_title: 'L2' }] });
      const res = await repo.getRecentActivity(7, 10, '4');
      const [sql] = queryMock.mock.calls[0];
      expect(sql).toContain('lp.course_id = 4');
      expect(res[0].lesson_title).toBe('L2');
    });
  });
});
