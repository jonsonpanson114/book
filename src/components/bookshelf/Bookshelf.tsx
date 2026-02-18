import React from 'react';
import type { Book } from '../../data/mockData';
import { BookSpine } from './BookSpine';
import { Plus } from 'lucide-react';

interface BookshelfProps {
    books: Book[];
    onSelectBook: (book: Book) => void;
    onAddBook?: () => void;
    selectedBookId?: string;
}

export const Bookshelf: React.FC<BookshelfProps> = ({ books, onSelectBook, onAddBook, selectedBookId }) => {
    return (
        <div className="p-8 md:p-12 w-full max-w-4xl mx-auto">
            <div className="flex items-end justify-center gap-1 md:gap-2 perspective-1000 border-b-8 border-[#3d2b1f] shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#1a120b] px-8 pt-12 pb-0 rounded-sm">
                {books.map((book) => (
                    <BookSpine
                        key={book.id}
                        book={book}
                        onClick={onSelectBook}
                        isSelected={book.id === selectedBookId}
                    />
                ))}
                {/* Add book button */}
                {onAddBook && (
                    <button
                        onClick={onAddBook}
                        className="h-56 w-12 md:w-14 rounded-sm border-2 border-dashed border-white/10 hover:border-white/30 flex items-center justify-center transition-all hover:-translate-y-2 group"
                    >
                        <Plus className="w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors" />
                    </button>
                )}
                <div className="w-4 h-60"></div>
            </div>
            <div className="mt-2 text-center text-slate-600 text-xs uppercase tracking-widest">
                平野の思考本棚
            </div>
        </div>
    );
};
