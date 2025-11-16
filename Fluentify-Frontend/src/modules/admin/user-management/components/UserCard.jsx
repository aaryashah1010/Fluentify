import React from 'react';
import { Mail, Calendar } from 'lucide-react';

export const UserCard = ({ user, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="
        bg-white 
        border border-gray-200 
        rounded-2xl 
        p-5 
        cursor-pointer
        shadow-sm
        hover:shadow-xl 
        hover:scale-[1.02]
        transition-all 
        duration-300
      "
    >
      {/* Name */}
      <div className="mb-4">
        <h3
          className="
            text-xl font-extrabold 
            bg-gradient-to-r from-orange-500 via-amber-600 to-teal-500 
            bg-clip-text text-transparent
          "
        >
          {user.name}
        </h3>
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm">
        {/* Email */}
        <div className="flex items-center gap-2 text-gray-700">
          <Mail className="w-4 h-4 text-orange-500" />
          <span className="truncate">{user.email}</span>
        </div>

        {/* Join Date */}
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-4 h-4 text-teal-500" />
          <span>
            Joined {new Date(user.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
