// src/pages/settings/SettingsPage.tsx
import React, { useState } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { useAuthStore } from '../../store/useAuthStore';
import { ChangePasswordForm } from '../../components/settings/ChangePasswordForm';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const [compactMode, setCompactMode] = useState(false);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState('Weekly');
  
  // Password form state
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion feature coming soon');
    }
  };

  const handlePasswordChangeSuccess = () => {
    toast.success('Password changed successfully!');
  };

  return (
    <>
      <div className="p-4 md:p-8">
        <div className="mx-auto">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-[#111418] dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-[#617589] dark:text-gray-400 text-lg">
              Manage your workspace appearance, notifications, and account details.
            </p>
          </div>

          {/* Appearance Section */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">palette</span>
              Appearance
            </h2>
            
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden">
              {/* Theme Selector */}
              <div className="p-6 border-b border-[#e5e7eb] dark:border-[#2d3748]">
                <label className="block text-sm font-medium text-[#111418] dark:text-white mb-3">
                  Interface Theme
                </label>
                <div className="flex bg-[#f0f2f4] dark:bg-[#101922] p-1.5 rounded-lg w-full max-w-md">
                  <label className="flex-1 cursor-pointer relative">
                    <input 
                      className="peer sr-only" 
                      name="theme" 
                      type="radio" 
                      value="Light"
                      checked={theme === 'light'}
                      onChange={() => handleThemeChange('light')}
                    />
                    <div className="flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md text-[#617589] dark:text-gray-400 peer-checked:bg-white dark:peer-checked:bg-[#2d3748] peer-checked:text-[#111418] dark:peer-checked:text-white peer-checked:shadow-sm transition-all duration-200 hover:text-[#111418] dark:hover:text-white">
                      <span className="material-symbols-outlined text-lg mr-2">light_mode</span>
                      Light
                    </div>
                  </label>
                  
                  <label className="flex-1 cursor-pointer relative">
                    <input 
                      className="peer sr-only" 
                      name="theme" 
                      type="radio" 
                      value="Dark"
                      checked={theme === 'dark'}
                      onChange={() => handleThemeChange('dark')}
                    />
                    <div className="flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md text-[#617589] dark:text-gray-400 peer-checked:bg-white dark:peer-checked:bg-[#2d3748] peer-checked:text-[#111418] dark:peer-checked:text-white peer-checked:shadow-sm transition-all duration-200 hover:text-[#111418] dark:hover:text-white">
                      <span className="material-symbols-outlined text-lg mr-2">dark_mode</span>
                      Dark
                    </div>
                  </label>
                  
                  <label className="flex-1 cursor-pointer relative">
                    <input 
                      className="peer sr-only" 
                      name="theme" 
                      type="radio" 
                      value="System"
                      checked={theme === 'system'}
                      onChange={() => handleThemeChange('system')}
                    />
                    <div className="flex items-center justify-center py-2 px-4 text-sm font-medium rounded-md text-[#617589] dark:text-gray-400 peer-checked:bg-white dark:peer-checked:bg-[#2d3748] peer-checked:text-[#111418] dark:peer-checked:text-white peer-checked:shadow-sm transition-all duration-200 hover:text-[#111418] dark:hover:text-white">
                      <span className="material-symbols-outlined text-lg mr-2">settings_brightness</span>
                      System
                    </div>
                  </label>
                </div>
                <p className="mt-2 text-xs text-[#617589] dark:text-gray-500">
                  Syncs with your operating system settings.
                </p>
              </div>

              {/* Compact Mode */}
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-[#f0f2f4] dark:bg-[#2d3748] flex items-center justify-center text-[#111418] dark:text-white shrink-0">
                    <span className="material-symbols-outlined">view_compact</span>
                  </div>
                  <div>
                    <p className="text-base font-medium text-[#111418] dark:text-white">Compact Mode</p>
                    <p className="text-sm text-[#617589] dark:text-gray-400">
                      Reduce spacing between task items for higher density.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={compactMode}
                    onChange={(e) => setCompactMode(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">notifications</span>
              Notifications
            </h2>
            
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden divide-y divide-[#e5e7eb] dark:divide-[#2d3748]">
              {/* Desktop Notifications */}
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-[#f0f2f4] dark:bg-[#2d3748] flex items-center justify-center text-[#111418] dark:text-white shrink-0">
                    <span className="material-symbols-outlined">desktop_windows</span>
                  </div>
                  <div>
                    <p className="text-base font-medium text-[#111418] dark:text-white">Desktop Notifications</p>
                    <p className="text-sm text-[#617589] dark:text-gray-400">
                      Get push notifications when tasks are due.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={desktopNotifications}
                    onChange={(e) => setDesktopNotifications(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Email Digest */}
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-[#f0f2f4] dark:bg-[#2d3748] flex items-center justify-center text-[#111418] dark:text-white shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <p className="text-base font-medium text-[#111418] dark:text-white">Email Digest</p>
                    <p className="text-sm text-[#617589] dark:text-gray-400">
                      Receive a summary of upcoming tasks.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <select 
                    value={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.value)}
                    className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-white dark:bg-[#2d3748] dark:text-white cursor-pointer shadow-sm"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Never">Never</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Account Section */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              Account
            </h2>
            
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden divide-y divide-[#e5e7eb] dark:divide-[#2d3748]">
              {/* Profile Summary */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="bg-center bg-no-repeat bg-cover rounded-full size-16 ring-4 ring-white dark:ring-[#2d3748]"
                    style={{ 
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCV2PZ0gvcIKd_wxrSImlX7JtKLygwcGuOD64o17xVFi4ehTy6U14QZP417e8GvFl8lBy4Y2qckDPvrfnqTL5aX_2nqU3aeLQxnuGd-XJ85xZVDsFoVwMVxBjGKxJmuFfV9VmGGAYOK0l2K056iuCOoFDbONP_hEcRjAI9h37TgzlSrbtvOp1MNIRNjn29UskTGY0t7lTtN3-NjOJdK1eylGsPNoDTlqfZz4g1tWCEsaqyB8RS7Tln3lD_wtm0rF7gf6eQlZ8dkhgTu")' 
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white">{user?.name || 'Alex Morgan'}</h3>
                    <p className="text-sm text-[#617589] dark:text-gray-400">{user?.email || 'alex.morgan@example.com'}</p>
                  </div>
                </div>
                <button 
                  className="px-4 py-2 bg-white dark:bg-[#2d3748] border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => toast.success('Edit profile feature coming soon')}
                >
                  Edit Profile
                </button>
              </div>

              {/* Password */}
              <div 
                className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#2d3748]/50 transition-colors cursor-pointer group"
                onClick={() => setShowPasswordForm(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-[#f0f2f4] dark:bg-[#2d3748] flex items-center justify-center text-[#111418] dark:text-white shrink-0 group-hover:bg-white dark:group-hover:bg-[#374151] transition-colors">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <p className="text-base font-medium text-[#111418] dark:text-white">Change Password</p>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
              </div>

              {/* Log Out */}
              <div 
                className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#2d3748]/50 transition-colors cursor-pointer group"
                onClick={handleLogout}
              >
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-[#f0f2f4] dark:bg-[#2d3748] flex items-center justify-center text-[#111418] dark:text-white shrink-0 group-hover:bg-white dark:group-hover:bg-[#374151] transition-colors">
                    <span className="material-symbols-outlined">logout</span>
                  </div>
                  <p className="text-base font-medium text-[#111418] dark:text-white">Log Out</p>
                </div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 border border-red-100 dark:border-red-900/30 rounded-xl bg-red-50/50 dark:bg-red-900/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-red-600 dark:text-red-400 font-bold text-base">Delete Account</h4>
                <p className="text-red-500/80 dark:text-red-400/70 text-sm mt-1">
                  Permanently remove your account and all of its content from the ToDo App servers.
                </p>
              </div>
              <button 
                className="shrink-0 px-4 py-2 bg-white dark:bg-transparent border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Change Password Form Modal */}
      {showPasswordForm && (
        <ChangePasswordForm 
          onClose={() => setShowPasswordForm(false)}
          onSuccess={handlePasswordChangeSuccess}
        />
      )}
    </>
  );
};

export default SettingsPage;