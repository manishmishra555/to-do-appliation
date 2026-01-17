// src/pages/tasks/TasksPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskList } from '../../components/tasks/TaskList';
import { useTaskStore } from '../../store/useTaskStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch once on mount

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Tasks</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Manage all your tasks in one place.
            </p>
          </div>
        </div>

        {/* Task List Component */}
        <TaskList 
          tasks={tasks}
          showHeader={false} // TaskList will handle its own header
          showFilters={true}
          onAddTask={() => navigate('/tasks/create')}
        />
      </div>
    </div>
  );
};

export default TasksPage;