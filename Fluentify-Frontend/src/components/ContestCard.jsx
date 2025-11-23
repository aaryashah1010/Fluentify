import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

/**
 * Contest Card Component
 * Displays contest information with action buttons
 */
const ContestCard = ({ contest, isAdmin = false }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-slate-800/70 text-slate-100';
      case 'PUBLISHED':
        return 'bg-blue-500/20 text-blue-100';
      case 'ACTIVE':
        return 'bg-emerald-500/20 text-emerald-100';
      case 'ENDED':
        return 'bg-red-500/20 text-red-100';
      default:
        return 'bg-slate-800/70 text-slate-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isContestActive = () => {
    const now = new Date();
    const startTime = new Date(contest.start_time);
    const endTime = new Date(contest.end_time);
    return now >= startTime && now <= endTime && contest.status === 'ACTIVE';
  };

  const handleAction = () => {
    if (isAdmin) {
      navigate(`/admin/contest/${contest.id}`);
    } else {
      // If learner has submitted, show results
      if (contest.has_submitted) {
        navigate(`/contests/${contest.id}/result`);
      } else if (isContestActive()) {
        navigate(`/contests/${contest.id}`);
      } else if (contest.status === 'ENDED') {
        navigate(`/contests/${contest.id}/leaderboard`);
      }
    }
  };

  const getActionButtonText = () => {
    if (isAdmin) {
      return 'Manage';
    }
    // If learner has submitted, show "View Results"
    if (contest.has_submitted) {
      return 'View Results';
    }
    if (isContestActive()) {
      return 'Start Contest';
    }
    if (contest.status === 'ENDED') {
      return 'View Leaderboard';
    }
    if (contest.status === 'PUBLISHED') {
      return 'Coming Soon';
    }
    return 'View';
  };

  const isActionDisabled = () => {
    if (isAdmin) return false;
    // Enable if submitted (to view results)
    if (contest.has_submitted) return false;
    return contest.status === 'PUBLISHED' || contest.status === 'DRAFT';
  };

  return (
    <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-cyan-400/60 transform hover:-translate-y-0.5 transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{contest.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contest.status)}`}>
          {contest.status}
        </span>
      </div>

      {/* Description */}
      {contest.description && (
        <p className="text-slate-300 mb-4 line-clamp-2">{contest.description}</p>
      )}

      {/* Contest Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-slate-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Start: {formatDate(contest.start_time)}</span>
        </div>
        <div className="flex items-center text-sm text-slate-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>End: {formatDate(contest.end_time)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4 text-sm">
        {contest.question_count !== undefined && (
          <div className="flex items-center text-slate-300">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{contest.question_count} Questions</span>
          </div>
        )}
        {contest.participant_count !== undefined && (
          <div className="flex items-center text-slate-300">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{contest.participant_count} Participants</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <Button
        variant={isContestActive() ? 'primary' : 'secondary'}
        className="w-full"
        onClick={handleAction}
        disabled={isActionDisabled()}
      >
        {getActionButtonText()}
      </Button>
    </div>
  );
};

export default ContestCard;
