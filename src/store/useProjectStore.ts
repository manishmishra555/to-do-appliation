import { create } from 'zustand';
import { api } from '../api/client';
import toast from 'react-hot-toast';

export interface Project {
  _id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  progress: number;
  status: 'in-progress' | 'on-hold' | 'completed' | 'planning';
  completedTasks: number;
  totalTasks: number;
  color: string;
  createdAt?: string;
}

interface ProjectStore {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/projects');
      if (response.status === 'success' && Array.isArray(response.data)) {
        set({ projects: response.data, isLoading: false });
      } else {
        set({ projects: [], isLoading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch projects',
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to fetch projects');
    }
  },

  addProject: async (project) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/projects', project);
      if (response.status === 'success' && response.data) {
        set((state) => ({ projects: [response.data, ...state.projects], isLoading: false }));
        toast.success('Project created successfully');
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create project',
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to create project');
      throw error;
    }
  },

  updateProject: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/projects/${id}`, updates);
      if (response.status === 'success' && response.data) {
        set((state) => ({
          projects: state.projects.map(p => p._id === id ? response.data : p),
          isLoading: false
        }));
        toast.success('Project updated successfully');
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update project',
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to update project');
      throw error;
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete(`/projects/${id}`);
      if (response.status === 'success') {
        set((state) => ({
          projects: state.projects.filter(p => p._id !== id),
          isLoading: false
        }));
        toast.success('Project deleted');
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete project',
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to delete project');
      throw error;
    }
  },
}));
