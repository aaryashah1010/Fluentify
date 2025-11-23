import React from 'react';
import { Sparkles, Clock, TrendingUp, X, Check } from 'lucide-react';

const CourseGenerationForm = ({ 
  form, 
  setForm, 
  onGenerate, 
  onCancel, 
  isGenerating, 
  error 
}) => {

  // --- Data Options ---
  const languages = [
    { value: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
    { value: 'French', label: 'French', flag: '🇫🇷' },
    { value: 'German', label: 'German', flag: '🇩🇪' },
    { value: 'Japanese', label: 'Japanese', flag: '🇯🇵' },
    { value: 'Italian', label: 'Italian', flag: '🇮🇹' },
    { value: 'Hindi', label: 'Hindi', flag: '🇮🇳' },
  ];

  const expertiseLevels = [
    { value: 'Beginner', label: 'Beginner', icon: '🌱', description: 'Start from scratch' },
    { value: 'Intermediate', label: 'Intermediate', icon: '🌿', description: 'Build on basics' },
    { value: 'Advanced', label: 'Advanced', icon: '🌳', description: 'Master the language' },
  ];

  const durations = [
    { value: '1 month', label: '1 Month', icon: '⚡' },
    { value: '3 months', label: '3 Months', icon: '🎯' },
    { value: '6 months', label: '6 Months', icon: '🚀' },
    { value: '1 year', label: '1 Year', icon: '🏆' },
  ];

  // --- Handlers ---
  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full bg-slate-950/95 rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
      
      {/* Header Section (Hidden if embedded in a card with existing header, but kept for completeness) */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-900/40">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-50 mb-2">Customize Your Learning Path</h2>
        <p className="text-slate-300">Let our AI architect a curriculum tailored exactly to your goals.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/40 border border-red-500/70 rounded-xl text-red-100 text-center text-sm font-medium">
          {error}
        </div>
      )}

      {isGenerating ? (
        <div className="text-center py-12 animate-in fade-in">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto text-teal-500 w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Generating Your Course...</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            Our AI is analyzing millions of data points to build your personalized {form.language || 'language'} curriculum! 🎨
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* 1. Language Selection */}
          <div>
            <label className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs">1</span>
              Choose Your Language 🌍
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {languages.map((lang) => {
                const isSelected = form.language === lang.value;
                return (
                  <button
                    key={lang.value}
                    onClick={() => updateField('language', lang.value)}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-teal-400 bg-teal-500/20 shadow-md shadow-teal-500/40'
                        : 'border-white/10 hover:border-teal-400/60 bg-slate-900/80'
                    }`}
                  >
                    <span className="text-3xl filter drop-shadow-sm">{lang.flag}</span>
                    <span className={`text-sm font-medium ${isSelected ? 'text-teal-100' : 'text-slate-200'}`}>
                      {lang.label}
                    </span>
                    {isSelected && <div className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full"></div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Expertise Level */}
          <div>
            <label className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">2</span>
              Current Expertise 📊
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {expertiseLevels.map((level) => {
                const isSelected = form.expertise === level.value;
                return (
                  <button
                    key={level.value}
                    onClick={() => updateField('expertise', level.value)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] text-left relative overflow-hidden ${
                      isSelected
                        ? 'border-orange-400 bg-orange-500/20 shadow-md shadow-orange-500/40'
                        : 'border-white/10 hover:border-orange-300/70 bg-slate-900/80'
                    }`}
                  >
                    <div className="text-2xl mb-2">{level.icon}</div>
                    <div className={`font-bold mb-0.5 ${isSelected ? 'text-orange-100' : 'text-slate-50'}`}>
                      {level.label}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-orange-100/90' : 'text-slate-300'}`}>
                      {level.description}
                    </div>
                    {isSelected && <Check className="absolute top-3 right-3 w-4 h-4 text-orange-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Duration */}
          <div>
            <label className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">3</span>
              Target Duration ⏱️
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {durations.map((dur) => {
                const isSelected = form.expectedDuration === dur.value;
                return (
                  <button
                    key={dur.value}
                    onClick={() => updateField('expectedDuration', dur.value)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'border-purple-400 bg-purple-500/20 shadow-md shadow-purple-500/40'
                        : 'border-white/10 hover:border-purple-300/70 bg-slate-900/80'
                    }`}
                  >
                    <span className="text-2xl">{dur.icon}</span>
                    <span className={`text-sm font-medium ${isSelected ? 'text-purple-100' : 'text-slate-200'}`}>
                      {dur.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Features Preview (Dynamic Display) */}
          {form.language && form.expertise && form.expectedDuration && (
            <div className="bg-gradient-to-r from-slate-900/80 via-teal-900/70 to-orange-800/70 p-6 rounded-2xl border border-teal-300/60 animate-in slide-in-from-bottom-2">
              <h4 className="flex items-center gap-2 mb-4 font-bold text-slate-50">
                <Sparkles className="w-5 h-5 text-teal-500 fill-teal-100" />
                Your AI Course Includes:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <li className="flex items-center gap-2 bg-slate-900/70 p-2 rounded-lg">
                  <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-600 text-xs">✓</span>
                  </div>
                  <span className="text-slate-100">
                    Lessons adapted for <strong>{form.expertise}s</strong>
                  </span>
                </li>
                <li className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">
                  <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-600 text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">
                    <strong>{form.language}</strong> cultural notes
                  </span>
                </li>
                <li className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">
                  <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-600 text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Voice practice with AI Tutor
                  </span>
                </li>
                <li className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">
                  <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-600 text-xs">✓</span>
                  </div>
                  <span className="text-gray-700">
                    Smart timeline: <strong>{durations.find(d => d.value === form.expectedDuration)?.label}</strong>
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 px-6 rounded-xl border border-white/20 text-slate-200 font-medium hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onGenerate}
              disabled={!form.language || !form.expertise || !form.expectedDuration}
              className={`flex-1 py-3.5 px-6 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                !form.language || !form.expertise || !form.expectedDuration
                  ? 'bg-slate-700 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 hover:scale-[1.02] hover:shadow-orange-200'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Generate Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseGenerationForm;