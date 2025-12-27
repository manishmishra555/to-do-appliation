import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskItem } from './TaskItem';
import { Task } from '../../types/task';
import { useTaskStore } from '../../store/useTaskStore';
import { useNavigate } from 'react-router-dom';

interface TaskListProps {
  tasks?: Task[];
  showHeader?: boolean;
  showFilters?: boolean;
  onAddTask?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks: externalTasks, 
  showHeader = true,
  showFilters = true,
  onAddTask 
}) => {
  const { tasks: storeTasks, reorderTasks, updateTask, deleteTask } = useTaskStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const navigate = useNavigate();

  // Use external tasks if provided, otherwise use store tasks
  const tasks = externalTasks || storeTasks;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      reorderTasks(oldIndex, newIndex);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
               task.description?.toLowerCase().includes(search.toLowerCase()) ||
               (task.tags && task.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase())));

    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'pending' ? !task.completed :
      filter === 'completed' ? task.completed : true;

    return matchesSearch && matchesFilter;
  });

  const activeTask = tasks.find(task => task.id === activeId);

  return (
    <div className="flex flex-col gap-4">
      {/* Filters and Search - Only show if enabled */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Filter Buttons */}
          <div className="flex p-1 bg-[#f0f2f4] dark:bg-gray-800 rounded-lg w-fit">
            {(['all', 'pending', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`
                  px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${filter === filterType
                    ? 'bg-white dark:bg-[#1e293b] shadow-sm text-[#111418] dark:text-white'
                    : 'text-[#617589] dark:text-gray-400 hover:text-[#111418] dark:hover:text-white'
                  }
                `}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <button className="
                flex items-center gap-2 
                px-3 py-2 
                bg-white dark:bg-[#1e293b] 
                border border-[#e5e7eb] dark:border-gray-700 
                rounded-lg 
                text-sm font-medium text-[#617589] dark:text-gray-300 
                hover:bg-[#f9fafb] dark:hover:bg-gray-800
              ">
                <span className="material-symbols-outlined text-[20px]">
                  sort
                </span>
                Sort by Date
              </button>
            </div>

            {/* Add Task Button */}
            <button
              onClick={onAddTask}
              className="
                flex items-center gap-2 
                px-4 py-2 
                bg-primary hover:bg-primary/90 
                text-white rounded-lg 
                text-sm font-medium 
                transition-colors shadow-sm
              "
            >
              <span className="material-symbols-outlined text-[20px]">
                add
              </span>
              Add Task
            </button>
          </div>
        </div>
      )}

      {/* Search Bar - Only for dashboard */}
      {showHeader && (
        <div className="hidden md:flex w-full h-10 items-center rounded-lg bg-[#f0f2f4] dark:bg-gray-800 px-3">
          <span className="material-symbols-outlined text-[#617589] mr-2">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="
              w-full bg-transparent border-none 
              text-sm text-[#111418] dark:text-white 
              placeholder-[#617589] 
              focus:outline-none focus:ring-0
            "
          />
        </div>
      )}

      {/* Task List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask ? (
            <div className="
              group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 
              bg-white dark:bg-[#1e293b] rounded-xl 
              border border-[#e5e7eb] dark:border-gray-700 
              shadow-lg opacity-80 cursor-grabbing
              rotate-2
            ">
              {/* Render active task in overlay */}
              <div className="flex items-start gap-4">
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={activeTask.completed}
                    className="
                      size-5 rounded border-gray-300 
                      text-primary focus:ring-primary/20 
                      cursor-pointer
                    "
                    readOnly
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    font-semibold text-base
                    ${activeTask.completed
                      ? 'text-[#617589] dark:text-gray-500 line-through decoration-slate-400'
                      : 'text-[#111418] dark:text-white'
                    }
                  `}>
                    {activeTask.title}
                  </h3>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="
          bg-white dark:bg-[#1e293b] 
          rounded-xl p-8 
          border border-[#e5e7eb] dark:border-gray-700 
          text-center
        ">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600">
            <span className="material-symbols-outlined text-6xl">
              task_alt
            </span>
          </div>
          <h3 className="text-lg font-medium text-[#111418] dark:text-white mb-2">
            No tasks found
          </h3>
          <p className="text-[#617589] dark:text-gray-400">
            {search ? 'Try a different search term' : 'Create your first task to get started!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;