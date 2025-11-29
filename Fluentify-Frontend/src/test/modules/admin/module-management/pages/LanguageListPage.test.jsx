/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import LanguageListPage from '../../../../../modules/admin/module-management/pages/LanguageListPage';
import { useModuleManagement } from '../../../../../hooks/useModuleManagement';

// Mock dependencies
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

jest.mock('../../../../../hooks/useModuleManagement', () => ({
    useModuleManagement: jest.fn(),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Globe: () => <div data-testid="globe-icon">Globe</div>,
    ChevronRight: () => <div data-testid="chevron-right-icon">ChevronRight</div>,
    Loader2: () => <div data-testid="loader-icon">Loader</div>,
}));

describe('LanguageListPage', () => {
    const mockNavigate = jest.fn();
    const mockFetchLanguages = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
        mockFetchLanguages.mockResolvedValue([]);

        useModuleManagement.mockReturnValue({
            languages: [],
            loading: false,
            error: null,
            fetchLanguages: mockFetchLanguages,
        });
    });

    it('should render loading state', () => {
        useModuleManagement.mockReturnValue({
            languages: [],
            loading: true,
            error: null,
            fetchLanguages: mockFetchLanguages,
        });

        render(<LanguageListPage />);
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('should render error state and retry', () => {
        useModuleManagement.mockReturnValue({
            languages: [],
            loading: false,
            error: 'Failed to fetch',
            fetchLanguages: mockFetchLanguages,
        });

        render(<LanguageListPage />);
        expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();

        const retryButton = screen.getByText('Try Again');
        fireEvent.click(retryButton);
        expect(mockFetchLanguages).toHaveBeenCalled();
    });

    it('should render empty state', () => {
        render(<LanguageListPage />);
        expect(screen.getByText('No languages found. Create your first course to get started.')).toBeInTheDocument();

        const createButton = screen.getByText('Create First Course');
        fireEvent.click(createButton);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/modules/course/new');
    });

    it('should render languages list', () => {
        const mockLanguages = [
            { language: 'French', course_count: '5' },
            { language: 'Spanish', course_count: '1' },
        ];

        useModuleManagement.mockReturnValue({
            languages: mockLanguages,
            loading: false,
            error: null,
            fetchLanguages: mockFetchLanguages,
        });

        render(<LanguageListPage />);

        expect(screen.getByText('French')).toBeInTheDocument();
        expect(screen.getByText('5 courses')).toBeInTheDocument();
        expect(screen.getByText('Spanish')).toBeInTheDocument();
        expect(screen.getByText('1 course')).toBeInTheDocument();
    });

    it('should navigate to language details on click', () => {
        const mockLanguages = [{ language: 'French', course_count: '5' }];
        useModuleManagement.mockReturnValue({
            languages: mockLanguages,
            loading: false,
            error: null,
            fetchLanguages: mockFetchLanguages,
        });

        render(<LanguageListPage />);

        const languageCard = screen.getByText('French').closest('button');
        fireEvent.click(languageCard);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/modules/French');
    });

    it('should show "Create New Course" button in header when languages exist', () => {
        const mockLanguages = [{ language: 'French', course_count: '5' }];
        useModuleManagement.mockReturnValue({
            languages: mockLanguages,
            loading: false,
            error: null,
            fetchLanguages: mockFetchLanguages,
        });

        render(<LanguageListPage />);

        const createButton = screen.getByText('Create New Course');
        fireEvent.click(createButton);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/modules/course/new');
    });

    it('should fetch languages on mount', () => {
        render(<LanguageListPage />);
        expect(mockFetchLanguages).toHaveBeenCalled();
    });

    it('should log error if fetchLanguages fails', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        const mockFetchWithError = jest.fn().mockRejectedValue(new Error('Fetch failed'));

        useModuleManagement.mockReturnValue({
            languages: [],
            loading: false,
            error: null,
            fetchLanguages: mockFetchWithError,
        });

        render(<LanguageListPage />);

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to load languages:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });
    it('should not fetch languages on re-render', () => {
        const { rerender } = render(<LanguageListPage />);
        expect(mockFetchLanguages).toHaveBeenCalledTimes(1);

        rerender(<LanguageListPage />);
        expect(mockFetchLanguages).toHaveBeenCalledTimes(1);
    });
});
