import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/task';
import { useTaskStore } from '../../store/useTaskStore';
import { useNavigate } from 'react-router-dom';

interface TaskItemProps {
  task: Task;
  onUpdate?: (id: string, updates: Partial<Task>) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [showActions, setShowActions] = useState(false);

  const { updateTask, deleteTask, toggleTaskCompletion, isLoading } = useTaskStore();
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = async () => {
    try {
      const updates: Partial<Task> = {
        title: editTitle,
        description: editDescription
      };
      if (onUpdate) {
        await onUpdate(task._id, updates);
      } else {
        await updateTask(task._id, updates);
      }
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleToggleComplete = async () => {
    try {
      await toggleTaskCompletion(task._id, !task.completed);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        if (onDelete) {
          await onDelete(task._id);
        } else {
          await deleteTask(task._id);
        }
      } catch (error) {
        // Error is handled by the store
      }
    }
  };

  const getPriorityClasses = (priority: Task['priority']) => {
    const classes = {
      critical: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400',
      high: 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30 text-orange-700 dark:text-orange-400',
      medium: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      low: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400',
    };
    return classes[priority] || classes.medium;
  };

  const getPriorityDot = (priority: Task['priority']) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500'
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    const labels = {
      critical: 'Critical',
      high: 'High Priority',
      medium: 'Medium',
      low: 'Low Priority'
    };
    return labels[priority] || priority;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';

    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: Task['status']) => {
    const colors = {
      todo: 'text-gray-500',
      in_progress: 'text-blue-500',
      review: 'text-yellow-500',
      completed: 'text-green-500',
      archived: 'text-gray-400',
      cancelled: 'text-red-400'
    };
    return colors[status] || colors.todo;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4
        bg-white dark:bg-[#1e293b] rounded-xl
        border border-[#e5e7eb] dark:border-gray-700
        hover:shadow-md transition-shadow cursor-pointer
        ${task.completed ? 'opacity-75 hover:opacity-100' : ''}
        ${isDragging ? 'opacity-50 scale-105 shadow-lg' : ''}
        ${task.status === 'completed' ? 'bg-green-50 dark:bg-green-900/10' : ''}
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => {
        if (!isEditing) {
          navigate(`/tasks/${task._id}`);
        }
      }}
      {...attributes}
      {...listeners}
    >
      {/* Left Section */}
      <div className="flex items-start gap-4 w-full md:w-4.5/5">
        {/* Checkbox */}
        <div className="pt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isLoading}
            onClick={(e) => e.stopPropagation()}
            className="
              size-5 rounded border-gray-300
              text-primary focus:ring-primary/20
              cursor-pointer disabled:cursor-not-allowed
            "
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="
                  w-full px-3 py-2
                  bg-white dark:bg-gray-800
                  border border-[#e5e7eb] dark:border-gray-700
                  rounded-lg text-sm
                  text-[#111418] dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-primary/20
                "
                autoFocus
                disabled={isLoading}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="
                  w-full px-3 py-2
                  bg-white dark:bg-gray-800
                  border border-[#e5e7eb] dark:border-gray-700
                  rounded-lg text-sm
                  text-[#111418] dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-primary/20
                "
                rows={2}
                placeholder="Description..."
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="
                    px-4 py-2 bg-primary hover:bg-primary/90
                    text-white rounded-lg text-sm font-medium
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="
                    px-4 py-2 bg-gray-100 dark:bg-gray-800
                    text-gray-700 dark:text-gray-300 rounded-lg
                    text-sm font-medium hover:bg-gray-200
                    dark:hover:bg-gray-700 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`
                  font-semibold text-base
                  ${task.completed
                    ? 'text-[#617589] dark:text-gray-500 line-through decoration-slate-400'
                    : 'text-[#111418] dark:text-white'
                  }
                `}>
                  {task.title}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)} bg-current/10`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              {task.description && (
                <p className="text-[#617589] dark:text-gray-400 text-sm mt-1">
                  {task.description}
                </p>
              )}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                  {task.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                      +{task.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className={`flex items-center gap-4 w-full md:w-2/5 pl-9 md:pl-0`}>
        {/* Priority Badge */}
        <div className={`
          flex items-center gap-1.5
          px-2.5 py-1 rounded-full border
          ${getPriorityClasses(task.priority)}
        `}>
          <div className={`size-1.5 rounded-full ${getPriorityDot(task.priority)}`}></div>
          <span className="text-xs font-medium">
            {getPriorityLabel(task.priority)}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-[#617589] dark:text-gray-400 text-sm">
          <span className="material-symbols-outlined text-[18px]">
            calendar_today
          </span>
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {/* Category */}
        {task.category && (
          <div className="flex items-center gap-1.5 text-[#617589] dark:text-gray-400 text-sm">
            <span className="material-symbols-outlined text-[18px]">
              category
            </span>
            <span>{task.category}</span>
          </div>
        )}

        {/* Actions Menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            disabled={isLoading}
            className={`
              p-1.5 text-[#617589] hover:text-blue-600
              hover:bg-[#f0f2f4] dark:hover:bg-gray-700
              rounded-md transition-colors
              ${showActions ? 'visible' : 'invisible group-hover:visible'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isLoading}
            className={`
              p-1.5 text-[#617589] hover:text-red-600
              hover:bg-[#f0f2f4] dark:hover:bg-gray-700
              rounded-md transition-colors
              ${showActions ? 'visible' : 'invisible group-hover:visible'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
