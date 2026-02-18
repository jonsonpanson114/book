const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

const JINNAI_SYSTEM_PROMPT = `あなたは「陣内」という名前の読書メンターです。

性格: 厳しいが愛のある先輩。悪魔の代弁者(Devil's Advocate)として、ユーザーの考えに挑戦し、深く考えさせる。

口調: タメ口で「俺/お前」を使う。簡潔で鋭い。

役割:
- ユーザーの考えの矛盾や弱点を指摘する
- 抽象的な考えには具体的な行動を要求する
- 一見関係なさそうな分野と結びつけ、新しい視点を提供する
- 厳しいが、ユーザーの成長を心から願っている

回答は短く（1-3文）、鋭く、挑発的に。長々とした説明は不要。`;

export async function getJinnaiResponse(
  userMessage: string,
  context: {
    bookTitle?: string;
    notes?: string;
    insights?: string[];
    conversationHistory?: { role: 'user' | 'model'; text: string }[];
  }
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('Gemini API key not found. Using fallback responses.');
    return getFallbackResponse(userMessage);
  }

  try {
    // Build context string
    let contextStr = '';
    if (context.bookTitle) {
      contextStr += `\n\n【読んでいる本】${context.bookTitle}`;
    }
    if (context.notes) {
      contextStr += `\n\n【ユーザーのメモ】\n${context.notes.slice(0, 500)}`;
    }
    if (context.insights && context.insights.length > 0) {
      contextStr += `\n\n【気づき】\n${context.insights.slice(0, 3).join('\n')}`;
    }

    // Build conversation history
    const contents = [];

    if (context.conversationHistory && context.conversationHistory.length > 0) {
      for (const msg of context.conversationHistory.slice(-10)) {
        contents.push({
          role: msg.role,
          parts: [{ text: msg.text }]
        });
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage + contextStr }]
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: JINNAI_SYSTEM_PROMPT }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 200,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No text in response');
    }

    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getFallbackResponse(userMessage);
  }
}

export async function analyzeBooksWithAI(
  books: { title: string; insights: string[] }[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || books.length < 2) {
    return 'API keyが設定されていないか、本が少なすぎるぜ。もっと読め。';
  }

  try {
    const booksContext = books.map(book =>
      `【${book.title}】\n${book.insights.slice(0, 3).join('\n')}`
    ).join('\n\n');

    const prompt = `以下は複数の本から得た気づきだ。共通点、矛盾、パターンを見つけて、鋭く指摘しろ。\n\n${booksContext}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: JINNAI_SYSTEM_PROMPT }]
        },
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 300,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || 'おい、APIが黙りやがった。もう一回試せ。';
  } catch (error) {
    console.error('Error analyzing books:', error);
    return 'API呼び出しでエラーだ。ネット環境か、APIキーを確認しろ。';
  }
}

function getFallbackResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes('計画') || lowerMsg.includes('予定')) {
    return 'で、いつやるんだ？具体的な日付を決めろ。';
  }
  if (lowerMsg.includes('重要') || lowerMsg.includes('大切')) {
    return 'なぜそれが重要なんだ？お前の都合のいい解釈じゃないのか？';
  }
  if (lowerMsg.includes('成長') || lowerMsg.includes('学び')) {
    return '学んだだけで満足か？行動に移さなきゃ意味ないぞ。';
  }
  if (lowerMsg.includes('難しい') || lowerMsg.includes('困難')) {
    return '難しいって言い訳だろ。何が具体的に難しいんだ？分解して考えろ。';
  }

  return 'API keyが設定されてないな。.envファイルにVITE_GEMINI_API_KEYを設定しろ。それまではこういう手抜き返答で我慢しろ。';
}
