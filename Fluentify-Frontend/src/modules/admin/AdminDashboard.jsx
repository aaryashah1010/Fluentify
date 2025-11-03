import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useAuth';
import { LogOut, BookOpen, Users, BarChart3, Settings, User } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const dashboardCards = [
    {
      title: 'Manage Modules',
      description: 'Create and manage language courses, units, and lessons',
      icon: BookOpen,
      color: 'blue',
      path: '/admin/modules',
    },
    {
      title: 'User Management',
      description: 'View and manage learners and their progress',
      icon: Users,
      color: 'green',
      path: '/admin/users',
      disabled: false,
    },
    {
      title: 'Analytics',
      description: 'View platform statistics and insights',
      icon: BarChart3,
      color: 'purple',
      path: '/admin/analytics',
      disabled: false,
    },
    {
      title: 'Settings',
      description: 'Configure platform settings and preferences',
      icon: Settings,
      color: 'gray',
      path: '#',
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/profile')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Admin!</h2>
          <p className="text-gray-600">Manage your language learning platform</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card) => {
            const Icon = card.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              gray: 'bg-gray-100 text-gray-600',
            };

            return (
              <button
                key={card.title}
                onClick={() => !card.disabled && navigate(card.path)}
                disabled={card.disabled}
                className={`bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-lg transition-all ${
                  card.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[card.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
                {card.disabled && (
                  <span className="inline-block mt-3 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
