
// src/components/settings/ChangePasswordForm.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

interface ChangePasswordFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ 
  onClose, 
  onSuccess 
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: '', color: 'gray' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthMap = [
      { strength: 1, text: 'Too weak', color: 'red' },
      { strength: 2, text: 'Weak', color: 'orange' },
      { strength: 3, text: 'Good', color: 'blue' },
      { strength: 4, text: 'Strong', color: 'green' }
    ];

    return strengthMap[score - 1] || strengthMap[0];
  };

  const passwordStrength = checkPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Password changed successfully');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      toast.error('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-orange-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-200 dark:bg-gray-700';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-[600px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col gap-1">
              <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight">
                Change Password
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Update your password to keep your account secure.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label 
                htmlFor="current_password" 
                className="text-gray-900 dark:text-white text-sm font-medium leading-normal"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 h-12 px-4 pr-12 text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showCurrentPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label 
                htmlFor="new_password" 
                className="text-gray-900 dark:text-white text-sm font-medium leading-normal"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 h-12 px-4 pr-12 text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showNewPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex gap-1 h-1.5 w-full">
                    {[1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className={`flex-1 rounded-full h-full transition-all duration-300 ${
                          index <= passwordStrength.strength
                            ? getStrengthColor(passwordStrength.color)
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength.color === 'red' ? 'text-red-600 dark:text-red-400' :
                    passwordStrength.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                    passwordStrength.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {passwordStrength.text} password
                  </p>
                </div>
              )}
              
              {/* Password Requirements */}
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-2">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    {newPassword.length >= 8 ? 'check_circle' : 'circle'}
                  </span>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    {/[A-Z]/.test(newPassword) ? 'check_circle' : 'circle'}
                  </span>
                  Contains uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    {/[0-9]/.test(newPassword) ? 'check_circle' : 'circle'}
                  </span>
                  Contains a number
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    {/[^A-Za-z0-9]/.test(newPassword) ? 'check_circle' : 'circle'}
                  </span>
                  Contains a special character
                </li>
              </ul>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label 
                htmlFor="confirm_password" 
                className="text-gray-900 dark:text-white text-sm font-medium leading-normal"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 h-12 px-4 pr-12 text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {confirmPassword && newPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 gap-4">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium text-sm px-2 py-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-blue-600 text-white font-medium text-sm px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">
                      refresh
                    </span>
                    Changing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">
                      lock_reset
                    </span>
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};