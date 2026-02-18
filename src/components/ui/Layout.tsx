import React from 'react';
import { Brain, Library, User } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    sidebarContent?: React.ReactNode;
    onProfileClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebarContent, onProfileClick }) => {
    const [isMobileChatOpen, setIsMobileChatOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-300 flex overflow-hidden font-sans selection:bg-yellow-500/30">
            {/* Desktop Sidebar Navigation (Hidden on Mobile) */}
            <nav className="hidden md:flex w-16 flex-col items-center py-8 bg-[#050810] border-r border-white/5 z-20">
                <div className="mb-8 p-2 bg-blue-600/20 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 flex flex-col gap-6 w-full items-center">
                    <button className="p-3 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white group relative">
                        <Library className="w-5 h-5" />
                        <span className="absolute left-14 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                            本棚
                        </span>
                    </button>
                    <button onClick={onProfileClick} className="p-3 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white group relative">
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
                        <Brain className="w-5 h-5 mr-3 text-blue-400 md:hidden" /> {/* Mobile Logo */}
                        Jinnai<span className="text-slate-600 mx-2">/</span>思考のアリーナ
                    </h1>
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
                <button className="flex flex-col items-center gap-1 p-2 text-blue-400">
                    <Library className="w-5 h-5" />
                    <span className="text-[10px] font-medium">本棚</span>
                </button>

                {/* Center Action Button (Optional, e.g., Add Book) */}
                <div className="w-12 h-12 -mt-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/50 border-4 border-[#0a0f1c]">
                    <div className="w-6 h-6 text-white font-bold text-xl flex items-center justify-center pb-1">+</div>
                </div>

                <button onClick={onProfileClick} className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-slate-300">
                    <User className="w-5 h-5" />
                    <span className="text-[10px] font-medium">統計</span>
                </button>
            </div>
        </div>
    );
};
