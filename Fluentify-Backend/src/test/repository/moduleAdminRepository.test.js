import { jest } from '@jest/globals';

// Mock db
const queryMock = jest.fn();
await jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));

const repo = (await import('../../repositories/moduleAdminRepository.js')).default;

describe('moduleAdminRepository', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getLanguages returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ language: 'English', course_count: 1 }] });
    expect(await repo.getLanguages()).toEqual([{ language: 'English', course_count: 1 }]);
  });

  it('getCoursesByLanguage returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    expect(await repo.getCoursesByLanguage('English')).toEqual([{ id: 1 }]);
  });

  it('createCourse inserts and returns row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 9, is_published: false }] });
    const r = await repo.createCourse({ admin_id: 1, language: 'E', level: 'A1', title: 'T', description: 'D', thumbnail_url: 'u', estimated_duration: 10 });
    expect(r).toEqual({ id: 9, is_published: false });
  });

  describe('getCourseDetails', () => {
    it('returns null when not found', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      expect(await repo.getCourseDetails(1)).toBeNull();
    });
    it('returns course with units and lessons', async () => {
      queryMock
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // course
        .mockResolvedValueOnce({ rows: [{ id: 10 }] }) // units
        .mockResolvedValueOnce({ rows: [{ id: 100 }] }); // lessons for unit 10
      const course = await repo.getCourseDetails(1);
      expect(course.units[0].lessons[0].id).toBe(100);
    });
  });

  it('updateCourse returns updated row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1, title: 'New' }] });
    const r = await repo.updateCourse(1, { title: 'New' });
    expect(r.title).toBe('New');
  });

  it('deleteCourse returns deleted row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    expect(await repo.deleteCourse(1)).toEqual({ id: 1 });
  });

  it('updateCourseCounts performs update', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.updateCourseCounts(1);
    expect(queryMock).toHaveBeenCalled();
  });

  it('createUnit inserts and updates counts', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 10, module_id: 1 }] }) // insert unit
      .mockResolvedValueOnce({}); // update counts
    const r = await repo.createUnit({ module_id: 1, title: 'U', description: 'D', difficulty: 'easy', estimated_time: 0 });
    expect(r.id).toBe(10);
  });

  it('getUnitById returns row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 10 }] });
    expect(await repo.getUnitById(10)).toEqual({ id: 10 });
  });

  it('updateUnit returns row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 10, title: 'New' }] });
    expect(await repo.updateUnit(10, { title: 'New' })).toEqual({ id: 10, title: 'New' });
  });

  it('deleteUnit returns row and updates counts, null when not found', async () => {
    // not found path
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.deleteUnit(10)).toBeNull();
    // found path
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 10, module_id: 1 }] }) // getUnitById
      .mockResolvedValueOnce({ rows: [{ id: 10 }] }) // delete
      .mockResolvedValueOnce({}); // update counts
    const r = await repo.deleteUnit(10);
    expect(r).toEqual({ id: 10 });
  });

  it('createLesson inserts and updates counts', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 100 }] }) // insert
      .mockResolvedValueOnce({ rows: [{ id: 10, module_id: 1 }] }) // getUnitById
      .mockResolvedValueOnce({}); // update counts
    const r = await repo.createLesson({ unit_id: 10, title: 'L', content_type: 'text' });
    expect(r.id).toBe(100);
  });

  it('getLessonById returns row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 100 }] });
    expect(await repo.getLessonById(100)).toEqual({ id: 100 });
  });

  it('updateLesson returns row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 100, title: 'New' }] });
    expect(await repo.updateLesson(100, { title: 'New' })).toEqual({ id: 100, title: 'New' });
  });

  it('deleteLesson returns null when missing and row when found, updates counts', async () => {
    // missing
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.deleteLesson(100)).toBeNull();
    // found
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 100, unit_id: 10 }] }) // getLessonById
      .mockResolvedValueOnce({ rows: [{ id: 10, module_id: 1 }] }) // getUnitById
      .mockResolvedValueOnce({ rows: [{ id: 100 }] }) // delete
      .mockResolvedValueOnce({}); // update counts
    const r = await repo.deleteLesson(100);
    expect(r).toEqual({ id: 100 });
  });

  it('getPublishedLanguages returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ language: 'English' }] });
    expect(await repo.getPublishedLanguages()).toEqual([{ language: 'English' }]);
  });

  it('getPublishedCoursesByLanguage returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    expect(await repo.getPublishedCoursesByLanguage('English')).toEqual([{ id: 1 }]);
  });

  it('getPublishedCourseDetails returns null or details', async () => {
    // null
    queryMock.mockResolvedValueOnce({ rows: [] });
    expect(await repo.getPublishedCourseDetails(1)).toBeNull();
    // details
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // course
      .mockResolvedValueOnce({ rows: [{ id: 10 }] }) // units
      .mockResolvedValueOnce({ rows: [{ id: 100 }] }); // lessons for unit 10
    const r = await repo.getPublishedCourseDetails(1);
    expect(r.units[0].lessons[0].id).toBe(100);
  });
});
