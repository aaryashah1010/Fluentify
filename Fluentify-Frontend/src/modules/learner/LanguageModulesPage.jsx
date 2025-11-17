import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublishedLanguages } from '../../hooks/usePublishedModules';
import { ArrowLeft, Globe, Loader2 } from 'lucide-react';

const LanguageModulesPage = () => {
  const navigate = useNavigate();
  const { data: languages = [], isLoading, error } = usePublishedLanguages();

  React.useEffect(() => {
    if (error) {
      console.error('Error loading published languages:', error);
    }
  }, [error]);

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-full hover:bg-orange-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-orange-600" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-teal-400 flex items-center justify-center shadow">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                  Language Modules
                </h2>
              </div>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Explore instructor-created courses by language.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-red-600">Error: {error?.message || error?.data?.message || 'Failed to load languages'}</p>
            {error?.status && <p className="text-red-500 text-sm mt-2">Status: {error.status}</p>}
          </div>
        )}

        {/* Languages Grid */}
        {languages.length === 0 ? (
          <div className="bg-white/80 border border-orange-100 rounded-2xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-teal-500" />
            </div>
            <p className="text-gray-700 font-medium mb-1">No language modules available yet</p>
            <p className="text-sm text-gray-500">Check back soon for new instructor-led courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map((item) => {
              const languageName = item.language || item;
              const courseCount = item.course_count || 0;
              return (
                <button
                  key={languageName}
                  onClick={() => navigate(`/language-modules/${languageName}`)}
                  className="p-6 bg-white/90 border border-orange-100 rounded-2xl hover:shadow-lg hover:border-teal-300 transition-all text-left flex flex-col gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-teal-400 flex items-center justify-center text-white text-sm font-semibold">
                      <Globe className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{languageName}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {courseCount} course{courseCount !== 1 ? 's' : ''} available
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
;

export default LanguageModulesPage;
