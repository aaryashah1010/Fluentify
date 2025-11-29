/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GeneratingCourseCard from '../../../../modules/learner/components/GeneratingCourseCard';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Loader: () => <div data-testid="loader-icon">Loader</div>,
    BookOpen: () => <div data-testid="book-icon">BookOpen</div>,
}));

describe('GeneratingCourseCard', () => {
    const mockOnClick = jest.fn();

    const mockState = {
        language: 'Spanish',
        progress: 'Generating Unit 2...',
        units: [{}, {}, null, null, null], // 2 generated, 5 total
        totalUnits: 5,
    };

    const emptyState = {
        language: 'French',
        progress: 'Starting...',
        units: [null, null, null],
        totalUnits: 3,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render course information', () => {
        render(
            <GeneratingCourseCard
                state={mockState}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('Spanish Course')).toBeInTheDocument();
        expect(screen.getByText('Creating your personalized learning path...')).toBeInTheDocument();
        expect(screen.getByText('Generating')).toBeInTheDocument();
    });

    it('should display progress information', () => {
        render(
            <GeneratingCourseCard
                state={mockState}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('Generating Unit 2...')).toBeInTheDocument();

        // Stats
        expect(screen.getByText('2')).toBeInTheDocument(); // Generated
        expect(screen.getByText('3')).toBeInTheDocument(); // In Progress (5-2)
        expect(screen.getByText('5')).toBeInTheDocument(); // Total
    });

    it('should display correct footer message when units are generated', () => {
        render(
            <GeneratingCourseCard
                state={mockState}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('✨ Click to view generated units')).toBeInTheDocument();
    });

    it('should display correct footer message when no units generated', () => {
        render(
            <GeneratingCourseCard
                state={emptyState}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('⏳ Preparing your first unit...')).toBeInTheDocument();
    });

    it('should call onClick when card is clicked', () => {
        render(
            <GeneratingCourseCard
                state={mockState}
                onClick={mockOnClick}
            />
        );

        const card = screen.getByText('Spanish Course').closest('div.cursor-pointer');
        fireEvent.click(card);

        expect(mockOnClick).toHaveBeenCalled();
    });

    it('should calculate progress bar width correctly', () => {
        const { container } = render(
            <GeneratingCourseCard
                state={mockState}
                onClick={mockOnClick}
            />
        );

        // 2/5 = 40%
        // Select the progress bar inside the track (bg-slate-800)
        const progressBar = container.querySelector('.bg-slate-800 > div');
        expect(progressBar).toHaveStyle({ width: '40%' });
    });
});
