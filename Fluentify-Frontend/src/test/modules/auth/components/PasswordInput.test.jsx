/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordInput from '../../../../modules/auth/components/PasswordInput';

// Mock icons
jest.mock('lucide-react', () => ({
    Eye: () => <span data-testid="eye-icon">Eye</span>,
    EyeOff: () => <span data-testid="eyeoff-icon">EyeOff</span>,
    Lock: () => <span data-testid="lock-icon">Lock</span>,
}));

describe('PasswordInput', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with default props', () => {
        render(<PasswordInput value="" onChange={mockOnChange} />);

        expect(screen.getByText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
        expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    });

    it('should render with custom label and placeholder', () => {
        render(
            <PasswordInput
                value=""
                onChange={mockOnChange}
                label="New Password"
                placeholder="Create a strong password"
            />
        );

        expect(screen.getByText('New Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Create a strong password')).toBeInTheDocument();
    });

    it('should toggle password visibility', () => {
        render(<PasswordInput value="mypassword" onChange={mockOnChange} />);

        const input = screen.getByPlaceholderText('Enter password');
        const toggleButton = screen.getByRole('button');

        // Initially password should be hidden
        expect(input).toHaveAttribute('type', 'password');
        expect(screen.getByTestId('eye-icon')).toBeInTheDocument();

        // Click to show password
        fireEvent.click(toggleButton);
        expect(input).toHaveAttribute('type', 'text');
        expect(screen.getByTestId('eyeoff-icon')).toBeInTheDocument();

        // Click to hide password again
        fireEvent.click(toggleButton);
        expect(input).toHaveAttribute('type', 'password');
        expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    });

    it('should call onChange when input value changes', () => {
        render(<PasswordInput value="" onChange={mockOnChange} />);

        const input = screen.getByPlaceholderText('Enter password');
        fireEvent.change(input, { target: { value: 'newpassword123' } });

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('should display error message', () => {
        render(
            <PasswordInput
                value=""
                onChange={mockOnChange}
                error="Password must be at least 8 characters"
            />
        );

        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
        const input = screen.getByPlaceholderText('Enter password');
        expect(input).toHaveClass('border-red-500');
    });

    it('should display hint when no error', () => {
        render(
            <PasswordInput
                value=""
                onChange={mockOnChange}
                hint="Use a mix of letters, numbers, and symbols"
            />
        );

        expect(screen.getByText('Use a mix of letters, numbers, and symbols')).toBeInTheDocument();
    });

    it('should not display hint when error is present', () => {
        render(
            <PasswordInput
                value=""
                onChange={mockOnChange}
                hint="Use a mix of letters, numbers, and symbols"
                error="Password is too weak"
            />
        );

        expect(screen.queryByText('Use a mix of letters, numbers, and symbols')).not.toBeInTheDocument();
        expect(screen.getByText('Password is too weak')).toBeInTheDocument();
    });

    it('should pass through additional props', () => {
        render(
            <PasswordInput
                value=""
                onChange={mockOnChange}
                data-testid="custom-password-input"
                autoComplete="new-password"
            />
        );

        const input = screen.getByPlaceholderText('Enter password');
        expect(input).toHaveAttribute('data-testid', 'custom-password-input');
        expect(input).toHaveAttribute('autocomplete', 'new-password');
    });
});
