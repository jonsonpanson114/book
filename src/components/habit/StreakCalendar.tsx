import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, subMonths, addMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HabitData } from '../../types';

interface StreakCalendarProps {
  habits: HabitData;
  className?: string;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ habits, className = '' }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const checkInDates = new Set(habits.checkIns.map(ci => ci.date));

  const getCheckInStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const yesterdayStr = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

    if (dateStr > todayStr) return 'future';
    if (checkInDates.has(dateStr)) return 'checked';
    if (dateStr === todayStr && !checkInDates.has(dateStr)) return 'today';
    if (dateStr === yesterdayStr && !checkInDates.has(dateStr) && habits.currentStreak > 0) return 'broken';
    return 'missed';
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());

  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - calendarEnd.getDay()));

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className={`bg-[#151b2e] border border-white/10 rounded-2xl p-4 ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-100">
            {format(currentMonth, 'yyyy年 M月', { locale: ja })}
          </h3>
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>連続 {habits.currentStreak}日</span>
            {habits.longestStreak > 0 && (
              <span className="text-slate-600">（最長 {habits.longestStreak}日）</span>
            )}
          </div>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-1 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="text-center text-[10px] text-slate-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー日付 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const status = getCheckInStatus(date);
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

          return (
            <motion.div
              key={date.toISOString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-[11px] transition-all
                ${!isCurrentMonth ? 'opacity-30' : 'opacity-100'}
                ${status === 'future' ? 'text-slate-600' : ''}
                ${status === 'checked' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                ${status === 'today' ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50' : ''}
                ${status === 'missed' ? 'text-slate-500' : ''}
                ${status === 'broken' ? 'bg-red-500/10 text-red-400' : ''}
                ${isToday(date) && status !== 'checked' && status !== 'today' ? 'text-slate-300' : ''}
              `}
            >
              {format(date, 'd')}
              {status === 'checked' && (
                <div className="absolute bottom-0.5 w-1 h-1 bg-emerald-400 rounded-full" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500/20" />
          <span className="text-[10px] text-slate-500">読書</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-orange-500/20 ring-1 ring-orange-500/50" />
          <span className="text-[10px] text-slate-500">今日</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500/10" />
          <span className="text-[10px] text-slate-500">途切れ</span>
        </div>
      </div>
    </div>
  );
};
