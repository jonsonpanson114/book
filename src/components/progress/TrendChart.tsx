import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, TrendingUp, Book } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import type { HabitData } from '../../types';

interface TrendChartProps {
  habits: HabitData;
  booksReadThisMonth: number;
  className?: string;
}

type Period = 'week' | 'month' | 'year';

export const TrendChart: React.FC<TrendChartProps> = ({
  habits,
  booksReadThisMonth,
  className = '',
}) => {
  const [period, setPeriod] = useState<Period>('week');

  const chartData = useMemo(() => {
    const now = new Date();
    const checkInDates = new Set(habits.checkIns.map(ci => ci.date));

    if (period === 'week') {
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

      return days.map(day => ({
        date: format(day, 'M/d'),
        checkedIn: checkInDates.has(format(day, 'yyyy-MM-dd')) ? 1 : 0,
        fullDate: format(day, 'yyyy-MM-dd'),
      }));
    }

    if (period === 'month') {
      const monthDays = [];
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      for (let i = 1; i <= monthEnd.getDate(); i++) {
        const day = new Date(now.getFullYear(), now.getMonth(), i);
        monthDays.push({
          date: i.toString(),
          checkedIn: checkInDates.has(format(day, 'yyyy-MM-dd')) ? 1 : 0,
          fullDate: format(day, 'yyyy-MM-dd'),
        });
      }

      return monthDays;
    }

    // Year view - monthly data
    const monthlyData = [];
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(now.getFullYear(), i, 1);
      const monthName = format(monthDate, 'M月');
      const monthStart = new Date(now.getFullYear(), i, 1);
      const monthEnd = new Date(now.getFullYear(), i + 1, 0);

      let checkedInDays = 0;
      for (let d = monthStart; d <= monthEnd; d.setDate(d.getDate() + 1)) {
        if (checkInDates.has(format(d, 'yyyy-MM-dd'))) {
          checkedInDays++;
        }
      }

      monthlyData.push({
        date: monthName,
        checkedIn: checkedInDays,
        fullDate: `${now.getFullYear()}-${String(i + 1).padStart(2, '0')}`,
      });
    }

    return monthlyData;
  }, [habits.checkIns, period]);

  const periodLabels = {
    week: '今週',
    month: '今月',
    year: '今年',
  };

  const periodTabs = [
    { value: 'week', label: '週' },
    { value: 'month', label: '月' },
    { value: 'year', label: '年' },
  ];

  return (
    <div className={`bg-[#151b2e] border border-white/10 rounded-2xl p-4 ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-100">読書トレンド</h3>
        </div>

        <div className="flex items-center gap-1 bg-[#0a0f1c] rounded-lg p-1">
          {periodTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setPeriod(tab.value as Period)}
              className={`
                px-3 py-1 rounded-md text-xs font-medium transition-all
                ${period === tab.value
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-slate-500 hover:text-slate-400'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatItem
          icon={<Calendar className="w-3.5 h-3.5" />}
          label="期間"
          value={periodLabels[period]}
          color="text-blue-400"
        />
        <StatItem
          icon={<Book className="w-3.5 h-3.5" />}
          label="読書日"
          value={chartData.filter(d => d.checkedIn > 0).length + '日'}
          color="text-emerald-400"
        />
        <StatItem
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          label="今月"
          value={booksReadThisMonth + '冊'}
          color="text-amber-400"
        />
      </div>

      {/* チャート */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          {period === 'year' ? (
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#151b2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                itemStyle={{ color: '#fbbf24', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="checkedIn"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={{ fill: '#fbbf24', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                interval={period === 'week' ? 0 : period === 'month' ? 5 : 0}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                domain={[0, 1]}
                ticks={[0, 1]}
                tickFormatter={(value) => (value === 1 ? '✔' : '')}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#151b2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                formatter={(value) => [typeof value === 'number' && value > 0 ? '読書済み' : '未読書', '']}
              />
              <Bar
                dataKey="checkedIn"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1e40af" />
                </linearGradient>
              </defs>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-2 bg-[#0a0f1c] rounded-lg p-2">
    <span className={color}>{icon}</span>
    <div className="flex-1 min-w-0">
      <div className="text-[9px] text-slate-500">{label}</div>
      <div className={`text-xs font-medium text-white truncate`}>{value}</div>
    </div>
  </div>
);
