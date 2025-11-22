import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LanguageListPage, CourseListPage, CourseEditorPage } from './index';
import { ArrowLeft, BookOpen } from 'lucide-react';

const ModuleManagementLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] shadow hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">Modules</p>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                Module Management
                <BookOpen className="w-5 h-5" />
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Create and manage language courses and levels.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
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
  );
};

export default ModuleManagementLayout;
