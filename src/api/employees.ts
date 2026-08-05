import { supabase } from './supabase';
import type { Database } from '@/types/database';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export async function getEmployees(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'employee')
    .order('full_name', { ascending: true });

  if (error) throw error;
  return (data || []) as Profile[];
}

export async function createEmployee(email: string, pass: string, name: string) {
  const { data, error } = await (supabase as any).rpc('admin_create_employee', {
    email,
    password: pass,
    full_name: name,
  });

  if (error) throw error;
  return data;
}

export async function updateEmployee(id: string, updates: Partial<Profile>) {
  const { data, error } = await (supabase.from('profiles') as any)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deactivateEmployee(id: string) {
  return updateEmployee(id, { is_active: false });
}

export async function deleteEmployee(id: string) {
  const { error } = await (supabase as any).rpc('admin_delete_employee', {
    target_user_id: id,
  });
  if (error) {
    // Fallback: delete from profiles table directly if RPC is not created yet
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', id);
    if (profileError) throw profileError;
  }
}
