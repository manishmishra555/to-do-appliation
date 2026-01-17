// src/store/useTaskStore.ts
import { create } from 'zustand';
import { Task } from '../types/task';
import { api } from '../api/client';
import toast from 'react-hot-toast';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (oldIndex: number, newIndex: number) => Promise<void>;
  toggleTaskCompletion: (id: string, completed: boolean) => Promise<void>;
  getTaskStats: () => {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  };
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/tasks');
      // Backend returns { status: 'success', data: tasks[], pagination: {...} }
      if (response.status === 'success' && Array.isArray(response.data)) {
        set({ tasks: response.data, isLoading: false });
      } else {
        set({ tasks: [], isLoading: false });
      }
    } catch (error: any) {
      console.error('Failed to fetch tasks:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch tasks',
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },
  
  addTask: async (task) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/tasks', task);
      if (response.status === 'success' && response.data) {
        const newTask = response.data;
        set((state) => ({ 
          tasks: [...state.tasks, newTask],
          isLoading: false 
        }));
        toast.success('Task created successfully');
      }
    } catch (error: any) {
      console.error('Failed to create task:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to create task',
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to create task');
      throw error;
    }
  },
  
  updateTask: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/tasks/${id}`, updates);
      if (response.status === 'success' && response.data) {
        const updatedTask = response.data;
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === id ? updatedTask : task
          ),
          isLoading: false
        }));
        toast.success('Task updated successfully');
      }
    } catch (error: any) {
      console.error('Failed to update task:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to update task',
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to update task');
      throw error;
    }
  },
  
  deleteTask: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
        isLoading: false
      }));
      toast.success('Task deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to delete task',
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to delete task');
      throw error;
    }
  },
  
  reorderTasks: async (oldIndex, newIndex) => {
    try {
      set({ isLoading: true, error: null });
      await api.put('/tasks/reorder', {
        sourceIndex: oldIndex,
        destinationIndex: newIndex,
      });
      // Update local state optimistically
      set((state) => {
        const newTasks = [...state.tasks];
        const [removed] = newTasks.splice(oldIndex, 1);
        newTasks.splice(newIndex, 0, removed);
        return { tasks: newTasks, isLoading: false };
      });
    } catch (error: any) {
      console.error('Failed to reorder tasks:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to reorder tasks',
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to reorder tasks');
      // Re-fetch tasks to sync with server
      get().fetchTasks();
      throw error;
    }
  },

  toggleTaskCompletion: async (id, completed) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.patch(`/tasks/${id}/toggle`, { completed });
      if (response.status === 'success' && response.data) {
        const updatedTask = response.data;
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task._id === id ? updatedTask : task
          ),
          isLoading: false
        }));
      }
    } catch (error: any) {
      console.error('Failed to toggle task completion:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to update task',
        isLoading: false 
      });
      toast.error(error.response?.data?.message || 'Failed to update task');
      throw error;
    }
  },
  
  getTaskStats: () => {
    const { tasks } = get();
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, pending, completionRate };
  },
}));