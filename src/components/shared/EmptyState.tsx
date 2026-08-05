import { CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'All Done!',
  description = 'No pending items assigned to you for today. Good work!',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-card/20 text-center max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;
