import { jest } from '@jest/globals';

// Mock db
const queryMock = jest.fn();
await jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));

const repo = (await import('../../repositories/courseRepository.js')).default;

describe('courseRepository', () => {
  beforeEach(() => {
    // reset all mocks and clear any queued mockResolvedValueOnce values
    jest.clearAllMocks();
    jest.restoreAllMocks();
    queryMock.mockReset();
  });

  it('findActiveCourseByLanguage returns row or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const row = await repo.findActiveCourseByLanguage(7, 'English');
    expect(row).toEqual({ id: 1 });
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toBe('SELECT * FROM courses WHERE learner_id = $1 AND language = $2 AND is_active = $3');
    expect(params).toEqual([7, 'English', true]);
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.findActiveCourseByLanguage(7, 'English')).toBeNull();
  });

  it('createCourse builds defaults and calls populateCourseStructure', async () => {
    // INSERT returns id
    queryMock.mockResolvedValueOnce({ rows: [{ id: 99 }] });
    const spy = jest.spyOn(repo, 'populateCourseStructure').mockResolvedValue();
    const courseData = { course: {}, metadata: {} };
    const id = await repo.createCourse(7, 'Spanish', '3 months', courseData);
    expect(id).toBe(99);
    expect(spy).toHaveBeenCalledWith(99, courseData);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('INSERT INTO courses');
    expect(sql).toContain('(\n        learner_id, language, expected_duration, title, description,');
    expect(sql).toContain('VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())');
    // Defaults should be applied when course and metadata fields are missing
    expect(params).toEqual([
      7,
      'Spanish',
      '3 months',
      'Spanish Learning Journey',
      'Learn Spanish in 3 months',
      0,
      0,
      0,
      courseData,
      true,
    ]);
    spy.mockRestore();
  });

  it('createCourse handles missing course and metadata using safe optional chaining defaults', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 101 }] });
    const spy = jest.spyOn(repo, 'populateCourseStructure').mockResolvedValue();
    const courseData = {}; // no course or metadata objects
    const id = await repo.createCourse(5, 'French', '6 months', courseData);
    expect(id).toBe(101);
    expect(spy).toHaveBeenCalledWith(101, courseData);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('INSERT INTO courses');
    expect(params).toEqual([
      5,
      'French',
      '6 months',
      'French Learning Journey',
      'Learn French in 6 months',
      0,
      0,
      0,
      courseData,
      true,
    ]);
    spy.mockRestore();
  });

  it('updateCourseData updates totals and data', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.updateCourseData(5, { metadata: { totalLessons: 2, totalUnits: 1, estimatedTotalTime: 30 } });
    expect(queryMock).toHaveBeenCalledTimes(1);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('UPDATE courses');
    expect(sql).toContain('SET course_data = $1');
    expect(sql).toContain('total_lessons = $2');
    expect(sql).toContain('total_units = $3');
    expect(sql).toContain('estimated_total_time = $4');
    expect(sql).toContain('WHERE id = $5');
    expect(params).toEqual([
      { metadata: { totalLessons: 2, totalUnits: 1, estimatedTotalTime: 30 } },
      2,
      1,
      30,
      5,
    ]);
  });

  it('updateCourseData uses default zeros when metadata missing', async () => {
    queryMock.mockResolvedValueOnce({});
    const data = {}; // no metadata
    await repo.updateCourseData(9, data);
    const params = queryMock.mock.calls[0][1];
    // [courseData, totalLessons, totalUnits, estimatedTotalTime, courseId]
    expect(params).toEqual([data, 0, 0, 0, 9]);
  });

  describe('populateCourseStructure', () => {
    it('inserts units and lessons, handles empty lessons', async () => {
      // For two units, return ids 10 and 11
      queryMock
        .mockResolvedValueOnce({ rows: [{ id: 10 }] }) // unit #1
        .mockResolvedValueOnce({}) // lesson 1 insert
        .mockResolvedValueOnce({ rows: [{ id: 11 }] }); // unit #2 (no lessons)
      const courseData = {
        course: {
          units: [
            { id: 1, title: 'U1', description: 'd', difficulty: 'easy', estimatedTime: '150', lessons: [ { id: 1, title: 'L1' } ] },
            { id: 2, title: 'U2', description: 'd', difficulty: 'easy', estimatedTime: '120', lessons: [] },
          ]
        }
      };
      await repo.populateCourseStructure(1, courseData);
      expect(queryMock).toHaveBeenCalledTimes(3);
      // First and third calls are unit inserts, second call is lesson insert
      const [unitSql1] = queryMock.mock.calls[0];
      const [lessonSql] = queryMock.mock.calls[1];
      const [unitSql2] = queryMock.mock.calls[2];
      expect(unitSql1).toContain('INSERT INTO course_units');
      expect(unitSql2).toContain('INSERT INTO course_units');
      expect(lessonSql).toContain('INSERT INTO course_lessons');
    });

    it('handles non-numeric estimatedTime and lesson field fallbacks', async () => {
      queryMock
        .mockResolvedValueOnce({ rows: [{ id: 20 }] }) // unit insert
        .mockResolvedValueOnce({}) // lesson #1 insert
        .mockResolvedValueOnce({}); // lesson #2 insert

      const courseData = {
        course: {
          units: [
            {
              id: 1,
              title: 'U1',
              description: 'd',
              difficulty: 'easy',
              // non-numeric string: should fall back to regex match ("200")
              estimatedTime: 'about 200 mins',
              lessons: [
                {
                  id: 1,
                  title: 'L1',
                  lessonType: 'reading', // used when type missing
                  description: null,
                  key_phrases: ['k1'],
                  grammar_points: { g: 1 },
                  exercises: [{ q: 1 }],
                  duration: 25,
                  xp_reward: 80,
                },
                {
                  id: 2,
                  title: 'L2',
                  // no type / lessonType -> default 'vocabulary'
                  // no description -> ''
                  // no keyPhrases/key_phrases -> []
                  // no grammarPoints/grammar_points -> {}
                  // no exercises -> []
                  // no duration/estimatedDuration -> 15
                  // no xpReward/xp_reward -> 50
                },
              ],
            },
          ],
        },
      };

      await repo.populateCourseStructure(5, courseData);

      // First call: unit insert, check estimated_time param
      const unitParams = queryMock.mock.calls[0][1];
      expect(unitParams[5]).toBe('200');

      // Lesson 1 params
      const lesson1Params = queryMock.mock.calls[1][1];
      expect(lesson1Params[4]).toBe('reading');
      expect(lesson1Params[5]).toBe('');
      expect(lesson1Params[6]).toEqual(['k1']);
      expect(lesson1Params[7]).toBe(JSON.stringify({}));
      expect(lesson1Params[8]).toBe(JSON.stringify({ g: 1 }));
      expect(lesson1Params[10]).toBe(25);
      expect(lesson1Params[11]).toBe(80);

      // Lesson 2 params - all defaults
      const lesson2Params = queryMock.mock.calls[2][1];
      expect(lesson2Params[4]).toBe('vocabulary');
      expect(lesson2Params[6]).toEqual([]);
      expect(lesson2Params[7]).toBe(JSON.stringify({}));
      expect(lesson2Params[8]).toBe(JSON.stringify({}));
      expect(lesson2Params[9]).toBe(JSON.stringify([]));
      expect(lesson2Params[10]).toBe(15);
      expect(lesson2Params[11]).toBe(50);
    });

    it('handles missing course object by treating units as empty array', async () => {
      const courseData = {}; // no course key at all
      await repo.populateCourseStructure(1, courseData);
      // When there is no course, no INSERTs should be performed
      expect(queryMock).not.toHaveBeenCalled();
    });

    it('handles units without lessons property by treating lessons as empty array', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 30 }] }); // unit insert only
      const courseData = {
        course: {
          units: [
            { id: 1, title: 'U1', description: 'd', difficulty: 'easy', estimatedTime: '100' }, // no lessons field
          ],
        },
      };
      await repo.populateCourseStructure(2, courseData);
      // Only the unit insert should have occurred
      expect(queryMock).toHaveBeenCalledTimes(1);
      const [sql] = queryMock.mock.calls[0];
      expect(sql).toContain('INSERT INTO course_units');
    });

    it('falls back to default estimated time when estimatedTime is missing', async () => {
      queryMock.mockResolvedValueOnce({ rows: [{ id: 40 }] });
      const courseData = {
        course: {
          units: [
            {
              id: 1,
              title: 'U1',
              description: 'd',
              difficulty: 'easy',
              // no estimatedTime provided -> should use fallback 150
            },
          ],
        },
      };
      await repo.populateCourseStructure(3, courseData);
      const unitParams = queryMock.mock.calls[0][1];
      expect(unitParams[5]).toBe(150);
    });
  });

  it('findLessonDbId returns id or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 42 }] });
    expect(await repo.findLessonDbId(1, 2, 3)).toBe(42);
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.findLessonDbId(1, 2, 3)).toBeNull();
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('FROM course_lessons cl');
    expect(sql).toContain('JOIN course_units cu ON cl.unit_id = cu.id');
    expect(sql).toContain('WHERE cl.course_id = $1 AND cu.unit_id = $2 AND cl.lesson_id = $3');
    expect(params).toEqual([1, 2, 3]);
  });

  it('findLearnerCoursesWithStats returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const rows = await repo.findLearnerCoursesWithStats(7);
    expect(rows).toEqual([{ id: 1 }]);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('FROM courses c');
    expect(sql).toContain('UNION ALL');
    expect(sql).toContain('FROM learner_enrollments le');
    expect(sql).toContain('ORDER BY created_at DESC');
    expect(params).toEqual([7]);
  });

  it('findCourseById returns row or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    expect(await repo.findCourseById(1, 7)).toEqual({ id: 1 });
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.findCourseById(1, 7)).toBeNull();
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toBe('SELECT * FROM courses WHERE id = $1 AND learner_id = $2 AND is_active = $3');
    expect(params).toEqual([1, 7, true]);
  });

  it('findCourseDataById returns object or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ course_data: { a: 1 } }] });
    expect(await repo.findCourseDataById(1, 7)).toEqual({ course_data: { a: 1 } });
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.findCourseDataById(1, 7)).toBeNull();
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toBe('SELECT course_data FROM courses WHERE id = $1 AND learner_id = $2 AND is_active = $3');
    expect(params).toEqual([1, 7, true]);
  });

  it('deleteCourse returns false when not belongs, true when deleted', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.deleteCourse(1, 7)).toBe(false);
    // belongs then delete
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({});
    expect(await repo.deleteCourse(1, 7)).toBe(true);
    // First call in the second scenario is the SELECT, second is DELETE
    const [selectSql, selectParams] = queryMock.mock.calls[1];
    const [deleteSql, deleteParams] = queryMock.mock.calls[2];
    expect(selectSql).toBe('SELECT * FROM courses WHERE id = $1 AND learner_id = $2');
    expect(selectParams).toEqual([1, 7]);
    expect(deleteSql).toBe('DELETE FROM courses WHERE id = $1 AND learner_id = $2');
    expect(deleteParams).toEqual([1, 7]);
  });

  it('updateLessonExercises stringifies and updates', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.updateLessonExercises(33, [{ n: 1 }]);
    const params = queryMock.mock.calls[0][1];
    expect(params[0]).toBe(JSON.stringify([{ n: 1 }]));
    const [sql] = queryMock.mock.calls[0];
    expect(sql).toContain('UPDATE course_lessons');
    expect(sql).toContain('SET exercises = $1::jsonb, updated_at = NOW()');
    expect(sql).toContain('WHERE id = $2');
  });

  it('findAllActiveCourses returns rows', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }, { id: 2 }] });
    const rows = await repo.findAllActiveCourses(7);
    expect(rows.length).toBe(2);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('FROM courses c');
    expect(sql).toContain('UNION ALL');
    expect(sql).toContain('FROM language_modules lm');
    expect(sql).toContain('ORDER BY created_at DESC');
    expect(params).toEqual([7]);
    expect(logSpy).toHaveBeenCalledWith('📊 Fetching courses for userId:', 7);
    expect(logSpy).toHaveBeenCalledWith(`✅ Found ${rows.length} courses for user 7`);
    // At least one detailed course log line
    expect(logSpy).toHaveBeenCalledWith(
      `  - ${rows[0].title} (${rows[0].source_type}) - learner_id: ${rows[0].learner_id || 'N/A (admin course)'}`
    );
    logSpy.mockRestore();
  });

  it('getPublishedLanguages returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ language: 'English' }] });
    const rows = await repo.getPublishedLanguages();
    expect(rows).toEqual([{ language: 'English' }]);
    const [sql] = queryMock.mock.calls[0];
    expect(sql).toContain('FROM language_modules');
    expect(sql).toContain('WHERE is_published = true');
    expect(sql).toContain('GROUP BY language');
  });

  it('getPublishedCoursesByLanguage returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const rows = await repo.getPublishedCoursesByLanguage('English');
    expect(rows).toEqual([{ id: 1 }]);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('FROM language_modules');
    expect(sql).toContain('WHERE language = $1 AND is_published = true');
    expect(params).toEqual(['English']);
  });

  describe('getPublishedCourseDetails', () => {
    it('returns null when not found', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.getPublishedCourseDetails(1)).toBeNull();
    });
    it('returns course with units and lessons', async () => {
      // course
      queryMock
        .mockResolvedValueOnce({ rows: [{ id: 1, title: 'T' }] })
        // units
        .mockResolvedValueOnce({ rows: [{ id: 10 }] })
        // lessons for unit 10
        .mockResolvedValueOnce({ rows: [{ id: 100 }] });
      const res = await repo.getPublishedCourseDetails(1);
      expect(res.id).toBe(1);
      expect(res.units[0].lessons[0].id).toBe(100);
      const [courseSql, courseParams] = queryMock.mock.calls[0];
      const [unitsSql, unitsParams] = queryMock.mock.calls[1];
      const [lessonsSql, lessonsParams] = queryMock.mock.calls[2];
      expect(courseSql).toContain('FROM language_modules');
      expect(courseSql).toContain('WHERE id = $1 AND is_published = true');
      expect(courseParams).toEqual([1]);
      expect(unitsSql).toContain('FROM module_units');
      expect(unitsSql).toContain('WHERE module_id = $1');
      expect(unitsParams).toEqual([1]);
      expect(lessonsSql).toContain('FROM module_lessons');
      expect(lessonsSql).toContain('WHERE unit_id = $1');
      expect(lessonsParams).toEqual([10]);
    });
  });
});
