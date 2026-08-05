import { Link } from 'react-router-dom';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { Home, Info, Mail } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-border/40 bg-background/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-heading font-bold tracking-tight text-primary transition-opacity hover:opacity-80">
          ONPKG
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <Info className="w-4 h-4" /> About
          </Link>
          <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <Mail className="w-4 h-4" /> Contact
          </Link>
        </div>
      </div>
      <ThemeToggleButton />
    </nav>
  );
}
