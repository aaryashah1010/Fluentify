/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ModuleManagementLayout from '../../../../../modules/admin/module-management/pages/ModuleManagementLayout';

// Mock the page components directly
jest.mock('../../../../../modules/admin/module-management/pages/LanguageListPage', () => {
    return () => <div data-testid="language-list-page">LanguageListPage</div>;
});
jest.mock('../../../../../modules/admin/module-management/pages/CourseListPage', () => {
    return () => <div data-testid="course-list-page">CourseListPage</div>;
});
jest.mock('../../../../../modules/admin/module-management/pages/CourseEditorPage', () => {
    return () => <div data-testid="course-editor-page">CourseEditorPage</div>;
});

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('ModuleManagementLayout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render layout structure correctly', () => {
        render(
            <MemoryRouter>
                <ModuleManagementLayout />
            </MemoryRouter>
        );

        expect(screen.getByText('Module Management')).toBeInTheDocument();
        expect(screen.getByText('Create and manage language courses, units, and lessons.')).toBeInTheDocument();
        expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
    });

    it('should navigate to admin dashboard on back button click', () => {
        render(
            <MemoryRouter>
                <ModuleManagementLayout />
            </MemoryRouter>
        );

        const backButton = screen.getByTestId('arrow-left-icon').closest('button');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
    });

    it('should render LanguageListPage on index route', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <ModuleManagementLayout />
            </MemoryRouter>
        );

        expect(screen.getByTestId('language-list-page')).toBeInTheDocument();
    });

    it('should render CourseListPage on language route', () => {
        render(
            <MemoryRouter initialEntries={['/French']}>
                <ModuleManagementLayout />
            </MemoryRouter>
        );

        expect(screen.getByTestId('course-list-page')).toBeInTheDocument();
    });

    it('should render CourseEditorPage on course/new route', () => {
        render(
            <MemoryRouter initialEntries={['/course/new']}>
                <ModuleManagementLayout />
            </MemoryRouter>
        );

        expect(screen.getByTestId('course-editor-page')).toBeInTheDocument();
    });

    it('should render CourseEditorPage on course/edit/:courseId route', () => {
        render(
            <MemoryRouter initialEntries={['/course/edit/123']}>
                <ModuleManagementLayout />
            </MemoryRouter>
        );

        expect(screen.getByTestId('course-editor-page')).toBeInTheDocument();
    });

    it('should render CourseEditorPage on course/view/:courseId route', () => {
        render(
            <MemoryRouter initialEntries={['/course/view/123']}>
                <ModuleManagementLayout />
            </MemoryRouter>
        );

        expect(screen.getByTestId('course-editor-page')).toBeInTheDocument();
    });

    it('should redirect to /admin/modules on unknown route', () => {
        // Use a multi-segment path to ensure it doesn't match :language (which is single segment)
        render(
            <MemoryRouter initialEntries={['/unknown/route']}>
                <Routes>
                    <Route path="/*" element={<ModuleManagementLayout />} />
                    <Route path="/admin/modules" element={<div data-testid="redirected">Redirected</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('redirected')).toBeInTheDocument();
    });
});
