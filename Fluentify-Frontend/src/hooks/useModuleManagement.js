import { useState } from 'react';
import * as adminApi from '../api/admin';

/**
 * Custom hook for managing admin module data
 * Encapsulates logic for fetching and managing courses, units, and lessons
 */
export const useModuleManagement = () => {
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==================== Language Operations ====================

  /**
   * Fetch all unique languages
   */
  const fetchLanguages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getLanguages();
      setLanguages(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch languages');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch courses by language
   */
  const fetchCoursesByLanguage = async (language) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getCoursesByLanguage(language);
      setCourses(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch courses');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==================== Course Operations ====================

  /**
   * Create a new course
   */
  const createCourse = async (courseData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.createCourse(courseData);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch course details with units and lessons
   */
  const fetchCourseDetails = async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.getCourseDetails(courseId);
      setCurrentCourse(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch course details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a course
   */
  const updateCourse = async (courseId, courseData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.updateCourse(courseId, courseData);
      setCurrentCourse(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a course
   */
  const deleteCourse = async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.deleteCourse(courseId);
      // Remove from courses list if it exists
      setCourses(prev => prev.filter(c => c.id !== courseId));
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to delete course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==================== Unit Operations ====================

  /**
   * Create a new unit
   */
  const createUnit = async (courseId, unitData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.createUnit(courseId, unitData);
      // Refresh course details to get updated units
      await fetchCourseDetails(courseId);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create unit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a unit
   */
  const updateUnit = async (unitId, unitData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.updateUnit(unitId, unitData);
      // Update the unit in current course if it exists
      if (currentCourse) {
        setCurrentCourse(prev => ({
          ...prev,
          units: prev.units.map(u => u.id === unitId ? response.data : u)
        }));
      }
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update unit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a unit
   */
  const deleteUnit = async (unitId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.deleteUnit(unitId);
      // Remove unit from current course if it exists
      if (currentCourse) {
        setCurrentCourse(prev => ({
          ...prev,
          units: prev.units.filter(u => u.id !== unitId)
        }));
      }
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to delete unit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==================== Lesson Operations ====================

  /**
   * Create a new lesson
   */
  const createLesson = async (unitId, lessonData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.createLesson(unitId, lessonData);
      // Update the lessons in the unit
      if (currentCourse) {
        setCurrentCourse(prev => ({
          ...prev,
          units: prev.units.map(u => 
            u.id === unitId 
              ? { ...u, lessons: [...(u.lessons || []), response.data] }
              : u
          )
        }));
      }
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create lesson');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a lesson
   */
  const updateLesson = async (lessonId, lessonData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.updateLesson(lessonId, lessonData);
      // Update the lesson in current course if it exists
      if (currentCourse) {
        setCurrentCourse(prev => ({
          ...prev,
          units: prev.units.map(u => ({
            ...u,
            lessons: u.lessons?.map(l => l.id === lessonId ? response.data : l) || []
          }))
        }));
      }
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update lesson');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a lesson
   */
  const deleteLesson = async (lessonId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.deleteLesson(lessonId);
      // Remove lesson from current course if it exists
      if (currentCourse) {
        setCurrentCourse(prev => ({
          ...prev,
          units: prev.units.map(u => ({
            ...u,
            lessons: u.lessons?.filter(l => l.id !== lessonId) || []
          }))
        }));
      }
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to delete lesson');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==================== Utility Functions ====================

  /**
   * Clear error
   */
  const clearError = () => setError(null);

  /**
   * Reset current course
   */
  const resetCurrentCourse = () => setCurrentCourse(null);

  return {
    // State
    languages,
    courses,
    currentCourse,
    loading,
    error,
    
    // Language operations
    fetchLanguages,
    fetchCoursesByLanguage,
    
    // Course operations
    createCourse,
    fetchCourseDetails,
    updateCourse,
    deleteCourse,
    
    // Unit operations
    createUnit,
    updateUnit,
    deleteUnit,
    
    // Lesson operations
    createLesson,
    updateLesson,
    deleteLesson,
    
    // Utility
    clearError,
    resetCurrentCourse,
  };
};
