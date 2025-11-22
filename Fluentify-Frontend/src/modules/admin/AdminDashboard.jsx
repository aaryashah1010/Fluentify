
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useAuth';
import { ToggleSwitch } from '../../components';

import {
  LogOut,
  BookOpen,
  Users,
  BarChart3,
  User,
  Trophy,
  Mail,
  Settings,
  Menu,
  Moon,
} from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  // Sidebar & menus
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activityRange, setActivityRange] = useState('1m');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Prevent back navigation from admin dashboard
  useEffect(() => {
    window.history.pushState({ page: 'admin-dashboard' }, '', window.location.href);

    const handlePopState = (event) => {
      event.preventDefault();
      window.history.pushState({ page: 'admin-dashboard' }, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const dashboardCards = [
    {
      title: 'Manage Modules',
      description: 'Create and manage language courses, units, and lessons',
      icon: BookOpen,
      color: 'blue',
      path: '/admin/modules',
    },
    {
      title: 'Contest Management',
      description: 'Create and schedule weekly contests for learners',
      icon: Trophy,
      color: 'orange',
      path: '/admin/contests',
    },
    {
      title: 'User Management',
      description: 'View and manage learners and their progress',
      icon: Users,
      color: 'green',
      path: '/admin/users',
    },
    {
      title: 'Analytics',
      description: 'View platform statistics and insights',
      icon: BarChart3,
      color: 'purple',
      path: '/admin/analytics',
    },
    {
      title: 'Email Campaign',
      description: 'Automatically send motivational messages to learners',
      icon: Mail,
      color: 'indigo',
      path: '/admin/email-campaign',
    },
  ];

  const sidebarItems = [
    { label: 'Overview', icon: BarChart3, path: '/admin-dashboard' },
    { label: 'Modules', icon: BookOpen, path: '/admin/modules' },
    { label: 'Contests', icon: Trophy, path: '/admin/contests' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  ];

  const activitySeries = {
    '1w': [
      { name: 'Mon', value: 30 },
      { name: 'Tue', value: 45 },
      { name: 'Wed', value: 38 },
      { name: 'Thu', value: 52 },
      { name: 'Fri', value: 61 },
      { name: 'Sat', value: 48 },
      { name: 'Sun', value: 35 },
    ],
    '1m': [
      { name: 'Week 1', value: 120 },
      { name: 'Week 2', value: 145 },
      { name: 'Week 3', value: 160 },
      { name: 'Week 4', value: 150 },
    ],
    '3m': [
      { name: 'Oct', value: 420 },
      { name: 'Nov', value: 530 },
      { name: 'Dec', value: 480 },
    ],
  };

  const userDistribution = [
    { name: 'Active', value: 62 },
    { name: 'New', value: 18 },
    { name: 'Dormant', value: 20 },
  ];

  const pieColors = ['#4f46e5', '#22c55e', '#f97316'];
  const currentActivityData = activitySeries[activityRange] || activitySeries['1m'];

  return (
    <div className={`min-h-screen flex overflow-hidden ${isDarkMode ? 'dark-mode-gradient' : 'bg-slate-50'}`} style={isDarkMode ? {
      background: 'linear-gradient(to bottom right, #A63E21, #D97A3A, #214434, #101726)'
    } : {}}>

      {/* BACKDROP FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur border-r border-slate-200 shadow-xl transform transition-transform duration-200 ease-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 bg-gradient-to-br from-[#F29A36] via-[#A8C79B] to-[#56D7C5] rounded-t-lg">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-2 rounded-md bg-white/30"
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
                Fluentify
              </p>
              <h1 className="text-base font-semibold text-white">Admin Panel</h1>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="inline-flex lg:hidden text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md p-1"
          >
            <span className="sr-only">Close sidebar</span>
            {/* Using a simple icon shape to avoid importing X separately */}
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.path || (item.label === 'Overview' && window.location.pathname === '/admin-dashboard');

            return (
              <button
                key={item.label}
                onClick={() => {
                  if (!item.disabled && item.path !== '#') {
                    navigate(item.path);
                  }
                  setIsSidebarOpen(false);
                }}
                disabled={item.disabled}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all
                  ${item.disabled ? 'cursor-not-allowed text-slate-400 border border-dashed border-slate-200 bg-slate-50' : ''}
                  ${!item.disabled && isActive ? 'bg-slate-900 text-slate-50 shadow-sm' : ''}
                  ${!item.disabled && !isActive ? 'text-slate-600 hover:bg-slate-100' : ''}
                `}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px]
                    ${isActive ? 'bg-slate-800 text-slate-50' : 'bg-slate-100 text-slate-500'}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200
        ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}
      >
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle / Hamburger Button */}
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] shadow-sm hover:opacity-90 transition-opacity"
              >
                <div className="space-y-1.5">
                  <div className="h-0.5 w-5 rounded-full bg-white" />
                  <div className="h-0.5 w-5 rounded-full bg-white" />
                  <div className="h-0.5 w-5 rounded-full bg-white" />
                </div>
              </button>

              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">
                  Dashboard
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Welcome, Admin!
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 relative">
              {/* Optional search bar (minimal) */}
              <div className="hidden sm:flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500 shadow-inner">
                <span className="mr-2 text-slate-400">⌕</span>
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="bg-transparent outline-none placeholder:text-slate-400 w-32 md:w-40"
                />
              </div>

              {/* Profile icon with dropdown */}
              <button
                onClick={() => setIsProfileMenuOpen((open) => !open)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#F29A36] via-[#A8C79B] to-[#56D7C5] shadow-sm hover:opacity-90 transition-opacity"
              >
                <User className="w-4 h-4 text-white" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-10 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-2 text-sm">
                  <button
                    onClick={() => {
                      navigate('/admin/profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>

                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between px-4 py-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-slate-700" />
                      <span className="text-slate-700 text-sm">Dark Mode</span>
                    </div>
                    <ToggleSwitch isOn={isDarkMode} onToggle={toggleTheme} />
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 border-t border-slate-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
            {/* HEADER STRIP WITH GRADIENT */}
            <section className="rounded-2xl bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 border border-slate-100 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold mb-1">
                  Fluentify Control Center
                </p>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                  Overview & quick actions
                </h3>
                <p className="text-xs md:text-sm text-slate-500 mt-1">
                  Manage modules, contests, users and analytics from a single, clean dashboard.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 border border-slate-100 text-slate-600 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />
                  System healthy
                </span>
                <span className="inline-flex items-center rounded-full bg-white/60 px-3 py-1 border border-slate-100 text-slate-500 shadow-sm">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </section>

            {/* ANALYTICS WITH LINE + PIE CHARTS (above cards) */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* LINE CHART CARD */}
              <div className={`lg:col-span-2 rounded-2xl border shadow-sm p-5 flex flex-col ${isDarkMode
                ? 'bg-slate-900/80 border-slate-700/50 text-white'
                : 'bg-white border-slate-200'
                }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Activity overview</h3>
                    <p className="text-xs text-slate-400">Lessons completed over time</p>
                  </div>

                  <div className="inline-flex items-center gap-1 rounded-full bg-slate-50 p-1 border border-slate-200">
                    {[
                      { id: '1w', label: '1W' },
                      { id: '1m', label: '1M' },
                      { id: '3m', label: '3M' },
                    ].map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setActivityRange(range.id)}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] transition-colors ${activityRange === range.id
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-500 hover:bg-white'
                          }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentActivityData} margin={{ left: -20, right: 10, top: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: '1px solid #e5e7eb',
                          fontSize: 12,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#4f46e5"
                        strokeWidth={2.4}
                        dot={{ r: 3 }}
                        activeDot={{ r: 4.5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PIE CHART CARD */}
              <div className={`rounded-2xl border shadow-sm p-5 flex flex-col ${isDarkMode
                ? 'bg-slate-900/80 border-slate-700/50 text-white'
                : 'bg-white border-slate-200'
                }`}>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">User distribution</h3>
                <p className="text-xs text-slate-400 mb-3">Breakdown of learner segments</p>

                <div className="h-40">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={userDistribution}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={50}
                        paddingAngle={2}
                        label={({ name, value }) => `${name} ${value}%`}
                        labelLine={false}
                      >
                        {userDistribution.map((entry, index) => (
                          <Cell key={entry.name} fill={pieColors[index]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: '1px solid #e5e7eb',
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 text-[11px] mt-6 gap-1">
                  {userDistribution.map((segment, i) => (
                    <div key={segment.name} className="flex items-center gap-1 text-slate-600">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: pieColors[i] }}
                      />
                      {segment.name}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* DASHBOARD CARDS (below charts) */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dashboardCards.map((card) => {
                  const Icon = card.icon;
                  const colors = {
                    blue: 'from-sky-50 to-sky-100 text-sky-600',
                    orange: 'from-amber-50 to-amber-100 text-amber-600',
                    green: 'from-emerald-50 to-emerald-100 text-emerald-600',
                    purple: 'from-violet-50 to-violet-100 text-violet-600',
                    indigo: 'from-indigo-50 to-indigo-100 text-indigo-600',
                  };

                  return (
                    <button
                      key={card.title}
                      onClick={() => navigate(card.path)}
                      className="group bg-gradient-to-br from-[#F29A36] via-[#A8C79B] to-[#56D7C5] rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center shadow-sm group-hover:scale-[1.03] transition-transform flex-shrink-0"
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-white text-base">{card.title}</h4>
                      </div>
                      <p className="text-xs text-white/90 mb-2 leading-snug">{card.description}</p>
                      <span className="inline-flex items-center text-[11px] font-medium text-white group-hover:text-white/90">
                        Go to section
                        <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;















// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useLogout } from "../../hooks/useAuth";

// import {
//   LogOut,
//   BookOpen,
//   Users,
//   BarChart3,
//   Settings,
//   Trophy,
// } from "lucide-react";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const logout = useLogout();

//   // sidebar CLOSED by default
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [activityRange, setActivityRange] = useState("1m");

//   useEffect(() => {
//     window.history.pushState({ page: "admin-dashboard" }, "", window.location.href);
//     const handlePopState = (event) => {
//       event.preventDefault();
//       window.history.pushState({ page: "admin-dashboard" }, "", window.location.href);
//     };
//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, []);

//   const dashboardCards = [
//     {
//       title: "Manage Modules",
//       description: "Create and manage language courses, units, and lessons",
//       icon: BookOpen,
//       color: "blue",
//       path: "/admin/modules",
//     },
//     {
//       title: "Contest Management",
//       description: "Create and schedule weekly contests for learners",
//       icon: Trophy,
//       color: "orange",
//       path: "/admin/contests",
//     },
//     {
//       title: "User Management",
//       description: "View and manage learners and their progress",
//       icon: Users,
//       color: "green",
//       path: "/admin/users",
//     },
//     {
//       title: "Analytics",
//       description: "View platform statistics and insights",
//       icon: BarChart3,
//       color: "purple",
//       path: "/admin/analytics",
//     },
//     {
//       title: "Settings",
//       description: "Configure platform settings and preferences",
//       icon: Settings,
//       color: "gray",
//       disabled: true,
//     },
//   ];

//   const activitySeries = {
//     "1d": [{ name: "Today", value: 42 }],
//     "7d": [
//       { name: "Mon", value: 30 },
//       { name: "Tue", value: 45 },
//       { name: "Wed", value: 38 },
//       { name: "Thu", value: 52 },
//       { name: "Fri", value: 61 },
//       { name: "Sat", value: 48 },
//       { name: "Sun", value: 35 },
//     ],
//     "1m": [
//       { name: "Oct", value: 420 },
//       { name: "Nov", value: 530 },
//       { name: "Dec", value: 480 },
//     ],
//     "3m": [
//       { name: "Sep", value: 1200 },
//       { name: "Oct", value: 1420 },
//       { name: "Nov", value: 1500 },
//       { name: "Dec", value: 1480 },
//     ],
//   };

//   const userDistribution = [
//     { name: "Active", value: 62 },
//     { name: "New", value: 18 },
//     { name: "Dormant", value: 20 },
//   ];

//   const pieColors = ["#4f46e5", "#22c55e", "#f97316"];
//   const currentActivityData = activitySeries[activityRange] || activitySeries["1m"];

//   return (
//     <div className="h-screen bg-slate-50/60 overflow-hidden">

//       <div className="relative flex h-full">

//         {/* backdrop when sidebar open */}
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 z-30 bg-slate-900/40"
//             onClick={() => setSidebarOpen(false)}
//           />
//         )}

//         {/* SIDEBAR (slides in/out) */}
//         <aside
//           className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-slate-200 shadow-lg transition-transform duration-200 ease-out flex flex-col
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
//         >
//           {/* top */}
//           <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
//             <div className="flex items-center gap-3">
//               <div
//                 className="h-9 w-2 rounded-md"
//                 style={{ background: "linear-gradient(180deg,#7c3aed,#06b6d4)" }}
//               ></div>
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//                   Fluentify
//                 </p>
//                 <h1 className="text-base font-semibold text-slate-900">Admin Panel</h1>
//               </div>
//             </div>

//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md p-1"
//             >
//               ✕
//             </button>
//           </div>

//           {/* NAV ITEMS */}
//           <nav className="flex-1 px-3 py-3 space-y-1">

//             <button
//               onClick={() => navigate("/admin-dashboard")}
//               className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm bg-slate-900 text-slate-50 shadow-sm"
//             >
//               <BarChart3 className="w-4 h-4" />
//               <span>Overview</span>
//             </button>

//             <button
//               onClick={() => navigate("/admin/modules")}
//               className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
//             >
//               <BookOpen className="w-4 h-4" />
//               <span>Modules</span>
//             </button>

//             <button
//               onClick={() => navigate("/admin/contests")}
//               className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-amber-50 hover:text-amber-700"
//             >
//               <Trophy className="w-4 h-4" />
//               <span>Contests</span>
//             </button>

//             <button
//               onClick={() => navigate("/admin/users")}
//               className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
//             >
//               <Users className="w-4 h-4" />
//               <span>Users</span>
//             </button>

//             <button
//               onClick={() => navigate("/admin/analytics")}
//               className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-700"
//             >
//               <BarChart3 className="w-4 h-4" />
//               <span>Analytics</span>
//             </button>

//             <button
//               disabled
//               className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 border border-dashed border-slate-200 cursor-not-allowed"
//             >
//               <Settings className="w-4 h-4" />
//               <span>Settings (soon)</span>
//             </button>

//           </nav>
//         </aside>

//         {/* MAIN PANEL */}
//         <div className="flex-1 flex flex-col">

//           {/* TOP NAVBAR */}
//           <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur px-4 py-3 flex items-center justify-between">

//             {/* HAMBURGER (styled like your screenshot) */}
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-300 hover:bg-slate-100 transition"
//             >
//               <div className="space-y-1.5">
//                 <div className="h-0.5 w-5 bg-slate-700 rounded" />
//                 <div className="h-0.5 w-5 bg-slate-700 rounded" />
//                 <div className="h-0.5 w-5 bg-slate-700 rounded" />
//               </div>
//             </button>

//             {/* WELCOME TEXT BIGGER FONT */}
//             <div className="">
//               <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">
//                 Dashboard
//               </p>
//               <h2 className="text-xl font-bold text-slate-900">
//                 Welcome, Admin 👋!
//               </h2>
//             </div>

//             {/* PROFILE DROPDOWN (kept simple) */}
//             <div className="relative">
//               <button
//                 onClick={() => setProfileOpen(!profileOpen)}
//                 className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium"
//               >
//                 <div className="h-6 w-6 flex items-center justify-center bg-indigo-500 text-white rounded-full">
//                   A
//                 </div>
//                 <span>Admin</span>
//               </button>

//               {profileOpen && (
//                 <div className="absolute right-0 mt-2 bg-white border rounded-xl shadow py-2 w-40">
//                   <button
//                     onClick={logout}
//                     className="block w-full text-left px-3 py-2 hover:bg-slate-100 text-sm text-red-600"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </header>

//           {/* ===== REST OF YOUR CONTENT (unchanged) ===== */}

//           <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

//             {/* ACTIVITY + PIE CHART SECTION */}
//             <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//               <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-5">
//                 <div className="flex items-center justify-between mb-3">
//                   <div>
//                     <h3 className="text-sm font-semibold text-slate-900">Activity Overview</h3>
//                     <p className="text-xs text-slate-400">Lessons completed</p>
//                   </div>

//                   <div className="inline-flex items-center gap-1 rounded-full bg-slate-50 p-1 border border-slate-200">
//                     {["1d", "7d", "1m", "3m"].map((r) => (
//                       <button
//                         key={r}
//                         onClick={() => setActivityRange(r)}
//                         className={`px-2.5 py-0.5 rounded-full text-[11px] ${
//                           activityRange === r
//                             ? "bg-slate-900 text-white"
//                             : "text-slate-500 hover:bg-white"
//                         }`}
//                       >
//                         {r.toUpperCase()}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="h-56">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={currentActivityData}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
//                       <XAxis dataKey="name" tickLine={false} axisLine={false} />
//                       <YAxis tickLine={false} axisLine={false} />
//                       <Tooltip />
//                       <Line
//                         type="monotone"
//                         dataKey="value"
//                         stroke="#4f46e5"
//                         strokeWidth={2}
//                         dot={{ r: 3 }}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               {/* PIE CHART */}
//               <div className="bg-white rounded-2xl shadow-sm border p-5">
//                 <h3 className="text-sm font-semibold text-slate-900 mb-2">User Distribution</h3>

//                 <div className="h-40">
//                   <ResponsiveContainer>
//                     <PieChart>
//                       <Pie
//                         data={userDistribution}
//                         dataKey="value"
//                         nameKey="name"
//                         innerRadius={35}
//                         outerRadius={55}
//                         paddingAngle={3}
//                       >
//                         {userDistribution.map((entry, index) => (
//                           <Cell key={entry.name} fill={pieColors[index]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div className="grid grid-cols-3 text-xs mt-2">
//                   {userDistribution.map((u, i) => (
//                     <div key={u.name} className="flex items-center gap-1">
//                       <span
//                         className="h-2 w-2 rounded-full"
//                         style={{ backgroundColor: pieColors[i] }}
//                       />
//                       {u.name}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </section>

//             {/* QUICK ACTIONS */}
//             <section>
//               <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {dashboardCards.map((card) => {
//                   const Icon = card.icon;
//                   const colors = {
//                     blue: "from-sky-50 to-sky-100 text-sky-600",
//                     orange: "from-amber-50 to-amber-100 text-amber-600",
//                     green: "from-emerald-50 to-emerald-100 text-emerald-600",
//                     purple: "from-violet-50 to-violet-100 text-violet-600",
//                     gray: "from-slate-50 to-slate-100 text-slate-600",
//                   };

//                   return (
//                     <button
//                       key={card.title}
//                       onClick={() => !card.disabled && navigate(card.path)}
//                       disabled={card.disabled}
//                       className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
//                     >
//                       <div
//                         className={`h-10 w-10 rounded-xl bg-gradient-to-br ${colors[card.color]} flex items-center justify-center mb-3`}
//                       >
//                         <Icon className="w-5 h-5" />
//                       </div>

//                       <h4 className="font-semibold">{card.title}</h4>
//                       <p className="text-xs text-slate-500">{card.description}</p>
//                     </button>
//                   );
//                 })}
//               </div>
//             </section>

//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
