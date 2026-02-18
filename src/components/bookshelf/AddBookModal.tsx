import React, { useState } from 'react';
import type { Book } from '../../data/mockData';
import { X, Plus } from 'lucide-react';
import clsx from 'clsx';

const COVER_COLORS = [
    { label: '紺', value: 'bg-blue-900' },
    { label: '緑', value: 'bg-emerald-900' },
    { label: '琥珀', value: 'bg-amber-900' },
    { label: '紫', value: 'bg-purple-900' },
    { label: '赤', value: 'bg-red-900' },
    { label: '灰', value: 'bg-slate-800' },
    { label: '藍', value: 'bg-indigo-900' },
    { label: '桃', value: 'bg-pink-900' },
];

const CATEGORIES: Book['category'][] = ['Business', 'Novel', 'Philosophy', 'Art', 'Science'];

interface AddBookModalProps {
    onAdd: (data: { title: string; author: string; category: Book['category']; coverColor: string }) => void;
    onClose: () => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ onAdd, onClose }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState<Book['category']>('Business');
    const [coverColor, setCoverColor] = useState(COVER_COLORS[0].value);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !author.trim()) return;
        onAdd({ title: title.trim(), author: author.trim(), category, coverColor });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md mx-4 bg-[#151b2e] border border-white/10 rounded-2xl shadow-2xl p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-serif font-bold text-slate-100 mb-6">本を追加</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 block">
                            タイトル
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="本のタイトル"
                            autoFocus
                            className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 block">
                            著者
                        </label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="著者名"
                            className="w-full bg-[#0a0f1c] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 block">
                            カテゴリ
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={clsx(
                                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                        category === cat
                                            ? "bg-blue-600/20 text-blue-400 border-blue-500/50"
                                            : "text-slate-500 border-white/5 hover:border-white/20 hover:text-slate-300"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 block">
                            背表紙の色
                        </label>
                        <div className="flex gap-2">
                            {COVER_COLORS.map(color => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setCoverColor(color.value)}
                                    className={clsx(
                                        "w-8 h-8 rounded-lg transition-all",
                                        color.value,
                                        coverColor === color.value
                                            ? "ring-2 ring-yellow-500 ring-offset-2 ring-offset-[#151b2e] scale-110"
                                            : "opacity-60 hover:opacity-100"
                                    )}
                                    title={color.label}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!title.trim() || !author.trim()}
                        className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-medium text-sm hover:bg-blue-600/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                        本棚に追加
                    </button>
                </form>
            </div>
        </div>
    );
};
