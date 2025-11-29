/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import LessonForm from '../../../../../modules/admin/module-management/components/LessonForm.jsx';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Upload: () => <div data-testid="upload-icon">Upload</div>,
    FileText: () => <div data-testid="filetext-icon">FileText</div>,
    Video: () => <div data-testid="video-icon">Video</div>,
    Headphones: () => <div data-testid="headphones-icon">Headphones</div>,
    X: () => <div data-testid="x-icon">X</div>,
}));

describe('LessonForm', () => {
    const mockOnChange = jest.fn();
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();

    const defaultProps = {
        lessonData: {
            title: '',
            content_type: '',
            description: '',
            xp_reward: 0,
            key_phrases: [],
            vocabulary: {},
        },
        onChange: mockOnChange,
        onSubmit: mockOnSubmit,
        onCancel: mockOnCancel,
        loading: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the form with all required fields', () => {
        render(<LessonForm {...defaultProps} />);

        expect(screen.getByPlaceholderText(/e.g., Pronouncing Vowels/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: '' })).toBeInTheDocument(); // Select doesn't have an accessible name linked
        expect(screen.getByPlaceholderText(/Describe what students will learn.../i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('10')).toBeInTheDocument();
    });

    it('should call onChange when title is changed', () => {
        render(<LessonForm {...defaultProps} />);

        const titleInput = screen.getByPlaceholderText(/e.g., Pronouncing Vowels/i);
        fireEvent.change(titleInput, { target: { value: 'New Lesson' } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            title: 'New Lesson',
        }));
    });

    it('should call onChange when content type is selected', () => {
        render(<LessonForm {...defaultProps} />);

        // Select by display value or finding the select element
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'video' } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            content_type: 'video',
        }));
    });

    it('should show PDF upload field when content type is pdf', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, content_type: 'pdf' },
        };

        const { container } = render(<LessonForm {...props} />);

        expect(screen.getByText(/Upload PDF Document/i)).toBeInTheDocument();
        expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    });

    it('should handle invalid XP reward number input', () => {
        render(<LessonForm {...defaultProps} />);

        const xpInput = screen.getByPlaceholderText('10');
        fireEvent.change(xpInput, { target: { value: 'abc', name: 'xp_reward' } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            xp_reward: 0,
        }));
    });

    it('should show quiz message when content type is quiz', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, content_type: 'quiz' },
        };

        render(<LessonForm {...props} />);

        // Use exact match to avoid matching description text
        expect(screen.getAllByText('Quiz Questions')[0]).toBeInTheDocument();
    });

    it('should render with default loading prop (false)', () => {
        const { loading, ...propsWithoutLoading } = defaultProps;
        render(<LessonForm {...propsWithoutLoading} />);

        const titleInput = screen.getByPlaceholderText(/e.g., Pronouncing Vowels/i);
        expect(titleInput).not.toBeDisabled();
    });

    it('should render correctly with empty key phrases', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, key_phrases: [] },
        };

        render(<LessonForm {...props} />);
        // Should not render any key phrase tags
        expect(screen.queryByText('×')).not.toBeInTheDocument();
    });

    it('should render correctly with undefined key phrases', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, key_phrases: undefined },
        };

        render(<LessonForm {...props} />);
        expect(screen.queryByText('×')).not.toBeInTheDocument();
    });

    it('should render correctly with empty vocabulary', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, vocabulary: {} },
        };

        render(<LessonForm {...props} />);
        // Find the label specifically to avoid ambiguity with select option
        const vocabLabel = screen.getAllByText('Vocabulary').find(el => el.tagName === 'LABEL');
        const vocabSection = vocabLabel.closest('div');
        expect(vocabSection.querySelectorAll('button.text-red-600').length).toBe(0);
    });

    it('should render correctly with undefined vocabulary', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, vocabulary: undefined },
        };

        render(<LessonForm {...props} />);
        const vocabLabel = screen.getAllByText('Vocabulary').find(el => el.tagName === 'LABEL');
        const vocabSection = vocabLabel.closest('div');
        expect(vocabSection.querySelectorAll('button.text-red-600').length).toBe(0);
    });

    it('should show video fields when content type is video', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, content_type: 'video' },
        };

        render(<LessonForm {...props} />);

        expect(screen.getByText(/Video Source/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/https:\/\/www.youtube.com\/watch\?v=.../i)).toBeInTheDocument();
    });

    it('should handle video file upload and removal', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, content_type: 'video' },
        };

        const { container } = render(<LessonForm {...props} />);

        // Upload video file
        const file = new File(['dummy content'], 'test.mp4', { type: 'video/mp4' });
        const fileInput = container.querySelector('input[type="file"]');
        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            file_name: 'test.mp4',
            file_type: 'video/mp4',
        }));

        // Simulate state update (since we mock onChange, the component won't update automatically unless we rerender or mock state)
        // But the component uses local state `selectedFile` for the file display.
        // Let's verify the remove button appears.
        expect(screen.getByText('test.mp4')).toBeInTheDocument();

        // Click remove
        const removeButton = screen.getByTestId('x-icon').closest('button');
        fireEvent.click(removeButton);

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            file_name: null,
        }));
    });

    it('should handle audio file upload and removal', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, content_type: 'audio' },
        };

        const { container } = render(<LessonForm {...props} />);

        // Upload audio file
        const file = new File(['dummy content'], 'test.mp3', { type: 'audio/mp3' });
        const fileInput = container.querySelector('input[type="file"]');
        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            file_name: 'test.mp3',
            file_type: 'audio/mp3',
        }));

        // Verify remove button appears
        expect(screen.getByText('test.mp3')).toBeInTheDocument();

        // Click remove
        const removeButton = screen.getByTestId('x-icon').closest('button');
        fireEvent.click(removeButton);

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            file_name: null,
        }));
    });

    it('should show audio fields when content type is audio', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, content_type: 'audio' },
        };

        render(<LessonForm {...props} />);

        expect(screen.getByText('Upload Audio File')).toBeInTheDocument();
    });

    it('should remove file when X button is clicked', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, content_type: 'pdf' },
        };

        const { container } = render(<LessonForm {...props} />);

        // Upload file first
        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const fileInput = container.querySelector('input[type="file"]');
        fireEvent.change(fileInput, { target: { files: [file] } });

        // Find remove button (it has the X icon)
        const removeButton = screen.getByTestId('x-icon').closest('button');
        fireEvent.click(removeButton);

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            file_name: null,
            file_size: null,
            file_type: null,
            media_url: ''
        }));
    });

    it('should handle XP reward number input', () => {
        render(<LessonForm {...defaultProps} />);

        const xpInput = screen.getByPlaceholderText('10');
        fireEvent.change(xpInput, { target: { value: '50' } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            xp_reward: 50,
        }));
    });

    it('should add key phrase when Add button is clicked', () => {
        render(<LessonForm {...defaultProps} />);

        const keyPhraseInput = screen.getByPlaceholderText(/Add a key phrase/i);
        const addButton = screen.getAllByText('Add')[0];

        fireEvent.change(keyPhraseInput, { target: { value: 'Hello' } });
        fireEvent.click(addButton);

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            key_phrases: ['Hello'],
        }));
    });

    it('should handle 0 XP reward input', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, xp_reward: 10 }
        };
        render(<LessonForm {...props} />);

        const xpInput = screen.getByPlaceholderText('10');

        fireEvent.change(xpInput, { target: { value: '0', name: 'xp_reward' } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            xp_reward: 0,
        }));
    });

    it('should not add whitespace-only key phrase', () => {
        render(<LessonForm {...defaultProps} />);

        const keyPhraseInput = screen.getByPlaceholderText(/Add a key phrase/i);
        const addButton = screen.getAllByText('Add')[0];

        fireEvent.change(keyPhraseInput, { target: { value: '   ' } });
        fireEvent.click(addButton);

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should add key phrase when key_phrases is undefined', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, key_phrases: undefined },
        };
        render(<LessonForm {...props} />);

        const keyPhraseInput = screen.getByPlaceholderText(/Add a key phrase/i);
        const addButton = screen.getAllByText('Add')[0];

        fireEvent.change(keyPhraseInput, { target: { value: 'New Phrase' } });
        fireEvent.click(addButton);

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            key_phrases: ['New Phrase'],
        }));
    });

    it('should not add empty key phrase', () => {
        render(<LessonForm {...defaultProps} />);

        const addButton = screen.getAllByText('Add')[0];
        fireEvent.click(addButton);

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should remove key phrase when × is clicked', () => {
        const props = {
            ...defaultProps,
            lessonData: {
                ...defaultProps.lessonData,
                key_phrases: ['Hello', 'Goodbye'],
            },
        };

        render(<LessonForm {...props} />);

        const removeButtons = screen.getAllByText('×');
        fireEvent.click(removeButtons[0]);

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            key_phrases: ['Goodbye'],
        }));
    });

    it('should add vocabulary when both key and value are provided', () => {
        render(<LessonForm {...defaultProps} />);

        const keyInput = screen.getByPlaceholderText(/English word/i);
        const valueInput = screen.getByPlaceholderText(/Translation/i);
        const addButton = screen.getAllByText('Add')[1];

        fireEvent.change(keyInput, { target: { value: 'hello' } });
        fireEvent.change(valueInput, { target: { value: 'hola' } });
        fireEvent.click(addButton);

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            vocabulary: { hello: 'hola' },
        }));
    });

    it('should not add vocabulary if key or value is missing', () => {
        render(<LessonForm {...defaultProps} />);

        const addButton = screen.getAllByText('Add')[1];
        fireEvent.click(addButton);

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should not add vocabulary if only key is provided', () => {
        render(<LessonForm {...defaultProps} />);

        const keyInput = screen.getByPlaceholderText(/English word/i);
        const addButton = screen.getAllByText('Add')[1];

        fireEvent.change(keyInput, { target: { value: 'hello' } });
        fireEvent.click(addButton);

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should not add vocabulary if only value is provided', () => {
        render(<LessonForm {...defaultProps} />);

        const valueInput = screen.getByPlaceholderText(/Translation/i);
        const addButton = screen.getAllByText('Add')[1];

        fireEvent.change(valueInput, { target: { value: 'hola' } });
        fireEvent.click(addButton);

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should not add whitespace-only vocabulary', () => {
        render(<LessonForm {...defaultProps} />);

        const keyInput = screen.getByPlaceholderText(/English word/i);
        const valueInput = screen.getByPlaceholderText(/Translation/i);
        const addButton = screen.getAllByText('Add')[1];

        fireEvent.change(keyInput, { target: { value: '   ' } });
        fireEvent.change(valueInput, { target: { value: '   ' } });
        fireEvent.click(addButton);

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should remove vocabulary when × is clicked', () => {
        const props = {
            ...defaultProps,
            lessonData: {
                ...defaultProps.lessonData,
                vocabulary: { hello: 'hola', goodbye: 'adios' },
            },
        };

        render(<LessonForm {...props} />);

        const removeButtons = screen.getAllByText('×');
        fireEvent.click(removeButtons[removeButtons.length - 1]);

        expect(mockOnChange).toHaveBeenCalled();
    });

    it('should call onSubmit when form is submitted', () => {
        render(<LessonForm {...defaultProps} />);

        const form = screen.getByRole('button', { name: /Save Lesson/i }).closest('form');
        fireEvent.submit(form);

        expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should call onCancel when Cancel button is clicked', () => {
        render(<LessonForm {...defaultProps} />);

        const cancelButton = screen.getByRole('button', { name: /Cancel/i });
        fireEvent.click(cancelButton);

        expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should disable inputs when loading is true', () => {
        const props = { ...defaultProps, loading: true };
        render(<LessonForm {...props} />);

        const titleInput = screen.getByPlaceholderText(/e.g., Pronouncing Vowels/i);
        expect(titleInput).toBeDisabled();
    });

    it('should show "Saving..." text when loading', () => {
        const props = { ...defaultProps, loading: true };
        render(<LessonForm {...props} />);

        expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    it('should handle file upload', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, content_type: 'pdf' },
        };

        const { container } = render(<LessonForm {...props} />);

        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        // Find input by type file since label association is broken
        const fileInput = container.querySelector('input[type="file"]');

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            file_name: 'test.pdf',
            file_type: 'application/pdf',
        }));
    });

    it('should add key phrase on Enter key press', () => {
        render(<LessonForm {...defaultProps} />);

        const keyPhraseInput = screen.getByPlaceholderText(/Add a key phrase/i);

        fireEvent.change(keyPhraseInput, { target: { value: 'Test Phrase' } });
        fireEvent.keyPress(keyPhraseInput, { key: 'Enter', code: 'Enter', charCode: 13 });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            key_phrases: ['Test Phrase'],
        }));
    });

    it('should add vocabulary on Enter key press', () => {
        render(<LessonForm {...defaultProps} />);

        const keyInput = screen.getByPlaceholderText(/English word/i);
        const valueInput = screen.getByPlaceholderText(/Translation/i);

        fireEvent.change(keyInput, { target: { value: 'test' } });
        fireEvent.change(valueInput, { target: { value: 'prueba' } });
        fireEvent.keyPress(valueInput, { key: 'Enter', code: 'Enter', charCode: 13 });

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            vocabulary: { test: 'prueba' },
        }));
    });
    it('should add vocabulary when vocabulary is undefined', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, vocabulary: undefined },
        };
        render(<LessonForm {...props} />);

        const keyInput = screen.getByPlaceholderText(/English word/i);
        const valueInput = screen.getByPlaceholderText(/Translation/i);
        const addButton = screen.getAllByText('Add')[1];

        fireEvent.change(keyInput, { target: { value: 'new' } });
        fireEvent.change(valueInput, { target: { value: 'nuevo' } });
        fireEvent.click(addButton);

        expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
            vocabulary: { new: 'nuevo' },
        }));
    });

    it('should handle file change with no file selected', () => {
        const props = {
            ...defaultProps,
            lessonData: { ...defaultProps.lessonData, content_type: 'pdf' },
        };
        const { container } = render(<LessonForm {...props} />);
        const fileInput = container.querySelector('input[type="file"]');

        fireEvent.change(fileInput, { target: { files: [] } });

        expect(mockOnChange).not.toHaveBeenCalled();
    });
});
