import { supabase } from './supabase';
import type { Database } from '@/types/database';

export type Task = Database['public']['Tables']['tasks']['Row'];

export async function getTasks(filters?: {
  category?: string;
  assignedTo?: string;
  status?: string;
}) {
  let query = supabase.from('tasks').select('*, assigned_to_profile:profiles!assigned_to(*)');

  if (filters) {
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters.assignedTo && filters.assignedTo !== 'all') {
      if (filters.assignedTo === 'unassigned') {
        query = query.is('assigned_to', null);
      } else {
        query = query.eq('assigned_to', filters.assignedTo);
      }
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTask(task: Omit<Database['public']['Tables']['tasks']['Insert'], 'created_by'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated admin found to create task.');

  const taskToInsert = {
    ...task,
    created_by: user.id,
  };

  const { data, error } = await (supabase.from('tasks') as any)
    .insert(taskToInsert)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { data, error } = await (supabase.from('tasks') as any)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}
