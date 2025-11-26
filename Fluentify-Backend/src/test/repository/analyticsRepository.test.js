import { jest } from '@jest/globals';

// Mock db
const queryMock = jest.fn();
await jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));

const repo = (await import('../../repositories/analyticsRepository.js')).default;

describe('analyticsRepository', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('logEvent', () => {
    it('inserts learning_logs row and returns true', async () => {
      queryMock.mockResolvedValueOnce({});
      const ok = await repo.logEvent(1, 'LESSON_COMPLETED', 'English', 'AI', 60, { a: 1 });
      expect(ok).toBe(true);
      const params = queryMock.mock.calls[0][1];
      expect(params).toEqual([1, 'LESSON_COMPLETED', 'English', 'AI', 60, JSON.stringify({ a: 1 })]);
    });
    it('supports optional duration and metadata defaults', async () => {
      queryMock.mockResolvedValueOnce({});
      const ok = await repo.logEvent(2, 'START_SESSION', 'French', 'ADMIN');
      expect(ok).toBe(true);
      const params = queryMock.mock.calls[0][1];
      expect(params).toEqual([2, 'START_SESSION', 'French', 'ADMIN', null, JSON.stringify({})]);
    });

  // ===== Additional error-path coverage for catch branches =====
  it('getLanguageDistribution propagates db errors', async () => {
    queryMock.mockRejectedValueOnce(new Error('db'));
    await expect(repo.getLanguageDistribution()).rejects.toThrow('db');
  });

  it('getModuleUsage propagates db errors', async () => {
    queryMock.mockRejectedValueOnce(new Error('db'));
    await expect(repo.getModuleUsage()).rejects.toThrow('db');
  });

  it('getAIPerformance propagates db errors', async () => {
    queryMock.mockRejectedValueOnce(new Error('db'));
    await expect(repo.getAIPerformance()).rejects.toThrow('db');
  });

  it('getDailyActivity propagates db errors (covered)', async () => {
    queryMock.mockRejectedValueOnce(new Error('db'));
    await expect(repo.getDailyActivity(30)).rejects.toThrow('db');
  });

  it('getUserEngagement propagates db errors (covered)', async () => {
    queryMock.mockRejectedValueOnce(new Error('db'));
    await expect(repo.getUserEngagement()).rejects.toThrow('db');
  });

  it('getLessonCompletionTrends propagates db errors (covered)', async () => {
    queryMock.mockRejectedValueOnce(new Error('db'));
    await expect(repo.getLessonCompletionTrends(30)).rejects.toThrow('db');
  });

  it('getAverageLessonDuration propagates db errors (covered)', async () => {
    queryMock.mockRejectedValueOnce(new Error('db'));
    await expect(repo.getAverageLessonDuration()).rejects.toThrow('db');
  });

  it('getRealTimeStats propagates db errors (covered)', async () => {
    queryMock.mockRejectedValueOnce(new Error('db'));
    await expect(repo.getRealTimeStats()).rejects.toThrow('db');
  });

  it('getDailyActivity propagates db errors', async () => {
    queryMock.mockRejectedValueOnce(new Error('db'));
    await expect(repo.getDailyActivity(7)).rejects.toThrow('db');
  });
    it('propagates error and logs', async () => {
      queryMock.mockRejectedValueOnce(new Error('db'));
      await expect(repo.logEvent(1,'E','L','M',null,{})).rejects.toThrow('db');
    });
  });

  it('getLanguageDistribution aggregates duplicates and sorts', async () => {
    queryMock.mockResolvedValueOnce({ rows: [
      { language_name: 'English', count: 1 },
      { language_name: 'French', count: 2 },
      { language_name: 'English', count: 3 },
    ]});
    const rows = await repo.getLanguageDistribution();
    expect(rows[0]).toEqual({ language_name: 'English', count: 4 });
    expect(rows[1]).toEqual({ language_name: 'French', count: 2 });
  });

  it('getModuleUsage returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ module_type: 'AI', count: 3 }] });
    const rows = await repo.getModuleUsage();
    expect(rows).toEqual([{ module_type: 'AI', count: 3 }]);
  });

  it('getAIPerformance returns row or default', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ total_generations: 5, success_count: 4, failure_count: 1 }] });
    expect(await repo.getAIPerformance()).toEqual({ total_generations: 5, success_count: 4, failure_count: 1 });
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.getAIPerformance()).toEqual({ total_generations: 0, success_count: 0, failure_count: 0 });
  });

  it('getDailyActivity parameterizes days and returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ date: '2025-01-01', total_activities: 1, active_users: 1 }] });
    const rows = await repo.getDailyActivity(7);
    expect(rows).toHaveLength(1);
    const params = queryMock.mock.calls[0][1];
    expect(params).toEqual([7]);
  });

  it('getDailyActivity uses default days when not provided', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });
    await repo.getDailyActivity();
    const params = queryMock.mock.calls[0][1];
    expect(params).toEqual([30]);
  });

  it('getDailyActivity falls back to 30 when days is invalid', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });
    await repo.getDailyActivity('invalid');
    const params = queryMock.mock.calls[0][1];
    expect(params).toEqual([30]);
  });

  it('getUserEngagement returns row or default', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ total_active_users: 2, avg_lessons_per_user: 1.5, max_lessons_per_user: 3 }] });
    expect(await repo.getUserEngagement()).toEqual({ total_active_users: 2, avg_lessons_per_user: 1.5, max_lessons_per_user: 3 });
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.getUserEngagement()).toEqual({ total_active_users: 0, avg_lessons_per_user: 0, max_lessons_per_user: 0 });
  });

  it('getLessonCompletionTrends parameterizes days and returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ date: '2025-01-01', module_type: 'AI', completions: 2 }] });
    const rows = await repo.getLessonCompletionTrends(14);
    expect(rows).toEqual([{ date: '2025-01-01', module_type: 'AI', completions: 2 }]);
    const params = queryMock.mock.calls[0][1];
    expect(params).toEqual([14]);
  });

  it('getLessonCompletionTrends uses default days when not provided', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });
    await repo.getLessonCompletionTrends();
    const params = queryMock.mock.calls[0][1];
    expect(params).toEqual([30]);
  });

  it('getLessonCompletionTrends falls back to 30 when days is invalid', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });
    await repo.getLessonCompletionTrends('invalid');
    const params = queryMock.mock.calls[0][1];
    expect(params).toEqual([30]);
  });

  it('getAverageLessonDuration returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ module_type: 'AI', language_name: 'English', avg_duration_seconds: 100, total_lessons: 3 }] });
    const rows = await repo.getAverageLessonDuration();
    expect(rows).toHaveLength(1);
  });

  it('getRealTimeStats returns row or default', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ total_lessons: 1, active_users: 1, popular_language: 'English', ai_courses_generated: 1, avg_generation_time: 10, total_xp_earned: 5 }] });
    expect(await repo.getRealTimeStats()).toEqual({ total_lessons: 1, active_users: 1, popular_language: 'English', ai_courses_generated: 1, avg_generation_time: 10, total_xp_earned: 5 });
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.getRealTimeStats()).toEqual({ total_lessons: 0, active_users: 0, popular_language: 'N/A', ai_courses_generated: 0, avg_generation_time: 0, total_xp_earned: 0 });
  });
});
