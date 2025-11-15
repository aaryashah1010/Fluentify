import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Send } from 'lucide-react';
import {
  useAdminContestDetails,
  useCreateContest,
  useUpdateContest,
  useAddQuestion,
  usePublishContest,
} from '../../../../hooks/useContest';
import { Button } from '../../../../components';

const ContestEditorPage = () => {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const isEditMode = !!contestId;

  // Hooks
  const { data: contestData, isLoading: loadingContest, isError: errorContest, error: contestError } = useAdminContestDetails(isEditMode ? contestId : null);
  const createContest = useCreateContest();
  const updateContest = useUpdateContest();
  const addQuestion = useAddQuestion();
  const publishContest = usePublishContest();

  // Form state
  const [contest, setContest] = useState({
    title: '',
    description: '',
    language: 'Spanish',
    start_time: '',
    end_time: '',
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_option_id: 0,
  });

  const [errors, setErrors] = useState({});
  const [createdContestId, setCreatedContestId] = useState(null);

  // Helpers: time and formatting
  const toInputLocal = (isoString) => {
    try {
      const d = new Date(isoString);
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  // Build IST (+05:30) offset ISO string from a datetime-local input value (YYYY-MM-DDTHH:mm)
  const toISTOffsetIso = (localDateTimeStr) => {
    if (!localDateTimeStr) return '';
    const [datePart, timePart] = localDateTimeStr.split('T');
    return `${datePart}T${timePart}:00+05:30`;
  };

  // Load contest data in edit mode
  useEffect(() => {
    if (contestData) {
      setContest({
        title: contestData.title,
        description: contestData.description || '',
        language: contestData.language || 'Spanish',
        start_time: toInputLocal(contestData.start_time),
        end_time: toInputLocal(contestData.end_time),
      });
      setQuestions(contestData.questions || []);
      setCreatedContestId(contestData.id);
    }
  }, [contestData]);

  const handleContestChange = (field, value) => {
    setContest((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion((prev) => ({ ...prev, options: newOptions }));
  };

  const validateContest = () => {
    const newErrors = {};
    if (!contest.title.trim()) newErrors.title = 'Title is required';
    if (!contest.start_time) newErrors.start_time = 'Start time is required';
    if (!contest.end_time) newErrors.end_time = 'End time is required';
    if (new Date(contest.start_time) >= new Date(contest.end_time)) {
      newErrors.end_time = 'End time must be after start time';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateQuestion = () => {
    if (!currentQuestion.question_text.trim()) {
      alert('Question text is required');
      return false;
    }
    const filledOptions = currentQuestion.options.filter((opt) => opt.trim());
    if (filledOptions.length < 2) {
      alert('At least 2 options are required');
      return false;
    }
    if (!currentQuestion.options[currentQuestion.correct_option_id]?.trim()) {
      alert('Please select a valid correct option');
      return false;
    }
    return true;
  };

  const handleCreateContest = async () => {
    if (!validateContest()) return;

    try {
      await createContest.mutateAsync({
        title: contest.title,
        description: contest.description,
        start_time: toISTOffsetIso(contest.start_time),
        end_time: toISTOffsetIso(contest.end_time),
      });
      // After creating, go back to list so admin can see it and choose to edit
      navigate('/admin/contests');
    } catch (error) {
      alert('Failed to create contest: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateContest = async () => {
    if (!validateContest()) return;

    try {
      await updateContest.mutateAsync({
        contestId: createdContestId,
        data: {
          title: contest.title,
          description: contest.description,
          start_time: toISTOffsetIso(contest.start_time),
          end_time: toISTOffsetIso(contest.end_time),
        },
      });
      alert('Contest updated successfully!');
    } catch (error) {
      alert('Failed to update contest: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddQuestion = async () => {
    if (!createdContestId) {
      alert('Please create the contest first');
      return;
    }
    if (!validateQuestion()) return;
    // Build options payload as array of objects with stable ids and text
    const entries = currentQuestion.options
      .map((text, idx) => ({ origIndex: idx, text: text.trim() }))
      .filter((e) => e.text);
    const optionsPayload = entries.map((e, newIndex) => ({ id: newIndex, text: e.text }));
    const newCorrectIndex = entries.findIndex((e) => e.origIndex === currentQuestion.correct_option_id);

    try {
      await addQuestion.mutateAsync({
        contestId: createdContestId,
        data: {
          question_text: currentQuestion.question_text,
          options: optionsPayload,
          correct_option_id: newCorrectIndex,
        },
      });

      // Add to local questions list
      setQuestions((prev) => [
        ...prev,
        {
          ...currentQuestion,
          id: Date.now(),
          options: entries.map((e) => e.text),
          correct_option_id: newCorrectIndex,
        },
      ]);

      // Reset form
      setCurrentQuestion({
        question_text: '',
        options: ['', '', '', ''],
        correct_option_id: 0,
      });

      alert('Question added successfully!');
    } catch (error) {
      // Fallback: some backends expect options as array of strings
      try {
        await addQuestion.mutateAsync({
          contestId: createdContestId,
          data: {
            question_text: currentQuestion.question_text,
            options: entries.map((e) => e.text),
            correct_option_id: newCorrectIndex,
          },
        });

        // Add to local list with string options
        setQuestions((prev) => [
          ...prev,
          {
            ...currentQuestion,
            id: Date.now(),
            options: entries.map((e) => e.text),
            correct_option_id: newCorrectIndex,
          },
        ]);

        // Reset form
        setCurrentQuestion({
          question_text: '',
          options: ['', '', '', ''],
          correct_option_id: 0,
        });

        alert('Question added successfully!');
      } catch (fallbackErr) {
        console.error('Add question failed', error, fallbackErr);
        alert('Failed to add question: ' + (fallbackErr.response?.data?.message || fallbackErr.message || error.message));
      }
    }
  };

  const handlePublish = async () => {
    if (!createdContestId) {
      alert('Please create the contest first');
      return;
    }
    if (questions.length === 0) {
      alert('Please add at least one question before publishing');
      return;
    }

    if (
      !window.confirm(
        'Are you sure you want to publish this contest? Learners will be able to see it (but not participate until the start time).'
      )
    ) {
      return;
    }

    try {
      await publishContest.mutateAsync(createdContestId);
      alert('Contest published successfully!');
      navigate('/admin/contests');
    } catch (error) {
      alert('Failed to publish contest: ' + (error.response?.data?.message || error.message));
    }
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  if (loadingContest) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contest...</p>
        </div>
      </div>
    );
  }

  // Error state in edit mode
  if (isEditMode && errorContest) {
    console.error('Failed to load contest details', contestError);
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Unable to load contest</h2>
          <p className="text-sm text-gray-600 mb-4">Please go back to the list and try again.</p>
          <Button onClick={() => navigate('/admin/contests')}>Back to Contests</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/contests')}
                className="p-2 rounded-xl hover:bg-orange-100 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
               <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                  {isEditMode ? 'Edit Contest' : 'Create New Contest'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {createdContestId
                    ? 'Add questions and publish when ready'
                    : 'Fill in contest details to get started'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Contest Details Section */}
          <div className="bg-white/70 backdrop-blur-sm border border-orange-100 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contest Details</h2>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contest Title *
                </label>
                <input
                  type="text"
                  value={contest.title}
                  onChange={(e) => handleContestChange('title', e.target.value)}
                  placeholder="e.g., Weekly Spanish Challenge"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>


              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={contest.description}
                  onChange={(e) => handleContestChange('description', e.target.value)}
                  placeholder="Brief description of the contest..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={contest.start_time}
                    onChange={(e) => handleContestChange('start_time', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.start_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.start_time && (
                    <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={contest.end_time}
                    onChange={(e) => handleContestChange('end_time', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.end_time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.end_time && (
                    <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                {!createdContestId ? (
                  <Button
                    onClick={handleCreateContest}
                    loading={createContest.isPending}
                    icon={<Save className="w-4 h-4" />}
                    className="w-full bg-gradient-to-r from-orange-500 to-teal-500 text-white 
rounded-xl shadow-md hover:shadow-lg"
                  >
                    Create Contest
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpdateContest}
                    loading={updateContest.isPending}
                    icon={<Save className="w-4 h-4" />}
                    className="w-full bg-gradient-to-r from-orange-500 to-teal-500 text-white 
rounded-xl shadow-md hover:shadow-lg"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Questions Section */}
          {createdContestId && (
            <>
              {/* Existing Questions */}
{questions.length > 0 && (
  <div className="bg-white/70 backdrop-blur-sm border border-orange-100 rounded-2xl shadow-md p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">
      Questions ({questions.length})
    </h2>

    <div className="space-y-4">
      {questions.map((q, index) => (
        <div
          key={q.id || index}
          className="border border-gray-200 rounded-lg p-4"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900">
              {index + 1}. {q.question_text}
            </h3>

            <button
              onClick={() => removeQuestion(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 text-sm">
            {(Array.isArray(q.options) ? q.options : []).map(
              (opt, optIndex) => (
                <div
                  key={optIndex}
                  className={`px-3 py-2 rounded ${
                    optIndex === q.correct_option_id
                      ? "bg-green-50 text-green-700 font-medium"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {String.fromCharCode(65 + optIndex)}.{" "}
                  {typeof opt === "string" ? opt : opt?.text}
                  {optIndex === q.correct_option_id && " ✓"}
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

              {/* Add New Question */}
              <div className="bg-white/70 backdrop-blur-sm border border-orange-100 rounded-2xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Question</h2>
                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Text *
                    </label>
                    <textarea
                      value={currentQuestion.question_text}
                      onChange={(e) => handleQuestionChange('question_text', e.target.value)}
                      placeholder="Enter your question here..."
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options (at least 2 required) *
                    </label>
                    <div className="space-y-2">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correct_option"
                            checked={currentQuestion.correct_option_id === index}
                            onChange={() => handleQuestionChange('correct_option_id', index)}
                            className="w-4 h-4 text-teal-500 focus:ring-teal-400"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Select the radio button to mark the correct answer
                    </p>
                  </div>

                  {/* Add Question Button */}
                  <Button
                    onClick={handleAddQuestion}
                    loading={addQuestion.isPending}
                    icon={<Plus className="w-4 h-4" />}
                    className="w-full bg-gradient-to-r from-orange-500 to-teal-500 text-white 
rounded-xl shadow-md hover:shadow-lg"
                  >
                    Add Question
                  </Button>
                </div>
              </div>

              {/* Publish Button */}
              <div className="bg-white/70 backdrop-blur-sm border border-orange-100 rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Ready to Publish?</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Publishing will make this contest visible to learners. They can participate
                      during the scheduled time.
                    </p>
                  </div>
                  <Button
                    onClick={handlePublish}
                    loading={publishContest.isPending}
                    disabled={questions.length === 0}
                    icon={<Send className="w-4 h-4" />}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-md rounded-xl"

                  >
                    Publish Contest
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContestEditorPage;
