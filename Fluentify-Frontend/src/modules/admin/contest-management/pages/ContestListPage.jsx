import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, Calendar, Users, Edit, Trash2, ArrowLeft, Star, Award, BookOpen, Eye } from 'lucide-react';
import { useAdminContests, useDeleteContest } from '../../../../hooks/useContest';
import { Button } from '../../../../components';
import { useTheme } from '../../../../contexts/ThemeContext';

const ContestListPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, darkModeStyles, darkModeClasses } = useTheme();
  const { data: contests = [], isLoading } = useAdminContests();
  const deleteContest = useDeleteContest();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const getStatusBadge = (status) => {
    const badges = {
      DRAFT: 'bg-gray-100 text-gray-700',
      PUBLISHED: 'bg-blue-100 text-blue-700',
      ACTIVE: 'bg-green-100 text-green-700',
      ENDED: 'bg-emerald-100 text-emerald-700',
    };
    return badges[status] || badges.DRAFT;
  };

  const getStatusLabel = (status) => {
    const labels = {
      DRAFT: 'Draft',
      PUBLISHED: 'Published',
      ACTIVE: 'Ongoing',
      ENDED: 'Completed',
    };
    return labels[status] || status;
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

  const isContestOngoing = (contest) => {
    if (!contest) return false;
    const { start_time, end_time, status } = contest;
    if (!start_time || !end_time) {
      return status === 'ACTIVE';
    }
    const now = new Date();
    const start = new Date(start_time);
    const end = new Date(end_time);
    return status === 'ACTIVE' && now >= start && now <= end;
  };

  const isContestEnded = (contest) => {
    if (!contest || !contest.end_time) return contest?.status === 'ENDED';
    const now = new Date();
    const end = new Date(contest.end_time);
    return now > end || contest.status === 'ENDED';
  };

  // Derived stats for header row
  const {
    totalContests,
    activeContests,
    completedContests,
    participantsThisWeek,
    xpDistributed,
  } = useMemo(() => {
    if (!contests || contests.length === 0) {
      return {
        totalContests: 0,
        activeContests: 0,
        completedContests: 0,
        participantsThisWeek: 0,
        xpDistributed: 0,
      };
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totals = {
      totalContests: contests.length,
      activeContests: 0,
      completedContests: 0,
      participantsThisWeek: 0,
      xpDistributed: 0,
    };

    contests.forEach((contest) => {
      if (contest.status === 'ACTIVE') totals.activeContests += 1;
      if (contest.status === 'ENDED') totals.completedContests += 1;

      const participants = contest.participant_count || 0;
      const start = contest.start_time ? new Date(contest.start_time) : null;
      if (start && start >= weekAgo && start <= now) {
        totals.participantsThisWeek += participants;
      }

      const reward = contest.reward_points || 0;
      totals.xpDistributed += reward * participants;
    });

    return totals;
  }, [contests]);

  return (
    <div className={`min-h-screen p-6 ${darkModeClasses}`} style={darkModeStyles}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`rounded-2xl p-6 shadow-sm border ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white border-slate-200'
          }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] shadow hover:opacity-90 transition-opacity"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
              <div>
                <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Contest Management
                  <Trophy className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                </h1>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Create and manage language learning contests</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/admin/contests/new')}
              className="flex items-center gap-2 bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white border-none hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              Create Contest
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}


      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Stats Row */}
        {!isLoading && (
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-[#FCECCC] rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[11px] text-gray-700">Total Contests</p>
                <p className="text-lg font-semibold text-gray-900">{totalContests}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-gray-900" />
              </div>
            </div>
            <div className="bg-[#FCECCC] rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[11px] text-gray-700">Active Contests</p>
                <p className="text-lg font-semibold text-gray-900">{activeContests}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <Star className="w-4 h-4 text-gray-900" />
              </div>
            </div>
            <div className="bg-[#FCECCC] rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[11px] text-gray-700">Completed</p>
                <p className="text-lg font-semibold text-gray-900">{completedContests}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-gray-900" />
              </div>
            </div>
            <div className="bg-[#FCECCC] rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[11px] text-gray-700">Participants This Week</p>
                <p className="text-lg font-semibold text-gray-900">{participantsThisWeek}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-900" />
              </div>
            </div>
            <div className="bg-[#FCECCC] rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[11px] text-gray-700">XP Distributed</p>
                <p className="text-lg font-semibold text-gray-900">{xpDistributed}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <Award className="w-4 h-4 text-gray-900" />
              </div>
            </div>
          </section>
        )}

        {/* Contests Section Header */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-lg font-semibold text-slate-900">Contests</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : contests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Contests Yet</h3>
            <p className="text-gray-600 mb-6">Create your first contest to get started</p>
            <Button
              onClick={() => navigate('/admin/contests/new')}
              icon={<Plus className="w-4 h-4" />}
              variant="ghost"
              className="bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] text-white rounded-full shadow hover:opacity-90 transition-opacity"
            >
              Create Your First Contest
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => (
              <div
                key={contest.id}
                className="h-full flex flex-col bg-white border border-[#E8F4ED] rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 overflow-hidden"
              >
                {/* Contest Header with gradient band */}
                <div className="bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/70 mb-1">Contest</p>
                    <h3 className="text-lg font-semibold text-white truncate">
                      {contest.title}
                    </h3>
                    <p className="text-xs text-white/80 truncate">
                      Level: {contest.level || 'All levels'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold shadow-sm ${getStatusBadge(
                        isContestEnded(contest) ? 'ENDED' : contest.status
                      )}`}
                    >
                      {isContestEnded(contest) ? getStatusLabel('ENDED') : getStatusLabel(contest.status)}
                    </span>
                  </div>
                </div>

                {/* Contest Details */}
                <div className="px-5 py-4 space-y-3 text-sm text-slate-700 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-2xl bg-[#F29A36]/10 text-[#F29A36] flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase text-slate-400 tracking-[0.08em]">Start</p>
                      <p className="font-medium text-slate-800">{formatDate(contest.start_time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-2xl bg-[#56D7C5]/10 text-[#56D7C5] flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase text-slate-400 tracking-[0.08em]">End</p>
                      <p className="font-medium text-slate-800">{formatDate(contest.end_time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-2xl bg-[#A8C79B]/15 text-[#4C7C5C] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase text-slate-400 tracking-[0.08em]">Participants</p>
                      <p className="font-medium text-slate-800">{contest.participant_count || 0} joined</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-2xl bg-[#F29A36]/10 text-[#F29A36] flex items-center justify-center">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase text-slate-400 tracking-[0.08em]">Summary</p>
                      <p className="font-medium text-slate-800">
                        {contest.question_count || 0} questions • {contest.reward_points || 0} XP reward
                      </p>
                    </div>
                  </div>
                  {contest.description && (
                    <p className="text-xs text-slate-500 bg-slate-50 rounded-2xl px-4 py-3">
                      {contest.description}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate(`/admin/contests/${contest.id}/leaderboard`)}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline-offset-2 hover:underline"
                    >
                      View Leaderboard
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap gap-3 mt-auto">
                  {isContestEnded(contest) ? (
                    <button
                      onClick={() => navigate(`/admin/contests/${contest.id}/edit`)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-800 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  ) : (
                    <>
                      {!isContestOngoing(contest) && (
                        <button
                          onClick={() => navigate(`/admin/contests/${contest.id}/edit`)}
                          className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-2xl bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] shadow-sm hover:opacity-90 transition"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(contest.id)}
                        className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-2xl transition ${isContestOngoing(contest)
                          ? 'text-red-700 bg-red-50 hover:bg-red-100'
                          : 'text-red-700 bg-red-100 hover:bg-red-200'
                          }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Contest?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this contest? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteContest.isLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteContest.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestListPage;
