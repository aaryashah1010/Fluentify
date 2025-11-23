import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';

/**
 * Chat Input Component
 * Handles message input with send button and keyboard shortcuts
 */
const ChatInput = ({ onSendMessage, disabled = false, placeholder = "Ask me anything about your target language!" }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Limit message length
    if (value.length <= 2000) {
      setMessage(value);
    }
  };

  return (
    <div className="border-t border-white/10 bg-slate-950/95 p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={`w-full px-4 py-3 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${
              disabled
                ? 'bg-slate-900/60 border-slate-700 cursor-not-allowed text-slate-500'
                : 'bg-slate-900/80 border-white/10 text-slate-100'
            }`}
            style={{ 
              minHeight: '48px', 
              maxHeight: '120px',
              overflowY: message.length > 100 ? 'auto' : 'hidden',
              lineHeight: '1.5'
            }}
          />
          
          {/* Character count */}
          {message.length > 1500 && (
            <div className={`absolute -top-6 right-0 text-xs ${
              message.length > 1900 ? 'text-red-400' : 'text-slate-400'
            }`}>
              {message.length}/2000
            </div>
          )}
        </div>
        
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={disabled || !message.trim()}
          className="h-12 px-6 rounded-2xl flex items-center justify-center"
          icon={
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          }
        >
          Send
        </Button>
      </form>
      
      {/* Hint text */}
      <div className="text-xs text-slate-400 mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};

export default ChatInput;
