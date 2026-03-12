import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { Achievement } from '../../types';
import { RARITY_COLORS, RARITY_NAMES } from '../../types';

interface BadgeCardProps {
  achievement: Achievement;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const IconMap: Record<string, any> = Icons;

export const BadgeCard: React.FC<BadgeCardProps> = ({
  achievement,
  onClick,
  className = '',
  size = 'md',
}) => {
  const isUnlocked = achievement.unlockedAt !== null;
  const IconComponent = IconMap[achievement.icon] || Icons.Star;
  const rarityStyle = RARITY_COLORS[achievement.rarity];

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const labelSizes = {
    sm: 'text-[9px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
      whileTap={{ scale: 0.95 }}
      className={`
        relative overflow-hidden rounded-xl border transition-all duration-300 text-left
        ${isUnlocked
          ? `${rarityStyle.bg} border-${rarityStyle.border}/50 bg-opacity-30`
          : 'bg-[#0a0f1c] border-slate-700/50 opacity-50'
        }
        ${sizeClasses[size]}
        ${className}
      `}
      style={
        isUnlocked
          ? {
              borderColor: rarityStyle.border,
              boxShadow: rarityStyle.glow ? `0 0 20px ${rarityStyle.glow}` : undefined,
            }
          : {}
      }
    >
      {/* アイコン */}
      <div className={`flex items-center gap-2 ${size === 'lg' ? 'flex-col gap-3' : ''}`}>
        <div
          className={`
            rounded-lg flex items-center justify-center
            ${isUnlocked ? 'bg-white/10' : 'bg-slate-800'}
            ${size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2'}
          `}
        >
          <IconComponent
            className={`
              ${iconSizes[size]}
              ${isUnlocked ? 'text-white' : 'text-slate-600'}
            `}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* 実績名 */}
          <div className={`${labelSizes[size]} font-medium text-white truncate`}>
            {achievement.name}
          </div>

          {/* 説明 */}
          {size !== 'sm' && (
            <div className="text-[10px] text-slate-400 truncate">
              {achievement.description}
            </div>
          )}

          {/* 進捗バー（未アンロック時） */}
          {!isUnlocked && achievement.progress && (
            <div className="mt-1.5 w-full h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-500 rounded-full"
                style={{
                  width: `${(achievement.progress.current / achievement.progress.target) * 100}%`,
                }}
              />
            </div>
          )}
        </div>

        {/* レアリティインジケーター */}
        {size !== 'sm' && (
          <div
            className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
              isUnlocked
                ? `bg-${rarityStyle.border}/20 text-white`
                : 'bg-slate-800 text-slate-500'
            }`}
            style={
              isUnlocked ? { backgroundColor: `${rarityStyle.border}33` } : {}
            }
          >
            {RARITY_NAMES[achievement.rarity]}
          </div>
        )}
      </div>

      {/* XP表示 */}
      {isUnlocked && size !== 'sm' && (
        <div className="absolute bottom-1 right-2 text-[9px] text-amber-400 font-medium">
          +{achievement.xpReward} XP
        </div>
      )}

      {/* アンロック日時 */}
      {isUnlocked && achievement.unlockedAt && size !== 'sm' && (
        <div className="absolute top-1 right-1 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
      )}
    </motion.button>
  );
};
