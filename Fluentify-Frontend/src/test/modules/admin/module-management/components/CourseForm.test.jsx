/**
 * @jest-environment jsdom
 */

import { jest, describe, it, expect } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import the component
import CourseForm from '../../../../../modules/admin/module-management/components/CourseForm.jsx';

describe('CourseForm component', () => {
  const mockOnChange = jest.fn();
  const defaultCourseData = {
    language: '',
    level: '',
    title: '',
    description: '',
    thumbnail_url: '',
    estimated_duration: '',
    is_published: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields with correct labels and placeholders', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
      />
    );

    // Check language field
    expect(screen.getByPlaceholderText('e.g., Spanish, French')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Select Level')).toBeInTheDocument();

    // Check title field
    expect(screen.getByPlaceholderText('e.g., Spanish for Beginners')).toBeInTheDocument();

    // Check description field
    expect(screen.getByPlaceholderText('Describe what students will learn in this course...')).toBeInTheDocument();

    // Check thumbnail URL field
    expect(screen.getByPlaceholderText('https://example.com/image.jpg')).toBeInTheDocument();

    // Check estimated duration field
    expect(screen.getByPlaceholderText('e.g., 3 months, 6 weeks')).toBeInTheDocument();

    // Check published checkbox
    expect(screen.getByLabelText(/publish this course/i)).toBeInTheDocument();
  });

  it('displays current course data in form fields', () => {
    const filledCourseData = {
      language: 'Spanish',
      level: 'Beginner',
      title: 'Spanish for Beginners',
      description: 'Learn Spanish from scratch',
      thumbnail_url: 'https://example.com/spanish.jpg',
      estimated_duration: '3 months',
      is_published: true,
    };

    render(
      <CourseForm 
        courseData={filledCourseData} 
        onChange={mockOnChange}
      />
    );

    expect(screen.getByDisplayValue('Spanish')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Beginner')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Spanish for Beginners')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Learn Spanish from scratch')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/spanish.jpg')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3 months')).toBeInTheDocument();
    expect(screen.getByLabelText(/publish this course/i)).toBeChecked();
  });

  it('handles text input changes correctly', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
      />
    );

    const languageInput = screen.getByPlaceholderText('e.g., Spanish, French');
    fireEvent.change(languageInput, { target: { value: 'French' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultCourseData,
      language: 'French'
    });
  });

  it('handles select input changes correctly', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
      />
    );

    const levelSelect = screen.getByDisplayValue('Select Level');
    fireEvent.change(levelSelect, { target: { value: 'Intermediate' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultCourseData,
      level: 'Intermediate'
    });
  });

  it('handles textarea changes correctly', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
      />
    );

    const descriptionTextarea = screen.getByPlaceholderText('Describe what students will learn in this course...');
    fireEvent.change(descriptionTextarea, { target: { value: 'New description' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultCourseData,
      description: 'New description'
    });
  });

  it('handles checkbox changes correctly', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
      />
    );

    const publishedCheckbox = screen.getByLabelText(/publish this course/i);
    fireEvent.click(publishedCheckbox);

    expect(mockOnChange).toHaveBeenCalledWith({
      ...defaultCourseData,
      is_published: true
    });
  });

  it('disables all fields when disabled prop is true', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    const selects = screen.getAllByRole('combobox');
    const checkboxes = screen.getAllByRole('checkbox');

    inputs.forEach(input => {
      expect(input).toBeDisabled();
    });
    selects.forEach(select => {
      expect(select).toBeDisabled();
    });
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeDisabled();
    });
  });

  it('disables language field when lockLanguage is true', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
        lockLanguage={true}
      />
    );

    const languageInput = screen.getByPlaceholderText('e.g., Spanish, French');
    expect(languageInput).toBeDisabled();
  });

  it('disables language field when both disabled and lockLanguage are true', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
        disabled={true}
        lockLanguage={true}
      />
    );

    const languageInput = screen.getByPlaceholderText('e.g., Spanish, French');
    expect(languageInput).toBeDisabled();
  });

  it('does not disable other fields when only lockLanguage is true', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
        lockLanguage={true}
      />
    );

    // Language should be disabled
    const languageInput = screen.getByPlaceholderText('e.g., Spanish, French');
    expect(languageInput).toBeDisabled();

    // Other fields should not be disabled
    const levelSelect = screen.getByDisplayValue('Select Level');
    const titleInput = screen.getByPlaceholderText('e.g., Spanish for Beginners');
    const publishedCheckbox = screen.getByLabelText(/publish this course/i);

    expect(levelSelect).not.toBeDisabled();
    expect(titleInput).not.toBeDisabled();
    expect(publishedCheckbox).not.toBeDisabled();
  });

  it('applies correct CSS classes to form elements', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
      />
    );

    const languageInput = screen.getByPlaceholderText('e.g., Spanish, French');
    expect(languageInput).toHaveClass('w-full', 'px-3', 'py-2', 'rounded-xl', 'bg-slate-900/70', 'border', 'border-white/10', 'text-slate-100');

    const levelSelect = screen.getByDisplayValue('Select Level');
    expect(levelSelect).toHaveClass('w-full', 'px-3', 'py-2', 'rounded-xl', 'bg-slate-900/70', 'border', 'border-white/10');

    const publishedCheckbox = screen.getByLabelText(/publish this course/i);
    expect(publishedCheckbox).toHaveClass('w-4', 'h-4', 'text-teal-500', 'border-white/20', 'rounded', 'focus:ring-teal-500', 'bg-slate-900/80');
  });

  it('handles empty course data gracefully', () => {
    const emptyCourseData = {};
    
    render(
      <CourseForm 
        courseData={emptyCourseData} 
        onChange={mockOnChange}
      />
    );

    // Should render without errors
    expect(screen.getByPlaceholderText('e.g., Spanish, French')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Select Level')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., Spanish for Beginners')).toBeInTheDocument();
  });

  it('handles null/undefined course data values', () => {
    const nullCourseData = {
      language: null,
      level: null,
      title: null,
      description: null,
      thumbnail_url: null,
      estimated_duration: null,
      is_published: null,
    };
    
    render(
      <CourseForm 
        courseData={nullCourseData} 
        onChange={mockOnChange}
      />
    );

    // Should render without errors and handle null values
    expect(screen.getByPlaceholderText('e.g., Spanish, French')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Select Level')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., Spanish for Beginners')).toBeInTheDocument();
  });

  it('has required attributes on required fields', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
      />
    );

    const languageInput = screen.getByPlaceholderText('e.g., Spanish, French');
    const levelSelect = screen.getByDisplayValue('Select Level');
    const titleInput = screen.getByPlaceholderText('e.g., Spanish for Beginners');

    expect(languageInput).toBeRequired();
    expect(levelSelect).toBeRequired();
    expect(titleInput).toBeRequired();

    // Optional fields should not be required
    const descriptionTextarea = screen.getByPlaceholderText('Describe what students will learn in this course...');
    const thumbnailInput = screen.getByPlaceholderText('https://example.com/image.jpg');
    const durationInput = screen.getByPlaceholderText('e.g., 3 months, 6 weeks');
    const publishedCheckbox = screen.getByLabelText(/publish this course/i);

    expect(descriptionTextarea).not.toBeRequired();
    expect(thumbnailInput).not.toBeRequired();
    expect(durationInput).not.toBeRequired();
    expect(publishedCheckbox).not.toBeRequired();
  });

  it('has correct input types', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
      />
    );

    const languageInput = screen.getByPlaceholderText('e.g., Spanish, French');
    const titleInput = screen.getByPlaceholderText('e.g., Spanish for Beginners');
    const thumbnailInput = screen.getByPlaceholderText('https://example.com/image.jpg');
    const durationInput = screen.getByPlaceholderText('e.g., 3 months, 6 weeks');
    const publishedCheckbox = screen.getByLabelText(/publish this course/i);

    expect(languageInput.type).toBe('text');
    expect(titleInput.type).toBe('text');
    expect(thumbnailInput.type).toBe('url');
    expect(durationInput.type).toBe('text');
    expect(publishedCheckbox.type).toBe('checkbox');
  });

  it('has correct name attributes', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
      />
    );

    expect(screen.getByDisplayValue('Select Level')).toHaveAttribute('name', 'level');
    expect(screen.getByPlaceholderText('e.g., Spanish, French')).toHaveAttribute('name', 'language');
    expect(screen.getByPlaceholderText('e.g., Spanish for Beginners')).toHaveAttribute('name', 'title');
    expect(screen.getByPlaceholderText('Describe what students will learn in this course...')).toHaveAttribute('name', 'description');
    expect(screen.getByPlaceholderText('https://example.com/image.jpg')).toHaveAttribute('name', 'thumbnail_url');
    expect(screen.getByPlaceholderText('e.g., 3 months, 6 weeks')).toHaveAttribute('name', 'estimated_duration');
    expect(screen.getByLabelText(/publish this course/i)).toHaveAttribute('name', 'is_published');
  });

  it('renders level select with correct options', () => {
    render(
      <CourseForm 
        courseData={defaultCourseData} 
        onChange={mockOnChange}
      />
    );

    const levelSelect = screen.getByDisplayValue('Select Level');
    const options = levelSelect.querySelectorAll('option');

    expect(options).toHaveLength(4); // Select Level + 3 levels
    expect(options[0].value).toBe('');
    expect(options[0].textContent).toBe('Select Level');
    expect(options[1].value).toBe('Beginner');
    expect(options[1].textContent).toBe('Beginner');
    expect(options[2].value).toBe('Intermediate');
    expect(options[2].textContent).toBe('Intermediate');
    expect(options[3].value).toBe('Advanced');
    expect(options[3].textContent).toBe('Advanced');
  });
});
