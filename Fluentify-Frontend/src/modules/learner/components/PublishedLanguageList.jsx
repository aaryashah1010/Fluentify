import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublishedLanguages } from '../../../hooks/useCourses';
import { Globe, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';

const PublishedLanguageList = () => {
  const navigate = useNavigate();
  const { data: languages = [], isLoading: loading, error } = usePublishedLanguages();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-teal-400 mx-auto"></div>
            <Loader2 className="w-6 h-6 text-teal-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-sm text-gray-600">Loading language modules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md w-full">
          <p className="text-red-600 mb-4">Error: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-full hover:bg-orange-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-orange-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Language
              <span className="ml-2 bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                Modules
              </span>
            </h2>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Select a language to explore available courses.
            </p>
          </div>
        </div>

        {/* Languages Grid */}
        {languages.length === 0 ? (
          <div className="bg-white/80 border border-orange-100 rounded-2xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-teal-500" />
            </div>
            <p className="text-gray-700 font-medium mb-1">No published courses available yet.</p>
            <p className="text-sm text-gray-500">Check back soon for new instructor-led modules.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map((lang) => (
              <button
                key={lang.language}
                onClick={() => navigate(`/learner/modules/${lang.language}`)}
                className="bg-white/90 border border-orange-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-teal-300 transition-all text-left group flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-teal-400 flex items-center justify-center text-white">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{lang.language}</h3>
                      <p className="text-sm text-gray-600">
                        {lang.course_count} {lang.course_count === 1 ? 'course' : 'courses'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishedLanguageList;
