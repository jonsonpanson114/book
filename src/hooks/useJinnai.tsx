import { useState, useEffect, useRef } from 'react';
import type { JinnaiMessage, Book } from '../data/mockData';

const JINNAI_RESPONSES = {
    devil: [
        "で、それは現場で使えるのか？きれいごとじゃないか？",
        "『マインドセット』の時は逆のこと書いてたぞ？一貫性がないな。",
        "その理論、部下が聞いたら『また部長が何か言ってる』で終わるぞ。",
        "リスクヘッジばかり考えてないか？攻めはどこだ？",
        "成長？そんな抽象的な言葉で満足してるのか？",
        "計画を立てる前に、なぜ今までできなかったか考えたか？",
    ],
    serendipity: [
        "その営業理論、ボルダリングの重心移動と同じじゃないか？",
        "伊坂幸太郎なら、ここで伏線を回収するだろうな。",
        "六甲全山縦走の苦しさと似てるな。終わった後の景色は見えてるか？",
        "現代アートみたいに、もっと抽象度を上げてみろ。",
        "ジャズの即興演奏みたいなもんだ。理論は知ってるが、その場で捨てられるか？",
        "映画『マトリックス』の赤い薬と青い薬、お前はどっちを選ぶ？",
    ],
    action: [
        "それを明日、部下のフジモンにどう説明する？",
        "次の和歌山出張でどう試す？具体案を3つ書け。",
        "リョウさんに話したら笑われるぞ。もっと本質を突け。",
        "机上の空論はいい。行動計画（Action Plan）に変えろ。",
        "で、具体的にいつやるんだ？カレンダーに入れたか？",
        "計画だけなら誰でもできる。最初の一歩は何だ？",
    ]
};

// Keyword patterns that trigger specific response types
const KEYWORD_TRIGGERS = {
    devil: [
        '重要', 'ポイント', '大切', '必要', '本質', 'マインドセット',
        '成長', '変化', '成功', '目標', '理想'
    ],
    action: [
        '部下', 'チーム', '藤門', 'フジモン', '計画', 'プラン',
        '予定', '実行', 'やる', 'する', '始める', '取り組む'
    ],
    serendipity: [
        '理論', '定義', 'つまり', '要するに', '概念', '抽象',
        'なぜ', '原因', '背景', '哲学', '思想'
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
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastBookIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!currentBook) return;

        // Only trigger on book change
        if (lastBookIdRef.current !== currentBook.id) {
            lastBookIdRef.current = currentBook.id;

            const greeting = currentBook.oneThing
                ? `『${currentBook.title}』か。「${currentBook.oneThing}」…本気でそう思ってるのか？`
                : `『${currentBook.title}』を選んだか。で、この本から何を盗むつもりだ？`;

            setMessages([{
                id: 'start-' + currentBook.id,
                text: greeting,
                type: 'devil',
                timestamp: new Date().toISOString()
            }]);
            lastNoteLength.current = noteContent.length;
        }
    }, [currentBook?.id]);

    useEffect(() => {
        if (!currentBook) return;

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

        // Check keyword triggers first (priority order)
        const contentLower = content.toLowerCase();

        // Check action keywords (highest priority - encourage concrete steps)
        const hasActionKeyword = KEYWORD_TRIGGERS.action.some(kw =>
            content.includes(kw) || contentLower.includes(kw.toLowerCase())
        );

        // Check devil keywords (challenge assumptions)
        const hasDevilKeyword = KEYWORD_TRIGGERS.devil.some(kw =>
            content.includes(kw) || contentLower.includes(kw.toLowerCase())
        );

        // Check serendipity keywords (connect ideas)
        const hasSerendipityKeyword = KEYWORD_TRIGGERS.serendipity.some(kw =>
            content.includes(kw) || contentLower.includes(kw.toLowerCase())
        );

        // Determine type based on keywords with some randomness
        if (hasActionKeyword && Math.random() > 0.3) {
            type = 'action';
        } else if (hasSerendipityKeyword && Math.random() > 0.4) {
            type = 'serendipity';
        } else if (hasDevilKeyword && Math.random() > 0.3) {
            type = 'devil';
        } else {
            // Random fallback
            const rand = Math.random();
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
