/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../../../modules/learner/components/sidebar';

// Mock dependencies
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    LayoutDashboard: () => <div data-testid="dashboard-icon">Dashboard</div>,
    BookOpen: () => <div data-testid="book-icon">Book</div>,
    MessageCircle: () => <div data-testid="message-icon">Message</div>,
    Languages: () => <div data-testid="languages-icon">Languages</div>,
    Trophy: () => <div data-testid="trophy-icon">Trophy</div>,
    User: () => <div data-testid="user-icon">User</div>,
    Settings: () => <div data-testid="settings-icon">Settings</div>,
    BarChart: () => <div data-testid="chart-icon">Chart</div>,
    LogOut: () => <div data-testid="logout-icon">LogOut</div>,
}));

describe('Sidebar', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                removeItem: jest.fn(),
            },
            writable: true,
        });
    });

    it('should render logo', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Fluentify')).toBeInTheDocument();
    });

    it('should render navigation links', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Modules')).toBeInTheDocument();
        expect(screen.getByText('Contests')).toBeInTheDocument();
        expect(screen.getByText('Progress')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('should render logout button', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    });

    it('should navigate to correct paths', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const homeLink = screen.getByText('Home').closest('a');
        expect(homeLink).toHaveAttribute('href', '/dashboard');

        const modulesLink = screen.getByText('Modules').closest('a');
        expect(modulesLink).toHaveAttribute('href', '/language-modules');
    });

    it('should handle logout', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        const logoutButton = screen.getByText('Logout').closest('button');
        fireEvent.click(logoutButton);

        expect(localStorage.removeItem).toHaveBeenCalledWith('jwt');
        expect(mockNavigate).toHaveBeenCalledWith('/login?logout=true');
    });

    it('should apply active styles to current route', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Sidebar />
            </MemoryRouter>
        );

        const homeLink = screen.getByText('Home').closest('a');
        expect(homeLink).toHaveClass('bg-gradient-to-r');
        expect(homeLink).toHaveClass('from-teal-500');
    });

    it('should apply inactive styles to other routes', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Sidebar />
            </MemoryRouter>
        );

        const modulesLink = screen.getByText('Modules').closest('a');
        expect(modulesLink).not.toHaveClass('bg-gradient-to-r');
        expect(modulesLink).toHaveClass('text-slate-200');
    });
});
