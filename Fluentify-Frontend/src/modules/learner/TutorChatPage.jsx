import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useLogout } from '../../hooks/useAuth';
import TutorChat from './TutorChat';
import Button from '../../components/Button';

/**
 * AI Tutor Chat Page
 * Full-page chat interface with navigation
 */
const TutorChatPage = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                icon={<ArrowLeft className="w-4 h-4" />}
                className="text-gray-600 hover:text-gray-800"
              >
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">AI Tutor Chat</h1>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              icon={<LogOut className="w-4 h-4" />}
              className="text-gray-600 hover:text-gray-800"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-full">
          <TutorChat />
        </div>
      </main>
    </div>
  );
};

export default TutorChatPage;
