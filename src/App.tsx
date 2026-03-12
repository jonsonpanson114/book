import { useState, useEffect } from 'react';
import { Layout } from './components/ui/Layout';
import { Bookshelf } from './components/bookshelf/Bookshelf';
import { NoteEditor } from './components/arena/NoteEditor';
import { JinnaiChat } from './components/jinnai/JinnaiChat';
import { AddBookModal } from './components/bookshelf/AddBookModal';
import { useBooks } from './hooks/useBooks';
import { useGamification } from './hooks/useGamification';
import { DailyCheckInButton } from './components/habit/DailyCheckInButton';
import { CheckInConfirmation } from './components/habit/CheckInConfirmation';
import { StreakCalendar } from './components/habit/StreakCalendar';
import { GoalTracker } from './components/habit/GoalTracker';
import { AchievementModal } from './components/gamification/AchievementModal';
import { AchievementGallery } from './components/gamification/AchievementGallery';
import { StatsOverview } from './components/progress/StatsOverview';
import { TrendChart } from './components/progress/TrendChart';
import { NotificationSettings } from './components/notifications/NotificationSettings';
import { NotificationPermission } from './components/notifications/NotificationPermission';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { sendAchievementNotification, sendLevelUpNotification } from './services/notifications';
import type { Achievement } from './types';

type View = 'library' | 'habit' | 'stats';

function App() {
  const { books, addBook, updateNote, updateStatus, updateOneThing, updateTags, analyzeCrossBookInsights } = useBooks();
  const {
    habits,
    gamification,
    goals,
    checkIn,
    onBookFinished,
    onInsightAdded,
    updateMonthlyProgress,
    newlyUnlocked,
    leveledUp,
    closeAchievementModal,
    hasCheckedInToday,
  } = useGamification();

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [view, setView] = useState<View>('library');
  const [showCheckInConfirm, setShowCheckInConfirm] = useState(false);
  const [showAchievementGallery, setShowAchievementGallery] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [lastCheckInResult, setLastCheckInResult] = useState<{ streak: number; xpGained: number } | null>(null);

  const selectedBook = books.find(b => b.id === selectedBookId) || null;

  // 統計情報の更新
  useEffect(() => {
    updateMonthlyProgress(books);
  }, [books, updateMonthlyProgress]);

  // ナビゲーションイベントリスナー
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      setView(detail as View);
    };
    window.addEventListener('nav-change', handler);
    return () => window.removeEventListener('nav-change', handler);
  }, []);

  // 本のステータス変更時の実績チェック
  useEffect(() => {
    if (selectedBook && selectedBook.status === 'finished') {
      onBookFinished(selectedBook, books);
    }
  }, [selectedBook?.status, onBookFinished, selectedBook, books]);

  // インサイト追加時の実績チェック
  useEffect(() => {
    onInsightAdded(books);
  }, [books, onInsightAdded]);

  // 通知送信
  useEffect(() => {
    if (newlyUnlocked) {
      sendAchievementNotification(newlyUnlocked.name);
    }
  }, [newlyUnlocked]);

  useEffect(() => {
    if (leveledUp) {
      sendLevelUpNotification(leveledUp.to);
    }
  }, [leveledUp]);

  const stats = {
    totalBooks: books.length,
    readingCount: books.filter(b => b.status === 'reading').length,
    finishedCount: books.filter(b => b.status === 'finished').length,
  };

  const handleCheckIn = () => {
    const result = checkIn();
    setLastCheckInResult(result);
    setShowCheckInConfirm(true);
  };

  const handleAchievementClick = (achievement: Achievement | null) => {
    if (achievement) {
      // 実績詳細表示（将来的な拡張）
    } else {
      setShowAchievementGallery(true);
    }
  };

  const isTodayCheckedIn = hasCheckedInToday();

  return (
    <Layout
      sidebarContent={
        selectedBook ? (
          <JinnaiChat
            bookId={selectedBook?.id}
            bookTitle={selectedBook?.title}
            notes={selectedBook?.notes || ''}
            insights={selectedBook?.insights?.map(i => i.text) || []}
            onRequestCrossAnalysis={analyzeCrossBookInsights}
            stats={stats}
          />
        ) : null
      }
      onProfileClick={() => setView('stats')}
      onHabitClick={() => setView('habit')}
      currentLevel={gamification.level.currentLevel}
      currentXP={gamification.level.currentXP}
      xpToNext={gamification.level.xpToNextLevel}
    >
      {/* 本棚ビュー */}
      {view === 'library' && (
        <>
          {!selectedBook ? (
            <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
              <Bookshelf
                books={books}
                onSelectBook={(book) => setSelectedBookId(book.id)}
                onAddBook={() => setShowAddBook(true)}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full relative">
              <div className="absolute top-4 right-8 z-50">
                <button
                  onClick={() => setSelectedBookId(null)}
                  className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-xs font-medium">本棚に戻る</span>
                </button>
              </div>

              <NoteEditor
                book={selectedBook}
                onUpdateNote={updateNote}
                onUpdateStatus={updateStatus}
                onUpdateOneThing={updateOneThing}
                onUpdateTags={updateTags}
              />
            </div>
          )}
        </>
      )}

      {/* 習慣ビュー */}
      {view === 'habit' && (
        <div className="w-full h-full overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* チェックインボタン */}
            <DailyCheckInButton
              streak={habits.currentStreak}
              hasCheckedIn={isTodayCheckedIn}
              onClick={handleCheckIn}
              className="w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* カレンダー */}
              <StreakCalendar habits={habits} />

              {/* 目標 */}
              <div className="space-y-4">
                <GoalTracker goals={goals} />
                <TrendChart
                  habits={habits}
                  booksReadThisMonth={goals.monthlyProgress}
                />
              </div>
            </div>

            {/* オーバービュー */}
            <StatsOverview
              habits={habits}
              gamification={gamification}
              goals={goals}
              onAchievementClick={handleAchievementClick}
            />
          </div>
        </div>
      )}

      {/* 統計ビュー */}
      {view === 'stats' && (
        <div className="w-full h-full overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">読書統計</h2>
              <button
                onClick={() => setShowNotificationSettings(true)}
                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>

            <StatsOverview
              habits={habits}
              gamification={gamification}
              goals={goals}
              onAchievementClick={handleAchievementClick}
            />

            <TrendChart
              habits={habits}
              booksReadThisMonth={goals.monthlyProgress}
            />
          </div>
        </div>
      )}

      {showAddBook && (
        <AddBookModal
          onAdd={addBook}
          onClose={() => setShowAddBook(false)}
        />
      )}

      {/* モーダル */}
      {showCheckInConfirm && lastCheckInResult && (
        <CheckInConfirmation
          isOpen={showCheckInConfirm}
          onClose={() => setShowCheckInConfirm(false)}
          streak={lastCheckInResult.streak}
          booksReadToday={0}
          xpGained={lastCheckInResult.xpGained}
          achievements={newlyUnlocked ? [newlyUnlocked] : []}
        />
      )}

      {newlyUnlocked && !showCheckInConfirm && (
        <AchievementModal
          achievement={newlyUnlocked}
          onClose={closeAchievementModal}
        />
      )}

      {leveledUp && !showCheckInConfirm && (
        <div className="fixed top-0 left-0 right-0 z-[200] pointer-events-none flex justify-center">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 rounded-b-2xl shadow-2xl flex items-center gap-4 text-white">
            <span className="text-2xl">⚡</span>
            <div>
              <div className="text-sm font-bold">LEVEL UP!</div>
              <div>Lv.{leveledUp.from} → Lv.{leveledUp.to}</div>
            </div>
          </div>
        </div>
      )}

      <AchievementGallery
        isOpen={showAchievementGallery}
        onClose={() => setShowAchievementGallery(false)}
        achievements={gamification.achievements}
        onAchievementClick={handleAchievementClick}
      />

      <NotificationSettings
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />

      <NotificationPermission
        onRequest={() => {/* 通知有効化処理 */}}
        onDismiss={() => {/* 無視 */}}
      />
    </Layout>
  );
}

export default App;
