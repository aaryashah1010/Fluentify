// @ts-nocheck
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserListPage, UserDetailsPage } from './index';
import { ArrowLeft } from 'lucide-react';

const UserManagementLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 text-slate-50 relative overflow-x-hidden">
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
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-50">User Management</h1>
                  <p className="text-xs md:text-sm text-slate-300 mt-1">View and manage learners and their progress.</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="w-full px-4 py-8 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
            <Routes>
              <Route index element={<UserListPage />} />
              <Route path=":userId" element={<UserDetailsPage />} />
              <Route path="*" element={<Navigate to="/admin/users" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserManagementLayout;