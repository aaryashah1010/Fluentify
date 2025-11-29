/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Signup from '../../../modules/auth/Signup';

// Mock dependencies
const mockNavigate = jest.fn();
const mockSignupMutate = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../hooks/useAuth', () => ({
    useSignup: () => ({
        mutate: mockSignupMutate,
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
    Award: () => <span>Award</span>,
    TrendingUp: () => <span>TrendingUp</span>,
    Zap: () => <span>Zap</span>,
    Eye: () => <span>Eye</span>,
    EyeOff: () => <span>EyeOff</span>,
}));

describe('Signup', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should render signup form', () => {
        render(<Signup />);

        expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
        expect(screen.getByLabelText(/I am a/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });

    it('should validate full name', async () => {
        render(<Signup />);

        const nameInput = screen.getByPlaceholderText('your name');

        fireEvent.change(nameInput, { target: { value: 'A', name: 'fullName' } });
        fireEvent.blur(nameInput);

        await waitFor(() => {
            expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
        });
    });

    it('should validate email format', async () => {
        render(<Signup />);

        const emailInput = screen.getByPlaceholderText('you@example.com');

        fireEvent.change(emailInput, { target: { value: 'invalidemail', name: 'email' } });
        fireEvent.blur(emailInput);

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
        });
    });

    it('should validate password length', async () => {
        render(<Signup />);

        const passwordInput = screen.getByPlaceholderText('Enter your password');

        fireEvent.change(passwordInput, { target: { value: 'short', name: 'password' } });
        fireEvent.blur(passwordInput);

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
        });
    });

    it('should validate password match', async () => {
        render(<Signup />);

        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');

        fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'different123', name: 'confirmPassword' } });
        fireEvent.blur(confirmPasswordInput);

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });
    });

    it('should toggle password visibility', () => {
        render(<Signup />);

        const passwordInput = screen.getByPlaceholderText('Enter your password');

        // Find the button that contains the Eye icon for the password field
        // There are two Eye icons (password and confirm password), get all and use the first
        const eyeElements = screen.getAllByText('Eye');
        const toggleButton = eyeElements[0].closest('button');

        expect(passwordInput).toHaveAttribute('type', 'password');

        fireEvent.click(toggleButton);
        expect(passwordInput).toHaveAttribute('type', 'text');

        // After clicking, Eye becomes EyeOff - get the first EyeOff
        const eyeOffElements = screen.getAllByText('EyeOff');
        const toggleButtonOff = eyeOffElements[0].closest('button');
        fireEvent.click(toggleButtonOff);
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should handle successful signup', async () => {
        render(<Signup />);

        const nameInput = screen.getByPlaceholderText('your name');
        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
        const submitButton = screen.getAllByText('Create Account').find(el => el.tagName === 'SPAN')?.closest('button');

        fireEvent.change(nameInput, { target: { value: 'John Doe', name: 'fullName' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123', name: 'confirmPassword' } });

        if (submitButton) {
            fireEvent.click(submitButton);
        }

        await waitFor(() => {
            expect(mockSignupMutate).toHaveBeenCalledWith(
                {
                    role: 'learner',
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                },
                expect.any(Object)
            );
        });

        // Simulate successful signup
        const onSuccessCallback = mockSignupMutate.mock.calls[0][1].onSuccess;
        onSuccessCallback({});

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

    it('should handle duplicate email error from server', async () => {
        render(<Signup />);

        const nameInput = screen.getByPlaceholderText('your name');
        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
        const submitButton = screen.getAllByText('Create Account').find(el => el.tagName === 'SPAN')?.closest('button');

        fireEvent.change(nameInput, { target: { value: 'John Doe', name: 'fullName' } });
        fireEvent.change(emailInput, { target: { value: 'new@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123', name: 'confirmPassword' } });

        if (submitButton) {
            fireEvent.click(submitButton);
        }

        await waitFor(() => {
            expect(mockSignupMutate).toHaveBeenCalled();
        });

        // Simulate server error
        const onErrorCallback = mockSignupMutate.mock.calls[0][1].onError;
        onErrorCallback({ status: 409, message: 'Email already exists' });

        await waitFor(() => {
            expect(screen.getAllByText('Email ID already registered')[0]).toBeInTheDocument();
        });
    });

    it('should prevent signup with predefined duplicate emails', async () => {
        render(<Signup />);

        const nameInput = screen.getByPlaceholderText('your name');
        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
        const submitButton = screen.getAllByText('Create Account').find(el => el.tagName === 'SPAN')?.closest('button');

        fireEvent.change(nameInput, { target: { value: 'Test User', name: 'fullName' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123', name: 'confirmPassword' } });

        if (submitButton) {
            fireEvent.click(submitButton);
        }

        await waitFor(() => {
            expect(screen.getAllByText('Email ID already registered')[0]).toBeInTheDocument();
        });

        // Should not call API for predefined duplicates
        expect(mockSignupMutate).not.toHaveBeenCalled();
    });

    it('should navigate to login page', () => {
        render(<Signup />);

        const loginButton = screen.getByText('Login');
        fireEvent.click(loginButton);

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should clear error after 5 seconds', async () => {
        render(<Signup />);

        const nameInput = screen.getByPlaceholderText('your name');
        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('Enter your password');
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
        const submitButton = screen.getAllByText('Create Account').find(el => el.tagName === 'SPAN')?.closest('button');

        fireEvent.change(nameInput, { target: { value: 'Test', name: 'fullName' } });
        fireEvent.change(emailInput, { target: { value: 'error@test.com', name: 'email' } });
        fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123', name: 'confirmPassword' } });

        if (submitButton) {
            fireEvent.click(submitButton);
        }

        await waitFor(() => {
            expect(mockSignupMutate).toHaveBeenCalled();
        });

        const onErrorCallback = mockSignupMutate.mock.calls[0][1].onError;
        onErrorCallback({ message: 'Signup failed' });

        await waitFor(() => {
            expect(screen.getByText('Signup failed')).toBeInTheDocument();
        });

        jest.advanceTimersByTime(5000);

        await waitFor(() => {
            expect(screen.queryByText('Signup failed')).not.toBeInTheDocument();
        });
    });
});
