import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, Trash, User, Repeat } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type Task } from '@/api/tasks';
import { TASK_CATEGORIES } from '@/lib/constants';

interface TaskCardProps {
  task: Task & { assigned_to_profile?: any };
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case TASK_CATEGORIES.DYNAMIC:
        return 'Daily Task';
      case TASK_CATEGORIES.STABLE:
        return 'Stable Work';
      case TASK_CATEGORIES.SCHEDULED:
        return 'Scheduled Task';
      default:
        return category;
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <Card className="flex flex-col h-full bg-card hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Category Accent Stripe */}
      <div
        className={`absolute top-0 left-0 w-full h-1 ${
          task.category === TASK_CATEGORIES.STABLE
            ? 'bg-purple-500'
            : task.category === TASK_CATEGORIES.SCHEDULED
            ? 'bg-orange-500'
            : 'bg-blue-500'
        }`}
      />

      <CardHeader className="pt-6 pb-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider">
            {getCategoryLabel(task.category)}
          </Badge>
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight mt-3 group-hover:text-primary transition-colors leading-tight">
          {task.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
            {task.description}
          </p>
        )}

        <div className="space-y-2 text-xs text-muted-foreground mt-auto">
          {task.category === TASK_CATEGORIES.SCHEDULED && task.scheduled_at && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>Scheduled: {formatTime(task.scheduled_at)} on {formatDate(task.scheduled_at)}</span>
            </div>
          )}
          {task.due_date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>Due: {formatDate(task.due_date)}</span>
            </div>
          )}
          {task.is_recurring && (
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Repeat className="h-3.5 w-3.5" />
              <span>Recurring ({task.recurrence_pattern})</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-border flex items-center justify-between gap-4">
        {/* Assignee Info */}
        <div className="flex items-center gap-2.5">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
              {task.assigned_to_profile?.full_name ? (
                getInitials(task.assigned_to_profile.full_name)
              ) : (
                <User className="h-3 w-3" />
              )}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-foreground max-w-[120px] truncate">
            {task.assigned_to_profile?.full_name || 'All Employees'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(task)}>
            <Edit className="h-3.5 w-3.5" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onDelete(task.id)}>
            <Trash className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default TaskCard;
