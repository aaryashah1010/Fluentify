import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserListPage, UserDetailsPage } from './index';
import { ArrowLeft } from 'lucide-react';

const UserManagementLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          
          {/* Back Button */}
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="p-2 rounded-xl bg-white border border-gray-200 
            hover:border-orange-400 hover:bg-orange-50
            transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Title */}
          <div>
            <h1 
              className="text-3xl font-extrabold 
            bg-gradient-to-r from-orange-500 via-amber-600 to-teal-500 
            bg-clip-text text-transparent tracking-tight">
              User Management
            </h1>
            <p 
              className="text-sm 
              text-gray-600 mt-1">
              View and manage learners and their progress
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <Routes>
            <Route index element={<UserListPage />} />
            <Route path=":userId" element={<UserDetailsPage />} />
            <Route path="*" element={<Navigate to="/admin/users" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default UserManagementLayout;
