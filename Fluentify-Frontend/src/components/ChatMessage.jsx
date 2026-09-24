import React from 'react';

/**
 * Chat Message Component
 * Displays individual chat messages with different styles for user and AI
 */
const ChatMessage = ({ message, isStreaming = false }) => {
  const { sender, text, timestamp } = message;
  const isUser = sender === 'user';
  const isAI = sender === 'ai';

  // Format timestamp
  const formatTime = (date) => {
    if (!date) return '';
    const time = new Date(date);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render markdown-like formatting
  const renderText = (text) => {
    if (!text) return '';
    
    // Simple markdown rendering
    return text
      .split('\n')
      .map((line, index) => (
        <React.Fragment key={index}>
          {line
            .split(/(\*\*.*?\*\*|`.*?`)/g)
            .map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
              }
              if (part.startsWith('`') && part.endsWith('`')) {
                return (
                  <code 
                    key={partIndex} 
                    className="bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-200 px-2 py-0.5 rounded text-sm font-mono border border-teal-300 dark:border-teal-500/30"
                  >
                    {part.slice(1, -1)}
                  </code>
                );
              }
              return part;
            })}
          {index < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar */}
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            isUser 
              ? 'bg-gradient-to-r from-orange-400 to-teal-400 text-white' 
              : 'bg-slate-100 text-teal-700 border border-slate-200 dark:bg-slate-800 dark:text-teal-200 dark:border-white/10'
          }`}>
            {isUser ? 'U' : '🤖'}
          </div>
          
          {/* Message Content */}
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-gradient-to-r from-orange-400 to-teal-400 text-white rounded-br-md' 
              : 'bg-white text-slate-800 rounded-bl-md border border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-white/10'
          }`}>
            <div className="text-sm leading-relaxed">
              {renderText(text)}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-current opacity-75 animate-pulse ml-1" />
              )}
            </div>
            
            {/* Timestamp */}
            {timestamp && !isStreaming && (
              <div className={`text-xs mt-2 opacity-70 ${
                isUser ? 'text-teal-50' : 'text-slate-500 dark:text-slate-300'
              }`}>
                {formatTime(timestamp)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
