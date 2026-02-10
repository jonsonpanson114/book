import { AppShell } from './components/AppShell';
import { useBooks } from './hooks/useBooks';

export default function App() {
  const { books } = useBooks();

  return (
    <AppShell
      sidebarContent={<div className="p-4 text-white">Sidebar Test</div>}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="p-8 text-white text-xl">
          Books loaded: {books.length}
        </div>
      </div>
    </AppShell>
  );
}
