// src/pages/dashboard/DashboardPage.tsx
import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { useAuthStore } from '../../store/useAuthStore';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsCards from '../../components/dashboard/StatsCards';
import TaskList from '../../components/tasks/TaskList';
import CreateTaskPage from '../tasks/CreateTaskPage';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto flex flex-col gap-8">
        {/* Stats Cards */}
        <StatsCards
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
        />

        {/* Tasks Section */}
        <div className="flex flex-col gap-4">
          <TaskList tasks={filteredTasks} onAddTask={() => setIsCreateOpen(true)} />
        </div>

        {/* Create Task Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsCreateOpen(false)} />
            <div className="relative w-full max-w-4xl mx-4">
              <CreateTaskPage onClose={() => setIsCreateOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
