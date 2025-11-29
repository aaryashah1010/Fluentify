/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserSearchBar } from '../../../../../modules/admin/user-management/components/UserSearchBar';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Search: () => <span data-testid="search-icon">Search</span>,
    X: () => <span data-testid="x-icon">X</span>,
}));

describe('UserSearchBar', () => {
    const mockOnSearch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render search input', () => {
        render(<UserSearchBar onSearch={mockOnSearch} />);

        expect(screen.getByPlaceholderText('Search users by name or email...')).toBeInTheDocument();
        expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });

    it('should update input value when typing', () => {
        render(<UserSearchBar onSearch={mockOnSearch} />);

        const input = screen.getByPlaceholderText('Search users by name or email...');
        fireEvent.change(input, { target: { value: 'test query' } });

        expect(input.value).toBe('test query');
    });

    it('should call onSearch when form is submitted', () => {
        render(<UserSearchBar onSearch={mockOnSearch} />);

        const input = screen.getByPlaceholderText('Search users by name or email...');
        fireEvent.change(input, { target: { value: 'test query' } });

        const form = input.closest('form');
        fireEvent.submit(form);

        expect(mockOnSearch).toHaveBeenCalledWith('test query');
    });

    it('should show clear button only when there is input', () => {
        render(<UserSearchBar onSearch={mockOnSearch} />);

        const input = screen.getByPlaceholderText('Search users by name or email...');

        // Initially no clear button
        expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();

        // Type something
        fireEvent.change(input, { target: { value: 'test' } });
        expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('should clear input and call onSearch with empty string when clear button is clicked', () => {
        render(<UserSearchBar onSearch={mockOnSearch} />);

        const input = screen.getByPlaceholderText('Search users by name or email...');
        fireEvent.change(input, { target: { value: 'test' } });

        const clearButton = screen.getByRole('button'); // The X icon is inside a button
        fireEvent.click(clearButton);

        expect(input.value).toBe('');
        expect(mockOnSearch).toHaveBeenCalledWith('');
    });
});
