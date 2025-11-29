/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from '../../../modules/learner/UserProfile';

// Mock dependencies
const mockNavigate = jest.fn();
const mockLogout = jest.fn();
const mockRefetch = jest.fn();
const mockUpdateProfileMutate = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../hooks/useAuth', () => ({
    useLogout: () => mockLogout,
    useUserProfile: jest.fn(),
    useUpdateProfile: () => ({
        mutateAsync: mockUpdateProfileMutate,
        isPending: false,
    }),
}));

jest.mock('../../../hooks/useCourses', () => ({
    useCourses: () => ({
        data: [
            { id: 1, title: 'Spanish 101', language: 'Spanish', progress: { lessonsCompleted: 5, progressPercentage: 25 } },
        ],
    }),
}));

// Mock components
jest.mock('../../../components', () => ({
    Button: ({ children, onClick, variant, icon, className }) => (
        <button onClick={onClick} className={className} data-testid={`btn-${variant}`}>
            {icon} {children}
        </button>
    ),
    Input: ({ value, onChange, name, error }) => (
        <div>
            <input data-testid={`input-${name}`} name={name} value={value} onChange={onChange} />
            {error && <span data-testid="error-msg">{error}</span>}
        </div>
    ),
    ErrorMessage: ({ message }) => <div data-testid="error-message">{message}</div>,
    LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

// Mock icons
jest.mock('lucide-react', () => ({
    User: () => <span>User</span>,
    Mail: () => <span>Mail</span>,
    Calendar: () => <span>Calendar</span>,
    LogOut: () => <span>LogOut</span>,
    Edit2: () => <span>Edit2</span>,
    Check: () => <span>Check</span>,
    X: () => <span>X</span>,
    ArrowLeft: () => <span>ArrowLeft</span>,
    BookOpen: () => <span>BookOpen</span>,
    CheckCircle: () => <span>CheckCircle</span>,
    Globe: () => <span>Globe</span>,
}));

// Import hook to change return value
import { useUserProfile } from '../../../hooks/useAuth';

describe('UserProfile', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useUserProfile.mockReturnValue({
            data: {
                user: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    created_at: '2023-01-01',
                    is_email_verified: true,
                    contest_name: 'JohnD',
                },
            },
            isLoading: false,
            error: null,
            refetch: mockRefetch,
        });
    });

    it('should render loading state', () => {
        useUserProfile.mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
        });

        render(<UserProfile />);
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should render error state', () => {
        useUserProfile.mockReturnValue({
            data: null,
            isLoading: false,
            error: { message: 'Failed' },
        });

        render(<UserProfile />);
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('should render user profile details', () => {
        render(<UserProfile />);
        expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('JohnD')).toBeInTheDocument();
        expect(screen.getByText('Verified')).toBeInTheDocument();
    });

    it('should render statistics', () => {
        render(<UserProfile />);
        expect(screen.getByText('1')).toBeInTheDocument(); // Courses
        expect(screen.getByText('05')).toBeInTheDocument(); // Lessons completed (padded)
    });

    it('should toggle edit mode', () => {
        render(<UserProfile />);

        // Click Edit
        fireEvent.click(screen.getByText('Edit'));

        expect(screen.getByTestId('input-name')).toBeInTheDocument();
        expect(screen.getByTestId('input-contest_name')).toBeInTheDocument();

        // Click Cancel
        fireEvent.click(screen.getByText('Cancel'));

        expect(screen.queryByTestId('input-name')).not.toBeInTheDocument();
    });

    it('should handle profile update', async () => {
        render(<UserProfile />);

        fireEvent.click(screen.getByText('Edit'));

        const nameInput = screen.getByTestId('input-name');
        fireEvent.change(nameInput, { target: { value: 'Jane Doe', name: 'name' } });

        fireEvent.click(screen.getByText('Save Changes'));

        await waitFor(() => {
            expect(mockUpdateProfileMutate).toHaveBeenCalledWith({
                name: 'Jane Doe',
                contest_name: 'JohnD', // Unchanged
            });
        });

        expect(mockRefetch).toHaveBeenCalled();
    });

    it('should validate input', async () => {
        render(<UserProfile />);

        fireEvent.click(screen.getByText('Edit'));

        const nameInput = screen.getByTestId('input-name');
        fireEvent.change(nameInput, { target: { value: 'J', name: 'name' } }); // Too short

        fireEvent.click(screen.getByText('Save Changes'));

        expect(screen.getByTestId('error-msg')).toBeInTheDocument();
        expect(mockUpdateProfileMutate).not.toHaveBeenCalled();
    });

    it('should handle logout', () => {
        render(<UserProfile />);

        fireEvent.click(screen.getByText('Log Out'));
        expect(mockLogout).toHaveBeenCalled();
    });
});
