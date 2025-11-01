import React, { useState } from 'react';
import { MessageCircle, X, Minimize2 } from 'lucide-react';
import TutorChat from '../modules/learner/TutorChat';

/**
 * Floating Chat Widget
 * Bottom-right floating chat widget with compact chat panel
 */
const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      // If chat is open and not minimized, close it
      setIsOpen(false);
      setIsMinimized(false);
    } else if (isOpen && isMinimized) {
      // If chat is minimized, maximize it
      setIsMinimized(false);
    } else {
      // If chat is closed, open it
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div 
          className={`fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-2xl border z-50 transition-all duration-300 ${
            isMinimized ? 'h-14' : 'h-[500px]'
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
            <div 
              className={`flex items-center gap-2 ${isMinimized ? 'cursor-pointer hover:bg-purple-100 rounded px-2 py-1 transition-colors' : ''}`}
              onClick={isMinimized ? maximizeChat : undefined}
              title={isMinimized ? "Click to maximize" : ""}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center text-sm">
                🤖
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">AI Tutor</h3>
                <p className="text-xs text-gray-600">Online</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={minimizeChat}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={closeChat}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="h-[calc(100%-56px)]">
              <TutorChat compact={true} />
            </div>
          )}
        </div>
      )}

      {/* Floating Chat Button - Only show when chat is closed or minimized */}
      {(!isOpen || isMinimized) && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-105"
          title={isMinimized ? "Maximize Chat" : "Chat with AI Tutor"}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

    </>
  );
};

export default FloatingChatWidget;
