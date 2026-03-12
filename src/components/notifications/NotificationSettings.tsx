import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, BellOff, Clock, Volume2, Info } from 'lucide-react';
import type { NotificationPreferences, NotificationPermission } from '../../types';
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  requestNotificationPermission,
  getNotificationPermission,
} from '../../services/notifications';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(getNotificationPreferences());
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPreferences(getNotificationPreferences());
      getNotificationPermission().then(setPermission);
    }
  }, [isOpen]);

  const handleToggleEnabled = async () => {
    if (!preferences.enabled) {
      setRequesting(true);
      const granted = await requestNotificationPermission();
      setPermission(granted ? 'granted' : 'denied');

      if (granted) {
        setPreferences(prev => ({ ...prev, enabled: true }));
        saveNotificationPreferences({ enabled: true });
      }
      setRequesting(false);
    } else {
      setPreferences(prev => ({ ...prev, enabled: false }));
      saveNotificationPreferences({ enabled: false });
    }
  };

  const handleTimeChange = (time: string) => {
    setPreferences(prev => ({ ...prev, dailyReminderTime: time }));
    saveNotificationPreferences({ dailyReminderTime: time });
  };

  const handleToggleStreakWarning = () => {
    setPreferences(prev => ({ ...prev, streakWarningEnabled: !prev.streakWarningEnabled }));
    saveNotificationPreferences({ streakWarningEnabled: !preferences.streakWarningEnabled });
  };

  const handleToneChange = (tone: NotificationPreferences['reminderTone']) => {
    setPreferences(prev => ({ ...prev, reminderTone: tone }));
    saveNotificationPreferences({ reminderTone: tone });
  };

  const timeOptions = [
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' },
    { value: '22:00', label: '22:00' },
    { value: '23:00', label: '23:00' },
  ];

  const toneOptions: Array<{ value: NotificationPreferences['reminderTone']; label: string }> = [
    { value: 'gentle', label: '優しく' },
    { value: 'default', label: '標準' },
    { value: 'urgent', label: '重要' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm bg-[#151b2e] border border-white/10 rounded-2xl p-6">
              {/* ヘッダー */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {preferences.enabled ? (
                    <Bell className="w-5 h-5 text-blue-400" />
                  ) : (
                    <BellOff className="w-5 h-5 text-slate-500" />
                  )}
                  <h2 className="text-lg font-bold text-white">通知設定</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 通知ON/OFF */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">通知を有効にする</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleEnabled}
                    disabled={requesting}
                    className={`
                      w-12 h-6 rounded-full p-1 transition-colors relative
                      ${preferences.enabled ? 'bg-blue-500' : 'bg-slate-700'}
                    `}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full shadow-md"
                      animate={{ x: preferences.enabled ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
                {permission === 'denied' && (
                  <div className="flex items-start gap-2 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <Info className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-400">
                      通知が拒否されています。ブラウザの設定で通知を許可してください。
                    </p>
                  </div>
                )}
                {permission === 'granted' && preferences.enabled && (
                  <p className="text-xs text-emerald-400 mt-2">通知が有効になっています</p>
                )}
              </div>

              {/* 時間設定 */}
              {preferences.enabled && (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <label className="text-sm text-white">毎日リマインダー時刻</label>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {timeOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleTimeChange(option.value)}
                          className={`
                            py-2 rounded-lg text-xs font-medium transition-all
                            ${preferences.dailyReminderTime === option.value
                              ? 'bg-blue-500 text-white'
                              : 'bg-[#0a0f1c] text-slate-400 hover:bg-white/5'
                            }
                          `}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ストリーク警告 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FlameIcon />
                        <span className="text-sm text-white">ストリーク警告</span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleToggleStreakWarning}
                        className={`
                          w-12 h-6 rounded-full p-1 transition-colors relative
                          ${preferences.streakWarningEnabled ? 'bg-blue-500' : 'bg-slate-700'}
                        `}
                      >
                        <motion.div
                          className="w-4 h-4 bg-white rounded-full shadow-md"
                          animate={{ x: preferences.streakWarningEnabled ? 24 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      チェックインが2日間ない場合に通知します
                    </p>
                  </div>

                  {/* トーン設定 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Volume2 className="w-4 h-4 text-slate-400" />
                      <label className="text-sm text-white">通知トーン</label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {toneOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleToneChange(option.value)}
                          className={`
                            py-2 rounded-lg text-xs font-medium transition-all
                            ${preferences.reminderTone === option.value
                              ? 'bg-blue-500 text-white'
                              : 'bg-[#0a0f1c] text-slate-400 hover:bg-white/5'
                            }
                          `}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const FlameIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.246-3.414-2.5-6.5a2.5 2.5 0 0 0 4 4c0-.5-.5-2-1-3a2.5 2.5 0 0 1 4 4c0-.5-.5-2-1-3a2.5 2.5 0 0 1 4.5 2.5" />
    <path d="M15.5 16.5A2.5 2.5 0 0 1 13 19c0 1.38.5 2 1 3 1.072 2.143 2.246 3.414 2.5 6.5a2.5 2.5 0 0 0-4-4c0 .5.5 2 1 3a2.5 2.5 0 0 1-4-4c0 .5.5 2 1 3a2.5 2.5 0 0 1-4.5-2.5" />
  </svg>
);
