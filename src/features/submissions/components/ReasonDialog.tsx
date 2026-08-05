import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ReasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reason: string) => void;
  taskTitle: string;
  initialReason?: string;
}

export function ReasonDialog({ isOpen, onClose, onSave, taskTitle, initialReason = '' }: ReasonDialogProps) {
  const [reason, setReason] = useState(initialReason);

  useEffect(() => {
    if (isOpen) {
      setReason(initialReason);
    }
  }, [isOpen, initialReason]);

  const handleSave = () => {
    if (!reason.trim()) return;
    onSave(reason);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reason for Non-Completion</DialogTitle>
          <DialogDescription>
            Please provide a brief reason why <strong className="text-foreground">"{taskTitle}"</strong> is not completed today.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="reason-text">Non-completion Reason</Label>
          <Textarea
            id="reason-text"
            placeholder="e.g. Ran out of time, awaiting manager confirmation, not applicable today..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!reason.trim()}>
            Save Reason
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReasonDialog;
