import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useProjectStore, Project } from '../../store/useProjectStore';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const ProjectDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { projects, isLoading, fetchProjects, updateProject, deleteProject } = useProjectStore();
  const [isEditing, setIsEditing] = useState<boolean>(() => {
    const s = (location as any).state;
    return s?.startEdit === true;
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Project['status']>('planning');
  const [progress, setProgress] = useState(0);
  const [icon, setIcon] = useState('folder');
  const [iconColor, setIconColor] = useState('blue');
  const [color, setColor] = useState('primary');
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const iconOptions = ['folder', 'web', 'campaign', 'inventory', 'smartphone', 'badge'];
  const iconColorOptions = ['blue', 'purple', 'green', 'pink', 'orange'];
  const colorOptions = ['primary', 'yellow', 'green', 'slate'];

  const getIconColorClasses = (color: string) => {
    const classes: Record<string, string> = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
      orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    };
    return classes[color] || 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
  };

  const getStatusLabel = (s: Project['status']) => {
    switch (s) {
      case 'in-progress': return 'In Progress';
      case 'on-hold': return 'On Hold';
      case 'completed': return 'Completed';
      case 'planning': return 'Planning';
      default: return s;
    }
  };

  const getStatusStyles = (s: Project['status']) => {
    switch (s) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'planning':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  useEffect(() => {
    if (!projects || projects.length === 0) {
      fetchProjects();
    }
  }, [projects, fetchProjects]);

  const project: Project | undefined = useMemo(
    () => projects.find(p => p._id === id),
    [projects, id]
  );

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setDescription(project.description || '');
      setStatus(project.status);
      setProgress(project.progress || 0);
      setIcon(project.icon || 'folder');
      setIconColor(project.iconColor || 'blue');
      setColor(project.color || 'primary');
      setCompletedTasks(project.completedTasks || 0);
      setTotalTasks(project.totalTasks || 0);
      setErrors({});
    }
  }, [project]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = 'Title is required';
    if (title.trim().length > 200) next.title = 'Title must be ≤ 200 characters';
    if (description.trim().length > 1000) next.description = 'Description must be ≤ 1000 characters';
    if (progress < 0 || progress > 100) next.progress = 'Progress must be between 0 and 100';
    if (completedTasks < 0) next.completedTasks = 'Completed tasks must be ≥ 0';
    if (totalTasks < 0) next.totalTasks = 'Total tasks must be ≥ 0';
    if (completedTasks > totalTasks) next.completedTasks = 'Completed cannot exceed total';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!project) return;
    if (!validate()) {
      toast.error('Please fix validation errors');
      return;
    }
    setIsSaving(true);
    const updates: Partial<Project> = {
      title,
      description,
      status,
      progress,
      icon,
      iconColor,
      color,
      completedTasks,
      totalTasks,
    };
    try {
      await updateProject(project._id, updates);
      setIsEditing(false);
      toast.success('Project updated');
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!project) return;
    setTitle(project.title || '');
    setDescription(project.description || '');
    setStatus(project.status);
    setProgress(project.progress || 0);
    setIcon(project.icon || 'folder');
    setIconColor(project.iconColor || 'blue');
    setColor(project.color || 'primary');
    setCompletedTasks(project.completedTasks || 0);
    setTotalTasks(project.totalTasks || 0);
    setIsEditing(false);
    setErrors({});
  };

  const handleDelete = async () => {
    if (!project) return;
    const confirmed = window.confirm('Delete this project?');
    if (!confirmed) return;
    await deleteProject(project._id);
    navigate('/projects');
  };

  if (isLoading && !project) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <button
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#617589] hover:text-primary"
            onClick={() => navigate('/projects')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to projects
          </button>
          <div className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] p-8">
            <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-2">Project not found</h2>
            <p className="text-[#617589] dark:text-gray-400">The project you are trying to view does not exist or was removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <button
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#617589] hover:text-primary"
          onClick={() => navigate('/projects')}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back to projects
        </button>

        <div className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`size-12 rounded-lg flex items-center justify-center ${getIconColorClasses(isEditing ? iconColor : project.iconColor || 'blue')}`}>
                <span className="material-symbols-outlined text-2xl">{isEditing ? icon : project.icon || 'folder'}</span>
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <input
                    className="w-full text-2xl md:text-3xl font-black tracking-tight text-[#111418] dark:text-white bg-transparent border-b border-gray-200 dark:border-gray-700 outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                ) : (
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111418] dark:text-white">
                    {project.title}
                  </h1>
                )}
                {isEditing && errors.title && (
                  <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                )}
              </div>
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
                    className={`px-3 py-1.5 text-sm rounded bg-primary text-white ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    className="px-3 py-1.5 text-sm rounded bg-gray-100 dark:bg-gray-800 text-[#111418] dark:text-white"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                className="px-3 py-1.5 text-sm rounded bg-red-600 text-white"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
          {isEditing && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-[#617589] dark:text-gray-400">Icon</label>
                <select
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                >
                  {iconOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[#617589] dark:text-gray-400">Icon Color</label>
                <select
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  value={iconColor}
                  onChange={(e) => setIconColor(e.target.value)}
                >
                  {iconColorOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[#617589] dark:text-gray-400">Theme Color</label>
                <select
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {colorOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
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
                  {project.description || 'No description'}
                </p>
              )}
              {isEditing && errors.description && (
                <p className="mt-2 text-xs text-red-600">{errors.description}</p>
              )}
            </section>

            <section className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] p-6">
              <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Progress</h3>
              {isEditing ? (
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={progress}
                    onChange={(e) => setProgress(parseInt(e.target.value || '0', 10))}
                  />
                  <span className="text-sm">{progress}%</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Progress</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2">
                    <div className={`h-2 rounded-full bg-primary`} style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              )}
              {isEditing && errors.progress && (
                <p className="mt-2 text-xs text-red-600">{errors.progress}</p>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] p-6">
              <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">Details</h3>
              <div className="space-y-3 text-sm text-[#111418] dark:text-gray-200">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  {isEditing ? (
                    <select
                      className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Project['status'])}
                    >
                      <option value="in-progress">In Progress</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="planning">Planning</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Color</span>
                  {isEditing ? (
                    <select
                      className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    >
                      {colorOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <span>{project.color || '—'}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Completed Tasks</span>
                  {isEditing ? (
                    <input
                      type="number"
                      className="bg-transparent border-b border-gray-200 dark:border-gray-700 outline-none w-20"
                      value={completedTasks}
                      onChange={(e) => setCompletedTasks(parseInt(e.target.value || '0', 10))}
                    />
                  ) : (
                    <span>{project.completedTasks}</span>
                  )}
                </div>
                {isEditing && errors.completedTasks && (
                  <p className="text-xs text-red-600">{errors.completedTasks}</p>
                )}
                <div className="flex items-center justify-between">
                  <span>Total Tasks</span>
                  {isEditing ? (
                    <input
                      type="number"
                      className="bg-transparent border-b border-gray-200 dark:border-gray-700 outline-none w-20"
                      value={totalTasks}
                      onChange={(e) => setTotalTasks(parseInt(e.target.value || '0', 10))}
                    />
                  ) : (
                    <span>{project.totalTasks}</span>
                  )}
                </div>
                {isEditing && errors.totalTasks && (
                  <p className="text-xs text-red-600">{errors.totalTasks}</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
