import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock, Unlock } from 'lucide-react';
import type { Achievement } from '../../types';
import { BadgeCard } from './BadgeCard';

interface AchievementGalleryProps {
  achievements: Achievement[];
  isOpen: boolean;
  onClose: () => void;
  onAchievementClick?: (achievement: Achievement) => void;
}

type FilterTab = 'all' | 'unlocked' | 'locked';

export const AchievementGallery: React.FC<AchievementGalleryProps> = ({
  achievements,
  isOpen,
  onClose,
  onAchievementClick,
}) => {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked' && a.unlockedAt === null) return false;
    if (filter === 'locked' && a.unlockedAt !== null) return false;
    if (selectedRarity !== 'all' && a.rarity !== selectedRarity) return false;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlockedAt !== null).length;
  const totalCount = achievements.length;

  const rarityOptions = [
    { value: 'all', label: 'すべて' },
    { value: 'legendary', label: 'レジェンダリー' },
    { value: 'epic', label: 'エピック' },
    { value: 'rare', label: 'レア' },
    { value: 'common', label: 'コモン' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* メインコンテンツ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl max-h-[85vh] bg-[#151b2e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              {/* ヘッダー */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-bold text-white">実績ギャラリー</h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {unlockedCount} / {totalCount} 解放済み
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* フィルター */}
              <div className="p-4 border-b border-white/10 space-y-3">
                {/* タブフィルター */}
                <div className="flex gap-2">
                  <FilterTab
                    active={filter === 'all'}
                    onClick={() => setFilter('all')}
                    icon={<Trophy className="w-3.5 h-3.5" />}
                    label="すべて"
                    count={totalCount}
                  />
                  <FilterTab
                    active={filter === 'unlocked'}
                    onClick={() => setFilter('unlocked')}
                    icon={<Unlock className="w-3.5 h-3.5" />}
                    label="解放済み"
                    count={unlockedCount}
                  />
                  <FilterTab
                    active={filter === 'locked'}
                    onClick={() => setFilter('locked')}
                    icon={<Lock className="w-3.5 h-3.5" />}
                    label="未解放"
                    count={totalCount - unlockedCount}
                  />
                </div>

                {/* レアリティフィルター */}
                <div className="flex flex-wrap gap-2">
                  {rarityOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedRarity(option.value)}
                      className={`
                        px-3 py-1 rounded-full text-[10px] font-medium transition-all
                        ${selectedRarity === option.value
                          ? option.value === 'all' ? 'bg-slate-600 text-white' :
                            option.value === 'legendary' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' :
                            option.value === 'epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                            option.value === 'rare' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                            'bg-slate-500/20 text-slate-400 border border-slate-500/50'
                          : 'bg-transparent text-slate-500 hover:text-slate-400'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 実績リスト */}
              <div className="flex-1 overflow-y-auto p-4">
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredAchievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <BadgeCard
                          achievement={achievement}
                          onClick={() => onAchievementClick?.(achievement)}
                          size="md"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {filteredAchievements.length === 0 && (
                  <div className="text-center py-12">
                    <Lock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">該当する実績がありません</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const FilterTab: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}> = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`
      flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
      ${active
        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        : 'bg-transparent text-slate-500 hover:bg-white/5 hover:text-slate-400'
      }
    `}
  >
    {icon}
    <span>{label}</span>
    {count > 0 && (
      <span className={`px-1.5 py-0.5 rounded text-[9px] ${active ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
        {count}
      </span>
    )}
  </button>
);
