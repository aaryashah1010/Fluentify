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

  useEffect(() => {
    if (!isNewCourse && courseId) {
      fetchCourseDetails(courseId);
    }
  }, [courseId, isNewCourse]);

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

  const handleSaveCourse = async () => {
    try {
      if (isNewCourse) {
        const result = await createCourse(courseData);
        if (result && result.id) {
          navigate(`/admin/modules/course/edit/${result.id}`);
        }
      } else {
        await updateCourse(courseId, courseData);
      }
    } catch (err) {
      console.error('Failed to save course:', err);
    }
  };

  const handleAddUnit = () => {
    setEditingUnit(null);
    setUnitFormData({
      title: '',
      description: '',
      difficulty: 'Beginner',
      estimated_time: 0,
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

  const handleAddLesson = (unitId) => {
    setSelectedUnitId(unitId);
    setEditingLesson(null);
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* -------- HEADER (Glass) -------- */}
      <div className="flex items-center justify-between bg-white/30 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg shadow-gray-200/40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/40 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 text-white hover:bg-teal-600 transition"
            >
              <Save className="w-5 h-5" />
              Switch to Edit Mode
            </button>
          )}

          {!isViewMode && (
            <button
              onClick={handleSaveCourse}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 transition"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Course'}
            </button>
          )}
        </div>
      </div>

      {/* -------- ERROR GLASS BOX -------- */}
      {error && (
        <div className="bg-red-100/40 backdrop-blur-md border border-red-300 rounded-2xl p-4 flex justify-between items-start shadow">
          <p className="text-red-700">{error}</p>
          <button onClick={clearError} className="text-red-700 hover:text-red-900">×</button>
        </div>
      )}

      {/* -------- COURSE FORM (Glass Card) -------- */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>

        <CourseForm
          courseData={courseData}
          onChange={setCourseData}
          disabled={loading || isViewMode}
        />
      </div>

      {/* -------- UNITS & LESSONS CARD -------- */}
      {!isNewCourse && currentCourse && (
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-lg">
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

      {/* -------- UNIT MODAL (Glass) -------- */}
      {showUnitModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white/70 backdrop-blur-xl max-w-2xl w-full p-6 rounded-2xl border border-white/50 shadow-lg">
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

      {/* -------- LESSON MODAL (Glass) -------- */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white/70 backdrop-blur-xl max-w-3xl w-full p-6 rounded-2xl border border-white/50 shadow-lg">
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
