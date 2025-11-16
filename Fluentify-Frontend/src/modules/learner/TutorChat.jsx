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
    <div className={`flex flex-col h-full bg-white ${compact ? '' : 'rounded-lg shadow-sm border border-gray-100'}`}>
      {/* Header - Only show in full mode */}
      {!compact && (
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-white flex items-center justify-center text-lg shadow">
              🤖
            </div>
            <div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">Fluent - AI Tutor</h2>
              <p className="text-sm text-gray-600">🌍 Multilingual Expert • Any Language, Any Context</p>
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
            <div className={`${compact ? 'w-12 h-12' : 'w-16 h-16'} mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-400 to-teal-400 text-white flex items-center justify-center shadow ${compact ? 'text-xl' : 'text-2xl'}`}>
              🤖
            </div>
            <h3 className={`${compact ? 'text-base' : 'text-xl'} font-bold text-gray-900 mb-2`}>
              Welcome to Fluent - Your Multilingual AI Tutor! 🌎
            </h3>
            {!compact && (
              <>
                <p className="text-gray-700 max-w-2xl mx-auto mb-4 font-medium">
                  I'm an expert polyglot ready to help you learn ANY language - from Spanish to Japanese, Arabic to French, and everything in between!
                </p>
                <div className="bg-gradient-to-br from-orange-50 to-teal-50 p-4 rounded-xl mb-4 max-w-2xl mx-auto border border-orange-200">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">✨</span> What I Can Do:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Teach <strong>any language</strong> at any level</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Translate between <strong>any languages</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Explain grammar, vocabulary & culture</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Create custom practice exercises</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Help with pronunciation & phonetics</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">✓</span>
                      <span>Assist with <strong>any context</strong>: travel, business, academics</span>
                    </div>
                  </div>
                </div>
                <div className="max-w-2xl mx-auto">
                  <p className="text-sm text-gray-600 mb-3 font-medium">💡 Try asking me:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                      <span className="text-orange-600">"Teach me French greetings"</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                      <span className="text-orange-600">"How do I say 'thank you' in Japanese?"</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                      <span className="text-orange-600">"Explain Spanish verb conjugations"</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                      <span className="text-orange-600">"Business vocabulary in German"</span>
                    </div>
                  </div>
                </div>
              </>
            )}
            {compact && (
              <p className="text-sm text-gray-600 px-2">
                Ask me anything about any language - I'm here to help!
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
            ? "Ask me anything about any language... 🌍" 
            : "Continue the conversation..."
        }
      />
    </div>
  );
};

export default TutorChat;
