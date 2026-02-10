import React, { useState } from 'react';
import { AppLayout } from './components/ui/AppLayout';
import { useBooks } from './hooks/useBooks';

export default function App() {
  const { books } = useBooks();

  return (
    <AppLayout>
      <div className="flex items-center justify-center h-full text-slate-500">
        New Layout Test
      </div>
    </AppLayout>
  );
}
