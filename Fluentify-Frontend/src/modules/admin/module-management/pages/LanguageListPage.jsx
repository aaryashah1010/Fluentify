import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModuleManagement } from '../../../../hooks/useModuleManagement';
import { Globe, ChevronRight, Loader2, Trash2 } from 'lucide-react';

const LanguageListPage = () => {
  const navigate = useNavigate();
  const { languages, loading, error, fetchLanguages } = useModuleManagement();
  const hasLoadedRef = useRef(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletedLanguages, setDeletedLanguages] = useState([]);

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
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p>Error: {error}</p>
        <button
          onClick={() => fetchLanguages()}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const languageMeta = (name) => {
    const key = (name || '').toLowerCase();
    if (key.includes('spanish')) return { emoji: '🇪🇸', gradient: 'from-[#F29A36] via-[#A8C79B] to-[#56D7C5]' };
    if (key.includes('french')) return { emoji: '🇫🇷', gradient: 'from-[#F29A36] via-[#A8C79B] to-[#56D7C5]' };
    if (key.includes('german')) return { emoji: '🇩🇪', gradient: 'from-[#F29A36] via-[#A8C79B] to-[#56D7C5]' };
    if (key.includes('english')) return { emoji: '🇬🇧', gradient: 'from-[#F29A36] via-[#A8C79B] to-[#56D7C5]' };
    return { emoji: '🌍', gradient: 'from-[#F29A36] via-[#A8C79B] to-[#56D7C5]' };
  };

  const timeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const now = new Date();
    const then = new Date(dateString);
    const diffMs = now - then;

    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const recentlyUpdated = [...languages].slice(0, 3);

  return (
    <div className="space-y-6 bg-emerald-50/40 min-h-screen -mx-4 px-4 py-4">
      {/* Top row: Module overview + Recently updated */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1.1fr)] gap-4 items-stretch">
        {/* Module overview card */}
        <div className="rounded-2xl bg-[#F29A36]/6 border border-slate-100 px-5 py-3 shadow-sm flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1">Module overview</p>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Language Modules</h2>
            <p className="text-xs text-slate-500 mt-1">Select a language to manage its courses and content.</p>
          </div>
          <button
            onClick={() => navigate('/admin/modules/course/new')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white text-xs sm:text-sm font-medium shadow-sm hover:opacity-90"
          >
            <ChevronRight className="w-4 h-4" />
            Create New Course
          </button>
        </div>

        {/* Recently updated card */}
        <div className="rounded-2xl bg-[#F29A36]/6 px-4 py-3 shadow-sm text-sm text-slate-900 flex flex-col gap-2 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Recently updated</h3>
              <p className="text-[11px] text-slate-500">Languages that changed most recently.</p>
            </div>
          </div>
          {recentlyUpdated.length === 0 ? (
            <p className="text-xs text-slate-500 mt-1">No recent updates yet.</p>
          ) : (
            <ul className="space-y-1 text-xs mt-1">
              {recentlyUpdated.map((lang) => {
                const meta = languageMeta(lang.language);
                const updated = timeAgo(lang.last_updated);
                return (
                  <li key={lang.language} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{meta.emoji}</span>
                      <div>
                        <p className="font-medium text-xs capitalize">{lang.language}</p>
                        <p className="text-[10px] text-slate-500">{lang.course_count || 0} courses</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">{updated}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Language cards grid */}
      <section>
        <div className="space-y-4">
          {languages.length === 0 ? (
            <div className="bg-gradient-to-r from-[#F29A36]/5 via-[#A8C79B]/5 to-[#56D7C5]/5 border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
              <Globe className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 mb-4 text-sm">No languages found. Create your first course to get started.</p>
              <button
                onClick={() => navigate('/admin/modules/course/new')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-black transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                Create First Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {languages
                .filter((lang) => !deletedLanguages.includes(lang.language))
                .map((lang) => {
                const meta = languageMeta(lang.language);
                const totalCourses = lang.course_count || 0;
                const totalLessons = lang.total_lessons || 0;
                const updatedLabel = lang.last_updated
                  ? new Date(lang.last_updated).toLocaleDateString()
                  : 'Recently updated';

                return (
                  <button
                    key={lang.language}
                    onClick={() => navigate(`/admin/modules/${lang.language}`)}
                    className="group bg-white border border-slate-200 rounded-3xl overflow-hidden text-left shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-150 w-full"
                  >
                    {/* Card header gradient */}
                    <div className={`h-28 bg-gradient-to-r ${meta.gradient} flex items-center justify-between px-5`}>
                      <div className="flex items-center gap-3 text-white">
                        <div className="h-11 w-11 rounded-2xl bg-white/15 flex items-center justify-center text-xl">
                          {meta.emoji}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold capitalize">{lang.language}</h3>
                          <p className="text-xs opacity-80">{totalCourses} {totalCourses === 1 ? 'course' : 'courses'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(lang.language);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-white/80 hover:bg-white/30 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-white/80">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="px-5 py-5 space-y-2.5">
                      <div className="flex items-center justify-between text-[12px] text-slate-500">
                        <span>Total lessons</span>
                        <span className="font-medium text-slate-800">{totalLessons}</span>
                      </div>
                      <div className="flex items-center justify-between text-[12px] text-slate-500">
                        <span>Last updated</span>
                        <span>{updatedLabel}</span>
                      </div>
                      {/* Placeholder progress bar */}
                      <div className="mt-1.5">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Overall completion</span>
                          <span>0%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full w-1/4 bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5]" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </section>

      {/* Delete language confirmation modal (UI only) */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Language</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{deleteTarget}</span> and all of its
              courses? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeletedLanguages((prev) =>
                    deleteTarget ? [...prev, deleteTarget] : prev
                  );
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium min-w-[96px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageListPage;
