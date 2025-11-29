/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageModulesPage from '../../../modules/learner/LanguageModulesPage';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUsePublishedLanguages = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../hooks/usePublishedModules', () => ({
    usePublishedLanguages: () => mockUsePublishedLanguages(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
    Globe: () => <div data-testid="globe-icon">Globe</div>,
    Loader2: () => <div data-testid="loader-icon">Loader2</div>,
    BookOpen: () => <div data-testid="book-open-icon">BookOpen</div>,
}));

describe('LanguageModulesPage', () => {
    const mockLanguages = [
        { language: 'Spanish', course_count: 5 },
        { language: 'French', course_count: 3 },
        { language: 'German', course_count: 2 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn();
    });

    it('should render loading state', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
        });

        render(<LanguageModulesPage />);

        expect(screen.getByText('Loading language modules...')).toBeInTheDocument();
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('should render language modules list', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: mockLanguages,
            isLoading: false,
            error: null,
        });

        render(<LanguageModulesPage />);

        expect(screen.getByText('Language Modules')).toBeInTheDocument();
        expect(screen.getByText('Spanish')).toBeInTheDocument();
        expect(screen.getByText('French')).toBeInTheDocument();
        expect(screen.getByText('German')).toBeInTheDocument();
    });

    it('should display course counts', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: mockLanguages,
            isLoading: false,
            error: null,
        });

        render(<LanguageModulesPage />);

        expect(screen.getByText('5 Courses Available')).toBeInTheDocument();
        expect(screen.getByText('3 Courses Available')).toBeInTheDocument();
        expect(screen.getByText('2 Courses Available')).toBeInTheDocument();
    });

    it('should display singular course text when count is 1', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: [{ language: 'Italian', course_count: 1 }],
            isLoading: false,
            error: null,
        });

        render(<LanguageModulesPage />);

        expect(screen.getByText('1 Course Available')).toBeInTheDocument();
    });

    it('should navigate to language courses when card clicked', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: mockLanguages,
            isLoading: false,
            error: null,
        });

        render(<LanguageModulesPage />);

        const spanishCard = screen.getByText('Spanish').closest('div[class*="cursor-pointer"]');
        fireEvent.click(spanishCard);

        expect(mockNavigate).toHaveBeenCalledWith('/language-modules/Spanish');
    });

    it('should navigate to dashboard when back button clicked', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: mockLanguages,
            isLoading: false,
            error: null,
        });

        render(<LanguageModulesPage />);

        const backButton = screen.getByText('Back to Dashboard');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should display empty state when no languages available', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        });

        render(<LanguageModulesPage />);

        expect(screen.getByText('No modules found')).toBeInTheDocument();
        expect(screen.getByText('Check back soon for new instructor-led courses.')).toBeInTheDocument();
    });

    it('should display error message', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: [],
            isLoading: false,
            error: { message: 'Failed to load', status: 500 },
        });

        render(<LanguageModulesPage />);

        expect(screen.getByText('Unable to load languages')).toBeInTheDocument();
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
        expect(screen.getByText('Code: 500')).toBeInTheDocument();
    });

    it('should log error to console when error occurs', () => {
        const error = { message: 'Test error' };
        mockUsePublishedLanguages.mockReturnValue({
            data: [],
            isLoading: false,
            error,
        });

        render(<LanguageModulesPage />);

        expect(console.error).toHaveBeenCalledWith('Error loading published languages:', error);
    });
});
