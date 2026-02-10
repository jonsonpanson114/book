import React from 'react';
import { Brain, Library, User } from 'lucide-react';

interface AppShellProps {
    children: React.ReactNode;
    sidebarContent?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children, sidebarContent }) => {
    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-300 flex overflow-hidden font-sans selection:bg-yellow-500/30">
            {/* Sidebar Navigation */}
            <nav className="w-16 flex flex-col items-center py-8 bg-[#050810] border-r border-white/5 z-20">
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
                    <button className="p-3 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white group relative">
                        <User className="w-5 h-5" />
                        <span className="absolute left-14 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                            プロフィール
                        </span>
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
                {/* Top Header - Glassmorphism */}
                <header className="h-16 flex items-center px-8 border-b border-white/5 bg-[#0a0f1c]/80 backdrop-blur-md z-10">
                    <h1 className="text-lg font-medium tracking-wide text-slate-200">
                        Jinnai<span className="text-slate-600 mx-2">/</span>思考のアリーナ
                    </h1>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {children}
                </div>
            </main>

            {/* AI Sidebar (The Jinnai) */}
            {sidebarContent && (
                <aside className="w-[320px] bg-[#0d1221] border-l border-white/5 flex flex-col z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                    {sidebarContent}
                </aside>
            )}
        </div>
    );
};
