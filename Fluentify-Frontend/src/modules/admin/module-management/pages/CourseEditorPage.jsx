import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useModuleManagement } from '../../../../hooks/useModuleManagement';
import CourseForm from '../components/CourseForm';
import UnitList from '../components/UnitList';
import UnitForm from '../components/UnitForm';
import LessonForm from '../components/LessonForm';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const CourseEditorPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const location = window.location.pathname;
  const isNewCourse = location.includes('/new');
  const isViewMode = location.includes('/view/');
  const isEditMode = location.includes('/edit/');
  const languageParam = searchParams.get('language');

  const {
    currentCourse,
    loading,
    error,
    createCourse,
    fetchCourseDetails,
    updateCourse,
    createUnit,
    updateUnit,
    deleteUnit,
    createLesson,
    updateLesson,
    deleteLesson,
    clearError,
  } = useModuleManagement();

  const [courseData, setCourseData] = useState({
    language: languageParam || '',
    level: '',
    title: '',
    description: '',
    thumbnail_url: '',
    estimated_duration: '',
    is_published: false,
  });

  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  const [unitFormData, setUnitFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
    estimated_time: 0,
    unit_order: 1,
  });

  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    content_type: '',
    description: '',
    media_url: '',
    key_phrases: [],
    vocabulary: {},
    grammar_points: {},
    exercises: {},
    xp_reward: 0,
    lesson_order: 1,
    transcript: '',
    file_name: null,
    file_size: null,
    file_type: null,
  });

  // Load course details if editing
  useEffect(() => {
    if (!isNewCourse && courseId) {
      fetchCourseDetails(courseId);
    }
  }, [courseId, isNewCourse]);

  // Update form when course is loaded
  useEffect(() => {
    if (currentCourse && !isNewCourse) {
      setCourseData({
        language: currentCourse.language || '',
        level: currentCourse.level || '',
        title: currentCourse.title || '',
        description: currentCourse.description || '',
        thumbnail_url: currentCourse.thumbnail_url || '',
        estimated_duration: currentCourse.estimated_duration || '',
        is_published: currentCourse.is_published || false,
      });
    }
  }, [currentCourse, isNewCourse]);

  // FIX: Handle course save with better error handling
  // Prevents logout on API errors
  const handleSaveCourse = async () => {
    try {
      if (isNewCourse) {
        const result = await createCourse(courseData);
        if (result && result.id) {
          navigate(`/admin/modules/course/edit/${result.id}`);
        } else {
          console.error('Course created but no ID returned:', result);
        }
      } else {
        await updateCourse(courseId, courseData);
      }
    } catch (err) {
      // FIX: Don't throw - let the error state handle it
      // This prevents logout from ProtectedRoute re-evaluation
      console.error('Failed to save course:', err);
      // Error will be displayed by the error state in the component
    }
  };

  // Unit handlers
  const handleAddUnit = () => {
    setEditingUnit(null);
    setUnitFormData({
      title: '',
      description: '',
      difficulty: 'Beginner',
      estimated_time: 0,
      unit_order: (currentCourse?.units?.length || 0) + 1,
    });
    setShowUnitModal(true);
  };

  const handleEditUnit = (unit) => {
    setEditingUnit(unit);
    setUnitFormData({
      title: unit.title || '',
      description: unit.description || '',
      difficulty: unit.difficulty || 'Beginner',
      estimated_time: unit.estimated_time || 0,
      unit_order: unit.unit_order || 1,
    });
    setShowUnitModal(true);
  };

  const handleSaveUnit = async () => {
    try {
      if (editingUnit) {
        await updateUnit(editingUnit.id, unitFormData);
      } else {
        await createUnit(courseId, unitFormData);
      }
      setShowUnitModal(false);
      setEditingUnit(null);
    } catch (err) {
      console.error('Failed to save unit:', err);
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (window.confirm('Are you sure you want to delete this unit? All lessons will also be deleted.')) {
      try {
        await deleteUnit(unitId);
      } catch (err) {
        console.error('Failed to delete unit:', err);
      }
    }
  };

  // Lesson handlers
  const handleAddLesson = (unitId) => {
    setSelectedUnitId(unitId);
    setEditingLesson(null);
    // Find the unit to get lesson count
    const unit = currentCourse?.units?.find(u => u.id === unitId);
    setLessonFormData({
      title: '',
      content_type: '',
      description: '',
      media_url: '',
      key_phrases: [],
      vocabulary: {},
      grammar_points: {},
      exercises: {},
      xp_reward: 0,
      lesson_order: (unit?.lessons?.length || 0) + 1,
      transcript: '',
      file_name: null,
      file_size: null,
      file_type: null,
    });
    setShowLessonModal(true);
  };

  const handleEditLesson = (lesson) => {
    setSelectedUnitId(lesson.unit_id);
    setEditingLesson(lesson);
    setLessonFormData({
      title: lesson.title || '',
      content_type: lesson.content_type || '',
      description: lesson.description || '',
      media_url: lesson.media_url || '',
      key_phrases: lesson.key_phrases || [],
      vocabulary: lesson.vocabulary || {},
      grammar_points: lesson.grammar_points || {},
      exercises: lesson.exercises || {},
      xp_reward: lesson.xp_reward || 0,
      lesson_order: lesson.lesson_order || 1,
      transcript: lesson.transcript || '',
      file_name: lesson.file_name || null,
      file_size: lesson.file_size || null,
      file_type: lesson.file_type || null,
    });
    setShowLessonModal(true);
  };

  const handleSaveLesson = async () => {
    try {
      if (editingLesson) {
        await updateLesson(editingLesson.id, lessonFormData);
      } else {
        await createLesson(selectedUnitId, lessonFormData);
      }
      setShowLessonModal(false);
      setEditingLesson(null);
      setSelectedUnitId(null);
    } catch (err) {
      console.error('Failed to save lesson:', err);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteLesson(lessonId);
      } catch (err) {
        console.error('Failed to delete lesson:', err);
      }
    }
  };

  if (loading && !isNewCourse && !currentCourse) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isNewCourse ? 'Create New Course' : isViewMode ? 'View Course' : 'Edit Course'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isNewCourse 
                ? 'Fill in the course details' 
                : isViewMode 
                ? 'View course details and manage units & lessons'
                : 'Update course information and content'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isViewMode && (
            <button
              onClick={() => navigate(`/admin/course/edit/${courseId}`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Switch to Edit Mode
            </button>
          )}
          {!isViewMode && (
            <button
              onClick={handleSaveCourse}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Course'}
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
          <p className="text-red-600">{error}</p>
          <button onClick={clearError} className="text-red-600 hover:text-red-800">×</button>
        </div>
      )}

      {/* Course Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
        <CourseForm
          courseData={courseData}
          onChange={setCourseData}
          disabled={loading || isViewMode}
        />
      </div>

      {/* Units and Lessons (only show for existing courses) */}
      {!isNewCourse && currentCourse && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <UnitList
            units={currentCourse.units || []}
            onAddUnit={handleAddUnit}
            onEditUnit={handleEditUnit}
            onDeleteUnit={handleDeleteUnit}
            onAddLesson={handleAddLesson}
            onEditLesson={handleEditLesson}
            onDeleteLesson={handleDeleteLesson}
          />
        </div>
      )}

      {/* Unit Modal */}
      {showUnitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingUnit ? 'Edit Unit' : 'Add New Unit'}
            </h3>
            <UnitForm
              unitData={unitFormData}
              onChange={setUnitFormData}
              onSubmit={handleSaveUnit}
              onCancel={() => setShowUnitModal(false)}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
            </h3>
            <LessonForm
              lessonData={lessonFormData}
              onChange={setLessonFormData}
              onSubmit={handleSaveLesson}
              onCancel={() => setShowLessonModal(false)}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseEditorPage;
