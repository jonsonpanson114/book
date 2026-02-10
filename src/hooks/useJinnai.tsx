import { useState, useEffect, useRef } from 'react';
import type { JinnaiMessage, Book } from '../data/mockData';

const JINNAI_RESPONSES = {
    devil: [
        "で、それは現場で使えるのか？きれいごとじゃないか？",
        "『マインドセット』の時は逆のこと書いてたぞ？一貫性がないな。",
        "その理論、部下が聞いたら『また部長が何か言ってる』で終わるぞ。",
        "リスクヘッジばかり考えてないか？攻めはどこだ？",
    ],
    serendipity: [
        "その営業理論、ボルダリングの重心移動と同じじゃないか？",
        "伊坂幸太郎なら、ここで伏線を回収するだろうな。",
        "六甲全山縦走の苦しさと似てるな。終わった後の景色は見えてるか？",
        "現代アートみたいに、もっと抽象度を上げてみろ。",
    ],
    action: [
        "それを明日、部下のフジモンにどう説明する？",
        "次の和歌山出張でどう試す？具体案を3つ書け。",
        "リョウさんに話したら笑われるぞ。もっと本質を突け。",
        "机上の空論はいい。行動計画（Action Plan）に変えろ。",
    ]
};

export const useJinnai = (currentBook: Book | null, noteContent: string) => {
    const [messages, setMessages] = useState<JinnaiMessage[]>([
        {
            id: 'init',
            text: "よう、平野。今日はどの本と戦うんだ？",
            type: 'normal',
            timestamp: new Date().toISOString()
        }
    ]);

    const lastNoteLength = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!currentBook) return;

        // Clear previous generic messages when book changes
        if (messages.length === 1 && messages[0].id === 'init') {
            setMessages([{
                id: 'start-' + currentBook.id,
                text: `『${currentBook.title}』か。${currentBook.oneThing}…本気でそう思ってるのか？`,
                type: 'devil',
                timestamp: new Date().toISOString()
            }]);
        }

    }, [currentBook]);

    useEffect(() => {
        // Analyze content changes (Debounced)
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            const diff = Math.abs(noteContent.length - lastNoteLength.current);
            if (diff > 50) { // Only trigger if significant content added
                triggerJinnaiResponse(noteContent);
                lastNoteLength.current = noteContent.length;
            }
        }, 3000); // 3 seconds of pause triggers Jinnai

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [noteContent]);

    const triggerJinnaiResponse = (content: string) => {
        let type: 'devil' | 'serendipity' | 'action' = 'devil';
        const rand = Math.random();

        // Simple Keyword matching (Mock Logic)
        if (content.includes("部下") || content.includes("チーム") || content.includes("藤門")) {
            type = 'action';
        } else if (content.includes("理論") || content.includes("定義") || content.includes("つまり")) {
            type = 'serendipity'; // Connect abstract concepts
        } else if (content.includes("重要") || content.includes("ポイント")) {
            type = 'devil'; // Challenge importance
        } else {
            if (rand > 0.6) type = 'action';
            else if (rand > 0.3) type = 'serendipity';
        }

        const responses = JINNAI_RESPONSES[type];
        const text = responses[Math.floor(Math.random() * responses.length)];

        const newMessage: JinnaiMessage = {
            id: Date.now().toString(),
            text,
            type,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, newMessage]);
    };

    return { messages };
};
