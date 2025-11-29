import { jest } from '@jest/globals';

const mockRepo = {
  getLanguages: jest.fn(),
  getCoursesByLanguage: jest.fn(),
  createCourse: jest.fn(),
  getCourseDetails: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn(),
  createUnit: jest.fn(),
  getUnitById: jest.fn(),
  updateUnit: jest.fn(),
  deleteUnit: jest.fn(),
  createLesson: jest.fn(),
  getLessonById: jest.fn(),
  updateLesson: jest.fn(),
  deleteLesson: jest.fn(),
  getPublishedLanguages: jest.fn(),
  getPublishedCoursesByLanguage: jest.fn(),
  getPublishedCourseDetails: jest.fn(),
};
await jest.unstable_mockModule('../../repositories/moduleAdminRepository.js', () => ({ default: mockRepo }));

const service = (await import('../../services/moduleAdminService.js')).default;

describe('moduleAdminService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('languages', () => {
    it('getLanguages returns list', async () => {
      mockRepo.getLanguages.mockResolvedValueOnce(['English']);
      const r = await service.getLanguages();
      expect(r).toEqual({ success: true, data: ['English'] });
    });

    it('getCoursesByLanguage requires language', async () => {
      await expect(service.getCoursesByLanguage('')).rejects.toThrow('Language parameter is required');
    });
    it('getCoursesByLanguage returns list', async () => {
      mockRepo.getCoursesByLanguage.mockResolvedValueOnce([{ id: 1 }]);
      const r = await service.getCoursesByLanguage('English');
      expect(r).toEqual({ success: true, data: [{ id: 1 }] });
    });
  });

  describe('courses', () => {
    it('createCourse validates required fields', async () => {
      await expect(service.createCourse(1, { title: '', language: '' })).rejects.toThrow('Title and language are required');
      await expect(service.createCourse(1, { title: 'T', language: 'English' })).rejects.toThrow('Level is required');
    });
    it('createCourse success with default fallbacks', async () => {
      mockRepo.createCourse.mockResolvedValueOnce({ id: 10 });
      const payload = {
        title: 'T',
        language: 'English',
        level: 'Beginner',
      };
      const r = await service.createCourse(7, payload);

      expect(mockRepo.createCourse).toHaveBeenCalledWith({
        admin_id: 7,
        language: 'English',
        level: 'Beginner',
        title: 'T',
        description: '',
        thumbnail_url: null,
        estimated_duration: null,
        is_published: false,
      });
      expect(r).toEqual({
        success: true,
        message: 'Course created successfully',
        data: { id: 10 },
      });
    });

    it('createCourse honors optional fields when provided', async () => {
      mockRepo.createCourse.mockResolvedValueOnce({ id: 11 });
      await service.createCourse(9, {
        title: 'With Optional',
        language: 'Spanish',
        level: 'Advanced',
        description: 'Desc',
        thumbnail_url: 'url',
        estimated_duration: 90,
        is_published: true,
      });

      expect(mockRepo.createCourse).toHaveBeenCalledWith({
        admin_id: 9,
        language: 'Spanish',
        level: 'Advanced',
        title: 'With Optional',
        description: 'Desc',
        thumbnail_url: 'url',
        estimated_duration: 90,
        is_published: true,
      });
    });

    it('getCourseDetails requires id and not found', async () => {
      await expect(service.getCourseDetails('')).rejects.toThrow('Course ID is required');
      mockRepo.getCourseDetails.mockResolvedValueOnce(null);
      await expect(service.getCourseDetails(1)).rejects.toThrow('Course not found');
    });
    it('getCourseDetails success', async () => {
      mockRepo.getCourseDetails.mockResolvedValueOnce({ id: 1 });
      const r = await service.getCourseDetails(1);
      expect(r).toEqual({ success: true, data: { id: 1 } });
    });

    it('updateCourse requires id and not found', async () => {
      await expect(service.updateCourse('', {})).rejects.toThrow('Course ID is required');
      mockRepo.getCourseDetails.mockResolvedValueOnce(null);
      await expect(service.updateCourse(1, {})).rejects.toThrow('Course not found');
    });
    it('updateCourse success', async () => {
      mockRepo.getCourseDetails.mockResolvedValueOnce({ id: 1 });
      mockRepo.updateCourse.mockResolvedValueOnce({ id: 1, title: 'New' });
      const r = await service.updateCourse(1, { title: 'New' });
      expect(r).toEqual({ success: true, message: 'Course updated successfully', data: { id: 1, title: 'New' } });
    });

    it('deleteCourse requires id and not found', async () => {
      await expect(service.deleteCourse('')).rejects.toThrow('Course ID is required');
      mockRepo.getCourseDetails.mockResolvedValueOnce(null);
      await expect(service.deleteCourse(1)).rejects.toThrow('Course not found');
    });
    it('deleteCourse success', async () => {
      mockRepo.getCourseDetails.mockResolvedValueOnce({ id: 1 });
      mockRepo.deleteCourse.mockResolvedValueOnce(true);
      const r = await service.deleteCourse(1);
      expect(r).toEqual({ success: true, message: 'Course deleted successfully', data: true });
    });
  });

  describe('units', () => {
    it('createUnit validates courseId and title and course existence', async () => {
      await expect(service.createUnit('', { title: 'U' })).rejects.toThrow('Course ID is required');
      await expect(service.createUnit(1, { title: '' })).rejects.toThrow('Unit title is required');
      mockRepo.getCourseDetails.mockResolvedValueOnce(null);
      await expect(service.createUnit(1, { title: 'U' })).rejects.toThrow('Course not found');
    });
    it('createUnit success', async () => {
      mockRepo.getCourseDetails.mockResolvedValueOnce({ id: 1 });
      mockRepo.createUnit.mockResolvedValueOnce({ id: 2 });
      const r = await service.createUnit(1, { title: 'U' });
      expect(mockRepo.createUnit).toHaveBeenCalledWith({
        module_id: 1,
        title: 'U',
        description: '',
        difficulty: 'Beginner',
        estimated_time: 0,
      });
      expect(r).toEqual({ success: true, message: 'Unit created successfully', data: { id: 2 } });
    });

    it('updateUnit validates id and existence; success', async () => {
      await expect(service.updateUnit('', {})).rejects.toThrow('Unit ID is required');
      mockRepo.getUnitById.mockResolvedValueOnce(null);
      await expect(service.updateUnit(2, {})).rejects.toThrow('Unit not found');
      mockRepo.getUnitById.mockResolvedValueOnce({ id: 2 });
      mockRepo.updateUnit.mockResolvedValueOnce({ id: 2, title: 'X' });
      const r = await service.updateUnit(2, { title: 'X' });
      expect(r).toEqual({ success: true, message: 'Unit updated successfully', data: { id: 2, title: 'X' } });
    });

    it('deleteUnit validates id and existence; success', async () => {
      await expect(service.deleteUnit('')).rejects.toThrow('Unit ID is required');
      mockRepo.getUnitById.mockResolvedValueOnce(null);
      await expect(service.deleteUnit(2)).rejects.toThrow('Unit not found');
      mockRepo.getUnitById.mockResolvedValueOnce({ id: 2 });
      mockRepo.deleteUnit.mockResolvedValueOnce(true);
      const r = await service.deleteUnit(2);
      expect(r).toEqual({ success: true, message: 'Unit deleted successfully', data: true });
    });
  });

  describe('lessons', () => {
    it('createLesson validates unitId/title/content_type/unit existence', async () => {
      await expect(service.createLesson('', { title: 'L', content_type: 'vocabulary' })).rejects.toThrow('Unit ID is required');
      await expect(service.createLesson(1, { title: '', content_type: 'vocabulary' })).rejects.toThrow('Lesson title and content type are required');
      await expect(service.createLesson(1, { title: 'L', content_type: '' })).rejects.toThrow('Lesson title and content type are required');
      mockRepo.getUnitById.mockResolvedValueOnce(null);
      await expect(service.createLesson(1, { title: 'L', content_type: 'vocabulary' })).rejects.toThrow('Unit not found');
    });
    it('createLesson success', async () => {
      mockRepo.getUnitById.mockResolvedValueOnce({ id: 1 });
      mockRepo.createLesson.mockResolvedValueOnce({ id: 3 });
      const r = await service.createLesson(1, { title: 'L', content_type: 'vocabulary' });
      expect(mockRepo.createLesson).toHaveBeenCalledWith({
        unit_id: 1,
        title: 'L',
        content_type: 'vocabulary',
        description: '',
        media_url: null,
        key_phrases: [],
        vocabulary: {},
        grammar_points: {},
        exercises: {},
        xp_reward: 0,
      });
      expect(r).toEqual({ success: true, message: 'Lesson created successfully', data: { id: 3 } });
    });

    it('updateLesson validates id and existence; success', async () => {
      await expect(service.updateLesson('', {})).rejects.toThrow('Lesson ID is required');
      mockRepo.getLessonById.mockResolvedValueOnce(null);
      await expect(service.updateLesson(3, {})).rejects.toThrow('Lesson not found');
      mockRepo.getLessonById.mockResolvedValueOnce({ id: 3 });
      mockRepo.updateLesson.mockResolvedValueOnce({ id: 3, title: 'Z' });
      const r = await service.updateLesson(3, { title: 'Z' });
      expect(r).toEqual({ success: true, message: 'Lesson updated successfully', data: { id: 3, title: 'Z' } });
    });

    it('deleteLesson validates id and existence; success', async () => {
      await expect(service.deleteLesson('')).rejects.toThrow('Lesson ID is required');
      mockRepo.getLessonById.mockResolvedValueOnce(null);
      await expect(service.deleteLesson(3)).rejects.toThrow('Lesson not found');
      mockRepo.getLessonById.mockResolvedValueOnce({ id: 3 });
      mockRepo.deleteLesson.mockResolvedValueOnce(true);
      const r = await service.deleteLesson(3);
      expect(r).toEqual({ success: true, message: 'Lesson deleted successfully', data: true });
    });
  });

  describe('published (learner view)', () => {
    it('getPublishedLanguages returns list', async () => {
      mockRepo.getPublishedLanguages.mockResolvedValueOnce(['English']);
      const r = await service.getPublishedLanguages();
      expect(r).toEqual({ success: true, data: ['English'] });
    });

    it('getPublishedCoursesByLanguage validates language and returns list', async () => {
      await expect(service.getPublishedCoursesByLanguage('')).rejects.toThrow('Language parameter is required');
      mockRepo.getPublishedCoursesByLanguage.mockResolvedValueOnce([{ id: 1 }]);
      const r = await service.getPublishedCoursesByLanguage('English');
      expect(r).toEqual({ success: true, data: [{ id: 1 }] });
    });

    it('getPublishedCourseDetails validates id, not found, and success', async () => {
      await expect(service.getPublishedCourseDetails('')).rejects.toThrow('Course ID is required');
      mockRepo.getPublishedCourseDetails.mockResolvedValueOnce(null);
      await expect(service.getPublishedCourseDetails(1)).rejects.toThrow('Course not found');
      mockRepo.getPublishedCourseDetails.mockResolvedValueOnce({ id: 1 });
      const r = await service.getPublishedCourseDetails(1);
      expect(r).toEqual({ success: true, data: { id: 1 } });
    });
  });
});
