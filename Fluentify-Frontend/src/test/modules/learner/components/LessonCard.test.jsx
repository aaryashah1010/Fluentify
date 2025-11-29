/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LessonCard from '../../../../modules/learner/components/LessonCard';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    CheckCircle: () => <div data-testid="check-icon">CheckCircle</div>,
    Play: () => <div data-testid="play-icon">Play</div>,
    Lock: () => <div data-testid="lock-icon">Lock</div>,
}));

describe('LessonCard', () => {
    const mockOnClick = jest.fn();

    const completedLesson = {
        title: 'Introduction to French',
        description: 'Learn basic French phrases',
        isCompleted: true,
        isUnlocked: true,
        score: 95,
        xpEarned: 100,
        estimatedDuration: 30,
        xpReward: 100,
    };

    const unlockedLesson = {
        title: 'French Greetings',
        description: 'Common greetings in French',
        isCompleted: false,
        isUnlocked: true,
        estimatedDuration: 25,
        xpReward: 75,
    };

    const lockedLesson = {
        title: 'Advanced French',
        description: 'Complex French grammar',
        isCompleted: false,
        isUnlocked: false,
        estimatedDuration: 45,
        xpReward: 150,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render completed lesson with correct styling', () => {
        render(
            <LessonCard
                lesson={completedLesson}
                lessonIndex={0}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('Introduction to French')).toBeInTheDocument();
        expect(screen.getByText('Learn basic French phrases')).toBeInTheDocument();
        expect(screen.getByText('#1')).toBeInTheDocument();
        expect(screen.getByText('✅ Completed')).toBeInTheDocument();
        expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });

    it('should display score and XP for completed lessons', () => {
        render(
            <LessonCard
                lesson={completedLesson}
                lessonIndex={0}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('Score: 95%')).toBeInTheDocument();
        expect(screen.getByText('XP: +100')).toBeInTheDocument();
    });

    it('should render unlocked lesson with play icon', () => {
        render(
            <LessonCard
                lesson={unlockedLesson}
                lessonIndex={1}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('French Greetings')).toBeInTheDocument();
        expect(screen.getByText('Start →')).toBeInTheDocument();
        expect(screen.getByTestId('play-icon')).toBeInTheDocument();
    });

    it('should render locked lesson with lock icon', () => {
        render(
            <LessonCard
                lesson={lockedLesson}
                lessonIndex={2}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('Advanced French')).toBeInTheDocument();
        expect(screen.getByText('🔒 Locked')).toBeInTheDocument();
        expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    });

    it('should call onClick when lesson is clicked', () => {
        render(
            <LessonCard
                lesson={unlockedLesson}
                lessonIndex={0}
                onClick={mockOnClick}
            />
        );

        const card = screen.getByText('French Greetings').closest('div.border');
        fireEvent.click(card);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should display lesson stats', () => {
        render(
            <LessonCard
                lesson={unlockedLesson}
                lessonIndex={0}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText(/25 min/)).toBeInTheDocument();
        expect(screen.getByText(/75 XP/)).toBeInTheDocument();
    });

    it('should handle missing duration and xpReward', () => {
        const lessonWithoutStats = {
            title: 'Test Lesson',
            description: 'Test description',
            isCompleted: false,
            isUnlocked: true,
        };

        render(
            <LessonCard
                lesson={lessonWithoutStats}
                lessonIndex={0}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText(/0 min/)).toBeInTheDocument();
        expect(screen.getByText(/0 XP/)).toBeInTheDocument();
    });

    it('should render correct lesson index', () => {
        render(
            <LessonCard
                lesson={unlockedLesson}
                lessonIndex={5}
                onClick={mockOnClick}
            />
        );

        expect(screen.getByText('#6')).toBeInTheDocument(); // index + 1
    });

    it('should not display score/XP for uncompleted lessons', () => {
        render(
            <LessonCard
                lesson={unlockedLesson}
                lessonIndex={0}
                onClick={mockOnClick}
            />
        );

        expect(screen.queryByText(/Score:/)).not.toBeInTheDocument();
        expect(screen.queryByText(/XP: \+/)).not.toBeInTheDocument();
    });
});
