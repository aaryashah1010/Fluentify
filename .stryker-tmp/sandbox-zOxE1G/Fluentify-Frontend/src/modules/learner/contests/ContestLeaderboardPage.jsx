// @ts-nocheck
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trophy, Sparkles, ArrowLeft } from 'lucide-react';
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
			<div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
					<p className="text-slate-200">Loading leaderboard...</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center px-4">
				<div className="bg-slate-900/80 rounded-2xl shadow-xl border border-white/10 p-6 max-w-md w-full text-center text-slate-100">
					<h2 className="text-lg font-semibold mb-2">Unable to load leaderboard</h2>
					<p className="text-sm text-slate-300 mb-4">Please try again later.</p>
					<Button
						onClick={() => navigate('/contests')}
						className="mt-2 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-slate-50"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>Back to Contests</span>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 text-white relative overflow-hidden">
			{/* Background glow elements */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<div className="absolute -top-40 -right-40 w-72 h-72 bg-purple-500/25 rounded-full blur-3xl" />
				<div className="absolute -bottom-40 -left-40 w-72 h-72 bg-cyan-500/25 rounded-full blur-3xl" />
			</div>

			<div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
				{/* Header with title and back button */}
				<div className="flex items-center justify-between gap-4">
					<div className="space-y-1">
						<p className="text-xs font-semibold tracking-wide uppercase text-slate-300/80">Leaderboard</p>
						<h1 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
							{contest?.title || 'Contest Leaderboard'}
						</h1>
					</div>
					<Button
						variant="secondary"
						onClick={() => navigate('/contests')}
						className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-50"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>Back</span>
					</Button>
				</div>

				{/* Leaderboard card */}
				<section className="bg-slate-900/85 backdrop-blur-xl border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden">
					<div className="bg-gradient-to-r from-purple-900/70 to-pink-900/70 px-6 py-4 border-b border-slate-700/70 flex items-center gap-2">
						<Trophy className="h-5 w-5 text-yellow-400" />
						<h2 className="text-lg font-semibold text-white">Rankings</h2>
						<Sparkles className="h-4 w-4 text-yellow-300 animate-pulse ml-1" />
						<span className="ml-auto text-xs text-slate-200/80">
							{leaderboard.length} participant{leaderboard.length === 1 ? '' : 's'}
						</span>
					</div>
					<div className="px-4 py-4 sm:px-6 sm:py-5">
						<LeaderboardTable leaderboard={leaderboard} />
					</div>
				</section>
			</div>
		</div>
	);
};

export default ContestLeaderboardPage;