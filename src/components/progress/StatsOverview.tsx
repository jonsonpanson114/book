import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Book, Zap, ArrowRight } from 'lucide-react';
import type { HabitData, GamificationData, ReadingGoals } from '../../types';
import { BadgeCard } from '../gamification/BadgeCard';
import { LevelProgress } from '../gamification/LevelProgress';

interface StatsOverviewProps {
  habits: HabitData;
  gamification: GamificationData;
  goals: ReadingGoals;
  onAchievementClick?: (achievement: any) => void;
  className?: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  habits,
  gamification,
  goals,
  onAchievementClick,
  className = '',
}) => {
  const recentAchievements = gamification.achievements
    .filter(a => a.unlockedAt !== null)
    .sort((a, b) => {
      const timeA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
      const timeB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 3);

  const thisMonthCheckIns = habits.checkIns.filter(ci => {
    const checkInDate = new Date(ci.date);
    const now = new Date();
    return checkInDate.getMonth() === now.getMonth() && checkInDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* メインカード */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3"
      >
        {/* ストリークカード */}
        <StatCard
          icon={<Flame className="w-5 h-5" />}
          value={`${habits.currentStreak}日`}
          sub={`最長 ${habits.longestStreak}日`}
          color="from-orange-500/20 to-amber-500/10"
          borderColor="border-orange-500/30"
          iconColor="text-orange-400"
        />

        {/* レベルカード */}
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          value={`Lv.${gamification.level.currentLevel}`}
          sub={`+${gamification.level.currentXP} XP`}
          color="from-amber-500/20 to-yellow-500/10"
          borderColor="border-amber-500/30"
          iconColor="text-amber-400"
        />
      </motion.div>

      {/* レベルプログレスバー */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <LevelProgress level={gamification.level} />
      </motion.div>

      {/* 今月の成果 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-[#151b2e] border border-white/10 rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Book className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-200">今月の成果</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0a0f1c] rounded-lg p-3">
            <div className="text-[10px] text-slate-500 mb-1">読書日数</div>
            <div className="text-xl font-bold text-white">{thisMonthCheckIns}日</div>
          </div>
          <div className="bg-[#0a0f1c] rounded-lg p-3">
            <div className="text-[10px] text-slate-500 mb-1">読了冊数</div>
            <div className="text-xl font-bold text-white">{goals.monthlyProgress}冊</div>
          </div>
        </div>

        {/* 目標進捗 */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-500">月間目標</span>
            <span className="text-slate-300">
              {goals.monthlyProgress} / {goals.monthlyGoal}冊
            </span>
          </div>
          <div className="h-2 bg-[#0a0f1c] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (goals.monthlyProgress / goals.monthlyGoal) * 100)}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* 最近の実績 */}
      {recentAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-slate-200">最近の実績</span>
            </div>
          </div>

          <div className="space-y-2">
            {recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
              >
                <BadgeCard
                  achievement={achievement}
                  onClick={() => onAchievementClick?.(achievement)}
                  size="sm"
                  className="w-full"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 実績ギャラリーへのリンク */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => onAchievementClick?.(null)} // null indicates gallery
        className="flex items-center justify-center gap-2 w-full py-3 bg-[#0a0f1c] border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
      >
        <Trophy className="w-4 h-4" />
        <span>すべての実績を見る</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string;
  sub: string;
  color: string;
  borderColor: string;
  iconColor: string;
}> = ({ icon, value, sub, color, borderColor, iconColor }) => (
  <div className={`${color} ${borderColor} border rounded-xl p-4`}>
    <div className={`flex items-center gap-2 ${iconColor} mb-2`}>
      {icon}
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-xs text-slate-500">{sub}</div>
  </div>
);
