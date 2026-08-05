import { useState } from 'react';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { useTaskMutations } from '@/features/tasks/hooks/useTaskMutations';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import TaskFilters from '@/features/tasks/components/TaskFilters';
import TaskList from '@/features/tasks/components/TaskList';
import TaskDialog from '@/features/tasks/components/TaskDialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { type Task } from '@/api/tasks';
import { toast } from 'sonner';

import ConfirmDialog from '@/components/shared/ConfirmDialog';

export function TasksPage() {
  const { tasks, isLoading: isTasksLoading, error: tasksError, filters, setFilters } = useTasks();
  const { createTask, updateTask, deleteTask, isCreating, isUpdating } = useTaskMutations();
  const { employees, isLoading: isEmployeesLoading } = useEmployees();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleAddClick = () => {
    setSelectedTask(null);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteTask(deleteTargetId);
      toast.success('Task deleted successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete task');
    }
    setDeleteTargetId(null);
  };

  const isLoading = isTasksLoading || isEmployeesLoading;

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="p-6 text-center bg-destructive/10 border border-destructive/20 text-destructive rounded-xl max-w-md mx-auto mt-12">
        <h3 className="font-bold text-lg">Error Loading Tasks</h3>
        <p className="text-sm mt-1">{tasksError?.message || 'Unknown network error. Please try again.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
          <p className="text-muted-foreground mt-1">
            Assign works, scheduled appointments, and daily checklist tasks.
          </p>
        </div>
        <Button onClick={handleAddClick} className="shadow-lg shadow-primary/10">
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      <TaskFilters
        filters={filters}
        setFilters={setFilters}
        employees={employees}
      />

      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <TaskDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        task={selectedTask}
        employees={employees}
        createTask={createTask}
        updateTask={updateTask}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action is permanent."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}

export default TasksPage;
