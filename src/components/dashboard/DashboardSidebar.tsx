// src/components/dashboard/DashboardSidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  isOpen, 
  onClose, 
  currentPage 
}) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { icon: 'folder', label: 'Projects', path: '/projects' },
    { icon: 'calendar_today', label: 'Calendar', path: '/calendar' },
    { icon: 'group', label: 'Team', path: '/team' },
    { icon: 'settings', label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative
        w-64 h-full
        bg-white dark:bg-[#1e293b] 
        border-r border-[#e5e7eb] dark:border-gray-700
        flex flex-col z-50
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex gap-3 items-center mb-8">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">
                checklist
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#111418] dark:text-white text-lg font-bold">
                TaskMaster
              </h1>
              <p className="text-[#617589] dark:text-gray-400 text-xs">
                Pro Workspace
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg
                  transition-colors
                  ${location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-[#617589] dark:text-gray-400 hover:bg-[#f0f2f4] dark:hover:bg-gray-700'
                  }
                `}
                onClick={onClose}
              >
                <span className="material-symbols-outlined">
                  {item.icon}
                </span>
                <p className="text-sm font-medium">{item.label}</p>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Section */}
        <div className="mt-auto p-6 border-t border-[#e5e7eb] dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">
                person
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111418] dark:text-white">
                {user?.name || 'Alex Morgan'}
              </p>
              <p className="text-xs text-[#617589] dark:text-gray-400">
                {user?.email || 'alex@example.com'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;