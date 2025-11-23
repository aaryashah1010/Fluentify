import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Loader2, Clock, GraduationCap, Signal } from 'lucide-react';
import { usePublishedCoursesByLanguage } from '../../hooks/useCourses';

const ModuleCoursesPage = () => {
  const navigate = useNavigate();
  const { language } = useParams();
  const { data: courses = [], isLoading, error } = usePublishedCoursesByLanguage(language);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-20 right-20 text-7xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>📚</div>
        <div className="absolute bottom-40 left-20 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '4s' }}>🎓</div>
        
        <div className="text-center z-10">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-orange-100 border-t-teal-500 mx-auto"></div>
            <Loader2 className="w-6 h-6 text-teal-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-200 font-medium animate-pulse">Loading {language} courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 relative overflow-hidden text-slate-50">
      <div className="absolute top-20 right-20 text-7xl opacity-30 pointer-events-none animate-bounce" style={{ animationDuration: '3s' }}>
        📚
      </div>
      <div className="absolute top-60 left-20 text-6xl opacity-30 pointer-events-none animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
        📖
      </div>
      <div className="absolute bottom-40 right-40 text-7xl opacity-30 pointer-events-none animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
        🎓
      </div>
      <div className="absolute top-1/2 left-1/4 text-6xl opacity-20 pointer-events-none animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>
        ✏️
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
          <div className="flex flex-col gap-6">
            <button
              onClick={() => navigate('/language-modules')}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors group w-fit"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Languages</span>
            </button>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-50">
                {language}{' '}
                <span className="bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                  Courses
                </span>
              </h1>
              <p className="text-lg text-slate-200 mt-2">
                Explore structured learning paths and modules for {language}.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500/70 rounded-2xl p-6 mb-8 flex items-start gap-4">
             <div className="p-2 bg-red-500/40 rounded-full text-red-100">⚠️</div>
             <div>
                <h3 className="text-red-100 font-semibold">Unable to load courses</h3>
                <p className="text-red-200 mt-1">{error.message || 'Failed to load courses'}</p>
             </div>
          </div>
        )}

        {courses.length === 0 ? (
          <div className="bg-slate-900/85 rounded-3xl p-12 text-center shadow-xl border border-white/10">
            <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-50 mb-2">No courses found</h3>
            <p className="text-slate-300">Check back soon for new instructor-led content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => navigate(`/module-course/${course.id}`)}
                className="group bg-slate-900/85 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-teal-400/60 flex flex-col overflow-hidden text-left h-full transform hover:-translate-y-1"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-teal-400 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/80" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-teal-700 shadow-sm">
                    {course.level || 'Beginner'}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-50 mb-2 line-clamp-2 group-hover:text-teal-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-300 text-sm mb-6 line-clamp-2 flex-1">
                    {course.description || 'No description provided.'}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-orange-300" />
                      <span>{course.total_units || 0} Units</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Signal className="w-4 h-4 text-teal-300" />
                      <span>{course.total_lessons || 0} Lessons</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleCoursesPage;