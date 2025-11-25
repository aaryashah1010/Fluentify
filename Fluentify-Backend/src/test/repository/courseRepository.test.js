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
    expect(await repo.findActiveCourseByLanguage(7, 'English')).toEqual({ id: 1 });
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
    const params = queryMock.mock.calls[0][1];
    expect(params[3]).toMatch(/Learning Journey/);
  });

  it('updateCourseData updates totals and data', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.updateCourseData(5, { metadata: { totalLessons: 2, totalUnits: 1, estimatedTotalTime: 30 } });
    expect(queryMock).toHaveBeenCalled();
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
      expect(lesson1Params[6]).toEqual(['k1']);
      expect(lesson1Params[8]).toBe(JSON.stringify({ g: 1 }));
      expect(lesson1Params[10]).toBe(25);
      expect(lesson1Params[11]).toBe(80);

      // Lesson 2 params - all defaults
      const lesson2Params = queryMock.mock.calls[2][1];
      expect(lesson2Params[4]).toBe('vocabulary');
      expect(lesson2Params[6]).toEqual([]);
      expect(lesson2Params[8]).toBe(JSON.stringify({}));
      expect(lesson2Params[9]).toBe(JSON.stringify([]));
      expect(lesson2Params[10]).toBe(15);
      expect(lesson2Params[11]).toBe(50);
    });
  });

  it('findLessonDbId returns id or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 42 }] });
    expect(await repo.findLessonDbId(1, 2, 3)).toBe(42);
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.findLessonDbId(1, 2, 3)).toBeNull();
  });

  it('findLearnerCoursesWithStats returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const rows = await repo.findLearnerCoursesWithStats(7);
    expect(rows).toEqual([{ id: 1 }]);
  });

  it('findCourseById returns row or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    expect(await repo.findCourseById(1, 7)).toEqual({ id: 1 });
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.findCourseById(1, 7)).toBeNull();
  });

  it('findCourseDataById returns object or null', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ course_data: { a: 1 } }] });
    expect(await repo.findCourseDataById(1, 7)).toEqual({ course_data: { a: 1 } });
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.findCourseDataById(1, 7)).toBeNull();
  });

  it('deleteCourse returns false when not belongs, true when deleted', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.deleteCourse(1, 7)).toBe(false);
    // belongs then delete
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({});
    expect(await repo.deleteCourse(1, 7)).toBe(true);
  });

  it('updateLessonExercises stringifies and updates', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.updateLessonExercises(33, [{ n: 1 }]);
    const params = queryMock.mock.calls[0][1];
    expect(params[0]).toBe(JSON.stringify([{ n: 1 }]));
  });

  it('findAllActiveCourses returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }, { id: 2 }] });
    const rows = await repo.findAllActiveCourses(7);
    expect(rows.length).toBe(2);
  });

  it('getPublishedLanguages returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ language: 'English' }] });
    expect(await repo.getPublishedLanguages()).toEqual([{ language: 'English' }]);
  });

  it('getPublishedCoursesByLanguage returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    expect(await repo.getPublishedCoursesByLanguage('English')).toEqual([{ id: 1 }]);
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
    });
  });
});
