import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import useSubmissions from '@/features/submissions/hooks/useSubmissions';
import ChecklistSection from '@/features/submissions/components/ChecklistSection';
import ReasonDialog from '@/features/submissions/components/ReasonDialog';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Loader2, ClipboardCheck, AlertCircle } from 'lucide-react';
import { TASK_CATEGORIES } from '@/lib/constants';
import { type Task } from '@/api/tasks';
import { toast } from 'sonner';

export function ChecklistPage() {
  const { user, profile } = useAuth();
  const todayDateStr = new Date().toISOString().split('T')[0];

  const { tasks, submissions, isLoading, error, submitReport, isSubmitting } = useSubmissions(
    user?.id,
    todayDateStr
  );

  const [localStates, setLocalStates] = useState<Record<string, { isCompleted: boolean; reason: string | null }>>({});
  const [activeReasonTask, setActiveReasonTask] = useState<Task | null>(null);
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);

  useEffect(() => {
    if (tasks.length > 0) {
      const initialStates: Record<string, { isCompleted: boolean; reason: string | null }> = {};
      tasks.forEach((task) => {
        const existingSub = submissions.find((sub) => sub.task_id === task.id);
        initialStates[task.id] = {
          isCompleted: existingSub ? existingSub.is_completed : false,
          reason: existingSub ? existingSub.reason : null,
        };
      });
      setLocalStates(initialStates);
    }
  }, [tasks, submissions]);

  const handleToggle = (taskId: string, checked: boolean) => {
    if (checked) {
      setLocalStates((prev) => ({
        ...prev,
        [taskId]: { isCompleted: true, reason: null },
      }));
    } else {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setActiveReasonTask(task);
        setReasonDialogOpen(true);
      }
    }
  };

  const handleSaveReason = (reason: string) => {
    if (activeReasonTask) {
      setLocalStates((prev) => ({
        ...prev,
        [activeReasonTask.id]: { isCompleted: false, reason },
      }));
      toast.info(`Reason saved for ${activeReasonTask.title}`);
    }
  };

  const handleCancelReason = () => {
    if (activeReasonTask) {
      setLocalStates((prev) => ({
        ...prev,
        [activeReasonTask.id]: { isCompleted: false, reason: null },
      }));
    }
    setReasonDialogOpen(false);
  };

  const handleSubmit = async () => {
    const missingReasons: string[] = [];
    const submissionsPayload = tasks.map((task) => {
      const state = localStates[task.id] || { isCompleted: false, reason: null };
      if (!state.isCompleted && !state.reason) {
        missingReasons.push(task.title);
      }
      return {
        task_id: task.id,
        employee_id: user?.id || '',
        submission_date: todayDateStr,
        is_completed: state.isCompleted,
        reason: state.reason,
      };
    });

    if (missingReasons.length > 0) {
      toast.error(
        `Please provide a reason for all unchecked items before submitting. Missing: ${missingReasons.slice(0, 2).join(', ')}${
          missingReasons.length > 2 ? '...' : ''
        }`
      );
      return;
    }

    try {
      await submitReport(submissionsPayload);
      toast.success('Checklist report submitted successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit report. Please try again.');
    }
  };

  const dailyTasks = tasks.filter((t) => t.category === TASK_CATEGORIES.DYNAMIC);
  const stableWorks = tasks.filter((t) => t.category === TASK_CATEGORIES.STABLE);
  const scheduledTasks = tasks.filter((t) => t.category === TASK_CATEGORIES.SCHEDULED);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-destructive/10 border border-destructive/20 text-destructive rounded-xl mt-12">
        <h3 className="font-bold text-lg">Error Hydrating Checklist</h3>
        <p className="text-sm mt-1">{error?.message || 'Connection failure. Please refresh.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-3 duration-500 pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hello, {profile?.full_name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Complete your checklist for today, <strong className="text-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</strong>
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          <ChecklistSection
            title="Today's Checklist Tasks"
            tasks={dailyTasks}
            localStates={localStates}
            onToggle={handleToggle}
            onEditReason={(task) => {
              setActiveReasonTask(task);
              setReasonDialogOpen(true);
            }}
          />

          <ChecklistSection
            title="Scheduled Tasks & Appts"
            tasks={scheduledTasks}
            localStates={localStates}
            onToggle={handleToggle}
            onEditReason={(task) => {
              setActiveReasonTask(task);
              setReasonDialogOpen(true);
            }}
          />

          <ChecklistSection
            title="Stable Daily Work Items"
            tasks={stableWorks}
            localStates={localStates}
            onToggle={handleToggle}
            onEditReason={(task) => {
              setActiveReasonTask(task);
              setReasonDialogOpen(true);
            }}
          />

          <div className="flex flex-col gap-3 pt-6 border-t border-border">
            <Button size="lg" onClick={handleSubmit} disabled={isSubmitting} className="w-full shadow-lg shadow-primary/10">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <ClipboardCheck className="mr-2 h-5 w-5" />
                  Submit Daily Report
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
              Reasons are required for all unchecked items before submission.
            </p>
          </div>
        </div>
      )}

      <ReasonDialog
        isOpen={reasonDialogOpen}
        onClose={handleCancelReason}
        onSave={handleSaveReason}
        taskTitle={activeReasonTask?.title || ''}
        initialReason={activeReasonTask ? localStates[activeReasonTask.id]?.reason || '' : ''}
      />
    </div>
  );
}

export default ChecklistPage;
