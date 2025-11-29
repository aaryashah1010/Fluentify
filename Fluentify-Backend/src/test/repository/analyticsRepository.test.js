import { jest } from '@jest/globals';

// Mock db
const queryMock = jest.fn();
await jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));

const repo = (await import('../../repositories/analyticsRepository.js')).default;

describe('analyticsRepository', () => {
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

  describe('logEvent', () => {
    it('inserts learning_logs row and returns true', async () => {
      queryMock.mockResolvedValueOnce({});
      const ok = await repo.logEvent(1, 'LESSON_COMPLETED', 'English', 'AI', 60, { a: 1 });
      expect(ok).toBe(true);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('INSERT INTO learning_logs');
      expect(sql).toContain('(user_id, event_type, language_name, module_type, duration_seconds, metadata)');
      expect(sql).toContain('VALUES ($1, $2, $3, $4, $5, $6);');
      expect(params).toEqual([1, 'LESSON_COMPLETED', 'English', 'AI', 60, JSON.stringify({ a: 1 })]);
    });
    it('supports optional duration and metadata defaults', async () => {
      queryMock.mockResolvedValueOnce({});
      const ok = await repo.logEvent(2, 'START_SESSION', 'French', 'ADMIN');
      expect(ok).toBe(true);
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toContain('INSERT INTO learning_logs');
      expect(sql).toContain('(user_id, event_type, language_name, module_type, duration_seconds, metadata)');
      expect(sql).toContain('VALUES ($1, $2, $3, $4, $5, $6);');
      expect(params).toEqual([2, 'START_SESSION', 'French', 'ADMIN', null, JSON.stringify({})]);
    });

  // ===== Additional error-path coverage for catch branches =====
  it('getLanguageDistribution propagates db errors', async () => {
    const err = new Error('db');
    queryMock.mockRejectedValueOnce(err);
    await expect(repo.getLanguageDistribution()).rejects.toThrow('db');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting language distribution:', err);
  });

  it('getModuleUsage propagates db errors', async () => {
    const err = new Error('db');
    queryMock.mockRejectedValueOnce(err);
    await expect(repo.getModuleUsage()).rejects.toThrow('db');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting module usage:', err);
  });

  it('getAIPerformance propagates db errors', async () => {
    const err = new Error('db');
    queryMock.mockRejectedValueOnce(err);
    await expect(repo.getAIPerformance()).rejects.toThrow('db');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting AI performance:', err);
  });

  it('getDailyActivity propagates db errors (covered)', async () => {
    const err = new Error('db');
    queryMock.mockRejectedValueOnce(err);
    await expect(repo.getDailyActivity(30)).rejects.toThrow('db');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting daily activity:', err);
  });

  it('getUserEngagement propagates db errors (covered)', async () => {
    const err = new Error('db');
    queryMock.mockRejectedValueOnce(err);
    await expect(repo.getUserEngagement()).rejects.toThrow('db');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting user engagement:', err);
  });

  it('getLessonCompletionTrends propagates db errors (covered)', async () => {
    const err = new Error('db');
    queryMock.mockRejectedValueOnce(err);
    await expect(repo.getLessonCompletionTrends(30)).rejects.toThrow('db');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting lesson completion trends:', err);
  });

  it('getAverageLessonDuration propagates db errors (covered)', async () => {
    const err = new Error('db');
    queryMock.mockRejectedValueOnce(err);
    await expect(repo.getAverageLessonDuration()).rejects.toThrow('db');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting average lesson duration:', err);
  });

  it('getRealTimeStats propagates db errors (covered)', async () => {
    const err = new Error('db');
    queryMock.mockRejectedValueOnce(err);
    await expect(repo.getRealTimeStats()).rejects.toThrow('db');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting real-time stats:', err);
  });

  it('getDailyActivity propagates db errors', async () => {
    const err = new Error('db');
    queryMock.mockRejectedValueOnce(err);
    await expect(repo.getDailyActivity(7)).rejects.toThrow('db');
  });
    it('propagates error and logs', async () => {
      const err = new Error('db');
      queryMock.mockRejectedValueOnce(err);
      await expect(repo.logEvent(1,'E','L','M',null,{})).rejects.toThrow('db');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error logging analytics event:', err);
    });
  });

  it('getLanguageDistribution aggregates duplicates and sorts by count desc', async () => {
    queryMock.mockResolvedValueOnce({ rows: [
      { language_name: 'English', count: 1 },
      { language_name: 'French', count: 5 },
      { language_name: 'English', count: 0 },
    ]});
    const rows = await repo.getLanguageDistribution();
    // Aggregation: English 1+0 = 1, French 5; sorted should put French first
    expect(rows).toEqual([
      { language_name: 'French', count: 5 },
      { language_name: 'English', count: 1 },
    ]);

    const [sql] = queryMock.mock.calls[0];
    expect(sql).toContain('FROM courses c');
    expect(sql).toContain('UNION ALL');
    expect(sql).toContain('FROM language_modules lm');
    expect(sql).toContain('ORDER BY count DESC;');
  });

  it('getModuleUsage returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ module_type: 'AI', count: 3 }] });
    const rows = await repo.getModuleUsage();
    expect(rows).toEqual([{ module_type: 'AI', count: 3 }]);
    const [sql] = queryMock.mock.calls[0];
    expect(sql).toContain('FROM learning_logs');
    expect(sql).toContain("WHERE event_type = 'LESSON_COMPLETED'");
    expect(sql).toContain('GROUP BY module_type');
  });

  it('getAIPerformance returns row or default', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ total_generations: 5, success_count: 4, failure_count: 1 }] });
    expect(await repo.getAIPerformance()).toEqual({ total_generations: 5, success_count: 4, failure_count: 1 });
    const [sqlFirst] = queryMock.mock.calls[0];
    expect(sqlFirst).toContain('FROM learning_logs');
    expect(sqlFirst).toContain("WHERE event_type = 'AI_MODULE_GENERATED'");
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.getAIPerformance()).toEqual({ total_generations: 0, success_count: 0, failure_count: 0 });
  });

  it('getDailyActivity parameterizes days and returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ date: '2025-01-01', total_activities: 1, active_users: 1 }] });
    const rows = await repo.getDailyActivity(7);
    expect(rows).toHaveLength(1);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('FROM learning_logs');
    expect(sql).toContain("WHERE created_at >= NOW() - INTERVAL '1 day' * $1");
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
    const [sqlFirst] = queryMock.mock.calls[0];
    expect(sqlFirst).toContain('FROM learning_logs');
    expect(sqlFirst).toContain("WHERE event_type = 'LESSON_COMPLETED'");
    expect(sqlFirst).toContain('user_daily_stats');
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.getUserEngagement()).toEqual({ total_active_users: 0, avg_lessons_per_user: 0, max_lessons_per_user: 0 });
  });

  it('getLessonCompletionTrends parameterizes days and returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ date: '2025-01-01', module_type: 'AI', completions: 2 }] });
    const rows = await repo.getLessonCompletionTrends(14);
    expect(rows).toEqual([{ date: '2025-01-01', module_type: 'AI', completions: 2 }]);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('FROM learning_logs');
    expect(sql).toContain("WHERE event_type = 'LESSON_COMPLETED'");
    expect(sql).toContain('ORDER BY date DESC, module_type;');
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
    const [sql] = queryMock.mock.calls[0];
    expect(sql).toContain('AVG(duration_seconds) as avg_duration_seconds');
    expect(sql).toContain("WHERE event_type = 'LESSON_COMPLETED'");
  });

  it('getRealTimeStats returns row or default', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ total_lessons: 1, active_users: 1, popular_language: 'English', ai_courses_generated: 1, avg_generation_time: 10, total_xp_earned: 5 }] });
    expect(await repo.getRealTimeStats()).toEqual({ total_lessons: 1, active_users: 1, popular_language: 'English', ai_courses_generated: 1, avg_generation_time: 10, total_xp_earned: 5 });
    const [sqlFirst] = queryMock.mock.calls[0];
    expect(sqlFirst).toContain('FROM lesson_progress');
    expect(sqlFirst).toContain('total_xp_earned');
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.getRealTimeStats()).toEqual({ total_lessons: 0, active_users: 0, popular_language: 'N/A', ai_courses_generated: 0, avg_generation_time: 0, total_xp_earned: 0 });
  });
});
