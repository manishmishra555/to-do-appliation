// src/components/layout/Header.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationPanel } from '../notifications/NotificationPanel';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/projects')) return 'Projects';
    if (path.includes('/tasks')) return 'My Tasks';
    if (path.includes('/calendar')) return 'Calendar';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/profile')) return 'Profile';
    return 'Dashboard';
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/projects')) return 'All Projects';
    if (path.includes('/tasks')) return 'All Tasks';
    if (path.includes('/calendar')) return 'Monthly View';
    if (path.includes('/analytics')) return 'Overview';
    if (path.includes('/settings')) return 'General';
    if (path.includes('/profile')) return 'My Profile';
    return 'Overview';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle dropdown item click
  const handleDropdownItemClick = (action: string) => {
    setIsDropdownOpen(false);
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'logout':
        logout();
        navigate('/login');
        break;
    }
  };

  const menuItems = [
    {
      label: 'My Account',
      icon: 'account_circle',
      action: 'profile'
    },
    {
      label: 'Settings',
      icon: 'settings',
      action: 'settings'
    },
    {
      type: 'divider' as const
    },
    {
      label: 'Log Out',
      icon: 'logout',
      action: 'logout',
      className: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
    }
  ];

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-8 flex-shrink-0 z-50">
        {/* Left Section - Mobile Menu & Title */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            onClick={onMenuClick}
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          <span className="font-bold text-lg text-slate-900 dark:text-white">{getPageTitle()}</span>
        </div>
        
        {/* Breadcrumbs - Desktop */}
        <div className="hidden md:flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
          <span>Workspace</span>
          <span className="material-symbols-outlined text-base mx-2">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-semibold">{getBreadcrumb()}</span>
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-3 lg:gap-4 ml-auto">
          {/* Notifications Bell */}
          <div className="notification-bell">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`relative flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors ${
                isNotificationsOpen ? 'text-primary bg-primary/10' : ''
              }`}
            >
              <span className="material-symbols-outlined text-2xl">
                notifications
              </span>
              {/* Unread Indicator */}
              <div className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
            </button>
          </div>
          
          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
          
          {/* User Profile with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center gap-3 pl-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors pr-3 py-1.5 group"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div 
                className="size-8 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-700 overflow-hidden"
                style={{ 
                  backgroundImage: user?.avatar ? `url("${user.avatar}")` : 'none',
                  backgroundColor: !user?.avatar ? '#4c99e6' : 'transparent'
                }}
              >
                {!user?.avatar && user?.name && (
                  <span className="text-white text-sm font-semibold flex items-center justify-center h-full">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start hidden lg:flex">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                  {user?.name || 'User'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                  Pro Plan
                </span>
              </div>
              <span className={`material-symbols-outlined text-slate-400 text-xl hidden lg:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
                >
                  {/* User Info Section */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div 
                        className="size-10 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-600"
                        style={{ 
                          backgroundImage: user?.avatar ? `url("${user.avatar}")` : 'none',
                          backgroundColor: !user?.avatar ? '#4c99e6' : 'transparent'
                        }}
                      >
                        {!user?.avatar && user?.name && (
                          <span className="text-white text-base font-semibold flex items-center justify-center h-full">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    {menuItems.map((item, index) => (
                      item.type === 'divider' ? (
                        <div 
                          key={`divider-${index}`}
                          className="h-px bg-slate-100 dark:bg-slate-700 my-1"
                        />
                      ) : (
                        <button
                          key={item.action}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${item.className || 'text-slate-700 dark:text-slate-300'}`}
                          onClick={() => handleDropdownItemClick(item.action)}
                        >
                          <span className="material-symbols-outlined text-xl">
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </button>
                      )
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </>
  );
};