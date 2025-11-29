// @ts-nocheck
import React from 'react';

/**
 * MCQ Question Component
 * Displays a multiple choice question with radio button options
 */
const McqQuestion = ({ 
  question, 
  questionNumber, 
  selectedOption, 
  onSelect, 
  disabled = false,
  showCorrectAnswer = false,
  correctOptionId = null
}) => {
  const handleOptionClick = (optionId) => {
    if (!disabled && onSelect) {
      onSelect(optionId);
    }
  };

  const getOptionClassName = (option) => {
    const baseClasses = 'flex items-start p-4 rounded-lg border-2 transition-all cursor-pointer';
    
    if (disabled && showCorrectAnswer) {
      // Show correct/incorrect after submission
      if (option.id === correctOptionId) {
        return `${baseClasses} border-green-500 bg-green-50`;
      }
      if (option.id === selectedOption && option.id !== correctOptionId) {
        return `${baseClasses} border-red-500 bg-red-50`;
      }
      return `${baseClasses} border-gray-200 bg-gray-50 opacity-60`;
    }
    
    if (selectedOption === option.id) {
      return `${baseClasses} border-blue-500 bg-blue-50`;
    }
    
    if (disabled) {
      return `${baseClasses} border-gray-200 bg-gray-50 cursor-not-allowed`;
    }
    
    return `${baseClasses} border-gray-300 hover:border-blue-400 hover:bg-blue-50`;
  };

  const getOptionIcon = (option) => {
    if (disabled && showCorrectAnswer) {
      if (option.id === correctOptionId) {
        return (
          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      }
      if (option.id === selectedOption && option.id !== correctOptionId) {
        return (
          <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      }
    }
    
    return (
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
        selectedOption === option.id ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
      }`}>
        {selectedOption === option.id && (
          <div className="w-3 h-3 rounded-full bg-white"></div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-8">
      {/* Question */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Question {questionNumber}
        </h3>
        <p className="text-gray-700">{question.question_text}</p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={getOptionClassName(option)}
            onClick={() => handleOptionClick(option.id)}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getOptionIcon(option)}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-gray-900">{option.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback (shown after submission) */}
      {disabled && showCorrectAnswer && (
        <div className={`mt-4 p-4 rounded-lg ${
          selectedOption === correctOptionId ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`font-medium ${
            selectedOption === correctOptionId ? 'text-green-800' : 'text-red-800'
          }`}>
            {selectedOption === correctOptionId ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          {selectedOption !== correctOptionId && (
            <p className="text-sm text-gray-700 mt-1">
              The correct answer was: {question.options.find(opt => opt.id === correctOptionId)?.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default McqQuestion;
