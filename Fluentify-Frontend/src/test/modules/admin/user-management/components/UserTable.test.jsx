/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserTable from '../../../../../modules/admin/user-management/components/UserTable';

describe('UserTable', () => {
    const mockLearners = [
        {
            id: '1',
            name: 'User One',
            email: 'user1@example.com',
            created_at: '2023-01-01T00:00:00.000Z',
            last_activity_date: '2023-01-02T00:00:00.000Z'
        },
        {
            id: '2',
            name: 'User Two',
            email: 'user2@example.com',
            created_at: '2023-02-01T00:00:00.000Z',
            last_activity_date: null
        }
    ];
    const mockOnRowClick = jest.fn();
    const mockOnPageChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render loading state', () => {
        render(<UserTable loading={true} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render empty state', () => {
        render(<UserTable learners={[]} loading={false} />);
        expect(screen.getByText('No learners found')).toBeInTheDocument();
    });

    it('should render user list', () => {
        render(<UserTable learners={mockLearners} />);

        expect(screen.getByText('User One')).toBeInTheDocument();
        expect(screen.getByText('user1@example.com')).toBeInTheDocument();
        expect(screen.getByText('User Two')).toBeInTheDocument();
        expect(screen.getByText('user2@example.com')).toBeInTheDocument();

        // Check for formatted dates (partial match is enough)
        expect(screen.getAllByText(/2023/).length).toBeGreaterThan(0);

        // Check for null last activity
        expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should call onRowClick when a row is clicked', () => {
        render(<UserTable learners={mockLearners} onRowClick={mockOnRowClick} />);

        const userOneRow = screen.getByText('User One').closest('tr');
        fireEvent.click(userOneRow);

        expect(mockOnRowClick).toHaveBeenCalledWith(mockLearners[0]);
    });

    it('should render pagination controls correctly', () => {
        render(
            <UserTable
                learners={mockLearners}
                total={100}
                page={2}
                pageSize={20}
                onPageChange={mockOnPageChange}
            />
        );

        expect(screen.getByText('Total: 100')).toBeInTheDocument();
        expect(screen.getByText('Page 2')).toBeInTheDocument();

        const prevButton = screen.getByText('Prev');
        const nextButton = screen.getByText('Next');

        expect(prevButton).not.toBeDisabled();
        expect(nextButton).not.toBeDisabled();

        fireEvent.click(prevButton);
        expect(mockOnPageChange).toHaveBeenCalledWith(1);

        fireEvent.click(nextButton);
        expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it('should disable Prev button on first page', () => {
        render(
            <UserTable
                learners={mockLearners}
                total={100}
                page={1}
                pageSize={20}
            />
        );

        expect(screen.getByText('Prev')).toBeDisabled();
    });

    it('should disable Next button on last page', () => {
        render(
            <UserTable
                learners={mockLearners}
                total={40}
                page={2}
                pageSize={20}
            />
        );

        expect(screen.getByText('Next')).toBeDisabled();
    });
});
