/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StreamingCourseDisplay from '../../../../modules/learner/components/StreamingCourseDisplay';

// Mock Button component
jest.mock('../../../../components', () => ({
    Button: ({ children, onClick, variant, className }) => (
        <button
            onClick={onClick}
            className={`${className} variant-${variant}`}
            data-testid="mock-button"
        >
            {children}
        </button>
    ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    CheckCircle: () => <div data-testid="check-icon">CheckCircle</div>,
    Loader: () => <div data-testid="loader-icon">Loader</div>,
    Clock: () => <div data-testid="clock-icon">Clock</div>,
}));

describe('StreamingCourseDisplay', () => {
    const mockOnClose = jest.fn();
    const mockOnNavigateToCourse = jest.fn();

    const generatingState = {
        courseId: 123,
        language: 'Spanish',
        totalUnits: 3,
        units: [
            { title: 'Unit 1', description: 'Desc 1', difficulty: 'Easy', lessons: [], estimatedTime: 10 },
            null,
            null
        ],
        currentGenerating: 2,
        progress: 'Generating Unit 2...',
        isComplete: false,
        error: null,
    };

    const completeState = {
        courseId: 123,
        language: 'Spanish',
        totalUnits: 3,
        units: [
            { title: 'Unit 1', description: 'Desc 1', difficulty: 'Easy', lessons: [], estimatedTime: 10 },
            { title: 'Unit 2', description: 'Desc 2', difficulty: 'Medium', lessons: [], estimatedTime: 15 },
            { title: 'Unit 3', description: 'Desc 3', difficulty: 'Hard', lessons: [], estimatedTime: 20 },
        ],
        currentGenerating: null,
        progress: 'Complete',
        isComplete: true,
        error: null,
    };

    const errorState = {
        ...generatingState,
        error: 'Network error',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render generating state correctly', () => {
        render(
            <StreamingCourseDisplay
                state={generatingState}
                onClose={mockOnClose}
                onNavigateToCourse={mockOnNavigateToCourse}
            />
        );

        expect(screen.getByText('⚡ Generating Your Course...')).toBeInTheDocument();
        expect(screen.getByText(/Spanish Course/)).toBeInTheDocument();
        expect(screen.getByText(/Progress: Generating Unit 2.../)).toBeInTheDocument();

        // Unit 1 (Generated)
        expect(screen.getByText('Unit 1')).toBeInTheDocument();
        expect(screen.getByText('Desc 1')).toBeInTheDocument();
        expect(screen.getByTestId('check-icon')).toBeInTheDocument();

        // Unit 2 (Generating)
        expect(screen.getByText('Unit 2')).toBeInTheDocument();
        expect(screen.getByText('Generating content...')).toBeInTheDocument();
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();

        // Unit 3 (Pending)
        expect(screen.getByText('Unit 3')).toBeInTheDocument();
        expect(screen.getByText('Waiting to generate...')).toBeInTheDocument();
        expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
    });

    it('should render complete state correctly', () => {
        render(
            <StreamingCourseDisplay
                state={completeState}
                onClose={mockOnClose}
                onNavigateToCourse={mockOnNavigateToCourse}
            />
        );

        expect(screen.getByText('🎉 Course Generated!')).toBeInTheDocument();
        expect(screen.getByText('All 3 units are ready! Start learning now.')).toBeInTheDocument();

        // Close button in header
        const closeButtons = screen.getAllByText('✕');
        expect(closeButtons.length).toBeGreaterThan(0);

        // Footer buttons
        expect(screen.getByText('Close')).toBeInTheDocument();
        expect(screen.getByText('View Course →')).toBeInTheDocument();
    });

    it('should render error message', () => {
        render(
            <StreamingCourseDisplay
                state={errorState}
                onClose={mockOnClose}
                onNavigateToCourse={mockOnNavigateToCourse}
            />
        );

        expect(screen.getByText('❌ Network error')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
        render(
            <StreamingCourseDisplay
                state={completeState}
                onClose={mockOnClose}
                onNavigateToCourse={mockOnNavigateToCourse}
            />
        );

        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onNavigateToCourse when view course button is clicked', () => {
        render(
            <StreamingCourseDisplay
                state={completeState}
                onClose={mockOnClose}
                onNavigateToCourse={mockOnNavigateToCourse}
            />
        );

        const viewButton = screen.getByText('View Course →');
        fireEvent.click(viewButton);

        expect(mockOnNavigateToCourse).toHaveBeenCalledWith(123);
    });

    it('should display progress bar in generating state', () => {
        const { container } = render(
            <StreamingCourseDisplay
                state={generatingState}
                onClose={mockOnClose}
                onNavigateToCourse={mockOnNavigateToCourse}
            />
        );

        // 1/3 units generated = 33.33%
        const progressBar = container.querySelector('.bg-gray-200 > div');
        expect(progressBar).toHaveStyle({ width: '33.33333333333333%' });
    });

    it('should not display progress bar in complete state', () => {
        const { container } = render(
            <StreamingCourseDisplay
                state={completeState}
                onClose={mockOnClose}
                onNavigateToCourse={mockOnNavigateToCourse}
            />
        );

        // The progress bar container should not be present
        // Note: The progress bar is inside !isComplete check
        // But the header also has a gradient, so we need to be specific
        // The progress bar is in a div with class w-full bg-gray-200 rounded-full h-3
        const progressBarContainer = container.querySelector('.bg-gray-200.rounded-full.h-3');
        expect(progressBarContainer).not.toBeInTheDocument();
    });
});
