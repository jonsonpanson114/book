import type { NotificationPreferences, NotificationPermission } from '../types';

const NOTIFICATIONS_KEY = 'jinnai_notifications';

// 初期設定を取得
const getInitialPreferences = (): NotificationPreferences => {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse notification preferences:', e);
  }
  return {
    enabled: false,
    dailyReminderTime: '21:00',
    streakWarningEnabled: true,
    reminderTone: 'gentle',
  };
};

// 通知パーミッションの状態を取得
export const getNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission as NotificationPermission;
};

// 通知パーミッションをリクエスト
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// 通知を送信
export const sendNotification = (title: string, options: NotificationOptions = {}): void => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  // Service Workerがあれば使う（PWA）
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, {
        ...options,
        icon: '/icon.svg',
        badge: '/icon.svg',
      } as NotificationOptions);
    });
  } else {
    // フォールバック: 標準通知
    new Notification(title, {
      ...options,
      icon: '/icon.svg',
    });
  }
};

// 通知設定を取得
export const getNotificationPreferences = (): NotificationPreferences => {
  return getInitialPreferences();
};

// 通知設定を保存
export const saveNotificationPreferences = (preferences: Partial<NotificationPreferences>): void => {
  const current = getNotificationPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
};

// 通知のスケジュール（ブラウザの通知はバックグラウンドで動作しないため、
// 実際のアプリではService Workerで実装する必要があります）
// ここではデモ用に即時通知を送信する関数を提供します

export const sendDailyReminder = (): void => {
  const prefs = getNotificationPreferences();
  if (!prefs.enabled) return;

  sendNotification('読書の時間です！', {
    body: '今日のチェックインを忘れずに！ストリークを守ろう。',
    tag: 'daily-reminder',
  });
};

export const sendStreakWarning = (daysSinceLastCheckIn: number): void => {
  const prefs = getNotificationPreferences();
  if (!prefs.enabled || !prefs.streakWarningEnabled) return;

  const messages = [
    `ストリークが危険！${daysSinceLastCheckIn}日間チェックインしていません`,
    '今日読書してストリークを守ろう！',
    'ストリークが途切れそうです！本を開こう！',
  ];

  sendNotification('ストリーク警告', {
    body: messages[Math.floor(Math.random() * messages.length)],
    tag: 'streak-warning',
  });
};

export const sendStreakRecovery = (streakCount: number): void => {
  const prefs = getNotificationPreferences();
  if (!prefs.enabled) return;

  sendNotification('ストリーク維持！', {
    body: `${streakCount}日連続読書達成！この調子で続けよう！`,
    tag: 'streak-recovery',
  });
};

export const sendAchievementNotification = (achievementName: string): void => {
  const prefs = getNotificationPreferences();
  if (!prefs.enabled) return;

  sendNotification('🎉 新しい実績！', {
    body: `「${achievementName}」を獲得しました！`,
    tag: 'achievement',
  });
};

export const sendLevelUpNotification = (newLevel: number): void => {
  const prefs = getNotificationPreferences();
  if (!prefs.enabled) return;

  sendNotification('⚡ LEVEL UP!', {
    body: `レベル${newLevel}に到達しました！`,
    tag: 'level-up',
  });
};

// 時刻チェックと通知送信（アクティブ時にのみ動作）
export const checkAndSendScheduledNotifications = (lastCheckInDate: string | null): void => {
  const prefs = getNotificationPreferences();
  if (!prefs.enabled) return;

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // 毎日リマインダー
  if (currentTime === prefs.dailyReminderTime) {
    const today = now.toISOString().split('T')[0];
    if (lastCheckInDate !== today) {
      sendDailyReminder();
    }
  }

  // ストリーク警告
  if (prefs.streakWarningEnabled && lastCheckInDate) {
    const lastCheckIn = new Date(lastCheckInDate);
    const daysSince = Math.floor((now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince >= 2) {
      sendStreakWarning(daysSince);
    }
  }
};
