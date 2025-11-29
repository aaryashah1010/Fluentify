/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LearnerDashboard from '../../../modules/learner/Dashboard';

// Mock dependencies
const mockNavigate = jest.fn();
const mockLogout = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Keep a configurable mock for useUserProfile so we can simulate loading state
const mockUseUserProfile = jest.fn(() => ({
	data: { user: { name: 'John Doe' } },
	isLoading: false,
}));

jest.mock('../../../hooks/useAuth', () => ({
	useLogout: () => mockLogout,
	useUserProfile: (...args) => mockUseUserProfile(...args),
}));

// Configurable mock for courses so we can override per-test
const mockUseCourses = jest.fn(() => ({
	data: [
		{
			id: 1,
			title: 'Spanish 101',
			language: 'Spanish',
			progress: { lessonsCompleted: 5, currentStreak: 3, progressPercentage: 25 },
		},
		{
			id: 2,
			title: 'French 101',
			language: 'French',
			progress: { lessonsCompleted: 2, currentStreak: 1, progressPercentage: 10 },
		},
	],
}));

jest.mock('../../../hooks/useCourses', () => ({
	useCourses: (...args) => mockUseCourses(...args),
}));

jest.mock('../../../hooks/useProgress', () => ({
    useProgressReport: () => ({
        data: {
            summary: {
                lessons_completed: 7,
                total_xp: 150,
                current_streak: 3,
                overall_progress_percent: 18,
            },
        },
    }),
}));

// Configurable streaming mock so we can simulate a pending generated course
const mockUseStreaming = jest.fn();
const mockGenerateCourse = jest.fn();

jest.mock('../../../contexts/StreamingContext', () => {
	const useStreaming = (...args) =>
		mockUseStreaming(...args) || { generateCourse: mockGenerateCourse, state: { courseId: null, units: null } };

	return {
		useStreaming,
	};
});

// Mock child components
jest.mock('../../../modules/learner/components/sidebar', () => {
    return function MockSidebar() {
        return <div data-testid="sidebar">Sidebar Component</div>;
    };
});

jest.mock('../../../modules/learner/components/CourseGenerationForm', () => {
    return function MockCourseGenerationForm({ onGenerate, onCancel, setForm }) {
        return (
            <div data-testid="course-generation-form">
                <button onClick={() => setForm({ language: 'Spanish', expectedDuration: '1 Month', expertise: 'Beginner' })}>Fill Form</button>
                <button onClick={onGenerate}>Generate</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        );
    };
});

jest.mock('../../../modules/learner/components/GeneratingCourseCard', () => {
    return function MockGeneratingCourseCard({ onClick }) {
        return <div data-testid="generating-course-card" onClick={onClick}>Generating Course...</div>;
    };
});

jest.mock('../../../modules/learner/components/CourseCard', () => {
    return function MockCourseCard({ course, onClick }) {
        return (
            <div data-testid={`course-card-${course.id}`} onClick={() => onClick(course)}>
                {course.title}
            </div>
        );
    };
});

jest.mock('../../../components', () => ({
    VoiceAIModal: ({ isOpen, onClose }) => (
        isOpen ? <div data-testid="voice-ai-modal"><button onClick={onClose}>Close Modal</button></div> : null
    ),
    FloatingChatWidget: () => <div data-testid="floating-chat-widget">Chat Widget</div>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Menu: () => <div data-testid="menu-icon">Menu</div>,
    Settings: () => <div data-testid="settings-icon">Settings</div>,
    Flame: () => <div data-testid="flame-icon">Flame</div>,
    Sparkles: () => <div data-testid="sparkles-icon">Sparkles</div>,
    TrendingUp: () => <div data-testid="trending-up-icon">TrendingUp</div>,
    Bot: () => <div data-testid="bot-icon">Bot</div>,
    Brain: () => <div data-testid="brain-icon">Brain</div>,
    Plus: () => <div data-testid="plus-icon">Plus</div>,
    User: () => <div data-testid="user-icon">User</div>,
    LogOut: () => <div data-testid="logout-icon">LogOut</div>,
    BookOpen: () => <div data-testid="book-open-icon">BookOpen</div>,
    Phone: () => <div data-testid="phone-icon">Phone</div>,
    X: () => <div data-testid="x-icon">X</div>,
    ChevronRight: () => <div data-testid="chevron-right-icon">ChevronRight</div>,
}));

// Mock image
jest.mock('../../../assets/fluentify_logo.jpg', () => 'logo-url');

describe('LearnerDashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGenerateCourse.mockClear();
        mockUseCourses.mockReset();
        mockUseCourses.mockImplementation(() => ({
            data: [
                {
                    id: 1,
                    title: 'Spanish 101',
                    language: 'Spanish',
                    progress: { lessonsCompleted: 5, currentStreak: 3, progressPercentage: 25 },
                },
                {
                    id: 2,
                    title: 'French 101',
                    language: 'French',
                    progress: { lessonsCompleted: 2, currentStreak: 1, progressPercentage: 10 },
                },
            ],
        }));
        mockUseUserProfile.mockReset();
        mockUseUserProfile.mockImplementation(() => ({
            data: { user: { name: 'John Doe' } },
            isLoading: false,
        }));
        mockUseStreaming.mockReset();
        mockUseStreaming.mockImplementation(() => ({
            generateCourse: mockGenerateCourse,
            state: { courseId: null, units: null },
        }));
    });

    it('should render dashboard with user name', () => {
        render(<LearnerDashboard />);
        expect(screen.getByText('Welcome, John! 👋')).toBeInTheDocument();
    });

    it('should display streak and progress stats', () => {
        render(<LearnerDashboard />);
        expect(screen.getByText('3 days')).toBeInTheDocument(); // Streak
        expect(screen.getByText('18%')).toBeInTheDocument(); // Overall progress
        expect(screen.getByText('150')).toBeInTheDocument(); // Total XP
        expect(screen.getByText('7')).toBeInTheDocument(); // Total Lessons
    });

    it('should render course list', () => {
        render(<LearnerDashboard />);
        expect(screen.getByText('Your Courses')).toBeInTheDocument();
        expect(screen.getByTestId('course-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('course-card-2')).toBeInTheDocument();
    });

    it('should navigate to course details when course clicked', () => {
        render(<LearnerDashboard />);
        const courseCard = screen.getByTestId('course-card-1');
        fireEvent.click(courseCard);
        expect(mockNavigate).toHaveBeenCalledWith('/course/1');
    });

    it('should open sidebar when menu icon clicked', () => {
        render(<LearnerDashboard />);
        const menuButton = screen.getByLabelText('Open navigation menu');
        fireEvent.click(menuButton);
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('should open settings panel when settings icon clicked', () => {
        render(<LearnerDashboard />);
        const settingsButton = screen.getByLabelText('Open settings');
        fireEvent.click(settingsButton);
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('should navigate to profile from settings', () => {
        render(<LearnerDashboard />);
        fireEvent.click(screen.getByLabelText('Open settings'));
        fireEvent.click(screen.getByText('Profile'));
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });

    it('should logout from settings', () => {
        render(<LearnerDashboard />);
        fireEvent.click(screen.getByLabelText('Open settings'));
        fireEvent.click(screen.getByText('Logout'));
        expect(mockLogout).toHaveBeenCalled();
    });

    it('should show course generation form when "Create new course" clicked', () => {
        render(<LearnerDashboard />);
        const createButton = screen.getByText('Create new course');
        fireEvent.click(createButton);
        expect(screen.getByTestId('course-generation-form')).toBeInTheDocument();
    });

    it('should call generateCourse when form submitted', async () => {
        render(<LearnerDashboard />);

        // Open form
        fireEvent.click(screen.getByText('Create new course'));

        // Fill form
        fireEvent.click(screen.getByText('Fill Form'));

        // Submit
        fireEvent.click(screen.getByText('Generate'));

        await waitFor(() => {
            expect(mockGenerateCourse).toHaveBeenCalledWith({
                language: 'Spanish',
                expectedDuration: '1 Month',
                expertise: 'Beginner',
            });
        });
    });

    it('should open voice AI modal when "Start Voice Call" clicked', () => {
        render(<LearnerDashboard />);
        const callButton = screen.getByText('Start Voice Call');
        fireEvent.click(callButton);
        expect(screen.getByTestId('voice-ai-modal')).toBeInTheDocument();
    });

    it('should render loading state when profile is loading', () => {
        mockUseUserProfile.mockImplementationOnce(() => ({ data: null, isLoading: true }));
        render(<LearnerDashboard />);
        // The loading spinner uses the Sparkles icon inside the loader
        expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
    });

    it('should show empty courses state and open generation form from empty state button', () => {
        mockUseCourses.mockImplementationOnce(() => ({ data: [] }));
        render(<LearnerDashboard />);

        expect(
            screen.getByText('No active courses yet. Create your first AI-powered course to begin.')
        ).toBeInTheDocument();

        const createCourseButton = screen.getByText('Create course');
        fireEvent.click(createCourseButton);
        expect(screen.getByTestId('course-generation-form')).toBeInTheDocument();
    });

    it.skip('should toggle between few and all courses when more than three courses', async () => {
        mockUseCourses.mockImplementationOnce(() => ({
            data: [
                { id: 1, title: 'Course 1', language: 'Spanish', progress: { progressPercentage: 10 } },
                { id: 2, title: 'Course 2', language: 'French', progress: { progressPercentage: 20 } },
                { id: 3, title: 'Course 3', language: 'German', progress: { progressPercentage: 30 } },
                { id: 4, title: 'Course 4', language: 'Italian', progress: { progressPercentage: 40 } },
            ],
        }));

        render(<LearnerDashboard />);

        const toggleButton = screen.getByText(/View all courses \(4\)/);
        fireEvent.click(toggleButton);

        await waitFor(() => {
            expect(
                screen.getByText((text) => text.includes('Show fewer'))
            ).toBeInTheDocument();
        });
    });

    it.skip('should show generating course card and navigate when clicked', async () => {
        mockUseStreaming.mockImplementationOnce(() => ({
            generateCourse: mockGenerateCourse,
            state: { courseId: 123, units: [{ id: 1 }] },
        }));

        render(<LearnerDashboard />);

        // Open generation form so that pendingGeneratedCourse is set when generating
        fireEvent.click(screen.getByText('Create new course'));
        fireEvent.click(screen.getByText('Fill Form'));
        fireEvent.click(screen.getByText('Generate'));

        // GeneratingCourseCard should appear when there are units
        const card = await screen.findByTestId('generating-course-card');
        expect(card).toBeInTheDocument();

        fireEvent.click(card);
        expect(mockNavigate).toHaveBeenCalledWith('/course/123');
    });

    it('should navigate to dashboard when logo clicked', () => {
        render(<LearnerDashboard />);
        const logoButton = screen.getByAltText('Fluentify Logo').closest('button');
        if (!logoButton) {
            throw new Error('Logo button not found');
        }
        fireEvent.click(logoButton);
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should navigate to progress page when main progress card clicked', () => {
        render(<LearnerDashboard />);
        const progressCard = screen.getByText('My Progress').closest('div');
        if (!progressCard) {
            throw new Error('Progress card container not found');
        }
        fireEvent.click(progressCard);
        expect(mockNavigate).toHaveBeenCalledWith('/progress');
    });

    it.skip('should close sidebar when clicking on overlay', () => {
        render(<LearnerDashboard />);
        const menuButton = screen.getByLabelText('Open navigation menu');
        fireEvent.click(menuButton);
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();

        // Select overlay div created when sidebarOpen is true
        const overlay = document.querySelector('.fixed.inset-0');
        if (!overlay) {
            throw new Error('Sidebar overlay not found');
        }
        fireEvent.click(overlay);
        expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    });

    it.skip('should close settings panel when clicking on overlay', () => {
        render(<LearnerDashboard />);
        const settingsButton = screen.getByLabelText('Open settings');
        fireEvent.click(settingsButton);
        expect(screen.getByText('Profile')).toBeInTheDocument();

        const overlay = document.querySelector('.fixed.inset-0');
        if (!overlay) {
            throw new Error('Settings overlay not found');
        }
        fireEvent.click(overlay);
        expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    });

    it('should close voice AI modal when close button clicked', () => {
        render(<LearnerDashboard />);
        const callButton = screen.getByText('Start Voice Call');
        fireEvent.click(callButton);
        expect(screen.getByTestId('voice-ai-modal')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Close Modal'));
        expect(screen.queryByTestId('voice-ai-modal')).not.toBeInTheDocument();
    });

    it('should navigate to progress page when "View Full Report" clicked', () => {
        render(<LearnerDashboard />);
        const reportButton = screen.getByText('View Full Report');
        fireEvent.click(reportButton);
        expect(mockNavigate).toHaveBeenCalledWith('/progress');
    });
});
