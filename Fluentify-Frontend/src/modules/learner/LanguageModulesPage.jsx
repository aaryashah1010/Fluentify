import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublishedLanguages } from '../../hooks/usePublishedModules'; // Adjust path as needed
import { ArrowLeft, Globe, Loader2, BookOpen } from 'lucide-react';

const LANGUAGE_FLAGS = {
  spanish: '🇪🇸',
  french: '🇫🇷',
  german: '🇩🇪',
  japanese: '🇯🇵',
  hindi: '🇮🇳',
  italian: '🇮🇹',
  english: '🇬🇧',
};

const getLanguageFlag = (languageName) => {
  if (!languageName || typeof languageName !== 'string') return '🌐';
  const key = languageName.toLowerCase();
  return LANGUAGE_FLAGS[key] || '🌐';
};

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
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-20 right-20 text-7xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>📚</div>
        <div className="absolute bottom-40 left-20 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '4s' }}>🎓</div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-orange-100 border-t-teal-500 mx-auto"></div>
            <Loader2 className="w-6 h-6 text-teal-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-200 font-medium animate-pulse">Loading language modules...</p>
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
      <div className="absolute bottom-20 right-1/3 text-6xl opacity-25 pointer-events-none animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>
        📝
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-50 mb-3">
            Language Modules
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl">
            Explore our curated collection of instructor-created courses organized by language.
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500/70 rounded-2xl p-6 mb-8 flex items-start gap-4">
             <div className="p-2 bg-red-500/40 rounded-full text-red-100">⚠️</div>
             <div>
                <h3 className="text-red-100 font-semibold">Unable to load languages</h3>
                <p className="text-red-200 mt-1">{error?.message || error?.data?.message || 'Please try again later.'}</p>
                {error?.status && <p className="text-red-200 text-sm mt-2 font-mono">Code: {error.status}</p>}
             </div>
          </div>
        )}

        {languages.length === 0 ? (
          <div className="bg-slate-900/85 rounded-3xl p-12 text-center shadow-xl border border-white/10">
            <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-50 mb-2">No modules found</h3>
            <p className="text-slate-300">Check back soon for new instructor-led courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map((item) => {
              const languageName = item.language || item;
              const courseCount = item.course_count || 0;
              const flag = getLanguageFlag(languageName);

              return (
                <div 
                  key={languageName}
                  onClick={() => navigate(`/language-modules/${languageName}`)}
                  className="bg-slate-900/85 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/10 hover:border-teal-400/60 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-400 shadow-lg shadow-teal-500/40 group-hover:scale-105 transition-transform duration-300 text-3xl">
                      <span className="drop-shadow-sm">{flag}</span>
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg font-bold text-slate-50 mb-1 group-hover:text-teal-300 transition-colors">
                        {languageName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <BookOpen className="w-4 h-4" />
                        <span>{courseCount} {courseCount === 1 ? 'Course' : 'Courses'} Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs font-medium px-3 py-1 rounded-lg bg-orange-500/20 text-orange-200">
                      Instructor Led
                    </span>
                    <span className="text-teal-300 text-sm font-medium group-hover:translate-x-1 transition-transform">
                      View Modules →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageModulesPage;