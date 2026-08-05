import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TASK_CATEGORIES, TASK_STATUSES, PRIORITIES } from '@/lib/constants';
import { type Profile } from '@/api/employees';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

import { toast } from 'sonner';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional().nullable(),
  category: z.string(),
  priority: z.string(),
  assigned_to: z.string().nullable().or(z.literal('all')),
  scheduled_at: z.string().optional().nullable(),
  due_date: z.string().optional().nullable(),
  is_recurring: z.boolean().default(false),
  recurrence_pattern: z.string().optional().nullable(),
  status: z.string().default(TASK_STATUSES.ACTIVE),
});

interface TaskFormProps {
  employees: Profile[];
  defaultValues?: any;
  onSubmit: (values: any) => Promise<void>;
  isSubmitting: boolean;
}

export function TaskForm({ employees, defaultValues, onSubmit, isSubmitting }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      category: defaultValues?.category || TASK_CATEGORIES.DYNAMIC,
      priority: defaultValues?.priority || PRIORITIES.MEDIUM,
      assigned_to: defaultValues?.assigned_to || 'all',
      scheduled_at: defaultValues?.scheduled_at ? new Date(defaultValues.scheduled_at).toISOString().slice(0, 16) : '',
      due_date: defaultValues?.due_date || '',
      is_recurring: defaultValues?.is_recurring || false,
      recurrence_pattern: defaultValues?.recurrence_pattern || 'daily',
      status: defaultValues?.status || TASK_STATUSES.ACTIVE,
    },
  });

  const category = watch('category');
  const isRecurring = watch('is_recurring');

  useEffect(() => {
    register('category');
    register('priority');
    register('assigned_to');
    register('status');
  }, [register]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('TaskForm Validation Errors:', errors);
    }
  }, [errors]);

  const handleFormSubmit = (data: any) => {
    const taskData: any = {
      title: data.title,
      description: data.description || null,
      category: data.category,
      priority: data.priority,
      assigned_to: data.assigned_to === 'all' || !data.assigned_to ? null : data.assigned_to,
      status: data.status,
    };

    if (data.category === TASK_CATEGORIES.SCHEDULED) {
      taskData.scheduled_at = data.scheduled_at ? new Date(data.scheduled_at).toISOString() : null;
      taskData.due_date = null;
      taskData.is_recurring = false;
      taskData.recurrence_pattern = null;
    } else {
      taskData.scheduled_at = null;
      taskData.due_date = data.due_date ? data.due_date : null;
      taskData.is_recurring = data.is_recurring;
      taskData.recurrence_pattern = data.is_recurring ? data.recurrence_pattern : null;
    }

    return onSubmit(taskData);
  };

  const handleFormError = (formErrors: any) => {
    console.log('TaskForm validation failed:', formErrors);
    const firstError = Object.values(formErrors)[0] as any;
    if (firstError?.message) {
      toast.warning(firstError.message);
    } else {
      toast.warning('Please check the highlighted form errors.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input id="title" placeholder="e.g. Publish social feed post" {...register('title')} disabled={isSubmitting} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Provide extra context here..." {...register('description')} disabled={isSubmitting} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            defaultValue={watch('category')}
            onValueChange={(val) => setValue('category', val as any, { shouldValidate: true, shouldDirty: true })}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TASK_CATEGORIES.DYNAMIC}>Daily Task</SelectItem>
              <SelectItem value={TASK_CATEGORIES.STABLE}>Stable Work</SelectItem>
              <SelectItem value={TASK_CATEGORIES.SCHEDULED}>Scheduled Task</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-destructive">{errors.category.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            defaultValue={watch('priority')}
            onValueChange={(val) => setValue('priority', val as any, { shouldValidate: true, shouldDirty: true })}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PRIORITIES.LOW}>Low</SelectItem>
              <SelectItem value={PRIORITIES.MEDIUM}>Medium</SelectItem>
              <SelectItem value={PRIORITIES.HIGH}>High</SelectItem>
              <SelectItem value={PRIORITIES.URGENT}>Urgent</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && <p className="text-xs text-destructive">{errors.priority.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assigned_to">Assignee</Label>
          <Select
            defaultValue={watch('assigned_to') || 'all'}
            onValueChange={(val) => setValue('assigned_to', val, { shouldValidate: true, shouldDirty: true })}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.assigned_to && <p className="text-xs text-destructive">{errors.assigned_to.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            defaultValue={watch('status')}
            onValueChange={(val) => setValue('status', val as any, { shouldValidate: true, shouldDirty: true })}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TASK_STATUSES.ACTIVE}>Active</SelectItem>
              <SelectItem value={TASK_STATUSES.COMPLETED}>Completed</SelectItem>
              <SelectItem value={TASK_STATUSES.CANCELLED}>Cancelled</SelectItem>
              <SelectItem value={TASK_STATUSES.ROLLED_OVER}>Rolled Over</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-xs text-destructive">{errors.status.message as string}</p>}
        </div>
      </div>

      {category === TASK_CATEGORIES.SCHEDULED ? (
        <div className="space-y-2">
          <Label htmlFor="scheduled_at">Scheduled Time</Label>
          <Input id="scheduled_at" type="datetime-local" {...register('scheduled_at')} disabled={isSubmitting} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date (Optional)</Label>
              <Input id="due_date" type="date" {...register('due_date')} disabled={isSubmitting} />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <Checkbox
                id="is_recurring"
                checked={watch('is_recurring')}
                onCheckedChange={(val) => setValue('is_recurring', !!val)}
                disabled={isSubmitting}
              />
              <Label htmlFor="is_recurring" className="cursor-pointer">Recurring task?</Label>
            </div>
          </div>

          {isRecurring && (
            <div className="space-y-2">
              <Label htmlFor="recurrence_pattern">Recurrence Pattern</Label>
              <Input id="recurrence_pattern" placeholder="e.g. daily, weekly, every Mon/Wed/Fri" {...register('recurrence_pattern')} disabled={isSubmitting} />
            </div>
          )}
        </>
      )}

      <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving Task...
          </>
        ) : (
          defaultValues ? 'Update Task' : 'Create Task'
        )}
      </Button>
    </form>
  );
}

export default TaskForm;
