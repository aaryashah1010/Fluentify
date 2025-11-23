import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  Languages,
  Trophy,
  User,
  Settings,
  BarChart,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const menu = [
    {
      label: "Home",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/dashboard",
    },
    {
      label: "Modules",
      icon: <Languages className="w-5 h-5" />,
      path: "/language-modules",
    },
    {
      label: "Contests",
      icon: <Trophy className="w-5 h-5" />,
      path: "/contests",
    },
    {
      label: "Progress",
      icon: <BarChart className="w-5 h-5" />,
      path: "/progress",
    },
    {
      label: "Profile",
      icon: <User className="w-5 h-5" />,
      path: "/profile",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login?logout=true");
  };

  return (
    <div className="h-screen w-64 bg-slate-950/95 backdrop-blur-2xl shadow-2xl border-r border-white/10 flex flex-col text-slate-100">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-emerald-400 to-orange-400 text-transparent bg-clip-text">
          Fluentify
        </h1>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-orange-500 text-white shadow-md"
                  : "text-slate-200 hover:bg-white/10"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
