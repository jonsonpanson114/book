import React from 'react';
import type { Book } from '../../data/mockData';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface BookSpineProps {
    book: Book;
    onClick: (book: Book) => void;
    isSelected?: boolean;
}

export const BookSpine: React.FC<BookSpineProps> = ({ book, onClick, isSelected }) => {
    // Randomize height slightly for realism (using deterministic calc based on ID if possible, or just fixed for now)
    const heightClass = parseInt(book.id) % 2 === 0 ? 'h-56' : 'h-64';

    return (
        <motion.div
            layoutId={`spine-${book.id}`}
            onClick={() => onClick(book)}
            className={clsx(
                "relative rounded-sm shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl group",
                book.coverColor,
                heightClass,
                "w-12 md:w-14 flex flex-col justify-between py-4 select-none border-l border-white/10",
                isSelected ? 'ring-2 ring-yellow-500 scale-105 z-10' : 'opacity-90 hover:opacity-100'
            )}
            whileHover={{ scale: 1.05 }}
        >
            {/* Spine Title (Vertical) */}
            <div className="flex-1 flex items-center justify-center overflow-hidden">
                <h3 className="spine-text text-white/90 font-serif font-bold tracking-widest text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis max-h-full">
                    {book.title}
                </h3>
            </div>

            {/* Very small author name at bottom */}
            <div className="mt-2 flex justify-center">
                <span className="spine-text text-white/50 text-[10px] tracking-tight">{book.author.split(' ').pop()}</span>
            </div>

            {/* The One Thing Tooltip/Overlay */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-[#1e293b]/95 backdrop-blur-md rounded-xl border border-yellow-500/20 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                <div className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest mb-1">一行結論</div>
                <p className="text-slate-200 text-xs font-serif leading-relaxed">
                    "{book.oneThing}"
                </p>
                <div className="mt-1.5 text-slate-500 text-[10px]">
                    {book.status === 'reading' && '📖 読書中'}
                    {book.status === 'finished' && '✅ 読了'}
                    {book.status === 'tsundoku' && '📚 積読'}
                </div>
                {/* Arrow pointing down */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-yellow-500/20" />
            </div>
        </motion.div>
    );
};
