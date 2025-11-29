/** @jest-environment jsdom */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Hero } from '../../../modules/Landingpage/hero';

// Mock Button component
jest.mock('../../../components/Button', () => {
    return ({ children, onClick, ...props }) => (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    );
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ArrowRight: () => <span data-testid="arrow-right">ArrowRight</span>,
}));

describe('Hero', () => {
    const mockOnNavigate = jest.fn();

    beforeEach(() => {
        mockOnNavigate.mockClear();
    });

    it('renders hero text content', () => {
        render(<Hero onNavigate={mockOnNavigate} />);

        expect(screen.getByText('Start Your Journey,')).toBeInTheDocument();
        expect(screen.getByText('Unlock')).toBeInTheDocument();
        expect(screen.getByText('Your Voice')).toBeInTheDocument();
        expect(screen.getByText('Master any language with AI-powered personalized instruction')).toBeInTheDocument();
    });

    it('renders Start Learning button', () => {
        render(<Hero onNavigate={mockOnNavigate} />);

        expect(screen.getByText('Start Learning')).toBeInTheDocument();
        expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
    });

    it('calls onNavigate with "signup" when Start Learning button is clicked', () => {
        render(<Hero onNavigate={mockOnNavigate} />);

        fireEvent.click(screen.getByText('Start Learning'));
        expect(mockOnNavigate).toHaveBeenCalledWith('signup');
    });
});
