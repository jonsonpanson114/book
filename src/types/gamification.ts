// ゲーミフィケーション用タイプ定義

export type AchievementType =
  | 'first_book'           // 最初の本を読み切った
  | 'streak_3'             // 3日連続
  | 'streak_7'             // 7日連続
  | 'streak_14'            // 14日連続
  | 'streak_30'            // 30日連続
  | 'streak_100'           // 100日連続
  | 'books_5'              // 5冊読了
  | 'books_10'             // 10冊読了
  | 'books_25'             // 25冊読了
  | 'books_50'             // 50冊読了
  | 'books_100'            // 100冊読了
  | 'insight_collector'    // 10個のインサイト収集
  | 'night_owl'           // 22時以降にチェックイン
  | 'early_bird'          // 7時以前にチェックイン
  | 'category_master'     // 同じカテゴリ3冊読了
  | 'note_taker'          // 500文字以上のメモ
  | 'note_master'         // 5000文字以上のメモ
  | 'streak_keeper'       // ストリーク維持成功
  | 'marathon'            // 1ヶ月5冊
  | 'ultra_marathon'      // 1ヶ月10冊
  | 'diverse_reader'      // 全カテゴリ読了
  | 'perfect_month'       // 1ヶ月毎日チェックイン
  | 'weekend_warrior'     // 週末連続3週
  | 'consistency_king'    // 同じ曜日5回
  | 'midnight_reader';    // 深夜0時チェックイン

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: AchievementType;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  rarity: Rarity;
  xpReward: number;
  unlockedAt: string | null; // ISO timestamp or null
  progress?: {
    current: number;
    target: number;
  };
}

export interface UserLevel {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
}

export interface GamificationData {
  achievements: Achievement[];
  level: UserLevel;
  unlockedBadges: AchievementType[];
  recentAchievements: AchievementType[]; // 最近獲得した実績（履歴）
}

// レアリティ別のスタイル設定
export const RARITY_COLORS: Record<Rarity, { border: string; bg: string; glow: string }> = {
  common: { border: '#6b7280', bg: '#374151', glow: '' },
  rare: { border: '#60a5fa', bg: '#1e40af', glow: 'rgba(59, 130, 246, 0.5)' },
  epic: { border: '#a855f7', bg: '#6b21a8', glow: 'rgba(168, 85, 247, 0.6)' },
  legendary: { border: '#fbbf24', bg: '#92400e', glow: 'rgba(251, 191, 36, 0.7)' },
};

// レアリティ別の日本語名
export const RARITY_NAMES: Record<Rarity, string> = {
  common: 'コモン',
  rare: 'レア',
  epic: 'エピック',
  legendary: 'レジェンダリー',
};
