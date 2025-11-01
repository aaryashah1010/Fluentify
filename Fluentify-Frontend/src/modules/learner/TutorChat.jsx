import React, { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import ChatMessage from '../../components/ChatMessage';
import ChatInput from '../../components/ChatInput';
import TypingIndicator from '../../components/TypingIndicator';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';

/**
 * AI Tutor Chat Interface
 * Main chat component with streaming support
 */
const TutorChat = ({ compact = false }) => {
  const token = localStorage.getItem('jwt');
  const { 
    messages, 
    isLoading, 
    isTyping, 
    error, 
    sendMessage, 
    clearChat, 
    clearError 
  } = useChat(token);
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Welcome message for empty chat
  const showWelcome = messages.length === 0 && !isLoading;

  const handleSendMessage = async (message) => {
    await sendMessage(message);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this chat? This action cannot be undone.')) {
      clearChat();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${compact ? '' : 'rounded-lg shadow-sm border'}`}>
      {/* Header - Only show in full mode */}
      {!compact && (
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Fluent - AI Tutor</h2>
              <p className="text-sm text-gray-600">Your personal language learning assistant</p>
            </div>
          </div>
          
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear Chat
            </Button>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 border-b">
          <ErrorMessage 
            message={error} 
            onClose={clearError}
            className="mb-0"
          />
        </div>
      )}

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto space-y-4 ${compact ? 'p-2' : 'p-4'}`}
        style={{ 
          minHeight: compact ? '200px' : '400px', 
          maxHeight: compact ? '300px' : '600px' 
        }}
      >
        {showWelcome && (
          <div className={`text-center ${compact ? 'py-4' : 'py-8'}`}>
            <div className={`${compact ? 'w-12 h-12' : 'w-16 h-16'} mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center ${compact ? 'text-xl' : 'text-2xl'}`}>
              🤖
            </div>
            <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-gray-800 mb-2`}>
              Welcome to your AI Tutor!
            </h3>
            {!compact && (
              <>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  I'm Fluent, your personal language learning assistant. I can help you with:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto text-sm text-gray-700">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong>Grammar & Vocabulary</strong><br />
                    Explanations and examples
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong>Pronunciation</strong><br />
                    Phonetic guidance
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong>Cultural Context</strong><br />
                    Usage in real situations
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <strong>Practice Exercises</strong><br />
                    Custom learning activities
                  </div>
                </div>
              </>
            )}
            {compact && (
              <p className="text-sm text-gray-600 px-2">
                Ask me anything about your target language!
              </p>
            )}
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            isStreaming={message.isStreaming}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder={
          messages.length === 0 
            ? "Ask me anything about your target language!" 
            : "Continue the conversation..."
        }
      />
    </div>
  );
};

export default TutorChat;
