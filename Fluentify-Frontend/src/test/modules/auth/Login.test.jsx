/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../../modules/auth/Login';

// Mock dependencies
const mockNavigate = jest.fn();
const mockLoginMutate = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../hooks/useAuth', () => ({
    useLogin: () => ({
        mutate: mockLoginMutate,
        isPending: false,
    }),
}));

jest.mock('../../../assets/fluentify_logo.jpg', () => 'logo-url');

// Mock icons
jest.mock('lucide-react', () => ({
    Mail: () => <span>Mail</span>,
    User: () => <span>User</span>,
    AlertCircle: () => <span>AlertCircle</span>,
    Lock: () => <span>Lock</span>,
    ArrowRight: () => <span>ArrowRight</span>,
    Sparkles: () => <span>Sparkles</span>,
    BookOpen: () => <span>BookOpen</span>,
    Award: () => <span>Award</span>,
    TrendingUp: () => <span>TrendingUp</span>,
    Zap: () => <span>Zap</span>,
    FormInputIcon: () => <span>FormInputIcon</span>,
    Eye: () => <span>Eye</span>,
    EyeOff: () => <span>EyeOff</span>,
}));

describe('Login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should render login form', () => {
        render(<Login />);

        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByText('Sign in to continue your learning journey')).toBeInTheDocument();
        expect(screen.getByLabelText(/I am a/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    });

    it('should allow selecting role', () => {
        render(<Login />);

        const roleSelect = screen.getByLabelText(/I am a/i);

        expect(roleSelect.value).toBe('learner');

        fireEvent.change(roleSelect, { target: { value: 'admin' } });
        expect(roleSelect.value).toBe('admin');
    });

    it('should validate required email on blur', async () => {
        render(<Login />);

        const emailInput = screen.getByPlaceholderText('you@example.com');

        // Empty email
        fireEvent.blur(emailInput);

        await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument();
        });
    });

    it('should validate email format on blur', async () => {
        render(<Login />);

        const emailInput = screen.getByPlaceholderText('you@example.com');

        // Invalid email
        fireEvent.change(emailInput, { target: { value: 'invalidemail', name: 'email' } });
        fireEvent.blur(emailInput);

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
        });
    });

    it('should validate required password on blur', async () => {
        render(<Login />);

        const passwordInput = screen.getByPlaceholderText('Enter your password');

        // Empty password
        fireEvent.blur(passwordInput);

        await waitFor(() => {
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
    });

    it('should validate password length on blur', async () => {
        render(<Login />);

        const passwordInput = screen.getByPlaceholderText('Enter your password');

        // Too short password
        fireEvent.change(passwordInput, { target: { value: 'short', name: 'password' } });
        fireEvent.blur(passwordInput);

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
        });
    });

    it('should toggle password visibility', () => {
        render(<Login />);

        const passwordInput = screen.getByPlaceholderText('Enter your password');

        // Find the button that contains the Eye icon (mocked as <span>Eye</span>)
        const toggleButton = screen.getByText('Eye').closest('button');

        expect(passwordInput).toHaveAttribute('type', 'password');

        fireEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute('type', 'text');

        // After clicking, Eye becomes EyeOff
        const toggleButtonOff = screen.getByText('EyeOff').closest('button');
        fireEvent.click(toggleButtonOff);
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should handle successful login for learner', async () => {
        render(<Login />);

        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByText('Sign In');

        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });

        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(mockLoginMutate).toHaveBeenCalledWith(
                { role: 'learner', email: 'test@example.com', password: 'password123' },
                expect.any(Object)
            );
        });

        // Simulate successful login
        const onSuccessCallback = mockLoginMutate.mock.calls[0][1].onSuccess;
        onSuccessCallback({});

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should handle successful login for admin', async () => {
        render(<Login />);

        const roleSelect = screen.getByLabelText(/I am a/i);
        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByText('Sign In');

        fireEvent.change(roleSelect, { target: { value: 'admin' } });
        fireEvent.change(emailInput, { target: { value: 'admin@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'adminpass123', name: 'password' } });

        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(mockLoginMutate).toHaveBeenCalledWith(
                { role: 'admin', email: 'admin@example.com', password: 'adminpass123' },
                expect.any(Object)
            );
        });

        // Simulate successful login
        const onSuccessCallback = mockLoginMutate.mock.calls[0][1].onSuccess;
        onSuccessCallback({});

        expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
    });

    it('should handle login error', async () => {
        render(<Login />);

        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByText('Sign In');

        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass', name: 'password' } });

        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(mockLoginMutate).toHaveBeenCalled();
        });

        // Simulate error
        const onErrorCallback = mockLoginMutate.mock.calls[0][1].onError;
        onErrorCallback({ message: 'Invalid credentials' });

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('should clear error after 5 seconds', async () => {
        render(<Login />);

        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByText('Sign In');

        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass', name: 'password' } });
        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(mockLoginMutate).toHaveBeenCalled();
        });

        const onErrorCallback = mockLoginMutate.mock.calls[0][1].onError;
        onErrorCallback({ message: 'Test error' });

        await waitFor(() => {
            expect(screen.getByText('Test error')).toBeInTheDocument();
        });

        // Fast-forward time
        jest.advanceTimersByTime(5000);

        await waitFor(() => {
            expect(screen.queryByText('Test error')).not.toBeInTheDocument();
        });
    });

    it('should navigate to signup page', () => {
        render(<Login />);

        const signupButton = screen.getByText('Create an account');
        fireEvent.click(signupButton);

        expect(mockNavigate).toHaveBeenCalledWith('/signup');
    });

    it('should navigate to forgot password page', () => {
        render(<Login />);

        const forgotPasswordButton = screen.getByText('Forgot password?');
        fireEvent.click(forgotPasswordButton);

        expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
    });

    it('should not submit form with invalid email', async () => {
        render(<Login />);

        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByText('Sign In');

        fireEvent.change(emailInput, { target: { value: 'notanemail', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });

        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
        });

        expect(mockLoginMutate).not.toHaveBeenCalled();
    });

    it('should not submit form with short password', async () => {
        render(<Login />);

        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByText('Sign In');

        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'short', name: 'password' } });

        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(screen.getAllByText('Password must be at least 8 characters')[0]).toBeInTheDocument();
        });

        expect(mockLoginMutate).not.toHaveBeenCalled();
    });

    it('should render feature highlights', () => {
        render(<Login />);

        expect(screen.getByText('Interactive Learning')).toBeInTheDocument();
        expect(screen.getByText('Smart AI Instructors')).toBeInTheDocument();
        expect(screen.getByText('Track Progress')).toBeInTheDocument();
    });
    it('should handle login failure', async () => {
        mockLoginMutate.mockImplementation((data, { onError }) => {
            onError(new Error('Invalid credentials'));
        });

        render(<Login />);

        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const signInButton = screen.getByText('Sign In');

        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });

        fireEvent.click(signInButton);

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });

    it('should submit form on Enter key press', async () => {
        mockLoginMutate.mockImplementation((data, { onSuccess }) => {
            onSuccess({});
        });

        render(<Login />);

        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');

        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });

        fireEvent.keyPress(passwordInput, { key: 'Enter', code: 'Enter', charCode: 13 });

        await waitFor(() => {
            expect(mockLoginMutate).toHaveBeenCalled();
        });
    });
});
