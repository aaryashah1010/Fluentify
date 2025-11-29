import { jest } from '@jest/globals';

// Mock db
const queryMock = jest.fn();
await jest.unstable_mockModule('../../config/db.js', () => ({ default: { query: queryMock } }));

const repo = (await import('../../repositories/moduleAdminRepository.js')).default;

describe('moduleAdminRepository', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getLanguages returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ language: 'English', course_count: 1 }] });
    const result = await repo.getLanguages();
    expect(result).toEqual([{ language: 'English', course_count: 1 }]);
    const [sql] = queryMock.mock.calls[0];
    expect(sql).toContain('SELECT DISTINCT language, COUNT(*) as course_count');
    expect(sql).toContain('FROM language_modules');
    expect(sql).toContain('ORDER BY language');
  });

  it('getCoursesByLanguage returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const result = await repo.getCoursesByLanguage('English');
    expect(result).toEqual([{ id: 1 }]);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('FROM language_modules lm');
    expect(sql).toContain('WHERE lm.language = $1');
    expect(sql).toContain('ORDER BY lm.created_at DESC');
    expect(params).toEqual(['English']);
  });

  it('createCourse inserts and returns row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 9, is_published: false }] });
    const r = await repo.createCourse({ admin_id: 1, language: 'E', level: 'A1', title: 'T', description: 'D', thumbnail_url: 'u', estimated_duration: 10 });
    expect(r).toEqual({ id: 9, is_published: false });
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('INSERT INTO language_modules');
    expect(sql).toContain('VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())');
    expect(params).toEqual([1, 'E', 'A1', 'T', 'D', 'u', 10, false]);
  });

  describe('getCourseDetails', () => {
    it('returns null when not found', async () => {
      queryMock.mockResolvedValueOnce({ rows: [] });
      const result = await repo.getCourseDetails(1);
      expect(result).toBeNull();
      const [sql, params] = queryMock.mock.calls[0];
      expect(sql).toBe('SELECT * FROM language_modules WHERE id = $1');
      expect(params).toEqual([1]);
    });
    it('returns course with units and lessons', async () => {
      queryMock
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // course
        .mockResolvedValueOnce({ rows: [{ id: 10 }] }) // units
        .mockResolvedValueOnce({ rows: [{ id: 100 }] }); // lessons for unit 10
      const course = await repo.getCourseDetails(1);
      expect(course.units[0].lessons[0].id).toBe(100);
      const [courseSql, courseParams] = queryMock.mock.calls[0];
      expect(courseSql).toBe('SELECT * FROM language_modules WHERE id = $1');
      expect(courseParams).toEqual([1]);
      const [unitsSql, unitsParams] = queryMock.mock.calls[1];
      expect(unitsSql).toContain('FROM module_units mu');
      expect(unitsSql).toContain('WHERE mu.module_id = $1');
      expect(unitsSql).toContain('ORDER BY mu.id');
      expect(unitsParams).toEqual([1]);
      const [lessonsSql, lessonsParams] = queryMock.mock.calls[2];
      expect(lessonsSql).toContain('FROM module_lessons');
      expect(lessonsSql).toContain('WHERE unit_id = $1');
      expect(lessonsSql).toContain('ORDER BY id');
      expect(lessonsParams).toEqual([10]);
    });
  });

  it('updateCourse returns updated row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1, title: 'New' }] });
    const r = await repo.updateCourse(1, { title: 'New' });
    expect(r.title).toBe('New');
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('UPDATE language_modules');
    expect(sql).toContain('SET language = COALESCE($1, language)');
    expect(sql).toContain('WHERE id = $8');
    expect(params).toEqual([undefined, undefined, 'New', undefined, undefined, undefined, undefined, 1]);
  });

  it('deleteCourse returns deleted row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const result = await repo.deleteCourse(1);
    expect(result).toEqual({ id: 1 });
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toBe('DELETE FROM language_modules WHERE id = $1 RETURNING *');
    expect(params).toEqual([1]);
  });

  it('updateCourseCounts performs update', async () => {
    queryMock.mockResolvedValueOnce({});
    await repo.updateCourseCounts(1);
    expect(queryMock).toHaveBeenCalledTimes(1);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('UPDATE language_modules');
    expect(sql).toContain('SET total_units = (SELECT COUNT(*) FROM module_units WHERE module_id = $1)');
    expect(sql).toContain('WHERE id = $1');
    expect(params).toEqual([1]);
  });

  it('createUnit inserts and updates counts', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 10, module_id: 1 }] });
    const updateSpy = jest.spyOn(repo, 'updateCourseCounts').mockResolvedValue();
    const r = await repo.createUnit({ module_id: 1, title: 'U', description: 'D', difficulty: 'easy' });
    expect(r.id).toBe(10);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('INSERT INTO module_units');
    expect(sql).toContain('VALUES ($1, $2, $3, $4, $5, NOW(), NOW())');
    expect(params).toEqual([1, 'U', 'D', 'easy', 0]);
    expect(updateSpy).toHaveBeenCalledWith(1);
    updateSpy.mockRestore();
  });

  it('getUnitById returns row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 10 }] });
    const result = await repo.getUnitById(10);
    expect(result).toEqual({ id: 10 });
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toBe('SELECT * FROM module_units WHERE id = $1');
    expect(params).toEqual([10]);
  });

  it('updateUnit returns row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 10, title: 'New' }] });
    const result = await repo.updateUnit(10, { title: 'New' });
    expect(result).toEqual({ id: 10, title: 'New' });
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('UPDATE module_units');
    expect(sql).toContain('SET title = COALESCE($1, title)');
    expect(sql).toContain('WHERE id = $5');
    expect(params).toEqual(['New', undefined, undefined, undefined, 10]);
  });

  it('deleteUnit returns null when not found', async () => {
    queryMock.mockResolvedValueOnce({ rows: [] });
    const result = await repo.deleteUnit(10);
    expect(result).toBeNull();
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toBe('SELECT * FROM module_units WHERE id = $1');
    expect(params).toEqual([10]);
  });

  it('deleteUnit deletes unit and updates counts when found', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 10, module_id: 1 }] }) // getUnitById
      .mockResolvedValueOnce({ rows: [{ id: 10 }] }) // delete
      .mockResolvedValueOnce({}); // update counts
    const result = await repo.deleteUnit(10);
    expect(result).toEqual({ id: 10 });
    expect(queryMock).toHaveBeenCalledTimes(3);
    const [selectSql, selectParams] = queryMock.mock.calls[0];
    expect(selectSql).toBe('SELECT * FROM module_units WHERE id = $1');
    expect(selectParams).toEqual([10]);
    const [deleteSql, deleteParams] = queryMock.mock.calls[1];
    expect(deleteSql).toBe('DELETE FROM module_units WHERE id = $1 RETURNING *');
    expect(deleteParams).toEqual([10]);
    const [updateSql, updateParams] = queryMock.mock.calls[2];
    expect(updateSql).toContain('UPDATE language_modules');
    expect(updateParams).toEqual([1]);
  });

  it('createLesson inserts with defaults and updates counts when unit exists', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 100 }] }) // insert
      .mockResolvedValueOnce({ rows: [{ id: 10, module_id: 1 }] }) // getUnitById
      .mockResolvedValueOnce({}); // update counts
    const r = await repo.createLesson({ unit_id: 10, title: 'L', content_type: 'text' });
    expect(r.id).toBe(100);
    expect(queryMock).toHaveBeenCalledTimes(3);
    const [insertSql, insertParams] = queryMock.mock.calls[0];
    expect(insertSql).toContain('INSERT INTO module_lessons');
    expect(insertSql).toContain('VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())');
    expect(insertParams).toEqual([
      10,
      'L',
      'text',
      undefined,
      undefined,
      [],
      {},
      {},
      {},
      0,
    ]);
    const [unitSql, unitParams] = queryMock.mock.calls[1];
    expect(unitSql).toBe('SELECT * FROM module_units WHERE id = $1');
    expect(unitParams).toEqual([10]);
    const [updateSql, updateParams] = queryMock.mock.calls[2];
    expect(updateSql).toContain('UPDATE language_modules');
    expect(updateParams).toEqual([1]);
  });

  it('createLesson does not update counts when unit lookup returns no row', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 101 }] }) // insert
      .mockResolvedValueOnce({ rows: [] }); // getUnitById returns no unit
    const r = await repo.createLesson({ unit_id: 99, title: 'L2', content_type: 'text' });
    expect(r.id).toBe(101);
    expect(queryMock).toHaveBeenCalledTimes(2);
    const [insertSql, insertParams] = queryMock.mock.calls[0];
    expect(insertSql).toContain('INSERT INTO module_lessons');
    expect(insertParams[0]).toBe(99);
  });

  it('getLessonById returns row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 100 }] });
    const result = await repo.getLessonById(100);
    expect(result).toEqual({ id: 100 });
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toBe('SELECT * FROM module_lessons WHERE id = $1');
    expect(params).toEqual([100]);
  });

  it('updateLesson returns row', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 100, title: 'New' }] });
    const result = await repo.updateLesson(100, { title: 'New' });
    expect(result).toEqual({ id: 100, title: 'New' });
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('UPDATE module_lessons');
    expect(sql).toContain('SET title = COALESCE($1, title)');
    expect(sql).toContain('WHERE id = $10');
    expect(params).toEqual([
      'New',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      100,
    ]);
  });

  it('deleteLesson returns null when missing and row when found, updates counts', async () => {
    // missing
    queryMock.mockResolvedValueOnce({ rows: [] });
    const missing = await repo.deleteLesson(100);
    expect(missing).toBeNull();
    const [missingSql, missingParams] = queryMock.mock.calls[0];
    expect(missingSql).toBe('SELECT * FROM module_lessons WHERE id = $1');
    expect(missingParams).toEqual([100]);
    // found
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 100, unit_id: 10 }] }) // getLessonById
      .mockResolvedValueOnce({ rows: [{ id: 10, module_id: 1 }] }) // getUnitById
      .mockResolvedValueOnce({ rows: [{ id: 100 }] }) // delete
      .mockResolvedValueOnce({}); // update counts
    const r = await repo.deleteLesson(100);
    expect(r).toEqual({ id: 100 });
    expect(queryMock).toHaveBeenCalledTimes(5);
    const [selectSql, selectParams] = queryMock.mock.calls[1];
    expect(selectSql).toBe('SELECT * FROM module_lessons WHERE id = $1');
    expect(selectParams).toEqual([100]);
    const [unitSql, unitParams] = queryMock.mock.calls[2];
    expect(unitSql).toBe('SELECT * FROM module_units WHERE id = $1');
    expect(unitParams).toEqual([10]);
    const [deleteSql, deleteParams] = queryMock.mock.calls[3];
    expect(deleteSql).toBe('DELETE FROM module_lessons WHERE id = $1 RETURNING *');
    expect(deleteParams).toEqual([100]);
    const [updateSql, updateParams] = queryMock.mock.calls[4];
    expect(updateSql).toContain('UPDATE language_modules');
    expect(updateParams).toEqual([1]);
  });

  it('deleteLesson deletes but does not update counts when unit lookup returns no row', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 100, unit_id: 10 }] }) // getLessonById
      .mockResolvedValueOnce({ rows: [] }) // getUnitById returns no unit
      .mockResolvedValueOnce({ rows: [{ id: 100 }] }); // delete
    const r = await repo.deleteLesson(100);
    expect(r).toEqual({ id: 100 });
    expect(queryMock).toHaveBeenCalledTimes(3);
    const [selectSql, selectParams] = queryMock.mock.calls[0];
    expect(selectSql).toBe('SELECT * FROM module_lessons WHERE id = $1');
    expect(selectParams).toEqual([100]);
    const [unitSql, unitParams] = queryMock.mock.calls[1];
    expect(unitSql).toBe('SELECT * FROM module_units WHERE id = $1');
    expect(unitParams).toEqual([10]);
    const [deleteSql, deleteParams] = queryMock.mock.calls[2];
    expect(deleteSql).toBe('DELETE FROM module_lessons WHERE id = $1 RETURNING *');
    expect(deleteParams).toEqual([100]);
  });

  it('getPublishedLanguages returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ language: 'English' }] });
    const result = await repo.getPublishedLanguages();
    expect(result).toEqual([{ language: 'English' }]);
    const [sql] = queryMock.mock.calls[0];
    expect(sql).toContain('SELECT DISTINCT language, COUNT(*) as course_count');
    expect(sql).toContain('FROM language_modules');
    expect(sql).toContain('WHERE is_published = true');
  });

  it('getPublishedCoursesByLanguage returns rows', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const result = await repo.getPublishedCoursesByLanguage('English');
    expect(result).toEqual([{ id: 1 }]);
    const [sql, params] = queryMock.mock.calls[0];
    expect(sql).toContain('FROM language_modules lm');
    expect(sql).toContain('WHERE lm.language = $1 AND lm.is_published = true');
    expect(sql).toContain('ORDER BY lm.created_at DESC');
    expect(params).toEqual(['English']);
  });

  it('getPublishedCourseDetails returns null or details', async () => {
    // null
    queryMock.mockResolvedValueOnce({ rows: [] });
    const nullResult = await repo.getPublishedCourseDetails(1);
    expect(nullResult).toBeNull();
    const [nullSql, nullParams] = queryMock.mock.calls[0];
    expect(nullSql).toBe('SELECT * FROM language_modules WHERE id = $1 AND is_published = true');
    expect(nullParams).toEqual([1]);
    // details
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // course
      .mockResolvedValueOnce({ rows: [{ id: 10 }] }) // units
      .mockResolvedValueOnce({ rows: [{ id: 100 }] }); // lessons for unit 10
    const r = await repo.getPublishedCourseDetails(1);
    expect(r.units[0].lessons[0].id).toBe(100);
    const [courseSql, courseParams] = queryMock.mock.calls[1];
    expect(courseSql).toBe('SELECT * FROM language_modules WHERE id = $1 AND is_published = true');
    expect(courseParams).toEqual([1]);
    const [unitsSql, unitsParams] = queryMock.mock.calls[2];
    expect(unitsSql).toContain('FROM module_units mu');
    expect(unitsSql).toContain('WHERE mu.module_id = $1');
    expect(unitsSql).toContain('ORDER BY mu.id');
    expect(unitsParams).toEqual([1]);
    const [lessonsSql, lessonsParams] = queryMock.mock.calls[3];
    expect(lessonsSql).toContain('FROM module_lessons');
    expect(lessonsSql).toContain('WHERE unit_id = $1');
    expect(lessonsSql).toContain('ORDER BY id');
    expect(lessonsParams).toEqual([10]);
  });
});
