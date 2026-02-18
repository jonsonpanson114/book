import { useState, useEffect } from 'react';
import { MOCK_BOOKS } from '../data/mockData';
import type { Book } from '../data/mockData';

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

    const analyzeCrossBookInsights = (): {
        type: 'connection' | 'contradiction' | 'pattern' | 'suggestion';
        books: { title: string; insight: string }[];
        message: string;
    } | null => {
        // Get all books with insights
        const booksWithInsights = books.filter(b => b.insights && b.insights.length > 0);

        if (booksWithInsights.length < 2) {
            return null;
        }

        // Keywords for concept detection
        const conceptKeywords: Record<string, string[]> = {
            成長: ['成長', '学び', '努力', '変化', '進歩', 'grow'],
            失敗: ['失敗', '間違い', 'ミス', '挫折', 'fail'],
            思考: ['考え', '思考', '思う', '認知', 'think'],
            行動: ['行動', '実践', '実行', 'やる', 'action'],
            時間: ['時間', '期間', 'タイミング', '時期', 'time'],
            人間関係: ['人', '関係', 'コミュニケーション', '対人', 'relationship'],
            目標: ['目標', 'ゴール', '目的', '達成', 'goal'],
            習慣: ['習慣', 'ルーティン', '継続', 'habit']
        };

        // Analyze books for shared concepts
        const bookConcepts: Map<string, { concept: string; insight: string }[]> = new Map();

        for (const book of booksWithInsights) {
            const concepts: { concept: string; insight: string }[] = [];

            for (const insight of book.insights!) {
                for (const [concept, keywords] of Object.entries(conceptKeywords)) {
                    if (keywords.some(kw => insight.text.includes(kw))) {
                        concepts.push({ concept, insight: insight.text });
                    }
                }
            }

            if (concepts.length > 0) {
                bookConcepts.set(book.id, concepts);
            }
        }

        // Find shared concepts between books
        const conceptCounts: Map<string, { bookId: string; insight: string }[]> = new Map();

        for (const [bookId, concepts] of bookConcepts.entries()) {
            for (const { concept, insight } of concepts) {
                if (!conceptCounts.has(concept)) {
                    conceptCounts.set(concept, []);
                }
                conceptCounts.get(concept)!.push({ bookId, insight });
            }
        }

        // Find concepts that appear in multiple books
        const sharedConcepts = Array.from(conceptCounts.entries())
            .filter(([_, occurrences]) => occurrences.length >= 2)
            .sort((a, b) => b[1].length - a[1].length);

        if (sharedConcepts.length === 0) {
            return null;
        }

        // Pick the most common concept
        const [topConcept, occurrences] = sharedConcepts[0];
        const selectedBooks = occurrences.slice(0, 3).map(occ => {
            const book = books.find(b => b.id === occ.bookId)!;
            return {
                title: book.title,
                insight: occ.insight
            };
        });

        // Generate provocative message based on concept
        const messages: Record<string, string[]> = {
            成長: [
                'お前、全部の本で「成長」って言ってるな。で、実際に変わったのか？',
                '成長、成長って...具体的に何が変わったんだ？測定できるのか？',
                '複数の本から同じテーマを見つけてる。気づいてるだけじゃ意味ないぞ。'
            ],
            失敗: [
                '失敗について考えるのは良い。でも、同じ失敗を繰り返してないか？',
                '失敗から学ぶのは結構。で、次はどう動く？具体的にな。',
                'いくつもの本で失敗に言及してる。パターンが見えてるなら行動しろ。'
            ],
            思考: [
                '考えるのは得意みたいだな。でも考えるだけで終わってないか？',
                '思考、思考...頭でっかちになってないか？行動は？',
                '複数の本で思考法について触れてる。で、実践してるのか？'
            ],
            行動: [
                '行動について複数の本から学んでる。実際に動いてるか？',
                '行動の重要性は分かってるみたいだな。で、今日は何をした？',
                '行動、行動...読むだけじゃなくて動けよ。'
            ],
            時間: [
                '時間について複数の本で考えてるな。お前の時間の使い方、本当に最適か？',
                '時間管理を学んでる。でも実践できてるのか？',
                'いろんな本で時間について触れてる。で、無駄な時間を削ったか？'
            ],
            人間関係: [
                '人間関係について複数の本から学んでる。周りとの関係、改善したか？',
                '対人関係のパターンが見えてきたな。で、どう変える？',
                '人との関わり方、頭で分かっても実践は別だぞ。'
            ],
            目標: [
                '目標について複数の本で触れてる。具体的な数字、期限は決めてるか？',
                'ゴール設定を学んでるな。で、進捗は？測定してるか？',
                '目標、目標...立てるだけなら誰でもできる。達成しろ。'
            ],
            習慣: [
                '習慣の力を学んでるな。で、実際に新しい習慣、身についたか？',
                '複数の本で習慣について触れてる。21日続けたか？',
                '習慣化について知識はついた。次は実践だ。何から始める？'
            ]
        };

        const conceptMessages = messages[topConcept] || [
            `「${topConcept}」について複数の本で考えてるな。そろそろ行動に移せ。`
        ];

        return {
            type: 'pattern',
            books: selectedBooks,
            message: conceptMessages[Math.floor(Math.random() * conceptMessages.length)]
        };
    };

    const addBook = (bookData: { title: string; author: string; category: Book['category']; coverColor: string }) => {
        const newBook: Book = {
            id: Date.now().toString(),
            title: bookData.title,
            author: bookData.author,
            oneThing: '',
            status: 'tsundoku',
            category: bookData.category,
            notes: '',
            coverColor: bookData.coverColor,
            lastUpdated: new Date().toISOString(),
            tags: [],
            insights: [],
        };
        setBooks(prev => [...prev, newBook]);
        return newBook;
    };

    const deleteBook = (id: string) => {
        setBooks(prev => prev.filter(book => book.id !== id));
    };

    return { books, addBook, deleteBook, updateNote, updateStatus, updateOneThing, updateTags, analyzeCrossBookInsights };
};
