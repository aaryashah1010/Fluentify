/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import AnalyticsDashboard from '../../../modules/admin/AnalyticsDashboard';

// Mock dependencies
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../api/admin', () => ({
    getAnalytics: jest.fn(),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
    TrendingUp: () => <div data-testid="trending-up-icon">TrendingUp</div>,
    Users: () => <div data-testid="users-icon">Users</div>,
    BookOpen: () => <div data-testid="book-icon">BookOpen</div>,
    Brain: () => <div data-testid="brain-icon">Brain</div>,
    Activity: () => <div data-testid="activity-icon">Activity</div>,
    Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
}));

// Mock Recharts
jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
    Pie: () => <div data-testid="pie" />,
    Cell: () => <div data-testid="cell" />,
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => <div data-testid="bar" />,
    LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
}));

// Import after mocks
import * as adminApi from '../../../api/admin';
const mockGetAnalytics = jest.mocked(adminApi.getAnalytics);

describe('AnalyticsDashboard', () => {
    const mockAnalyticsData = {
        success: true,
        data: {
            summary: {
                totalLessons: 250,
                totalActiveUsers: 100,
                mostPopularLanguage: 'French',
                aiSuccessRate: '95%',
            },
            languageDistribution: [
                { language_name: 'French', count: 50, percent: 0.5 },
                { language_name: 'Spanish', count: 30, percent: 0.3 },
            ],
            moduleUsage: [
                { module_type: 'Admin', count: 40 },
                { module_type: 'AI', count: 60 },
            ],
            aiPerformance: {
                total_generations: 100,
                success_count: 95,
                failure_count: 5,
            },
            userEngagement: {
                total_active_users: 150,
                avg_lessons_per_user: 3.5,
                max_lessons_per_user: 25,
            },
            dailyActivity: [
                { date: '2024-01-01', total_activities: 50, active_users: 25 },
                { date: '2024-01-02', total_activities: 60, active_users: 30 },
            ],
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should display loading state initially', () => {
        mockGetAnalytics.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        expect(screen.getByText('Loading analytics...')).toBeInTheDocument();
    });

    it('should fetch and display analytics data', async () => {
        mockGetAnalytics.mockResolvedValue(mockAnalyticsData);

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Platform Analytics')).toBeInTheDocument();
        });

        expect(mockGetAnalytics).toHaveBeenCalled();
    });

    it('should display summary statistics', async () => {
        mockGetAnalytics.mockResolvedValue(mockAnalyticsData);

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('250')).toBeInTheDocument(); // Total Lessons
            const activeUserElements = screen.getAllByText('100');
            expect(activeUserElements.length).toBeGreaterThan(0); // Active Users (appears multiple times)
            expect(screen.getByText('French')).toBeInTheDocument(); // Popular Language
            expect(screen.getAllByText('95%').length).toBeGreaterThan(0); // AI Success Rate (may appear multiple times)
        });
    });

    it('should display error state when analytics fetch fails', async () => {
        mockGetAnalytics.mockRejectedValue(new Error('Network error'));

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument();
        });
    });

    it('should navigate back to dashboard on error', async () => {
        mockGetAnalytics.mockRejectedValue(new Error('Network error'));

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            const backButton = screen.getByText('Back to Dashboard');
            backButton.click();
            expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
        });
    });

    it('should navigate back when back button is clicked', async () => {
        mockGetAnalytics.mockResolvedValue(mockAnalyticsData);

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            const backButtons = screen.getAllByTestId('arrow-left-icon');
            backButtons[0].closest('button').click();
            expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
        });
    });

    it('should display AI performance statistics', async () => {
        mockGetAnalytics.mockResolvedValue(mockAnalyticsData);

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('95')).toBeInTheDocument(); // Success count
            expect(screen.getByText('5')).toBeInTheDocument(); // Failure count
        });
    });

    it('should display user engagement statistics', async () => {
        mockGetAnalytics.mockResolvedValue(mockAnalyticsData);

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('150')).toBeInTheDocument(); // Active users
            expect(screen.getByText('3.5')).toBeInTheDocument(); // Avg lessons
        });
    });

    it('should display language distribution chart when data is available', async () => {
        mockGetAnalytics.mockResolvedValue(mockAnalyticsData);

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
        });
    });

    it('should display module usage chart when data is available', async () => {
        mockGetAnalytics.mockResolvedValue(mockAnalyticsData);

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
        });
    });

    it('should display daily activity chart when data is available', async () => {
        mockGetAnalytics.mockResolvedValue(mockAnalyticsData);

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getAllByTestId('line-chart').length).toBeGreaterThan(0);
        });
    });

    it('should display "No language data available" when languageDistribution is empty', async () => {
        const dataWithoutLanguages = {
            ...mockAnalyticsData,
            data: {
                ...mockAnalyticsData.data,
                languageDistribution: [],
            },
        };
        mockGetAnalytics.mockResolvedValue(dataWithoutLanguages);

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No language data available')).toBeInTheDocument();
        });
    });

    it('should display "No module usage data available" when moduleUsage is empty', async () => {
        const dataWithoutModules = {
            ...mockAnalyticsData,
            data: {
                ...mockAnalyticsData.data,
                moduleUsage: [],
            },
        };
        mockGetAnalytics.mockResolvedValue(dataWithoutModules);

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No module usage data available')).toBeInTheDocument();
        });
    });

    it('should handle non-success response from API', async () => {
        mockGetAnalytics.mockResolvedValue({ success: false });

        render(
            <MemoryRouter>
                <AnalyticsDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument();
        });
    });
});
