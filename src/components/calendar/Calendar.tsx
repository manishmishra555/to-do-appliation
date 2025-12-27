import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Task } from '../../types/task';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  ListTodo,
  BarChart,
  Filter,
  Search,
  AlertCircle,
  Clock,
  CheckCircle,
  Circle,
  TrendingUp,
  MessageSquare,
  KanbanSquare,
  CheckSquare
} from 'lucide-react';
import moment from 'moment';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  task: Task;
  color: string;
  bgColor: string;
  borderColor: string;
}

// Notification interface
interface Notification {
  id: string;
  type: 'comment' | 'deadline' | 'completion';
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
}

// Upcoming event interface
interface UpcomingEvent {
  id: string;
  title: string;
  time: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  tags: string[];
}

export const Calendar: React.FC = () => {
  const { tasks } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(moment('2023-10-01'));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [activeView, setActiveView] = useState<'month' | 'week' | 'day'>('month');

  // Get priority color mapping
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-500'
      };
      case 'medium': return {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-500'
      };
      case 'low': return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-500'
      };
      default: return {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-500'
      };
    }
  };

  // Map tasks to calendar events
  const events: CalendarEvent[] = tasks
    .filter(task => task.dueDate)
    .map(task => {
      const colors = getPriorityColor(task.priority);
      return {
        id: task.id,
        title: task.title,
        start: new Date(task.dueDate!),
        end: new Date(new Date(task.dueDate!).getTime() + 60 * 60 * 1000),
        task,
        color: colors.text,
        bgColor: colors.bg,
        borderColor: colors.border
      };
    });

  // Sample events for the design (you can replace with actual tasks)
  const sampleEvents: Record<string, CalendarEvent[]> = {
    '2023-10-02': [{
      id: '1',
      title: 'Design Review',
      start: new Date('2023-10-02'),
      end: new Date('2023-10-02T23:59:59'),
      task: { 
        id: '1', 
        title: 'Design Review', 
        description: '', 
        priority: 'medium', 
        completed: false,
        dueDate: '2023-10-02',
        category: 'Design',
        tags: ['design', 'review']
      } as Task,
      color: 'text-blue-700 dark:text-blue-300',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'border-blue-500'
    }],
    '2023-10-04': [{
      id: '2',
      title: 'Team Lunch',
      start: new Date('2023-10-04'),
      end: new Date('2023-10-04T23:59:59'),
      task: { 
        id: '2', 
        title: 'Team Lunch', 
        description: '', 
        priority: 'low', 
        completed: false,
        dueDate: '2023-10-04',
        category: 'Team',
        tags: ['team', 'lunch']
      } as Task,
      color: 'text-green-700 dark:text-green-300',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      borderColor: 'border-green-500'
    }, {
      id: '3',
      title: 'Project Kickoff',
      start: new Date('2023-10-04'),
      end: new Date('2023-10-04T23:59:59'),
      task: { 
        id: '3', 
        title: 'Project Kickoff', 
        description: '', 
        priority: 'medium', 
        completed: false,
        dueDate: '2023-10-04',
        category: 'Project',
        tags: ['project', 'kickoff']
      } as Task,
      color: 'text-purple-700 dark:text-purple-300',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      borderColor: 'border-purple-500'
    }],
    '2023-10-05': [{
      id: '4',
      title: 'Client Call: Acme Corp',
      start: new Date('2023-10-05'),
      end: new Date('2023-10-05T23:59:59'),
      task: { 
        id: '4', 
        title: 'Client Call: Acme Corp', 
        description: '', 
        priority: 'high', 
        completed: false,
        dueDate: '2023-10-05',
        category: 'Client',
        tags: ['client', 'call']
      } as Task,
      color: 'text-orange-700 dark:text-orange-300',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      borderColor: 'border-orange-500'
    }],
    '2023-10-09': [{
      id: '5',
      title: 'Deadline: Website V2',
      start: new Date('2023-10-09'),
      end: new Date('2023-10-09T23:59:59'),
      task: { 
        id: '5', 
        title: 'Deadline: Website V2', 
        description: '', 
        priority: 'high', 
        completed: false,
        dueDate: '2023-10-09',
        category: 'Development',
        tags: ['deadline', 'website']
      } as Task,
      color: 'text-red-700 dark:text-red-300',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      borderColor: 'border-red-500'
    }],
    '2023-10-11': [{
      id: '6',
      title: 'Weekly Sync',
      start: new Date('2023-10-11'),
      end: new Date('2023-10-11T23:59:59'),
      task: { 
        id: '6', 
        title: 'Weekly Sync', 
        description: '', 
        priority: 'medium', 
        completed: false,
        dueDate: '2023-10-11',
        category: 'Meeting',
        tags: ['weekly', 'sync']
      } as Task,
      color: 'text-blue-700 dark:text-blue-300',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'border-blue-500'
    }],
    '2023-10-16': [{
      id: '7',
      title: 'OOO: Dentist',
      start: new Date('2023-10-16'),
      end: new Date('2023-10-16T23:59:59'),
      task: { 
        id: '7', 
        title: 'OOO: Dentist', 
        description: '', 
        priority: 'low', 
        completed: false,
        dueDate: '2023-10-16',
        category: 'Personal',
        tags: ['ooo', 'appointment']
      } as Task,
      color: 'text-gray-700 dark:text-gray-300',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      borderColor: 'border-gray-400'
    }],
    '2023-10-19': [{
      id: '8',
      title: 'Design Workshop',
      start: new Date('2023-10-19'),
      end: new Date('2023-10-19T23:59:59'),
      task: { 
        id: '8', 
        title: 'Design Workshop', 
        description: '', 
        priority: 'medium', 
        completed: false,
        dueDate: '2023-10-19',
        category: 'Workshop',
        tags: ['design', 'workshop']
      } as Task,
      color: 'text-purple-700 dark:text-purple-300',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      borderColor: 'border-purple-500'
    }, {
      id: '9',
      title: 'Sprint Review',
      start: new Date('2023-10-19'),
      end: new Date('2023-10-19T23:59:59'),
      task: { 
        id: '9', 
        title: 'Sprint Review', 
        description: '', 
        priority: 'medium', 
        completed: false,
        dueDate: '2023-10-19',
        category: 'Development',
        tags: ['sprint', 'review']
      } as Task,
      color: 'text-blue-700 dark:text-blue-300',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'border-blue-500'
    }],
    '2023-10-24': [{
      id: '10',
      title: 'Payday',
      start: new Date('2023-10-24'),
      end: new Date('2023-10-24T23:59:59'),
      task: { 
        id: '10', 
        title: 'Payday', 
        description: '', 
        priority: 'low', 
        completed: false,
        dueDate: '2023-10-24',
        category: 'Finance',
        tags: ['payday']
      } as Task,
      color: 'text-green-700 dark:text-green-300',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      borderColor: 'border-green-500'
    }],
    '2023-10-27': [{
      id: '11',
      title: 'Review Q3 Goals',
      start: new Date('2023-10-27'),
      end: new Date('2023-10-27T23:59:59'),
      task: { 
        id: '11', 
        title: 'Review Q3 Goals', 
        description: '', 
        priority: 'medium', 
        completed: false,
        dueDate: '2023-10-27',
        category: 'Planning',
        tags: ['review', 'goals']
      } as Task,
      color: 'text-orange-700 dark:text-orange-300',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      borderColor: 'border-orange-500'
    }],
    '2023-10-30': [{
      id: '12',
      title: 'Tax Filing',
      start: new Date('2023-10-30'),
      end: new Date('2023-10-30T23:59:59'),
      task: { 
        id: '12', 
        title: 'Tax Filing', 
        description: '', 
        priority: 'high', 
        completed: false,
        dueDate: '2023-10-30',
        category: 'Finance',
        tags: ['tax', 'deadline']
      } as Task,
      color: 'text-red-700 dark:text-red-300',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      borderColor: 'border-red-500'
    }]
  };

  // Merge sample events with actual task events
  const allEvents = { ...sampleEvents };

  // Notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'comment',
      title: 'Alex commented on "Website V2"',
      message: '25 mins ago',
      time: '25 mins ago',
      isUnread: true
    },
    {
      id: '2',
      type: 'deadline',
      title: 'Task "Tax Filing" is due in 3 days',
      message: '2 hours ago',
      time: '2 hours ago',
      isUnread: true
    },
    {
      id: '3',
      type: 'completion',
      title: 'Sarah completed "Logo Assets"',
      message: 'Yesterday',
      time: 'Yesterday',
      isUnread: false
    }
  ];

  // Upcoming events
  const upcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'Client Call: Acme Corp',
      time: 'Today, 2:00 PM',
      icon: <AlertCircle className="w-5 h-5" />,
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      tags: ['Zoom']
    },
    {
      id: '2',
      title: 'Design Review',
      time: 'Tomorrow, 10:00 AM',
      icon: <Clock className="w-5 h-5" />,
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      tags: []
    }
  ];

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const startOfMonth = currentDate.clone().startOf('month').startOf('week');
    const endOfMonth = currentDate.clone().endOf('month').endOf('week');
    const days = [];
    let day = startOfMonth.clone();

    while (day.isBefore(endOfMonth, 'day')) {
      days.push(day.clone());
      day.add(1, 'day');
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthYear = currentDate.format('MMMM YYYY');

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'));
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

  // Check if day is current day
  const isCurrentDay = (day: moment.Moment) => {
    return day.isSame(moment(), 'day');
  };

  // Check if day is in current month
  const isCurrentMonth = (day: moment.Moment) => {
    return day.month() === currentDate.month();
  };

  // Get events for a specific day
  const getEventsForDay = (day: moment.Moment) => {
    const dateStr = day.format('YYYY-MM-DD');
    return allEvents[dateStr] || [];
  };

  return (
    <div className="h-full flex flex-col bg-background-light dark:bg-background-dark">
      {/* Main Header */}
      <header className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-6 py-4 shrink-0 flex flex-wrap justify-between items-center gap-4 z-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-[#111417] dark:text-white tracking-tight text-2xl font-bold leading-tight">
            Calendar
          </h2>
          <p className="text-[#647587] dark:text-gray-400 text-sm font-normal leading-normal">
            Manage your schedule and deadlines
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="hidden sm:flex bg-background-light dark:bg-background-dark rounded-lg p-1 border border-border-light dark:border-border-dark">
            <button 
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeView === 'month' 
                  ? 'bg-white dark:bg-surface-dark shadow-sm text-[#111417] dark:text-white' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-[#647587] dark:text-gray-400'
              }`}
              onClick={() => setActiveView('month')}
            >
              Month
            </button>
            <button 
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeView === 'week' 
                  ? 'bg-white dark:bg-surface-dark shadow-sm text-[#111417] dark:text-white' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-[#647587] dark:text-gray-400'
              }`}
              onClick={() => setActiveView('week')}
            >
              Week
            </button>
            <button 
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeView === 'day' 
                  ? 'bg-white dark:bg-surface-dark shadow-sm text-[#111417] dark:text-white' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-[#647587] dark:text-gray-400'
              }`}
              onClick={() => setActiveView('day')}
            >
              Day
            </button>
          </div>
          
          <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
            <Plus className="w-4 h-4" />
            <span className="truncate">Add Task</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar Grid Container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark p-0 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-surface-light dark:bg-surface-dark rounded-none md:rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden"
          >
            {/* Calendar Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark shrink-0">
              <div className="flex items-center gap-4">
                <h3 className="text-[#111417] dark:text-white text-lg font-bold">
                  {monthYear}
                </h3>
                <div className="flex items-center gap-1">
                  <button 
                    className="p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark text-[#111417] dark:text-white transition-colors"
                    onClick={goToPreviousMonth}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark text-[#111417] dark:text-white transition-colors"
                    onClick={goToNextMonth}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button 
                className="text-primary text-sm font-semibold hover:underline"
                onClick={goToToday}
              >
                Today
              </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-border-light dark:border-border-dark bg-background-light/50 dark:bg-background-dark/50 shrink-0">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div 
                  key={day} 
                  className="py-3 text-center text-xs font-semibold text-[#647587] dark:text-gray-400 uppercase tracking-wider"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid Cells */}
            <div className="grid grid-cols-7 grid-rows-5 flex-1 overflow-y-auto">
              {calendarDays.map((day, index) => {
                const isToday = isCurrentDay(day);
                const isCurrentM = isCurrentMonth(day);
                const dayEvents = getEventsForDay(day);
                const dateStr = day.format('YYYY-MM-DD');
                
                return (
                  <div 
                    key={index}
                    className={`min-h-[100px] border-b border-r border-border-light dark:border-border-dark p-2 relative group transition-colors ${
                      !isCurrentM 
                        ? 'bg-background-light/30 dark:bg-background-dark/30' 
                        : 'hover:bg-background-light/40 dark:hover:bg-background-dark/40'
                    } ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                  >
                    {/* Day Number */}
                    <span className={`
                      text-sm font-medium block mb-1 
                      ${isCurrentM 
                        ? isToday 
                          ? 'size-7 flex items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/30' 
                          : 'text-[#111417] dark:text-gray-300' 
                        : 'text-gray-400 dark:text-gray-600'
                      }
                    `}>
                      {day.format('D')}
                    </span>

                    {/* Events for this day */}
                    {dayEvents.slice(0, 3).map((event) => (
                      <div 
                        key={event.id}
                        className={`mb-1 px-2 py-1 rounded text-xs font-medium truncate cursor-pointer hover:opacity-80 border-l-2 shadow-sm ${event.bgColor} ${event.color} ${event.borderColor}`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        {event.title}
                      </div>
                    ))}
                    
                    {/* Show more indicator if there are more than 3 events */}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 pl-2">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Panel: Notifications & Upcoming */}
        <aside className="w-80 bg-surface-light dark:bg-surface-dark border-l border-border-light dark:border-border-dark flex-col hidden lg:flex overflow-y-auto shrink-0 z-10">
          <div className="p-6">
            <h2 className="text-[#111417] dark:text-white text-lg font-bold leading-tight mb-4">
              Upcoming Schedule
            </h2>
            
            {/* Upcoming Events List */}
            <div className="flex flex-col gap-2">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="group flex items-start gap-3 p-3 rounded-xl bg-background-light/50 dark:bg-background-dark/50 hover:bg-background-light dark:hover:bg-background-dark transition-colors cursor-pointer border border-transparent hover:border-border-light dark:hover:border-border-dark"
                >
                  <div className="shrink-0 mt-1">
                    <div className={`flex items-center justify-center rounded-lg ${event.bgColor} ${event.textColor} size-10`}>
                      {event.icon}
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-[#111417] dark:text-gray-100 text-sm font-semibold truncate">
                      {event.title}
                    </p>
                    <p className="text-[#647587] dark:text-gray-400 text-xs font-normal">
                      {event.time}
                    </p>
                    {event.tags.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        {event.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="text-xs px-2 py-0.5 rounded bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark text-[#647587] dark:text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-border-light dark:border-border-dark mx-6"></div>

          <div className="p-6">
            <h2 className="text-[#111417] dark:text-white text-lg font-bold leading-tight mb-4">
              Notifications
            </h2>
            
            <div className="flex flex-col gap-0">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="flex gap-3 py-3 border-b border-border-light dark:border-border-dark last:border-0 hover:bg-background-light/50 dark:hover:bg-background-dark/50 cursor-pointer transition-colors"
                >
                  <div className={`size-2 rounded-full mt-2 shrink-0 ${
                    notification.isUnread 
                      ? notification.type === 'deadline' 
                        ? 'bg-primary' 
                        : 'bg-red-500'
                      : 'bg-transparent'
                  }`} />
                  <div className="flex flex-col gap-1">
                    <p className="text-[#111417] dark:text-gray-200 text-sm font-medium leading-snug">
                      {notification.title}
                    </p>
                    <p className="text-[#647587] dark:text-gray-500 text-xs">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 text-primary text-sm font-medium hover:bg-primary/5 dark:hover:bg-primary/10 rounded-lg transition-colors">
              View All Notifications
            </button>
          </div>

          {/* Mini promo/image area */}
          <div className="mt-auto p-6">
            <div className="relative w-full h-32 rounded-xl overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <div className="absolute bottom-3 left-3 z-20">
                <p className="text-white text-sm font-bold">Pro Tip</p>
                <p className="text-white/80 text-xs">
                  Drag and drop tasks to reschedule instantly.
                </p>
              </div>
              <div 
                className="bg-center bg-cover h-full w-full transform group-hover:scale-105 transition-transform duration-500"
                style={{ 
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDtsx07sUIcthFcfAXgHoI1hfJjJGKQgyRw9vdCZ7aP02guFOXct4lm1x5rGjI-i90moauQ-_sOQG6phuUCP6hZd9CRq9DmIrTCDNxnxuMhIVDXZ_6G158r58crR1o2JBMYemoatSxHo68Dd6A-Tv9eh7n_x_5nzW_rP4ghnEjnw8RfABywSVpBpqbe299Ro9MYUq-Pu52FS5pB2C6CrRxTGW5u8Czb2tJMxxr9EcT9HuVODRkUfkSwxn26Gu5hkNpivRadgFRYNKnH")',
                  backgroundColor: '#4c99e6'
                }}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedEvent.title}
                </h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {selectedEvent.task.description && (
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedEvent.task.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Due Date
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {moment(selectedEvent.start).format('lll')}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Priority
                    </label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedEvent.task.priority === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : selectedEvent.task.priority === 'medium'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {selectedEvent.task.priority}
                    </span>
                  </div>

                  {selectedEvent.task.category && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Category
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedEvent.task.category}
                      </p>
                    </div>
                  )}
                </div>

                {selectedEvent.task.tags && selectedEvent.task.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedEvent.task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-lg transition-colors">
                  Edit Task
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};