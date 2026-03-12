import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check } from 'lucide-react';
import { requestNotificationPermission } from '../../services/notifications';

interface NotificationPermissionProps {
  onRequest: () => void;
  onDismiss: () => void;
  delay?: number; // 表示までの遅延（ms）
}

export const NotificationPermission: React.FC<NotificationPermissionProps> = ({
  onRequest,
  onDismiss,
  delay = 3000,
}) => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!('Notification' in window)) {
        return;
      }
      if (Notification.permission === 'default' && !dismissed) {
        setShow(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, dismissed]);

  const handleRequest = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      onRequest();
    }
    setShow(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
    onDismiss();
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-20 left-4 right-4 z-[150]"
        >
          <div className="bg-[#151b2e] border border-white/10 rounded-2xl p-4 shadow-2xl">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-blue-400" />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-bold text-white mb-1">
                  毎日の読書リマインダー
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  通知を有効にすると、毎日のチェックインやストリーク維持をお知らせします。
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={handleRequest}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    許可する
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 bg-[#0a0f1c] text-slate-400 text-xs font-medium rounded-lg hover:text-white transition-colors"
                  >
                    後で
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
