import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import TaskForm from '@/components/forms/TaskForm';
import { toast } from 'sonner';
import { type Profile } from '@/api/employees';
import { type Task } from '@/api/tasks';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  employees: Profile[];
  createTask: (task: any) => Promise<any>;
  updateTask: (args: { id: string; updates: Partial<Task> }) => Promise<any>;
  isCreating: boolean;
  isUpdating: boolean;
}

export function TaskDialog({
  isOpen,
  onClose,
  task,
  employees,
  createTask,
  updateTask,
  isCreating,
  isUpdating,
}: TaskDialogProps) {
  const isEditMode = !!task;
  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (values: any) => {
    try {
      if (isEditMode && task) {
        await updateTask({ id: task.id, updates: values });
        toast.success('Task updated successfully');
      } else {
        await createTask(values);
        toast.success('Task created successfully');
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save task');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Task Details' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update the parameters and details of this task. Click save to apply changes.'
              : 'Add a new work item, scheduled task, or daily task checklist item for employees.'}
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          employees={employees}
          defaultValues={task}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

export default TaskDialog;
