/** @jest-environment jsdom */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../../../modules/Landingpage/header';

// Mock Button component
jest.mock('../../../components/Button', () => {
    return ({ children, onClick, ...props }) => (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    );
});

// Mock image
jest.mock('../../../assets/fluentify_logo.jpg', () => 'logo-url');

describe('Header', () => {
    const mockOnNavigate = jest.fn();

    beforeEach(() => {
        mockOnNavigate.mockClear();
    });

    it('renders logo and navigation links', () => {
        render(<Header onNavigate={mockOnNavigate} />);

        // Check logo
        const logo = screen.getByAltText('Fluentify');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', 'logo-url');

        // Check navigation links
        expect(screen.getByText('Features')).toBeInTheDocument();
        expect(screen.getByText('How It Works')).toBeInTheDocument();
        expect(screen.getByText('Languages')).toBeInTheDocument();
    });

    it('renders Log In and Get Started buttons', () => {
        render(<Header onNavigate={mockOnNavigate} />);

        expect(screen.getByText('Log In')).toBeInTheDocument();
        expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('calls onNavigate with "login" when Log In button is clicked', () => {
        render(<Header onNavigate={mockOnNavigate} />);

        fireEvent.click(screen.getByText('Log In'));
        expect(mockOnNavigate).toHaveBeenCalledWith('login');
    });

    it('calls onNavigate with "signup" when Get Started button is clicked', () => {
        render(<Header onNavigate={mockOnNavigate} />);

        fireEvent.click(screen.getByText('Get Started'));
        expect(mockOnNavigate).toHaveBeenCalledWith('signup');
    });
});
