import { Badge } from '@/components/ui/badge';
import type { TaskStatus, Priority } from '@/lib/constants';

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'active':
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400">
          Active
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400">
          Completed
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="secondary" className="text-muted-foreground bg-muted">
          Cancelled
        </Badge>
      );
    case 'rolled_over':
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400">
          Rolled Over
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  switch (priority) {
    case 'low':
      return (
        <Badge variant="outline" className="bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400">
          Low
        </Badge>
      );
    case 'medium':
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400">
          Medium
        </Badge>
      );
    case 'high':
      return (
        <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400">
          High
        </Badge>
      );
    case 'urgent':
      return (
        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400 font-bold">
          Urgent
        </Badge>
      );
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}
