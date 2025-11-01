import React from 'react';

/**
 * Typing Indicator Component
 * Shows when AI is typing/generating response
 */
const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start gap-3">
        {/* AI Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center text-sm font-medium">
          🤖
        </div>
        
        {/* Typing Animation */}
        <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-gray-500 ml-2">Fluent is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
