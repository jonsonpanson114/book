import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Sparkles } from 'lucide-react';
import type { Achievement } from '../../types';
import { RARITY_COLORS, RARITY_NAMES, type Rarity } from '../../types';
import * as Icons from 'lucide-react';

interface AchievementModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const IconMap: Record<string, any> = Icons;

export const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    if (achievement && achievement.unlockedAt) {
      // コンフェッティ発射
      const particleCount = 150;

      confetti({
        particleCount,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#fbbf24', '#ffffff'],
      });

      // 追加のパーティクル（レジェンダリー時はより派手に）
      if (achievement.rarity === 'legendary') {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#fbbf24', '#f59e0b', '#ffffff', '#60a5fa'],
            shapes: ['star'],
          });
        }, 300);
      }
    }
  }, [achievement]);

  if (!achievement) return null;

  const IconComponent = IconMap[achievement.icon] || Icons.Trophy;
  const rarityStyle = RARITY_COLORS[achievement.rarity];

  const getRarityGlowColor = (rarity: Rarity): string => {
    switch (rarity) {
      case 'common': return 'from-gray-500/20 to-gray-600/10';
      case 'rare': return 'from-blue-500/30 to-blue-600/10';
      case 'epic': return 'from-purple-500/30 to-purple-600/10';
      case 'legendary': return 'from-amber-500/40 to-orange-500/20';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 5 }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 300,
          }}
          className="pointer-events-auto w-full max-w-sm bg-gradient-to-br from-[#151b2e] to-[#0a0f1c] border-2 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
          style={{ borderColor: rarityStyle.border }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 背景グロー */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${getRarityGlowColor(achievement.rarity)}`}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* 光芒エフェクト */}
          {achievement.rarity === 'legendary' && (
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-0 left-1/2 w-[200%] h-full bg-gradient-to-r from-transparent via-amber-500/10 to-transparent -translate-x-1/2"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}

          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white transition-colors pointer-events-auto"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ヘッダー */}
          <div className="relative text-center mb-6">
            {/* アイコン */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                delay: 0.1,
                damping: 15,
                stiffness: 200,
              }}
              className="relative inline-block"
            >
              <div
                className={`
                  relative w-24 h-24 rounded-2xl flex items-center justify-center
                  ${achievement.rarity === 'legendary' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                    achievement.rarity === 'epic' ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                    achievement.rarity === 'rare' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                    'bg-gradient-to-br from-gray-500 to-gray-600'}
                  shadow-lg
                `}
                style={{ boxShadow: `0 0 40px ${rarityStyle.glow}` }}
              >
                <IconComponent className="w-12 h-12 text-white" />

                {/* キラキラエフェクト */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* レアリティバッジ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider"
                style={{
                  backgroundColor: `${rarityStyle.border}aa`,
                  textShadow: `0 0 10px ${rarityStyle.border}`,
                }}
              >
                {RARITY_NAMES[achievement.rarity]}
              </span>
            </motion.div>
          </div>

          {/* 実績情報 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              {achievement.name}
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              {achievement.description}
            </p>

            {/* XP獲得 */}
            <div className="bg-[#0a0f1c]/50 border border-white/10 rounded-xl p-4 mb-6">
              <div className="text-xs text-slate-500 mb-1">獲得XP</div>
              <div className="text-3xl font-bold text-amber-400 flex items-center justify-center gap-2">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                >
                  +{achievement.xpReward}
                </motion.span>
                <span className="text-lg text-slate-400">XP</span>
              </div>
            </div>

            {/* 閉じるボタン */}
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/10 rounded-xl text-white font-medium transition-all"
            >
              続ける
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
