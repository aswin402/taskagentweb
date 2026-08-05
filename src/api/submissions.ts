import { supabase } from './supabase';
import type { Database } from '@/types/database';

import type { Task } from './tasks';

export type TaskSubmission = Database['public']['Tables']['task_submissions']['Row'];

export async function getDailyTasksAndSubmissions(employeeId: string, dateStr: string): Promise<{ tasks: Task[], submissions: TaskSubmission[] }> {
  // Fetch active/rolled_over tasks assigned to the employee or all
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .or(`assigned_to.eq.${employeeId},assigned_to.is.null`)
    .in('status', ['active', 'rolled_over'])
    .order('category', { ascending: true });

  if (tasksError) throw tasksError;

  // Fetch existing submissions for this employee on this date
  const { data: submissions, error: subsError } = await supabase
    .from('task_submissions')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('submission_date', dateStr);

  if (subsError) throw subsError;

  return {
    tasks: (tasks || []) as Task[],
    submissions: (submissions || []) as TaskSubmission[],
  };
}

export async function submitTaskSubmissions(submissions: Omit<Database['public']['Tables']['task_submissions']['Insert'], 'id' | 'submitted_at'>[]) {
  const { data, error } = await (supabase.from('task_submissions') as any)
    .upsert(submissions, { onConflict: 'task_id,employee_id,submission_date' })
    .select();

  if (error) throw error;
  return data;
}
