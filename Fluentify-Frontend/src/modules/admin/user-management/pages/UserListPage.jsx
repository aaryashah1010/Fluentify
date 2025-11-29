import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers, useSearchUsers } from '../../../../hooks/useUserManagement';
import { UserCard } from '../components/UserCard';
import { UserSearchBar } from '../components/UserSearchBar';
import { Loader2, Users, ChevronLeft, ChevronRight, UserCheck, UserPlus, TrendingUp, Activity } from 'lucide-react';

const UserListPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 20;

  // Use search query if available, otherwise fetch paginated users
  const { data: usersData, isLoading: isLoadingUsers } = useUsers(page, limit);
  const { data: searchResults, isLoading: isSearching } = useSearchUsers(searchQuery);

  const isLoading = searchQuery ? isSearching : isLoadingUsers;
  const users = searchQuery ? searchResults : usersData?.users;
  const pagination = usersData?.pagination;

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on new search
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 via-sky-500 to-orange-400 rounded-xl flex items-center justify-center shadow-[0_0_22px_rgba(56,189,248,0.6)]">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-50">User Management</h1>
          </div>
          <p className="text-sm md:text-base text-slate-200">Manage learners and monitor their progress.</p>
        </div>

        {/* Search Bar */}
        <UserSearchBar onSearch={handleSearch} />

        {/* Stats Cards */}
        {!searchQuery && pagination && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Users */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all p-6">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-teal-500/25 to-sky-500/25 rounded-full blur-2xl" />
              <div className="relative flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-sky-500 rounded-xl flex items-center justify-center shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Activity className="w-5 h-5 text-teal-300" />
              </div>
              <p className="text-sm font-medium text-slate-300 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-slate-50">{pagination.total}</p>
            </div>

            {/* Active Users */}

            {/* Current Page */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 shadow-xl hover:shadow-2xl transition-all p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-300 mb-1">Current Page</p>
              <p className="text-3xl font-bold text-slate-50">{pagination.page} <span className="text-lg text-slate-300">of {pagination.pages}</span></p>
            </div>

            {/* Showing */}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <Users className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
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
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-blue-600" />
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
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg">
              Page {pagination.page} of {pagination.pages}
            </div>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
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