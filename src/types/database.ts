export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'employee'
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: 'admin' | 'employee'
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'employee'
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedSchema: "auth"
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          category: 'dynamic_task' | 'stable_work' | 'scheduled_task'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to: string | null
          scheduled_at: string | null
          due_date: string | null
          is_recurring: boolean
          recurrence_pattern: string | null
          status: 'active' | 'completed' | 'cancelled' | 'rolled_over'
          created_by: string
          created_at: string
          updated_at: string
          target_quantity: number | null
          unit: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: 'dynamic_task' | 'stable_work' | 'scheduled_task'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to?: string | null
          scheduled_at?: string | null
          due_date?: string | null
          is_recurring?: boolean
          recurrence_pattern?: string | null
          status?: 'active' | 'completed' | 'cancelled' | 'rolled_over'
          created_by: string
          created_at?: string
          updated_at?: string
          target_quantity?: number | null
          unit?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: 'dynamic_task' | 'stable_work' | 'scheduled_task'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          assigned_to?: string | null
          scheduled_at?: string | null
          due_date?: string | null
          is_recurring?: boolean
          recurrence_pattern?: string | null
          status?: 'active' | 'completed' | 'cancelled' | 'rolled_over'
          created_by?: string
          created_at?: string
          updated_at?: string
          target_quantity?: number | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "profiles"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedSchema: "public"
          }
        ]
      }
      task_submissions: {
        Row: {
          id: string
          task_id: string
          employee_id: string
          submission_date: string
          is_completed: boolean
          reason: string | null
          submitted_at: string
          completed_quantity: number
        }
        Insert: {
          id?: string
          task_id: string
          employee_id: string
          submission_date?: string
          is_completed: boolean
          reason?: string | null
          submitted_at?: string
          completed_quantity?: number
        }
        Update: {
          id?: string
          task_id?: string
          employee_id?: string
          submission_date?: string
          is_completed?: boolean
          reason?: string | null
          submitted_at?: string
          completed_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "task_submissions_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "profiles"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "task_submissions_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedSchema: "public"
          }
        ]
      }
      agent_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_settings_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "profiles"
            referencedSchema: "public"
          }
        ]
      }
      reminders: {
        Row: {
          id: string
          task_id: string | null
          employee_id: string | null
          reminder_time: string
          is_sent: boolean
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          task_id?: string | null
          employee_id?: string | null
          reminder_time: string
          is_sent?: boolean
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string | null
          employee_id?: string | null
          reminder_time?: string
          is_sent?: boolean
          sent_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_employee_id_fkey"
            columns: ["employee_id"]
            referencedRelation: "profiles"
            referencedSchema: "public"
          },
          {
            foreignKeyName: "reminders_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedSchema: "public"
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_create_employee_v2: {
        Args: {
          email: string
          password: string
          full_name: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
