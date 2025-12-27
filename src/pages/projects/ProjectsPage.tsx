// src/pages/projects/ProjectsPage.tsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  progress: number;
  status: 'in-progress' | 'on-hold' | 'completed' | 'planning';
  completedTasks: number;
  totalTasks: number;
  color: string;
}

const ProjectsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortBy, setSortBy] = useState('Newest First');
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Overhauling the corporate website with a fresh new look and improved UX flow for better conversions.',
      icon: 'web',
      iconColor: 'blue',
      progress: 45,
      status: 'in-progress',
      completedTasks: 5,
      totalTasks: 12,
      color: 'primary'
    },
    {
      id: '2',
      title: 'Q3 Marketing Campaign',
      description: 'Strategizing for the upcoming quarter\'s ad spend and creative direction across social channels.',
      icon: 'campaign',
      iconColor: 'purple',
      progress: 10,
      status: 'on-hold',
      completedTasks: 2,
      totalTasks: 20,
      color: 'yellow'
    },
    {
      id: '3',
      title: 'Internal Audit 2023',
      description: 'Reviewing financial records and compliance documents for the end-of-year audit.',
      icon: 'inventory',
      iconColor: 'green',
      progress: 100,
      status: 'completed',
      completedTasks: 20,
      totalTasks: 20,
      color: 'green'
    },
    {
      id: '4',
      title: 'Mobile App Launch',
      description: 'Preparing assets, store descriptions, and final QA testing for the v2.0 release.',
      icon: 'smartphone',
      iconColor: 'pink',
      progress: 0,
      status: 'planning',
      completedTasks: 0,
      totalTasks: 45,
      color: 'slate'
    },
    {
      id: '5',
      title: 'Employee Portal',
      description: 'Building a new HR dashboard for employee self-service and benefits management.',
      icon: 'badge',
      iconColor: 'orange',
      progress: 78,
      status: 'in-progress',
      completedTasks: 18,
      totalTasks: 23,
      color: 'primary'
    }
  ]);

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  const getStatusStyles = (status: Project['status']) => {
    switch (status) {
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

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      case 'on-hold': return 'On Hold';
      case 'completed': return 'Completed';
      case 'planning': return 'Planning';
      default: return status;
    }
  };

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

  const getProgressColor = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      slate: 'bg-slate-300 dark:bg-slate-600',
    };
    return colors[color] || 'bg-primary';
  };


  const handleProjectMenu = (projectId: string) => {
    toast.loading('Project menu feature coming soon');
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) ||
                         project.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || 
                         getStatusLabel(project.status) === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8 pb-12">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">All Projects</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Manage your ongoing work, track progress, and collaborate.
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Search */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <div className="relative min-w-[140px] flex-1 sm:flex-none">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">filter_list</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none appearance-none cursor-pointer"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>On Hold</option>
                <option>Completed</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">expand_more</span>
            </div>

            <div className="relative min-w-[140px] flex-1 sm:flex-none">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">sort</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none appearance-none cursor-pointer"
              >
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>A-Z</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Create Button */}
          <button 
            onClick={handleCreateProject}
            className="bg-primary hover:bg-primary/90 text-white px-5 py-1.5 rounded-lg text-sm font-semibold shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create Project
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg mb-2 ${getIconColorClasses(project.iconColor)}`}>
                  <span className="material-symbols-outlined">{project.icon}</span>
                </div>
                <button 
                  onClick={() => handleProjectMenu(project.id)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span className="material-symbols-outlined">more_horiz</span>
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors cursor-pointer">
                {project.title}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">
                {project.description}
              </p>
              
              <div className="mt-auto">
                <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getProgressColor(project.color)}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusStyles(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                  
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
                    <span className="material-symbols-outlined text-base">
                      {project.status === 'completed' ? 'check_circle' : 'format_list_bulleted'}
                    </span>
                    <span>{project.completedTasks}/{project.totalTasks} tasks</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Project Card */}
          <button 
            onClick={handleCreateProject}
            className="group relative flex flex-col h-full min-h-[250px] items-center justify-center rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all p-5"
          >
            <div className="size-14 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
              <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary transition-colors">add</span>
            </div>
            <h3 className="text-base font-semibold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">
              Create New Project
            </h3>
            <p className="text-sm text-slate-400 mt-1 text-center px-4">
              Start a new initiative and invite your team.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;  