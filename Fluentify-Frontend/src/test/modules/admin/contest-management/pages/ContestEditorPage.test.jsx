/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock dependencies
const mockNavigate = jest.fn();
const mockCreateMutateAsync = jest.fn();
const mockUpdateMutateAsync = jest.fn();
const mockAddQuestionMutateAsync = jest.fn();
const mockPublishMutateAsync = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../../../hooks/useContest', () => ({
    useAdminContestDetails: jest.fn(),
    useCreateContest: jest.fn(() => ({
        mutateAsync: mockCreateMutateAsync,
        isPending: false,
    })),
    useUpdateContest: jest.fn(() => ({
        mutateAsync: mockUpdateMutateAsync,
        isPending: false,
    })),
    useAddQuestion: jest.fn(() => ({
        mutateAsync: mockAddQuestionMutateAsync,
        isLoading: false,
    })),
    usePublishContest: jest.fn(() => ({
        mutateAsync: mockPublishMutateAsync,
        isLoading: false,
    })),
}));

jest.mock('../../../../../components', () => ({
    Button: ({ children, onClick, icon, className, loading, disabled }) => (
        <button onClick={onClick} className={className} disabled={disabled || loading}>
            {loading ? 'Loading...' : children}
        </button>
    ),
}));

jest.mock('lucide-react', () => ({
    ArrowLeft: () => <span>ArrowLeft</span>,
    Save: () => <span>Save</span>,
    Plus: () => <span>Plus</span>,
    Trash2: () => <span>Trash2</span>,
    Send: () => <span>Send</span>,
}));

import ContestEditorPage, { toInputLocal, toISTOffsetIso } from '../../../../../modules/admin/contest-management/pages/ContestEditorPage';
import { useAdminContestDetails } from '../../../../../hooks/useContest';

describe('ContestEditorPage Utility Functions', () => {
    describe('toInputLocal', () => {
        it('converts ISO string to local datetime format', () => {
            const isoString = '2024-01-15T10:30:00Z';
            const result = toInputLocal(isoString);
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
        });

        it('handles invalid date string', () => {
            const result = toInputLocal('invalid-date');
            // toInputLocal doesn't validate the input, it just formats it
            // Invalid dates produce "NaN" values
            expect(result).toContain('NaN');
        });
    });

    describe('toISTOffsetIso', () => {
        it('converts local datetime to IST offset format', () => {
            const localStr = '2024-01-15T14:30';
            const result = toISTOffsetIso(localStr);
            expect(result).toBe('2024-01-15T14:30:00+05:30');
        });

        it('handles empty string', () => {
            const result = toISTOffsetIso('');
            expect(result).toBe('');
        });
    });
});

describe('ContestEditorPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock window.confirm
        global.confirm = jest.fn(() => true);
        global.alert = jest.fn();
    });

    afterEach(() => {
        delete global.confirm;
        delete global.alert;
    });

    describe('Create Mode', () => {
        beforeEach(() => {
            useAdminContestDetails.mockReturnValue({
                data: null,
                isLoading: false,
                isError: false,
            });
        });

        it('renders create mode header', () => {
            render(
                <MemoryRouter initialEntries={['/admin/contests/new']}>
                    <Routes>
                        <Route path="/admin/contests/new" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText('Create New Contest')).toBeInTheDocument();
            expect(screen.getByText('Fill in contest details to get your next challenge ready.')).toBeInTheDocument();
        });

        it('renders contest form fields', () => {
            render(
                <MemoryRouter initialEntries={['/admin/contests/new']}>
                    <Routes>
                        <Route path="/admin/contests/new" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByPlaceholderText(/e.g., Weekly Spanish Challenge/)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/Brief description/)).toBeInTheDocument();
            // Date time inputs don't have placeholders, check by type attribute
            const dateInputs = screen.getAllByDisplayValue('');
            expect(dateInputs.length).toBeGreaterThan(0);
        });

        it('validates required fields', () => {
            render(
                <MemoryRouter initialEntries={['/admin/contests/new']}>
                    <Routes>
                        <Route path="/admin/contests/new" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const createButton = screen.getByText('Create Contest');
            fireEvent.click(createButton);

            expect(screen.getByText('Title is required')).toBeInTheDocument();
            expect(screen.getByText('Start time is required')).toBeInTheDocument();
            expect(screen.getByText('End time is required')).toBeInTheDocument();
        });

        it('validates end time after start time', () => {
            render(
                <MemoryRouter initialEntries={['/admin/contests/new']}>
                    <Routes>
                        <Route path="/admin/contests/new" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const titleInput = screen.getByPlaceholderText(/e.g., Weekly Spanish Challenge/);
            const inputs = screen.getAllByDisplayValue('');
            const startTimeInput = inputs.find(el => el.type === 'datetime-local');
            const endTimeInput = inputs.filter(el => el.type === 'datetime-local')[1];

            fireEvent.change(titleInput, { target: { value: 'Test Contest' } });
            fireEvent.change(startTimeInput, { target: { value: '2024-01-20T10:00' } });
            fireEvent.change(endTimeInput, { target: { value: '2024-01-15T10:00' } });

            const createButton = screen.getByText('Create Contest');
            fireEvent.click(createButton);

            expect(screen.getByText('End time must be after start time')).toBeInTheDocument();
        });

        it('creates contest successfully', async () => {
            mockCreateMutateAsync.mockResolvedValue({ id: '123' });

            render(
                <MemoryRouter initialEntries={['/admin/contests/new']}>
                    <Routes>
                        <Route path="/admin/contests/new" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const titleInput = screen.getByPlaceholderText(/e.g., Weekly Spanish Challenge/);
            const descInput = screen.getByPlaceholderText(/Brief description/);
            const inputs = screen.getAllByDisplayValue('');
            const startTimeInput = inputs.find(el => el.type === 'datetime-local');
            const endTimeInput = inputs.filter(el => el.type === 'datetime-local')[1];

            fireEvent.change(titleInput, { target: { value: 'Spanish Weekly Challenge' } });
            fireEvent.change(descInput, { target: { value: 'Test your Spanish skills' } });
            fireEvent.change(startTimeInput, { target: { value: '2024-01-15T10:00' } });
            fireEvent.change(endTimeInput, { target: { value: '2024-01-20T18:00' } });

            const createButton = screen.getByText('Create Contest');
            fireEvent.click(createButton);

            await waitFor(() => {
                expect(mockCreateMutateAsync).toHaveBeenCalledWith({
                    title: 'Spanish Weekly Challenge',
                    description: 'Test your Spanish skills',
                    start_time: '2024-01-15T10:00:00+05:30',
                    end_time: '2024-01-20T18:00:00+05:30',
                });
            });

            expect(mockNavigate).toHaveBeenCalledWith('/admin/contests');
        });

        it('handles create error', async () => {
            mockCreateMutateAsync.mockRejectedValue(new Error('Failed to create'));

            render(
                <MemoryRouter initialEntries={['/admin/contests/new']}>
                    <Routes>
                        <Route path="/admin/contests/new" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const titleInput = screen.getByPlaceholderText(/e.g., Weekly Spanish Challenge/);
            const inputs = screen.getAllByDisplayValue('');
            const startTimeInput = inputs.find(el => el.type === 'datetime-local');
            const endTimeInput = inputs.filter(el => el.type === 'datetime-local')[1];

            fireEvent.change(titleInput, { target: { value: 'Test Contest' } });
            fireEvent.change(startTimeInput, { target: { value: '2024-01-15T10:00' } });
            fireEvent.change(endTimeInput, { target: { value: '2024-01-20T18:00' } });

            const createButton = screen.getByText('Create Contest');
            fireEvent.click(createButton);

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Failed to create'));
            });
        });

        it('does not show questions section before contest is created', () => {
            render(
                <MemoryRouter initialEntries={['/admin/contests/new']}>
                    <Routes>
                        <Route path="/admin/contests/new" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.queryByText('Add New Question')).not.toBeInTheDocument();
            expect(screen.queryByText('Publish Contest')).not.toBeInTheDocument();
        });
    });

    describe('Edit Mode', () => {
        const mockContestData = {
            id: '123',
            title: 'Existing Contest',
            description: 'Test description',
            language: 'Spanish',
            start_time: '2024-01-15T10:00:00+05:30',
            end_time: '2024-01-20T18:00:00+05:30',
            questions: [
                {
                    id: 1,
                    question_text: 'What is "hello" in Spanish?',
                    options: ['Hola', 'Adiós', 'Gracias', 'Por favor'],
                    correct_option_id: 0,
                },
            ],
        };

        beforeEach(() => {
            useAdminContestDetails.mockReturnValue({
                data: mockContestData,
                isLoading: false,
                isError: false,
            });
        });

        it('renders edit mode header', () => {
            render(
                <MemoryRouter initialEntries={['/admin/contests/123/edit']}>
                    <Routes>
                        <Route path="/admin/contests/:contestId/edit" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText('Edit Contest')).toBeInTheDocument();
        });

        it('loads existing contest data', () => {
            render(
                <MemoryRouter initialEntries={['/admin/contests/123/edit']}>
                    <Routes>
                        <Route path="/admin/contests/:contestId/edit" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const titleInput = screen.getByPlaceholderText(/e.g., Weekly Spanish Challenge/);
            const descInput = screen.getByPlaceholderText(/Brief description/);

            expect(titleInput.value).toBe('Existing Contest');
            expect(descInput.value).toBe('Test description');
        });

        it('displays existing questions', () => {
            render(
                <MemoryRouter initialEntries={['/admin/contests/123/edit']}>
                    <Routes>
                        <Route path="/admin/contests/:contestId/edit" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText(/What is "hello" in Spanish\?/)).toBeInTheDocument();
            expect(screen.getByText(/Hola/)).toBeInTheDocument();
        });

        it('updates contest successfully', async () => {
            mockUpdateMutateAsync.mockResolvedValue({});

            render(
                <MemoryRouter initialEntries={['/admin/contests/123/edit']}>
                    <Routes>
                        <Route path="/admin/contests/:contestId/edit" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const titleInput = screen.getByPlaceholderText(/e.g., Weekly Spanish Challenge/);
            fireEvent.change(titleInput, { target: { value: 'Updated Contest Title' } });

            const saveButton = screen.getByText('Save Changes');
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(mockUpdateMutateAsync).toHaveBeenCalled();
            });

            expect(global.alert).toHaveBeenCalledWith('Contest updated successfully!');
        });

        it('validates question before adding', () => {
            render(
                <MemoryRouter initialEntries={['/admin/contests/123/edit']}>
                    <Routes>
                        <Route path="/admin/contests/:contestId/edit" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const addButton = screen.getByText('Add Question');
            fireEvent.click(addButton);

            expect(global.alert).toHaveBeenCalledWith('Question text is required');
        });

        it('adds question successfully', async () => {
            mockAddQuestionMutateAsync.mockResolvedValue({});

            render(
                <MemoryRouter initialEntries={['/admin/contests/123/edit']}>
                    <Routes>
                        <Route path="/admin/contests/:contestId/edit" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const questionTextarea = screen.getByPlaceholderText('Enter your question here...');
            fireEvent.change(questionTextarea, { target: { value: 'What is goodbye in Spanish?' } });

            const optionInputs = screen.getAllByPlaceholderText(/Option/);
            fireEvent.change(optionInputs[0], { target: { value: 'Adiós' } });
            fireEvent.change(optionInputs[1], { target: { value: 'Hola' } });

            const addButton = screen.getByText('Add Question');
            fireEvent.click(addButton);

            await waitFor(() => {
                expect(mockAddQuestionMutateAsync).toHaveBeenCalled();
            });
        });

        it('removes question from list', () => {
            render(
                <MemoryRouter initialEntries={['/admin/contests/123/edit']}>
                    <Routes>
                        <Route path="/admin/contests/:contestId/edit" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const removeButton = screen.getByLabelText('Remove question 1');
            fireEvent.click(removeButton);

            expect(screen.queryByText(/What is "hello" in Spanish\?/)).not.toBeInTheDocument();
        });

        it('publishes contest with confirmation', async () => {
            mockPublishMutateAsync.mockResolvedValue({});

            render(
                <MemoryRouter initialEntries={['/admin/contests/123/edit']}>
                    <Routes>
                        <Route path="/admin/contests/:contestId/edit" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const publishButton = screen.getByText('Publish Contest');
            fireEvent.click(publishButton);

            await waitFor(() => {
                expect(global.confirm).toHaveBeenCalled();
            });

            expect(mockPublishMutateAsync).toHaveBeenCalledWith('123');
            expect(global.alert).toHaveBeenCalledWith('Contest published successfully!');
            expect(mockNavigate).toHaveBeenCalledWith('/admin/contests');
        });

        it('does not publish if user cancels confirmation', () => {
            global.confirm = jest.fn(() => false);

            render(
                <MemoryRouter initialEntries={['/admin/contests/123/edit']}>
                    <Routes>
                        <Route path="/admin/contests/:contestId/edit" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const publishButton = screen.getByText('Publish Contest');
            fireEvent.click(publishButton);

            expect(mockPublishMutateAsync).not.toHaveBeenCalled();
        });
    });

    describe('Loading State', () => {
        it('shows loading spinner', () => {
            useAdminContestDetails.mockReturnValue({
                data: null,
                isLoading: true,
                isError: false,
            });

            render(
                <MemoryRouter initialEntries={['/admin/contests/123/edit']}>
                    <Routes>
                        <Route path="/admin/contests/:contestId/edit" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText('Loading contest...')).toBeInTheDocument();
        });
    });

    describe('Error State', () => {
        beforeEach(() => {
            // Suppress expected console.error
            jest.spyOn(console, 'error').mockImplementation(() => { });
        });

        afterEach(() => {
            console.error.mockRestore();
        });

        it('shows error message when contest fails to load', () => {
            useAdminContestDetails.mockReturnValue({
                data: null,
                isLoading: false,
                isError: true,
                error: new Error('Failed to fetch'),
            });

            render(
                <MemoryRouter initialEntries={['/admin/contests/123/edit']}>
                    <Routes>
                        <Route path="/admin/contests/:contestId/edit" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText('Unable to load contest')).toBeInTheDocument();
            expect(screen.getByText('Please go back to the list and try again.')).toBeInTheDocument();
        });

        it('navigates back on error', () => {
            useAdminContestDetails.mockReturnValue({
                data: null,
                isLoading: false,
                isError: true,
                error: new Error('Failed to fetch'),
            });

            render(
                <MemoryRouter initialEntries={['/admin/contests/123/edit']}>
                    <Routes>
                        <Route path="/admin/contests/:contestId/edit" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const backButton = screen.getByText('Back to Contests');
            fireEvent.click(backButton);

            expect(mockNavigate).toHaveBeenCalledWith('/admin/contests');
        });
    });

    describe('Navigation', () => {
        it('navigates back to contests list', () => {
            useAdminContestDetails.mockReturnValue({
                data: null,
                isLoading: false,
                isError: false,
            });

            render(
                <MemoryRouter initialEntries={['/admin/contests/new']}>
                    <Routes>
                        <Route path="/admin/contests/new" element={<ContestEditorPage />} />
                    </Routes>
                </MemoryRouter>
            );

            const backButtons = screen.getAllByRole('button');
            const backButton = backButtons.find(btn => btn.querySelector('span')?.textContent === 'ArrowLeft');
            fireEvent.click(backButton);

            expect(mockNavigate).toHaveBeenCalledWith('/admin/contests');
        });
    });
});
