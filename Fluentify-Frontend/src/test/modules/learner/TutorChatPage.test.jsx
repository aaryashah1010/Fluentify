/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TutorChatPage from '../../../modules/learner/TutorChatPage';

// Mock dependencies
const mockNavigate = jest.fn();
const mockLogout = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../hooks/useAuth', () => ({
    useLogout: () => mockLogout,
}));

jest.mock('../../../modules/learner/TutorChat', () => {
    return function MockTutorChat() {
        return <div data-testid="tutor-chat">TutorChat Component</div>;
    };
});

jest.mock('../../../components/Button', () => {
    return function MockButton({ children, onClick, icon, className }) {
        return (
            <button onClick={onClick} className={className}>
                {icon}
                {children}
            </button>
        );
    };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
    LogOut: () => <div data-testid="logout-icon">LogOut</div>,
}));

describe('TutorChatPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render page with header', () => {
        render(<TutorChatPage />);

        expect(screen.getByText('AI Tutor Chat')).toBeInTheDocument();
    });

    it('should render TutorChat component', () => {
        render(<TutorChatPage />);

        expect(screen.getByTestId('tutor-chat')).toBeInTheDocument();
    });

    it('should render back to dashboard button', () => {
        render(<TutorChatPage />);

        expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
        expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
    });

    it('should navigate to dashboard when back button clicked', () => {
        render(<TutorChatPage />);

        const backButton = screen.getByText('Back to Dashboard');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should render logout button', () => {
        render(<TutorChatPage />);

        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    });

    it('should call logout when logout button clicked', () => {
        render(<TutorChatPage />);

        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);

        expect(mockLogout).toHaveBeenCalled();
    });
});
