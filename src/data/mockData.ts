export type BookStatus = 'reading' | 'finished' | 'tsundoku';

export interface Book {
    id: string;
    title: string;
    author: string;
    oneThing: string; // The user's one-line conclusion
    status: BookStatus;
    category: 'Business' | 'Novel' | 'Philosophy' | 'Art' | 'Science';
    notes: string;
    coverColor: string; // Tailwind class, e.g., 'bg-red-900'
    lastUpdated: string;
}

export const MOCK_BOOKS: Book[] = [
    {
        id: '1',
        title: 'Mindset',
        author: 'Carol S. Dweck',
        oneThing: '才能ではなく、努力のプロセスを褒めることが成長を生む。',
        status: 'reading',
        category: 'Business',
        notes: '# 第1章：マインドセットとは\n\n- 固定思考（Fixed）と成長思考（Growth）\n- 失敗をどう捉えるか？\n  - Fixed: 才能がない証拠\n  - Growth: 学びの機会\n\n## 現場での適用\n部下のフジモンに対して、成果物だけで判断していないか？「アプローチ」を評価する言葉かけを意識する。',
        coverColor: 'bg-blue-900',
        lastUpdated: '2026-02-07T10:00:00',
    },
    {
        id: '2',
        title: '重力ピエロ',
        author: '伊坂幸太郎',
        oneThing: '深刻さは、重力のように人を縛る。もっと軽やかに跳べ。',
        status: 'finished',
        category: 'Novel',
        notes: '春が二階から落ちてくる冒頭の軽やかさ。\n遺伝子という「呪い」をどう解釈するか。\n\n> "楽しそうに生きていれば、重力なんて消してしまう" \n\n営業のプレッシャーも同じかもしれない。深刻ぶることで自分を守っていないか？',
        coverColor: 'bg-emerald-900',
        lastUpdated: '2026-02-01T15:30:00',
    },
    {
        id: '3',
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        oneThing: '直感（システム1）は便利だが、重要な決定では疑え。',
        status: 'tsundoku',
        category: 'Science',
        notes: '',
        coverColor: 'bg-amber-900',
        lastUpdated: '2026-01-20T09:00:00',
    },
    {
        id: '4',
        title: 'Pure Invention',
        author: 'Matt Alt',
        oneThing: '日本の「ファンタジー」が世界を変えた。',
        status: 'reading',
        category: 'Business',
        notes: '日本の製品がなぜ愛されるか？機能ではなく「不可思議さ」や「カワイイ」が鍵。\n\n建材の営業に「物語」はあるか？\n機能スペック競争からの脱却ヒント。',
        coverColor: 'bg-purple-900',
        lastUpdated: '2026-02-06T20:00:00',
    },
];

export interface JinnaiMessage {
    id: string;
    text: string;
    type: 'devil' | 'serendipity' | 'action' | 'normal';
    timestamp: string;
}
