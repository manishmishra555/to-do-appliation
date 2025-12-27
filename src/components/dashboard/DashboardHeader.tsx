// src/components/dashboard/DashboardHeader.tsx
import React, { useState } from 'react';

interface DashboardHeaderProps {
  userName: string;
  pendingCount: number;
  onMenuClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  userName, 
  pendingCount,
  onMenuClick 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="
      flex items-center justify-between 
      px-4 md:px-8 py-5 
      bg-white dark:bg-[#1e293b] 
      border-b border-[#e5e7eb] dark:border-gray-700 
      shrink-0
    ">
      {/* Left Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[#111418] dark:text-white text-xl md:text-2xl font-bold">
          Good Morning, {userName.split(' ')[0]}
        </h2>
        <p className="text-[#617589] dark:text-gray-400 text-sm">
          You have {pendingCount} pending task{pendingCount !== 1 ? 's' : ''} for today.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex w-72 h-10 items-center rounded-lg bg-[#f0f2f4] dark:bg-gray-800 px-3">
          <span className="material-symbols-outlined text-[#617589] mr-2">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="
              w-full bg-transparent border-none 
              text-sm text-[#111418] dark:text-white 
              placeholder-[#617589] 
              focus:outline-none focus:ring-0
            "
          />
        </div>

        {/* Notifications */}
        <button className="
          relative p-2 rounded-full 
          hover:bg-[#f0f2f4] dark:hover:bg-gray-700 
          text-[#617589] dark:text-gray-400 
          transition-colors
        ">
          <span className="material-symbols-outlined">
            notifications
          </span>
          <span className="
            absolute top-1.5 right-1.5 
            size-2 bg-red-500 rounded-full 
            border-2 border-white dark:border-[#1e293b]
          "></span>
        </button>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-[#617589]"
          onClick={onMenuClick}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;