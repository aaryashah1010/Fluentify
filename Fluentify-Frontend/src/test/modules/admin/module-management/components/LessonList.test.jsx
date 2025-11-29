/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import LessonList from '../../../../../modules/admin/module-management/components/LessonList.jsx';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Plus: () => <div data-testid="plus-icon">Plus</div>,
    Edit: () => <div data-testid="edit-icon">Edit</div>,
    Trash2: () => <div data-testid="trash-icon">Trash</div>,
    BookOpen: () => <div data-testid="bookopen-icon">BookOpen</div>,
    Video: () => <div data-testid="video-icon">Video</div>,
    Headphones: () => <div data-testid="headphones-icon">Headphones</div>,
    FileText: () => <div data-testid="filetext-icon">FileText</div>,
    MessageSquare: () => <div data-testid="messagesquare-icon">MessageSquare</div>,
}));

describe('LessonList', () => {
    const mockOnAddLesson = jest.fn();
    const mockOnEditLesson = jest.fn();
    const mockOnDeleteLesson = jest.fn();

    const defaultProps = {
        lessons: [],
        onAddLesson: mockOnAddLesson,
        onEditLesson: mockOnEditLesson,
        onDeleteLesson: mockOnDeleteLesson,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render empty state when no lessons (default props)', () => {
        render(<LessonList />); // No props provided

        expect(screen.getByText(/No lessons yet/i)).toBeInTheDocument();
    });

    it('should render empty state when no lessons', () => {
        render(<LessonList {...defaultProps} />);

        expect(screen.getByText(/No lessons yet/i)).toBeInTheDocument();
        expect(screen.getByText(/Add First Lesson/i)).toBeInTheDocument();
    });

    it('should call onAddLesson when Add First Lesson button is clicked', () => {
        render(<LessonList {...defaultProps} />);

        const addButton = screen.getByText(/Add First Lesson/i);
        fireEvent.click(addButton);

        expect(mockOnAddLesson).toHaveBeenCalled();
    });

    it('should render lessons when provided', () => {
        const lessons = [
            {
                id: 1,
                title: 'Lesson 1',
                description: 'First lesson',
                content_type: 'video',
                xp_reward: 10,
                key_phrases: ['hello', 'world'],
            },
            {
                id: 2,
                title: 'Lesson 2',
                content_type: 'reading',
                xp_reward: 0,
            },
        ];

        const props = { ...defaultProps, lessons };
        render(<LessonList {...props} />);

        expect(screen.getByText(/Lesson 1: Lesson 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Lesson 2: Lesson 2/i)).toBeInTheDocument();
        expect(screen.getByText(/First lesson/i)).toBeInTheDocument();
    });

    it('should show Add Lesson button when lessons exist', () => {
        const lessons = [{ id: 1, title: 'Test', content_type: 'video' }];
        const props = { ...defaultProps, lessons };

        render(<LessonList {...props} />);

        expect(screen.getByText(/Add Lesson/i)).toBeInTheDocument();
    });

    it('should call onEditLesson when edit button is clicked', () => {
        const lesson = { id: 1, title: 'Test Lesson', content_type: 'video' };
        const props = { ...defaultProps, lessons: [lesson] };

        render(<LessonList {...props} />);

        const editButtons = screen.getAllByTestId('edit-icon');
        fireEvent.click(editButtons[0].parentElement);

        expect(mockOnEditLesson).toHaveBeenCalledWith(lesson);
    });

    it('should call onDeleteLesson when delete button is clicked', () => {
        const lesson = { id: 1, title: 'Test Lesson', content_type: 'video' };
        const props = { ...defaultProps, lessons: [lesson] };

        render(<LessonList {...props} />);

        const deleteButtons = screen.getAllByTestId('trash-icon');
        fireEvent.click(deleteButtons[0].parentElement);

        expect(mockOnDeleteLesson).toHaveBeenCalledWith(1);
    });

    it('should display XP reward when greater than 0', () => {
        const lessons = [{ id: 1, title: 'Test', content_type: 'video', xp_reward: 25 }];
        const props = { ...defaultProps, lessons };

        render(<LessonList {...props} />);

        expect(screen.getByText('+25 XP')).toBeInTheDocument();
    });

    it('should not display XP reward when 0', () => {
        const lessons = [{ id: 1, title: 'Test', content_type: 'video', xp_reward: 0 }];
        const props = { ...defaultProps, lessons };

        render(<LessonList {...props} />);

        expect(screen.queryByText(/XP/i)).not.toBeInTheDocument();
    });

    it('should display key phrases count', () => {
        const lessons = [{
            id: 1,
            title: 'Test',
            content_type: 'video',
            key_phrases: ['a', 'b', 'c']
        }];
        const props = { ...defaultProps, lessons };

        render(<LessonList {...props} />);

        expect(screen.getByText('3 phrases')).toBeInTheDocument();
    });

    it('should display correct icon for video content type', () => {
        const lessons = [{ id: 1, title: 'Test', content_type: 'video' }];
        const props = { ...defaultProps, lessons };

        render(<LessonList {...props} />);

        expect(screen.getByTestId('video-icon')).toBeInTheDocument();
    });

    it('should display correct icon for listening content type', () => {
        const lessons = [{ id: 1, title: 'Test', content_type: 'listening' }];
        const props = { ...defaultProps, lessons };

        render(<LessonList {...props} />);

        expect(screen.getByTestId('headphones-icon')).toBeInTheDocument();
    });

    it('should display correct icon for reading content type', () => {
        const lessons = [{ id: 1, title: 'Test', content_type: 'reading' }];
        const props = { ...defaultProps, lessons };

        render(<LessonList {...props} />);

        expect(screen.getByTestId('filetext-icon')).toBeInTheDocument();
    });

    it('should display correct icon for conversation content type', () => {
        const lessons = [{ id: 1, title: 'Test', content_type: 'conversation' }];
        const props = { ...defaultProps, lessons };

        render(<LessonList {...props} />);

        expect(screen.getByTestId('messagesquare-icon')).toBeInTheDocument();
    });

    it('should display default icon for unknown content type', () => {
        const lessons = [{ id: 1, title: 'Test', content_type: 'unknown' }];
        const props = { ...defaultProps, lessons };

        render(<LessonList {...props} />);

        expect(screen.getByTestId('bookopen-icon')).toBeInTheDocument();
    });

    it('should display content type as capitalized text', () => {
        const lessons = [{ id: 1, title: 'Test', content_type: 'video' }];
        const props = { ...defaultProps, lessons };

        render(<LessonList {...props} />);

        expect(screen.getByText('video')).toBeInTheDocument();
    });

    it('should not display description if not provided', () => {
        const lessons = [{ id: 1, title: 'Test', content_type: 'video' }];
        const props = { ...defaultProps, lessons };

        render(<LessonList {...props} />);

        const lessonCard = screen.getByText(/Lesson 1: Test/i).closest('div');
        expect(lessonCard.querySelector('.line-clamp-2')).not.toBeInTheDocument();
    });
});
