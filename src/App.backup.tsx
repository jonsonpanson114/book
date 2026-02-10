import React, { useState } from 'react';
import { Layout } from './components/ui/Layout';
import { Bookshelf } from './components/bookshelf/Bookshelf';
import { NoteEditor } from './components/arena/NoteEditor';
import { JinnaiChat } from './components/jinnai/JinnaiChat';
import { useBooks } from './hooks/useBooks';
import { useJinnai } from './hooks/useJinnai';
import { Book } from './data/mockData';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

function App() {
  const { books, updateNote, updateStatus, updateOneThing, updateTags } = useBooks();
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const selectedBook = books.find(b => b.id === selectedBookId) || null;
  const { messages } = useJinnai(selectedBook, selectedBook?.notes || '');

  return (
    <Layout
      sidebarContent={selectedBook ? <JinnaiChat messages={messages} /> : null}
    >
      <AnimatePresence mode="wait">
        {!selectedBook ? (
          <motion.div
            key="bookshelf"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full h-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2428&auto=format&fit=crop&ixlib=rb-4.0.3')] bg-cover bg-center"
          >
            <div className="absolute inset-0 bg-[#0a0f1c]/90 backdrop-blur-sm" />
            <div className="z-10 w-full">
              <Bookshelf
                books={books}
                onSelectBook={(book) => setSelectedBookId(book.id)}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="arena"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex-1 flex flex-col h-full bg-[#0a0f1c]"
          >
            {/* Back button overlay */}
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
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;
