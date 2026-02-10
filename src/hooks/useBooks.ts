import { useState, useEffect } from 'react';
import { Book, MOCK_BOOKS } from '../data/mockData';

const getInitialBooks = (): Book[] => {
    try {
        const saved = localStorage.getItem('jinnai_books');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.error('Failed to parse localStorage books:', e);
        localStorage.removeItem('jinnai_books');
    }
    return MOCK_BOOKS;
};

export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>(getInitialBooks);

    useEffect(() => {
        try {
            localStorage.setItem('jinnai_books', JSON.stringify(books));
        } catch (e) {
            console.error('Failed to save books to localStorage:', e);
        }
    }, [books]);

    const updateNote = (id: string, content: string) => {
        setBooks(prev => prev.map(book =>
            book.id === id ? { ...book, notes: content, lastUpdated: new Date().toISOString() } : book
        ));
    };

    const updateStatus = (id: string, status: Book['status']) => {
        setBooks(prev => prev.map(book =>
            book.id === id ? { ...book, status, lastUpdated: new Date().toISOString() } : book
        ));
    };

    const updateOneThing = (id: string, oneThing: string) => {
        setBooks(prev => prev.map(book =>
            book.id === id ? { ...book, oneThing, lastUpdated: new Date().toISOString() } : book
        ));
    };

    const updateTags = (id: string, tags: string[]) => {
        setBooks(prev => prev.map(book =>
            book.id === id ? { ...book, tags, lastUpdated: new Date().toISOString() } : book
        ));
    };

    return { books, updateNote, updateStatus, updateOneThing, updateTags };
};
