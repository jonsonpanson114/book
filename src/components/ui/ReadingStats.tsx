import React from 'react';
import type { Book } from '../../data/mockData';
import { BookOpen, CheckCircle, Clock, FileText, Lightbulb, X } from 'lucide-react';

interface ReadingStatsProps {
    books: Book[];
    onClose: () => void;
}

export const ReadingStats: React.FC<ReadingStatsProps> = ({ books, onClose }) => {
    const reading = books.filter(b => b.status === 'reading');
    const finished = books.filter(b => b.status === 'finished');
    const tsundoku = books.filter(b => b.status === 'tsundoku');

    const totalNotes = books.reduce((acc, b) => acc + b.notes.length, 0);
    const totalInsights = books.reduce((acc, b) => acc + (b.insights?.length || 0), 0);
    const booksWithOneThing = books.filter(b => b.oneThing.trim().length > 0);

    const categories = books.reduce((acc, b) => {
        acc[b.category] = (acc[b.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm mx-4 bg-[#151b2e] border border-white/10 rounded-2xl shadow-2xl p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-serif font-bold text-slate-100 mb-1">読書統計</h2>
                <p className="text-slate-500 text-xs mb-6">平野の思考ログ</p>

                {/* Main stats grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <StatCard icon={<BookOpen className="w-4 h-4 text-blue-400" />} value={reading.length} label="読書中" />
                    <StatCard icon={<CheckCircle className="w-4 h-4 text-green-400" />} value={finished.length} label="読了" />
                    <StatCard icon={<Clock className="w-4 h-4 text-amber-400" />} value={tsundoku.length} label="積読" />
                </div>

                {/* Detail stats */}
                <div className="space-y-3">
                    <DetailRow
                        icon={<FileText className="w-3.5 h-3.5 text-slate-400" />}
                        label="メモ総文字数"
                        value={totalNotes.toLocaleString() + '文字'}
                    />
                    <DetailRow
                        icon={<Lightbulb className="w-3.5 h-3.5 text-yellow-400" />}
                        label="気づきの数"
                        value={totalInsights + '個'}
                    />
                    <DetailRow
                        icon={<BookOpen className="w-3.5 h-3.5 text-slate-400" />}
                        label="一行結論を書いた本"
                        value={booksWithOneThing.length + '/' + books.length + '冊'}
                    />
                    {topCategory && (
                        <DetailRow
                            icon={<span className="text-xs">📊</span>}
                            label="最多カテゴリ"
                            value={topCategory[0] + ' (' + topCategory[1] + '冊)'}
                        />
                    )}
                </div>

                {/* Progress bar */}
                <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-2">
                        <span>読了率</span>
                        <span>{books.length > 0 ? Math.round((finished.length / books.length) * 100) : 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#0a0f1c] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${books.length > 0 ? (finished.length / books.length) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode; value: number; label: string }> = ({ icon, value, label }) => (
    <div className="bg-[#0a0f1c] rounded-xl p-3 text-center border border-white/5">
        <div className="flex justify-center mb-1">{icon}</div>
        <div className="text-2xl font-bold text-slate-100">{value}</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
);

const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2 text-xs text-slate-400">
            {icon}
            {label}
        </div>
        <span className="text-xs text-slate-200 font-medium">{value}</span>
    </div>
);
