import { jest } from '@jest/globals';

// ESM-safe mocks for services
const mockModuleAdminService = {
  getLanguages: jest.fn(),
  getCoursesByLanguage: jest.fn(),
  createCourse: jest.fn(),
  getCourseDetails: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
  createUnit: jest.fn(),
  updateUnit: jest.fn(),
  deleteUnit: jest.fn(),
  createLesson: jest.fn(),
  updateLesson: jest.fn(),
  deleteLesson: jest.fn(),
  getPublishedLanguages: jest.fn(),
  getPublishedCoursesByLanguage: jest.fn(),
  getPublishedCourseDetails: jest.fn(),
};

const trackAdminModuleUsage = jest.fn();

await jest.unstable_mockModule('../../services/moduleAdminService.js', () => ({ default: mockModuleAdminService }));
await jest.unstable_mockModule('../../services/analyticsService.js', () => ({ default: { trackAdminModuleUsage } }));

const controller = (await import('../../controllers/moduleAdminController.js')).default;

const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

function createRes() {
  const res = {};
  res.statusCode = 200;
  res.body = undefined;
  res.status = jest.fn().mockImplementation((code) => { res.statusCode = code; return res; });
  res.json = jest.fn().mockImplementation((payload) => { res.body = payload; return res; });
  return res;
}

function createNext() {
  return jest.fn();
}

describe('moduleAdminController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockClear();
    consoleWarnSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('getLanguages returns 200 with data and uses service', async () => {
    const data = [{ language: 'English' }];
    mockModuleAdminService.getLanguages.mockResolvedValueOnce(data);
    const req = {};
    const res = createRes();
    const next = createNext();

    await controller.getLanguages(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.body).toEqual(data);
    expect(next).not.toHaveBeenCalled();
  });

  it('getLanguages forwards errors', async () => {
    const err = new Error('boom');
    mockModuleAdminService.getLanguages.mockRejectedValueOnce(err);
    const res = createRes();
    const next = createNext();
    await controller.getLanguages({}, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('getCoursesByLanguage calls service with param', async () => {
    const out = [{ id: 1 }];
    mockModuleAdminService.getCoursesByLanguage.mockResolvedValueOnce(out);
    const req = { params: { lang: 'es' } };
    const res = createRes();
    const next = createNext();
    await controller.getCoursesByLanguage(req, res, next);
    expect(mockModuleAdminService.getCoursesByLanguage).toHaveBeenCalledWith('es');
    expect(res.body).toEqual(out);
  });

  it('getCoursesByLanguage forwards errors via next', async () => {
    const err = new Error('fail');
    mockModuleAdminService.getCoursesByLanguage.mockRejectedValueOnce(err);
    const req = { params: { lang: 'es' } };
    const res = createRes();
    const next = createNext();
    await controller.getCoursesByLanguage(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('createCourse returns 201, tracks analytics payload and handles resolved analytics', async () => {
    const result = { data: { id: 10 } };
    mockModuleAdminService.createCourse.mockResolvedValueOnce(result);
    trackAdminModuleUsage.mockResolvedValueOnce();
    const req = { user: { id: 5 }, body: { language: 'en', title: 'T', expectedDuration: '3m' } };
    const res = createRes();
    const next = createNext();

    await controller.createCourse(req, res, next);

    expect(mockModuleAdminService.createCourse).toHaveBeenCalledWith(5, req.body);
    expect(trackAdminModuleUsage).toHaveBeenCalledWith(
      5,
      'en',
      'CREATE_COURSE',
      {
        courseId: 10,
        details: {
          title: 'T',
          expectedDuration: '3m',
        },
      }
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.body).toEqual(result);
  });

  it('createCourse still tracks analytics when service result lacks data (optional chaining guards)', async () => {
    const result = {}; // no data property
    mockModuleAdminService.createCourse.mockResolvedValueOnce(result);
    trackAdminModuleUsage.mockResolvedValueOnce();
    const req = { user: { id: 8 }, body: { language: 'en', title: 'Fallback', expectedDuration: '5m' } };
    const res = createRes();

    await controller.createCourse(req, res, createNext());

    expect(trackAdminModuleUsage).toHaveBeenCalledWith(
      8,
      'en',
      'CREATE_COURSE',
      {
        courseId: undefined,
        details: {
          title: 'Fallback',
          expectedDuration: '5m',
        },
      }
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('createCourse logs error and forwards on failure', async () => {
    const err = new Error('fail');
    mockModuleAdminService.createCourse.mockRejectedValueOnce(err);
    const req = { user: { id: 5 }, body: { language: 'en' } };
    const res = createRes();
    const next = createNext();

    await controller.createCourse(req, res, next);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating course:', err);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('createCourse swallows analytics rejection with console.warn and preserves response', async () => {
    const result = { data: { id: 11 } };
    mockModuleAdminService.createCourse.mockResolvedValueOnce(result);
    const analyticsError = new Error('analytics fail');
    trackAdminModuleUsage.mockRejectedValueOnce(analyticsError);
    const req = { user: { id: 1 }, body: { language: 'en', title: 'T', expectedDuration: 'x' } };
    const res = createRes();
    const next = createNext();

    await controller.createCourse(req, res, next);
    // give microtask a tick to run .catch
    await new Promise((r) => setImmediate(r));
    expect(consoleWarnSpy).toHaveBeenCalledWith('Analytics tracking failed (non-critical):', 'analytics fail');
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('getCourseDetails/updateCourse/deleteCourse call service and return 200', async () => {
    mockModuleAdminService.getCourseDetails.mockResolvedValueOnce({ id: 1 });
    mockModuleAdminService.updateCourse.mockResolvedValueOnce({ ok: true });
    mockModuleAdminService.deleteCourse.mockResolvedValueOnce({ deleted: true });
    const res1 = createRes(); const next1 = createNext();
    await controller.getCourseDetails({ params: { courseId: '1' } }, res1, next1);
    expect(res1.body).toEqual({ id: 1 });

    const res2 = createRes(); const next2 = createNext();
    await controller.updateCourse({ params: { courseId: '1' }, body: { t: 'x' } }, res2, next2);
    expect(res2.body).toEqual({ ok: true });

    const res3 = createRes(); const next3 = createNext();
    await controller.deleteCourse({ params: { courseId: '1' } }, res3, next3);
    expect(res3.body).toEqual({ deleted: true });
  });

  it('getCourseDetails forwards service errors via next', async () => {
    const err = new Error('getCourseDetails');
    mockModuleAdminService.getCourseDetails.mockRejectedValueOnce(err);
    const res = createRes();
    const next = createNext();
    await controller.getCourseDetails({ params: { courseId: '1' } }, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('updateCourse forwards service errors via next', async () => {
    const err = new Error('updateCourse');
    mockModuleAdminService.updateCourse.mockRejectedValueOnce(err);
    const res = createRes();
    const next = createNext();
    await controller.updateCourse({ params: { courseId: '1' }, body: {} }, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('deleteCourse forwards service errors via next', async () => {
    const err = new Error('deleteCourse');
    mockModuleAdminService.deleteCourse.mockRejectedValueOnce(err);
    const res = createRes();
    const next = createNext();
    await controller.deleteCourse({ params: { courseId: '1' } }, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('createUnit tracks analytics inside inner try-catch', async () => {
    const result = { data: { id: 20 } };
    mockModuleAdminService.createUnit.mockResolvedValueOnce(result);
    trackAdminModuleUsage.mockResolvedValueOnce();
    const req = { params: { courseId: '3' }, user: { id: 7 }, body: { language: 'fr', title: 'U', difficulty: 'easy' } };
    const res = createRes();
    const next = createNext();

    await controller.createUnit(req, res, next);
    expect(trackAdminModuleUsage).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('createUnit catches analytics error but still returns response', async () => {
    const result = { data: { id: 21 } };
    mockModuleAdminService.createUnit.mockResolvedValueOnce(result);
    const analyticsError = new Error('analytics');
    trackAdminModuleUsage.mockRejectedValueOnce(analyticsError);
    const req = { params: { courseId: '3' }, user: { id: 7 }, body: { language: 'fr', title: 'U', difficulty: 'easy' } };
    const res = createRes();
    const next = createNext();

    await controller.createUnit(req, res, next);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error tracking admin unit creation analytics:', analyticsError);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('createUnit falls back to Unknown language and handles missing data id', async () => {
    const result = {}; // no data field
    mockModuleAdminService.createUnit.mockResolvedValueOnce(result);
    trackAdminModuleUsage.mockResolvedValueOnce();
    const req = { params: { courseId: '4' }, user: { id: 9 }, body: { title: 'U', difficulty: 'hard' } };
    const res = createRes();
    const next = createNext();

    await controller.createUnit(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(trackAdminModuleUsage).toHaveBeenCalledWith(
      9,
      'Unknown',
      'CREATE_UNIT',
      expect.objectContaining({ courseId: 4 })
    );
  });

  it('updateUnit/deleteUnit call service', async () => {
    mockModuleAdminService.updateUnit.mockResolvedValueOnce({ id: 1 });
    mockModuleAdminService.deleteUnit.mockResolvedValueOnce({ id: 2 });
    const res1 = createRes();
    await controller.updateUnit({ params: { unitId: '1' }, body: {} }, res1, createNext());
    expect(res1.body).toEqual({ id: 1 });
    const res2 = createRes();
    await controller.deleteUnit({ params: { unitId: '2' } }, res2, createNext());
    expect(res2.body).toEqual({ id: 2 });
  });

  it('createLesson tracks analytics and handles analytics error', async () => {
    const result = { data: { id: 30 } };
    mockModuleAdminService.createLesson.mockResolvedValueOnce(result);
    trackAdminModuleUsage.mockResolvedValueOnce();
    const req = { params: { unitId: '9' }, user: { id: 1 }, body: { language: 'en', title: 'L', lessonType: 'video' } };
    const res = createRes();
    const next = createNext();
    await controller.createLesson(req, res, next);
    expect(trackAdminModuleUsage).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);

    // error branch
    jest.clearAllMocks();
    consoleErrorSpy.mockClear();
    mockModuleAdminService.createLesson.mockResolvedValueOnce(result);
    const analyticsError = new Error('fail');
    trackAdminModuleUsage.mockRejectedValueOnce(analyticsError);
    const res2 = createRes();
    await controller.createLesson(req, res2, next);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error tracking admin lesson creation analytics:', analyticsError);
    expect(res2.status).toHaveBeenCalledWith(201);
  });

  it('createLesson falls back to Unknown language and handles missing data id', async () => {
    const result = {}; // no data field
    mockModuleAdminService.createLesson.mockResolvedValueOnce(result);
    trackAdminModuleUsage.mockResolvedValueOnce();
    const req = { params: { unitId: '9' }, user: { id: 2 }, body: { title: 'L', lessonType: 'video' } };
    const res = createRes();
    const next = createNext();

    await controller.createLesson(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(trackAdminModuleUsage).toHaveBeenCalledWith(
      2,
      'Unknown',
      'CREATE_LESSON',
      expect.objectContaining({ unitId: 9 })
    );
  });

  it('updateLesson/deleteLesson call service', async () => {
    mockModuleAdminService.updateLesson.mockResolvedValueOnce({ id: 1 });
    mockModuleAdminService.deleteLesson.mockResolvedValueOnce({ id: 1 });
    const res1 = createRes();
    await controller.updateLesson({ params: { lessonId: '5' }, body: {} }, res1, createNext());
    expect(res1.body).toEqual({ id: 1 });
    const res2 = createRes();
    await controller.deleteLesson({ params: { lessonId: '5' } }, res2, createNext());
    expect(res2.body).toEqual({ id: 1 });
  });

  it('published endpoints call service and return data', async () => {
    mockModuleAdminService.getPublishedLanguages.mockResolvedValueOnce(['en']);
    mockModuleAdminService.getPublishedCoursesByLanguage.mockResolvedValueOnce([{ id: 1 }]);
    mockModuleAdminService.getPublishedCourseDetails.mockResolvedValueOnce({ id: 2 });

    const res1 = createRes();
    await controller.getPublishedLanguages({}, res1, createNext());
    expect(res1.body).toEqual(['en']);

    const res2 = createRes();
    await controller.getPublishedCoursesByLanguage({ params: { lang: 'en' } }, res2, createNext());
    expect(res2.body).toEqual([{ id: 1 }]);

    const res3 = createRes();
    await controller.getPublishedCourseDetails({ params: { courseId: '2' } }, res3, createNext());
    expect(res3.body).toEqual({ id: 2 });
  });

  it('createUnit forwards errors via next', async () => {
    const err = new Error('unit');
    mockModuleAdminService.createUnit.mockRejectedValueOnce(err);
    const req = { params: { courseId: '3' }, user: { id: 7 }, body: {} };
    const res = createRes();
    const next = createNext();
    await controller.createUnit(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('updateUnit/deleteUnit forward errors via next', async () => {
    const err1 = new Error('updateUnit');
    const err2 = new Error('deleteUnit');
    mockModuleAdminService.updateUnit.mockRejectedValueOnce(err1);
    mockModuleAdminService.deleteUnit.mockRejectedValueOnce(err2);

    const next1 = createNext();
    await controller.updateUnit({ params: { unitId: '9' }, body: {} }, createRes(), next1);
    expect(next1).toHaveBeenCalledWith(err1);

    const next2 = createNext();
    await controller.deleteUnit({ params: { unitId: '9' } }, createRes(), next2);
    expect(next2).toHaveBeenCalledWith(err2);
  });

  it('createLesson forwards service errors via next', async () => {
    const err = new Error('lesson');
    mockModuleAdminService.createLesson.mockRejectedValueOnce(err);
    const req = { params: { unitId: '9' }, user: { id: 1 }, body: {} };
    const res = createRes();
    const next = createNext();
    await controller.createLesson(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('updateLesson/deleteLesson forward errors via next', async () => {
    const err1 = new Error('updateLesson');
    const err2 = new Error('deleteLesson');
    mockModuleAdminService.updateLesson.mockRejectedValueOnce(err1);
    mockModuleAdminService.deleteLesson.mockRejectedValueOnce(err2);

    const next1 = createNext();
    await controller.updateLesson({ params: { lessonId: '5' }, body: {} }, createRes(), next1);
    expect(next1).toHaveBeenCalledWith(err1);

    const next2 = createNext();
    await controller.deleteLesson({ params: { lessonId: '5' } }, createRes(), next2);
    expect(next2).toHaveBeenCalledWith(err2);
  });

  it('published endpoints forward errors via next', async () => {
    const errLang = new Error('langs');
    const errCourses = new Error('courses');
    const errDetails = new Error('details');

    mockModuleAdminService.getPublishedLanguages.mockRejectedValueOnce(errLang);
    const next1 = createNext();
    await controller.getPublishedLanguages({}, createRes(), next1);
    expect(next1).toHaveBeenCalledWith(errLang);

    mockModuleAdminService.getPublishedCoursesByLanguage.mockRejectedValueOnce(errCourses);
    const next2 = createNext();
    await controller.getPublishedCoursesByLanguage({ params: { lang: 'en' } }, createRes(), next2);
    expect(next2).toHaveBeenCalledWith(errCourses);

    mockModuleAdminService.getPublishedCourseDetails.mockRejectedValueOnce(errDetails);
    const next3 = createNext();
    await controller.getPublishedCourseDetails({ params: { courseId: '1' } }, createRes(), next3);
    expect(next3).toHaveBeenCalledWith(errDetails);
  });
});
