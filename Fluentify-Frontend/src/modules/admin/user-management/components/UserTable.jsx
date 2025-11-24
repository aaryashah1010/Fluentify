import React from 'react';

const UserTable = ({ learners = [], loading = false, onRowClick, total = 0, page = 1, pageSize = 20, onPageChange }) => {
  return (
    <div className="bg-slate-950/80 border border-white/10 rounded-3xl shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-slate-200">
          <thead className="bg-slate-900/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Join Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Last Activity</th>
            </tr>
          </thead>
          <tbody className="bg-slate-950/40 divide-y divide-white/10">
            {loading ? (
              <tr><td className="px-4 py-6 text-center text-slate-400" colSpan={4}>Loading...</td></tr>
            ) : learners.length === 0 ? (
              <tr><td className="px-4 py-6 text-center text-slate-400" colSpan={4}>No learners found</td></tr>
            ) : (
              learners.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  onClick={() => onRowClick && onRowClick(u)}
                >
                  <td className="px-4 py-3 text-sm text-slate-50">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">{u.last_activity_date ? new Date(u.last_activity_date).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Simple pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-slate-200 text-sm">
        <div>Total: {total}</div>
        <div className="space-x-2">
          <button
            className="px-3 py-1 border border-white/20 rounded-lg bg-slate-900/70 hover:bg-slate-800 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => onPageChange && onPageChange(page - 1)}
          >Prev</button>
          <span>Page {page}</span>
          <button
            className="px-3 py-1 border border-white/20 rounded-lg bg-slate-900/70 hover:bg-slate-800 disabled:opacity-50"
            disabled={page * pageSize >= total}
            onClick={() => onPageChange && onPageChange(page + 1)}
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;