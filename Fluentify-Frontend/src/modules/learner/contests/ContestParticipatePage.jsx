import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContestDetails, useSubmitContest } from '../../../hooks/useContest';
import { Button } from '../../../components';
import { Clock } from 'lucide-react';

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
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contest...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to load contest</h2>
          <p className="text-sm text-gray-600 mb-4">Please go back and try again.</p>
          <Button onClick={() => navigate('/contests')}>Back to Contests</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{contest?.title || 'Contest'}</h1>
            <div className="flex items-center gap-4">
              {timeRemaining !== null && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                  timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Clock className="w-5 h-5" />
                  <span>{formatTime(timeRemaining)}</span>
                </div>
              )}
              <Button variant="secondary" onClick={() => navigate('/contests')}>Back</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {questions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-600">No questions available.</div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, qi) => (
              <div key={q.id ?? qi} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{qi + 1}. {q.question_text}</h3>
                <div className="space-y-2">
                  {(Array.isArray(q.options) ? q.options : []).map((opt, oi) => {
                    const label = typeof opt === 'string' ? opt : (opt?.text ?? '');
                    return (
                      <label key={oi} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${selected[qi] === oi ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                        <input
                          type="radio"
                          name={`q-${qi}`}
                          checked={selected[qi] === oi}
                          onChange={() => handleSelect(qi, oi)}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-gray-800">{label}</span>
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
  );
};

export default ContestParticipatePage;
