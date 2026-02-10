import React from 'react';
import { Book } from '../../data/mockData';
import { BookSpine } from './BookSpine';

interface BookshelfProps {
    books: Book[];
    onSelectBook: (book: Book) => void;
    selectedBookId?: string;
}

export const Bookshelf: React.FC<BookshelfProps> = ({ books, onSelectBook, selectedBookId }) => {
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
                {/* Empty space filler for aesthetic */}
                <div className="w-4 h-60"></div>
            </div>
            <div className="mt-2 text-center text-slate-600 text-xs uppercase tracking-widest">
                平野の思考本棚
            </div>
        </div>
    );
};
