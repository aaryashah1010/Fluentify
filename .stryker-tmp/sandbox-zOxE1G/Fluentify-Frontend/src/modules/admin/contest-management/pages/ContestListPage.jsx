// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, Calendar, Users, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { useAdminContests, useDeleteContest } from '../../../../hooks/useContest';
import { Button } from '../../../../components';

const ContestListPage = () => {
  const navigate = useNavigate();
  const { data: contests = [], isLoading } = useAdminContests();
  const deleteContest = useDeleteContest();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const getStatusBadge = (status) => {
    const badges = {
      DRAFT: 'bg-slate-900/80 text-slate-200 border border-white/10',
      PUBLISHED: 'bg-sky-500/15 text-sky-300 border border-sky-400/60',
      ACTIVE: 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/60',
      ENDED: 'bg-rose-500/15 text-rose-300 border border-rose-400/60',
    };
    return badges[status] || badges.DRAFT;
  };

  const handleDelete = async (contestId) => {
    try {
      await deleteContest.mutateAsync(contestId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete contest:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 text-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-950/95 border-b border-white/10 shadow-lg backdrop-blur-xl">
        <div className="w-full max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="p-2 hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-200" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.6)]">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-50">Contest Management</h1>
                <p className="text-xs md:text-sm text-slate-300 mt-1">
                  Create and manage weekly learner contests.
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => navigate('/admin/contests/new')}
            icon={<Plus className="w-4 h-4" />}
            className="bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600"
          >
            Create Contest
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 p-6 animate-pulse"
              >
                <div className="h-6 bg-slate-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl">
            <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-50 mb-2">No Contests Yet</h3>
            <p className="text-slate-300 mb-6">Create your first contest to get started.</p>
            <Button
              onClick={() => navigate('/admin/contests/new')}
              icon={<Plus className="w-4 h-4" />}
              className="bg-gradient-to-r from-teal-500 to-orange-500 text-slate-950 rounded-xl hover:from-teal-600 hover:to-orange-600"
            >
              Create Your First Contest
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {contests.map((contest) => (
              <div
                key={contest.id}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all"
              >
                {/* Glow blob */}
                <div className="pointer-events-none absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-amber-400/30 to-orange-500/20 rounded-full blur-2xl" />

                {/* Contest Header */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center shadow-md">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-50 line-clamp-2">
                        {contest.title}
                      </h3>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full ${getStatusBadge(
                        contest.status
                      )}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {contest.status}
                    </span>
                  </div>
                </div>

                {/* Contest Details */}
                <div className="space-y-2 mb-4 text-xs text-slate-300 relative z-10">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-orange-500 border border-white/15">
                    <Calendar className="w-4 h-4 text-amber-300" />
                    <span>Start: {formatDate(contest.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-orange-500 border border-white/15">
                    <Calendar className="w-4 h-4 text-amber-300" />
                    <span>End: {formatDate(contest.end_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{contest.participant_count || 0} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-slate-400" />
                    <span>{contest.question_count || 0} questions</span>
                  </div>
                </div>

                {/* Description */}
                {contest.description && (
                  <p className="text-xs text-slate-300 mb-4 line-clamp-2 relative z-10">
                    {contest.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/10 relative z-10">
                  <button
                    onClick={() => navigate(`/admin/contests/${contest.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-100 bg-slate-900/80 hover:bg-slate-800/80 rounded-xl border border-white/10 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/admin/contests/${contest.id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-950 bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 rounded-xl transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(contest.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-200 bg-rose-950/70 hover:bg-rose-900/80 rounded-xl border border-rose-500/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-950/95 border border-white/10 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">Delete Contest?</h3>
            <p className="text-sm text-slate-300 mb-6">
              Are you sure you want to delete this contest? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-xs font-medium text-slate-100 bg-slate-900/80 hover:bg-slate-800/80 rounded-xl border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteContest.isLoading}
                className="flex-1 px-4 py-2 text-xs font-medium text-slate-50 bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-50"
              >
                {deleteContest.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContestListPage;
