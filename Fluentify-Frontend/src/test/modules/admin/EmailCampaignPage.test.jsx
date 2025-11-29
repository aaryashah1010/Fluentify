/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import EmailCampaignPage from '../../../modules/admin/EmailCampaignPage';

// Mock dependencies
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../api/admin', () => ({
    getLearnersForCampaign: jest.fn(),
    triggerEmailCampaign: jest.fn(),
    exportLearnersCSV: jest.fn(),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Mail: () => <div data-testid="mail-icon">Mail</div>,
    Download: () => <div data-testid="download-icon">Download</div>,
    Send: () => <div data-testid="send-icon">Send</div>,
    Users: () => <div data-testid="users-icon">Users</div>,
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
    CheckCircle: () => <div data-testid="check-icon">CheckCircle</div>,
    AlertCircle: () => <div data-testid="alert-icon">AlertCircle</div>,
    Loader2: () => <div data-testid="loader-icon">Loader2</div>,
}));

// Import after mocks
import * as adminApi from '../../../api/admin';
const mockGetLearnersForCampaign = jest.mocked(adminApi.getLearnersForCampaign);
const mockTriggerEmailCampaign = jest.mocked(adminApi.triggerEmailCampaign);
const mockExportLearnersCSV = jest.mocked(adminApi.exportLearnersCSV);

describe('EmailCampaignPage', () => {
    const mockLearners = [
        { name: 'John Doe', email: 'john@example.com', created_at: '2024-01-01' },
        { name: 'Jane Smith', email: 'jane@example.com', created_at: '2024-01-02' },
    ];

    // Mock window methods before each test
    let confirmSpy;
    let createObjectURLSpy;
    let revokeObjectURLSpy;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Setup window.confirm spy
        confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

        // Setup URL mocks
        createObjectURLSpy = jest.fn(() => 'blob:url');
        revokeObjectURLSpy = jest.fn();

        if (!window.URL) {
            window.URL = {};
        }
        window.URL.createObjectURL = createObjectURLSpy;
        window.URL.revokeObjectURL = revokeObjectURLSpy;
    });

    afterEach(() => {
        if (confirmSpy) {
            confirmSpy.mockRestore();
        }
    });

    it('should render page title', async () => {
        mockGetLearnersForCampaign.mockResolvedValue({
            success: true,
            data: { learners: [] },
        });

        render(
            <MemoryRouter>
                <EmailCampaignPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Email Campaign')).toBeInTheDocument();
        });
    });

    it('should fetch and display learners on mount', async () => {
        mockGetLearnersForCampaign.mockResolvedValue({
            success: true,
            data: { learners: mockLearners },
        });

        render(
            <MemoryRouter>
                <EmailCampaignPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });

        expect(mockGetLearnersForCampaign).toHaveBeenCalled();
    });

    it('should display total learners count', async () => {
        mockGetLearnersForCampaign.mockResolvedValue({
            success: true,
            data: { learners: mockLearners },
        });

        render(
            <MemoryRouter>
                <EmailCampaignPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            const totalElements = screen.getAllByText('2');
            expect(totalElements.length).toBeGreaterThan(0);
        });
    });

    it('should display error message when fetch fails', async () => {
        mockGetLearnersForCampaign.mockRejectedValue(new Error('Network error'));

        render(
            <MemoryRouter>
                <EmailCampaignPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Network error')).toBeInTheDocument();
        });
    });

    it('should navigate back when back button is clicked', async () => {
        mockGetLearnersForCampaign.mockResolvedValue({
            success: true,
            data: { learners: [] },
        });

        render(
            <MemoryRouter>
                <EmailCampaignPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            const backButton = screen.getByTestId('arrow-left-icon').closest('button');
            fireEvent.click(backButton);
            expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
        });
    });

    it('should trigger email campaign when Send Email is clicked', async () => {
        mockGetLearnersForCampaign.mockResolvedValue({
            success: true,
            data: { learners: mockLearners },
        });
        mockTriggerEmailCampaign.mockResolvedValue({
            success: true,
            data: { learnerCount: 2, updatedRows: 2 },
        });

        render(
            <MemoryRouter>
                <EmailCampaignPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const sendButton = screen.getByText('Send Email');
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(confirmSpy).toHaveBeenCalled();
            expect(mockTriggerEmailCampaign).toHaveBeenCalled();
        });
    });

    it('should display success message after successful campaign trigger', async () => {
        mockGetLearnersForCampaign.mockResolvedValue({
            success: true,
            data: { learners: mockLearners },
        });
        mockTriggerEmailCampaign.mockResolvedValue({
            success: true,
            data: { learnerCount: 2, updatedRows: 2 },
        });

        render(
            <MemoryRouter>
                <EmailCampaignPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const sendButton = screen.getByText('Send Email');
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText(/Successfully appended/)).toBeInTheDocument();
        });
    });

    it('should not trigger campaign if user cancels confirmation', async () => {
        confirmSpy.mockReturnValue(false); // User cancels
        mockGetLearnersForCampaign.mockResolvedValue({
            success: true,
            data: { learners: mockLearners },
        });

        render(
            <MemoryRouter>
                <EmailCampaignPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            const sendButton = screen.getByText('Send Email');
            fireEvent.click(sendButton);
        });

        expect(mockTriggerEmailCampaign).not.toHaveBeenCalled();
    });

    it('should export CSV when Export CSV is clicked', async () => {
        const mockBlob = new Blob(['csv data'], { type: 'text/csv' });
        mockGetLearnersForCampaign.mockResolvedValue({
            success: true,
            data: { learners: mockLearners },
        });
        mockExportLearnersCSV.mockResolvedValue(mockBlob);

        render(
            <MemoryRouter>
                <EmailCampaignPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const exportButton = screen.getByText('Export CSV');
        fireEvent.click(exportButton);

        await waitFor(() => {
            expect(mockExportLearnersCSV).toHaveBeenCalled();
            expect(createObjectURLSpy).toHaveBeenCalled();
        });
    });

    it('should display "No learners found" when list is empty', async () => {
        mockGetLearnersForCampaign.mockResolvedValue({
            success: true,
            data: { learners: [] },
        });

        render(
            <MemoryRouter>
                <EmailCampaignPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No learners found')).toBeInTheDocument();
        });
    });

    it('should disable Send Email button when no learners', async () => {
        mockGetLearnersForCampaign.mockResolvedValue({
            success: true,
            data: { learners: [] },
        });

        render(
            <MemoryRouter>
                <EmailCampaignPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            const sendButton = screen.getByText('Send Email');
            expect(sendButton).toBeDisabled();
        });
    });

    it('should handle campaign trigger failure', async () => {
        mockGetLearnersForCampaign.mockResolvedValue({
            success: true,
            data: { learners: mockLearners },
        });
        mockTriggerEmailCampaign.mockRejectedValue(new Error('Campaign failed'));

        render(
            <MemoryRouter>
                <EmailCampaignPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const sendButton = screen.getByText('Send Email');
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(confirmSpy).toHaveBeenCalled();
            expect(mockTriggerEmailCampaign).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText(/Campaign failed/)).toBeInTheDocument();
        });
    });
});
