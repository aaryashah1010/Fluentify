import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers, useSearchUsers } from '../../../../hooks/useUserManagement';
import { UserCard } from '../components/UserCard';
import { UserSearchBar } from '../components/UserSearchBar';
import { Loader2, Users, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Search Bar */}
      <UserSearchBar onSearch={handleSearch} />

      {/* Stats */}
      {!searchQuery && pagination && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Total Users: {pagination.total}
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* User List */}
      {!isLoading && users && users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onClick={() => handleUserClick(user.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!users || users.length === 0) && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No users found' : 'No users yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Users will appear here once they sign up'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!searchQuery && pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
