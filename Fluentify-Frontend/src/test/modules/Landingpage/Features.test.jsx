/** @jest-environment jsdom */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Features } from '../../../modules/Landingpage/features';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Lightbulb: () => <span data-testid="icon-lightbulb">Lightbulb</span>,
    TrendingUp: () => <span data-testid="icon-trending-up">TrendingUp</span>,
    Headphones: () => <span data-testid="icon-headphones">Headphones</span>,
    Brain: () => <span data-testid="icon-brain">Brain</span>,
    Trophy: () => <span data-testid="icon-trophy">Trophy</span>,
}));

describe('Features', () => {
    it('renders section title and description', () => {
        render(<Features />);

        expect(screen.getByText(/Everything You Need to/i)).toBeInTheDocument();
        expect(screen.getByText(/Master/i)).toBeInTheDocument();
        expect(screen.getByText(/a Language/i)).toBeInTheDocument();
        expect(screen.getByText('Experience a revolutionary approach to language learning with cutting-edge AI technology')).toBeInTheDocument();
    });

    it('renders all feature cards', () => {
        render(<Features />);

        const featureTitles = [
            'Smart AI Instructors',
            'Track Progress',
            'Immersive Practice',
            'Adaptive Learning',
            'Achievement System'
        ];

        featureTitles.forEach(title => {
            expect(screen.getByText(title)).toBeInTheDocument();
        });
    });
});
