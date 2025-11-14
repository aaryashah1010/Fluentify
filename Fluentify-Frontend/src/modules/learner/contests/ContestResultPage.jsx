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
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to load results</h2>
          <p className="text-sm text-gray-600 mb-4">Please go back and try again.</p>
          <Button onClick={() => navigate('/contests')}>Back to Contests</Button>
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
    <div className="min-h-screen bg-green-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{contest?.title || 'Contest Results'}</h1>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate(`/contests/${contestId}/leaderboard`)}>
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
              <Button variant="secondary" onClick={() => navigate('/contests')}>Back</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Score Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Score</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{result?.score || 0}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{correctAnswers}/{totalQuestions}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">#{result?.rank || '-'}</div>
              <div className="text-sm text-gray-600">Rank</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{formatTime(result?.time_taken_ms || 0)}</div>
              <div className="text-sm text-gray-600">Time Taken</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-lg font-semibold text-gray-700">
              Accuracy: <span className={percentage >= 70 ? 'text-green-600' : percentage >= 40 ? 'text-orange-600' : 'text-red-600'}>{percentage}%</span>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Question Review</h2>
          <div className="space-y-6">
            {submissions && submissions.map((submission, index) => (
              <div key={submission.question_id} className={`p-4 rounded-lg border-2 ${
                submission.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  {submission.is_correct ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Question {index + 1}: {submission.question_text}
                    </h3>
                    
                    <div className="space-y-2">
                      {submission.options && submission.options.map((option, optIndex) => {
                        const isCorrect = optIndex === submission.correct_option_id;
                        const isSelected = optIndex === submission.selected_option_id;
                        const optionText = typeof option === 'string' ? option : option?.text || '';
                        
                        return (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg ${
                              isCorrect
                                ? 'bg-green-100 border-2 border-green-500'
                                : isSelected
                                ? 'bg-red-100 border-2 border-red-500'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-800">{optionText}</span>
                              <div className="flex gap-2">
                                {isCorrect && (
                                  <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded">
                                    Correct Answer
                                  </span>
                                )}
                                {isSelected && !isCorrect && (
                                  <span className="text-xs font-semibold text-red-700 bg-red-200 px-2 py-1 rounded">
                                    Your Answer
                                  </span>
                                )}
                                {isSelected && isCorrect && (
                                  <span className="text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded">
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
