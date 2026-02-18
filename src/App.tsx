import { useState } from 'react';
import { Layout } from './components/ui/Layout';
import { Bookshelf } from './components/bookshelf/Bookshelf';
import { NoteEditor } from './components/arena/NoteEditor';
import { JinnaiChat } from './components/jinnai/JinnaiChat';
import { AddBookModal } from './components/bookshelf/AddBookModal';
import { ReadingStats } from './components/ui/ReadingStats';
import { useBooks } from './hooks/useBooks';
import { ArrowLeft } from 'lucide-react';

function App() {
  const { books, addBook, updateNote, updateStatus, updateOneThing, updateTags, analyzeCrossBookInsights } = useBooks();
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const selectedBook = books.find(b => b.id === selectedBookId) || null;

  const stats = {
    totalBooks: books.length,
    readingCount: books.filter(b => b.status === 'reading').length,
    finishedCount: books.filter(b => b.status === 'finished').length
  };

  return (
    <Layout
      sidebarContent={
        <JinnaiChat
          bookId={selectedBook?.id}
          bookTitle={selectedBook?.title}
          notes={selectedBook?.notes || ''}
          insights={selectedBook?.insights?.map(i => i.text) || []}
          onRequestCrossAnalysis={analyzeCrossBookInsights}
          stats={stats}
        />
      }
      onProfileClick={() => setShowStats(true)}
    >
      {!selectedBook ? (
        <div className="w-full h-full flex items-center justify-center p-8">
          <Bookshelf
            books={books}
            onSelectBook={(book) => setSelectedBookId(book.id)}
            onAddBook={() => setShowAddBook(true)}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full relative">
          <div className="absolute top-4 right-8 z-50">
            <button
              onClick={() => setSelectedBookId(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-medium">本棚に戻る</span>
            </button>
          </div>

          <NoteEditor
            book={selectedBook}
            onUpdateNote={updateNote}
            onUpdateStatus={updateStatus}
            onUpdateOneThing={updateOneThing}
            onUpdateTags={updateTags}
          />
        </div>
      )}

      {showAddBook && (
        <AddBookModal
          onAdd={addBook}
          onClose={() => setShowAddBook(false)}
        />
      )}

      {showStats && (
        <ReadingStats
          books={books}
          onClose={() => setShowStats(false)}
        />
      )}
    </Layout>
  );
}

export default App;
