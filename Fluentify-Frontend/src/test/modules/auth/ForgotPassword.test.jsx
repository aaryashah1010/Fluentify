/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPassword from '../../../modules/auth/ForgotPassword';

// Mock dependencies  
const mockNavigate = jest.fn();
const mockLocation = { search: '' };
const mockForgotPasswordMutate = jest.fn();
const mockVerifyOTPMutate = jest.fn();
const mockResetPasswordMutate = jest.fn();
const mockResendOTPMutate = jest.fn();

jest.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
	useLocation: () => mockLocation,
}));

jest.mock('../../../hooks/useAuth', () => ({
	useForgotPassword: () => ({
		mutate: mockForgotPasswordMutate,
		isPending: false,
	}),
	useVerifyResetOTP: () => ({
		mutate: mockVerifyOTPMutate,
		isPending: false,
	}),
	useResetPassword: () => ({
		mutate: mockResetPasswordMutate,
		isPending: false,
	}),
	useResendOTP: () => ({
		mutate: mockResendOTPMutate,
		isPending: false,
	}),
}));

// Mock icons
jest.mock('lucide-react', () => ({
	Mail: () => <span>Mail</span>,
	Lock: () => <span>Lock</span>,
	ArrowLeft: () => <span>ArrowLeft</span>,
	RefreshCw: () => <span>RefreshCw</span>,
	CheckCircle: () => <span>CheckCircle</span>,
}));

// Mock complex components
jest.mock('../../../components', () => ({
	Button: ({ children, onClick, loading, type, ...props }) => (
		<button onClick={onClick} disabled={loading} type={type} {...props}>
			{loading ? 'Loading...' : children}
		</button>
	),
	ErrorMessage: ({ message }) => message ? <div>{message}</div> : null,
	Input: ({ label, value, onChange, name, placeholder, ...props }) => (
		<div>
			{label && <label>{label}</label>}
			<input name={name} value={value} onChange={onChange} placeholder={placeholder} {...props} />
		</div>
	),
}));

jest.mock('../../../modules/auth/components', () => ({
	PasswordInput: ({ value, onChange, name, label, placeholder, ...props }) => (
		<div>
			{label && <label>{label}</label>}
			<input type="password" name={name} value={value} onChange={onChange} placeholder={placeholder} {...props} />
		</div>
	),
}));

jest.mock('../../../components/PasswordStrengthIndicator', () => {
	return function PasswordStrengthIndicator() {
		return <div>Password Strength Indicator</div>;
	};
});

jest.mock('../../../components/OTPInput', () => {
	return function OTPInput({ value, onChange, length }) {
		return (
			<input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				maxLength={length}
				data-testid="otp-input"
			/>
		);
	};
});

describe('ForgotPassword', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockLocation.search = '';
		jest.useFakeTimers();
	});

	it('should show validation error for invalid email', async () => {
		render(<ForgotPassword />);

		const emailInput = screen.getByPlaceholderText(/Enter your email/i);
		const submitButton = screen.getByText('Send OTP');

		fireEvent.change(emailInput, { target: { value: 'invalid-email', name: 'email' } });
		fireEvent.click(submitButton);

		// ✅ FIXED: async + flexible matcher
		await waitFor(() => {
			expect(screen.getByText(t => t.includes('valid email'))).toBeInTheDocument();
		});
	});

	afterEach(() => {
		jest.runOnlyPendingTimers();
		jest.useRealTimers();
	});

	it('should render email input step initially', () => {
		render(<ForgotPassword />);

		expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
		expect(screen.getByText(/No worries, we'll send you reset instructions/i)).toBeInTheDocument();
	});

	it('should allow role selection', () => {
		const { container } = render(<ForgotPassword />);

		const roleSelect = container.querySelector('select[name="role"]');
		expect(roleSelect.value).toBe('learner');

		fireEvent.change(roleSelect, { target: { value: 'admin', name: 'role' } });
		expect(roleSelect.value).toBe('admin');
	});

	it('should submit valid email', async () => {
		render(<ForgotPassword />);

		const emailInput = screen.getByPlaceholderText(/Enter your email/i);
		const submitButton = screen.getByText('Send OTP');

		fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockForgotPasswordMutate).toHaveBeenCalledWith(
				{ email: 'test@example.com', role: 'learner' },
				expect.any(Object)
			);
		});
	});

	it('should handle email submission error', async () => {
		render(<ForgotPassword />);

		const emailInput = screen.getByPlaceholderText(/Enter your email/i);
		const submitButton = screen.getByText('Send OTP');

		fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockForgotPasswordMutate).toHaveBeenCalled();
		});

		const onErrorCallback = mockForgotPasswordMutate.mock.calls[0][1].onError;
		onErrorCallback({ message: 'Email not found' });

		await waitFor(() => {
			expect(screen.getByText('Email not found')).toBeInTheDocument();
		});
	});

	it('should navigate back to login', () => {
		render(<ForgotPassword />);

		const backButton = screen.getByText('Back to Login');
		fireEvent.click(backButton);

		expect(mockNavigate).toHaveBeenCalledWith('/login');
	});

	it('should pre-fill role from URL parameter', () => {
		mockLocation.search = '?role=admin';
		const { container } = render(<ForgotPassword />);

		const roleSelect = container.querySelector('select[name="role"]');
		expect(roleSelect.value).toBe('admin');
		expect(roleSelect).toBeDisabled();
	});

	it('should pre-fill email from URL parameter', () => {
		mockLocation.search = '?email=test@example.com';
		render(<ForgotPassword />);

		const emailInput = screen.getByPlaceholderText(/Enter your email/i);
		expect(emailInput.value).toBe('test@example.com');
		expect(emailInput).toBeDisabled();
	});

	it('should handle successful email submission', async () => {
		render(<ForgotPassword />);

		const emailInput = screen.getByPlaceholderText(/Enter your email/i);
		fireEvent.change(emailInput, { target: { value: 'test@example.com', name: 'email' } });

		const submitButton = screen.getByText('Send OTP');
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockForgotPasswordMutate).toHaveBeenCalled();
		});

		const { onSuccess } = mockForgotPasswordMutate.mock.calls[0][1];
		onSuccess();

		expect(submitButton).toBeInTheDocument();
	});

	it('should handle both learner and admin roles', async () => {
		const { container } = render(<ForgotPassword />);

		const roleSelect = container.querySelector('select[name="role"]');
		const emailInput = screen.getByPlaceholderText(/Enter your email/i);
		const submitButton = screen.getByText('Send OTP');

		fireEvent.change(roleSelect, { target: { value: 'admin', name: 'role' } });
		fireEvent.change(emailInput, { target: { value: 'admin@example.com', name: 'email' } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockForgotPasswordMutate).toHaveBeenCalledWith(
				{ email: 'admin@example.com', role: 'admin' },
				expect.any(Object)
			);
		});
	});

	it('should resend OTP and decrement timer, and handle resend error', async () => {
		mockForgotPasswordMutate.mockImplementation((data, { onSuccess }) => onSuccess());
		mockResendOTPMutate.mockImplementation((data, { onSuccess }) => onSuccess());

		render(<ForgotPassword />);

		fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
			target: { value: 'test@example.com', name: 'email' },
		});
		fireEvent.click(screen.getByText('Send OTP'));

		await waitFor(() => {
			expect(screen.getByRole('heading', { name: 'Verify OTP' })).toBeInTheDocument();
		});

		expect(screen.getByText(/Resend in 60s/)).toBeInTheDocument();

		React.act(() => {
			jest.advanceTimersByTime(60000);
		});

		await waitFor(() => {
			expect(screen.getByText('Resend OTP')).toBeInTheDocument();
		});

		fireEvent.click(screen.getByText('Resend OTP'));

		await waitFor(() => {
			expect(mockResendOTPMutate).toHaveBeenCalled();
		});

		expect(screen.getByText(/Resend in 60s/)).toBeInTheDocument();

		React.act(() => {
			jest.advanceTimersByTime(1000);
		});

		await waitFor(() => {
			expect(screen.getByText(/Resend in 59s/)).toBeInTheDocument();
		});

		React.act(() => {
			jest.advanceTimersByTime(59000);
		});

		await waitFor(() => {
			expect(screen.getByText('Resend OTP')).toBeInTheDocument();
		});

		mockResendOTPMutate.mockImplementation((data, { onError }) => onError({ message: 'Resend failed' }));
		fireEvent.click(screen.getByText('Resend OTP'));

		await waitFor(() => {
			expect(screen.getByText('Resend failed')).toBeInTheDocument();
		});
	});
});

