import React from 'react';
import type { Book } from '../../data/mockData';
import { Save, Tag, BookOpen, CheckCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

interface NoteEditorProps {
    book: Book;
    onUpdateNote: (bookId: string, content: string) => void;
    onUpdateStatus: (bookId: string, status: Book['status']) => void;
    onUpdateOneThing: (bookId: string, oneThing: string) => void;
    onUpdateTags: (bookId: string, tags: string[]) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ book, onUpdateNote, onUpdateStatus, onUpdateOneThing, onUpdateTags }) => {
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const input = e.currentTarget;
            const newTag = input.value.trim();
            if (newTag && !book.tags?.includes(newTag)) {
                onUpdateTags(book.id, [...(book.tags || []), newTag]);
                input.value = '';
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        onUpdateTags(book.id, (book.tags || []).filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="h-full flex flex-col bg-[#0a0f1c] relative animate-in fade-in duration-500">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-100">{book.title}</h2>
                    <p className="text-slate-400 text-sm">{book.author}</p>
                </div>

                <div className="flex items-center gap-2 bg-[#151b2e] p-1 rounded-lg border border-white/5">
                    {(['reading', 'finished', 'tsundoku'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => onUpdateStatus(book.id, status)}
                            className={clsx(
                                "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2",
                                book.status === status
                                    ? "bg-blue-600/20 text-blue-400 shadow-sm ring-1 ring-blue-500/50"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                            )}
                        >
                            {status === 'reading' && <BookOpen className="w-3 h-3" />}
                            {status === 'finished' && <CheckCircle className="w-3 h-3" />}
                            {status === 'tsundoku' && <Clock className="w-3 h-3" />}
                            <span className="capitalize">
                                {status === 'reading' && '進行中'}
                                {status === 'finished' && '読了'}
                                {status === 'tsundoku' && '積読'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags Section */}
            <div className="px-6 pb-2 pt-2 flex flex-wrap items-center gap-2 border-b border-white/5">
                <Tag className="w-3 h-3 text-slate-500" />
                {(book.tags || []).map(tag => (
                    <span key={tag} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full flex items-center gap-1 group">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="group-hover:text-red-400 hover:scale-110 transition-transform">×</button>
                    </span>
                ))}
                <input
                    type="text"
                    className="bg-transparent border-none text-xs text-slate-400 placeholder-slate-700/50 focus:ring-0 p-0"
                    placeholder="+ タグを追加 (Enter)"
                    onKeyDown={handleAddTag}
                />
            </div>

            {/* The One Thing Input */}
            <div className="px-6 py-4 bg-yellow-500/5 border-b border-yellow-500/10">
                <label className="text-[10px] uppercase tracking-widest text-yellow-600/80 font-bold mb-1 block">
                    The One Thing (一行結論)
                </label>
                <input
                    type="text"
                    value={book.oneThing}
                    onChange={(e) => onUpdateOneThing(book.id, e.target.value)}
                    className="w-full bg-transparent border-none text-yellow-100/90 placeholder-yellow-800/50 focus:ring-0 text-lg font-serif italic"
                    placeholder="この本から得た、たった一つの真実は？"
                />
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
                <textarea
                    className="w-full h-full bg-transparent p-6 resize-none outline-none text-slate-300 font-sans leading-relaxed text-lg placeholder-slate-700/50"
                    value={book.notes}
                    onChange={(e) => onUpdateNote(book.id, e.target.value)}
                    placeholder="# 読書メモを入力...&#10;- なぜこの本を読んだか？&#10;- 現場でどう活かすか？"
                />

                <div className="absolute bottom-6 right-6 text-slate-600 flex items-center gap-2">
                    <span className="text-xs">自動保存中...</span>
                    <Save className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
};
