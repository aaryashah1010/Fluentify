import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserContestResult } from '../../../hooks/useContest';
import { Button } from '../../../components';
import { CheckCircle, XCircle, Trophy, Clock, Award } from 'lucide-react';

const ContestResultPage = () => {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const { data, isLoading, isError } = useUserContestResult(contestId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-200">Loading results...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900/80 rounded-2xl shadow-xl border border-white/10 p-6 max-w-md w-full text-center text-slate-100">
          <h2 className="text-lg font-semibold mb-2">Unable to load results</h2>
          <p className="text-sm text-slate-300 mb-4">Please go back and try again.</p>
          <Button
            onClick={() => navigate('/contests')}
            className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-slate-50 rounded-lg"
          >
            Back to Contests
          </Button>
        </div>
      </div>
    );
  }

  const { contest, result, submissions } = data;
  const totalQuestions = submissions?.length || 0;
  const correctAnswers = submissions?.filter(s => s.is_correct).length || 0;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-72 h-72 bg-purple-500/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-72 h-72 bg-cyan-500/25 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            {contest?.title || 'Contest Results'}
          </h1>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(`/contests/${contestId}/leaderboard`)}
              className="bg-white/5 hover:bg-white/10 border border-white/15 text-slate-50 flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/contests')}
              className="bg-white/5 hover:bg-white/10 border border-white/15 text-slate-50"
            >
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Score Summary */}
        <div className="bg-slate-900/80 rounded-2xl shadow-xl border border-white/10 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Your Score</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-500/15 border border-blue-500/30">
              <Award className="w-8 h-8 text-blue-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-100">{result?.score || 0}</div>
              <div className="text-sm text-slate-200">Score</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
              <CheckCircle className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-100">{correctAnswers}/{totalQuestions}</div>
              <div className="text-sm text-slate-200">Correct</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-500/15 border border-purple-500/30">
              <Trophy className="w-8 h-8 text-purple-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-100">#{result?.rank || '-'}</div>
              <div className="text-sm text-slate-200">Rank</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-500/15 border border-orange-500/30">
              <Clock className="w-8 h-8 text-orange-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-100">{formatTime(result?.time_taken_ms || 0)}</div>
              <div className="text-sm text-slate-200">Time Taken</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-lg font-semibold text-slate-100">
              Accuracy:{' '}
              <span
                className={
                  percentage >= 70
                    ? 'text-emerald-300'
                    : percentage >= 40
                    ? 'text-amber-300'
                    : 'text-rose-300'
                }
              >
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-slate-900/80 rounded-2xl shadow-xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Question Review</h2>
          <div className="space-y-6">
            {submissions &&
              submissions.map((submission, index) => (
                <div
                  key={submission.question_id}
                  className={`p-4 rounded-lg border-2 ${
                    submission.is_correct
                      ? 'border-emerald-400 bg-emerald-500/10'
                      : 'border-rose-400 bg-rose-500/10'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {submission.is_correct ? (
                      <CheckCircle className="w-6 h-6 text-emerald-300 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-300 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-100 mb-2">
                        Question {index + 1}: {submission.question_text}
                      </h3>

                      <div className="space-y-2">
                        {submission.options &&
                          submission.options.map((option, optIndex) => {
                            const isCorrect = optIndex === submission.correct_option_id;
                            const isSelected = optIndex === submission.selected_option_id;
                            const optionText = typeof option === 'string' ? option : option?.text || '';

                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border ${
                                  isCorrect
                                    ? 'bg-emerald-500/10 border-emerald-400'
                                    : isSelected
                                    ? 'bg-rose-500/10 border-rose-400'
                                    : 'bg-slate-900/60 border-slate-700'
                                }
                              `}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-100">{optionText}</span>
                                  <div className="flex gap-2">
                                    {isCorrect && (
                                      <span className="text-xs font-semibold text-emerald-100 bg-emerald-500/30 px-2 py-1 rounded">
                                        Correct Answer
                                      </span>
                                    )}
                                    {isSelected && !isCorrect && (
                                      <span className="text-xs font-semibold text-rose-100 bg-rose-500/30 px-2 py-1 rounded">
                                        Your Answer
                                      </span>
                                    )}
                                    {isSelected && isCorrect && (
                                      <span className="text-xs font-semibold text-emerald-100 bg-emerald-500/30 px-2 py-1 rounded">
                                        Your Answer ✓
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContestResultPage;