import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserListPage, UserDetailsPage } from './index';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
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
