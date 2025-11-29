// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Award, 
  Play, 
  Target
} from 'lucide-react';
import { usePublishedCourseDetails } from '../../hooks/useCourses';

const ModuleCourseDetailsPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { data: course, isLoading, error } = usePublishedCourseDetails(courseId);
  const [expandedUnits, setExpandedUnits] = useState({});

  const toggleUnit = (unitId) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-20 right-20 text-7xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>📚</div>
        <div className="absolute bottom-40 left-20 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '4s' }}>🎓</div>

        <div className="text-center relative z-10">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-100 border-t-teal-500 mx-auto"></div>
            <Loader2 className="w-6 h-6 text-teal-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-200 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950">
        <div className="bg-slate-900/90 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-red-500/40">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="w-8 h-8 text-red-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-50 mb-2">Course Not Found</h2>
          <p className="text-slate-300 mb-6">{error?.message || 'Failed to load course details'}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const units = course.units || [];
  const totalLessons = units.reduce((sum, unit) => sum + (unit.lessons?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 relative pb-20 text-slate-50 overflow-hidden">
      
      <div className="absolute top-20 right-20 text-7xl opacity-30 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>📚</div>
      <div className="absolute top-60 left-20 text-6xl opacity-30 pointer-events-none animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>✨</div>
      <div className="absolute top-1/2 left-1/4 text-6xl opacity-20 pointer-events-none animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>🎯</div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Courses</span>
        </button>

        <div className="bg-gradient-to-br from-slate-950 via-teal-900 to-orange-700 rounded-3xl p-8 mb-8 text-slate-50 shadow-2xl overflow-hidden relative border border-white/10">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 relative z-10">
                <div className="flex flex-col md:flex-row items-start gap-6 flex-1">
                    <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl flex-shrink-0 shadow-inner">
                        {course.thumbnail_url ? (
                            <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover rounded-3xl opacity-90" />
                        ) : (
                            '🎓'
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-50">{course.title}</h1>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-sm font-medium border border-white/10">
                                {course.level || 'Beginner'}
                            </span>
                        </div>
                        <p className="text-teal-50 text-lg mb-6 max-w-2xl leading-relaxed">
                            {course.description || 'Master this subject through structured lessons and exercises.'}
                        </p>
                        
                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-teal-50">
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                                <BookOpen className="w-4 h-4" />
                                <span>{totalLessons} Lessons</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                                <Clock className="w-4 h-4" />
                                <span>{course.estimated_duration || 'Self-paced'}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                                <Target className="w-4 h-4" />
                                <span>{units.length} Units</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-500/20 text-orange-200 rounded-lg">
                    <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-50">Course Content</h2>
            </div>

            {units.length === 0 ? (
                <div className="bg-slate-900/85 border border-white/10 rounded-3xl p-12 text-center shadow-xl">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-300">No units available yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {units.map((unit, unitIndex) => {
                        const isExpanded = expandedUnits[unit.id];
                        const lessonCount = unit.lessons?.length || 0;

                        return (
                            <div key={unit.id} className="bg-slate-900/85 border border-white/10 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                                <button
                                    onClick={() => toggleUnit(unit.id)}
                                    className={`w-full p-5 flex items-center justify-between transition-colors ${isExpanded ? 'bg-slate-900' : 'bg-slate-900/80 hover:bg-slate-900'}`}
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${isExpanded ? 'bg-teal-500/25 text-teal-200' : 'bg-slate-800 text-slate-300'}`}>
                                            {unitIndex + 1}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg ${isExpanded ? 'text-teal-100' : 'text-slate-50'}`}>
                                                {unit.title}
                                            </h3>
                                            <p className="text-sm text-slate-300 hidden sm:block">{unit.description}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-medium px-2.5 py-1 bg-slate-800 text-slate-200 rounded-md whitespace-nowrap">
                                            {lessonCount} Lessons
                                        </span>
                                        {isExpanded ? <ChevronUp className="text-teal-500" /> : <ChevronDown className="text-gray-400" />}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="p-4 space-y-3 bg-slate-900/80 border-t border-white/10">
                                        {unit.lessons && unit.lessons.length > 0 ? (
                                            unit.lessons.map((lesson, lessonIndex) => (
                                                <div 
                                                    key={lesson.id}
                                                    className="group bg-slate-900/90 p-4 rounded-xl border border-white/10 shadow-md hover:shadow-xl hover:border-teal-400/70 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-200 flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-teal-400 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300">
                                                        <Play className="w-5 h-5 ml-0.5" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-slate-50 mb-1 group-hover:text-teal-200 transition-colors">
                                                            {lesson.title}
                                                        </h4>
                                                        <p className="text-xs text-slate-300 line-clamp-1 mb-2">
                                                            {lesson.description || 'No description available.'}
                                                        </p>
                                                        
                                                        {/* Badges */}
                                                        <div className="flex items-center gap-3 text-xs text-slate-300">
                                                            <span className="flex items-center gap-1">
                                                                <Award className="w-3 h-3 text-amber-500" />
                                                                <span className="font-medium text-slate-100">+{lesson.xp_reward || 10} XP</span>
                                                            </span>
                                                            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-200 border border-slate-600">
                                                                {lesson.content_type || 'Lesson'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="hidden sm:block self-center">
                                                        <button className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium group-hover:bg-teal-500/20 group-hover:text-teal-200 transition-colors">
                                                            Start
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-slate-300 italic text-sm">
                                                No lessons added to this unit yet.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default ModuleCourseDetailsPage;