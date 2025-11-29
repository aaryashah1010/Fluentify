/** @jest-environment jsdom */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { CTASection } from '../../../modules/Landingpage/CTASection';

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
    Sparkles: () => <span data-testid="sparkles">Sparkles</span>,
}));

describe('CTASection', () => {
    const mockOnNavigate = jest.fn();

    beforeEach(() => {
        mockOnNavigate.mockClear();
    });

    it('renders CTA text content', () => {
        render(<CTASection onNavigate={mockOnNavigate} />);

        expect(screen.getByText(/Ready to Start Your/i)).toBeInTheDocument();
        expect(screen.getByText('Language Journey?')).toBeInTheDocument();
        expect(screen.getByText('Create your account today and take the first step towards fluency.')).toBeInTheDocument();
    });

    it('renders Start Learning button', () => {
        render(<CTASection onNavigate={mockOnNavigate} />);

        expect(screen.getByText('Start Learning')).toBeInTheDocument();
        expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
    });

    it('calls onNavigate with "signup" when Start Learning button is clicked', () => {
        render(<CTASection onNavigate={mockOnNavigate} />);

        fireEvent.click(screen.getByText('Start Learning'));
        expect(mockOnNavigate).toHaveBeenCalledWith('signup');
    });
});
