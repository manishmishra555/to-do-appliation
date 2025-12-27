// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/projects', icon: 'view_kanban', label: 'Projects' },
    { path: '/tasks', icon: 'check_box', label: 'My Tasks' },
    { path: '/calendar', icon: 'calendar_month', label: 'Calendar' },
    { path: '/analytics', icon: 'analytics', label: 'Analytics' },
  ];

  const settingsItems = [
    { path: '/settings', icon: 'settings', label: 'Settings' },
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

      {/* Side Navigation */}
      <aside className={`
        fixed md:relative
        w-64 bg-white dark:bg-slate-900 
        border-r border-slate-200 dark:border-slate-800 
        flex-shrink-0 flex-col h-full z-50
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex
      `}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            TaskMaster
          </h1>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 px-4 flex flex-col gap-2 py-4">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                location.pathname.includes(item.path) 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              onClick={onClose}
            >
              <span className="material-symbols-outlined">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          
          {/* Team Button (Placeholder) */}
          <button 
            className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group text-left"
            onClick={onClose}
          >
            <span className="material-symbols-outlined group-hover:text-primary transition-colors">
              group
            </span>
            <span className="font-medium">Team</span>
          </button>
        </nav>
        
        {/* Settings Navigation */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          {settingsItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                location.pathname.includes(item.path) 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              onClick={onClose}
            >
              <span className="material-symbols-outlined">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
};