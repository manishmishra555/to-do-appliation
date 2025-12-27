import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/task';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [showActions, setShowActions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onUpdate(task.id, { title: editTitle, description: editDescription });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const getPriorityClasses = (priority: Task['priority']) => {
    const classes = {
      high: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400',
      medium: 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30 text-orange-700 dark:text-orange-400',
      low: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400',
      urgent: 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30 text-purple-700 dark:text-purple-400',
    };
    return classes[priority] || classes.medium;
  };

  const getPriorityDot = (priority: Task['priority']) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-orange-500',
      low: 'bg-blue-500',
      urgent: 'bg-purple-500'
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    const labels = {
      high: 'High Priority',
      medium: 'Medium',
      low: 'Low Priority',
      urgent: 'Urgent'
    };
    return labels[priority] || priority;
  };

  const formatDate = (dateString: string) => {
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
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      {...attributes}
      {...listeners}
    >
      {/* Left Section */}
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="pt-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onUpdate(task.id, { completed: !task.completed })}
            className="
              size-5 rounded border-gray-300 
              text-primary focus:ring-primary/20 
              cursor-pointer
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
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  className="
                    px-4 py-2 bg-primary hover:bg-primary/90 
                    text-white rounded-lg text-sm font-medium 
                    transition-colors
                  "
                >
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="
                    px-4 py-2 bg-gray-100 dark:bg-gray-800 
                    text-gray-700 dark:text-gray-300 rounded-lg 
                    text-sm font-medium hover:bg-gray-200 
                    dark:hover:bg-gray-700 transition-colors
                  "
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className={`
                font-semibold text-base
                ${task.completed
                  ? 'text-[#617589] dark:text-gray-500 line-through decoration-slate-400'
                  : 'text-[#111418] dark:text-white'
                }
              `}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-[#617589] dark:text-gray-400 text-sm mt-1">
                  {task.description}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 md:ml-auto pl-9 md:pl-0">
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

        {/* Assignees */}
        <div className="flex items-center gap-1.5 text-[#617589] dark:text-gray-400 text-sm">
          <div className="flex -space-x-2">
            {task.assignees?.slice(0, 2).map((assignee, index) => (
              <div
                key={assignee.id}
                className="
                  size-6 rounded-full border-2 
                  border-white dark:border-[#1e293b] 
                  bg-gray-100 flex items-center justify-center
                "
                title={assignee.name}
              >
                {assignee.avatar ? (
                  <img 
                    src={assignee.avatar} 
                    alt={assignee.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-medium text-gray-600">
                    {assignee.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            ))}
            {task.assignees && task.assignees.length > 2 && (
              <div className="
                size-6 rounded-full border-2 
                border-white dark:border-[#1e293b] 
                bg-gray-100 flex items-center justify-center 
                text-[10px] font-medium
              ">
                +{task.assignees.length - 2}
              </div>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <button 
          className={`
            p-1.5 text-[#617589] 
            hover:bg-[#f0f2f4] dark:hover:bg-gray-700 
            rounded-md transition-colors
            ${showActions ? 'visible' : 'invisible group-hover:visible'}
          `}
          onClick={(e) => {
            e.stopPropagation();
            // Show actions menu
          }}
        >
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </div>
  );
};