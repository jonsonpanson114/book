import React from 'react';
import { Brain, Library, User, Calendar, Zap, Trophy } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    sidebarContent?: React.ReactNode;
    onProfileClick?: () => void;
    onHabitClick?: () => void;
    currentLevel?: number;
    currentXP?: number;
    xpToNext?: number;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    sidebarContent,
    onProfileClick,
    onHabitClick,
    currentLevel = 1,
    currentXP = 0,
    xpToNext = 100,
}) => {
    const [isMobileChatOpen, setIsMobileChatOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'library' | 'habit' | 'stats'>('library');

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-300 flex overflow-hidden font-sans selection:bg-yellow-500/30">
            {/* Desktop Sidebar Navigation (Hidden on Mobile) */}
            <nav className="hidden md:flex w-16 flex-col items-center py-8 bg-[#050810] border-r border-white/5 z-20">
                <div className="mb-8 p-2 bg-blue-600/20 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 flex flex-col gap-6 w-full items-center">
                    <button
                        onClick={() => {
                            setActiveTab('library');
                            window.dispatchEvent(new CustomEvent('nav-change', { detail: 'library' }));
                        }}
                        className={`p-3 rounded-xl transition-all group relative ${
                            activeTab === 'library' ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'
                        }`}
                    >
                        <Library className="w-5 h-5" />
                        <span className="absolute left-14 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                            本棚
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('habit');
                            onHabitClick?.();
                            window.dispatchEvent(new CustomEvent('nav-change', { detail: 'habit' }));
                        }}
                        className={`p-3 rounded-xl transition-all group relative ${
                            activeTab === 'habit' ? 'bg-orange-500/20 text-orange-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'
                        }`}
                    >
                        <Calendar className="w-5 h-5" />
                        <span className="absolute left-14 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                            習慣
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('stats');
                            onProfileClick?.();
                            window.dispatchEvent(new CustomEvent('nav-change', { detail: 'stats' }));
                        }}
                        className={`p-3 rounded-xl transition-all group relative ${
                            activeTab === 'stats' ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'
                        }`}
                    >
                        <User className="w-5 h-5" />
                        <span className="absolute left-14 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                            読書統計
                        </span>
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 relative flex flex-col h-screen overflow-hidden pb-16 md:pb-0"> {/* Added padding-bottom for mobile nav */}
                {/* Top Header - Glassmorphism */}
                <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#0a0f1c]/80 backdrop-blur-md z-10 shrink-0">
                    <h1 className="text-base md:text-lg font-medium tracking-wide text-slate-200 flex items-center">
                        <Brain className="w-5 h-5 mr-3 text-blue-400 md:hidden" />
                        Jinnai<span className="text-slate-600 mx-2">/</span>思考のアリーナ
                    </h1>

                    {/* レベルバッジ */}
                    <div className="hidden md:flex items-center gap-2 bg-[#0a0f1c] px-3 py-1.5 rounded-full border border-white/5">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-bold text-white">Lv.{currentLevel}</span>
                        <span className="text-xs text-slate-500">{currentXP}/{xpToNext} XP</span>
                    </div>
                </header>



                <div className="flex-1 flex overflow-hidden relative">
                    {children}

                    {/* Mobile Chat Overlay (Absolute position over content) */}
                    {isMobileChatOpen && sidebarContent && (
                        <div className="absolute inset-0 z-40 bg-[#0a0f1c] md:hidden animate-in fade-in slide-in-from-bottom duration-200">
                            <div className="h-full flex flex-col relative">
                                {sidebarContent}
                                <button
                                    onClick={() => setIsMobileChatOpen(false)}
                                    className="absolute top-2 right-2 p-2 bg-black/40 rounded-full text-white/50 hover:text-white z-50"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Desktop AI Sidebar (Hidden on Mobile) */}
            {sidebarContent && (
                <aside className="hidden lg:flex w-[320px] bg-[#0d1221] border-l border-white/5 flex-col z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                    {sidebarContent}
                </aside>
            )}

            {/* Mobile FAB for Jinnai Chat */}
            <button
                onClick={() => setIsMobileChatOpen(!isMobileChatOpen)}
                className="md:hidden fixed bottom-20 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all active:scale-95 border border-white/10"
                aria-label="Toggle Jinnai Chat"
            >
                <Brain className="w-6 h-6" />
                {/* Notification Badge (Optional logic could go here) */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
            </button>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050810] border-t border-white/10 flex items-center justify-around z-50">
                <button
                    onClick={() => {
                        setActiveTab('library');
                        window.dispatchEvent(new CustomEvent('nav-change', { detail: 'library' }));
                    }}
                    className={`flex flex-col items-center gap-1 p-2 ${
                        activeTab === 'library' ? 'text-blue-400' : 'text-slate-500'
                    }`}
                >
                    <Library className="w-5 h-5" />
                    <span className="text-[10px] font-medium">本棚</span>
                </button>

                <button
                    onClick={() => {
                        setActiveTab('habit');
                        onHabitClick?.();
                        window.dispatchEvent(new CustomEvent('nav-change', { detail: 'habit' }));
                    }}
                    className={`flex flex-col items-center gap-1 p-2 ${
                        activeTab === 'habit' ? 'text-orange-400' : 'text-slate-500'
                    }`}
                >
                    <Calendar className="w-5 h-5" />
                    <span className="text-[10px] font-medium">習慣</span>
                </button>

                <button
                    onClick={() => {
                        setActiveTab('stats');
                        onProfileClick?.();
                        window.dispatchEvent(new CustomEvent('nav-change', { detail: 'stats' }));
                    }}
                    className={`flex flex-col items-center gap-1 p-2 ${
                        activeTab === 'stats' ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                >
                    <Trophy className="w-5 h-5" />
                    <span className="text-[10px] font-medium">実績</span>
                </button>
            </div>
        </div>
    );
};
