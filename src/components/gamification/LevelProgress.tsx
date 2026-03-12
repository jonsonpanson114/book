import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Crown } from 'lucide-react';
import type { UserLevel } from '../../types';

interface LevelProgressProps {
  level: UserLevel;
  showLabel?: boolean;
  compact?: boolean;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  showLabel = true,
  compact = false,
}) => {
  const percent = (level.currentXP / level.xpToNextLevel) * 100;
  const isMaxLevel = level.currentLevel >= 50; // 50レベルを最大とする

  return (
    <div className={compact ? 'flex items-center gap-2' : ''}>
      {/* レベル表示 */}
      <motion.div
        className={`
          relative flex items-center justify-center
          ${compact
            ? 'w-8 h-8 rounded-lg'
            : 'w-12 h-12 rounded-xl'
          }
          bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30
        `}
        whileHover={{ scale: 1.1 }}
      >
        {level.currentLevel >= 10 && (
          <Crown className="absolute -top-1 -right-1 w-3 h-3 text-amber-400" />
        )}
        <span className={`font-bold ${compact ? 'text-sm' : 'text-lg'} text-amber-400`}>
          {level.currentLevel}
        </span>
      </motion.div>

      {/* プログレスバー */}
      {!compact && (
        <div className="flex-1">
          {showLabel && (
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400">XP</span>
              <span className="text-slate-300 font-medium">
                {level.currentXP} / {level.xpToNextLevel}
              </span>
            </div>
          )}
          <div className="relative h-2 bg-[#0a0f1c] rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: isMaxLevel ? 100 : percent }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* グローエフェクト */}
              {percent > 10 && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* コンパクト表示の場合のプログレスバー */}
      {compact && (
        <div className="w-16 h-1.5 bg-[#0a0f1c] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            animate={{ width: isMaxLevel ? 100 : percent }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </div>
  );
};

export const LevelUpBanner: React.FC<{
  from: number;
  to: number;
  onClose: () => void;
}> = ({ from, to, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
    >
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl px-6 py-4 shadow-2xl shadow-amber-500/30 flex items-center gap-4">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Zap className="w-6 h-6 text-white" />
        </motion.div>
        <div className="text-white">
          <div className="text-sm font-bold">LEVEL UP!</div>
          <div className="text-xs text-white/80">
            Lv.{from} → Lv.{to}
          </div>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-2xl font-bold"
        >
          {to}
        </motion.div>
      </div>
    </motion.div>
  );
};
