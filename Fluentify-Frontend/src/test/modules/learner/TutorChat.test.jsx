/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TutorChat from '../../../modules/learner/TutorChat';

// Mock dependencies
const mockSendMessage = jest.fn();
const mockClearChat = jest.fn();
const mockClearError = jest.fn();
const mockUseChat = jest.fn();

jest.mock('../../../hooks/useChat', () => ({
    useChat: (token) => mockUseChat(token),
}));

jest.mock('../../../components/ChatMessage', () => {
    return function MockChatMessage({ message }) {
        return <div data-testid={`message-${message.id}`}>{message.content}</div>;
    };
});

jest.mock('../../../components/ChatInput', () => {
    return function MockChatInput({ onSendMessage, disabled, placeholder }) {
        return (
            <div data-testid="chat-input">
                <input
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={(e) => {
                        if (e.target.value) {
                            onSendMessage(e.target.value);
                        }
                    }}
                />
            </div>
        );
    };
});

jest.mock('../../../components/TypingIndicator', () => {
    return function MockTypingIndicator() {
        return <div data-testid="typing-indicator">Typing...</div>;
    };
});

jest.mock('../../../components/Button', () => {
    return function MockButton({ children, onClick, className }) {
        return (
            <button onClick={onClick} className={className}>
                {children}
            </button>
        );
    };
});

jest.mock('../../../components/ErrorMessage', () => {
    return function MockErrorMessage({ message, onClose }) {
        return (
            <div data-testid="error-message">
                {message}
                <button onClick={onClose}>Close</button>
            </div>
        );
    };
});

describe('TutorChat', () => {
    const mockMessages = [
        { id: 1, content: 'Hello!', role: 'user' },
        { id: 2, content: 'Hi! How can I help?', role: 'assistant' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('jwt', 'test-token');
        global.confirm = jest.fn(() => true);

        // Mock scrollIntoView
        Element.prototype.scrollIntoView = jest.fn();

        mockUseChat.mockReturnValue({
            messages: [],
            isLoading: false,
            isTyping: false,
            error: null,
            sendMessage: mockSendMessage,
            clearChat: mockClearChat,
            clearError: mockClearError,
        });
    });

    it('should render welcome message when no messages', () => {
        render(<TutorChat />);

        expect(screen.getByText(/Welcome to Fluent - Your Multilingual AI Tutor!/)).toBeInTheDocument();
        expect(screen.getByText(/I'm an expert polyglot/)).toBeInTheDocument();
    });

    it('should render header with tutor name', () => {
        render(<TutorChat />);

        expect(screen.getByText('Fluent - AI Tutor')).toBeInTheDocument();
        expect(screen.getByText(/Multilingual Expert/)).toBeInTheDocument();
    });

    it('should not render header in compact mode', () => {
        render(<TutorChat compact={true} />);

        expect(screen.queryByText('Fluent - AI Tutor')).not.toBeInTheDocument();
    });

    it('should render messages', () => {
        mockUseChat.mockReturnValue({
            messages: mockMessages,
            isLoading: false,
            isTyping: false,
            error: null,
            sendMessage: mockSendMessage,
            clearChat: mockClearChat,
            clearError: mockClearError,
        });

        render(<TutorChat />);

        expect(screen.getByTestId('message-1')).toHaveTextContent('Hello!');
        expect(screen.getByTestId('message-2')).toHaveTextContent('Hi! How can I help?');
    });

    it('should show typing indicator when typing', () => {
        mockUseChat.mockReturnValue({
            messages: mockMessages,
            isLoading: false,
            isTyping: true,
            error: null,
            sendMessage: mockSendMessage,
            clearChat: mockClearChat,
            clearError: mockClearError,
        });

        render(<TutorChat />);

        expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
    });

    it('should display error message', () => {
        mockUseChat.mockReturnValue({
            messages: [],
            isLoading: false,
            isTyping: false,
            error: 'Something went wrong',
            sendMessage: mockSendMessage,
            clearChat: mockClearChat,
            clearError: mockClearError,
        });

        render(<TutorChat />);

        expect(screen.getByTestId('error-message')).toHaveTextContent('Something went wrong');
    });

    it('should clear error when close button clicked', () => {
        mockUseChat.mockReturnValue({
            messages: [],
            isLoading: false,
            isTyping: false,
            error: 'Something went wrong',
            sendMessage: mockSendMessage,
            clearChat: mockClearChat,
            clearError: mockClearError,
        });

        render(<TutorChat />);

        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);

        expect(mockClearError).toHaveBeenCalled();
    });

    it('should send message', async () => {
        render(<TutorChat />);

        const input = screen.getByPlaceholderText(/Ask me anything about any language/);
        fireEvent.change(input, { target: { value: 'Test message' } });

        await waitFor(() => {
            expect(mockSendMessage).toHaveBeenCalledWith('Test message');
        });
    });

    it('should show Clear Chat button when messages exist', () => {
        mockUseChat.mockReturnValue({
            messages: mockMessages,
            isLoading: false,
            isTyping: false,
            error: null,
            sendMessage: mockSendMessage,
            clearChat: mockClearChat,
            clearError: mockClearError,
        });

        render(<TutorChat />);

        expect(screen.getByText('Clear Chat')).toBeInTheDocument();
    });

    it('should not show Clear Chat button when no messages', () => {
        render(<TutorChat />);

        expect(screen.queryByText('Clear Chat')).not.toBeInTheDocument();
    });

    it('should clear chat when Clear Chat clicked and confirmed', () => {
        mockUseChat.mockReturnValue({
            messages: mockMessages,
            isLoading: false,
            isTyping: false,
            error: null,
            sendMessage: mockSendMessage,
            clearChat: mockClearChat,
            clearError: mockClearError,
        });

        render(<TutorChat />);

        const clearButton = screen.getByText('Clear Chat');
        fireEvent.click(clearButton);

        expect(global.confirm).toHaveBeenCalledWith(
            'Are you sure you want to clear this chat? This action cannot be undone.'
        );
        expect(mockClearChat).toHaveBeenCalled();
    });

    it('should not clear chat when user cancels confirmation', () => {
        global.confirm = jest.fn(() => false);
        mockUseChat.mockReturnValue({
            messages: mockMessages,
            isLoading: false,
            isTyping: false,
            error: null,
            sendMessage: mockSendMessage,
            clearChat: mockClearChat,
            clearError: mockClearError,
        });

        render(<TutorChat />);

        const clearButton = screen.getByText('Clear Chat');
        fireEvent.click(clearButton);

        expect(global.confirm).toHaveBeenCalled();
        expect(mockClearChat).not.toHaveBeenCalled();
    });

    it('should render compact welcome message in compact mode', () => {
        render(<TutorChat compact={true} />);

        expect(screen.getByText(/Ask me anything about any language - I'm here to help!/)).toBeInTheDocument();
        expect(screen.queryByText(/I'm an expert polyglot/)).not.toBeInTheDocument();
    });

    it('should pass token to useChat hook', () => {
        render(<TutorChat />);

        expect(mockUseChat).toHaveBeenCalledWith('test-token');
    });
});
