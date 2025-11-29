/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
const mockNavigate = jest.fn();
const mockDeleteMutateAsync = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../../../hooks/useContest', () => ({
    useAdminContests: jest.fn(),
    useDeleteContest: jest.fn(() => ({
        mutateAsync: mockDeleteMutateAsync,
        isLoading: false,
    })),
}));

jest.mock('../../../../../components', () => ({
    Button: ({ children, onClick, icon, className }) => (
        <button onClick={onClick} className={className}>
            {icon}
            {children}
        </button>
    ),
}));

jest.mock('lucide-react', () => ({
    Plus: () => <span>Plus</span>,
    Trophy: () => <span>Trophy</span>,
    Calendar: () => <span>Calendar</span>,
    Users: () => <span>Users</span>,
    Edit: () => <span>Edit</span>,
    Trash2: () => <span>Trash2</span>,
    Eye: () => <span>Eye</span>,
    ArrowLeft: () => <span>ArrowLeft</span>,
}));

import ContestListPage from '../../../../../modules/admin/contest-management/pages/ContestListPage';
import { useAdminContests } from '../../../../../hooks/useContest';

describe('ContestListPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state', () => {
        useAdminContests.mockReturnValue({
            data: [],
            isLoading: true,
        });

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        // Should show skeleton loaders
        const skeletons = screen.getAllByRole('generic').filter(el =>
            el.className.includes('animate-pulse')
        );
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders empty state when no contests', () => {
        useAdminContests.mockReturnValue({
            data: [],
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        expect(screen.getByText('No Contests Yet')).toBeInTheDocument();
        expect(screen.getByText('Create your first contest to get started.')).toBeInTheDocument();
        expect(screen.getByText('Create Your First Contest')).toBeInTheDocument();
    });

    it('renders contests list', () => {
        const mockContests = [
            {
                id: '1',
                title: 'Spanish Weekly Challenge',
                description: 'Test your Spanish skills',
                status: 'PUBLISHED',
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-07T10:00:00Z',
                participant_count: 15,
                question_count: 10,
            },
            {
                id: '2',
                title: 'French Grammar Quiz',
                description: 'Master French grammar',
                status: 'DRAFT',
                start_time: '2024-02-01T10:00:00Z',
                end_time: '2024-02-07T10:00:00Z',
                participant_count: 0,
                question_count: 5,
            },
        ];

        useAdminContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Spanish Weekly Challenge')).toBeInTheDocument();
        expect(screen.getByText('French Grammar Quiz')).toBeInTheDocument();
        expect(screen.getByText('Test your Spanish skills')).toBeInTheDocument();
        expect(screen.getByText('15 participants')).toBeInTheDocument();
        expect(screen.getByText('10 questions')).toBeInTheDocument();
    });

    it('navigates to create contest page when clicking create button', () => {
        useAdminContests.mockReturnValue({
            data: [],
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        const createButton = screen.getByText('Create Your First Contest');
        fireEvent.click(createButton);

        expect(mockNavigate).toHaveBeenCalledWith('/admin/contests/new');
    });

    it('navigates back to admin dashboard', () => {
        useAdminContests.mockReturnValue({
            data: [],
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        const backButton = screen.getByRole('button', { name: 'ArrowLeft' });
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
    });

    it('navigates to view contest details', () => {
        const mockContests = [
            {
                id: '1',
                title: 'Spanish Challenge',
                status: 'PUBLISHED',
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-07T10:00:00Z',
                participant_count: 10,
                question_count: 5,
            },
        ];

        useAdminContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        const viewButton = screen.getByText('View');
        fireEvent.click(viewButton);

        expect(mockNavigate).toHaveBeenCalledWith('/admin/contests/1');
    });

    it('navigates to edit contest', () => {
        const mockContests = [
            {
                id: '1',
                title: 'Spanish Challenge',
                status: 'DRAFT',
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-07T10:00:00Z',
                participant_count: 0,
                question_count: 3,
            },
        ];

        useAdminContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);

        expect(mockNavigate).toHaveBeenCalledWith('/admin/contests/1/edit');
    });

    it('shows delete confirmation modal', () => {
        const mockContests = [
            {
                id: '1',
                title: 'Spanish Challenge',
                status: 'DRAFT',
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-07T10:00:00Z',
                participant_count: 0,
                question_count: 3,
            },
        ];

        useAdminContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        // Click delete button
        const deleteButtons = screen.getAllByRole('button');
        const deleteButton = deleteButtons.find(btn => btn.querySelector('span')?.textContent === 'Trash2');
        fireEvent.click(deleteButton);

        // Modal should appear
        expect(screen.getByText('Delete Contest?')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete this contest? This action cannot be undone.')).toBeInTheDocument();
    });

    it('cancels delete operation', () => {
        const mockContests = [
            {
                id: '1',
                title: 'Spanish Challenge',
                status: 'DRAFT',
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-07T10:00:00Z',
                participant_count: 0,
                question_count: 3,
            },
        ];

        useAdminContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        // Open delete modal
        const deleteButtons = screen.getAllByRole('button');
        const deleteButton = deleteButtons.find(btn => btn.querySelector('span')?.textContent === 'Trash2');
        fireEvent.click(deleteButton);

        // Click cancel
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        // Modal should close
        expect(screen.queryByText('Delete Contest?')).not.toBeInTheDocument();
    });

    it('successfully deletes contest', async () => {
        const mockContests = [
            {
                id: '1',
                title: 'Spanish Challenge',
                status: 'DRAFT',
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-07T10:00:00Z',
                participant_count: 0,
                question_count: 3,
            },
        ];

        useAdminContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
        });

        mockDeleteMutateAsync.mockResolvedValue({});

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        // Open delete modal
        const deleteButtons = screen.getAllByRole('button');
        const deleteButton = deleteButtons.find(btn => btn.querySelector('span')?.textContent === 'Trash2');
        fireEvent.click(deleteButton);

        // Click delete
        const confirmButton = screen.getByText('Delete');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockDeleteMutateAsync).toHaveBeenCalledWith('1');
        });
    });

    it('handles delete error', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        const mockContests = [
            {
                id: '1',
                title: 'Spanish Challenge',
                status: 'DRAFT',
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-07T10:00:00Z',
                participant_count: 0,
                question_count: 3,
            },
        ];

        useAdminContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
        });

        mockDeleteMutateAsync.mockRejectedValue(new Error('Delete failed'));

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        // Open delete modal
        const deleteButtons = screen.getAllByRole('button');
        const deleteButton = deleteButtons.find(btn => btn.querySelector('span')?.textContent === 'Trash2');
        fireEvent.click(deleteButton);

        // Click delete
        const confirmButton = screen.getByText('Delete');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        consoleErrorSpy.mockRestore();
    });

    it('displays correct status badges', () => {
        const mockContests = [
            {
                id: '1',
                title: 'Draft Contest',
                status: 'DRAFT',
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-07T10:00:00Z',
                participant_count: 0,
                question_count: 3,
            },
            {
                id: '2',
                title: 'Published Contest',
                status: 'PUBLISHED',
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-07T10:00:00Z',
                participant_count: 5,
                question_count: 10,
            },
            {
                id: '3',
                title: 'Active Contest',
                status: 'ACTIVE',
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-07T10:00:00Z',
                participant_count: 20,
                question_count: 15,
            },
            {
                id: '4',
                title: 'Ended Contest',
                status: 'ENDED',
                start_time: '2024-01-01T10:00:00Z',
                end_time: '2024-01-07T10:00:00Z',
                participant_count: 30,
                question_count: 20,
            },
        ];

        useAdminContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        expect(screen.getByText('DRAFT')).toBeInTheDocument();
        expect(screen.getByText('PUBLISHED')).toBeInTheDocument();
        expect(screen.getByText('ACTIVE')).toBeInTheDocument();
        expect(screen.getByText('ENDED')).toBeInTheDocument();
    });

    it('formats dates correctly', () => {
        const mockContests = [
            {
                id: '1',
                title: 'Test Contest',
                status: 'DRAFT',
                start_time: '2024-01-15T14:30:00Z',
                end_time: '2024-01-20T18:00:00Z',
                participant_count: 0,
                question_count: 5,
            },
        ];

        useAdminContests.mockReturnValue({
            data: mockContests,
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <ContestListPage />
            </MemoryRouter>
        );

        // Check that dates are rendered (exact format may vary by locale)
        expect(screen.getByText(/Start:/)).toBeInTheDocument();
        expect(screen.getByText(/End:/)).toBeInTheDocument();
    });
});
