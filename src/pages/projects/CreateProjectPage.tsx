// src/pages/projects/CreateProjectPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Tag {
  id: string;
  text: string;
  color: string;
}

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    teamMembers: [] as string[],
  });
  
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', text: 'Design', color: 'primary' },
    { id: '2', text: 'Urgent', color: 'orange' },
  ]);
  
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      toast.error('Please enter a project title');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Project created successfully!');
      setIsSubmitting(false);
      navigate('/projects');
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  const getTagColorClasses = (color: string) => {
    const classes: Record<string, string> = {
      primary: 'bg-primary/10 text-primary dark:bg-primary/20',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    };
    return classes[color] || classes.primary;
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
                Create New Project
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Define your project details and assign your team.
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
            {/* Project Title */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="title">
                Project Title
              </label>
              <div className="relative">
                <input
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16202a] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary sm:text-base py-3 px-4 shadow-sm transition-all"
                  id="title"
                  placeholder="e.g., Q3 Marketing Campaign"
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
                placeholder="Describe the goals and scope of the project..."
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Grid: Due Date & Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Assign Team */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="team">
                  Assign Team
                </label>
                <div className="relative group/team">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within/team:text-primary transition-colors">
                      group_add
                    </span>
                  </div>
                  <input
                    className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#16202a] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary pl-10 sm:text-base py-3 px-4 shadow-sm transition-all"
                    id="team"
                    placeholder="Search members..."
                    type="text"
                  />
                  {/* Selected Avatars Preview */}
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <div className="flex -space-x-2 overflow-hidden">
                      <div 
                        className="inline-block size-7 rounded-full ring-2 ring-white dark:ring-[#16202a] bg-cover bg-center"
                        style={{ 
                          backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCAgNpSKv64Ypn8gGDMaZSZlL4fBCmeRxONwYduYq-RUKdCEKPomauDpwKasv3hGmKj6PYHQloIzPSwXOb0sID57Bz2IC9dJ9VrbxTHJyUVMaoou2h3gOxCYlx9gBRJwGyFTmGNeuShhivzifaXIsmFbQaUrzT7c4v7wiE9qJmpxCq80uoUv-X3qmJP0hxvaZ1BH8AGqowHFgTmMAn09jnSNQQM78KXMCDKHOgHV6LC_ApnyaUoj4yHNFJ5ypjoVshOdLd0FXLNC5Fr")' 
                        }}
                      />
                      <div 
                        className="inline-block size-7 rounded-full ring-2 ring-white dark:ring-[#16202a] bg-cover bg-center"
                        style={{ 
                          backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCWhhSTHSBEQ6Op1NBCf9BWDWqjbmCP7hR9WV7QPD-qfB3dR6DX-kcvH8XsaSnh0P6SK2xkXHRvPep9jrDeRFGuyX8iuEzAU4ttKeKFkK6jXz5uHEGagQu_dBrro27pSz9bUZDvVqo39YcPSKAQVK4oMWa8H6ptL5lLu66cz9CVCnbnDEkorAZ1ZO3qYbsHPcRg7Qdna4tprQcuOxu0-ZSy2R9XxLoPLK6DnVNkAwoKvVxifrM70U37wMs88_usjbeTgl7gyy54TZX7")' 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="tags">
                Tags
              </label>
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
                    Save Project
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

export default CreateProjectPage;