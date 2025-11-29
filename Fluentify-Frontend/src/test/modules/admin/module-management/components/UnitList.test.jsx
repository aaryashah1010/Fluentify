/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import UnitList from '../../../../../modules/admin/module-management/components/UnitList.jsx';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Plus: () => <div data-testid="plus-icon">Plus</div>,
    Edit: () => <div data-testid="edit-icon">Edit</div>,
    Trash2: () => <div data-testid="trash-icon">Trash</div>,
    ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
    ChevronRight: () => <div data-testid="chevron-right-icon">ChevronRight</div>,
}));

// Mock LessonList component
jest.mock('../../../../../modules/admin/module-management/components/LessonList.jsx', () => {
    return function MockLessonList({ lessons, onAddLesson, onEditLesson, onDeleteLesson }) {
        return (
            <div data-testid="lesson-list">
                <div>Lessons: {lessons.length}</div>
                <button onClick={onAddLesson}>Add Lesson Mock</button>
            </div>
        );
    };
});

describe('UnitList', () => {
    const mockOnAddUnit = jest.fn();
    const mockOnEditUnit = jest.fn();
    const mockOnDeleteUnit = jest.fn();
    const mockOnAddLesson = jest.fn();
    const mockOnEditLesson = jest.fn();
    const mockOnDeleteLesson = jest.fn();

    const defaultProps = {
        units: [],
        onAddUnit: mockOnAddUnit,
        onEditUnit: mockOnEditUnit,
        onDeleteUnit: mockOnDeleteUnit,
        onAddLesson: mockOnAddLesson,
        onEditLesson: mockOnEditLesson,
        onDeleteLesson: mockOnDeleteLesson,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render empty state with default props', () => {
        render(<UnitList />);
        expect(screen.getByText(/No units yet/i)).toBeInTheDocument();
    });

    it('should render empty state when no units', () => {
        render(<UnitList {...defaultProps} />);

        expect(screen.getByText(/No units yet/i)).toBeInTheDocument();
        expect(screen.getByText(/Add First Unit/i)).toBeInTheDocument();
    });

    it('should call onAddUnit when Add First Unit button is clicked', () => {
        render(<UnitList {...defaultProps} />);

        const addButton = screen.getByText(/Add First Unit/i);
        fireEvent.click(addButton);

        expect(mockOnAddUnit).toHaveBeenCalled();
    });

    it('should render units when provided', () => {
        const units = [
            {
                id: 1,
                title: 'Unit 1',
                description: 'First unit',
                difficulty: 'Beginner',
                estimated_time: 30,
                lessons: [],
            },
            {
                id: 2,
                title: 'Unit 2',
                difficulty: 'Intermediate',
                estimated_time: 45,
                lessons: [],
            },
        ];

        const props = { ...defaultProps, units };
        render(<UnitList {...props} />);

        expect(screen.getByText(/Unit 1: Unit 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Unit 2: Unit 2/i)).toBeInTheDocument();
        expect(screen.getByText(/First unit/i)).toBeInTheDocument();
    });

    it('should show Add Unit button when units exist', () => {
        const units = [{ id: 1, title: 'Test', difficulty: 'Beginner', lessons: [] }];
        const props = { ...defaultProps, units };

        render(<UnitList {...props} />);

        expect(screen.getByText(/Add Unit/i)).toBeInTheDocument();
    });

    it('should call onEditUnit when edit button is clicked', () => {
        const unit = { id: 1, title: 'Test Unit', difficulty: 'Beginner', lessons: [] };
        const props = { ...defaultProps, units: [unit] };

        render(<UnitList {...props} />);

        const editButtons = screen.getAllByTestId('edit-icon');
        fireEvent.click(editButtons[0].parentElement);

        expect(mockOnEditUnit).toHaveBeenCalledWith(unit);
    });

    it('should call onDeleteUnit when delete button is clicked', () => {
        const unit = { id: 1, title: 'Test Unit', difficulty: 'Beginner', lessons: [] };
        const props = { ...defaultProps, units: [unit] };

        render(<UnitList {...props} />);

        const deleteButtons = screen.getAllByTestId('trash-icon');
        fireEvent.click(deleteButtons[0].parentElement);

        expect(mockOnDeleteUnit).toHaveBeenCalledWith(1);
    });

    it('should toggle unit expansion when clicked', () => {
        const unit = { id: 1, title: 'Test', difficulty: 'Beginner', lessons: [] };
        const props = { ...defaultProps, units: [unit] };

        render(<UnitList {...props} />);

        // Initially collapsed (ChevronRight)
        expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('lesson-list')).not.toBeInTheDocument();

        // Click to expand
        const toggleButton = screen.getByText(/Unit 1: Test/i).closest('button');
        fireEvent.click(toggleButton);

        // Now expanded (ChevronDown and LessonList visible)
        expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
        expect(screen.getByTestId('lesson-list')).toBeInTheDocument();
    });

    it('should display unit difficulty', () => {
        const units = [{ id: 1, title: 'Test', difficulty: 'Advanced', lessons: [] }];
        const props = { ...defaultProps, units };

        render(<UnitList {...props} />);

        expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    it('should display estimated time', () => {
        const units = [{ id: 1, title: 'Test', difficulty: 'Beginner', estimated_time: 60, lessons: [] }];
        const props = { ...defaultProps, units };

        render(<UnitList {...props} />);

        expect(screen.getByText('60 min')).toBeInTheDocument();
    });

    it('should display 0 min when estimated_time is not provided', () => {
        const units = [{ id: 1, title: 'Test', difficulty: 'Beginner', lessons: [] }];
        const props = { ...defaultProps, units };

        render(<UnitList {...props} />);

        expect(screen.getByText('0 min')).toBeInTheDocument();
    });

    it('should display lesson count', () => {
        const units = [{
            id: 1,
            title: 'Test',
            difficulty: 'Beginner',
            lessons: [
                { id: 1, title: 'Lesson 1' },
                { id: 2, title: 'Lesson 2' },
            ],
        }];
        const props = { ...defaultProps, units };

        render(<UnitList {...props} />);

        expect(screen.getByText('2 lessons')).toBeInTheDocument();
    });

    it('should display 0 lessons when no lessons', () => {
        const units = [{ id: 1, title: 'Test', difficulty: 'Beginner', lessons: [] }];
        const props = { ...defaultProps, units };

        render(<UnitList {...props} />);

        expect(screen.getByText('0 lessons')).toBeInTheDocument();
    });

    it('should handle unit with undefined lessons', () => {
        const unit = { id: 1, title: 'Test', difficulty: 'Beginner', lessons: undefined };
        const props = { ...defaultProps, units: [unit] };

        render(<UnitList {...props} />);

        expect(screen.getByText('0 lessons')).toBeInTheDocument();

        // Expand to trigger LessonList rendering with undefined lessons (which defaults to [])
        const toggleButton = screen.getByText(/Unit 1: Test/i).closest('button');
        fireEvent.click(toggleButton);

        // MockLessonList renders "Lessons: {lessons.length}"
        expect(screen.getByText('Lessons: 0')).toBeInTheDocument();
    });

    it('should not display description if not provided', () => {
        const units = [{ id: 1, title: 'Test', difficulty: 'Beginner', lessons: [] }];
        const props = { ...defaultProps, units };

        render(<UnitList {...props} />);

        const unitCard = screen.getByText(/Unit 1: Test/i).closest('div');
        expect(unitCard.textContent).not.toContain('description');
    });

    it('should pass correct props to LessonList when expanded', () => {
        const lessons = [{ id: 1, title: 'Lesson 1' }];
        const unit = { id: 1, title: 'Test', difficulty: 'Beginner', lessons };
        const props = { ...defaultProps, units: [unit] };

        render(<UnitList {...props} />);

        // Expand the unit
        const toggleButton = screen.getByText(/Unit 1: Test/i).closest('button');
        fireEvent.click(toggleButton);

        // LessonList should be rendered with correct lesson count
        expect(screen.getByText('Lessons: 1')).toBeInTheDocument();
    });

    it('should call onAddLesson with unit id when add lesson is triggered', () => {
        const unit = { id: 5, title: 'Test', difficulty: 'Beginner', lessons: [] };
        const props = { ...defaultProps, units: [unit] };

        render(<UnitList {...props} />);

        // Expand the unit
        const toggleButton = screen.getByText(/Unit 1: Test/i).closest('button');
        fireEvent.click(toggleButton);

        // Click the mocked add lesson button
        const addLessonButton = screen.getByText('Add Lesson Mock');
        fireEvent.click(addLessonButton);

        expect(mockOnAddLesson).toHaveBeenCalledWith(5);
    });

    it('should collapse unit when clicked again', () => {
        const unit = { id: 1, title: 'Test', difficulty: 'Beginner', lessons: [] };
        const props = { ...defaultProps, units: [unit] };

        render(<UnitList {...props} />);

        const toggleButton = screen.getByText(/Unit 1: Test/i).closest('button');

        // Expand
        fireEvent.click(toggleButton);
        expect(screen.getByTestId('lesson-list')).toBeInTheDocument();

        // Collapse
        fireEvent.click(toggleButton);
        expect(screen.queryByTestId('lesson-list')).not.toBeInTheDocument();
    });
});
