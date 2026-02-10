import { useState, useEffect } from 'react';
import { Book, MOCK_BOOKS } from '../data/mockData';

export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>(() => {
        const saved = localStorage.getItem('jinnai_books');
        return saved ? JSON.parse(saved) : MOCK_BOOKS;
    });

    useEffect(() => {
        localStorage.setItem('jinnai_books', JSON.stringify(books));
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
