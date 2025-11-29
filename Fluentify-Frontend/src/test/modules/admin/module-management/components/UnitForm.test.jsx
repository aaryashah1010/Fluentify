/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import UnitForm from '../../../../../modules/admin/module-management/components/UnitForm.jsx';

describe('UnitForm', () => {
    const mockOnChange = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    const defaultProps = {
        unitData: {
            title: '',
            description: '',
            difficulty: 'Beginner',
            estimated_time: '',
        },
        onChange: mockOnChange,
        onSubmit: mockOnSubmit,
        onCancel: mockOnCancel,
        loading: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render with default props', () => {
        // Render without loading prop to test default parameter
        const { loading, ...propsWithoutLoading } = defaultProps;
        render(<UnitForm {...propsWithoutLoading} />);
        expect(screen.getByRole('button', { name: /Save Unit/i })).not.toBeDisabled();
    });

    it('should render the form with all required fields', () => {
        render(<UnitForm {...defaultProps} />);

        expect(screen.getByPlaceholderText(/e.g., Unit 1: The Absolute Basics/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Describe what this unit covers.../i)).toBeInTheDocument();
        // Difficulty select doesn't have a unique placeholder, find by role
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('30')).toBeInTheDocument();
    });

    it('should call onChange when title is changed', () => {
        render(<UnitForm {...defaultProps} />);

        const titleInput = screen.getByPlaceholderText(/e.g., Unit 1: The Absolute Basics/i);
        fireEvent.change(titleInput, { target: { value: 'Unit 1' } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Unit 1',
        }));
    });

    it('should call onChange when description is changed', () => {
        render(<UnitForm {...defaultProps} />);

        const descInput = screen.getByPlaceholderText(/Describe what this unit covers.../i);
        fireEvent.change(descInput, { target: { value: 'Test description' } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            description: 'Test description',
        }));
    });

    it('should call onChange when difficulty is changed', () => {
        render(<UnitForm {...defaultProps} />);

        const difficultySelect = screen.getByRole('combobox');
        fireEvent.change(difficultySelect, { target: { value: 'Advanced' } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            difficulty: 'Advanced',
        }));
    });

    it('should call onChange when estimated time is changed', () => {
        render(<UnitForm {...defaultProps} />);

        const timeInput = screen.getByPlaceholderText('30');
        fireEvent.change(timeInput, { target: { value: '30' } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            estimated_time: '30',
        }));
    });

    it('should call onSubmit when form is submitted', () => {
        render(<UnitForm {...defaultProps} />);

        const form = screen.getByRole('button', { name: /Save Unit/i }).closest('form');
        fireEvent.submit(form);

        expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should call onCancel when Cancel button is clicked', () => {
        render(<UnitForm {...defaultProps} />);

        const cancelButton = screen.getByRole('button', { name: /Cancel/i });
        fireEvent.click(cancelButton);

        expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should disable inputs when loading is true', () => {
        const props = { ...defaultProps, loading: true };
        render(<UnitForm {...props} />);

        const titleInput = screen.getByPlaceholderText(/e.g., Unit 1: The Absolute Basics/i);
        expect(titleInput).toBeDisabled();
    });

    it('should show "Saving..." text when loading', () => {
        const props = { ...defaultProps, loading: true };
        render(<UnitForm {...props} />);

        expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('should display all difficulty options', () => {
        render(<UnitForm {...defaultProps} />);

        const difficultySelect = screen.getByRole('combobox');

        expect(difficultySelect).toContainHTML('<option value="Beginner">Beginner</option>');
        expect(difficultySelect).toContainHTML('<option value="Intermediate">Intermediate</option>');
        expect(difficultySelect).toContainHTML('<option value="Advanced">Advanced</option>');
    });

    it('should use default difficulty value of Beginner', () => {
        const props = {
            ...defaultProps,
            unitData: { ...defaultProps.unitData, difficulty: undefined },
        };

        render(<UnitForm {...props} />);

        const difficultySelect = screen.getByRole('combobox');
        expect(difficultySelect.value).toBe('Beginner');
    });

    it('should display provided unit data', () => {
        const props = {
            ...defaultProps,
            unitData: {
                title: 'Test Unit',
                description: 'Test Description',
                difficulty: 'Intermediate',
                estimated_time: 45,
            },
        };

        render(<UnitForm {...props} />);

        expect(screen.getByPlaceholderText(/e.g., Unit 1: The Absolute Basics/i).value).toBe('Test Unit');
        expect(screen.getByPlaceholderText(/Describe what this unit covers.../i).value).toBe('Test Description');
        expect(screen.getByRole('combobox').value).toBe('Intermediate');
        expect(screen.getByPlaceholderText('30').value).toBe('45');
    });

    it('should handle empty estimated_time', () => {
        const props = {
            ...defaultProps,
            unitData: { ...defaultProps.unitData, estimated_time: null },
        };

        render(<UnitForm {...props} />);

        const timeInput = screen.getByPlaceholderText('30');
        expect(timeInput.value).toBe('');
    });

    it('should require title field', () => {
        render(<UnitForm {...defaultProps} />);

        const titleInput = screen.getByPlaceholderText(/e.g., Unit 1: The Absolute Basics/i);
        expect(titleInput).toBeRequired();
    });

    it('should not require description field', () => {
        render(<UnitForm {...defaultProps} />);

        const descInput = screen.getByPlaceholderText(/Describe what this unit covers.../i);
        expect(descInput).not.toBeRequired();
    });
});
