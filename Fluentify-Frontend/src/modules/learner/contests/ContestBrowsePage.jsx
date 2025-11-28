import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Sparkles, Users, Award, Target, ArrowLeft } from 'lucide-react';
import { useAvailableContests } from '../../../hooks/useContest';
import ContestCard from '../../../components/ContestCard';
import { Button } from '../../../components';

const ContestBrowsePage = () => {
	const navigate = useNavigate();
	const { data: contests = [], isLoading, isError } = useAvailableContests();

	const activeContests = Array.isArray(contests)
		? contests.filter((c) => c.status === 'ACTIVE')
		: [];

	const totalParticipants = Array.isArray(contests)
		? contests.reduce((sum, c) => {
				const baseCount = typeof c.participant_count === 'number' ? c.participant_count : 0;
				const includesCurrentUser = c.has_submitted ? 1 : 0;
				return sum + baseCount + includesCurrentUser;
			}, 0)
		: 0;

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
					<p className="text-slate-200">Loading contests...</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center px-4">
				<div className="bg-slate-900/80 border border-white/10 rounded-2xl shadow-xl p-6 max-w-md w-full text-center text-slate-100">
					<h2 className="text-lg font-semibold mb-2">Unable to load contests</h2>
					<p className="text-sm text-slate-300 mb-4">Please try again later.</p>
					<Button
						onClick={() => navigate('/dashboard')}
						className="mt-2 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-slate-50"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>Back to Dashboard</span>
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

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
				{/* Header with back button and title */}
				<div className="flex items-center justify-between gap-4">
					<Button
						variant="secondary"
						onClick={() => navigate('/dashboard')}
						className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-50"
					>
						<ArrowLeft className="w-4 h-4" />
						<span>Back to Dashboard</span>
					</Button>
					<h1 className="text-2xl sm:text-3xl font-semibold text-white">
						Contests &amp; Competitions
					</h1>
				</div>

				{/* Hero section */}
				<section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-teal-600/80 via-emerald-500/80 to-orange-500/80 shadow-xl">
					<div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/30 to-black/40" />
					<div className="relative px-6 sm:px-10 py-8 sm:py-10 flex flex-col gap-6">
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
							<div className="flex-1 space-y-4">
								<div className="flex items-center gap-3">
									<div className="p-3 bg-white/20 rounded-2xl">
										<Trophy className="h-8 w-8 text-yellow-300" />
									</div>
									<div>
										<p className="text-xs font-semibold tracking-wide uppercase text-white/80">
											Fluentify Contests
										</p>
										<p className="text-sm text-white/90">
											Compete with learners worldwide, climb the leaderboard, and earn XP &amp; badges.
										</p>
									</div>
									<Sparkles className="hidden sm:block h-5 w-5 text-yellow-200 animate-pulse" />
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3 max-w-md w-full">
								<div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
									<Target className="h-5 w-5 text-cyan-200 mb-1" />
									<div className="text-2xl font-semibold">{activeContests.length}</div>
									<div className="text-xs text-white/70">Active Contests</div>
								</div>
								<div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
									<Users className="h-5 w-5 text-purple-200 mb-1" />
									<div className="text-2xl font-semibold">{totalParticipants}</div>
									<div className="text-xs text-white/70">Contests Participated</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Contests grid / empty state */}
				<main className="space-y-6">
					{contests.length === 0 ? (
						<section className="bg-slate-900/80 border border-white/10 rounded-3xl p-10 text-center shadow-lg">
							<svg
								className="w-16 h-16 text-slate-400 mx-auto mb-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<h2 className="text-xl font-semibold mb-2">No contests available</h2>
							<p className="text-sm text-slate-300">
								New contests will appear here once they are published. Please check back later.
							</p>
						</section>
					) : (
						<section className="space-y-4">
							<div className="flex items-center gap-2">
								<Sparkles className="h-5 w-5 text-purple-300" />
								<h2 className="text-lg sm:text-xl font-semibold">Available Contests</h2>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{contests.map((c) => (
									<div key={c.id} className="h-full">
										<ContestCard contest={c} isAdmin={false} />
									</div>
								))}
							</div>
						</section>
					)}
				</main>
			</div>
		</div>
	);
};

export default ContestBrowsePage;