// src/components/notifications/NotificationPanel.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../../store/useNotificationStore';
import { formatDistanceToNow } from 'date-fns';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    unreadCount
  } = useNotificationStore();

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.notification-panel') && !target.closest('.notification-bell')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Alternative icon mapping if some Material Icons don't work
    const getMaterialIcon = (iconName: string) => {
        const iconMap: Record<string, string> = {
            'chat': 'chat',
            'alternate_email': 'mail',  // Use 'mail' instead
            'warning': 'warning',
            'check': 'check',
            'folder': 'folder',
            'chat_bubble': 'chat',
            'folder_shared': 'folder_shared'  // Try this
        };
        
        return iconMap[iconName] || 'notifications';
    };

  // Sample notifications matching your design
  const sampleNotifications = [
    {
      id: '1',
      type: 'comment',
      title: 'Alex Morgan replied to "Website Redesign"',
      message: '"Can we check the contrast on the secondary buttons before shipping?"',
      time: '2m ago',
      isUnread: true,
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBAJtyxM_dtPmhX3J23M-dZ3M6oQHkdykr1bHdSFbpRXriyYgl3y5Zz17t-Dzmap7EysPDPxd5GS8nEZeOHvSG6EqEFk_Qo10ybSIkt7gcdiJMcaWJ8ZARsO4x41_m0YajFZXA1tdBR95SazO3I6i6GCyykr7MwnlyD0DL6gnWa0_CwAw7Z0g-Z-80mpF4tVb5bVcTQkAP6v6VmFYA7Zw0SPDzccjQGLw0fbEF-nbDZ5z3mi--MSCnkMNLCazjM50DFwZ7E9blOVu6',
      icon: 'chat'
    },
    {
      id: '2',
      type: 'system',
      title: 'Task Overdue',
      message: 'The task "Q3 Marketing Report" was due yesterday.',
      time: '1h ago',
      isUnread: true,
      icon: 'warning',
      color: 'amber'
    },
    {
      id: '3',
      type: 'completion',
      title: 'Design System Update completed',
      message: 'v2.4 has been deployed successfully to production.',
      time: '5h ago',
      isUnread: false,
      icon: 'check',
      color: 'green'
    },
    {
      id: '4',
      type: 'mention',
      title: 'Sarah Jenkins mentioned you',
      message: '"@John Doe please review the latest mocks when you can."',
      time: '1d ago',
      isUnread: false,
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmKVl9s-Mxz0LVf-TTO2Oonpu3C-o823aKuB56rW4AvVl3HiBfkUvP2S8afJXrUza830M4u1rJt7LRZG-Ya14HKTm52gH84oxF5MHkqqaOzgkxdaGZy-1RfH_V1N7khzmy-fq2XUoM1weSlA39T5XDe6FJlR_FuDOPWlgJl1TXHxCFsJGCdVqAMgmzbgEPAxrCxUGHxqrbvPbr_yxmbs60C_SIsFCdIWgQVCrN0mkQTVwjBstAvqcl1eOulSRJA0FiWpnHFCly--CS',
      icon: 'alternate_email'
    },
    {
      id: '5',
      type: 'project',
      title: 'Added to Q4 Roadmap',
      message: 'You were added to this project as an editor.',
      time: '2d ago',
      isUnread: false,
      icon: 'folder_shared',
      color: 'slate'
    }
  ];

  // Combine sample with actual notifications
  const allNotifications = [...sampleNotifications, ...notifications];

  const unreadCountValue = unreadCount;

  const getNotificationColor = (type: string, notificationColor?: string) => {
    if (notificationColor) {
      return `text-${notificationColor}-500 bg-${notificationColor}-100 dark:bg-${notificationColor}-900/30`;
    }
    
    switch (type) {
      case 'comment':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      case 'system':
        return 'text-amber-500 bg-amber-100 dark:bg-amber-900/30';
      case 'completion':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'mention':
        return 'text-purple-500 bg-purple-100 dark:bg-purple-900/30';
      case 'project':
        return 'text-slate-500 bg-slate-100 dark:bg-slate-800';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (notification.isUnread) {
      markAsRead(notification.id);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 md:bg-transparent"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="notification-panel fixed top-0 right-0 h-full w-full max-w-[420px] bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-50"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCountValue > 0 && (
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCountValue} New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {unreadCountValue > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Tabs/Filters */}
            <div className="flex gap-6 px-6 border-b border-slate-100 dark:border-slate-800 text-sm">
              <button className="py-3 border-b-2 border-primary text-primary font-medium">
                All
              </button>
              <button className="py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                Unread
              </button>
              <button className="py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                Mentions
              </button>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
              {allNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-slate-400 text-2xl">
                      notifications_off
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No notifications
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div>
                  {allNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`relative p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800/50 group ${
                        !('isUnread' in notification && notification.isUnread) ? 'opacity-75' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {/* Unread Indicator */}
                      {'isUnread' in notification && notification.isUnread && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-sm"></div>
                      )}

                      <div className="flex gap-4">
                        {/* Avatar/Icon */}
                        <div className="relative mt-1">
                          {'userAvatar' in notification && notification.userAvatar ? (
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10"
                              style={{ backgroundImage: `url("${notification.userAvatar}")` }}
                            >
                              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5">
                                <span className="material-symbols-filled text-blue-500 text-[16px]">
                                  {notification.icon || 'notifications'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className={`size-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type, 'color' in notification ? notification.color : undefined)}`}>
                              <span className="material-symbols-outlined">
                                {'icon' in notification ? notification.icon : 'notifications'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col gap-1">
                          <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug">
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            {'time' in notification && (
                              <span className="text-xs text-slate-400">
                                {notification.time}
                              </span>
                            )}
                            {'isUnread' in notification && notification.isUnread && (
                              <button 
                                className="text-xs font-semibold text-primary hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                          {'isUnread' in notification && notification.isUnread && (
                            <div className="size-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button
                onClick={() => {
                  onClose();
                  // Navigate to notification settings
                }}
                className="w-full py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Notification Settings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};