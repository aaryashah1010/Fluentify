// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   BookOpen, 
//   Target, 
//   Play, 
//   RotateCcw, 
//   Award, 
//   CheckCircle, 
//   XCircle, 
//   AlertCircle 
// } from 'lucide-react';

// import { 
//   useLessonDetails, 
//   useGenerateExercises, 
//   useCompleteLesson 
// } from '../../hooks/useCourses';

// import { 
//   PageHeader, 
//   Button, 
//   SkeletonPageHeader, 
//   SkeletonCard, 
//   SkeletonText, 
//   FloatingChatWidget 
// } from '../../components';

// import { useQueryClient } from "@tanstack/react-query";

// const LessonPage = () => {
//   const { courseId, unitId, lessonId } = useParams();
//   const navigate = useNavigate();

//   const [currentSection, setCurrentSection] = useState('vocabulary');
//   const [userAnswers, setUserAnswers] = useState({});
//   const [showResults, setShowResults] = useState(false);
//   const [exerciseResults, setExerciseResults] = useState(null);
//   const [lessonJustCompleted, setLessonJustCompleted] = useState(false);

//   // ⭐ NEW: ensures button ALWAYS appears when passed
//   const [canCompleteLesson, setCanCompleteLesson] = useState(false);

//   // React Query
//   const queryClient = useQueryClient();
//   const { data, isLoading: loading, error: queryError } = useLessonDetails({
//     courseId: Number(courseId),
//     unitId: Number(unitId),
//     lessonId: Number(lessonId)
//   });

//   const generateExercisesMutation = useGenerateExercises();
//   const completeLessonMutation = useCompleteLesson();

//   const lesson = data?.data?.lesson;
//   const lessonProgress = data?.data?.progress;

//   const exercises = Array.isArray(lesson?.exercises) ? lesson.exercises : [];
//   const grammarPoints = Array.isArray(lesson?.grammarPoints)
//     ? lesson.grammarPoints
//     : Array.isArray(lesson?.grammar_points)
//     ? lesson.grammar_points
//     : [];
//   const vocabulary = Array.isArray(lesson?.vocabulary) ? lesson.vocabulary : [];

//   const error = queryError?.message;

//   // Reset answers when exercises change
//   useEffect(() => {
//     setUserAnswers({});
//     setShowResults(false);
//     setExerciseResults(null);
//     setCanCompleteLesson(false);
//   }, [exercises]);

//   const isLessonCompleted = () => lessonProgress?.is_completed === true;

//   const generateAdditionalExercises = () => {
//     setUserAnswers({});
//     setShowResults(false);
//     setExerciseResults(null);
//     setCanCompleteLesson(false);
//     setLessonJustCompleted(false);

//     generateExercisesMutation.mutate({
//       courseId: Number(courseId),
//       unitId: Number(unitId),
//       lessonId: Number(lessonId)
//     });
//   };

//   const handleAnswerSelect = (exerciseIndex, optionIndex) => {
//     if (showResults) return;
//     setUserAnswers(prev => ({
//       ...prev,
//       [exerciseIndex]: optionIndex
//     }));
//   };

//   const handleSubmitExercises = () => {
//     const results = exercises.map((exercise, index) => {
//       const userAnswer = userAnswers[index];
//       const isCorrect = userAnswer === exercise.correctAnswer;
//       return { exerciseIndex: index, userAnswer, correctAnswer: exercise.correctAnswer, isCorrect };
//     });

//     const correctCount = results.filter(r => r.isCorrect).length;
//     const totalCount = results.length;
//     const passed = correctCount >= 3;

//     setExerciseResults({ results, correctCount, totalCount, passed });
//     setShowResults(true);

//     // ⭐ ALWAYS show the COMPLETE button when passed
//     if (passed) setCanCompleteLesson(true);
//   };

//   const markLessonComplete = () => {
//     if (!exerciseResults?.passed) {
//       alert("You must pass the exercises first!");
//       return;
//     }

//     const exerciseData = exerciseResults.results.map((r, index) => ({
//       exerciseIndex: index,
//       isCorrect: r.isCorrect,
//       userAnswer: r.userAnswer?.toString() || ""
//     }));

//     const score = Math.round(
//       (exerciseResults.correctCount / exerciseResults.totalCount) * 100
//     );

//     completeLessonMutation.mutate(
//       {
//         courseId: Number(courseId),
//         unitId: Number(unitId),
//         lessonId: Number(lessonId),
//         score,
//         exercises: exerciseData
//       },
//       {
//         onSuccess: (response) => {
//           console.log("Lesson completed:", response);

//           // ⭐ IMPORTANT: refresh course so next lesson unlocks
//           queryClient.invalidateQueries(["course", courseId]);

//           setLessonJustCompleted(true);
//           window.scrollTo({ top: 0, behavior: "smooth" });
//         },
//         onError: (error) => {
//           console.error(error);
//           alert(error.message || "Failed to complete lesson.");
//         }
//       }
//     );
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-teal-50/30">
//         <SkeletonPageHeader />
//       </div>
//     );
//   }

//   // Error state
//   if (error || !lesson) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-red-500">{error || "Lesson not found"}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-teal-50/30">
      
//       {/* HEADER */}
//       <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

//           <div className="flex items-center gap-3">
//             <h2 className="text-lg font-semibold text-gray-900">{lesson.title}</h2>
//             {(isLessonCompleted() || lessonJustCompleted) && (
//               <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
//                 ✓ Completed
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-3">

//             {/* ⭐ TOP COMPLETE LESSON BUTTON FIXED */}
//             {canCompleteLesson && !lessonJustCompleted && !isLessonCompleted() && (
//               <button
//                 onClick={markLessonComplete}
//                 className="
//                   px-4 py-2 rounded-full shadow 
//                   bg-gradient-to-r from-orange-400 to-teal-400 
//                   text-white font-semibold flex items-center gap-2 
//                   hover:opacity-90
//                 "
//               >
//                 <Award className="w-4 h-4" />
//                 Complete Lesson
//               </button>
//             )}

//             {/* Back */}
//             <button
//               onClick={() => navigate(`/course/${courseId}`)}
//               className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:shadow"
//             >
//               <BookOpen className="w-4 h-4" /> Back to Course
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <main className="max-w-7xl mx-auto px-4 py-8">

//         {/* Lesson Description */}
//         <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
//           <p className="text-gray-700 mb-4">{lesson.description}</p>
//         </div>

//         {/* TABS */}
//         <div className="bg-white rounded-2xl border shadow mb-8">
//           <nav className="border-b border-gray-100 flex gap-4 px-6 py-4 overflow-x-auto">
//             {["vocabulary", "grammar", "exercises"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setCurrentSection(tab)}
//                 className={`px-4 py-2 rounded-full text-sm font-medium ${
//                   currentSection === tab
//                     ? "bg-gradient-to-r from-orange-400 to-teal-400 text-white shadow"
//                     : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </nav>

//           {/* TAB CONTENT */}
//           <div className="p-6">

//             {/* VOCABULARY */}
//             {currentSection === "vocabulary" && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-4">Vocabulary</h3>
//                 {vocabulary.length === 0 ? (
//                   <p className="text-gray-600">No vocabulary available</p>
//                 ) : (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {vocabulary.map((item, i) => (
//                       <div key={i} className="p-4 border rounded-xl shadow-sm">
//                         <h4 className="font-semibold">{item.word}</h4>
//                         <p className="text-gray-600">{item.translation}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* GRAMMAR */}
//             {currentSection === "grammar" && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-4">Grammar Points</h3>
//                 {grammarPoints.length === 0 ? (
//                   <p className="text-gray-600">No grammar points</p>
//                 ) : (
//                   grammarPoints.map((g, i) => (
//                     <div key={i} className="border rounded-xl p-4 shadow-sm mb-4">
//                       <h4 className="font-semibold">{g.topic || g.title}</h4>
//                       <p className="text-gray-600">{g.explanation}</p>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}

//             {/* ====================================================== */}
//             {/*                     EXERCISES TAB                     */}
//             {/* ====================================================== */}

//             {currentSection === "exercises" && (
//               <div className="space-y-6">

//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-semibold">Exercises (Need 3/5 Correct)</h3>

//                   {/* Generate button (when no exercises yet) */}
//                   {!isLessonCompleted() &&
//                     !lessonJustCompleted &&
//                     exercises.length === 0 &&
//                     !generateExercisesMutation.isPending && (
//                       <Button
//                         onClick={generateAdditionalExercises}
//                         className="bg-gradient-to-r from-orange-400 to-teal-400 text-white"
//                         icon={<Play className="w-4 h-4" />}
//                       >
//                         Generate Exercises
//                       </Button>
//                     )}
//                 </div>

//                 {/* Results Box */}
//                 {showResults && exerciseResults && (
//                   <div
//                     className={`p-4 rounded-xl border-2 ${
//                       exerciseResults.passed
//                         ? "bg-green-50 border-green-400"
//                         : "bg-red-50 border-red-400"
//                     }`}
//                   >
//                     <h4
//                       className={`font-bold ${
//                         exerciseResults.passed ? "text-green-700" : "text-red-700"
//                       }`}
//                     >
//                       {exerciseResults.passed ? "Passed!" : "Failed"}
//                     </h4>
//                     <p>
//                       Score: {exerciseResults.correctCount}/{exerciseResults.totalCount}
//                     </p>
//                   </div>
//                 )}

//                 {/* Exercise List */}
//                 {!generateExercisesMutation.isPending && exercises.length > 0 && (
//                   <div className="space-y-4">
//                     {exercises.map((exercise, index) => {
//                       const result = showResults ? exerciseResults?.results[index] : null;
//                       const userAnswer = userAnswers[index];

//                       return (
//                         <div
//                           key={index}
//                           className={`p-4 rounded-xl border-2 ${
//                             showResults
//                               ? result?.isCorrect
//                                 ? "border-green-400 bg-green-50"
//                                 : "border-red-400 bg-red-50"
//                               : "border-gray-200 bg-white"
//                           }`}
//                         >
//                           <h4 className="font-semibold mb-2">Question {index + 1}</h4>
//                           <p className="text-gray-800 mb-3">{exercise.question}</p>

//                           <div className="space-y-2">
//                             {exercise.options.map((option, optIndex) => {
//                               const isSelected = userAnswer === optIndex;
//                               const isCorrect = showResults && optIndex === exercise.correctAnswer;
//                               const isWrong =
//                                 showResults && isSelected && !result?.isCorrect;

//                               return (
//                                 <label
//                                   key={optIndex}
//                                   className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border ${
//                                     showResults
//                                       ? isCorrect
//                                         ? "border-green-500 bg-green-100"
//                                         : isWrong
//                                         ? "border-red-500 bg-red-100"
//                                         : "border-gray-200 bg-white"
//                                       : isSelected
//                                       ? "border-blue-500 bg-blue-100"
//                                       : "border-gray-200 bg-white"
//                                   }`}
//                                 >
//                                   <input
//                                     type="radio"
//                                     checked={isSelected}
//                                     disabled={showResults}
//                                     onChange={() => handleAnswerSelect(index, optIndex)}
//                                   />
//                                   {option}
//                                 </label>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}

//                 {/* Submit Answers */}
//                 {!showResults &&
//                   exercises.length > 0 &&
//                   !isLessonCompleted() &&
//                   !lessonJustCompleted && (
//                     <Button
//                       onClick={handleSubmitExercises}
//                       disabled={Object.keys(userAnswers).length !== exercises.length}
//                       className="bg-gradient-to-r from-orange-400 to-teal-400 text-white"
//                       icon={<CheckCircle className="w-4 h-4" />}
//                     >
//                       Submit Answers
//                     </Button>
//                   )}

//                 {/* No exercises */}
//                 {!generateExercisesMutation.isPending &&
//                   exercises.length === 0 &&
//                   !isLessonCompleted() &&
//                   !lessonJustCompleted && (
//                     <div className="text-center py-6">
//                       <p className="text-gray-700 mb-4">No exercises available.</p>
//                       <Button
//                         onClick={generateAdditionalExercises}
//                         className="bg-gradient-to-r from-orange-400 to-teal-400 text-white"
//                       >
//                         Generate Exercises
//                       </Button>
//                     </div>
//                   )}

//                 {/* Loading spinner */}
//                 {generateExercisesMutation.isPending && (
//                   <div className="py-12 text-center">
//                     <div className="animate-spin h-12 w-12 border-4 border-gray-300 border-t-teal-500 rounded-full mx-auto"></div>
//                     <p className="mt-4 text-gray-700">Generating...</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       <FloatingChatWidget />
//     </div>
//   );
// };

// export default LessonPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Target, Play, RotateCcw, Award, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLessonDetails, useGenerateExercises, useCompleteLesson } from '../../hooks/useCourses';
import { PageHeader, Button, SkeletonPageHeader, SkeletonCard, SkeletonText, FloatingChatWidget } from '../../components';
import { useQueryClient } from "@tanstack/react-query";


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
  const queryClient = useQueryClient();

  
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
          // Ensure course details are refreshed so status changes to completed
          queryClient.invalidateQueries({ queryKey: ['course', Number(courseId)] });
          setLessonJustCompleted(true);
          // Scroll to top to show success message
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
          {/* Lesson overview skeleton */}
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
          
          {/* Content skeleton */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-8">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-teal-50/30">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">{lesson.title}</h2>
            {(isLessonCompleted() || lessonJustCompleted) && (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                ✓ Completed
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isLessonCompleted() && !lessonJustCompleted && showResults && exerciseResults?.passed && (
              <Button
                onClick={markLessonComplete}
                loading={completeLessonMutation.isPending}
                className="bg-gradient-to-r from-orange-400 to-teal-400 text-white"
                variant="primary"
                icon={<Award className="w-4 h-4" />}
              >
                Complete Lesson
              </Button>
            )}

            <button
              onClick={() => navigate(`/course/${courseId}`)}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
            >
              <BookOpen className="w-4 h-4 text-gray-700" /> Back to Course
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Success message after completion */}
        {lessonJustCompleted && (
          <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-6 shadow-md">
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
                    className="bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-900"
                    variant="primary"
                    icon={<BookOpen className="w-4 h-4" />}
                  >
                    Back to Course
                  </Button>
                  <Button
                    onClick={generateAdditionalExercises}
                    loading={generateExercisesMutation.isPending}
                    className="bg-gradient-to-r from-orange-400 to-teal-400 text-white"
                    variant="secondary"
                    icon={<Play className="w-4 h-4" />}
                  >
                    Practice More
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-white border border-gray-200"
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

        {/* Alerts */}
        {!isLessonCompleted() && !lessonJustCompleted && !showResults && exercises.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
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
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
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
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 mb-8">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-4 px-6 py-4 overflow-x-auto" aria-label="Tabs">
              {['vocabulary', 'grammar', 'exercises'].map((tab) => {
                const active = currentSection === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setCurrentSection(tab)}
                    className={`py-2 px-4 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      active
                        ? 'bg-gradient-to-r from-orange-400 to-teal-400 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                );
              })}
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
                      <div key={index} className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm">
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
                    <div key={index} className="border border-gray-100 rounded-2xl p-4 bg-white shadow-sm">
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
                <div className="flex items-center justify-between mb-4 overflow-visible">
                <h3 className="text-lg font-semibold">Exercises (Need 3/5 Correct to Pass)</h3>

            {/* ⭐ ALWAYS show generate button if exercises are empty */}
            {!showResults && exercises.length === 0 && !generateExercisesMutation.isPending && (
              <Button
                onClick={generateAdditionalExercises}
                loading={generateExercisesMutation.isPending}
                size="sm"
              className="bg-gradient-to-r from-orange-400 to-teal-400 text-white shadow-md"
              icon={<Play className="w-4 h-4" />}
            >
            Generate Exercises
            </Button>
            )}

  {/* ⭐ Show retry button only after answering */}
  {showResults && (
    <Button
  onClick={generateAdditionalExercises}
  loading={generateExercisesMutation.isPending}
  size="sm"
  className="
    rounded-full
    bg-gradient-to-r from-orange-400 to-teal-400
    text-white
    shadow-md hover:shadow-lg
    transition-all
    px-4 py-2
  "
  icon={<Play className="w-4 h-4 text-white" />}
>
  Generate New Exercises
</Button>

  )}
                </div>

                
                {showResults && exerciseResults && (
                  <div className={`p-4 rounded-2xl border-2 ${exerciseResults.passed ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
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
                          <div key={index} className={`border-2 rounded-2xl p-4 transition-all ${
                            showResults
                              ? result?.isCorrect 
                                ? 'border-green-500 bg-green-50 shadow-sm' 
                                : 'border-red-500 bg-red-50 shadow-sm'
                              : 'border-gray-100 bg-white shadow-sm'
                          }`}>
                            <div className="flex items-start justify-between mb-3">
                              <span className="font-medium">Question {index + 1}</span>
                              {showResults && (
                                <span className={`flex items-center gap-1 text-sm font-medium ${result?.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
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
                                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                                      showResults
                                        ? isCorrectAnswer
                                          ? 'bg-green-100 border-2 border-green-500'
                                          : isWrongSelection
                                          ? 'bg-red-100 border-2 border-red-500'
                                          : 'bg-white border border-gray-100'
                                        : isSelected
                                        ? 'bg-blue-100 border-2 border-blue-500'
                                        : 'bg-white border border-gray-100 hover:bg-gray-50'
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
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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
                      className="bg-gradient-to-r from-orange-400 to-teal-400 text-white"
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

      {/* Floating Chat Widget — styled similar to Dashboard */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* small floating button */}
        <div className="flex flex-col items-end">
          {/* collapsed panel will be handled by your FloatingChatWidget component; show a matching floating button to keep UI consistent */}
          <button
            onClick={() => {
              // try to open the provided floating widget if it supports a prop or global toggle.
              // fallback to scroll to chat widget component position or reload if not available.
              const el = document.querySelector('.floating-chat-widget-toggle');
              if (el) el.dispatchEvent(new Event('click'));
            }}
            className="w-16 h-16 bg-gradient-to-r from-orange-400 to-teal-400 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group hover:scale-110"
            aria-label="Open chat"
          >
            <Play className="text-white" />
          </button>
        </div>

        {/* keep the original widget mounted */}
        <FloatingChatWidget />
      </div>
    </div>
  );
};

export default LessonPage;