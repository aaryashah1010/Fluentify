/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, it, expect, jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react';

import McqQuestion from '../../components/McqQuestion.jsx';

// Tests mirror backend-style: describe/it, minimal mocks, using React Testing Library
// only where needed for DOM and interaction assertions.

describe('McqQuestion component', () => {
  const baseQuestion = {
    question_text: 'What is 2 + 2?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' },
    ],
  };

  it('renders question number, text, and options', () => {
    const { container } = render(
      <McqQuestion
        question={baseQuestion}
        questionNumber={1}
        selectedOption={null}
        onSelect={() => {}}
      />
    );

    const heading = container.querySelector('h3');
    expect(heading).toBeTruthy();
    expect(heading && heading.textContent).toContain('Question 1');

    const text = container.querySelector('p.text-gray-700');
    expect(text).toBeTruthy();
    expect(text && text.textContent).toBe('What is 2 + 2?');

    // Each option text is rendered in a <p class="text-gray-900"> element
    const optionTextsEls = container.querySelectorAll('p.text-gray-900');
    expect(optionTextsEls.length).toBe(3);
    const optionTexts = Array.from(optionTextsEls).map((el) => el.textContent);
    expect(optionTexts).toEqual(['3', '4', '5']);
  });

  it('calls onSelect when an option is clicked and not disabled', () => {
    const onSelect = jest.fn();

    const { container } = render(
      <McqQuestion
        question={baseQuestion}
        questionNumber={1}
        selectedOption={null}
        onSelect={onSelect}
      />
    );

    const optionRows = container.querySelectorAll('div.space-y-3 > div');
    expect(optionRows.length).toBe(3);

    fireEvent.click(optionRows[1]);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('b');
  });

  it('does not call onSelect when disabled', () => {
    const onSelect = jest.fn();

    const { container } = render(
      <McqQuestion
        question={baseQuestion}
        questionNumber={1}
        selectedOption={null}
        onSelect={onSelect}
        disabled={true}
      />
    );

    const optionRows = container.querySelectorAll('div.space-y-3 > div');
    expect(optionRows.length).toBe(3);

    fireEvent.click(optionRows[0]);
    fireEvent.click(optionRows[1]);

    expect(onSelect).not.toHaveBeenCalled();

    // Disabled styling branch (no showCorrectAnswer): gray background and not-allowed cursor
    const className = optionRows[0].getAttribute('class') || '';
    expect(className).toContain('cursor-not-allowed');
    expect(className).toContain('bg-gray-50');
  });

  it('applies selected styling when an option is chosen (non-disabled state)', () => {
    const { container } = render(
      <McqQuestion
        question={baseQuestion}
        questionNumber={1}
        selectedOption="b"
        onSelect={() => {}}
      />
    );

    const optionRows = container.querySelectorAll('div.space-y-3 > div');
    expect(optionRows.length).toBe(3);

    const selectedClass = optionRows[1].getAttribute('class') || '';
    expect(selectedClass).toContain('border-blue-500');
    expect(selectedClass).toContain('bg-blue-50');

    const iconWrapper = optionRows[1].querySelector('div.w-6.h-6');
    expect(iconWrapper).toBeTruthy();
    const iconClass = iconWrapper && (iconWrapper.getAttribute('class') || '');
    expect(iconClass).toContain('border-blue-500');
  });

  it('shows correct/incorrect styling and feedback when disabled with showCorrectAnswer (correct selection)', () => {
    const question = {
      ...baseQuestion,
      options: baseQuestion.options,
    };

    const { container } = render(
      <McqQuestion
        question={question}
        questionNumber={1}
        selectedOption="b"
        onSelect={() => {}}
        disabled={true}
        showCorrectAnswer={true}
        correctOptionId="b"
      />
    );

    const optionRows = container.querySelectorAll('div.space-y-3 > div');
    expect(optionRows.length).toBe(3);

    // Correct option gets green styling
    const correctClass = optionRows[1].getAttribute('class') || '';
    expect(correctClass).toContain('border-green-500');
    expect(correctClass).toContain('bg-green-50');

    // Feedback block shows correct message with green text
    const feedback = container.querySelector('div.mt-4');
    expect(feedback).toBeTruthy();

    const feedbackClass = feedback && (feedback.getAttribute('class') || '');
    expect(feedbackClass).toContain('bg-green-50');
    expect(feedbackClass).toContain('border-green-200');

    const feedbackText = feedback && feedback.querySelector('p.font-medium');
    expect(feedbackText).toBeTruthy();
    expect(feedbackText && feedbackText.textContent).toContain('Correct');
    const feedbackTextClass = feedbackText && (feedbackText.getAttribute('class') || '');
    expect(feedbackTextClass).toContain('text-green-800');

    // No explanation paragraph when answer is correct
    const explanation = feedback && feedback.querySelector('p.text-sm');
    expect(explanation).toBeNull();
  });

  it('shows correct/incorrect styling and feedback when disabled with showCorrectAnswer (incorrect selection)', () => {
    const question = {
      ...baseQuestion,
      options: baseQuestion.options,
    };

    const { container } = render(
      <McqQuestion
        question={question}
        questionNumber={1}
        selectedOption="a" // wrong
        onSelect={() => {}}
        disabled={true}
        showCorrectAnswer={true}
        correctOptionId="b"
      />
    );

    const optionRows = container.querySelectorAll('div.space-y-3 > div');
    expect(optionRows.length).toBe(3);

    // Correct option (b) gets green styling
    const correctClass = optionRows[1].getAttribute('class') || '';
    expect(correctClass).toContain('border-green-500');
    expect(correctClass).toContain('bg-green-50');

    // Selected wrong option (a) gets red styling
    const wrongClass = optionRows[0].getAttribute('class') || '';
    expect(wrongClass).toContain('border-red-500');
    expect(wrongClass).toContain('bg-red-50');

    // Feedback block shows incorrect message with red text and explanation
    const feedback = container.querySelector('div.mt-4');
    expect(feedback).toBeTruthy();

    const feedbackClass = feedback && (feedback.getAttribute('class') || '');
    expect(feedbackClass).toContain('bg-red-50');
    expect(feedbackClass).toContain('border-red-200');

    const feedbackText = feedback && feedback.querySelector('p.font-medium');
    expect(feedbackText).toBeTruthy();
    expect(feedbackText && feedbackText.textContent).toContain('Incorrect');
    const feedbackTextClass = feedbackText && (feedbackText.getAttribute('class') || '');
    expect(feedbackTextClass).toContain('text-red-800');

    const explanation = feedback && feedback.querySelector('p.text-sm');
    expect(explanation).toBeTruthy();
    expect(explanation && explanation.textContent).toContain('The correct answer was: 4');
  });
});
