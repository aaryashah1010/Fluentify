/** @jest-environment jsdom */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HowItWorks } from '../../../modules/Landingpage/HowItWorks';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    UserPlus: () => <span data-testid="icon-user-plus">UserPlus</span>,
    Target: () => <span data-testid="icon-target">Target</span>,
    MessageSquare: () => <span data-testid="icon-message-square">MessageSquare</span>,
    Sparkles: () => <span data-testid="icon-sparkles">Sparkles</span>,
}));

describe('HowItWorks', () => {
    it('renders section title and description', () => {
        render(<HowItWorks />);

        expect(screen.getByText(/Your Journey to/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Fluency/i)[0]).toBeInTheDocument();
        expect(screen.getByText('A simple, proven process to master any language in months, not years')).toBeInTheDocument();
    });

    it('renders all steps', () => {
        render(<HowItWorks />);

        const steps = [
            'Create Your Profile',
            'Get Personalized Plan',
            'Start Practicing',
            'Achieve Fluency'
        ];

        steps.forEach(step => {
            expect(screen.getByText(step)).toBeInTheDocument();
        });

        expect(screen.getByText('01')).toBeInTheDocument();
        expect(screen.getByText('02')).toBeInTheDocument();
        expect(screen.getByText('03')).toBeInTheDocument();
        expect(screen.getByText('04')).toBeInTheDocument();
    });
});
