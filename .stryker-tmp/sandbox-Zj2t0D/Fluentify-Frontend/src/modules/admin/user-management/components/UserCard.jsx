// @ts-nocheck
import React from 'react';
import { Mail, Calendar } from 'lucide-react';

export const UserCard = ({ user, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 p-4 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer"
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-teal-500/20 via-sky-500/20 to-orange-500/20 rounded-full blur-2xl" />
      <div className="relative mb-3 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-base text-slate-50 truncate">{user.name}</h3>
      </div>

      <div className="relative space-y-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-teal-300" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-300" />
          <span className="truncate">
            Joined {new Date(user.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};