import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLeaderboard } from '../../../hooks/useContest';
import LeaderboardTable from '../../../components/LeaderboardTable';
import { Button } from '../../../components';

const ContestLeaderboardPage = () => {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const { data, isLoading, isError } = useLeaderboard(contestId);

  const contest = data?.contest || {};
  const leaderboard = data?.leaderboard || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to load leaderboard</h2>
          <p className="text-sm text-gray-600 mb-4">Please try again later.</p>
          <Button onClick={() => navigate('/contests')}>Back to Contests</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{contest?.title || 'Leaderboard'}</h1>
          <Button variant="secondary" onClick={() => navigate('/contests')}>Back</Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <LeaderboardTable leaderboard={leaderboard} />
      </main>
    </div>
  );
};

export default ContestLeaderboardPage;
