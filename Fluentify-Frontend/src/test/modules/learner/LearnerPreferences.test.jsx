/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LearnerPreferences from '../../../modules/learner/LearnerPreferences';

// Mock dependencies
const mockNavigate = jest.fn();
const mockMutate = jest.fn();
const mockUseSaveLearnerPreferences = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../hooks/usePreferences', () => ({
    useSaveLearnerPreferences: () => mockUseSaveLearnerPreferences(),
}));

jest.mock('../../../components', () => ({
    Button: ({ children, onClick, disabled, loading, type, className }) => (
        <button onClick={onClick} disabled={disabled || loading} type={type} className={className}>
            {loading ? 'Loading...' : children}
        </button>
    ),
    ErrorMessage: ({ message }) => message ? <div data-testid="error-message">{message}</div> : null,
}));

jest.mock('../../../modules/learner/components', () => ({
    CustomDropdown: ({ options, value, onChange, placeholder }) => (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            data-testid="custom-dropdown"
        >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
                <option key={opt.name || opt} value={opt.name || opt}>
                    {opt.name || opt}
                </option>
            ))}
        </select>
    ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    User: () => <div data-testid="user-icon">User</div>,
}));

// Mock constants
jest.mock('../../../utils/constants', () => ({
    LANGUAGES: [
        { name: 'Spanish', code: 'es' },
        { name: 'French', code: 'fr' },
    ],
    DURATIONS: ['3 Months', '6 Months', '1 Year'],
    EXPERTISE_LEVELS: ['Beginner', 'Intermediate', 'Advanced'],
}));

describe('LearnerPreferences', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseSaveLearnerPreferences.mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        });
    });

    it('should render initial step with language selection', () => {
        render(<LearnerPreferences />);

        expect(screen.getByText('Learning Preferences')).toBeInTheDocument();
        expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
        expect(screen.getByText('Which language do you want to learn?')).toBeInTheDocument();
    });

    it('should allow selecting a language', () => {
        render(<LearnerPreferences />);

        const dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Spanish' } });

        expect(dropdown.value).toBe('Spanish');
    });

    it('should disable Next button when no language selected', () => {
        render(<LearnerPreferences />);

        const nextButton = screen.getByText('Next →');
        expect(nextButton).toBeDisabled();
    });

    it('should enable Next button when language selected', () => {
        render(<LearnerPreferences />);

        const dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Spanish' } });

        const nextButton = screen.getByText('Next →');
        expect(nextButton).not.toBeDisabled();
    });

    it('should navigate to duration step when Next clicked', () => {
        render(<LearnerPreferences />);

        const dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Spanish' } });

        const nextButton = screen.getByText('Next →');
        fireEvent.click(nextButton);

        expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
        expect(screen.getByText("What's your estimated learning duration?")).toBeInTheDocument();
    });

    it('should navigate back to language step when Back clicked', () => {
        render(<LearnerPreferences />);

        // Go to step 2
        const dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Spanish' } });
        fireEvent.click(screen.getByText('Next →'));

        // Go back
        const backButton = screen.getByText('← Back');
        fireEvent.click(backButton);

        expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
        expect(screen.getByText('Which language do you want to learn?')).toBeInTheDocument();
    });

    it('should navigate to expertise step after duration selection', () => {
        render(<LearnerPreferences />);

        // Step 1: Select language
        let dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Spanish' } });
        fireEvent.click(screen.getByText('Next →'));

        // Step 2: Select duration
        dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: '3 Months' } });
        fireEvent.click(screen.getByText('Next →'));

        expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
        expect(screen.getByText("What's your expertise level?")).toBeInTheDocument();
    });

    it('should submit preferences successfully', async () => {
        render(<LearnerPreferences />);

        // Step 1: Select language
        let dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Spanish' } });
        fireEvent.click(screen.getByText('Next →'));

        // Step 2: Select duration
        dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: '3 Months' } });
        fireEvent.click(screen.getByText('Next →'));

        // Step 3: Select expertise and submit
        dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Beginner' } });

        const submitButton = screen.getByText('Save Preferences');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith(
                {
                    language: 'Spanish',
                    expected_duration: '3 Months',
                    expertise: 'Beginner',
                },
                expect.any(Object)
            );
        });
    });

    it('should navigate to dashboard on successful submission', async () => {
        mockMutate.mockImplementation((data, { onSuccess }) => {
            onSuccess();
        });

        render(<LearnerPreferences />);

        // Complete all steps
        let dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Spanish' } });
        fireEvent.click(screen.getByText('Next →'));

        dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: '3 Months' } });
        fireEvent.click(screen.getByText('Next →'));

        dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Beginner' } });

        const submitButton = screen.getByText('Save Preferences');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
                replace: true,
                state: { fromForm: true },
            });
        });
    });

    it('should display error message on submission failure', async () => {
        mockMutate.mockImplementation((data, { onError }) => {
            onError(new Error('Failed to save'));
        });

        render(<LearnerPreferences />);

        // Complete all steps
        let dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Spanish' } });
        fireEvent.click(screen.getByText('Next →'));

        dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: '3 Months' } });
        fireEvent.click(screen.getByText('Next →'));

        dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Beginner' } });

        const submitButton = screen.getByText('Save Preferences');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to save');
        });
    });

    it('should show loading state during submission', () => {
        mockUseSaveLearnerPreferences.mockReturnValue({
            mutate: mockMutate,
            isPending: true,
        });

        render(<LearnerPreferences />);

        // Navigate to step 3
        let dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: 'Spanish' } });
        fireEvent.click(screen.getByText('Next →'));

        dropdown = screen.getByTestId('custom-dropdown');
        fireEvent.change(dropdown, { target: { value: '3 Months' } });
        fireEvent.click(screen.getByText('Next →'));

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});
