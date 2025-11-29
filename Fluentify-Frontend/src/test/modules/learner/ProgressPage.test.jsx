/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressPage from '../../../modules/learner/ProgressPage';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUseProgressReport = jest.fn();
const mockUseCourses = jest.fn();
const mockRefetch = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../hooks/useProgress', () => ({
    useProgressReport: (range, course) => mockUseProgressReport(range, course),
}));

jest.mock('../../../hooks/useCourses', () => ({
    useCourses: () => mockUseCourses(),
}));

// Mock recharts
jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div data-testid="area" />,
    LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
}));

// Mock icons
jest.mock('lucide-react', () => ({
    TrendingUp: () => <span>TrendingUp</span>,
    Award: () => <span>Award</span>,
    BookOpen: () => <span>BookOpen</span>,
    Flame: () => <span>Flame</span>,
    ArrowLeft: () => <span>ArrowLeft</span>,
    Calendar: () => <span>Calendar</span>,
    RefreshCw: () => <span>RefreshCw</span>,
    Zap: () => <span>Zap</span>,
    Trophy: () => <span>Trophy</span>,
    Star: () => <span>Star</span>,
    Activity: () => <span>Activity</span>,
    Globe: () => <span>Globe</span>,
}));

describe('ProgressPage', () => {
    const mockProgressData = {
        summary: {
            total_xp: 1000,
            lessons_completed: 10,
        },
        timeline: [
            { date: '2023-01-01', lessons_count: 1, avg_score: 80 },
            { date: '2023-01-02', lessons_count: 2, avg_score: 90 },
        ],
        recentActivity: [
            {
                lesson_title: 'Lesson 1',
                course_title: 'Spanish 101',
                language: 'Spanish',
                score: 85,
                xp_earned: 50,
                completion_time: '2023-01-01T12:00:00Z',
            },
        ],
    };

    const mockCourses = [
        { id: 1, title: 'Spanish 101', language: 'Spanish' },
        { id: 2, title: 'French 101', language: 'French' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseCourses.mockReturnValue({ data: mockCourses });
        mockUseProgressReport.mockReturnValue({
            data: mockProgressData,
            isLoading: false,
            error: null,
            refetch: mockRefetch,
        });
    });

    it('should render loading state', () => {
        mockUseProgressReport.mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
        });

        render(<ProgressPage />);
        expect(screen.getByText('Loading your progress...')).toBeInTheDocument();
    });

    it('should render error state', () => {
        mockUseProgressReport.mockReturnValue({
            data: null,
            isLoading: false,
            error: { message: 'Failed' },
        });

        render(<ProgressPage />);
        expect(screen.getByText('Unable to Load Progress')).toBeInTheDocument();
    });

    it('should render empty state if no lessons completed', () => {
        mockUseProgressReport.mockReturnValue({
            data: { summary: { lessons_completed: 0 } },
            isLoading: false,
            error: null,
        });

        render(<ProgressPage />);
        expect(screen.getByText('Your Journey Begins Here')).toBeInTheDocument();
        expect(screen.getByText('Start Learning Now')).toBeInTheDocument();
    });

    it('should render progress report', () => {
        render(<ProgressPage />);
        expect(screen.getByText('Your Progress Report')).toBeInTheDocument();
        expect(screen.getByText('1000')).toBeInTheDocument(); // Total XP
        expect(screen.getByText('10')).toBeInTheDocument(); // Lessons Completed
        expect(screen.getByText('2')).toBeInTheDocument(); // Streak count
        expect(screen.getByText('days')).toBeInTheDocument(); // Streak label
    });

    it('should render recent activity', () => {
        render(<ProgressPage />);
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
        expect(screen.getByText('Lesson 1')).toBeInTheDocument();
        expect(screen.getByText('Spanish 101')).toBeInTheDocument();
        expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('should handle time range selection', () => {
        render(<ProgressPage />);

        fireEvent.click(screen.getByText('Last 30 Days'));

        // The hook should be called with new range
        expect(mockUseProgressReport).toHaveBeenCalledWith('30d', null);
    });

    it('should handle course selection', () => {
        render(<ProgressPage />);

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });

        // The hook should be called with new course
        expect(mockUseProgressReport).toHaveBeenCalledWith('all', '1');
    });

    it('should handle refresh', () => {
        render(<ProgressPage />);

        fireEvent.click(screen.getByText('Refresh'));
        expect(mockRefetch).toHaveBeenCalled();
    });
});
