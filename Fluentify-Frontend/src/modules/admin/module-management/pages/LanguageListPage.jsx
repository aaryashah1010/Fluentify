import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModuleManagement } from '../../../../hooks/useModuleManagement';
import { Globe, ChevronRight, Loader2 } from 'lucide-react';

const LanguageListPage = () => {
  const navigate = useNavigate();
  const { languages, loading, error, fetchLanguages } = useModuleManagement();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      fetchLanguages().catch(err => {
        console.error('Failed to load languages:', err);
      });
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => fetchLanguages()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Language Modules</h2>
          <p className="text-gray-600 mt-1">Select a language to manage its courses</p>
        </div>
        <button
          onClick={() => navigate('/admin/modules/course/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
          Create New Course
        </button>
      </div>

      {languages.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No languages found. Create your first course to get started.</p>
          <button
            onClick={() => navigate('/admin/modules/course/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            Create First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.language}
              onClick={() => navigate(`/admin/modules/${lang.language}`)}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{lang.language}</h3>
                    <p className="text-sm text-gray-500">
                      {lang.course_count} {lang.course_count === '1' ? 'course' : 'courses'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageListPage;
