import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserListPage, UserDetailsPage } from './index';
import { ArrowLeft, Users } from 'lucide-react';

const UserManagementLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="p-2 rounded-full bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white shadow-sm hover:opacity-90 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                User Management
                <Users className="w-6 h-6" />
              </h1>
              <p className="text-sm text-gray-600">View and manage learners and their progress</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route index element={<UserListPage />} />
          <Route path=":userId" element={<UserDetailsPage />} />
          <Route path="*" element={<Navigate to="/admin/users" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default UserManagementLayout;
