import React, { useRef, useEffect } from 'react';
import { JinnaiMessage } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, Lightbulb, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

interface JinnaiChatProps {
    messages: JinnaiMessage[];
}

export const JinnaiChat: React.FC<JinnaiChatProps> = ({ messages }) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getIcon = (type: JinnaiMessage['type']) => {
        switch (type) {
            case 'devil': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            case 'serendipity': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
            case 'action': return <Zap className="w-4 h-4 text-blue-500" />;
            default: return <MessageSquare className="w-4 h-4 text-slate-500" />;
        }
    };

    const getBorderColor = (type: JinnaiMessage['type']) => {
        switch (type) {
            case 'devil': return 'border-red-500/20 bg-red-500/5';
            case 'serendipity': return 'border-yellow-500/20 bg-yellow-500/5';
            case 'action': return 'border-blue-500/20 bg-blue-500/5';
            default: return 'border-slate-700 bg-slate-800/50';
        }
    };

    return (
        <div className="h-full flex flex-col p-4 bg-[#0d1221]">
            <div className="mb-4 flex items-center gap-2 pb-4 border-b border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h3 className="text-slate-400 text-xs uppercase tracking-widest font-bold">陣内 (思考の壁打ち相手)</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={clsx(
                                "p-4 rounded-xl border mb-2 text-sm leading-relaxed relative",
                                getBorderColor(msg.type)
                            )}
                        >
                            <div className="absolute -top-2 -left-2 bg-[#0d1221] p-1 rounded-full border border-white/10 shadow-sm">
                                {getIcon(msg.type)}
                            </div>
                            <span className="text-slate-300 font-medium">
                                {msg.text}
                            </span>
                            <div className="mt-2 text-[10px] text-slate-600 text-right">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
