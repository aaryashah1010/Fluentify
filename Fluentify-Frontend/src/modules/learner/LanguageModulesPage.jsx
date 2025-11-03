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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Language Modules</h2>
          <p className="text-gray-600 mt-1">Explore courses created by our instructors</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error?.message || error?.data?.message || 'Failed to load languages'}</p>
          {error?.status && <p className="text-red-500 text-sm mt-2">Status: {error.status}</p>}
        </div>
      )}

      {/* Languages Grid */}
      {languages.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No language modules available yet</p>
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
                className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{languageName}</h3>
                </div>
                <p className="text-sm text-gray-600">{courseCount} course{courseCount !== 1 ? 's' : ''} available</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageModulesPage;
