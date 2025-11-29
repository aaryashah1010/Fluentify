/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import UserProfile from '../../../modules/admin/UserProfile';

// Mock dependencies
const mockNavigate = jest.fn();
const mockLogout = jest.fn();
const mockUpdateProfile = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../hooks/useAuth', () => ({
    useLogout: () => mockLogout,
    useUserProfile: jest.fn(),
    useUpdateProfile: jest.fn(),
}));

// Mock components
jest.mock('../../../components', () => ({
    Button: ({ children, onClick, disabled, loading, icon, className }) => (
        <button onClick={onClick} disabled={disabled || loading} className={className}>
            {loading ? 'Loading...' : children}
            {icon}
        </button>
    ),
    Input: ({ value, onChange, name, error }) => (
        <div>
            <input data-testid="input-name" name={name} value={value} onChange={onChange} />
            {error && <span>{error}</span>}
        </div>
    ),
    ErrorMessage: ({ message }) => <div>{message}</div>,
    LoadingSpinner: () => <div>Loading...</div>,
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    User: () => <div data-testid="user-icon">User</div>,
    Mail: () => <div data-testid="mail-icon">Mail</div>,
    Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
    LogOut: () => <div data-testid="logout-icon">LogOut</div>,
    Edit2: () => <div data-testid="edit-icon">Edit2</div>,
    Check: () => <div data-testid="check-icon">Check</div>,
    X: () => <div data-testid="x-icon">X</div>,
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
}));

// Import after mocks
import * as authHooks from '../../../hooks/useAuth';
const mockUseUserProfile = jest.mocked(authHooks.useUserProfile);
const mockUseUpdateProfile = jest.mocked(authHooks.useUpdateProfile);

describe('UserProfile', () => {
    const mockUser = {
        name: 'Admin User',
        email: 'admin@example.com',
        created_at: '2024-01-01T00:00:00.000Z',
        is_email_verified: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseUserProfile.mockReturnValue({
            data: { data: { user: mockUser } },
            isLoading: false,
            error: null,
        });
        mockUseUpdateProfile.mockReturnValue({
            mutateAsync: mockUpdateProfile,
            isPending: false,
        });
    });

    it('should render profile information', () => {
        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        expect(screen.getAllByText('Admin User').length).toBeGreaterThan(0);
        expect(screen.getByText('admin@example.com')).toBeInTheDocument();
        expect(screen.getByText('Verified')).toBeInTheDocument();
    });

    it('should display loading state', () => {
        mockUseUserProfile.mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
        });

        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display error state', () => {
        mockUseUserProfile.mockReturnValue({
            data: null,
            isLoading: false,
            error: new Error('Failed to load'),
        });

        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        expect(screen.getByText('Failed to load profile. Please try again.')).toBeInTheDocument();
    });

    it('should navigate back when back button is clicked', () => {
        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        const backButton = screen.getByTestId('arrow-left-icon').closest('button');
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
    });

    it('should logout when logout button is clicked', () => {
        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        const logoutButton = screen.getByText('Log Out');
        fireEvent.click(logoutButton);
        expect(mockLogout).toHaveBeenCalled();
    });

    it('should switch to edit mode when Edit button is clicked', () => {
        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        expect(screen.getByTestId('input-name')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should update profile successfully', async () => {
        mockUpdateProfile.mockResolvedValue({});

        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        // Enter edit mode
        fireEvent.click(screen.getByText('Edit'));

        // Change name
        const input = screen.getByTestId('input-name');
        fireEvent.change(input, { target: { value: 'New Name' } });

        // Save
        fireEvent.click(screen.getByText('Save'));

        expect(mockUpdateProfile).toHaveBeenCalledWith(
            { name: 'New Name' },
            expect.any(Object)
        );

        // Simulate success callback
        const mutationOptions = mockUpdateProfile.mock.calls[0][1];
        mutationOptions.onSuccess();

        await waitFor(() => {
            expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
        });
    });

    it('should validate name length', async () => {
        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Edit'));

        const input = screen.getByTestId('input-name');
        fireEvent.change(input, { target: { value: 'A' } }); // Too short

        fireEvent.click(screen.getByText('Save'));

        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
        expect(mockUpdateProfile).not.toHaveBeenCalled();
    });

    it('should validate name characters', async () => {
        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Edit'));

        const input = screen.getByTestId('input-name');
        fireEvent.change(input, { target: { value: 'Invalid@Name' } }); // Invalid chars

        fireEvent.click(screen.getByText('Save'));

        expect(screen.getByText('Name can only contain letters, spaces, hyphens, and apostrophes')).toBeInTheDocument();
        expect(mockUpdateProfile).not.toHaveBeenCalled();
    });

    it('should handle update error', async () => {
        mockUpdateProfile.mockRejectedValue(new Error('Update failed'));

        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Edit'));
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(screen.getByText('Update failed')).toBeInTheDocument();
        });
    });

    it('should cancel editing and revert changes', () => {
        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Edit'));

        const input = screen.getByTestId('input-name');
        fireEvent.change(input, { target: { value: 'Changed Name' } });

        fireEvent.click(screen.getByText('Cancel'));

        expect(screen.queryByTestId('input-name')).not.toBeInTheDocument();
        expect(screen.queryByTestId('input-name')).not.toBeInTheDocument();
        expect(screen.getAllByText('Admin User').length).toBeGreaterThan(0);
    });

    it('should handle missing date', () => {
        const userWithoutDate = { ...mockUser, created_at: null };
        mockUseUserProfile.mockReturnValue({
            data: { data: { user: userWithoutDate } },
            isLoading: false,
            error: null,
        });

        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        expect(screen.getByText('Not available')).toBeInTheDocument();
    });

    it('should display "Not Verified" if email is not verified', () => {
        const unverifiedUser = { ...mockUser, is_email_verified: false };
        mockUseUserProfile.mockReturnValue({
            data: { data: { user: unverifiedUser } },
            isLoading: false,
            error: null,
        });

        render(
            <MemoryRouter>
                <UserProfile />
            </MemoryRouter>
        );

        expect(screen.getByText('Not Verified')).toBeInTheDocument();
    });
});
