/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomDropdown from '../../../../modules/learner/components/CustomDropdown';

// Mock ReactCountryFlag
jest.mock('react-country-flag', () => {
    return function MockFlag({ countryCode }) {
        return <div data-testid={`flag-${countryCode}`}>Flag: {countryCode}</div>;
    };
});

describe('CustomDropdown', () => {
    const mockOnChange = jest.fn();
    const stringOptions = ['Option 1', 'Option 2', 'Option 3'];
    const objectOptions = [
        { name: 'USA', code: 'US' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with placeholder when no value selected', () => {
        render(
            <CustomDropdown
                options={stringOptions}
                value=""
                onChange={mockOnChange}
                placeholder="Select an option"
            />
        );

        expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('should render selected string value', () => {
        render(
            <CustomDropdown
                options={stringOptions}
                value="Option 1"
                onChange={mockOnChange}
                placeholder="Select an option"
            />
        );

        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should open dropdown when clicked', () => {
        render(
            <CustomDropdown
                options={stringOptions}
                value=""
                onChange={mockOnChange}
                placeholder="Select an option"
            />
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should call onChange when option is selected', () => {
        render(
            <CustomDropdown
                options={stringOptions}
                value=""
                onChange={mockOnChange}
                placeholder="Select an option"
            />
        );

        // Open dropdown
        fireEvent.click(screen.getByRole('button'));

        // Select option
        fireEvent.click(screen.getByText('Option 2'));

        expect(mockOnChange).toHaveBeenCalledWith('Option 2');
    });

    it('should close dropdown after selection', () => {
        render(
            <CustomDropdown
                options={stringOptions}
                value=""
                onChange={mockOnChange}
                placeholder="Select an option"
            />
        );

        // Open dropdown
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Option 1')).toBeInTheDocument();

        // Select option
        fireEvent.click(screen.getByText('Option 2'));

        // Dropdown should be closed (options not visible)
        // Note: In RTL, elements might still be in DOM but hidden, or removed. 
        // Based on the code `open && (...)`, they are removed.
        expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
    });

    it('should render object options correctly', () => {
        render(
            <CustomDropdown
                options={objectOptions}
                value="France"
                onChange={mockOnChange}
                placeholder="Select Country"
            />
        );

        expect(screen.getByText('France')).toBeInTheDocument();
    });

    it('should render flags when showFlags is true', () => {
        render(
            <CustomDropdown
                options={objectOptions}
                value="France"
                onChange={mockOnChange}
                placeholder="Select Country"
                showFlags={true}
            />
        );

        expect(screen.getByTestId('flag-FR')).toBeInTheDocument();
    });

    it('should render flags in dropdown menu', () => {
        render(
            <CustomDropdown
                options={objectOptions}
                value=""
                onChange={mockOnChange}
                placeholder="Select Country"
                showFlags={true}
            />
        );

        // Open dropdown
        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByTestId('flag-US')).toBeInTheDocument();
        expect(screen.getByTestId('flag-FR')).toBeInTheDocument();
        expect(screen.getByTestId('flag-DE')).toBeInTheDocument();
    });

    it('should close dropdown when clicking outside', () => {
        render(
            <CustomDropdown
                options={stringOptions}
                value=""
                onChange={mockOnChange}
                placeholder="Select an option"
            />
        );

        // Open dropdown
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Option 1')).toBeInTheDocument();

        // Click overlay (simulating outside click)
        // The overlay is a div with fixed inset-0
        // We can find it by class or just assume it's the first div after the button when open
        // Or we can just click on the document body if the overlay was attached there, 
        // but here it is a sibling div.
        // Let's find the overlay by its click handler behavior or class
        const overlay = screen.getByRole('button').nextSibling;
        fireEvent.click(overlay);

        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
});
