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
  // Save current admin session before creating the new user
  const { data: { session: adminSession } } = await supabase.auth.getSession();

  // Create user in auth.users via Supabase Auth — this triggers the
  // handle_new_user() database trigger which auto-creates the profile row
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: {
        full_name: name,
        role: 'employee',
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error('Failed to create employee account');

  // Supabase signUp auto-logs in as the new user — restore admin session
  if (adminSession) {
    await supabase.auth.setSession({
      access_token: adminSession.access_token,
      refresh_token: adminSession.refresh_token,
    });
  }

  return data.user;
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
