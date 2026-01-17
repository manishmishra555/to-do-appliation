// src/pages/tasks/CreateTaskPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTaskStore } from '../../store/useTaskStore';

interface Tag {
  id: string;
  text: string;
  color: string;
}

const CreateTaskPage: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
  const { addTask } = useTaskStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    assignee: '',
    category: '',
    estimatedTime: '',
  });
  
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', text: 'Development', color: 'blue' },
    { id: '2', text: 'Bug', color: 'red' },
  ]);
  
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const newTagObj: Tag = {
        id: Date.now().toString(),
        text: newTag.trim(),
        color: 'primary'
      };
      setTags([...tags, newTagObj]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority as 'low' | 'medium' | 'high' | 'critical',
        category: formData.category || 'General',
        tags: newTag.trim() ? [...tags.map(t => t.text), newTag.trim()] : tags.map(t => t.text),
        dueDate: formData.dueDate || undefined,
        estimatedDuration: formData.estimatedTime ? parseInt(formData.estimatedTime) * 60 : undefined, // Convert hours to minutes
      };

      // Call API to create task (toast is handled by the store)
      await addTask(taskData as any);
      
      if (onClose) {
        onClose();
      } else {
        navigate('/tasks');
      }
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/tasks');
    }
  };

  const getTagColorClasses = (color: string) => {
    const classes: Record<string, string> = {
      primary: 'bg-primary/10 text-primary dark:bg-primary/20',
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    };
    return classes[color] || classes.primary;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="flex-1 overflow-y-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        {/* Card Container */}
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
          {/* Card Header */}
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Create New Task
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add details, set priority, and assign to team members.
              </p>
            </div>
            <button 
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Task Title */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="title">
                Task Title *
              </label>
              <div className="relative">
                <input
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16202a] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary sm:text-base py-3 px-4 shadow-sm transition-all"
                  id="title"
                  placeholder="e.g., Fix login page responsive issues"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="description">
                  Description
                </label>
                <span className="text-xs text-slate-400">Optional</span>
              </div>
              <textarea
                className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16202a] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary sm:text-base py-3 px-4 shadow-sm resize-none transition-all"
                id="description"
                placeholder="Describe the task details, requirements, and expected outcome..."
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Grid: Priority, Due Date, Assignee */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Priority */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="priority">
                  Priority
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400">flag</span>
                  </div>
                  <select
                    className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16202a] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary pl-10 sm:text-base py-3 px-4 shadow-sm transition-all appearance-none cursor-pointer"
                    id="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                    expand_more
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-md text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                  {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="dueDate">
                  Due Date
                </label>
                <div className="relative group/date">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within/date:text-primary transition-colors">
                      calendar_today
                    </span>
                  </div>
                  <input
                    className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16202a] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary pl-10 sm:text-base py-3 px-4 shadow-sm transition-all"
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Assignee */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="assignee">
                  Assign To
                </label>
                <div className="relative group/assignee">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within/assignee:text-primary transition-colors">
                      person
                    </span>
                  </div>
                  <select
                    className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16202a] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary pl-10 sm:text-base py-3 px-4 shadow-sm transition-all appearance-none cursor-pointer"
                    id="assignee"
                    value={formData.assignee}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Assignee</option>
                    <option value="alex">Alex Morgan</option>
                    <option value="sarah">Sarah Chen</option>
                    <option value="john">John Doe</option>
                    <option value="emma">Emma Wilson</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* Grid: Category & Estimated Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="category">
                  Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400">category</span>
                  </div>
                  <select
                    className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16202a] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary pl-10 sm:text-base py-3 px-4 shadow-sm transition-all appearance-none cursor-pointer"
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="operations">Operations</option>
                    <option value="support">Support</option>
                    <option value="planning">Planning</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="estimatedTime">
                  Estimated Time
                </label>
                <div className="relative group/time">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within/time:text-primary transition-colors">
                      schedule
                    </span>
                  </div>
                  <input
                    className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16202a] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary pl-10 sm:text-base py-3 px-4 shadow-sm transition-all"
                    id="estimatedTime"
                    placeholder="e.g., 2 hours, 1 day"
                    type="text"
                    value={formData.estimatedTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="tags">
                  Tags
                </label>
                <span className="text-xs text-slate-400">Press Enter to add</span>
              </div>
              <div className="p-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16202a] shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all flex flex-wrap gap-2 min-h-[56px]">
                {/* Existing Tag Pills */}
                {tags.map(tag => (
                  <span 
                    key={tag.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getTagColorClasses(tag.color)}`}
                  >
                    {tag.text}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag.id)}
                      className="p-0.5 rounded-full hover:bg-white/20 dark:hover:bg-black/20"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
                {/* Input */}
                <input
                  className="flex-1 bg-transparent border-none p-1 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm min-w-[150px]"
                  id="tags"
                  placeholder="Type to add tags..."
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>

            {/* Subtasks (Optional) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Subtasks (Optional)
                </label>
                <button
                  type="button"
                  className="text-xs text-primary hover:text-blue-600 font-medium flex items-center gap-1"
                  onClick={() => toast.loading('Add subtask feature coming soon')}
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add Subtask
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  <input
                    type="text"
                    placeholder="Research similar implementations"
                    className="flex-1 bg-transparent border-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                    disabled
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  <input
                    type="text"
                    placeholder="Create mockups"
                    className="flex-1 bg-transparent border-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-0 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-3 items-center">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-[#1a2632] shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">check</span>
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Helper Text */}
        <p className="text-center mt-6 text-slate-400 dark:text-slate-500 text-sm">
          Press{' '}
          <kbd className="font-sans px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold mx-1">
            Cmd
          </kbd>
          {' '}+{' '}
          <kbd className="font-sans px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold mx-1">
            Enter
          </kbd>
          {' '}to save
        </p>
      </div>
    </div>
  );
};

export default CreateTaskPage;
