import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTaskStore } from '../../store/useTaskStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Task } from '../../types/task';

const TaskDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { tasks, isLoading, fetchTasks, toggleTaskCompletion, updateTask, deleteTask } = useTaskStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [attachments, setAttachments] = useState<Task['attachments']>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      fetchTasks();
    }
  }, [tasks, fetchTasks]);

  const task: Task | undefined = useMemo(() => tasks.find(t => t._id === id), [tasks, id]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setCategory(task.category || '');
      setTags(task.tags || []);
      setAttachments(task.attachments || []);
      setCompleted(!!task.completed);
    }
  }, [task]);

  const handleSave = async () => {
    if (!task) return;
    const updates: Partial<Task> = {
      title,
      description,
      status,
      priority,
      dueDate,
      category,
      tags,
      attachments,
      completed,
    };
    await updateTask(task._id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!task) return;
    setTitle(task.title || '');
    setDescription(task.description || '');
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setCategory(task.category || '');
    setTags(task.tags || []);
    setAttachments(task.attachments || []);
    setCompleted(!!task.completed);
    setIsEditing(false);
  };

  if (isLoading && !task) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <button
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#617589] hover:text-primary"
            onClick={() => navigate('/tasks')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to tasks
          </button>
          <div className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] p-8">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-2">Task not found</h2>
            <p className="text-[#617589] dark:text-gray-400">The task you are trying to view does not exist or was removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleComplete = async () => {
    await toggleTaskCompletion(task._id, !task.completed);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this task? This cannot be undone.')) {
      await deleteTask(task._id);
      navigate('/tasks');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="inline-flex items-center gap-2 text-sm text-[#617589] hover:text-primary"
            onClick={() => navigate('/tasks')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-lg border border-[#e5e7eb] dark:border-gray-700 text-sm text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => navigate('/tasks')}
            >
              Share
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
              onClick={handleToggleComplete}
            >
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button
              className="px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {isEditing ? (
                    <select
                      className="bg-transparent outline-none"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Task['priority'])}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  ) : (
                    task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
                  )}
                </span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="text-sm bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 outline-none"
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                    />
                    <button
                      className="text-sm text-primary"
                      onClick={() => {
                        const t = newTag.trim();
                        if (!t) return;
                        setTags([...tags, t]);
                        setNewTag('');
                      }}
                    >
                      Add
                    </button>
                  </div>
                ) : null}
                {(isEditing ? tags : task.tags || []).slice(0, 4).map((tag, i) => (
                  <span key={i} className="px-2 py-1 text-xs rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                    #{tag}
                  </span>
                ))}
              </div>
              {isEditing ? (
                <input
                  className="w-full text-2xl md:text-3xl font-black tracking-tight text-[#111418] dark:text-white bg-transparent border-b border-gray-200 dark:border-gray-700 outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111418] dark:text-white">
                  {task.title}
                </h1>
              )}
            </div>
            <div className="shrink-0 text-sm text-[#617589] dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                {isEditing ? (
                  <input
                    type="date"
                    className="bg-transparent outline-none"
                    value={dueDate ? new Date(dueDate).toISOString().slice(0, 10) : ''}
                    onChange={(e) => setDueDate(e.target.value || undefined)}
                  />
                ) : (
                  <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                )}
              </div>
              {task.project && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-[20px]">folder</span>
                  <span>{task.project}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {!isEditing && (
                <button
                  className="px-3 py-1.5 text-sm rounded bg-gray-100 dark:bg-gray-800 text-[#111418] dark:text-white"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
              {isEditing && (
                <>
                  <button
                    className="px-3 py-1.5 text-sm rounded bg-primary text-white"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="px-3 py-1.5 text-sm rounded bg-gray-100 dark:bg-gray-800 text-[#111418] dark:text-white"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Body layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left column: Description, Subtasks, Attachments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px]">description</span>
                <h3 className="text-lg font-bold text-[#111418] dark:text-white">Description</h3>
              </div>
              {isEditing ? (
                <textarea
                  className="w-full rounded-lg border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111418] dark:text-white p-3 outline-none"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description"
                />
              ) : (
                <p className="text-[#111418] dark:text-gray-200 whitespace-pre-wrap">
                  {task.description || 'No description'}
                </p>
              )}
            </section>

            {/* Subtasks */}
            <section className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px]">checklist</span>
                <h3 className="text-lg font-bold text-[#111418] dark:text-white">
                  Subtasks {task.subtasks?.length ? `(${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length})` : ''}
                </h3>
              </div>
              <div className="space-y-2">
                {(task.subtasks || []).map((subtask, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => {
                        const updated = { subtasks: task.subtasks.map((s, i) => i === idx ? { ...s, completed: !s.completed } : s) };
                        updateTask(task._id, updated);
                      }}
                    />
                    {isEditing ? (
                      <input
                        className="flex-1 bg-transparent border-b border-gray-200 dark:border-gray-700 outline-none text-sm text-[#111418] dark:text-white"
                        value={subtask.title}
                        onChange={(e) => {
                          const updated = { subtasks: task.subtasks.map((s, i) => i === idx ? { ...s, title: e.target.value } : s) };
                          updateTask(task._id, updated);
                        }}
                      />
                    ) : (
                      <span className={`text-sm ${subtask.completed ? 'line-through text-[#617589] dark:text-gray-500' : 'text-[#111418] dark:text-white'}`}>
                        {subtask.title}
                      </span>
                    )}
                  </div>
                ))}
                {(task.subtasks || []).length === 0 && (
                  <p className="text-sm text-[#617589] dark:text-gray-400">No subtasks</p>
                )}
              </div>
            </section>

            {/* Attachments */}
            <section className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
                <h3 className="text-lg font-bold text-[#111418] dark:text-white">
                  Attachments
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(isEditing ? attachments : task.attachments || []).map((att, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-[#e5e7eb] dark:border-gray-700 p-3">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined">picture_as_pdf</span>
                      <div>
                        <p className="text-sm font-medium text-[#111418] dark:text-white">{att.name}</p>
                        <p className="text-xs text-[#617589] dark:text-gray-400">{att.size ? `${Math.round(att.size / 1024)} KB` : ''}</p>
                      </div>
                    </div>
                    {isEditing ? (
                      <button
                        className="text-sm text-red-600"
                        onClick={() => {
                          const next = [...attachments];
                          next.splice(idx, 1);
                          setAttachments(next);
                        }}
                      >
                        Remove
                      </button>
                    ) : (
                      <button className="text-sm text-primary">Download</button>
                    )}
                  </div>
                ))}
                {(task.attachments || []).length === 0 && (
                  <p className="text-sm text-[#617589] dark:text-gray-400">No attachments</p>
                )}
              </div>
            </section>
          </div>

          {/* Right column: Meta */}
          <div className="space-y-6">
            {/* Assignee / Status */}
            <section className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] p-6">
              <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Details</h3>
              <div className="space-y-3 text-sm text-[#111418] dark:text-gray-200">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  {isEditing ? (
                    <select
                      className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Task['status'])}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {task.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Priority</span>
                  {isEditing ? (
                    <select
                      className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Task['priority'])}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {task.priority}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Due date</span>
                  {isEditing ? (
                    <input
                      type="date"
                      className="bg-transparent outline-none"
                      value={dueDate ? new Date(dueDate).toISOString().slice(0, 10) : ''}
                      onChange={(e) => setDueDate(e.target.value || undefined)}
                    />
                  ) : (
                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Category</span>
                  {isEditing ? (
                    <input
                      className="bg-transparent border-b border-gray-200 dark:border-gray-700 outline-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Category"
                    />
                  ) : (
                    <span>{task.category || '—'}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Completed</span>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={completed}
                      onChange={(e) => setCompleted(e.target.checked)}
                    />
                  ) : (
                    <span>{task.completed ? 'Yes' : 'No'}</span>
                  )}
                </div>
              </div>
            </section>

            {/* Activity placeholder */}
            <section className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] p-6">
              <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Activity</h3>
              <p className="text-sm text-[#617589] dark:text-gray-400">No recent activity.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;

