// src/store/useTaskStore.ts
import { create } from 'zustand';
import { Task } from '../types/task';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (oldIndex: number, newIndex: number) => void;
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
  
  fetchTasks: async () => {
    set({ isLoading: true });
    // Mock data for dashboard
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Q3 Financial Report',
        description: 'Review final budget allocation and expense sheets.',
        completed: false,
        priority: 'high',
        dueDate: new Date().toISOString(),
        assignees: [
          { id: '1', name: 'John Doe', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn1TebwQ0MiGdPVrWoLBsYcjW97odMJGNMwxSPLC5oSAO_rCPtBT-0iau0ob58rqbAsLfNItB1b3odH_KVSKUkDUpeybcp4PR0GfKQEflaM7xeciHmDo1QwvWQoz_XMO3BD3yMOCXRjciB4PqDN60jHhBnKjCZ_doHeix2fE3D_0d45yEUF9JwYfb640YHePuuPnNj2G3RJuYF4Lk79rliDcewFKbenxH9V0_Op587-wfx4W7a_XrpnoD0ulXDuEhWGqySNPsF1Fv2' },
          { id: '2', name: 'Jane Smith' },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Team Meeting Prep',
        description: 'Prepare slides for the weekly sync.',
        completed: false,
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        assignees: [{ id: '3', name: 'Alice Johnson' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Update Website Assets',
        description: 'Replace old banners with new campaign visuals.',
        completed: false,
        priority: 'low',
        dueDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        assignees: [
          { id: '4', name: 'Bob Wilson' },
          { id: '5', name: 'Carol Davis' },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Client Feedback Review',
        description: 'Go through the latest comments on Figma.',
        completed: true,
        priority: 'medium',
        dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        assignees: [{ id: '6', name: 'David Lee' }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    setTimeout(() => {
      set({ tasks: mockTasks, isLoading: false });
    }, 500);
  },
  
  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },
  
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },
  
  reorderTasks: (oldIndex, newIndex) => {
    set((state) => {
      const newTasks = [...state.tasks];
      const [removed] = newTasks.splice(oldIndex, 1);
      newTasks.splice(newIndex, 0, removed);
      return { tasks: newTasks };
    });
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