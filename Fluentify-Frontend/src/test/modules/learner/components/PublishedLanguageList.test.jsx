/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PublishedLanguageList from '../../../../modules/learner/components/PublishedLanguageList';

// Mock dependencies
const mockNavigate = jest.fn();
const mockUsePublishedLanguages = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../../hooks/useCourses', () => ({
    usePublishedLanguages: () => mockUsePublishedLanguages(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
    Globe: () => <div data-testid="globe-icon">Globe</div>,
    Loader2: () => <div data-testid="loader-icon">Loader2</div>,
    ChevronRight: () => <div data-testid="chevron-right-icon">ChevronRight</div>,
}));

describe('PublishedLanguageList', () => {
    const mockLanguages = [
        { language: 'Spanish', course_count: 5 },
        { language: 'French', course_count: 1 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render loading state', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
        });

        render(<PublishedLanguageList />);

        expect(screen.getByText('Loading language modules...')).toBeInTheDocument();
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('should render error state', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: [],
            isLoading: false,
            error: { message: 'Failed to fetch' },
        });

        render(<PublishedLanguageList />);

        expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('should render list of languages', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: mockLanguages,
            isLoading: false,
            error: null,
        });

        render(<PublishedLanguageList />);

        expect(screen.getByText('Language Modules')).toBeInTheDocument();
        expect(screen.getByText('Spanish')).toBeInTheDocument();
        expect(screen.getByText('5 courses available')).toBeInTheDocument();
        expect(screen.getByText('French')).toBeInTheDocument();
        expect(screen.getByText('1 course available')).toBeInTheDocument();
    });

    it('should render empty state when no languages found', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        });

        render(<PublishedLanguageList />);

        expect(screen.getByText('No language modules available yet')).toBeInTheDocument();
        expect(screen.getByText('Check back soon for new instructor-led modules.')).toBeInTheDocument();
    });

    it('should navigate back when back button clicked', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        });

        render(<PublishedLanguageList />);

        const backButton = screen.getByTestId('arrow-left-icon').closest('button');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should navigate to language courses when language card clicked', () => {
        mockUsePublishedLanguages.mockReturnValue({
            data: mockLanguages,
            isLoading: false,
            error: null,
        });

        render(<PublishedLanguageList />);

        const languageCard = screen.getByText('Spanish').closest('button');
        fireEvent.click(languageCard);

        expect(mockNavigate).toHaveBeenCalledWith('/learner/modules/Spanish');
    });
});
