import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContestDetails, useSubmitContest } from '../../../hooks/useContest';
import { Button } from '../../../components';
import { Clock, Trophy, Sparkles } from 'lucide-react';

const ContestParticipatePage = () => {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const { data, isLoading, isError } = useContestDetails(contestId);
  const submitMutation = useSubmitContest();

  const [selected, setSelected] = useState({}); // {questionIndex: optionIndex}
  const [startedAt, setStartedAt] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(null); // in seconds
  const timerRef = useRef(null);
  const hasAutoSubmitted = useRef(false);

  const contest = data?.contest || data || {};
  const questions = useMemo(() => data?.questions || [], [data]);

  useEffect(() => {
    setStartedAt(Date.now());
  }, [contestId]);

  const handleAutoSubmit = useCallback(async () => {
    try {
      const submissions = questions.map((q, i) => ({
        question_id: q.id ?? i,
        selected_option_id: selected[i] ?? 0, // Default to first option if not answered
      }));
      await submitMutation.mutateAsync({
        contestId,
        data: {
          start_time: startedAt,
          submissions,
        },
      });
      alert('Time is up! Your contest has been automatically submitted.');
      navigate('/contests');
    } catch (err) {
      console.error('Auto-submit failed:', err);
      navigate('/contests');
    }
  }, [questions, selected, submitMutation, contestId, startedAt, navigate]);

  // Calculate and update time remaining
  useEffect(() => {
    if (!contest?.end_time) return;

    const updateTimer = () => {
      const now = Date.now();
      const endTime = new Date(contest.end_time).getTime();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeRemaining(remaining);

      // Auto-submit when time runs out
      if (remaining === 0 && !hasAutoSubmitted.current) {
        hasAutoSubmitted.current = true;
        handleAutoSubmit();
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [contest?.end_time, handleAutoSubmit]);

  const handleSelect = (qi, oi) => {
    setSelected((prev) => ({ ...prev, [qi]: oi }));
  };

  const allAnswered = questions.length > 0 && questions.every((_, i) => selected[i] !== undefined);

  // Format time remaining for display
  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    try {
      const submissions = questions.map((q, i) => ({
        question_id: q.id ?? i,
        selected_option_id: selected[i],
      }));
      await submitMutation.mutateAsync({
        contestId,
        data: {
          start_time: startedAt,
          submissions,
        },
      });
      navigate('/contests');
    } catch (err) {
      alert(err?.message || 'Failed to submit');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-orange-50 to-slate-100 dark:from-teal-900 dark:via-orange-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-200">Loading contest...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-orange-50 to-slate-100 dark:from-teal-900 dark:via-orange-900 dark:to-slate-950 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-6 max-w-md w-full text-center text-slate-900 dark:text-slate-100">
          <h2 className="text-lg font-semibold mb-2">Unable to load contest</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300 mb-4">Please go back and try again.</p>
          <Button
            onClick={() => navigate('/contests')}
            className="mt-2 inline-flex items-center gap-2 bg-slate-900/5 hover:bg-slate-900/10 border border-slate-300 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/20 text-slate-900 dark:text-slate-50"
          >
            <span>Back to Contests</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-orange-50 to-slate-100 dark:from-teal-900 dark:via-orange-900 dark:to-slate-950 text-slate-900 dark:text-white relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-72 h-72 bg-purple-500/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-72 h-72 bg-cyan-500/25 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header with title, timer, back button */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-300/80">Contest</p>
            <h1 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {contest?.title || 'Contest'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {timeRemaining !== null && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm shadow-md ${
                  timeRemaining < 300
                    ? 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-500/15 dark:text-red-200 dark:border-red-500/40'
                    : 'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-500/15 dark:text-blue-200 dark:border-blue-500/40'
                  }
                `}
              >
                <Clock className="w-5 h-5" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <Button
              variant="secondary"
              onClick={() => navigate('/contests')}
              className="flex items-center gap-2 bg-slate-900/5 hover:bg-slate-900/10 border border-slate-300 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/15 text-slate-900 dark:text-slate-50"
            >
              <span>Back</span>
            </Button>
          </div>
        </div>

        {/* Questions */}
        <main className="space-y-6">
          {questions.length === 0 ? (
            <div className="bg-white/90 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700/70 rounded-2xl shadow-xl p-6 text-center text-slate-600 dark:text-slate-200">
              No questions available.
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, qi) => (
                <div
                  key={q.id ?? qi}
                  className="bg-white/90 dark:bg-slate-900/85 border border-slate-200 dark:border-slate-700/70 rounded-2xl shadow-md p-6"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
                    {qi + 1}. {q.question_text}
                  </h3>
                  <div className="space-y-2">
                    {(Array.isArray(q.options) ? q.options : []).map((opt, oi) => {
                      const label = typeof opt === 'string' ? opt : opt?.text ?? '';
                      const isSelected = selected[qi] === oi;
                      return (
                        <label
                          key={oi}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-100 dark:bg-emerald-500/10'
                              : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/60 hover:border-slate-400 dark:hover:border-slate-500'
                            }
                          `}
                        >
                          <input
                            type="radio"
                            name={`q-${qi}`}
                            checked={isSelected}
                            onChange={() => handleSelect(qi, oi)}
                            className="w-4 h-4 text-emerald-500"
                          />
                          <span className="text-slate-800 dark:text-slate-100">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={!allAnswered || submitMutation.isPending}>
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Contest'}
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ContestParticipatePage;