import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';

export function RootLayout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <main className="pt-16">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}
