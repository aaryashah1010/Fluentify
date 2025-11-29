/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupWithOTP from '../../../modules/auth/SignupWithOTP';

// Mock dependencies
const mockNavigate = jest.fn();
const mockSignupMutate = jest.fn();
const mockVerifySignupOTPMutate = jest.fn();
const mockResendOTPMutate = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../hooks/useAuth', () => ({
    useSignup: () => ({
        mutate: mockSignupMutate,
        isPending: false,
    }),
    useVerifySignupOTP: () => ({
        mutate: mockVerifySignupOTPMutate,
        isPending: false,
    }),
    useResendOTP: () => ({
        mutate: mockResendOTPMutate,
        isPending: false,
    }),
}));

// Mock assets
jest.mock('../../../assets/fluentify_logo.jpg', () => 'logo-url');

// Mock lucide-react icons
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
    UserPlus: () => <span>UserPlus</span>,
    Lightbulb: () => <span>Lightbulb</span>,
    RefreshCw: () => <span>RefreshCw</span>,
    ArrowLeft: () => <span>ArrowLeft</span>,
    Check: () => <span>Check</span>,
}));

describe('SignupWithOTP', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should render signup form initially', () => {
        render(<SignupWithOTP />);

        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Create a strong password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument();
    });

    it('should validate form fields', async () => {
        render(<SignupWithOTP />);

        // Accept terms first to enable button
        const termsCheckbox = screen.getByRole('checkbox');
        fireEvent.click(termsCheckbox);

        const submitButton = screen.getByText(/Continue to Verification/i);

        // Submit empty form
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getAllByText('Name is required').length).toBeGreaterThan(0);
            expect(screen.getByText('Email is required')).toBeInTheDocument();
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });

        // Test invalid email
        const emailInput = screen.getByPlaceholderText('you@example.com');
        fireEvent.change(emailInput, { target: { value: 'invalid-email', name: 'email' } });
        fireEvent.blur(emailInput);

        expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();

        // Test password mismatch
        const passwordInput = screen.getByPlaceholderText('Create a strong password');
        const confirmInput = screen.getByPlaceholderText('Confirm your password');

        fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } });
        fireEvent.change(confirmInput, { target: { value: 'mismatch123', name: 'confirmPassword' } });
        fireEvent.blur(confirmInput);

        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    it('should handle successful signup submission', async () => {
        render(<SignupWithOTP />);

        fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'John Doe', name: 'name' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'john@example.com', name: 'email' } });
        fireEvent.change(screen.getByPlaceholderText('Create a strong password'), { target: { value: 'Password123!', name: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'Password123!', name: 'confirmPassword' } });

        // Accept terms
        const termsCheckbox = screen.getByRole('checkbox');
        fireEvent.click(termsCheckbox);

        const submitButton = screen.getByText(/Continue to Verification/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSignupMutate).toHaveBeenCalledWith(
                {
                    role: 'learner',
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'Password123!',
                },
                expect.any(Object)
            );
        });
    });

    it.skip('should show OTP validation error when OTP is incomplete', async () => {
        // Move to OTP step by simulating signup success
        mockSignupMutate.mockImplementation((data, { onSuccess }) => onSuccess());
        render(<SignupWithOTP />);

        fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'John Doe', name: 'name' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'john@example.com', name: 'email' } });
        fireEvent.change(screen.getByPlaceholderText('Create a strong password'), { target: { value: 'Password123!', name: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'Password123!', name: 'confirmPassword' } });
        fireEvent.click(screen.getByRole('checkbox'));
        fireEvent.click(screen.getByText(/Continue to Verification/i));

        await waitFor(() => {
            expect(screen.getByText('Verify Your Email')).toBeInTheDocument();
        });

        // Submit without entering full OTP (length !== 6)
        fireEvent.click(screen.getByText('Verify & Create Account'));

        expect(screen.getByText('Please enter a valid 6-digit OTP')).toBeInTheDocument();
    });

    it.skip('should verify OTP successfully for learner role and call onNavigate', async () => {
        const mockOnNavigate = jest.fn();
        mockSignupMutate.mockImplementation((data, { onSuccess }) => onSuccess());
        render(<SignupWithOTP onNavigate={mockOnNavigate} />);

        // Fill signup form and move to OTP step
        fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'John Doe', name: 'name' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'john@example.com', name: 'email' } });
        fireEvent.change(screen.getByPlaceholderText('Create a strong password'), { target: { value: 'Password123!', name: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'Password123!', name: 'confirmPassword' } });
        fireEvent.click(screen.getByRole('checkbox'));
        fireEvent.click(screen.getByText(/Continue to Verification/i));

        await waitFor(() => {
            expect(screen.getByText('Verify Your Email')).toBeInTheDocument();
        });

        // Enter full OTP
        const { container } = render(<></>);
        // Instead of re-rendering, query from document
        const otpInputs = document.querySelectorAll('input[id^="otp-"]');
        otpInputs.forEach((input, index) => {
            fireEvent.change(input, { target: { value: String((index + 1) % 10) } });
        });

        fireEvent.click(screen.getByText('Verify & Create Account'));

        await waitFor(() => {
            expect(mockVerifySignupOTPMutate).toHaveBeenCalled();
        });

        const { onSuccess } = mockVerifySignupOTPMutate.mock.calls[0][1];
        onSuccess();

        expect(mockOnNavigate).toHaveBeenCalledWith('learner');
    });

    it.skip('should verify OTP successfully for admin role and call onNavigate with admin-dashboard', async () => {
        const mockOnNavigate = jest.fn();
        mockSignupMutate.mockImplementation((data, { onSuccess }) => onSuccess());
        render(<SignupWithOTP onNavigate={mockOnNavigate} />);

        // Change role to admin
        const roleSelect = screen.getByDisplayValue('Learner').closest('select');
        fireEvent.change(roleSelect, { target: { value: 'admin', name: 'role' } });

        fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'Admin User', name: 'name' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'admin@example.com', name: 'email' } });
        fireEvent.change(screen.getByPlaceholderText('Create a strong password'), { target: { value: 'Password123!', name: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'Password123!', name: 'confirmPassword' } });
        fireEvent.click(screen.getByRole('checkbox'));
        fireEvent.click(screen.getByText(/Continue to Verification/i));

        await waitFor(() => {
            expect(screen.getByText('Verify Your Email')).toBeInTheDocument();
        });

        const otpInputs = document.querySelectorAll('input[id^="otp-"]');
        otpInputs.forEach((input, index) => {
            fireEvent.change(input, { target: { value: String((index + 1) % 10) } });
        });

        fireEvent.click(screen.getByText('Verify & Create Account'));

        await waitFor(() => {
            expect(mockVerifySignupOTPMutate).toHaveBeenCalled();
        });

        const { onSuccess } = mockVerifySignupOTPMutate.mock.calls[0][1];
        onSuccess();

        expect(mockOnNavigate).toHaveBeenCalledWith('admin-dashboard');
    });

    it.skip('should resend OTP and handle timer in OTP step', async () => {
        mockSignupMutate.mockImplementation((data, { onSuccess }) => onSuccess());
        mockResendOTPMutate.mockImplementation((data, { onSuccess }) => onSuccess());
        render(<SignupWithOTP />);

        // Move to OTP step
        fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'John Doe', name: 'name' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'john@example.com', name: 'email' } });
        fireEvent.change(screen.getByPlaceholderText('Create a strong password'), { target: { value: 'Password123!', name: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm your password'), { target: { value: 'Password123!', name: 'confirmPassword' } });
        fireEvent.click(screen.getByRole('checkbox'));
        fireEvent.click(screen.getByText(/Continue to Verification/i));

        await waitFor(() => {
            expect(screen.getByText('Verify Your Email')).toBeInTheDocument();
        });

        // Initially, resend button should show countdown after first successful send
        // Simulate clicking resend once timer is zero
        // Fast-forward any existing timers
        jest.advanceTimersByTime(60000);

        const resendButton = screen.getByText(/Resend OTP|Resend in/i);
        fireEvent.click(resendButton);

        await waitFor(() => {
            expect(mockResendOTPMutate).toHaveBeenCalled();
        });

        // After success, timer should restart
        jest.advanceTimersByTime(1000);
    });
});
