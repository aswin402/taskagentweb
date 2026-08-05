export const APP_NAME = 'TaskAgent';

export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const TASK_CATEGORIES = {
  DYNAMIC: 'dynamic_task',
  STABLE: 'stable_work',
  SCHEDULED: 'scheduled_task',
} as const;

export type TaskCategory = typeof TASK_CATEGORIES[keyof typeof TASK_CATEGORIES];

export const TASK_STATUSES = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ROLLED_OVER: 'rolled_over',
} as const;

export type TaskStatus = typeof TASK_STATUSES[keyof typeof TASK_STATUSES];

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type Priority = typeof PRIORITIES[keyof typeof PRIORITIES];
