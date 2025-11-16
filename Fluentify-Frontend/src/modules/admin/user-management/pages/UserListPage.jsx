import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers, useSearchUsers } from '../../../../hooks/useUserManagement';
import { UserCard } from '../components/UserCard';
import { UserSearchBar } from '../components/UserSearchBar';

import {
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserPlus,
  TrendingUp,
  Activity
} from 'lucide-react';

const UserListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 20;

  const { data: usersData, isLoading: isLoadingUsers } = useUsers(page, limit);
  const { data: searchResults, isLoading: isSearching } = useSearchUsers(searchQuery);

  const isLoading = searchQuery ? isSearching : isLoadingUsers;
  const users = searchQuery ? searchResults : usersData?.users;
  const pagination = usersData?.pagination;

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>

            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
              User Management
            </h1>
          </div>
          <p className="text-gray-600 text-lg ml-1">
            View and manage learners and their progress
          </p>
        </div>

        {/* Search Bar */}
        <UserSearchBar onSearch={handleSearch} />

        {/* Stats Cards */}
        {!searchQuery && pagination && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Total Users */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl shadow-md hover:shadow-lg border border-orange-100 p-6 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Activity className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <p className="text-3xl font-bold text-slate-900">{pagination.total}</p>
            </div>


            {/* Active Users */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-md hover:shadow-lg border border-green-100 p-6 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-slate-600">Active Users</p>
              <p className="text-3xl font-bold text-slate-900">{users?.filter(u => u.is_verified).length || 0}</p>
            </div>


            {/* Current Page */}
            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl shadow-md hover:shadow-lg border border-teal-100 p-6 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-600">Current Page</p>
              <p className="text-3xl font-bold text-slate-900">
                {pagination.page} <span className="text-lg text-slate-600">of {pagination.pages}</span>
              </p>
            </div>


            {/* Showing */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-3xl shadow-md hover:shadow-lg border border-red-100 p-6 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center shadow">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-600">Showing</p>
              <p className="text-3xl font-bold text-slate-900">{users?.length || 0}</p>
            </div>
          </div>
        )}


        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-teal-500 mx-auto"></div>
                <Users className="w-8 h-8 text-teal-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-6 text-lg font-medium text-gray-700">Loading users...</p>
            </div>
          </div>
        )}

        {/* User List */}
        {!isLoading && users && users.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Learners</h2>
              <span className="text-sm text-gray-600">{users.length} users displayed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onClick={() => handleUserClick(user.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!users || users.length === 0) && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery ? 'No users found' : 'No users yet'}
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Users will appear here once they sign up'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!searchQuery && pagination && pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">

            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl 
              hover:border-teal-400 hover:shadow-md disabled:opacity-50 transition-all font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="px-6 py-3 bg-gradient-to-r from-orange-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg">
              Page {pagination.page} of {pagination.pages}
            </div>

            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl
              hover:border-teal-400 hover:shadow-md disabled:opacity-50 transition-all font-medium"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default UserListPage;
