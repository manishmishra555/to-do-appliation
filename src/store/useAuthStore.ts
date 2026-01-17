import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api/client';
import toast from 'react-hot-toast';

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;
  emailFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  language: string;
  timezone: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  createdAt?: string;
  role?: string;
  settings: UserSettings;
}

interface AuthResponse {
  data: {
    user: User;
    tokens: {
      access: string;
      refresh: string;
    };
  };
}

interface UpdateUserResponse {
  data: User;
}

interface UpdateSettingsResponse {
  data: UserSettings;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  
  // Settings actions
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
}

// Default settings
const defaultSettings: UserSettings = {
  theme: 'system',
  compactMode: false,
  desktopNotifications: true,
  emailNotifications: true,
  emailFrequency: 'weekly',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

// Mock user for development (remove in production)
const mockUser: User = {
  id: '1',
  name: 'Alex Morgan',
  email: 'alex@example.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV2PZ0gvcIKd_wxrSImlX7JtKLygwcGuOD64o17xVFi4ehTy6U14QZP417e8GvFl8lBy4Y2qckDPvrfnqTL5aX_2nqU3aeLQxnuGd-XJ85xZVDsFoVwMVxBjGKxJmuFfV9VmGGAYOK0l2K056iuCOoFDbONP_hEcRjAI9h37TgzlSrbtvOp1MNIRNjn29UskTGY0t7lTtN3-NjOJdK1eylGsPNoDTlqfZz4g1tWCEsaqyB8RS7Tln3lD_wtm0rF7gf6eQlZ8dkhgTu',
  settings: defaultSettings,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Always use real API
          const response = await api.post('/auth/login', { email, password });
          
          // Backend returns: { status: 'success', data: { user: {...}, tokens: {...} } }
          if (response.status === 'success' && response.data) {
            const { user, tokens } = response.data;
            
            // Store tokens
            if (tokens?.access) {
              localStorage.setItem('accessToken', tokens.access);
            }
            if (tokens?.refresh) {
              localStorage.setItem('refreshToken', tokens.refresh);
            }
            
            set({ user, isAuthenticated: true, isLoading: false });
            toast.success('Logged in successfully!');
          } else {
            throw new Error('Invalid response format from server');
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Always use real API
          const response = await api.post('/auth/register', { name, email, password });
          
          // Backend returns: { status: 'success', data: { user: {...}, tokens: {...} } }
          if (response.status === 'success' && response.data) {
            const { user, tokens } = response.data;
            
            // Store tokens
            if (tokens?.access) {
              localStorage.setItem('accessToken', tokens.access);
            }
            if (tokens?.refresh) {
              localStorage.setItem('refreshToken', tokens.refresh);
            }
            
            set({ user, isAuthenticated: true, isLoading: false });
            toast.success('Account created successfully!');
          } else {
            throw new Error('Invalid response format from server');
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Try to call logout API (optional - can fail without issues)
          try {
            await api.post('/auth/logout');
          } catch (error) {
            // Ignore errors on logout - we'll clear local state anyway
            console.log('Logout API call failed (optional)', error);
          }
          
          // Clear tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          toast.success('Logged out successfully');
        } catch (error) {
          // Ignore errors on logout - we'll clear local state anyway
          console.log('Logout failed', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
          
          // Redirect to login page
          window.location.href = '/auth/login';
        }
      },

      updateUser: async (userData: Partial<User>) => {
        set({ isLoading: true });
        try {
          const response = await api.put('/auth/profile', userData);
          
          if (response.status === 'success' && response.data?.user) {
            set({ user: response.data.user, isLoading: false });
            toast.success('Profile updated successfully!');
          } else {
            throw new Error('Invalid response format from server');
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Update failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      updateSettings: async (settings: Partial<UserSettings>) => {
        set({ isLoading: true });
        try {
          const response = await api.put('/auth/settings', settings);
          
          if (response.status === 'success' && response.data) {
            const currentUser = get().user;
            const updatedUser = {
              ...currentUser!,
              settings: response.data,
            };
            
            set({ user: updatedUser, isLoading: false });
            
            // Update theme in localStorage
            if (settings.theme) {
              localStorage.setItem('theme', settings.theme);
            }
            
            toast.success('Settings updated successfully!');
          } else {
            throw new Error('Invalid response format from server');
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Settings update failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      deleteAccount: async () => {
        set({ isLoading: true });
        try {
          await api.delete('/auth/account');
          
          // Clear all stored data
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('auth-storage');
          
          toast.success('Account deleted successfully');
          
          // Redirect after success
          setTimeout(() => {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
            window.location.href = '/auth/login';
          }, 1500);
          
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Account deletion failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);