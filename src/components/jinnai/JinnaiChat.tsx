import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, Lightbulb, MessageSquare, Send, Loader2, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { getJinnaiResponse } from '../../services/gemini';

interface Message {
    id: string;
    text: string;
    type: 'devil' | 'action' | 'serendipity' | 'challenge' | 'user' | 'crossAnalysis';
    timestamp: string;
    metadata?: {
        books?: { title: string; insight: string }[];
    };
}

interface JinnaiChatProps {
    bookId?: string;
    bookTitle?: string;
    notes?: string;
    insights?: string[];
    onRequestSerendipity?: () => void;
    onRequestCrossAnalysis?: () => {
        type: string;
        books: { title: string; insight: string }[];
        message: string;
    } | null;
    stats?: {
        totalBooks: number;
        readingCount: number;
        finishedCount: number;
    };
}

export const JinnaiChat: React.FC<JinnaiChatProps> = ({
    bookId,
    bookTitle,
    notes = '',
    insights = [],
    onRequestSerendipity,
    onRequestCrossAnalysis,
    stats
}) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Separate message storage: per-book and global
    const [messagesByBook, setMessagesByBook] = useState<Record<string, Message[]>>({});
    const [globalMessages, setGlobalMessages] = useState<Message[]>([]);

    const messages = bookId ? (messagesByBook[bookId] || []) : globalMessages;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !bookId || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input.trim(),
            type: 'user',
            timestamp: new Date().toISOString()
        };

        // Add user message to the appropriate book's messages
        setMessagesByBook(prev => ({
            ...prev,
            [bookId]: [...(prev[bookId] || []), userMessage]
        }));

        setInput('');
        setIsLoading(true);

        try {
            // Build conversation history for context
            const conversationHistory = (messagesByBook[bookId] || []).map(msg => ({
                role: msg.type === 'user' ? 'user' as const : 'model' as const,
                text: msg.text
            }));

            conversationHistory.push({
                role: 'user',
                text: userMessage.text
            });

            const responseText = await getJinnaiResponse(userMessage.text, {
                bookTitle,
                notes,
                insights,
                conversationHistory
            });

            const jinnaiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                type: 'devil',
                timestamp: new Date().toISOString()
            };

            setMessagesByBook(prev => ({
                ...prev,
                [bookId]: [...(prev[bookId] || []), userMessage, jinnaiMessage]
            }));
        } catch (error) {
            console.error('Error getting Jinnai response:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'おい、エラーが起きた。もう一回試せ。',
                type: 'devil',
                timestamp: new Date().toISOString()
            };

            setMessagesByBook(prev => ({
                ...prev,
                [bookId]: [...(prev[bookId] || []), userMessage, errorMessage]
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChallenge = () => {
        const challengeMessage: Message = {
            id: Date.now().toString(),
            text: 'おい、何をぼーっとしてる？本を読んだら何か書け。思考を言語化しないと意味ないぞ。',
            type: 'challenge',
            timestamp: new Date().toISOString()
        };

        if (bookId) {
            setMessagesByBook(prev => ({
                ...prev,
                [bookId]: [...(prev[bookId] || []), challengeMessage]
            }));
        } else {
            setGlobalMessages(prev => [...prev, challengeMessage]);
        }
    };

    const handleCrossAnalysis = () => {
        if (!onRequestCrossAnalysis) return;

        const analysisResult = onRequestCrossAnalysis();
        if (!analysisResult) {
            const noDataMessage: Message = {
                id: Date.now().toString(),
                text: '本が少なすぎるか、気づきが足りない。もっと読んでメモを取れ。',
                type: 'challenge',
                timestamp: new Date().toISOString()
            };
            setGlobalMessages(prev => [...prev, noDataMessage]);
            return;
        }

        const crossAnalysisMessage: Message = {
            id: Date.now().toString(),
            text: analysisResult.message,
            type: 'crossAnalysis',
            timestamp: new Date().toISOString(),
            metadata: {
                books: analysisResult.books
            }
        };

        setGlobalMessages(prev => [...prev, crossAnalysisMessage]);
    };

    const getIcon = (type: Message['type']) => {
        switch (type) {
            case 'devil': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'serendipity': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
            case 'action': return <Zap className="w-4 h-4 text-blue-500" />;
            case 'challenge': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
            case 'crossAnalysis': return <Sparkles className="w-4 h-4 text-purple-500" />;
            case 'user': return <MessageSquare className="w-4 h-4 text-slate-400" />;
            default: return <MessageSquare className="w-4 h-4 text-slate-500" />;
        }
    };

    const getBorderColor = (type: Message['type']) => {
        switch (type) {
            case 'devil': return 'border-red-500/20 bg-red-500/5';
            case 'serendipity': return 'border-yellow-500/20 bg-yellow-500/5';
            case 'action': return 'border-blue-500/20 bg-blue-500/5';
            case 'challenge': return 'border-orange-500/20 bg-orange-500/5';
            case 'crossAnalysis': return 'border-purple-500/20 bg-purple-500/5';
            case 'user': return 'border-slate-600/40 bg-slate-800/30';
            default: return 'border-slate-700 bg-slate-800/50';
        }
    };

    return (
        <div className="h-full flex flex-col p-4 bg-[#0d1221]">
            <div className="mb-4 flex items-center justify-between pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                        陣内 (思考の壁打ち相手)
                    </h3>
                </div>
                {stats && (
                    <div className="text-[10px] text-slate-600">
                        {stats.totalBooks}冊 | 読書中{stats.readingCount}
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="mb-4 flex gap-2 flex-wrap">
                <button
                    onClick={handleChallenge}
                    className="text-xs px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-colors"
                >
                    陣内に煽られる
                </button>
                {onRequestSerendipity && bookId && (
                    <button
                        onClick={onRequestSerendipity}
                        className="text-xs px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                    >
                        セレンディピティ
                    </button>
                )}
                {onRequestCrossAnalysis && (
                    <button
                        onClick={handleCrossAnalysis}
                        className="text-xs px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors"
                    >
                        横断分析
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: msg.type === 'user' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={clsx(
                                "p-4 rounded-xl border mb-2 text-sm leading-relaxed relative",
                                getBorderColor(msg.type),
                                msg.type === 'user' && 'ml-8'
                            )}
                        >
                            <div className="absolute -top-2 -left-2 bg-[#0d1221] p-1 rounded-full border border-white/10 shadow-sm">
                                {getIcon(msg.type)}
                            </div>
                            <span className="text-slate-300 font-medium whitespace-pre-wrap">
                                {msg.text}
                            </span>
                            {msg.metadata?.books && (
                                <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                                    {msg.metadata.books.map((book, idx) => (
                                        <div key={idx} className="text-xs text-slate-500">
                                            <span className="text-slate-400 font-medium">『{book.title}』</span>
                                            <br />
                                            {book.insight}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-2 text-[10px] text-slate-600 text-right">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>

            {/* Input area - only show when a book is selected */}
            {bookId && (
                <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="陣内に質問する..."
                            disabled={isLoading}
                            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-600 disabled:opacity-50"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-600">
                        Enter で送信 | Shift+Enter で改行
                    </div>
                </div>
            )}
        </div>
    );
};
