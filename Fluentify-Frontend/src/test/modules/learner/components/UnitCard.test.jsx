/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnitCard from '../../../../modules/learner/components/UnitCard';

// Mock LessonCard to test UnitCard in isolation
jest.mock('../../../../modules/learner/components/LessonCard', () => {
    return function MockLessonCard({ lesson, onClick }) {
        return (
            <div data-testid="lesson-card" onClick={onClick}>
                {lesson.title}
            </div>
        );
    };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    CheckCircle: () => <div data-testid="check-icon">CheckCircle</div>,
    Play: () => <div data-testid="play-icon">Play</div>,
    Lock: () => <div data-testid="lock-icon">Lock</div>,
    Loader: () => <div data-testid="loader-icon">Loader</div>,
}));

describe('UnitCard', () => {
    const mockOnLessonClick = jest.fn();
    const mockOnUnitClick = jest.fn();

    const mockLessons = [
        { id: 1, title: 'Lesson 1', isCompleted: true },
        { id: 2, title: 'Lesson 2', isCompleted: false },
    ];

    const unlockedUnit = {
        id: 1,
        title: 'Unit 1',
        description: 'Introduction',
        isCompleted: false,
        isUnlocked: true,
        lessons: mockLessons,
    };

    const completedUnit = {
        id: 2,
        title: 'Unit 2',
        description: 'Basics',
        isCompleted: true,
        isUnlocked: true,
        lessons: mockLessons,
    };

    const lockedUnit = {
        id: 3,
        title: 'Unit 3',
        description: 'Advanced',
        isCompleted: false,
        isUnlocked: false,
        lessons: mockLessons,
    };

    const generatingUnit = {
        id: 4,
        title: 'Unit 4',
        description: 'Generating content',
        isGenerating: true,
        lessons: [],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render unit details correctly', () => {
        render(
            <UnitCard
                unit={unlockedUnit}
                unitIndex={0}
                onLessonClick={mockOnLessonClick}
                onUnitClick={mockOnUnitClick}
            />
        );

        expect(screen.getByText('Unit 1')).toBeInTheDocument();
        expect(screen.getByText('Introduction')).toBeInTheDocument();
        expect(screen.getByText('1/2 lessons')).toBeInTheDocument();
    });

    it('should render unlocked state correctly', () => {
        render(
            <UnitCard
                unit={unlockedUnit}
                unitIndex={0}
                onLessonClick={mockOnLessonClick}
                onUnitClick={mockOnUnitClick}
            />
        );

        expect(screen.getByTestId('play-icon')).toBeInTheDocument();
        expect(screen.queryByText('Generating...')).not.toBeInTheDocument();
        expect(screen.queryByText('💤 Waiting')).not.toBeInTheDocument();
    });

    it('should render completed state correctly', () => {
        render(
            <UnitCard
                unit={completedUnit}
                unitIndex={1}
                onLessonClick={mockOnLessonClick}
                onUnitClick={mockOnUnitClick}
            />
        );

        expect(screen.getByTestId('check-icon')).toBeInTheDocument();
        expect(screen.getByText('✅ Completed')).toBeInTheDocument();
    });

    it('should render locked state correctly', () => {
        render(
            <UnitCard
                unit={lockedUnit}
                unitIndex={2}
                onLessonClick={mockOnLessonClick}
                onUnitClick={mockOnUnitClick}
            />
        );

        expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
        expect(screen.getByText('💤 Waiting')).toBeInTheDocument();

        // Check opacity class
        const card = screen.getByText('Unit 3').closest('.bg-white');
        expect(card).toHaveClass('opacity-60');
    });

    it('should render generating state correctly', () => {
        render(
            <UnitCard
                unit={generatingUnit}
                unitIndex={3}
                onLessonClick={mockOnLessonClick}
                onUnitClick={mockOnUnitClick}
            />
        );

        expect(screen.getAllByTestId('loader-icon')).toHaveLength(2); // One in header, one in badge
        expect(screen.getByText('Generating...')).toBeInTheDocument();

        // Check border color and animation
        const card = screen.getByText('Unit 4').closest('.bg-white');
        expect(card).toHaveClass('border-blue-400');
        expect(card).toHaveClass('animate-pulse');
    });

    it('should call onLessonClick when a lesson is clicked', () => {
        render(
            <UnitCard
                unit={unlockedUnit}
                unitIndex={0}
                onLessonClick={mockOnLessonClick}
                onUnitClick={mockOnUnitClick}
            />
        );

        const lesson = screen.getByText('Lesson 1');
        fireEvent.click(lesson);

        expect(mockOnLessonClick).toHaveBeenCalledWith(mockLessons[0], unlockedUnit.id, 0);
    });

    it('should call onUnitClick when locked unit is clicked', () => {
        render(
            <UnitCard
                unit={lockedUnit}
                unitIndex={2}
                onLessonClick={mockOnLessonClick}
                onUnitClick={mockOnUnitClick}
            />
        );

        const card = screen.getByText('Unit 3').closest('.bg-white');
        fireEvent.click(card);

        expect(mockOnUnitClick).toHaveBeenCalledWith(lockedUnit);
    });

    it('should NOT call onUnitClick when unlocked unit is clicked', () => {
        render(
            <UnitCard
                unit={unlockedUnit}
                unitIndex={0}
                onLessonClick={mockOnLessonClick}
                onUnitClick={mockOnUnitClick}
            />
        );

        const card = screen.getByText('Unit 1').closest('.bg-white');
        fireEvent.click(card);

        expect(mockOnUnitClick).not.toHaveBeenCalled();
    });

    it('should NOT call onUnitClick when generating unit is clicked', () => {
        render(
            <UnitCard
                unit={generatingUnit}
                unitIndex={3}
                onLessonClick={mockOnLessonClick}
                onUnitClick={mockOnUnitClick}
            />
        );

        const card = screen.getByText('Unit 4').closest('.bg-white');
        fireEvent.click(card);

        expect(mockOnUnitClick).not.toHaveBeenCalled();
    });

    it('should handle unit with no lessons', () => {
        const emptyUnit = { ...unlockedUnit, lessons: undefined };
        render(
            <UnitCard
                unit={emptyUnit}
                unitIndex={0}
                onLessonClick={mockOnLessonClick}
                onUnitClick={mockOnUnitClick}
            />
        );

        expect(screen.getByText('0/0 lessons')).toBeInTheDocument();
    });
});
