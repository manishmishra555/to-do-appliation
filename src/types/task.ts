// src/types/task.ts

// Subtask interface
export interface Subtask {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  estimatedDuration?: number; // in minutes
  timeSpent?: number; // in minutes
  position: number;
  attachments?: Array<{
    url: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    uploadedBy: string;
  }>;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Collaborator interface
export interface Collaborator {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: 'viewer' | 'editor' | 'owner';
  addedAt: string;
  addedBy: string;
}

// Time entry interface
export interface TimeEntry {
  start: string;
  end?: string;
  duration?: number; // in minutes
  note?: string;
}

// Reminder interface
export interface Reminder {
  type: 'email' | 'push' | 'in_app' | 'sms';
  timeBefore: number; // minutes before dueDate
  sent: boolean;
  sentAt?: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

// Attachment interface
export interface Attachment {
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  thumbnail?: string;
}

// Location interface
export interface Location {
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
  radius?: number; // in meters
}

// Recurring interface
export interface Recurring {
  enabled: boolean;
  pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  daysOfMonth?: number[]; // 1-31
  monthsOfYear?: number[]; // 1-12
  endDate?: string;
  occurrences?: number;
  skipCompleted?: boolean;
  lastGenerated?: string;
}

// Main Task interface matching backend ITask
export interface Task {
  _id: string;
  user: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'archived' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  tags: string[];
  color?: string;

  // Time management
  dueDate?: string;
  startDate?: string;
  estimatedDuration?: number; // in minutes
  timeSpent: number; // in minutes
  timeEntries: TimeEntry[];

  // Task relationships
  subtasks: Subtask[];
  parentTask?: string;
  dependencies: string[]; // Task IDs that must be completed before this one
  relatedTasks: string[]; // Related but not dependent tasks
  project?: string;

  // Collaboration
  collaborators: Collaborator[];
  privacy: 'private' | 'shared' | 'public';
  sharedWith: string[];

  // Recurrence
  recurring: Recurring;

  // Reminders and notifications
  reminders: Reminder[];

  // Position and ordering
  position: number;
  column?: string; // For Kanban boards
  order: number; // For custom ordering within columns

  // Attachments
  attachments: Attachment[];

  // Location
  location?: Location;

  // Completion tracking
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  completionNotes?: string;

  // Archival
  archived: boolean;
  archivedAt?: string;
  archivedBy?: string;
  autoArchived: boolean;

  // Soft delete
  deletedAt?: string;
  deletedBy?: string;

  // Analytics and metadata
  metadata: {
    createdFrom?: string; // 'web', 'mobile', 'import', 'api'
    source?: string; // 'manual', 'template', 'recurring'
    templateId?: string;
    lastEditedBy?: string;
    editCount: number;
    viewCount: number;
    favoriteCount: number;
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;

  // Virtuals (computed on frontend)
  isOverdue?: boolean;
  progress?: number;
  daysUntilDue?: number;
  totalSubtasks?: number;
  completedSubtasks?: number;
  isActive?: boolean;
  isShared?: boolean;
  estimatedCompletion?: string;
}

// Simplified interface for creating new tasks
export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  tags?: string[];
  color?: string;
  dueDate?: string;
  startDate?: string;
  estimatedDuration?: number;
  project?: string;
  reminders?: Omit<Reminder, 'sent' | 'sentAt' | 'acknowledged' | 'acknowledgedAt'>[];
  recurring?: Partial<Recurring>;
  attachments?: Omit<Attachment, 'uploadedAt' | 'uploadedBy' | 'thumbnail'>[];
  location?: Location;
}

// Interface for updating tasks
export interface UpdateTaskData extends Partial<Omit<Task, '_id' | 'user' | 'createdAt' | 'lastActivityAt'>> {
  _id?: string;
}

// Task statistics interface
export interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
  completionRate: number;
  byPriority: Array<{
    _id: string;
    count: number;
    completed: number;
  }>;
  byCategory: Array<{
    _id: string;
    count: number;
    completed: number;
  }>;
  recentActivity: Array<{
    _id: string;
    title: string;
    completed: boolean;
    updatedAt: string;
    priority: string;
  }>;
}

// Query parameters for task listing
export interface TaskQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  tag?: string;
  search?: string;
  completed?: boolean;
  overdue?: boolean;
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
