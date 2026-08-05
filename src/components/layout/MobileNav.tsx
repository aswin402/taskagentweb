import { Sheet, SheetContent } from '@/components/ui/sheet';
import Sidebar from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="p-0 w-72">
        <Sidebar className="border-none" onLinkClick={onClose} />
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
