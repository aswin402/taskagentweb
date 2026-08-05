import { APP_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="w-full py-4 px-6 border-t border-border bg-card/30 backdrop-blur-sm text-center text-xs text-muted-foreground">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <p className="flex items-center gap-1">
          <span>Operational accountability via AI & Managers</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
