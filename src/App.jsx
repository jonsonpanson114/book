import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  BookOpen,
  BrainCircuit,
  FolderSync,
  MessageSquareMore,
  Plus,
  Sparkles,
  Tags,
} from 'lucide-react'

const STORAGE_KEY = 'arena-notes-v1'

const statusMeta = {
  Reading: { label: '読書中', color: 'bg-blue-500/20 text-blue-200 border-blue-400/40' },
  Finished: { label: '読了', color: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' },
  Tsundoku: { label: '積読', color: 'bg-amber-500/20 text-amber-100 border-amber-300/50' },
}

const mockBooks = [
  {
    id: crypto.randomUUID(),
    title: 'マインドセット',
    author: 'キャロル・S・ドゥエック',
    oneThing: '失敗は能力不足の証明ではなく、設計図の更新だ。',
    status: 'Reading',
    tags: ['ビジネス', '心理学'],
    note: '## 気づき\n- 固定観念は部下育成で最も静かなボトルネック。\n- 「結果」より「試行」の言語化を評価したい。\n\n## 現場メモ\n次の1on1で藤門に「今週の実験」を聞く。',
  },
  {
    id: crypto.randomUUID(),
    title: '重力ピエロ',
    author: '伊坂幸太郎',
    oneThing: '軽やかな会話ほど、重い真実を運べる。',
    status: 'Finished',
    tags: ['小説', '物語構造'],
    note: '## ことばの手触り\n- ユーモアは現実逃避ではなく、現実を直視するための緩衝材。\n\n## 営業への転用\n- 仕様説明の前に、相手の文脈に合わせた「比喩」を置く。',
  },
  {
    id: crypto.randomUUID(),
    title: '現代アートの哲学',
    author: '架空の著者',
    oneThing: 'わからなさは、思考の酸素不足を知らせるアラーム。',
    status: 'Tsundoku',
    tags: ['アート', '哲学'],
    note: '## 期待\n- 抽象表現と営業提案の共通点を探す。\n- 六甲縦走のルート設計に似た「解釈の順路」があるはず。',
  },
]

const jinnaiOpeners = [
  'で、その洞察は現場の空気を変えるのか？',
  'きれいにまとめたな。で、痛みを伴う行動はどこだ？',
  '言葉はいい。だが、数字か行動で返せるか？',
]

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function buildJinnaiReply(currentBook, books) {
  const others = books.filter((book) => book.id !== currentBook.id)
  const contradiction = others.find(
    (book) =>
      book.note.includes('結果') && currentBook.note.includes('試行') && book.status === 'Finished',
  )
  const hasSportsTag = currentBook.tags.some((tag) => ['ビジネス', '哲学'].includes(tag))

  const devil = contradiction
    ? `前に読んだ『${contradiction.title}』では「結果」を重視してた。今回は「試行」推し。矛盾をどう説明する？`
    : `「${currentBook.oneThing}」って断言してるけど、反証できる例を3つ出せるか？`

  const serendipity = hasSportsTag
    ? 'その理論、ボルダリングの重心移動と同じだろ。最初の一手より、次の保持点を先に決めろ。'
    : '小説の会話テンポを営業トークに移植できる。最初の30秒を物語化してみろ。'

  const action =
    currentBook.status === 'Reading'
      ? '明日、部下の藤門にこの仮説を90秒で説明しろ。反応をメモして追記すること。'
      : '次の和歌山出張で1件だけ実験しろ。やる日時・相手・言い回しを書いてから寝ろ。'

  return {
    opener: pickRandom(jinnaiOpeners),
    devil,
    serendipity,
    action,
  }
}

async function mockGeminiSparring(currentBook, books) {
  await new Promise((resolve) => setTimeout(resolve, 650))
  const response = buildJinnaiReply(currentBook, books)
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    createdAt: new Date().toISOString(),
    text: `${response.opener}\n\n🪓 Devil's Advocate: ${response.devil}\n\n🧩 Serendipity Link: ${response.serendipity}\n\n🎯 Action Trigger: ${response.action}`,
  }
}

function App() {
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return mockBooks
    try {
      return JSON.parse(saved)
    } catch {
      return mockBooks
    }
  })
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id)
  const [statusFilter, setStatusFilter] = useState('Reading')
  const [newTag, setNewTag] = useState('')
  const [chat, setChat] = useState([])
  const [loadingReply, setLoadingReply] = useState(false)

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? books[0],
    [books, selectedBookId],
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  }, [books])

  useEffect(() => {
    if (!selectedBook && books.length > 0) {
      setSelectedBookId(books[0].id)
    }
  }, [books, selectedBook])

  const filteredBooks = useMemo(
    () => books.filter((book) => book.status === statusFilter),
    [books, statusFilter],
  )

  const updateSelectedBook = (patch) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === selectedBook.id
          ? {
              ...book,
              ...patch,
            }
          : book,
      ),
    )
  }

  const addTag = () => {
    const value = newTag.trim()
    if (!value || selectedBook.tags.includes(value)) return
    updateSelectedBook({ tags: [...selectedBook.tags, value] })
    setNewTag('')
  }

  const createBook = () => {
    const newBook = {
      id: crypto.randomUUID(),
      title: '新しいノート',
      author: '未設定',
      oneThing: '一行結論をここに。',
      status: 'Tsundoku',
      tags: ['ビジネス'],
      note: '## 問い\n- この本は、自分のどんな判断を変えるか？',
    }
    setBooks((prev) => [newBook, ...prev])
    setSelectedBookId(newBook.id)
    setStatusFilter(newBook.status)
  }

  const askJinnai = async () => {
    if (!selectedBook) return

    const userPrompt = {
      id: crypto.randomUUID(),
      role: 'user',
      text: `陣内、${selectedBook.title}のノートを見て突っ込んでくれ。`,
    }
    setChat((prev) => [...prev, userPrompt])
    setLoadingReply(true)
    try {
      const reply = await mockGeminiSparring(selectedBook, books)
      setChat((prev) => [...prev, reply])
    } finally {
      setLoadingReply(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-ink to-slate-900 text-slate-100">
      <header className="border-b border-slate-800/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-6 w-6 text-deepblue" />
            <div>
              <h1 className="text-lg font-semibold tracking-wide">The Arena</h1>
              <p className="text-xs text-slate-400">思考を揺さぶる読書ノート</p>
            </div>
          </div>
          <button
            type="button"
            onClick={createBook}
            className="inline-flex items-center gap-2 rounded-md border border-mutedgold/40 bg-mutedgold/10 px-3 py-2 text-sm text-amber-100 hover:bg-mutedgold/20"
          >
            <Plus className="h-4 w-4" />
            新規ノート
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1.2fr_1.6fr_1.2fr]">
        <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-300">
              <BookOpen className="h-4 w-4" />
              The Bookshelf
            </h2>
            <div className="flex gap-1">
              {Object.keys(statusMeta).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded px-2 py-1 text-xs ${
                    statusFilter === status ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {statusMeta[status].label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
            {filteredBooks.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => setSelectedBookId(book.id)}
                className={`min-h-48 rounded-md border p-3 text-left transition ${
                  selectedBook?.id === book.id
                    ? 'border-deepblue bg-deepblue/20'
                    : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                }`}
              >
                <div className="flex h-full flex-col justify-between rounded-sm bg-gradient-to-b from-slate-700/50 to-slate-950 p-2">
                  <p className="writing-mode-vertical-rl text-sm font-semibold tracking-wide [writing-mode:vertical-rl]">
                    {book.title}
                  </p>
                  <p className="mt-3 line-clamp-4 text-xs text-slate-300">{book.oneThing}</p>
                  <span className={`mt-2 inline-flex w-fit rounded border px-2 py-0.5 text-[10px] ${statusMeta[book.status].color}`}>
                    {statusMeta[book.status].label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {selectedBook && (
          <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-300">
              <FolderSync className="h-4 w-4" />
              The Arena
            </h2>

            <div className="mb-3 grid gap-2 md:grid-cols-2">
              <input
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                value={selectedBook.title}
                onChange={(e) => updateSelectedBook({ title: e.target.value })}
              />
              <input
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                value={selectedBook.oneThing}
                onChange={(e) => updateSelectedBook({ oneThing: e.target.value })}
                placeholder="一行結論"
              />
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {Object.keys(statusMeta).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateSelectedBook({ status })}
                  className={`rounded border px-2 py-1 text-xs ${statusMeta[status].color}`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="mb-3 rounded border border-slate-700 bg-slate-950/80 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs text-slate-300">
                <Tags className="h-4 w-4" /> ジャンルタグ
              </div>
              <div className="mb-2 flex flex-wrap gap-2">
                {selectedBook.tags.map((tag) => (
                  <span key={tag} className="rounded bg-slate-800 px-2 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="タグ追加"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded bg-slate-700 px-3 py-1 text-xs hover:bg-slate-600"
                >
                  追加
                </button>
              </div>
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              <textarea
                value={selectedBook.note}
                onChange={(e) => updateSelectedBook({ note: e.target.value })}
                className="min-h-72 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm leading-relaxed"
              />
              <div className="prose prose-invert min-h-72 max-w-none rounded border border-slate-700 bg-slate-950 px-4 py-2 text-sm">
                <ReactMarkdown>{selectedBook.note}</ReactMarkdown>
              </div>
            </div>
          </section>
        )}

        <aside className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-300">
              <MessageSquareMore className="h-4 w-4" />
              The Jinnai Persona
            </h2>
            <button
              type="button"
              onClick={askJinnai}
              disabled={loadingReply || !selectedBook}
              className="inline-flex items-center gap-1 rounded border border-deepblue/50 bg-deepblue/20 px-2 py-1 text-xs hover:bg-deepblue/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles className="h-3.5 w-3.5" /> 突っ込ませる
            </button>
          </div>
          <p className="mb-3 text-xs text-slate-400">
            API構造はGemini想定（現在はモック）。褒めない、逃がさない、行動に落とす。
          </p>

          <div className="space-y-2">
            {chat.map((msg) => (
              <div
                key={msg.id}
                className={`rounded border px-3 py-2 text-sm whitespace-pre-line ${
                  msg.role === 'assistant'
                    ? 'border-mutedgold/40 bg-amber-900/20 text-amber-50'
                    : 'border-slate-700 bg-slate-800/80 text-slate-100'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loadingReply && (
              <div className="rounded border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-300">
                陣内が過去ノートをほじくり返している...
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
