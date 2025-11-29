/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserCard } from '../../../../../modules/admin/user-management/components/UserCard';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Mail: () => <span data-testid="mail-icon">Mail</span>,
    Calendar: () => <span data-testid="calendar-icon">Calendar</span>,
}));

describe('UserCard', () => {
    const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        created_at: '2023-01-01T00:00:00.000Z'
    };
    const mockOnClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render user information correctly', () => {
        render(<UserCard user={mockUser} onClick={mockOnClick} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        // Date formatting depends on locale, but checking for "Joined" and year is usually safe
        expect(screen.getByText(/Joined/)).toBeInTheDocument();
        expect(screen.getByText(/2023/)).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
        const { container } = render(<UserCard user={mockUser} onClick={mockOnClick} />);

        // The outer div has the onClick handler
        const card = container.firstChild;
        fireEvent.click(card);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should render icons', () => {
        render(<UserCard user={mockUser} onClick={mockOnClick} />);

        expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
        expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    });
});
