import React, { useEffect, useRef, useState } from 'react';
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
    estimated_time: '',
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
    transcript: '',
    file_name: null,
    file_size: null,
    file_type: null,
  });

  // Load course details if editing
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (!isNewCourse && courseId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
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
          // After creating a new course, go back to listing
          if (languageParam) {
            navigate(`/admin/modules/${languageParam}`);
          } else {
            navigate(-1);
          }
        } else {
          console.error('Course created but no ID returned:', result);
        }
      } else {
        await updateCourse(courseId, courseData);
        // After updating an existing course, go back to the previous page
        navigate(-1);
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
      estimated_time: '',
    });
    setShowUnitModal(true);
  };

  const handleEditUnit = (unit) => {
    setEditingUnit(unit);
    setUnitFormData({
      title: unit.title || '',
      description: unit.description || '',
      difficulty: unit.difficulty || 'Beginner',
      estimated_time: unit.estimated_time ?? '',
    });
    setShowUnitModal(true);
  };

  const handleSaveUnit = async () => {
    try {
      const sanitizedFormData = { ...unitFormData };
      if (sanitizedFormData.estimated_time === '') {
        sanitizedFormData.estimated_time = null;
      }
      if (editingUnit) {
        await updateUnit(editingUnit.id, sanitizedFormData);
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
    // Prepare empty lesson form for the selected unit
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
      <div className="flex items-center justify-center min-h-[400px] text-slate-200">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
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
            className="p-2 hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-200" />
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-50">
              {isNewCourse ? 'Create New Course' : isViewMode ? 'View Course' : 'Edit Course'}
            </h2>
            <p className="text-sm text-slate-300 mt-1">
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors"
            >
              <Save className="w-5 h-5" />
              Switch to Edit Mode
            </button>
          )}
          {!isViewMode && (
            <button
              onClick={handleSaveCourse}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Course'}
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-950/60 border border-rose-500/50 rounded-2xl p-4 flex items-start justify-between text-[13px] text-rose-100">
          <p>{error}</p>
          <button onClick={clearError} className="text-rose-200 hover:text-rose-50">×</button>
        </div>
      )}

      {/* Course Form */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl p-1">
        <div className="bg-slate-950/95 rounded-[22px] border border-white/10 p-6 md:p-8">
          <h3 className="text-xl font-bold text-slate-50 mb-4 flex items-center gap-2">
            Course Information
          </h3>
          <CourseForm
            courseData={courseData}
            onChange={setCourseData}
            disabled={loading || isViewMode}
          />
        </div>
      </div>

      {/* Units and Lessons (only show for existing courses) */}
      {!isNewCourse && currentCourse && (
        <div className="rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl p-6">
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 max-w-2xl w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-50 mb-4">
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 max-w-3xl w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-50 mb-4">
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
