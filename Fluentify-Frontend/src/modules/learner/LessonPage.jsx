import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Target,
  Play,
  RotateCcw,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  useLessonDetails,
  useGenerateExercises,
  useCompleteLesson,
} from '../../hooks/useCourses';
import {
  PageHeader,
  Button,
  SkeletonPageHeader,
  SkeletonCard,
  SkeletonText,
  FloatingChatWidget,
} from '../../components';
import { useQueryClient } from '@tanstack/react-query';

const LessonPage = () => {
  const { courseId, unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('vocabulary');
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [exerciseResults, setExerciseResults] = useState(null);
  const [lessonJustCompleted, setLessonJustCompleted] = useState(false);

  const { data, isLoading: loading, error: queryError } = useLessonDetails({
    courseId: Number(courseId),
    unitId: Number(unitId),
    lessonId: Number(lessonId),
  });

  const generateExercisesMutation = useGenerateExercises();
  const completeLessonMutation = useCompleteLesson();
  const queryClient = useQueryClient();

  const lesson = data?.data?.lesson;
  const lessonProgress = data?.data?.progress;
  const exercises = React.useMemo(() => Array.isArray(lesson?.exercises) ? lesson.exercises : [], [lesson?.exercises]);
  const grammarPoints = Array.isArray(lesson?.grammarPoints)
    ? lesson.grammarPoints
    : Array.isArray(lesson?.grammar_points)
      ? lesson.grammar_points
      : [];
  const vocabulary = Array.isArray(lesson?.vocabulary) ? lesson.vocabulary : [];
  const error = queryError?.message;

  useEffect(() => {
    setUserAnswers({});
    setShowResults(false);
    setExerciseResults(null);
  }, [exercises]);

  useEffect(() => {
    if (
      !isLessonCompleted() &&
      exercises.length === 0 &&
      !generateExercisesMutation.isPending
    ) {
      setCurrentSection('exercises');
    }
  }, [exercises.length, generateExercisesMutation.isPending]);

  const isLessonCompleted = () => {
    return lessonProgress?.is_completed === true;
  };

  const generateAdditionalExercises = () => {
    setUserAnswers({});
    setShowResults(false);
    setExerciseResults(null);
    setLessonJustCompleted(false);
    generateExercisesMutation.mutate({
      courseId: Number(courseId),
      unitId: Number(unitId),
      lessonId: Number(lessonId),
    });
  };

  const handleAnswerSelect = (exerciseIndex, optionIndex) => {
    if (showResults) return;
    setUserAnswers((prev) => ({
      ...prev,
      [exerciseIndex]: optionIndex,
    }));
  };

  const handleSubmitExercises = () => {
    const results = exercises.map((exercise, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === exercise.correctAnswer;
      return {
        exerciseIndex: index,
        userAnswer,
        correctAnswer: exercise.correctAnswer,
        isCorrect,
      };
    });

    const correctCount = results.filter((r) => r.isCorrect).length;
    const totalCount = results.length;
    const passed = correctCount >= 3;

    setExerciseResults({
      results,
      correctCount,
      totalCount,
      passed,
    });
    setShowResults(true);
  };

  const markLessonComplete = () => {
    if (!exerciseResults || !exerciseResults.passed) {
      alert(
        'Please complete the exercises with at least 3/5 correct answers first!'
      );
      return;
    }

    const exerciseData = exerciseResults.results.map((result, index) => ({
      exerciseIndex: index,
      isCorrect: result.isCorrect,
      userAnswer: result.userAnswer?.toString() || '',
    }));

    const score = Math.round(
      (exerciseResults.correctCount / exerciseResults.totalCount) * 100
    );

    completeLessonMutation.mutate(
      {
        courseId: Number(courseId),
        unitId: Number(unitId),
        lessonId: Number(lessonId),
        score,
        exercises: exerciseData,
      },
      {
        onSuccess: (data) => {
          console.log('Lesson completed successfully:', data);
          queryClient.invalidateQueries({ queryKey: ['course', Number(courseId)] });
          setLessonJustCompleted(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onError: (error) => {
          console.error('Error completing lesson:', error);
          alert(error.message || 'Failed to complete lesson. Please try again.');
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-teal-50/30">
        <SkeletonPageHeader />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Lesson overview */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
            <div className="space-y-4">
              <SkeletonText lines={2} />
              <div className="flex gap-6 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-8">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-24 h-4 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Lesson not found'}</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-orange-900 to-slate-950 relative">
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200">
            ←
          </span>
          <span className="font-medium">Back to Course</span>
        </button>

        <div className="bg-gradient-to-r from-teal-500 to-orange-400 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/80 mb-1">
                Lesson {lessonId}
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {lesson.title}
              </h1>
              {lesson.description && (
                <p className="text-sm md:text-base text-white/90 mt-2 max-w-xl">
                  {lesson.description}
                </p>
              )}
            </div>

            {(isLessonCompleted() || lessonJustCompleted) && (
              <div className="flex flex-col items-start md:items-end gap-2">
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed</span>
                </span>
                {lessonProgress && (
                  <>
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 text-sm">
                      <Award className="w-4 h-4" />
                      <span>Score: {lessonProgress.score}%</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 text-sm">
                      <Target className="w-4 h-4" />
                      <span>XP Earned: +{lessonProgress.xp_earned}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-white/90">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
              <BookOpen className="w-4 h-4" />
              <span>{vocabulary.length} vocabulary items</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
              <Target className="w-4 h-4" />
              <span>{grammarPoints.length} grammar points</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
              <Play className="w-4 h-4" />
              <span>{exercises.length} exercises</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
              <Award className="w-4 h-4" />
              <span>{lesson.xpReward || 0} XP</span>
            </div>
          </div>
        </div>
        {lessonJustCompleted && (
          <div className="bg-slate-950/90 border border-green-500/60 rounded-2xl p-6 mb-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-50 mb-2">
                  🎉 Lesson Completed Successfully!
                </h3>
                <p className="text-emerald-100 mb-4">
                  Great job! You've mastered this lesson with a score of{' '}
                  {exerciseResults?.correctCount}/{exerciseResults?.totalCount}.
                  {completeLessonMutation.data?.data?.unitCompleted
                    ? ' You completed the entire unit and unlocked the next one!'
                    : ' The next lesson is now unlocked!'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => navigate(`/course/${courseId}`)}
                    className="bg-slate-900/90 border border-white/15 text-slate-50"
                    variant="primary"
                    icon={<BookOpen className="w-4 h-4" />}
                  >
                    Back to Course
                  </Button>
                  <Button
                    onClick={generateAdditionalExercises}
                    loading={generateExercisesMutation.isPending}
                    className="bg-gradient-to-r from-teal-500 to-orange-400 text-white"
                    variant="secondary"
                    icon={<Play className="w-4 h-4" />}
                  >
                    Practice More
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-slate-900/90 border border-white/15 text-slate-50"
                    variant="secondary"
                    icon={<RotateCcw className="w-4 h-4" />}
                  >
                    Review Lesson
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLessonCompleted() &&
          !lessonJustCompleted &&
          !showResults &&
          exercises.length > 0 && (
            <div className="bg-slate-950/90 border border-blue-500/60 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-300 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-100 mb-1">
                    Complete Exercises to Unlock Lesson
                  </h4>
                  <p className="text-sm text-blue-200">
                    You must answer at least 3 out of 5 exercises correctly to
                    complete this lesson and unlock the next one. Go to the
                    Exercises section to get started!
                  </p>
                </div>
              </div>
            </div>
          )}

        {!isLessonCompleted() &&
          !lessonJustCompleted &&
          exercises.length === 0 && (
            <div className="bg-slate-950/90 border border-amber-400/60 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-300 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-100 mb-1">
                    Exercises Need to be Generated
                  </h4>
                  <p className="text-sm text-amber-200">
                    This lesson requires exercises to be completed. Use the
                    Exercises unit below and tap “Generate Exercises” to begin.
                  </p>
                </div>
              </div>
            </div>
          )}

        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-100 mb-3">
            Lesson Units
          </h2>
          <div className="space-y-4">
            {[
              { key: 'vocabulary', title: 'Learn New Words', subtitle: 'Vocabulary' },
              { key: 'grammar', title: 'Grammar Rules', subtitle: 'Grammar' },
              { key: 'exercises', title: 'Practice Exercise', subtitle: 'Practice' },
            ].map((section, index) => {
              const isActive = currentSection === section.key;
              const isCompleted =
                section.key === 'exercises'
                  ? isLessonCompleted() || (exerciseResults?.passed ?? false)
                  : isLessonCompleted();
              const statusLabel =
                isCompleted ? 'Review' : section.key === 'exercises' ? 'Start' : 'Review';

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setCurrentSection(section.key)}
                  className={`w-full flex items-center justify-between rounded-2xl bg-slate-900/80 px-5 py-4 shadow-md border transition-all hover:shadow-lg ${isActive ? 'border-teal-400' : 'border-white/10'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold ${isCompleted
                          ? 'bg-emerald-500/25 text-emerald-100'
                          : 'bg-slate-800 text-teal-200'
                        }`}
                    >
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-50">{section.title}</p>
                      <p className="text-xs text-slate-300">{section.subtitle}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-sm font-medium px-4 py-1 rounded-full ${isCompleted
                        ? 'bg-slate-800 text-slate-100'
                        : 'bg-gradient-to-r from-teal-500 to-orange-400 text-white'
                      }`}
                  >
                    {statusLabel} →
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-slate-950/90 rounded-2xl shadow-2xl border border-white/15 mb-8 p-6">
          {currentSection === 'vocabulary' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4 text-slate-50">Vocabulary</h3>
              {vocabulary.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vocabulary.map((item, index) => (
                    <div
                      key={index}
                      className="border border-slate-700 rounded-2xl p-4 bg-slate-900/90 shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-lg text-slate-50">{item.word}</span>
                        <span className="text-sm text-slate-300">
                          [{item.pronunciation}]
                        </span>
                      </div>
                      <p className="text-slate-200 mb-2">{item.translation}</p>
                      <p className="text-sm text-slate-400 italic">{item.example}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-300">
                  No vocabulary items for this lesson.
                </p>
              )}
            </div>
          )}

          {currentSection === 'grammar' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4 text-slate-50">Grammar Points</h3>
              {grammarPoints.length > 0 ? (
                grammarPoints.map((point, index) => (
                  <div
                    key={index}
                    className="border border-slate-700 rounded-2xl p-4 bg-slate-900/90 shadow-lg"
                  >
                    <h4 className="font-semibold mb-2">
                      {point.topic || point.title}
                    </h4>
                    <p className="text-slate-200 mb-3">{point.explanation}</p>
                    {point.examples && point.examples.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm text-slate-200 mb-2">
                          Examples:
                        </h5>
                        <ul className="space-y-1">
                          {point.examples.map((example, idx) => (
                            <li key={idx} className="text-sm text-slate-300">
                              - {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  No grammar points for this lesson.
                </p>
              )}
            </div>
          )}

          {currentSection === 'exercises' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4 overflow-visible">
                <h3 className="text-lg font-semibold">
                  Exercises (Need 3/5 Correct to Pass)
                </h3>

                {!showResults &&
                  exercises.length === 0 &&
                  !generateExercisesMutation.isPending && (
                    <Button
                      onClick={generateAdditionalExercises}
                      loading={generateExercisesMutation.isPending}
                      size="sm"
                      className="bg-gradient-to-r from-teal-500 to-orange-400 text-white shadow-md"
                      icon={<Play className="w-4 h-4" />}
                    >
                      Generate Exercises
                    </Button>
                  )}

                {showResults && (
                  <Button
                    onClick={generateAdditionalExercises}
                    loading={generateExercisesMutation.isPending}
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-teal-500 to-orange-400 text-white shadow-md hover:shadow-lg transition-all px-4 py-2"
                    icon={<Play className="w-4 h-4 text-white" />}
                  >
                    Generate New Exercises
                  </Button>
                )}
              </div>

              {showResults && exerciseResults && (
                <div
                  className={`p-4 rounded-2xl border-2 ${exerciseResults.passed
                      ? 'bg-emerald-900/40 border-emerald-400'
                      : 'bg-red-900/40 border-red-500'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {exerciseResults.passed ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <span
                      className={`font-bold text-lg ${exerciseResults.passed
                          ? 'text-emerald-100'
                          : 'text-red-100'
                        }`}
                    >
                      {exerciseResults.passed ? 'Passed!' : 'Failed'} - Score:{' '}
                      {exerciseResults.correctCount}/{exerciseResults.totalCount}
                    </span>
                  </div>
                  <p
                    className={
                      exerciseResults.passed ? 'text-emerald-100' : 'text-red-200'
                    }
                  >
                    {exerciseResults.passed
                      ? 'Great job! You can now complete this lesson.'
                      : 'You need at least 3 correct answers. Try generating new exercises and try again!'}
                  </p>
                </div>
              )}

              {!generateExercisesMutation.isPending && exercises.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {exercises.map((exercise, index) => {
                      const userAnswer = userAnswers[index];
                      const result = showResults
                        ? exerciseResults?.results[index]
                        : null;

                      return (
                        <div
                          key={index}
                          className={`border-2 rounded-2xl p-4 transition-all ${showResults
                              ? result?.isCorrect
                                ? 'bg-emerald-900/40 border-2 border-emerald-400'
                                : 'bg-red-900/40 border-2 border-red-500'
                              : 'bg-slate-900 border border-slate-700'
                            }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className="font-medium">
                              Question {index + 1}
                            </span>
                            {showResults && (
                              <span
                                className={`flex items-center gap-1 text-sm font-medium ${result?.isCorrect
                                    ? 'text-green-700'
                                    : 'text-red-700'
                                  }`}
                              >
                                {result?.isCorrect ? (
                                  <>
                                    <CheckCircle className="w-4 h-4" /> Correct
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4" /> Incorrect
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-100 mb-3 font-medium">
                            {exercise.question}
                          </p>
                          <div className="space-y-2">
                            {exercise.options &&
                              exercise.options.map((option, idx) => {
                                const isSelected = userAnswer === idx;
                                const isCorrectAnswer =
                                  showResults &&
                                  idx === exercise.correctAnswer;
                                const isWrongSelection =
                                  showResults &&
                                  isSelected &&
                                  !result?.isCorrect;

                                return (
                                  <label
                                    key={idx}
                                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors border ${showResults
                                        ? isCorrectAnswer
                                          ? 'bg-emerald-900/40 border-2 border-emerald-400'
                                          : isWrongSelection
                                            ? 'bg-red-900/40 border-2 border-red-500'
                                            : 'bg-slate-900 border border-slate-700'
                                        : isSelected
                                          ? 'bg-sky-900/50 border-2 border-sky-500'
                                          : 'bg-slate-900 border border-slate-700 hover:bg-slate-800'
                                      }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`exercise-${index}`}
                                      checked={isSelected}
                                      onChange={() =>
                                        handleAnswerSelect(index, idx)
                                      }
                                      disabled={showResults}
                                      className="text-blue-600"
                                    />
                                    <span className="text-sm flex-1 text-slate-100">
                                      {option}
                                    </span>
                                    {showResults && isCorrectAnswer && (
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                    )}
                                    {showResults && isWrongSelection && (
                                      <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                  </label>
                                );
                              })}
                          </div>
                          {showResults && exercise.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-100">
                                <strong>Explanation:</strong>{' '}
                                {exercise.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!showResults && (
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={handleSubmitExercises}
                        disabled={
                          Object.keys(userAnswers).length !== exercises.length
                        }
                        className="bg-gradient-to-r from-orange-400 to-teal-400 text-white"
                        variant="primary"
                        icon={<CheckCircle className="w-4 h-4" />}
                      >
                        Submit Answers
                      </Button>
                      {Object.keys(userAnswers).length !== exercises.length && (
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          Answer all {exercises.length} questions to submit
                        </span>
                      )}
                    </div>
                  )}
                </>
              ) : generateExercisesMutation.isPending ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-slate-100 mb-2">
                      Generating Exercises...
                    </h4>
                    <p className="text-sm text-slate-300 max-w-sm">
                      Our AI is creating personalized exercises for you. This
                      should only take a moment!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-300 mb-4">
                    No exercises available for this lesson.
                  </p>
                  <Button
                    onClick={generateAdditionalExercises}
                    loading={generateExercisesMutation.isPending}
                    className="bg-gradient-to-r from-teal-500 to-orange-400 text-white"
                    icon={<Play className="w-4 h-4" />}
                  >
                    Generate Exercises
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>

        {!isLessonCompleted() && (
          <div className="bg-slate-950/90 border border-amber-400/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-50">
                Complete this lesson
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Finish all units and pass the exercises to earn XP for this
                lesson.
              </p>
            </div>
            <Button
              onClick={markLessonComplete}
              disabled={!exerciseResults?.passed}
              loading={completeLessonMutation.isPending}
              className="bg-gradient-to-r from-teal-300 to-orange-300 text-white disabled:opacity-60 disabled:cursor-not-allowed"
              icon={<Award className="w-4 h-4" />}
            >
              Finish Lesson
            </Button>
          </div>
        )}
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-end">
          <button
            onClick={() => {
              const el = document.querySelector('.floating-chat-widget-toggle');
              if (el) el.dispatchEvent(new Event('click'));
            }}
            className="w-16 h-16 bg-gradient-to-r from-teal-500 to-orange-400 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group hover:scale-110"
            aria-label="Open chat"
          >
            <Play className="text-white" />
          </button>
        </div>
        <FloatingChatWidget />
      </div>
    </div>
  );
};

export default LessonPage;