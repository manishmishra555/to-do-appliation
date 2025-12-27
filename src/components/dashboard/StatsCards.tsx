// src/components/dashboard/StatsCards.tsx
import React from 'react';

interface StatsCardsProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalTasks,
  completedTasks,
  pendingTasks
}) => {
  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: 'list_alt',
      color: 'blue',
      change: '+20%'
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: 'check_circle',
      color: 'green',
      change: '+15%'
    },
    {
      label: 'Pending',
      value: pendingTasks,
      icon: 'schedule',
      color: 'orange',
      change: pendingTasks > 0 ? '-5%' : '+0%'
    }
  ];

  const getColorClasses = (color: string) => {
    const classes = {
      blue: 'bg-blue-50 dark:bg-blue-900/30 text-primary',
      green: 'bg-green-50 dark:bg-green-900/30 text-green-600',
      orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600'
    };
    return classes[color as keyof typeof classes] || classes.blue;
  };

  const getChangeColor = (change: string) => {
    return change.startsWith('+') 
      ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
      : 'text-red-600 bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="
            bg-white dark:bg-[#1e293b] 
            rounded-xl p-6 
            border border-[#e5e7eb] dark:border-gray-700 
            shadow-sm 
            flex flex-col gap-1
          "
        >
          <div className="flex justify-between items-start">
            <p className="text-[#617589] dark:text-gray-400 text-sm font-medium">
              {stat.label}
            </p>
            <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
              <span className="material-symbols-outlined text-[20px]">
                {stat.icon}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-[#111418] dark:text-white text-3xl font-bold">
              {stat.value}
            </p>
            <span className={`
              px-1.5 py-0.5 rounded text-xs font-medium 
              flex items-center gap-0.5
              ${getChangeColor(stat.change)}
            `}>
              <span className="material-symbols-outlined text-[14px]">
                {stat.change.startsWith('+') ? 'trending_up' : 'trending_down'}
              </span>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;