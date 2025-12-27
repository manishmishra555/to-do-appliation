// src/pages/profile/ProfilePage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'preferences' | 'billing'>('info');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: user?.email || 'alex.johnson@example.com',
    bio: 'Product Manager @ TechFlow. Passionate about productivity and clean design.',
    jobTitle: 'Product Manager',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA'
  });

  // Stats
  const [stats] = useState({
    tasksCompleted: 85,
    openTasks: 12,
    completedThisWeek: 34,
    productivityScore: 78
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    if (user) {
      updateProfile({
        ...user,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email
      });
    }
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      firstName: 'Alex',
      lastName: 'Johnson',
      email: user?.email || 'alex.johnson@example.com',
      bio: 'Product Manager @ TechFlow. Passionate about productivity and clean design.',
      jobTitle: 'Product Manager',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA'
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion feature coming soon');
    }
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success('Profile photo updated successfully');
        // Here you would typically upload the file to your server
      }
    };
    input.click();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-[1000px]">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 text-sm">
          <Link 
            to="/dashboard" 
            className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-white font-medium">Profile</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              My Profile
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Manage your personal information and account security.
            </p>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start md:justify-between">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-center text-center md:text-left w-full">
              <div className="relative group">
                <div 
                  className="size-24 md:size-32 rounded-full bg-cover bg-center ring-4 ring-slate-50 dark:ring-slate-700"
                  style={{ 
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAsgfuM3dx8a5rEM-IlOOMpoS6ymBaOm8KHzNRQKs-NGC4DV-4NiSPkR9ASawAwbwJ-PSboaQpYHeRmgTj02cCTBKm5XB5973Zg0a2sro4WU4z7DYIt5mqYePLhDkpfeREJ-vz-ihhaWTeZnjT8w8pDPSfWY9EYWk-7QH4zJWVKW780pbbKzqNURJb2mp_uzT2tycBH2pmMWvSE911UaS9Fz5yUJu15B6Bu-3oVplY5gZrY0pHF_Uwwyy1bMp2RSxfolLArnQIK7osT")' 
                  }}
                />
                <button 
                  onClick={handlePhotoUpload}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                  aria-label="Edit photo"
                >
                  <span className="material-symbols-outlined !text-[18px]">photo_camera</span>
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user?.name || 'Alex Johnson'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {user?.email || 'alex.johnson@example.com'}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Pro Member
                  </span>
                  <span className="text-slate-400 text-sm">•</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    Active since 2021
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-3 border-b-[3px] whitespace-nowrap text-sm font-medium transition-all ${
                activeTab === 'info'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 border-b-[3px] whitespace-nowrap text-sm font-medium transition-all ${
                activeTab === 'security'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-3 border-b-[3px] whitespace-nowrap text-sm font-medium transition-all ${
                activeTab === 'preferences'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300'
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`pb-3 border-b-[3px] whitespace-nowrap text-sm font-medium transition-all ${
                activeTab === 'billing'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300'
              }`}
            >
              Billing
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details Card */}
            {activeTab === 'info' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Basic Information
                  </h3>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    {isEditing ? 'Cancel editing' : 'Edit details'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm transition-all ${
                        isEditing
                          ? 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm transition-all ${
                        isEditing
                          ? 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <span className="material-symbols-outlined !text-[18px]">mail</span>
                      </span>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full rounded-lg border px-4 pl-10 py-2.5 text-sm shadow-sm transition-all ${
                          isEditing
                            ? 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      To change your email, please contact support.
                    </p>
                  </div>

                  {/* Job Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Job Title
                    </label>
                    <input
                      name="jobTitle"
                      type="text"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm transition-all ${
                        isEditing
                          ? 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm transition-all ${
                        isEditing
                          ? 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Bio / Introduction
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full rounded-lg border px-4 py-2.5 text-sm shadow-sm resize-none transition-all ${
                        isEditing
                          ? 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-primary'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 flex items-center justify-end gap-3">
                    <button
                      onClick={handleCancelEdit}
                      className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined !text-[18px]">save</span>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined">lock</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Password</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Last changed 3 months ago
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/settings?tab=password"
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Update Password
                  </Link>
                </div>
                
                {/* Two-factor authentication section */}
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="text-md font-bold text-slate-900 dark:text-white mb-4">
                    Two-Factor Authentication
                  </h4>
                  <div className="flex items-center justify-between">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Add an extra layer of security to your account
                    </p>
                    <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                  Preferences
                </h3>
                <div className="space-y-6">
                  {/* Notification preferences */}
                  <div>
                    <h4 className="text-md font-bold text-slate-900 dark:text-white mb-3">
                      Email Notifications
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded text-primary" defaultChecked />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Task reminders and updates
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded text-primary" defaultChecked />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Weekly productivity reports
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="rounded text-primary" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Marketing communications
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                  Billing Information
                </h3>
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 dark:text-white">Pro Plan</h4>
                      <span className="text-primary font-bold">$29/month</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Billed monthly • Next charge: Dec 15, 2023
                    </p>
                    <button className="w-full py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      Manage Subscription
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Stats */}
          <div className="space-y-6">
            {/* Completion Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Productivity Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Tasks Completed
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold">
                      {stats.tasksCompleted}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.tasksCompleted}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 text-sm">Open Tasks</span>
                  <span className="font-bold text-slate-900 dark:text-white">{stats.openTasks}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400 text-sm">Completed this week</span>
                  <span className="font-bold text-slate-900 dark:text-white">{stats.completedThisWeek}</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600 dark:text-slate-400 text-sm">Productivity Score</span>
                  <span className="font-bold text-slate-900 dark:text-white">{stats.productivityScore}/100</span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 p-6">
              <h3 className="text-red-700 dark:text-red-400 font-bold mb-2">
                Delete Account
              </h3>
              <p className="text-red-600/80 dark:text-red-400/70 text-sm mb-4">
                Permanently delete your account and all of your content. This action cannot be undone.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="w-full py-2 rounded-lg bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};