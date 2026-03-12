import { useState, useEffect, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, startOfDay, differenceInDays, getHours, getDay } from 'date-fns';
import type {
  HabitData, DailyCheckIn, ReadingGoals,
  GamificationData, Achievement,
} from '../types';
import type { Book } from '../data/mockData';

// LocalStorage keys
const HABITS_KEY = 'jinnai_habits';
const GAMIFICATION_KEY = 'jinnai_gamification';
const GOALS_KEY = 'jinnai_habits_goals';

// XP計算: レベルNに必要なXP = 100 × N²
const calculateXPForLevel = (level: number): number => {
  return 100 * level * level;
};

// 現在のレベルを計算
const getCurrentLevel = (totalXP: number): number => {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

// 実績定義
const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlockedAt' | 'progress'>[] = [
  // 本関連
  {
    id: 'first_book',
    name: '最初の一冊',
    description: '最初の本を読み切った',
    icon: 'BookOpen',
    rarity: 'common',
    xpReward: 50,
  },
  {
    id: 'books_5',
    name: '5冊の読者',
    description: '5冊の本を読み切った',
    icon: 'Library',
    rarity: 'common',
    xpReward: 100,
  },
  {
    id: 'books_10',
    name: '二桁の読者',
    description: '10冊の本を読み切った',
    icon: 'Library',
    rarity: 'rare',
    xpReward: 200,
  },
  {
    id: 'books_25',
    name: '四半世紀の読者',
    description: '25冊の本を読み切った',
    icon: 'Library',
    rarity: 'epic',
    xpReward: 500,
  },
  {
    id: 'books_50',
    name: '半世紀の読者',
    description: '50冊の本を読み切った',
    icon: 'Library',
    rarity: 'epic',
    xpReward: 1000,
  },
  {
    id: 'books_100',
    name: '百冊の達人',
    description: '100冊の本を読み切った',
    icon: 'Library',
    rarity: 'legendary',
    xpReward: 2500,
  },
  // ストリーク関連
  {
    id: 'streak_3',
    name: '3日連続',
    description: '3日連続で読書した',
    icon: 'Flame',
    rarity: 'common',
    xpReward: 30,
  },
  {
    id: 'streak_7',
    name: '1週間連続',
    description: '7日連続で読書した',
    icon: 'Flame',
    rarity: 'rare',
    xpReward: 100,
  },
  {
    id: 'streak_14',
    name: '2週間連続',
    description: '14日連続で読書した',
    icon: 'Flame',
    rarity: 'rare',
    xpReward: 200,
  },
  {
    id: 'streak_30',
    name: '1ヶ月連続',
    description: '30日連続で読書した',
    icon: 'Flame',
    rarity: 'epic',
    xpReward: 500,
  },
  {
    id: 'streak_100',
    name: '百日連続',
    description: '100日連続で読書した',
    icon: 'Flame',
    rarity: 'legendary',
    xpReward: 2000,
  },
  {
    id: 'streak_keeper',
    name: 'ストリークキーパー',
    description: 'ギリギリでストリークを守り抜いた',
    icon: 'Shield',
    rarity: 'rare',
    xpReward: 150,
  },
  // インサイト・メモ関連
  {
    id: 'insight_collector',
    name: '洞察収集家',
    description: '10個のインサイトを記録した',
    icon: 'Lightbulb',
    rarity: 'common',
    xpReward: 50,
  },
  {
    id: 'note_taker',
    name: '偉大な記録者',
    description: '1冊で500文字以上のメモを書いた',
    icon: 'FileText',
    rarity: 'common',
    xpReward: 50,
  },
  {
    id: 'note_master',
    name: '記述の達人',
    description: '1冊で5000文字以上のメモを書いた',
    icon: 'FileText',
    rarity: 'epic',
    xpReward: 200,
  },
  // 時間関連
  {
    id: 'night_owl',
    name: '夜更かし読書家',
    description: '22時以降にチェックインした',
    icon: 'Moon',
    rarity: 'common',
    xpReward: 20,
  },
  {
    id: 'early_bird',
    name: '早起き読書家',
    description: '7時以前にチェックインした',
    icon: 'Sun',
    rarity: 'common',
    xpReward: 20,
  },
  {
    id: 'midnight_reader',
    name: '深夜の読書家',
    description: '深夜0時にチェックインした',
    icon: 'Clock',
    rarity: 'rare',
    xpReward: 50,
  },
  // カテゴリ関連
  {
    id: 'category_master',
    name: 'カテゴリマスター',
    description: '同じカテゴリで3冊読了した',
    icon: 'Bookmark',
    rarity: 'rare',
    xpReward: 150,
  },
  {
    id: 'diverse_reader',
    name: '多様な読者',
    description: '全カテゴリの本を読んだ',
    icon: 'Globe',
    rarity: 'epic',
    xpReward: 300,
  },
  // マラソン関連
  {
    id: 'marathon',
    name: '月間マラソン',
    description: '1ヶ月で5冊読了した',
    icon: 'TrendingUp',
    rarity: 'epic',
    xpReward: 300,
  },
  {
    id: 'ultra_marathon',
    name: '月間ウルトラマラソン',
    description: '1ヶ月で10冊読了した',
    icon: 'Zap',
    rarity: 'legendary',
    xpReward: 800,
  },
  // パーフェクト関連
  {
    id: 'perfect_month',
    name: '完璧な1ヶ月',
    description: '1ヶ月毎日チェックインした',
    icon: 'CalendarCheck',
    rarity: 'legendary',
    xpReward: 1000,
  },
  {
    id: 'weekend_warrior',
    name: '週末戦士',
    description: '週末連続3週読書した',
    icon: 'CalendarDays',
    rarity: 'common',
    xpReward: 100,
  },
  {
    id: 'consistency_king',
    name: '一貫性の王',
    description: '同じ曜日に5回チェックインした',
    icon: 'Crown',
    rarity: 'rare',
    xpReward: 150,
  },
];

// 初期データ取得
const getInitialHabits = (): HabitData => {
  try {
    const saved = localStorage.getItem(HABITS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse localStorage habits:', e);
  }
  return {
    checkIns: [],
    currentStreak: 0,
    longestStreak: 0,
    totalReadingDays: 0,
    lastCheckInDate: null,
  };
};

const getInitialGamification = (): GamificationData => {
  try {
    const saved = localStorage.getItem(GAMIFICATION_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse localStorage gamification:', e);
  }
  return {
    achievements: ACHIEVEMENT_DEFINITIONS.map(def => ({
      ...def,
      unlockedAt: null,
    })),
    level: {
      currentLevel: 1,
      currentXP: 0,
      xpToNextLevel: 100,
      totalXP: 0,
    },
    unlockedBadges: [],
    recentAchievements: [],
  };
};

const getInitialGoals = (): ReadingGoals => {
  try {
    const saved = localStorage.getItem(GOALS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse localStorage goals:', e);
  }
  return {
    monthlyGoal: 3,
    yearlyGoal: 30,
    monthlyProgress: 0,
    yearlyProgress: 0,
  };
};

export const useGamification = () => {
  const [habits, setHabits] = useState<HabitData>(getInitialHabits);
  const [gamification, setGamification] = useState<GamificationData>(getInitialGamification);
  const [goals, setGoals] = useState<ReadingGoals>(getInitialGoals);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);
  const [leveledUp, setLeveledUp] = useState<{ from: number; to: number } | null>(null);

  // 保存
  useEffect(() => {
    try {
      localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
      localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(gamification));
      localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    } catch (e) {
      console.error('Failed to save gamification data:', e);
    }
  }, [habits, gamification, goals]);

  // チェックイン
  const checkIn = useCallback((bookIds: string[] = []) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const timestamp = new Date().toISOString();

    // 今日既にチェックインしている場合は追加のみ
    const existingCheckIn = habits.checkIns.find(ci => ci.date === today);

    let newCheckIns: DailyCheckIn[];
    let currentStreak = habits.currentStreak;
    let longestStreak = habits.longestStreak;
    let newlyUnlockedAchievements: Achievement[] = [];

    if (existingCheckIn) {
      // 既にチェックイン済み - 更新
      newCheckIns = habits.checkIns.map(ci =>
        ci.date === today
          ? { ...ci, booksReadToday: bookIds.length, bookIds, timestamp }
          : ci
      );
      currentStreak = habits.currentStreak;
    } else {
      // 新規チェックイン
      const newCheckIn: DailyCheckIn = {
        date: today,
        booksReadToday: bookIds.length,
        bookIds,
        timestamp,
      };

      newCheckIns = [...habits.checkIns, newCheckIn];

      // ストリーク計算
      if (habits.lastCheckInDate) {
        const lastDate = new Date(habits.lastCheckInDate);
        const daysDiff = differenceInDays(new Date(), lastDate);

        if (daysDiff === 1) {
          // 連続日数増加
          currentStreak = habits.currentStreak + 1;
        } else if (daysDiff > 1) {
          // ストリーク途切れ
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      // 最長ストリーク更新
      if (currentStreak > habits.longestStreak) {
        longestStreak = currentStreak;
      }
    }

    const updatedHabits: HabitData = {
      ...habits,
      checkIns: newCheckIns,
      currentStreak,
      longestStreak,
      totalReadingDays: new Set(newCheckIns.map(ci => ci.date)).size,
      lastCheckInDate: today,
    };

    setHabits(updatedHabits);

    // 実績チェック
    newlyUnlockedAchievements = checkAchievements(
      updatedHabits,
      gamification,
      bookIds,
      timestamp,
      gamification.achievements
    );

    // XP計算
    const baseXP = existingCheckIn ? 10 : 20; // 初回チェックインで20XP、2回目以降は10XP
    const streakBonus = Math.floor(currentStreak / 5) * 5; // 5日ごとにボーナス
    const xpGained = baseXP + streakBonus;

    const newTotalXP = gamification.level.totalXP + xpGained;
    const newLevel = getCurrentLevel(newTotalXP);
    const previousLevel = gamification.level.currentLevel;

    if (newLevel > previousLevel) {
      setLeveledUp({ from: previousLevel, to: newLevel });
    }

    setGamification(prev => ({
      ...prev,
      achievements: newlyUnlockedAchievements.length > 0 ? newlyUnlockedAchievements : prev.achievements,
      level: {
        currentLevel: newLevel,
        currentXP: newTotalXP - calculateXPForLevel(newLevel - 1),
        xpToNextLevel: calculateXPForLevel(newLevel) - calculateXPForLevel(newLevel - 1),
        totalXP: newTotalXP,
      },
      unlockedBadges: newlyUnlockedAchievements.length > 0
        ? [...prev.unlockedBadges, ...newlyUnlockedAchievements.filter(a => !prev.unlockedBadges.includes(a.id)).map(a => a.id)]
        : prev.unlockedBadges,
      recentAchievements: newlyUnlockedAchievements.length > 0
        ? [
            ...newlyUnlockedAchievements.filter(a => a.unlockedAt !== null).map(a => a.id),
            ...prev.recentAchievements.slice(0, 4) // 最新5件まで保持
          ]
        : prev.recentAchievements,
    }));

    // 最初の実績を表示
    if (newlyUnlockedAchievements.length > 0) {
      setNewlyUnlocked(newlyUnlockedAchievements[0]);
    }

    return { streak: currentStreak, xpGained };
  }, [habits, gamification]);

  // 本の完了通知（外部から呼ばれる）
  const onBookFinished = useCallback((book: Book, allBooks: Book[] = []) => {
    const achievements = checkBookAchievements(book, habits, gamification.achievements, allBooks);

    if (achievements.length > 0) {
      const xpGained = achievements.reduce((sum, a) => sum + a.xpReward, 0);
      const newTotalXP = gamification.level.totalXP + xpGained;
      const newLevel = getCurrentLevel(newTotalXP);
      const previousLevel = gamification.level.currentLevel;

      if (newLevel > previousLevel) {
        setLeveledUp({ from: previousLevel, to: newLevel });
      }

      setGamification(prev => ({
        ...prev,
        achievements,
        level: {
          currentLevel: newLevel,
          currentXP: newTotalXP - calculateXPForLevel(newLevel - 1),
          xpToNextLevel: calculateXPForLevel(newLevel) - calculateXPForLevel(newLevel - 1),
          totalXP: newTotalXP,
        },
        unlockedBadges: [
          ...prev.unlockedBadges,
          ...achievements.filter(a => a.unlockedAt !== null && !prev.unlockedBadges.includes(a.id)).map(a => a.id)
        ],
        recentAchievements: [
          ...achievements.filter(a => a.unlockedAt !== null).map(a => a.id),
          ...prev.recentAchievements.slice(0, 4)
        ],
      }));

      setNewlyUnlocked(achievements[0]);
    }
  }, [habits, gamification]);

  // 実績チェック
  const checkAchievements = (
    habitData: HabitData,
    _gameData: GamificationData,
    _bookIds: string[],
    timestamp: string,
    existingAchievements: Achievement[]
  ): Achievement[] => {
    const newAchievements: Achievement[] = [];
    const checkInHour = getHours(new Date(timestamp));

    existingAchievements.forEach(achievement => {
      if (achievement.unlockedAt) return; // 既にアンロック済み

      let shouldUnlock = false;

      switch (achievement.id) {
        // ストリーク関連
        case 'streak_3':
          shouldUnlock = habitData.currentStreak >= 3;
          break;
        case 'streak_7':
          shouldUnlock = habitData.currentStreak >= 7;
          break;
        case 'streak_14':
          shouldUnlock = habitData.currentStreak >= 14;
          break;
        case 'streak_30':
          shouldUnlock = habitData.currentStreak >= 30;
          break;
        case 'streak_100':
          shouldUnlock = habitData.currentStreak >= 100;
          break;
        // 時間関連
        case 'night_owl':
          shouldUnlock = checkInHour >= 22 || checkInHour < 5;
          break;
        case 'early_bird':
          shouldUnlock = checkInHour >= 5 && checkInHour < 7;
          break;
        case 'midnight_reader':
          shouldUnlock = checkInHour === 0;
          break;
        default:
          break;
      }

      if (shouldUnlock) {
        newAchievements.push({
          ...achievement,
          unlockedAt: timestamp,
        });
      }
    });

    return existingAchievements.map(a => {
      const unlocked = newAchievements.find(na => na.id === a.id);
      return unlocked || a;
    });
  };

  // 本関連の実績チェック
  const checkBookAchievements = (
    book: Book,
    _habitData: HabitData,
    existingAchievements: Achievement[],
    allBooks?: Book[]
  ): Achievement[] => {
    const newAchievements: Achievement[] = [];
    const finishedBooks = allBooks?.filter(b => b.status === 'finished') || [];

    existingAchievements.forEach(achievement => {
      if (achievement.unlockedAt) return;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_book':
          shouldUnlock = finishedBooks.length >= 1;
          break;
        case 'books_5':
          shouldUnlock = finishedBooks.length >= 5;
          break;
        case 'books_10':
          shouldUnlock = finishedBooks.length >= 10;
          break;
        case 'books_25':
          shouldUnlock = finishedBooks.length >= 25;
          break;
        case 'books_50':
          shouldUnlock = finishedBooks.length >= 50;
          break;
        case 'books_100':
          shouldUnlock = finishedBooks.length >= 100;
          break;
        case 'note_taker':
          shouldUnlock = book.notes.length >= 500;
          break;
        case 'note_master':
          shouldUnlock = book.notes.length >= 5000;
          break;
        case 'category_master':
          if (book.category) {
            const categoryCount = finishedBooks.filter(b => b.category === book.category).length;
            shouldUnlock = categoryCount >= 3;
          }
          break;
        case 'diverse_reader':
          const categories = new Set(finishedBooks.map(b => b.category));
          shouldUnlock = categories.size >= 5;
          break;
        case 'marathon':
        case 'ultra_marathon': {
          const now = new Date();
          const monthStart = startOfMonth(now);
          const monthEnd = endOfMonth(now);
          const monthFinished = finishedBooks.filter(b => {
            const updated = new Date(b.lastUpdated);
            return b.status === 'finished' && updated >= monthStart && updated <= monthEnd;
          }).length;
          shouldUnlock = achievement.id === 'marathon' ? monthFinished >= 5 : monthFinished >= 10;
          break;
        }
        default:
          break;
      }

      if (shouldUnlock) {
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date().toISOString(),
        });
      }
    });

    return existingAchievements.map(a => {
      const unlocked = newAchievements.find(na => na.id === a.id);
      return unlocked || a;
    });
  };

  // インサイト追加時のチェック
  const onInsightAdded = useCallback((allBooks: Book[]) => {
    const totalInsights = allBooks.reduce((sum, book) => sum + (book.insights?.length || 0), 0);

    setGamification(prev => {
      const achievements = prev.achievements.map(a => {
        if (a.id === 'insight_collector' && !a.unlockedAt && totalInsights >= 10) {
          return { ...a, unlockedAt: new Date().toISOString() };
        }
        return a;
      });

      const newlyUnlocked = achievements.find(a =>
        a.id === 'insight_collector' && a.unlockedAt &&
        !prev.achievements.find(pa => pa.id === a.id)?.unlockedAt
      );

      if (newlyUnlocked) {
        setNewlyUnlocked(newlyUnlocked);
      }

      return {
        ...prev,
        achievements,
        unlockedBadges: newlyUnlocked ? [...prev.unlockedBadges, 'insight_collector'] : prev.unlockedBadges,
      };
    });
  }, []);

  // 目標更新
  const updateGoals = useCallback((newGoals: Partial<ReadingGoals>) => {
    setGoals(prev => ({ ...prev, ...newGoals }));
  }, []);

  // 月の進捗を更新（読了した本数）
  const updateMonthlyProgress = useCallback((books: Book[]) => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const monthlyCount = books.filter(b => {
      const updated = new Date(b.lastUpdated);
      return b.status === 'finished' && updated >= monthStart;
    }).length;

    const yearlyCount = books.filter(b => {
      const updated = new Date(b.lastUpdated);
      return b.status === 'finished' && updated >= yearStart;
    }).length;

    setGoals(prev => ({
      ...prev,
      monthlyProgress: monthlyCount,
      yearlyProgress: yearlyCount,
    }));
  }, []);

  // 実績モーダルを閉じる
  const closeAchievementModal = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  // レベルアップを閉じる
  const closeLevelUp = useCallback(() => {
    setLeveledUp(null);
  }, []);

  // 今日チェックイン済みか
  const hasCheckedInToday = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return habits.checkIns.some(ci => ci.date === today);
  }, [habits.checkIns]);

  // 週末連続チェックイン数（週末戦士実績用）
  const getWeekendStreak = useCallback((): number => {
    const today = startOfDay(new Date());
    let streak = 0;
    let currentDate = today;

    while (true) {
      const dayOfWeek = getDay(currentDate); // 0 = Sunday, 6 = Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (isWeekend) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        if (habits.checkIns.some(ci => ci.date === dateStr)) {
          streak++;
        } else {
          break;
        }
      } else {
        // 平日はスキップ
      }

      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    }

    return streak;
  }, [habits.checkIns]);

  return {
    habits,
    gamification,
    goals,
    checkIn,
    onBookFinished,
    onInsightAdded,
    updateGoals,
    updateMonthlyProgress,
    newlyUnlocked,
    leveledUp,
    closeAchievementModal,
    closeLevelUp,
    hasCheckedInToday,
    getWeekendStreak,
  };
};
