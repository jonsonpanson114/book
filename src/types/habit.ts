// 習慣追跡用タイプ定義

export type CheckInDate = string; // "YYYY-MM-DD" format

export interface DailyCheckIn {
  date: CheckInDate;
  booksReadToday: number; // 読んだ冊数
  bookIds: string[]; // 読んだ本のID
  timestamp: string; // ISO timestamp of check-in
}

export interface HabitData {
  checkIns: DailyCheckIn[];
  currentStreak: number; // 連続日数
  longestStreak: number;
  totalReadingDays: number;
  lastCheckInDate: CheckInDate | null;
}

export interface ReadingGoals {
  monthlyGoal: number; // 月間目標（冊）
  yearlyGoal: number; // 年間目標（冊）
  monthlyProgress: number; // 今月読んだ冊数
  yearlyProgress: number; // 今年読んだ冊数
}
