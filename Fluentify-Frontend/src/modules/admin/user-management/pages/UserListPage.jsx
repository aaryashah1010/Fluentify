import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers, useSearchUsers } from '../../../../hooks/useUserManagement';
import { UserCard } from '../components/UserCard';
import { UserSearchBar } from '../components/UserSearchBar';
import { Loader2, Users, ChevronLeft, ChevronRight, UserCheck, UserPlus } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F6FFFB] px-4 py-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">

        {/* Search Bar */}
        <div className="sticky top-16 z-20 sm:static sm:top-auto bg-[#F6FFFB] pb-3 sm:pb-0">
          <UserSearchBar onSearch={handleSearch} />
        </div>

        {/* Stats Cards */}
        {!searchQuery && pagination && (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {/* Total Users */}
            <div className="min-w-[220px] sm:min-w-0 bg-[#FCECCC] rounded-2xl shadow-lg hover:shadow-xl transition-all px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white flex items-center justify-center shadow-md flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wide truncate">Total Users</p>
                <p className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">{pagination.total}</p>
              </div>
            </div>

            {/* Active Users */}
            <div className="min-w-[220px] sm:min-w-0 bg-[#FCECCC] rounded-2xl shadow-lg hover:shadow-xl transition-all px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white flex items-center justify-center shadow-md flex-shrink-0">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-xs font-semibold text-gray-700 mb-0.5 uppercase tracking-wide truncate">Active Users</p>
                <p className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">{users?.filter(u => u.is_verified).length || 0}</p>
              </div>
            </div>

            {/* Current Page */}
            <div className="min-w-[220px] sm:min-w-0 bg-[#FCECCC] rounded-2xl shadow-lg hover:shadow-xl transition-all px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white flex items-center justify-center shadow-md flex-shrink-0">
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-xs font-semibold text-gray-700 mb-0.5 uppercase tracking-wide truncate">Current Page</p>
                <p className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                  {pagination.page}{' '}
                  <span className="text-sm sm:text-lg font-semibold text-gray-700">{pagination.pages}</span>
                </p>
              </div>
            </div>

            {/* Showing */}
            <div className="min-w-[220px] sm:min-w-0 bg-[#FCECCC] rounded-2xl shadow-lg hover:shadow-xl transition-all px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white flex items-center justify-center shadow-md flex-shrink-0">
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-xs font-semibold text-gray-700 mb-0.5 uppercase tracking-wide truncate">Showing</p>
                <p className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">{users?.length || 0}</p>
              </div>
            </div>
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
