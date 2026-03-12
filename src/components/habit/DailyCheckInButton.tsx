import React from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2 } from 'lucide-react';

interface DailyCheckInButtonProps {
  streak: number;
  hasCheckedIn: boolean;
  onClick: () => void;
  className?: string;
}

export const DailyCheckInButton: React.FC<DailyCheckInButtonProps> = ({
  streak,
  hasCheckedIn,
  onClick,
  className = '',
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className={`
        relative overflow-hidden rounded-2xl px-6 py-4 transition-all duration-300
        ${hasCheckedIn
          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/20'
          : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-orange-500/20'
        }
        ${className}
      `}
    >
      {/* 脈動エフェクト（未チェックイン時のみ） */}
      {!hasCheckedIn && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      <div className="relative flex items-center gap-3">
        <div className="relative">
          <motion.div
            animate={hasCheckedIn ? {} : { rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            {hasCheckedIn ? (
              <CheckCircle2 className="w-6 h-6 text-white" />
            ) : (
              <Flame className="w-6 h-6 text-white" />
            )}
          </motion.div>
          {/* ストリークバッジ */}
          {streak > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white text-xs font-bold text-orange-600">
              {streak}
            </span>
          )}
        </div>

        <div className="text-left">
          <div className="text-sm font-bold text-white">
            {hasCheckedIn ? 'チェックイン完了！' : '今日読んだ'}
          </div>
          <div className="text-xs text-white/80">
            {hasCheckedIn
              ? `連続${streak}日！`
              : streak > 0 ? `連続${streak}日継続中` : '習慣を始めよう'}
          </div>
        </div>
      </div>
    </motion.button>
  );
};
