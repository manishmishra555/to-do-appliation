// src/pages/profile/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../api/client';
import { ChangePasswordForm } from '../../components/settings/ChangePasswordForm';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, deleteAccount } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'preferences' | 'billing'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // Form states - initialized from user data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    phone: '',
    location: ''
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/auth/me');
        if (response.status === 'success' && response.data?.user) {
          const user = response.data.user;
          setUserData(user);
          
          // Parse name into first and last name
          const nameParts = (user.name || '').split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setFormData({
            firstName,
            lastName,
            email: user.email || '',
            bio: user.bio || '',
            phone: user.phone || '',
            location: user.location || ''
          });
        }
      } catch (error: any) {
        console.error('Failed to fetch user profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch login history when security tab is active
  useEffect(() => {
    if (activeTab === 'security') {
      const fetchLoginHistory = async () => {
        try {
          const response = await api.get('/auth/login-history');
          if (response.status === 'success' && Array.isArray(response.data)) {
            setLoginHistory(response.data);
          }
        } catch (error: any) {
          console.error('Failed to fetch login history:', error);
        }
      };
      fetchLoginHistory();
    }
  }, [activeTab]);

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

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      
      await updateUser({
        name: fullName,
        bio: formData.bio,
        phone: formData.phone,
        location: formData.location
      });
      
      // Refresh user data
      const response = await api.get('/auth/me');
      if (response.status === 'success' && response.data?.user) {
        setUserData(response.data.user);
      }
      
      setIsEditing(false);
    } catch (error) {
      // Error is handled by updateUser
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original user data
    if (userData) {
      const nameParts = (userData.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData({
        firstName,
        lastName,
        email: userData.email || '',
        bio: userData.bio || '',
        phone: userData.phone || '',
        location: userData.location || ''
      });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This will permanently delete:\n\n' +
      '• Your account and profile\n' +
      '• All your tasks\n' +
      '• All your notifications\n' +
      '• All related data\n\n' +
      'This action cannot be undone!'
    );
    
    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Type "DELETE" to confirm account deletion:'
    );
    
    if (doubleConfirm !== 'DELETE') {
      toast.error('Account deletion cancelled');
      return;
    }

    try {
      setIsLoading(true);
      await deleteAccount();
      // deleteAccount will handle logout and redirect
    } catch (error: any) {
      setIsLoading(false);
      // Error is handled by deleteAccount
    }
  };

  // Format join date
  const formatJoinDate = (createdAt?: string) => {
    if (!createdAt) return 'Unknown';
    const date = new Date(createdAt);
    return date.getFullYear().toString();
  };

  const handlePhotoUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      try {
        setIsUploadingAvatar(true);
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await api.post('/auth/avatar', formData);

        if (response.status === 'success' && response.data?.user) {
          setUserData(response.data.user);
          // Update auth store
          await updateUser({ avatar: response.data.avatar });
          toast.success('Profile picture updated successfully');
        }
      } catch (error: any) {
        console.error('Failed to upload avatar:', error);
        toast.error(error.response?.data?.message || 'Failed to upload profile picture');
      } finally {
        setIsUploadingAvatar(false);
      }
    };
    input.click();
  };

  // Format password last changed date
  const formatPasswordLastChanged = (passwordChangedAt?: string) => {
    if (!passwordChangedAt) return 'Never';
    
    const date = new Date(passwordChangedAt);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) {
      return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
    } else if (diffMonths > 0) {
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    } else if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return 'Today';
    }
  };

  // Format login date
  const formatLoginDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  return (
    <div className="p-4 md:p-8 pt-6"> {/* Changed pt-0 to pt-6 to add some top padding */}
      <div className="mx-auto">
        {/* Page Heading - REMOVED BREADCRUMB SECTION FROM HERE */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              My Profile
            </h2>
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
                  className="size-24 md:size-32 rounded-full bg-cover bg-center ring-4 ring-slate-50 dark:ring-slate-700 bg-slate-200 dark:bg-slate-700"
                  style={{ 
                    backgroundImage: userData?.avatar 
                      ? `url("${userData.avatar}")` 
                      : user?.avatar 
                        ? `url("${user.avatar}")` 
                        : 'none'
                  }}
                >
                  {!userData?.avatar && !user?.avatar && (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-2xl font-bold">
                      {(userData?.name || user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  onClick={handlePhotoUpload}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label="Edit photo"
                >
                  {isUploadingAvatar ? (
                    <span className="material-symbols-outlined !text-[18px] animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined !text-[19px]">photo_camera</span>
                  )}
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {userData?.name || user?.name || 'Loading...'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {userData?.email || user?.email || 'Loading...'}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {userData?.role === 'admin' ? 'Admin' : 'Member'}
                  </span>
                  <span className="text-slate-400 text-sm">•</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    Active since {formatJoinDate(userData?.createdAt)}
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

                  {/* Email - Read Only */}
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
                        readOnly
                        disabled
                        className="w-full rounded-lg border px-4 pl-10 py-2.5 text-sm shadow-sm transition-all border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Email cannot be changed. Please contact support if you need to update your email.
                    </p>
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
                      disabled={isLoading}
                      className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveChanges}
                      disabled={isLoading}
                      className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined !text-[18px] animate-spin">refresh</span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined !text-[18px]">save</span>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Password Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined">lock</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Password</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Last changed {formatPasswordLastChanged(userData?.passwordChangedAt)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Update Password
                    </button>
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

                {/* Login History Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined">history</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Login History</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Recent login activity on your account
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {loginHistory.length === 0 ? (
                      <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4">
                        No login history available
                      </p>
                    ) : (
                      loginHistory.slice(0, 10).map((entry: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              entry.success 
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                                : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            }`}>
                              <span className="material-symbols-outlined text-[18px]">
                                {entry.success ? 'check_circle' : 'error'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {entry.device || 'Unknown Device'} • {entry.browser || 'Unknown Browser'} • {entry.os || 'Unknown OS'}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {entry.ipAddress || 'Unknown IP'} • {formatLoginDate(entry.loginAt)}
                              </p>
                            </div>
                          </div>
                          {!entry.success && entry.failureReason && (
                            <span className="text-xs text-red-600 dark:text-red-400">
                              {entry.failureReason}
                            </span>
                          )}
                        </div>
                      ))
                    )}
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

      {/* Change Password Form Modal */}
      {showPasswordForm && (
        <ChangePasswordForm
          onClose={() => setShowPasswordForm(false)}
          onSuccess={() => {
            toast.success('Password changed successfully!');
            setShowPasswordForm(false);
          }}
        />
      )}
    </div>
  );
};
