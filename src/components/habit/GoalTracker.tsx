import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReadingGoals } from '../../types';

interface GoalTrackerProps {
  goals: ReadingGoals;
  onEditGoals?: () => void;
  className?: string;
}

export const GoalTracker: React.FC<GoalTrackerProps> = ({ goals, onEditGoals, className = '' }) => {
  const monthlyPercent = Math.min(100, (goals.monthlyProgress / goals.monthlyGoal) * 100);
  const yearlyPercent = Math.min(100, (goals.yearlyProgress / goals.yearlyGoal) * 100);

  return (
    <div className={`bg-[#151b2e] border border-white/10 rounded-2xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-100">読書目標</h3>
        </div>
        {onEditGoals && (
          <button
            onClick={onEditGoals}
            className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
          >
            編集
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* 月間目標 */}
        <GoalBar
          label="今月"
          current={goals.monthlyProgress}
          goal={goals.monthlyGoal}
          percent={monthlyPercent}
          color="from-blue-500 to-cyan-500"
        />

        {/* 年間目標 */}
        <GoalBar
          label="今年"
          current={goals.yearlyProgress}
          goal={goals.yearlyGoal}
          percent={yearlyPercent}
          color="from-purple-500 to-pink-500"
        />
      </div>
    </div>
  );
};

interface GoalBarProps {
  label: string;
  current: number;
  goal: number;
  percent: number;
  color: string;
}

const GoalBar: React.FC<GoalBarProps> = ({ label, current, goal, percent, color }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-medium text-slate-200">
          {current} / {goal}冊
        </span>
      </div>
      <div className="relative h-2 bg-[#0a0f1c] rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {/* パーセンテージ表示 */}
        {percent >= 10 && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(percent)}%
          </motion.span>
        )}
      </div>
      {/* 達成表示 */}
      {percent >= 100 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1"
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </motion.div>
      )}
    </div>
  );
};
