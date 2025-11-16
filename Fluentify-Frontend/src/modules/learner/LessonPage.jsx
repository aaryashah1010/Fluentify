import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Target, Play, RotateCcw, Award, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLessonDetails, useGenerateExercises, useCompleteLesson } from '../../hooks/useCourses';
import { PageHeader, Button, SkeletonPageHeader, SkeletonCard, SkeletonText, FloatingChatWidget } from '../../components';

const LessonPage = () => {
  const { courseId, unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('vocabulary');
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [exerciseResults, setExerciseResults] = useState(null);
  const [lessonJustCompleted, setLessonJustCompleted] = useState(false);
  
  // React Query hooks
  const { data, isLoading: loading, error: queryError } = useLessonDetails({
    courseId: Number(courseId),
    unitId: Number(unitId),
    lessonId: Number(lessonId)
  });
  
  const generateExercisesMutation = useGenerateExercises();
  const completeLessonMutation = useCompleteLesson();
  
  // Extract data
  const lesson = data?.data?.lesson;
  const lessonProgress = data?.data?.progress;
  const exercises = Array.isArray(lesson?.exercises) ? lesson.exercises : [];
  const grammarPoints = Array.isArray(lesson?.grammarPoints) ? lesson.grammarPoints : (Array.isArray(lesson?.grammar_points) ? lesson.grammar_points : []);
  const vocabulary = Array.isArray(lesson?.vocabulary) ? lesson.vocabulary : [];
  const error = queryError?.message;

  // Reset answers when exercises change
  useEffect(() => {
    setUserAnswers({});
    setShowResults(false);
    setExerciseResults(null);
  }, [exercises]);

  // Auto-switch to exercises tab if no exercises and lesson not completed
  useEffect(() => {
    if (!isLessonCompleted() && exercises.length === 0 && !generateExercisesMutation.isPending) {
      setCurrentSection('exercises');
    }
  }, [exercises.length, generateExercisesMutation.isPending]);

  // Helper function to check if lesson is truly completed
  const isLessonCompleted = () => {
    return lessonProgress?.is_completed === true;
  };

  const generateAdditionalExercises = () => {
    setUserAnswers({});
    setShowResults(false);
    setExerciseResults(null);
    setLessonJustCompleted(false); // Allow practicing again
    generateExercisesMutation.mutate({
      courseId: Number(courseId),
      unitId: Number(unitId),
      lessonId: Number(lessonId)
    });
  };

  const handleAnswerSelect = (exerciseIndex, optionIndex) => {
    if (showResults) return; // Don't allow changes after submission
    setUserAnswers(prev => ({
      ...prev,
      [exerciseIndex]: optionIndex
    }));
  };

  const handleSubmitExercises = () => {
    // Calculate results
    const results = exercises.map((exercise, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === exercise.correctAnswer;
      return {
        exerciseIndex: index,
        userAnswer,
        correctAnswer: exercise.correctAnswer,
        isCorrect
      };
    });

    const correctCount = results.filter(r => r.isCorrect).length;
    const totalCount = results.length;
    const passed = correctCount >= 3;

    setExerciseResults({
      results,
      correctCount,
      totalCount,
      passed
    });
    setShowResults(true);
  };

  const markLessonComplete = () => {
    if (!exerciseResults || !exerciseResults.passed) {
      alert('Please complete the exercises with at least 3/5 correct answers first!');
      return;
    }

    // Prepare exercise data for backend
    const exerciseData = exerciseResults.results.map((result, index) => ({
      exerciseIndex: index,
      isCorrect: result.isCorrect,
      userAnswer: result.userAnswer?.toString() || ''
    }));

    const score = Math.round((exerciseResults.correctCount / exerciseResults.totalCount) * 100);

    completeLessonMutation.mutate({
      courseId: Number(courseId),
      unitId: Number(unitId),
      lessonId: Number(lessonId),
      score,
      exercises: exerciseData
    }, {
      onSuccess: (data) => {
        console.log('Lesson completed successfully:', data);
        setLessonJustCompleted(true);
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (error) => {
        console.error('Error completing lesson:', error);
        alert(error.message || 'Failed to complete lesson. Please try again.');
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50">
        <SkeletonPageHeader />
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Lesson overview skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
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
          
          {/* Content skeleton */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            {/* Tabs skeleton */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
            
            {/* Content cards skeleton */}
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
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <span>{lesson.title}</span>
            {(isLessonCompleted() || lessonJustCompleted) && (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-normal">
                ✓ Completed
              </span>
            )}
          </div>
        }
        showBack
        actions={
          !isLessonCompleted() && !lessonJustCompleted && showResults && exerciseResults?.passed && (
            <Button
              onClick={markLessonComplete}
              loading={completeLessonMutation.isPending}
              variant="success"
              icon={<Award className="w-4 h-4" />}
            >
              Complete Lesson
            </Button>
          )
        }
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Success message after completion */}
        {lessonJustCompleted && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-2">🎉 Lesson Completed Successfully!</h3>
                <p className="text-green-700 mb-4">
                  Great job! You've mastered this lesson with a score of {exerciseResults?.correctCount}/{exerciseResults?.totalCount}. 
                  {completeLessonMutation.data?.data?.unitCompleted 
                    ? ' You completed the entire unit and unlocked the next one!' 
                    : ' The next lesson is now unlocked!'}
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate(`/course/${courseId}`)}
                    variant="primary"
                    icon={<BookOpen className="w-4 h-4" />}
                  >
                    Back to Course
                  </Button>
                  <Button
                    onClick={generateAdditionalExercises}
                    loading={generateExercisesMutation.isPending}
                    variant="secondary"
                    icon={<Play className="w-4 h-4" />}
                  >
                    Practice More
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
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

        {/* Alert for exercise requirement */}
        {!isLessonCompleted() && !lessonJustCompleted && !showResults && exercises.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Complete Exercises to Unlock Lesson</h4>
                <p className="text-sm text-blue-700">
                  You must answer at least 3 out of 5 exercises correctly to complete this lesson and unlock the next one. 
                  Go to the Exercises tab to get started!
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLessonCompleted() && !lessonJustCompleted && exercises.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Exercises Need to be Generated</h4>
                <p className="text-sm text-yellow-700">
                  This lesson requires exercises to be completed. Click the "Generate Exercises" button in the Exercises tab to begin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lesson Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <p className="text-gray-700 mb-4">{lesson.description}</p>
          
          {isLessonCompleted() && (
            <div className="flex items-center gap-4 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Award className="w-5 h-5" />
                <span className="font-medium">Score: {lessonProgress.score}%</span>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <Target className="w-5 h-5" />
                <span className="font-medium">XP Earned: +{lessonProgress.xp_earned}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{vocabulary.length} vocabulary items</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>{grammarPoints.length} grammar points</span>
            </div>
            <div className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              <span>{exercises.length} exercises</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>{lesson.xpReward || 0} XP</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['vocabulary', 'grammar', 'exercises'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentSection(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    currentSection === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {currentSection === 'vocabulary' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Vocabulary</h3>
                {vocabulary.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vocabulary.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-lg">{item.word}</span>
                          <span className="text-sm text-gray-600">[{item.pronunciation}]</span>
                        </div>
                        <p className="text-gray-700 mb-2">{item.translation}</p>
                        <p className="text-sm text-gray-600 italic">{item.example}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No vocabulary items for this lesson.</p>
                )}
              </div>
            )}

            {currentSection === 'grammar' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Grammar Points</h3>
                {grammarPoints.length > 0 ? (
                  grammarPoints.map((point, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{point.topic || point.title}</h4>
                      <p className="text-gray-700 mb-3">{point.explanation}</p>
                      {point.examples && point.examples.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-2">Examples:</h5>
                          <ul className="space-y-1">
                            {point.examples.map((example, idx) => (
                              <li key={idx} className="text-sm text-gray-600">• {example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No grammar points for this lesson.</p>
                )}
              </div>
            )}

            {currentSection === 'exercises' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Exercises (Need 3/5 Correct to Pass)</h3>
                  {showResults && (
                    <Button
                      onClick={generateAdditionalExercises}
                      loading={generateExercisesMutation.isPending}
                      size="sm"
                      icon={<RotateCcw className="w-4 h-4" />}
                    >
                      Generate New Exercises
                    </Button>
                  )}
                </div>
                
                {showResults && exerciseResults && (
                  <div className={`p-4 rounded-lg border-2 ${exerciseResults.passed ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {exerciseResults.passed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <span className={`font-bold text-lg ${exerciseResults.passed ? 'text-green-700' : 'text-red-700'}`}>
                        {exerciseResults.passed ? 'Passed!' : 'Failed'} - Score: {exerciseResults.correctCount}/{exerciseResults.totalCount}
                      </span>
                    </div>
                    <p className={exerciseResults.passed ? 'text-green-600' : 'text-red-600'}>
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
                        const result = showResults ? exerciseResults?.results[index] : null;
                        
                        return (
                          <div key={index} className={`border-2 rounded-lg p-4 ${
                            showResults
                              ? result?.isCorrect 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-red-500 bg-red-50'
                              : 'border-gray-200'
                          }`}>
                            <div className="flex items-start justify-between mb-3">
                              <span className="font-medium">Question {index + 1}</span>
                              {showResults && (
                                <span className={`flex items-center gap-1 text-sm font-medium ${
                                  result?.isCorrect ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {result?.isCorrect ? (
                                    <><CheckCircle className="w-4 h-4" /> Correct</>
                                  ) : (
                                    <><XCircle className="w-4 h-4" /> Incorrect</>
                                  )}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-3 font-medium">{exercise.question}</p>
                            <div className="space-y-2">
                              {exercise.options && exercise.options.map((option, idx) => {
                                const isSelected = userAnswer === idx;
                                const isCorrectAnswer = showResults && idx === exercise.correctAnswer;
                                const isWrongSelection = showResults && isSelected && !result?.isCorrect;
                                
                                return (
                                  <label 
                                    key={idx} 
                                    className={`flex items-center space-x-3 p-3 rounded cursor-pointer transition-colors ${
                                      showResults
                                        ? isCorrectAnswer
                                          ? 'bg-green-100 border-2 border-green-500'
                                          : isWrongSelection
                                          ? 'bg-red-100 border-2 border-red-500'
                                          : 'bg-white border border-gray-200'
                                        : isSelected
                                        ? 'bg-blue-100 border-2 border-blue-500'
                                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`exercise-${index}`}
                                      checked={isSelected}
                                      onChange={() => handleAnswerSelect(index, idx)}
                                      disabled={showResults}
                                      className="text-blue-600"
                                    />
                                    <span className="text-sm flex-1">{option}</span>
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
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-sm text-blue-900">
                                  <strong>Explanation:</strong> {exercise.explanation}
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
                          disabled={Object.keys(userAnswers).length !== exercises.length}
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
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-6 h-6 text-blue-600 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Generating Exercises...</h4>
                      <p className="text-sm text-gray-600 max-w-sm">
                        Our AI is creating personalized exercises for you. This should only take a moment!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No exercises available for this lesson.</p>
                    <Button
                      onClick={generateAdditionalExercises}
                      loading={generateExercisesMutation.isPending}
                      icon={<Play className="w-4 h-4" />}
                    >
                      Generate Exercises
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Chat Widget */}
      <FloatingChatWidget />
    </div>
  );
};

export default LessonPage;
