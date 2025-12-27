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
      user: process.env.NODE_ENV === 'development' ? mockUser : null,
      isAuthenticated: process.env.NODE_ENV === 'development' ? true : false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // In development, use mock login
          if (process.env.NODE_ENV === 'development') {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockUserWithEmail = {
              ...mockUser,
              email,
              name: email.split('@')[0] || 'User',
            };
            
            set({ 
              user: mockUserWithEmail, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            localStorage.setItem('accessToken', 'mock-access-token');
            localStorage.setItem('refreshToken', 'mock-refresh-token');
            
            toast.success('Logged in successfully!');
            return;
          }

          // Production API call
          const response = await api.post('/auth/login', { email, password });
          const authResponse = response as AuthResponse;
          const { user, tokens } = authResponse.data;
          
          localStorage.setItem('accessToken', tokens.access);
          localStorage.setItem('refreshToken', tokens.refresh);
          
          set({ user, isAuthenticated: true, isLoading: false });
          toast.success('Logged in successfully!');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // In development, use mock registration
          if (process.env.NODE_ENV === 'development') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newUser = {
              id: Date.now().toString(),
              name,
              email,
              settings: defaultSettings,
            };
            
            set({ 
              user: newUser, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            localStorage.setItem('accessToken', 'mock-access-token');
            localStorage.setItem('refreshToken', 'mock-refresh-token');
            
            toast.success('Account created successfully!');
            return;
          }

          // Production API call
          const response = await api.post('/auth/register', { name, email, password });
          const authResponse = response as AuthResponse;
          const { user, tokens } = authResponse.data;
          
          localStorage.setItem('accessToken', tokens.access);
          localStorage.setItem('refreshToken', tokens.refresh);
          
          set({ user, isAuthenticated: true, isLoading: false });
          toast.success('Account created successfully!');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Clear tokens first
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          
          // Try to call logout API (optional - can fail without issues)
          if (process.env.NODE_ENV !== 'development') {
            await api.post('/auth/logout');
          }
          
          toast.success('Logged out successfully');
        } catch (error) {
          // Ignore errors on logout - we'll clear local state anyway
          console.log('Logout API call failed (optional)', error);
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
          // In development, simulate update
          if (process.env.NODE_ENV === 'development') {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const currentUser = get().user;
            const updatedUser = {
              ...currentUser!,
              ...userData,
            };
            
            set({ user: updatedUser as User, isLoading: false });
            toast.success('Profile updated successfully!');
            return;
          }

          // Production API call
          const response = await api.put('/auth/profile', userData);
          const updateResponse = response as UpdateUserResponse;
          
          set({ user: updateResponse.data, isLoading: false });
          toast.success('Profile updated successfully!');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Update failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      updateSettings: async (settings: Partial<UserSettings>) => {
        set({ isLoading: true });
        try {
          // In development, simulate update
          if (process.env.NODE_ENV === 'development') {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const currentUser = get().user;
            if (!currentUser) throw new Error('No user logged in');
            
            const updatedUser = {
              ...currentUser,
              settings: {
                ...currentUser.settings,
                ...settings,
              },
            };
            
            set({ user: updatedUser, isLoading: false });
            
            // Update theme in localStorage
            if (settings.theme) {
              localStorage.setItem('theme', settings.theme);
            }
            
            toast.success('Settings updated successfully!');
            return;
          }

          // Production API call
          const response = await api.put('/auth/settings', settings);
          const updateResponse = response as UpdateSettingsResponse;
          
          const currentUser = get().user;
          const updatedUser = {
            ...currentUser!,
            settings: updateResponse.data,
          };
          
          set({ user: updatedUser, isLoading: false });
          
          // Update theme in localStorage
          if (settings.theme) {
            localStorage.setItem('theme', settings.theme);
          }
          
          toast.success('Settings updated successfully!');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Settings update failed';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      deleteAccount: async () => {
        set({ isLoading: true });
        try {
          // In development, simulate deletion
          if (process.env.NODE_ENV === 'development') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Clear tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('auth-storage');
            
            toast.success('Account deleted successfully');
            
            // Redirect to login after a delay
            setTimeout(() => {
              set({ 
                user: null, 
                isAuthenticated: false, 
                isLoading: false 
              });
              window.location.href = '/auth/login';
            }, 1500);
            
            return;
          }

          // Production API call
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
          const errorMessage = error.response?.data?.message || 'Account deletion failed';
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