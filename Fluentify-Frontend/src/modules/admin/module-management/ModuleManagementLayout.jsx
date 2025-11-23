import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LanguageListPage, CourseListPage, CourseEditorPage } from './index';
import { ArrowLeft } from 'lucide-react';

const ModuleManagementLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 text-slate-50 relative overflow-x-hidden">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-24 right-24 text-7xl opacity-20 animate-bounce" style={{ animationDuration: '3.2s' }}>📚</div>
        <div className="absolute top-40 left-16 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.6s' }}>🌍</div>
        <div className="absolute bottom-40 right-32 text-7xl opacity-20 animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '1s' }}>✨</div>
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* Main column */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 border-b border-white/10 shadow-lg backdrop-blur-xl">
            <div className="w-full px-4 py-4 sm:px-6 lg:px-10 xl:px-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/admin-dashboard')}
                  className="p-2 hover:bg-slate-800/60 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-200" />
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-50">Module Management</h1>
                  <p className="text-xs md:text-sm text-slate-300 mt-1">Create and manage language courses, units, and lessons.</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="w-full px-4 py-8 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
            <Routes>
              <Route index element={<LanguageListPage />} />
              <Route path=":language" element={<CourseListPage />} />
              {/* Course Editor routes */}
              <Route path="course/new" element={<CourseEditorPage />} />
              <Route path="course/edit/:courseId" element={<CourseEditorPage />} />
              <Route path="course/view/:courseId" element={<CourseEditorPage />} />
              <Route path="*" element={<Navigate to="/admin/modules" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ModuleManagementLayout;
