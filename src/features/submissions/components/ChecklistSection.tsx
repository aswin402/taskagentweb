import ChecklistItem from '@/components/shared/ChecklistItem';
import type { Task } from '@/api/tasks';

interface ChecklistSectionProps {
  title: string;
  tasks: Task[];
  localStates: Record<string, { isCompleted: boolean; reason: string | null; completed_quantity?: number }>;
  onToggle: (taskId: string, checked: boolean) => void;
  onQuantityChange: (taskId: string, quantity: number) => void;
  onEditReason: (task: Task) => void;
}

export function ChecklistSection({ title, tasks, localStates, onToggle, onQuantityChange, onEditReason }: ChecklistSectionProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
        {title} ({tasks.length})
      </h3>
      <div className="space-y-2.5">
        {tasks.map((task) => {
          const state = localStates[task.id] || { isCompleted: false, reason: null, completed_quantity: 0 };
          return (
            <ChecklistItem
              key={task.id}
              task={task}
              isCompleted={state.isCompleted}
              reason={state.reason}
              completedQuantity={state.completed_quantity || 0}
              onToggle={(checked) => onToggle(task.id, checked)}
              onQuantityChange={(qty) => onQuantityChange(task.id, qty)}
              onEditReason={() => onEditReason(task)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ChecklistSection;
