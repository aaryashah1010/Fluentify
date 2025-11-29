/**
 * @jest-environment jsdom
 */
import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';

// API Mocks
const mockAdminApi = {
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
};

jest.unstable_mockModule('../../api/admin', () => mockAdminApi);

describe('useModuleManagement hook', () => {
  let useModuleManagement;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await import('../../hooks/useModuleManagement');
    useModuleManagement = module.useModuleManagement;
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useModuleManagement());

    expect(result.current.languages).toEqual([]);
    expect(result.current.courses).toEqual([]);
    expect(result.current.currentCourse).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe('Language Operations', () => {
    it('should fetch languages successfully', async () => {
      const mockLanguages = ['English', 'Spanish'];
      mockAdminApi.getLanguages.mockResolvedValue({ data: mockLanguages });

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        const data = await result.current.fetchLanguages();
        expect(data).toEqual(mockLanguages);
      });

      expect(result.current.languages).toEqual(mockLanguages);
      expect(result.current.loading).toBe(false);
    });

    it('should handle fetch languages error', async () => {
      mockAdminApi.getLanguages.mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.fetchLanguages()).rejects.toThrow('API Error');
      });

      expect(result.current.error).toBe('API Error');
      expect(result.current.loading).toBe(false);
    });

    it('should fetch courses by language successfully', async () => {
      const mockCourses = [{ id: 1, name: 'Course 1' }];
      mockAdminApi.getCoursesByLanguage.mockResolvedValue({ data: mockCourses });

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        const data = await result.current.fetchCoursesByLanguage('English');
        expect(data).toEqual(mockCourses);
      });

      expect(result.current.courses).toEqual(mockCourses);
    });

    it('should handle fetch courses by language error', async () => {
      mockAdminApi.getCoursesByLanguage.mockRejectedValue(new Error('Fetch failed'));

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.fetchCoursesByLanguage('English')).rejects.toThrow();
      });

      expect(result.current.error).toBe('Fetch failed');
    });

    it('should handle fetch languages error without message', async () => {
      mockAdminApi.getLanguages.mockRejectedValue({});

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.fetchLanguages()).rejects.toEqual({});
      });

      expect(result.current.error).toBe('Failed to fetch languages');
    });

    it('should handle fetch courses by language error without message', async () => {
      mockAdminApi.getCoursesByLanguage.mockRejectedValue({});

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.fetchCoursesByLanguage('English')).rejects.toEqual({});
      });

      expect(result.current.error).toBe('Failed to fetch courses');
    });
  });

  describe('Course Operations', () => {
    it('should create course successfully', async () => {
      const newCourse = { id: 1, name: 'New Course' };
      mockAdminApi.createCourse.mockResolvedValue({ data: newCourse });

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        const data = await result.current.createCourse({ name: 'New Course' });
        expect(data).toEqual(newCourse);
      });
    });

    it('should handle create course error', async () => {
      mockAdminApi.createCourse.mockRejectedValue(new Error('Create failed'));

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.createCourse({})).rejects.toThrow();
      });

      expect(result.current.error).toBe('Create failed');
    });

    it('should handle create course error without message', async () => {
      mockAdminApi.createCourse.mockRejectedValue({});

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.createCourse({})).rejects.toEqual({});
      });

      expect(result.current.error).toBe('Failed to create course');
    });

    it('should fetch course details successfully', async () => {
      const courseDetails = { id: 1, name: 'Course', units: [] };
      mockAdminApi.getCourseDetails.mockResolvedValue({ data: courseDetails });

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        const data = await result.current.fetchCourseDetails(1);
        expect(data).toEqual(courseDetails);
      });

      expect(result.current.currentCourse).toEqual(courseDetails);
    });

    it('should handle fetch course details error', async () => {
      mockAdminApi.getCourseDetails.mockRejectedValue(new Error('Fetch details failed'));

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.fetchCourseDetails(1)).rejects.toThrow();
      });

      expect(result.current.error).toBe('Fetch details failed');
    });

    it('should handle fetch course details error without message', async () => {
      mockAdminApi.getCourseDetails.mockRejectedValue({});

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.fetchCourseDetails(1)).rejects.toEqual({});
      });

      expect(result.current.error).toBe('Failed to fetch course details');
    });

    it('should update course successfully', async () => {
      const updatedCourse = { id: 1, name: 'Updated Course' };
      mockAdminApi.updateCourse.mockResolvedValue({ data: updatedCourse });

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        const data = await result.current.updateCourse(1, { name: 'Updated Course' });
        expect(data).toEqual(updatedCourse);
      });

      expect(result.current.currentCourse).toEqual(updatedCourse);
    });

    it('should handle update course error', async () => {
      mockAdminApi.updateCourse.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.updateCourse(1, {})).rejects.toThrow();
      });

      expect(result.current.error).toBe('Update failed');
    });

    it('should handle update course error without message', async () => {
      mockAdminApi.updateCourse.mockRejectedValue({});

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.updateCourse(1, {})).rejects.toEqual({});
      });

      expect(result.current.error).toBe('Failed to update course');
    });

    it('should delete course successfully', async () => {
      mockAdminApi.deleteCourse.mockResolvedValue({ data: { success: true } });

      const { result } = renderHook(() => useModuleManagement());

      // Set initial courses
      act(() => {
        result.current.courses.push({ id: 1 }, { id: 2 });
      });

      await act(async () => {
        await result.current.deleteCourse(1);
      });

      expect(result.current.courses).toEqual([{ id: 2 }]);
    });

    it('should handle delete course error', async () => {
      mockAdminApi.deleteCourse.mockRejectedValue(new Error('Delete failed'));

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.deleteCourse(1)).rejects.toThrow();
      });

      expect(result.current.error).toBe('Delete failed');
    });

    it('should handle delete course error without message', async () => {
      mockAdminApi.deleteCourse.mockRejectedValue({});

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.deleteCourse(1)).rejects.toEqual({});
      });

      expect(result.current.error).toBe('Failed to delete course');
    });
  });

  describe('Unit Operations', () => {
    it('should create unit successfully', async () => {
      const newUnit = { id: 1, name: 'Unit 1' };
      mockAdminApi.createUnit.mockResolvedValue({ data: newUnit });
      mockAdminApi.getCourseDetails.mockResolvedValue({
        data: { id: 1, units: [newUnit] }
      });

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        const data = await result.current.createUnit(1, { name: 'Unit 1' });
        expect(data).toEqual(newUnit);
      });
    });

    it('should handle create unit error', async () => {
      mockAdminApi.createUnit.mockRejectedValue(new Error('Create unit failed'));

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.createUnit(1, {})).rejects.toThrow();
      });

      expect(result.current.error).toBe('Create unit failed');
    });

    it('should handle create unit error without message', async () => {
      mockAdminApi.createUnit.mockRejectedValue({});

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.createUnit(1, {})).rejects.toEqual({});
      });

      expect(result.current.error).toBe('Failed to create unit');
    });

    it('should update unit successfully without current course', async () => {
      const updatedUnit = { id: 1, name: 'Updated Unit' };
      mockAdminApi.updateUnit.mockResolvedValue({ data: updatedUnit });

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        const data = await result.current.updateUnit(1, { name: 'Updated Unit' });
        expect(data).toEqual(updatedUnit);
      });
    });

    it('should update unit successfully with current course', async () => {
      const updatedUnit = { id: 1, name: 'Updated Unit' };
      mockAdminApi.updateUnit.mockResolvedValue({ data: updatedUnit });
      mockAdminApi.getCourseDetails.mockResolvedValue({
        data: {
          id: 1,
          units: [{ id: 1, name: 'Old Unit' }, { id: 2, name: 'Unit 2' }]
        }
      });

      const { result } = renderHook(() => useModuleManagement());

      // First fetch course details to set currentCourse
      await act(async () => {
        await result.current.fetchCourseDetails(1);
      });

      await act(async () => {
        await result.current.updateUnit(1, { name: 'Updated Unit' });
      });

      expect(result.current.currentCourse.units[0]).toEqual(updatedUnit);
    });

    it('should delete unit successfully with current course', async () => {
      mockAdminApi.deleteUnit.mockResolvedValue({ data: { success: true } });
      mockAdminApi.getCourseDetails.mockResolvedValue({
        data: {
          id: 1,
          units: [{ id: 1 }, { id: 2 }]
        }
      });

      const { result } = renderHook(() => useModuleManagement());

      // First fetch course details to set currentCourse
      await act(async () => {
        await result.current.fetchCourseDetails(1);
      });

      await act(async () => {
        await result.current.deleteUnit(1);
      });

      expect(result.current.currentCourse.units).toEqual([{ id: 2 }]);
    });

    it('should handle update unit error', async () => {
      mockAdminApi.updateUnit.mockRejectedValue(new Error('Update unit failed'));

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.updateUnit(1, {})).rejects.toThrow();
      });

      expect(result.current.error).toBe('Update unit failed');
    });

    it('should handle update unit error without message', async () => {
      mockAdminApi.updateUnit.mockRejectedValue({});

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.updateUnit(1, {})).rejects.toEqual({});
      });

      expect(result.current.error).toBe('Failed to update unit');
    });

    it('should handle delete unit error', async () => {
      mockAdminApi.deleteUnit.mockRejectedValue(new Error('Delete unit failed'));

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.deleteUnit(1)).rejects.toThrow();
      });

      expect(result.current.error).toBe('Delete unit failed');
    });

    it('should handle delete unit error without message', async () => {
      mockAdminApi.deleteUnit.mockRejectedValue({});

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.deleteUnit(1)).rejects.toEqual({});
      });

      expect(result.current.error).toBe('Failed to delete unit');
    });

    it('should delete unit successfully without current course', async () => {
      mockAdminApi.deleteUnit.mockResolvedValue({ data: { success: true } });

      const { result } = renderHook(() => useModuleManagement());

      // Don't set currentCourse - it should remain null
      await act(async () => {
        const data = await result.current.deleteUnit(1);
        expect(data).toEqual({ success: true });
      });

      // currentCourse should still be null
      expect(result.current.currentCourse).toBeNull();
    });
  });

  describe('Lesson Operations', () => {
    it('should create lesson successfully with current course', async () => {
      const newLesson = { id: 1, name: 'Lesson 1' };
      mockAdminApi.createLesson.mockResolvedValue({ data: newLesson });
      mockAdminApi.getCourseDetails.mockResolvedValue({
        data: {
          id: 1,
          units: [{ id: 1, lessons: [] }]
        }
      });

      const { result } = renderHook(() => useModuleManagement());

      // First fetch course details to set currentCourse
      await act(async () => {
        await result.current.fetchCourseDetails(1);
      });

      await act(async () => {
        await result.current.createLesson(1, { name: 'Lesson 1' });
      });

      expect(result.current.currentCourse.units[0].lessons).toEqual([newLesson]);
    });

    it('should create lesson with multiple units (cover ternary branch)', async () => {
      const newLesson = { id: 1, name: 'Lesson 1' };
      mockAdminApi.createLesson.mockResolvedValue({ data: newLesson });
      mockAdminApi.getCourseDetails.mockResolvedValue({
        data: {
          id: 1,
          units: [
            { id: 1, lessons: [] },
            { id: 2, lessons: [] }  // This unit won't match, covering the else branch
          ]
        }
      });

      const { result } = renderHook(() => useModuleManagement());

      // First fetch course details to set currentCourse
      await act(async () => {
        await result.current.fetchCourseDetails(1);
      });

      await act(async () => {
        await result.current.createLesson(1, { name: 'Lesson 1' });
      });

      // Unit 1 should have the new lesson
      expect(result.current.currentCourse.units[0].lessons).toEqual([newLesson]);
      // Unit 2 should remain unchanged
      expect(result.current.currentCourse.units[1].lessons).toEqual([]);
    });

    it('should update lesson successfully with current course', async () => {
      const updatedLesson = { id: 1, name: 'Updated Lesson' };
      mockAdminApi.updateLesson.mockResolvedValue({ data: updatedLesson });
      mockAdminApi.getCourseDetails.mockResolvedValue({
        data: {
          id: 1,
          units: [{
            id: 1,
            lessons: [{ id: 1, name: 'Old Lesson' }]
          }]
        }
      });

      const { result } = renderHook(() => useModuleManagement());

      // First fetch course details to set currentCourse
      await act(async () => {
        await result.current.fetchCourseDetails(1);
      });

      await act(async () => {
        await result.current.updateLesson(1, { name: 'Updated Lesson' });
      });

      expect(result.current.currentCourse.units[0].lessons[0]).toEqual(updatedLesson);
    });

    it('should delete lesson successfully with current course', async () => {
      mockAdminApi.deleteLesson.mockResolvedValue({ data: { success: true } });
      mockAdminApi.getCourseDetails.mockResolvedValue({
        data: {
          id: 1,
          units: [{
            id: 1,
            lessons: [{ id: 1 }, { id: 2 }]
          }]
        }
      });

      const { result } = renderHook(() => useModuleManagement());

      // First fetch course details to set currentCourse
      await act(async () => {
        await result.current.fetchCourseDetails(1);
      });

      await act(async () => {
        await result.current.deleteLesson(1);
      });

      expect(result.current.currentCourse.units[0].lessons).toEqual([{ id: 2 }]);
    });

    it('should handle create lesson error', async () => {
      mockAdminApi.createLesson.mockRejectedValue(new Error('Create lesson failed'));

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.createLesson(1, {})).rejects.toThrow();
      });

      expect(result.current.error).toBe('Create lesson failed');
    });

    it('should handle create lesson error without message', async () => {
      mockAdminApi.createLesson.mockRejectedValue({});

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.createLesson(1, {})).rejects.toEqual({});
      });

      expect(result.current.error).toBe('Failed to create lesson');
    });

    it('should handle update lesson error', async () => {
      mockAdminApi.updateLesson.mockRejectedValue(new Error('Update lesson failed'));

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.updateLesson(1, {})).rejects.toThrow();
      });

      expect(result.current.error).toBe('Update lesson failed');
    });

    it('should handle update lesson error without message', async () => {
      mockAdminApi.updateLesson.mockRejectedValue({});

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.updateLesson(1, {})).rejects.toEqual({});
      });

      expect(result.current.error).toBe('Failed to update lesson');
    });

    it('should handle delete lesson error', async () => {
      mockAdminApi.deleteLesson.mockRejectedValue(new Error('Delete lesson failed'));

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.deleteLesson(1)).rejects.toThrow();
      });

      expect(result.current.error).toBe('Delete lesson failed');
    });

    it('should handle delete lesson error without message', async () => {
      mockAdminApi.deleteLesson.mockRejectedValue({});

      const { result } = renderHook(() => useModuleManagement());

      await act(async () => {
        await expect(result.current.deleteLesson(1)).rejects.toEqual({});
      });

      expect(result.current.error).toBe('Failed to delete lesson');
    });

    it('should create lesson successfully without current course', async () => {
      const newLesson = { id: 1, name: 'Lesson 1' };
      mockAdminApi.createLesson.mockResolvedValue({ data: newLesson });

      const { result } = renderHook(() => useModuleManagement());

      // Don't set currentCourse - it should remain null
      await act(async () => {
        const data = await result.current.createLesson(1, { name: 'Lesson 1' });
        expect(data).toEqual(newLesson);
      });

      // currentCourse should still be null
      expect(result.current.currentCourse).toBeNull();
    });

    it('should update lesson successfully without current course', async () => {
      const updatedLesson = { id: 1, name: 'Updated Lesson' };
      mockAdminApi.updateLesson.mockResolvedValue({ data: updatedLesson });

      const { result } = renderHook(() => useModuleManagement());

      // Don't set currentCourse - it should remain null
      await act(async () => {
        const data = await result.current.updateLesson(1, { name: 'Updated Lesson' });
        expect(data).toEqual(updatedLesson);
      });

      // currentCourse should still be null
      expect(result.current.currentCourse).toBeNull();
    });

    it('should delete lesson successfully without current course', async () => {
      mockAdminApi.deleteLesson.mockResolvedValue({ data: { success: true } });

      const { result } = renderHook(() => useModuleManagement());

      // Don't set currentCourse - it should remain null
      await act(async () => {
        const data = await result.current.deleteLesson(1);
        expect(data).toEqual({ success: true });
      });

      // currentCourse should still be null
      expect(result.current.currentCourse).toBeNull();
    });
  });

  describe('Utility Functions', () => {
    it('should clear error', async () => {
      mockAdminApi.getLanguages.mockRejectedValue(new Error('Test error'));

      const { result } = renderHook(() => useModuleManagement());

      // Generate an error first
      await act(async () => {
        try {
          await result.current.fetchLanguages();
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should reset current course', async () => {
      mockAdminApi.getCourseDetails.mockResolvedValue({
        data: { id: 1, name: 'Course' }
      });

      const { result } = renderHook(() => useModuleManagement());

      // Set current course first
      await act(async () => {
        await result.current.fetchCourseDetails(1);
      });

      expect(result.current.currentCourse).not.toBeNull();

      act(() => {
        result.current.resetCurrentCourse();
      });

      expect(result.current.currentCourse).toBeNull();
    });
  });

  describe('Defensive Checks', () => {
    it('should handle lesson operations when units have undefined lessons', async () => {
      const courseData = {
        id: 1,
        units: [
          { id: 101, title: 'Unit 1' }, // No lessons
          { id: 102, title: 'Unit 2' }  // No lessons
        ]
      };

      mockAdminApi.getCourseDetails.mockResolvedValue({ data: courseData });
      mockAdminApi.createLesson.mockResolvedValue({ data: { id: 201, title: 'New Lesson' } });
      mockAdminApi.updateLesson.mockResolvedValue({ data: { id: 201, title: 'Updated Lesson' } });
      mockAdminApi.deleteLesson.mockResolvedValue({ data: { success: true } });

      const { result } = renderHook(() => useModuleManagement());

      // 1. Fetch Course
      await act(async () => {
        await result.current.fetchCourseDetails(1);
      });

      // 2. Create Lesson in Unit 1
      await act(async () => {
        await result.current.createLesson(101, { title: 'New Lesson' });
      });

      expect(result.current.currentCourse.units[0].lessons).toHaveLength(1);
      expect(result.current.currentCourse.units[1].lessons).toBeUndefined();

      // 3. Update Lesson (id 201)
      await act(async () => {
        await result.current.updateLesson(201, { title: 'Updated Lesson' });
      });

      expect(result.current.currentCourse.units[0].lessons[0].title).toBe('Updated Lesson');
      expect(result.current.currentCourse.units[1].lessons).toEqual([]);

      // 4. Delete Lesson (id 201)
      await act(async () => {
        await result.current.deleteLesson(201);
      });

      expect(result.current.currentCourse.units[0].lessons).toEqual([]);
      expect(result.current.currentCourse.units[1].lessons).toEqual([]);
    });
  });
});
