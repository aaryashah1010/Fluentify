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
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100/50 backdrop-blur-md border border-red-300 rounded-2xl p-6 shadow-md">
        <p className="text-red-700 mb-4">Error: {error}</p>
        <button
          onClick={() => fetchLanguages()}
          className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition shadow"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Soft Glass Header */}
      <div className="flex justify-between items-center bg-white/40 backdrop-blur-lg p-5 rounded-2xl shadow border border-white/50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Language Modules</h2>
          <p className="text-gray-600 mt-1">Select a language to manage its courses</p>
        </div>

        <button
          onClick={() => navigate('/admin/modules/course/new')}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-500 text-white hover:bg-teal-600 transition shadow"
        >
          <ChevronRight className="w-5 h-5" />
          Create New Course
        </button>
      </div>

      {/* Empty State */}
      {languages.length === 0 ? (
        <div className="bg-white/50 backdrop-blur-lg border border-white/60 rounded-2xl p-10 text-center shadow-lg">
          <Globe className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-700 mb-4">
            No languages found. Create your first course to get started.
          </p>

          <button
            onClick={() => navigate('/admin/modules/course/new')}
            className="inline-flex items-center gap-2 px-5 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition shadow"
          >
            <ChevronRight className="w-5 h-5" />
            Create First Course
          </button>
        </div>
      ) : (
        /* Languages Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {languages.map((lang) => (
            <button
              key={lang.language}
              onClick={() => navigate(`/admin/modules/${lang.language}`)}
              className="
                bg-white/40 backdrop-blur-xl 
                border border-white/60 
                rounded-2xl p-6 shadow 
                hover:shadow-xl hover:bg-white/70 
                transition-all text-left group
              "
            >
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-teal-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{lang.language}</h3>
                    <p className="text-sm text-gray-600">
                      {lang.course_count} {lang.course_count === '1' ? 'course' : 'courses'}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition" />
              </div>
            </button>
          ))}

        </div>
      )}
    </div>
  );
};

export default LanguageListPage;
