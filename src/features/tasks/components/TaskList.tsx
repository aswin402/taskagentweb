import TaskCard from '@/components/shared/TaskCard';
import { ClipboardList } from 'lucide-react';
import { type Task } from '@/api/tasks';

interface TaskListProps {
  tasks: any[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-card/20 min-h-[300px]">
        <ClipboardList className="h-10 w-10 text-muted-foreground animate-pulse mb-4" />
        <h3 className="text-lg font-semibold">No Tasks Found</h3>
        <p className="text-sm text-muted-foreground text-center mt-1 max-w-sm">
          No tasks match the active filters. Adjust your criteria or create a new task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default TaskList;
