import React from 'react';

const UserTable = ({ learners = [], loading = false, onRowClick, total = 0, page = 1, pageSize = 20, onPageChange }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={4}>Loading...</td></tr>
            ) : learners.length === 0 ? (
              <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={4}>No learners found</td></tr>
            ) : (
              learners.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onRowClick && onRowClick(u)}>
                  <td className="px-4 py-3 text-sm text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{u.last_activity_date ? new Date(u.last_activity_date).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Simple pagination */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm text-gray-600">Total: {total}</div>
        <div className="space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => onPageChange && onPageChange(page - 1)}
          >Prev</button>
          <span className="text-sm">Page {page}</span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={page * pageSize >= total}
            onClick={() => onPageChange && onPageChange(page + 1)}
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;


