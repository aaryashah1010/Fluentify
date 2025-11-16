// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useLogout } from '../../hooks/useAuth';
// import { LogOut, BookOpen, Users, BarChart3, Settings, User, Trophy } from 'lucide-react';

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const logout = useLogout();

//   // Prevent back navigation from admin dashboard
//   useEffect(() => {
//     // Add a dummy state to history
//     window.history.pushState({ page: 'admin-dashboard' }, '', window.location.href);
    
//     const handlePopState = (event) => {
//       // Prevent going back by immediately pushing forward
//       event.preventDefault();
//       window.history.pushState({ page: 'admin-dashboard' }, '', window.location.href);
//     };

//     window.addEventListener('popstate', handlePopState);

//     return () => {
//       window.removeEventListener('popstate', handlePopState);
//     };
//   }, []);

//   const dashboardCards = [
//     {
//       title: 'Manage Modules',
//       description: 'Create and manage language courses, units, and lessons',
//       icon: BookOpen,
//       color: 'blue',
//       path: '/admin/modules',
//     },
//     {
//       title: 'Contest Management',
//       description: 'Create and schedule weekly contests for learners',
//       icon: Trophy,
//       color: 'orange',
//       path: '/admin/contests',
//       disabled: false,
//     },
//     {
//       title: 'User Management',
//       description: 'View and manage learners and their progress',
//       icon: Users,
//       color: 'green',
//       path: '/admin/users',
//       disabled: false,
//     },
//     {
//       title: 'Analytics',
//       description: 'View platform statistics and insights',
//       icon: BarChart3,
//       color: 'purple',
//       path: '/admin/analytics',
//       disabled: false,
//     },
//     {
//       title: 'Settings',
//       description: 'Configure platform settings and preferences',
//       icon: Settings,
//       color: 'gray',
//       path: '#',
//       disabled: true,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-yellow-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-900 cursor-pointer" onClick={() => navigate('/admin-dashboard')}>Admin Dashboard</h1>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate('/admin/profile')}
//               className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
//             >
//               <User className="w-4 h-4" />
//               Profile
//             </button>
//             <button
//               onClick={logout}
//               className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Admin!</h2>
//           <p className="text-gray-600">Manage your language learning platform</p>
//         </div>

//         {/* Dashboard Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {dashboardCards.map((card) => {
//             const Icon = card.icon;
//             const colorClasses = {
//               blue: 'bg-blue-100 text-blue-600',
//               orange: 'bg-orange-100 text-orange-600',
//               green: 'bg-green-100 text-green-600',
//               purple: 'bg-purple-100 text-purple-600',
//               gray: 'bg-gray-100 text-gray-600',
//             };

//             return (
//               <button
//                 key={card.title}
//                 onClick={() => !card.disabled && navigate(card.path)}
//                 disabled={card.disabled}
//                 className={`bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-lg transition-all ${
//                   card.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300'
//                 }`}
//               >
//                 <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[card.color]}`}>
//                   <Icon className="w-6 h-6" />
//                 </div>
//                 <h3 className="font-semibold text-lg text-gray-900 mb-2">{card.title}</h3>
//                 <p className="text-sm text-gray-600">{card.description}</p>
//                 {card.disabled && (
//                   <span className="inline-block mt-3 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                     Coming Soon
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useAuth";
import {
  LogOut,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  User,
  Trophy,
  Home
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  // Profile Dropdown State
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Prevent Back Navigation
  useEffect(() => {
    window.history.pushState({ page: "admin-dashboard" }, "", window.location.href);
    const handlePopState = (e) => {
      e.preventDefault();
      window.history.pushState({ page: "admin-dashboard" }, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Dashboard Cards
  const dashboardCards = [
    {
      title: "Manage Modules",
      description: "Create and manage language courses, units, and lessons",
      icon: BookOpen,
      color: "from-orange-400 to-teal-400",
      path: "/admin/modules",
    },
    {
      title: "Contest Management",
      description: "Create and schedule weekly contests for learners",
      icon: Trophy,
      color: "from-orange-400 to-teal-400",
      path: "/admin/contests",
    },
    {
      title: "User Management",
      description: "View and manage learners and their progress",
      icon: Users,
      color: "from-orange-400 to-teal-400",
      path: "/admin/users",
    },
    {
      title: "Analytics",
      description: "View platform statistics and insights",
      icon: BarChart3,
      color: "from-orange-400 to-teal-400",
      path: "/admin/analytics",
    },
    {
      title: "Settings",
      description: "Configure platform settings and preferences",
      icon: Settings,
      color: "from-gray-300 to-gray-400",
      path: "#",
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Dashboard Title */}
          <h1
            className="
              text-3xl font-extrabold cursor-pointer transition
              bg-gradient-to-r from-orange-500 via-amber-600 to-teal-500 
              bg-clip-text text-transparent
              hover:opacity-80
            "
            onClick={() => navigate("/admin-dashboard")}
          >
            Admin Dashboard
          </h1>

          {/* Profile Dropdown */}
          <div className="relative profile-menu-area">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-11 h-11 rounded-full 
              bg-gradient-to-br from-orange-400 to-teal-400
              flex items-center justify-center shadow-lg 
              hover:scale-110 transition"
            >
              <User className="w-6 h-6 text-white" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 animate-fadeIn">

                <button
                  onClick={() => { setDropdownOpen(false); navigate("/admin-dashboard"); }}
                  className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-orange-50 transition"
                >
                  <Home size={16} className="text-teal-600" />
                  Home
                </button>

                <button
                  onClick={() => { setDropdownOpen(false); navigate("/admin/profile"); }}
                  className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-orange-50 transition"
                >
                  <User size={16} className="text-orange-500" />
                  My Profile
                </button>

                {/* <button
                  onClick={() => { setDropdownOpen(false); navigate("/admin/settings"); }}
                  className="w-full px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-orange-50 transition"
                >
                  <Settings size={16} className="text-teal-600" />
                  Settings
                </button> */}

                <hr className="my-1" />

                <button
                  onClick={logout}
                  className="w-full px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome, Admin 👋</h2>
          <p className="text-gray-600 text-lg">
            Manage your language learning platform efficiently.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {dashboardCards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.title}
                onClick={() => !card.disabled && navigate(card.path)}
                disabled={card.disabled}
                className={`group p-6 rounded-2xl text-left shadow-md bg-white 
                  border border-gray-200 
                  hover:shadow-xl hover:scale-[1.02] transition-all duration-300
                  ${card.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 
                  bg-gradient-to-br ${card.color} text-white shadow-lg`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {card.description}
                </p>

                {card.disabled && (
                  <span className="mt-3 inline-block text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
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
