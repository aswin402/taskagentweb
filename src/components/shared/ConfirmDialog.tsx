import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'primary';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone. Please confirm to proceed.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-3 ${
            variant === 'destructive' ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'
          }`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-2 mt-4 sm:space-x-0">
          <Button variant="outline" onClick={onClose} className="w-full">
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            className="w-full"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
