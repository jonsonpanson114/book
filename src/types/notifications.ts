// 通知用タイプ定義

export type ReminderTone = 'default' | 'gentle' | 'urgent';

export interface NotificationPreferences {
  enabled: boolean;
  dailyReminderTime: string; // "HH:MM" format (24-hour)
  streakWarningEnabled: boolean;
  reminderTone: ReminderTone;
}

export interface ScheduledReminder {
  id: string;
  type: 'daily_reminder' | 'streak_warning' | 'celebration';
  scheduledFor: string; // ISO timestamp
  message: string;
  title?: string;
}

export type NotificationPermission = 'default' | 'granted' | 'denied';
