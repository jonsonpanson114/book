import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flame, CheckCircle, Book, X } from 'lucide-react';
import type { Achievement } from '../../types';

interface CheckInConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  booksReadToday: number;
  xpGained?: number;
  achievements?: Achievement[];
}

export const CheckInConfirmation: React.FC<CheckInConfirmationProps> = ({
  isOpen,
  onClose,
  streak,
  booksReadToday,
  xpGained = 0,
  achievements = [],
}) => {
  React.useEffect(() => {
    if (isOpen) {
      // コンフェッティ発射
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2,
          },
        });
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2,
          },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

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
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm bg-[#151b2e] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              {/* 背景グロー */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/5 pointer-events-none" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 火のアイコンアニメーション */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  className="relative"
                >
                  <Flame className="w-16 h-16 text-orange-400" />
                  <motion.div
                    className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>

              {/* メッセージ */}
              <div className="text-center mb-6">
                <motion.h2
                  className="text-2xl font-bold text-white mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  チェックイン完了！
                </motion.h2>
                <motion.p
                  className="text-slate-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  今日の読書を記録しました
                </motion.p>
              </div>

              {/* ステータス表示 */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <StatCard
                  icon={<Flame className="w-5 h-5" />}
                  label="連続日数"
                  value={`${streak}日`}
                  delay={0.5}
                  color="text-orange-400"
                  bg="bg-orange-500/10"
                />
                <StatCard
                  icon={<Book className="w-5 h-5" />}
                  label="今日読んだ"
                  value={`${booksReadToday}冊`}
                  delay={0.6}
                  color="text-blue-400"
                  bg="bg-blue-500/10"
                />
              </div>

              {/* XP獲得 */}
              {xpGained > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mb-6 text-center"
                >
                  <span className="text-xs text-slate-500">獲得XP</span>
                  <div className="text-2xl font-bold text-amber-400">+{xpGained} XP</div>
                </motion.div>
              )}

              {/* 実績獲得 */}
              {achievements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4"
                >
                  <div className="text-xs text-amber-400 mb-2 font-medium">
                    🎉 新しい実績を獲得！
                  </div>
                  {achievements.slice(0, 2).map((achievement, index) => (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-3 ${index > 0 ? 'mt-2' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{achievement.name}</div>
                        <div className="text-xs text-slate-400">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* 閉じるボタン */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                onClick={onClose}
                className="w-full mt-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white font-medium hover:from-orange-600 hover:to-amber-600 transition-all"
              >
                続ける
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
  color: string;
  bg: string;
}> = ({ icon, label, value, delay, color, bg }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className={`${bg} border border-white/5 rounded-xl p-3 text-center`}
  >
    <div className="flex justify-center mb-1">
      <span className={color}>{icon}</span>
    </div>
    <div className="text-lg font-bold text-white">{value}</div>
    <div className="text-[10px] text-slate-500">{label}</div>
  </motion.div>
);
