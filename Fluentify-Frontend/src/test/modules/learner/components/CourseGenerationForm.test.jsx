/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CourseGenerationForm from '../../../../modules/learner/components/CourseGenerationForm';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Sparkles: () => <div data-testid="sparkles-icon">Sparkles</div>,
    Clock: () => <div data-testid="clock-icon">Clock</div>,
    TrendingUp: () => <div data-testid="trending-icon">TrendingUp</div>,
    X: () => <div data-testid="x-icon">X</div>,
    Check: () => <div data-testid="check-icon">Check</div>,
}));

describe('CourseGenerationForm', () => {
    const mockSetForm = jest.fn();
    const mockOnGenerate = jest.fn();
    const mockOnCancel = jest.fn();

    const defaultForm = {
        language: '',
        expertise: '',
        expectedDuration: '',
    };

    const filledForm = {
        language: 'Spanish',
        expertise: 'Beginner',
        expectedDuration: '3 months',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render form elements correctly', () => {
        render(
            <CourseGenerationForm
                form={defaultForm}
                setForm={mockSetForm}
                onGenerate={mockOnGenerate}
                onCancel={mockOnCancel}
                isGenerating={false}
                error={null}
            />
        );

        expect(screen.getByText('Customize Your Learning Path')).toBeInTheDocument();
        expect(screen.getByText('Choose Your Language 🌍')).toBeInTheDocument();
        expect(screen.getByText('Current Expertise 📊')).toBeInTheDocument();
        expect(screen.getByText('Target Duration ⏱️')).toBeInTheDocument();
        expect(screen.getByText('Generate Course')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should show error message when error prop is provided', () => {
        render(
            <CourseGenerationForm
                form={defaultForm}
                setForm={mockSetForm}
                onGenerate={mockOnGenerate}
                onCancel={mockOnCancel}
                isGenerating={false}
                error="Something went wrong"
            />
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should show generating state', () => {
        render(
            <CourseGenerationForm
                form={filledForm}
                setForm={mockSetForm}
                onGenerate={mockOnGenerate}
                onCancel={mockOnCancel}
                isGenerating={true}
                error={null}
            />
        );

        expect(screen.getByText('Generating Your Course...')).toBeInTheDocument();
        expect(screen.queryByText('Choose Your Language 🌍')).not.toBeInTheDocument();
    });

    it('should update form when language is selected', () => {
        render(
            <CourseGenerationForm
                form={defaultForm}
                setForm={mockSetForm}
                onGenerate={mockOnGenerate}
                onCancel={mockOnCancel}
                isGenerating={false}
                error={null}
            />
        );

        const spanishButton = screen.getByText('Spanish').closest('button');
        fireEvent.click(spanishButton);

        expect(mockSetForm).toHaveBeenCalled();
        // Verify the callback updates the specific field
        const updateFn = mockSetForm.mock.calls[0][0];
        const newState = updateFn(defaultForm);
        expect(newState).toEqual({ ...defaultForm, language: 'Spanish' });
    });

    it('should update form when expertise is selected', () => {
        render(
            <CourseGenerationForm
                form={defaultForm}
                setForm={mockSetForm}
                onGenerate={mockOnGenerate}
                onCancel={mockOnCancel}
                isGenerating={false}
                error={null}
            />
        );

        const beginnerButton = screen.getByText('Beginner').closest('button');
        fireEvent.click(beginnerButton);

        expect(mockSetForm).toHaveBeenCalled();
        const updateFn = mockSetForm.mock.calls[0][0];
        const newState = updateFn(defaultForm);
        expect(newState).toEqual({ ...defaultForm, expertise: 'Beginner' });
    });

    it('should update form when duration is selected', () => {
        render(
            <CourseGenerationForm
                form={defaultForm}
                setForm={mockSetForm}
                onGenerate={mockOnGenerate}
                onCancel={mockOnCancel}
                isGenerating={false}
                error={null}
            />
        );

        const durationButton = screen.getByText('3 Months').closest('button');
        fireEvent.click(durationButton);

        expect(mockSetForm).toHaveBeenCalled();
        const updateFn = mockSetForm.mock.calls[0][0];
        const newState = updateFn(defaultForm);
        expect(newState).toEqual({ ...defaultForm, expectedDuration: '3 months' });
    });

    it('should disable generate button when form is incomplete', () => {
        render(
            <CourseGenerationForm
                form={defaultForm}
                setForm={mockSetForm}
                onGenerate={mockOnGenerate}
                onCancel={mockOnCancel}
                isGenerating={false}
                error={null}
            />
        );

        const generateButton = screen.getByText('Generate Course').closest('button');
        expect(generateButton).toBeDisabled();
    });

    it('should enable generate button when form is complete', () => {
        render(
            <CourseGenerationForm
                form={filledForm}
                setForm={mockSetForm}
                onGenerate={mockOnGenerate}
                onCancel={mockOnCancel}
                isGenerating={false}
                error={null}
            />
        );

        const generateButton = screen.getByText('Generate Course').closest('button');
        expect(generateButton).not.toBeDisabled();
    });

    it('should call onGenerate when generate button is clicked', () => {
        render(
            <CourseGenerationForm
                form={filledForm}
                setForm={mockSetForm}
                onGenerate={mockOnGenerate}
                onCancel={mockOnCancel}
                isGenerating={false}
                error={null}
            />
        );

        const generateButton = screen.getByText('Generate Course').closest('button');
        fireEvent.click(generateButton);

        expect(mockOnGenerate).toHaveBeenCalled();
    });

    it('should call onCancel when cancel button is clicked', () => {
        render(
            <CourseGenerationForm
                form={defaultForm}
                setForm={mockSetForm}
                onGenerate={mockOnGenerate}
                onCancel={mockOnCancel}
                isGenerating={false}
                error={null}
            />
        );

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should display AI Course Includes preview when form is complete', () => {
        render(
            <CourseGenerationForm
                form={filledForm}
                setForm={mockSetForm}
                onGenerate={mockOnGenerate}
                onCancel={mockOnCancel}
                isGenerating={false}
                error={null}
            />
        );

        expect(screen.getByText('Your AI Course Includes:')).toBeInTheDocument();
        expect(screen.getAllByText(/Spanish/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Beginner/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/3 Months/)[0]).toBeInTheDocument();
    });

    it('should highlight selected options', () => {
        render(
            <CourseGenerationForm
                form={filledForm}
                setForm={mockSetForm}
                onGenerate={mockOnGenerate}
                onCancel={mockOnCancel}
                isGenerating={false}
                error={null}
            />
        );

        // Check language selection highlight
        const spanishButton = screen.getAllByText('Spanish')[0].closest('button');
        expect(spanishButton).toHaveClass('border-teal-400');

        // Check expertise selection highlight
        const beginnerButton = screen.getAllByText('Beginner')[0].closest('button');
        expect(beginnerButton).toHaveClass('border-orange-400');

        // Check duration selection highlight
        const durationButton = screen.getAllByText('3 Months')[0].closest('button');
        expect(durationButton).toHaveClass('border-purple-400');
    });
});
