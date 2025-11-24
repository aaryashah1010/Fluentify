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
      <div className="flex items-center justify-center min-h-[400px] text-slate-200">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/60 bg-rose-950/70 p-6 text-sm text-rose-100">
        <p className="mb-4">Error: {error}</p>
        <button
          onClick={() => fetchLanguages()}
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors text-xs font-medium"
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
          <h2 className="text-2xl md:text-3xl font-bold text-slate-50">Language Modules</h2>
          <p className="text-sm text-slate-300 mt-1">Select a language to manage its courses.</p>
        </div>
        {languages.length > 0 && (
          <button
            onClick={() => navigate('/admin/modules/course/new')}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors text-sm font-medium"
          >
            <ChevronRight className="w-5 h-5" />
            Create New Course
          </button>
        )}
      </div>

      {languages.length === 0 ? (
        <div className="bg-slate-900/85 border border-white/10 rounded-3xl p-8 text-center">
          <Globe className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-300 mb-4">No languages found. Create your first course to get started.</p>
          <button
            onClick={() => navigate('/admin/modules/course/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600 transition-colors text-sm font-medium"
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
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 p-6 text-left group shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all"
            >
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-teal-500/20 to-sky-500/10 rounded-full blur-2xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900/80 border border-white/10 rounded-2xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-teal-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-50 text-lg">{lang.language}</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {lang.course_count} {lang.course_count === '1' ? 'course' : 'courses'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-300 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageListPage;