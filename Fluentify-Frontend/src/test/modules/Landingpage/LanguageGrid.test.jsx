/** @jest-environment jsdom */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { LanguageGrid } from '../../../modules/Landingpage/LanguageGrid';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Globe: () => <span data-testid="icon-globe">Globe</span>,
}));

describe('LanguageGrid', () => {
    it('renders section title and description', () => {
        render(<LanguageGrid />);

        expect(screen.getByText(/Choose Your/i)).toBeInTheDocument();
        expect(screen.getByText('Language')).toBeInTheDocument();
        expect(screen.getByText(/Start with a language module that matches your goals/i)).toBeInTheDocument();
    });

    it('renders all language cards', () => {
        render(<LanguageGrid />);

        const languages = [
            'Spanish',
            'French',
            'German',
            'Japanese',
            'Hindi',
            'Italian'
        ];

        languages.forEach(language => {
            expect(screen.getByText(language)).toBeInTheDocument();
        });
    });

    it('renders globe icon', () => {
        render(<LanguageGrid />);
        expect(screen.getByTestId('icon-globe')).toBeInTheDocument();
    });
});
