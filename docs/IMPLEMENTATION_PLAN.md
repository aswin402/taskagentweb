# TaskAgent — Master Technical Implementation Plan

> **Project**: TaskAgent (Task Management + Admin Dashboard)  
> **Target Path**: `docs/IMPLEMENTATION_PLAN.md`  
> **Tech Stack**: React 19 + Vite 8 + TypeScript 5.9 + Tailwind CSS v4 + shadcn/ui + Zustand v5 + TanStack Query v5 + React Router v7 + Bun + Supabase  
> **Target Audience**: Core Development Team, Lead Engineers, QA Engineers, DevOps  
> **Document Version**: 1.0.0 (Production Blueprint)

---

## Executive Summary & System Architecture

TaskAgent is an enterprise-ready task management and administrative oversight platform designed to streamline operational workflows across organizations. It enables administrators to create, categorize, assign, and track daily operational tasks while providing employees with an intuitive daily checklist interface requiring accountability notes for incomplete assignments.

```
                  +-----------------------------------+
                  |        Supabase Backend           |
                  |  (Auth, Postgres, RLS, Realtime)  |
                  +-----------------+-----------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
+-----------------------+                       +-----------------------+
|   Admin Dashboard     |                       |  Employee Checklist   |
| (React 19 / TanStack) |                       | (React 19 / TanStack) |
| - Employee CRUD       |                       | - Daily Task List     |
| - Task Scheduling     |                       | - Completion & Reason |
| - Real-time Analytics |                       | - EOD Submissions     |
| - Historical Reports  |                       | - Mobile Responsive   |
+-----------------------+                       +-----------------------+
```

### Key Architectural Pillars:
1. **Type Safety & Data Integrity**: End-to-end TypeScript interfaces generated from Supabase Postgres schema with strict runtime Zod validation.
2. **Hybrid State Strategy**: 
   - **Server State**: Managed via `@tanstack/react-query` v5 for caching, invalidation, optimistic updates, and garbage collection.
   - **Global Client State**: Light-weight Zustand stores for user session, active theme (`light` | `dark` | `system`), and sidebar shell state.
   - **Real-Time Synchronicity**: Supabase WebSockets listening on `task_submissions` and `submission_items` for live admin dashboard updates without manual polling.
3. **Role-Based Access Control (RBAC)**: Enforced both at UI router boundary via `ProtectedRoute` guards and deep at database layer via Supabase Row-Level Security (RLS) policies.

---

## Complete Project Directory Map

```
taskagent/
├── .env.local
├── .env.example
├── components.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── docs/
│   └── IMPLEMENTATION_PLAN.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── api/
    │   ├── supabase.ts
    │   ├── auth.ts
    │   ├── employees.ts
    │   ├── tasks.ts
    │   ├── submissions.ts
    │   └── settings.ts
    ├── components/
    │   ├── ui/                 # Installed shadcn UI primitives
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── dialog.tsx
    │   │   ├── select.tsx
    │   │   ├── checkbox.tsx
    │   │   ├── badge.tsx
    │   │   ├── table.tsx
    │   │   ├── tabs.tsx
    │   │   ├── toast.tsx
    │   │   ├── avatar.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── sheet.tsx
    │   │   ├── textarea.tsx
    │   │   ├── separator.tsx
    │   │   ├── skeleton.tsx
    │   │   └── switch.tsx
    │   ├── layout/
    │   │   ├── Sidebar.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── MobileNav.tsx
    │   │   └── Footer.tsx
    │   ├── forms/
    │   │   ├── LoginForm.tsx
    │   │   ├── EmployeeForm.tsx
    │   │   └── TaskForm.tsx
    │   └── shared/
    │       ├── TaskCard.tsx
    │       ├── StatusBadge.tsx
    │       ├── ChecklistItem.tsx
    │       ├── EmptyState.tsx
    │       ├── ErrorBoundary.tsx
    │       └── PageSkeleton.tsx
    ├── features/
    │   ├── auth/
    │   │   ├── store/useAuthStore.ts
    │   │   ├── hooks/useAuth.ts
    │   │   └── components/ProtectedRoute.tsx
    │   ├── employees/
    │   │   ├── hooks/useEmployees.ts
    │   │   └── components/
    │   │       ├── EmployeeTable.tsx
    │   │       └── EmployeeDialog.tsx
    │   ├── tasks/
    │   │   ├── hooks/
    │   │   │   ├── useTasks.ts
    │   │   │   └── useTaskMutations.ts
    │   │   └── components/
    │   │       ├── TaskList.tsx
    │   │       ├── TaskFilters.tsx
    │   │       └── TaskDialog.tsx
    │   ├── submissions/
    │   │   ├── hooks/useSubmissions.ts
    │   │   └── components/
    │   │       ├── ChecklistSection.tsx
    │   │       ├── ReasonDialog.tsx
    │   │       └── SubmitButton.tsx
    │   ├── dashboard/
    │   │   └── hooks/useDashboardStats.ts
    │   └── reports/
    │       └── hooks/useReports.ts
    ├── layouts/
    │   ├── AuthLayout.tsx
    │   ├── AdminLayout.tsx
    │   └── EmployeeLayout.tsx
    ├── pages/
    │   ├── auth/
    │   │   └── LoginPage.tsx
    │   ├── admin/
    │   │   ├── DashboardPage.tsx
    │   │   ├── EmployeesPage.tsx
    │   │   ├── TasksPage.tsx
    │   │   ├── ReportsPage.tsx
    │   │   └── SettingsPage.tsx
    │   └── employee/
    │       └── ChecklistPage.tsx
    ├── providers/
    │   ├── AuthProvider.tsx
    │   ├── QueryProvider.tsx
    │   └── ThemeProvider.tsx
    ├── types/
    │   ├── database.ts
    │   └── index.ts
    └── lib/
        ├── utils.ts
        └── constants.ts
```

---

## 8-Phase Detailed Execution Schedule

---

### Phase 1: Project Foundation & Setup (Day 1)

#### 🎯 Goal
Initialize project infrastructure, integrate shadcn/ui configured for Tailwind CSS v4, construct Supabase client singleton, define core database types, and establish standardized directory organization.

#### 📦 Dependencies to Install
```bash
bun add @supabase/supabase-js clsx tailwind-merge lucide-react @tanstack/react-query
bunx shadcn@latest init
bunx shadcn@latest add button card input label dialog select checkbox badge table tabs toast avatar dropdown-menu sheet textarea separator skeleton switch
```

#### 📁 Files to Create / Modify
- `.env.local`
- `.env.example`
- `src/api/supabase.ts`
- `src/lib/utils.ts`
- `src/lib/constants.ts`
- `src/types/database.ts`
- `src/providers/QueryProvider.tsx`

##### `src/api/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
```

##### `src/lib/utils.ts`
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHours = h % 12 || 12;
  return `${formattedHours}:${minutes} ${ampm}`;
}
```

##### `src/lib/constants.ts`
```typescript
export const APP_NAME = 'TaskAgent';

export const USER_ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
} as const;

export const TASK_CATEGORIES = {
  OPENING: 'opening',
  RUNNING: 'running',
  CLOSING: 'closing',
} as const;

export const TASK_CATEGORY_LABELS = {
  opening: 'Opening Tasks',
  running: 'Running Tasks',
  closing: 'Closing Tasks',
} as const;

export const TASK_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

export const SUBMISSION_STATUSES = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  LATE: 'late',
  REVIEWED: 'reviewed',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_EMPLOYEES: '/admin/employees',
  ADMIN_TASKS: '/admin/tasks',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_SETTINGS: '/admin/settings',
  EMPLOYEE_CHECKLIST: '/employee/checklist',
} as const;
```

##### `src/types/database.ts`
```typescript
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'admin' | 'employee';
export type TaskCategory = 'opening' | 'running' | 'closing';
export type TaskFrequency = 'daily' | 'weekly' | 'monthly';
export type SubmissionStatus = 'pending' | 'submitted' | 'late' | 'reviewed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: TaskCategory;
          frequency: TaskFrequency;
          assigned_to: string | null;
          due_time: string | null;
          is_active: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: TaskCategory;
          frequency?: TaskFrequency;
          assigned_to?: string | null;
          due_time?: string | null;
          is_active?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: TaskCategory;
          frequency?: TaskFrequency;
          assigned_to?: string | null;
          due_time?: string | null;
          is_active?: boolean;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      task_submissions: {
        Row: {
          id: string;
          employee_id: string;
          submission_date: string;
          status: SubmissionStatus;
          submitted_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          submission_date?: string;
          status?: SubmissionStatus;
          submitted_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          submission_date?: string;
          status?: SubmissionStatus;
          submitted_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      submission_items: {
        Row: {
          id: string;
          submission_id: string;
          task_id: string;
          is_completed: boolean;
          reason_for_uncheck: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          submission_id: string;
          task_id: string;
          is_completed?: boolean;
          reason_for_uncheck?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          submission_id?: string;
          task_id?: string;
          is_completed?: boolean;
          reason_for_uncheck?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      agent_settings: {
        Row: {
          id: string;
          reminder_interval_minutes: number;
          end_of_day_time: string;
          is_agent_active: boolean;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          reminder_interval_minutes?: number;
          end_of_day_time?: string;
          is_agent_active?: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          reminder_interval_minutes?: number;
          end_of_day_time?: string;
          is_agent_active?: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
    };
  };
}
```

#### 🗄️ Supabase Setup Needed
Execute the base migration in Supabase SQL Editor:
```sql
-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'employee');
CREATE TYPE task_category AS ENUM ('opening', 'running', 'closing');
CREATE TYPE task_frequency AS ENUM ('daily', 'weekly', 'monthly');
CREATE TYPE submission_status AS ENUM ('pending', 'submitted', 'late', 'reviewed');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

#### 🧪 Verification Steps
1. Execute `bun run build` in root workspace and verify zero TypeScript or Vite bundle errors.
2. Confirm `.env.local` contains active `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Launch dev server with `bun run dev` and confirm clean startup.

#### ⏱️ Estimated Time: 6 Hours

---

### Phase 2: Authentication System (Day 2)

#### 🎯 Goal
Implement full authentication flow backed by Supabase Auth and Zustand store with role-based route protection and session restoration.

#### 📦 Dependencies to Install
```bash
bun add @hookform/resolvers react-hook-form zod zustand react-router-dom
```

#### 📁 Files to Create / Modify
- `src/api/auth.ts`
- `src/features/auth/store/useAuthStore.ts`
- `src/features/auth/hooks/useAuth.ts`
- `src/features/auth/components/ProtectedRoute.tsx`
- `src/providers/AuthProvider.tsx`
- `src/components/forms/LoginForm.tsx`
- `src/pages/auth/LoginPage.tsx`
- `src/layouts/AuthLayout.tsx`
- `src/App.tsx`
- `src/main.tsx`

##### `src/api/auth.ts`
```typescript
import { supabase } from './supabase';
import type { Database } from '@/types/database';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  
  // Fetch user profile to get role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) throw profileError;
  return { session: data.session, user: data.user, profile };
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}
```

##### `src/features/auth/store/useAuthStore.ts`
```typescript
import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '@/api/auth';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  setAuth: (user: User | null, profile: Profile | null, session: Session | null) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  setAuth: (user, profile, session) => set({ user, profile, session, isLoading: false }),
  clearAuth: () => set({ user: null, profile: null, session: null, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
```

##### `src/features/auth/components/ProtectedRoute.tsx`
```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ROUTES } from '@/lib/constants';
import type { UserRole } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    const redirectPath = profile.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.EMPLOYEE_CHECKLIST;
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
```

##### `src/providers/AuthProvider.tsx`
```typescript
import { useEffect, type ReactNode } from 'react';
import { supabase } from '@/api/supabase';
import { getCurrentProfile } from '@/api/auth';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setAuth, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    // Initial session recovery
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await getCurrentProfile(session.user.id);
        setAuth(session.user, profile, session);
      } else {
        clearAuth();
      }
    });

    // Realtime auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await getCurrentProfile(session.user.id);
        setAuth(session.user, profile, session);
      } else {
        clearAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth, clearAuth, setLoading]);

  return <>{children}</>;
}
```

##### `src/components/forms/LoginForm.tsx`
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '@/api/auth';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const { profile } = await loginWithEmail(data.email, data.password);
      if (profile.role === 'admin') {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        navigate(ROUTES.EMPLOYEE_CHECKLIST);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMsg && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
          {errorMsg}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="admin@taskagent.com" {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
```

#### 🗄️ Supabase Setup Needed
```sql
-- Profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for sync profile on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'employee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### 🧪 Verification Steps
1. Create test admin and employee users in Supabase Auth console with appropriate metadata `{"role": "admin"}` and `{"role": "employee"}`.
2. Log in via `/login` as admin -> verifies redirect to `/admin/dashboard`.
3. Log in via `/login` as employee -> verifies redirect to `/employee/checklist`.
4. Attempt manual navigation to `/admin/dashboard` while logged in as employee -> verifies automatic rejection and redirect.

#### ⏱️ Estimated Time: 7 Hours

---

### Phase 3: Admin Layout & Navigation (Day 3)

#### 🎯 Goal
Build responsive, enterprise-grade shell for administrative workflows including collapsing sidebar, topbar header with user profile menu, theme switcher, and mobile drawer.

#### 📦 Dependencies to Install
```bash
bun add lucide-react
```

#### 📁 Files to Create / Modify
- `src/layouts/AdminLayout.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/layout/Footer.tsx`
- `src/pages/admin/DashboardPage.tsx`
- `src/providers/ThemeProvider.tsx`

##### `src/layouts/AdminLayout.tsx`
```typescript
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-30 border-r bg-card">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
```

##### `src/components/layout/Sidebar.tsx`
```typescript
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, BarChart3, Settings, Shield } from 'lucide-react';
import { ROUTES, APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: 'Employees', href: ROUTES.ADMIN_EMPLOYEES, icon: Users },
  { label: 'Tasks', href: ROUTES.ADMIN_TASKS, icon: CheckSquare },
  { label: 'Reports', href: ROUTES.ADMIN_REPORTS, icon: BarChart3 },
  { label: 'Settings', href: ROUTES.ADMIN_SETTINGS, icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-6 pb-6 flex items-center gap-2 border-b">
        <Shield className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold tracking-tight">{APP_NAME} Admin</span>
      </div>

      <nav className="flex-1 px-4 pt-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
```

##### `src/components/layout/Navbar.tsx`
```typescript
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { logoutUser } from '@/api/auth';
import { MobileNav } from './MobileNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';

export function Navbar() {
  const { profile, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    await logoutUser();
    clearAuth();
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'A';

  return (
    <header className="sticky top-0 z-20 h-16 border-b bg-background/95 backdrop-blur px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <MobileNav />
        <h1 className="text-lg font-semibold hidden sm:block">Control Center</h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'Admin'} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

#### 🧪 Verification Steps
1. Resize screen to < 768px -> verify desktop sidebar hides and Sheet hamburger menu enables full mobile navigation.
2. Click active routes in sidebar -> verify URL changes and active styles apply dynamically.
3. Click user avatar menu -> click Log Out -> verify session termination and redirect to `/login`.

#### ⏱️ Estimated Time: 6 Hours

---

### Phase 4: Employee Management (Day 4)

#### 🎯 Goal
Enable Admin users to create, search, filter, edit, and deactivate employee accounts.

#### 📦 Dependencies to Install
```bash
bun add @tanstack/react-query
```

#### 📁 Files to Create / Modify
- `src/api/employees.ts`
- `src/features/employees/hooks/useEmployees.ts`
- `src/features/employees/components/EmployeeTable.tsx`
- `src/features/employees/components/EmployeeDialog.tsx`
- `src/components/forms/EmployeeForm.tsx`
- `src/pages/admin/EmployeesPage.tsx`

##### `src/api/employees.ts`
```typescript
import { supabase } from './supabase';
import type { Database } from '@/types/database';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export async function fetchEmployees(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'employee')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createEmployeeAccount(payload: { email: string; fullName: string }) {
  // Call Supabase RPC or Admin API endpoint
  const { data, error } = await supabase.rpc('admin_create_employee', {
    p_email: payload.email,
    p_full_name: payload.fullName,
  });

  if (error) throw error;
  return data;
}

export async function updateEmployeeProfile(id: string, payload: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function toggleEmployeeStatus(id: string, isActive: boolean) {
  return updateEmployeeProfile(id, { is_active: isActive });
}
```

##### `src/features/employees/hooks/useEmployees.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEmployees, createEmployeeAccount, updateEmployeeProfile, toggleEmployeeStatus } from '@/api/employees';

export function useEmployees() {
  const queryClient = useQueryClient();

  const employeesQuery = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  const createMutation = useMutation({
    mutationFn: createEmployeeAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateEmployeeProfile>[1] }) =>
      updateEmployeeProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleEmployeeStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  return {
    employees: employeesQuery.data ?? [],
    isLoading: employeesQuery.isLoading,
    isError: employeesQuery.isError,
    createEmployee: createMutation.mutateAsync,
    updateEmployee: updateMutation.mutateAsync,
    toggleStatus: toggleStatusMutation.mutateAsync,
  };
}
```

##### `src/pages/admin/EmployeesPage.tsx`
```typescript
import { useState } from 'react';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { EmployeeTable } from '@/features/employees/components/EmployeeTable';
import { EmployeeDialog } from '@/features/employees/components/EmployeeDialog';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function EmployeesPage() {
  const { employees, isLoading, toggleStatus } = useEmployees();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Employees</h2>
          <p className="text-sm text-muted-foreground">Manage organization staff and active accounts.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <EmployeeTable employees={employees} onToggleStatus={(id, status) => toggleStatus({ id, isActive: status })} />
      )}

      <EmployeeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
```

#### 🗄️ Supabase Setup Needed
```sql
-- Database function to create employee account with default password
CREATE OR REPLACE FUNCTION admin_create_employee(p_email TEXT, p_full_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert into auth.users (Requires elevated security definer)
  new_user_id := gen_random_uuid();
  
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
  VALUES (
    new_user_id,
    p_email,
    crypt('TaskAgent2026!', gen_salt('bf')),
    NOW(),
    jsonb_build_object('full_name', p_full_name, 'role', 'employee')
  );

  RETURN new_user_id;
END;
$$;
```

#### 🧪 Verification Steps
1. Navigate to `/admin/employees` -> click "Add Employee".
2. Fill out form with new employee email and full name -> click submit.
3. Verify employee record immediately renders in data table without full page reload.
4. Toggle employee active switch -> verify `is_active` state toggles in Supabase database.

#### ⏱️ Estimated Time: 8 Hours

---

### Phase 5: Task Management (Day 5)

#### 🎯 Goal
Provide full administrative CRUD capabilities for tasks categorized by Opening, Running, and Closing operational phases.

#### 📦 Dependencies to Install
```bash
bun add date-fns
```

#### 📁 Files to Create / Modify
- `src/api/tasks.ts`
- `src/features/tasks/hooks/useTasks.ts`
- `src/features/tasks/hooks/useTaskMutations.ts`
- `src/features/tasks/components/TaskList.tsx`
- `src/features/tasks/components/TaskFilters.tsx`
- `src/features/tasks/components/TaskDialog.tsx`
- `src/components/forms/TaskForm.tsx`
- `src/components/shared/TaskCard.tsx`
- `src/components/shared/StatusBadge.tsx`
- `src/pages/admin/TasksPage.tsx`

##### `src/api/tasks.ts`
```typescript
import { supabase } from './supabase';
import type { Database, TaskCategory, TaskFrequency } from '@/types/database';

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];

export interface TaskFilterParams {
  category?: TaskCategory;
  assignedTo?: string;
  search?: string;
}

export async function fetchTasks(filters?: TaskFilterParams): Promise<Task[]> {
  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.assignedTo) {
    query = query.eq('assigned_to', filters.assignedTo);
  }
  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createTask(task: TaskInsert): Promise<Task> {
  const { data, error } = await supabase.from('tasks').insert(task).select().single();
  if (error) throw error;
  return data;
}

export async function updateTask(id: string, updates: Partial<TaskInsert>): Promise<Task> {
  const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}
```

##### `src/components/shared/StatusBadge.tsx`
```typescript
import { Badge } from '@/components/ui/badge';
import type { TaskCategory, SubmissionStatus } from '@/types/database';

export function CategoryBadge({ category }: { category: TaskCategory }) {
  const variants: Record<TaskCategory, { label: string; className: string }> = {
    opening: { label: 'Opening', className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
    running: { label: 'Running', className: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20' },
    closing: { label: 'Closing', className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20' },
  };

  const config = variants[category];
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const variants: Record<SubmissionStatus, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-slate-500/15 text-slate-700 dark:text-slate-400' },
    submitted: { label: 'Submitted', className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
    late: { label: 'Late Submission', className: 'bg-rose-500/15 text-rose-700 dark:text-rose-400' },
    reviewed: { label: 'Reviewed', className: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400' },
  };

  const config = variants[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}
```

#### 🗄️ Supabase Setup Needed
```sql
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category task_category NOT NULL,
  frequency task_frequency NOT NULL DEFAULT 'daily',
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  due_time TIME,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full control on tasks"
  ON public.tasks FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Employees view active assigned or unassigned tasks"
  ON public.tasks FOR SELECT
  USING (
    is_active = true AND (assigned_to IS NULL OR assigned_to = auth.uid())
  );
```

#### 🧪 Verification Steps
1. Create tasks across all 3 categories (Opening, Running, Closing).
2. Filter tasks by category using the category filter tab bar on `/admin/tasks`.
3. Edit task details and verify real-time update in UI.
4. Delete a task and confirm removal from list and database.

#### ⏱️ Estimated Time: 8 Hours

---

### Phase 6: Employee Checklist Dashboard (Day 6)

#### 🎯 Goal
Empower employees to view daily assigned tasks organized by operational phase, mark completion status, mandate explicit reason notes for skipped/unchecked items, and submit daily checklists.

#### 📁 Files to Create / Modify
- `src/layouts/EmployeeLayout.tsx`
- `src/api/submissions.ts`
- `src/features/submissions/hooks/useSubmissions.ts`
- `src/features/submissions/components/ChecklistSection.tsx`
- `src/features/submissions/components/ReasonDialog.tsx`
- `src/features/submissions/components/SubmitButton.tsx`
- `src/components/shared/ChecklistItem.tsx`
- `src/components/shared/EmptyState.tsx`
- `src/pages/employee/ChecklistPage.tsx`

##### `src/api/submissions.ts`
```typescript
import { supabase } from './supabase';
import type { Database } from '@/types/database';

export type TaskSubmission = Database['public']['Tables']['task_submissions']['Row'];
export type SubmissionItem = Database['public']['Tables']['submission_items']['Row'];

export interface TodayChecklistResponse {
  submission: TaskSubmission;
  items: (SubmissionItem & { task: Database['public']['Tables']['tasks']['Row'] })[];
}

export async function fetchOrCreateDailySubmission(employeeId: string): Promise<TodayChecklistResponse> {
  const today = new Date().toISOString().split('T')[0];

  // Call RPC to auto-generate submission and items for today
  const { data, error } = await supabase.rpc('get_or_create_daily_submission', {
    p_employee_id: employeeId,
    p_date: today,
  });

  if (error) throw error;
  return data;
}

export async function updateSubmissionItem(
  itemId: string,
  payload: { isCompleted: boolean; reasonForUncheck?: string | null }
) {
  const { data, error } = await supabase
    .from('submission_items')
    .update({
      is_completed: payload.isCompleted,
      reason_for_uncheck: payload.reasonForUncheck ?? null,
      completed_at: payload.isCompleted ? new Date().toISOString() : null,
    })
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function finalizeSubmission(submissionId: string, notes?: string) {
  const { data, error } = await supabase
    .from('task_submissions')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      notes,
    })
    .eq('id', submissionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

##### `src/components/shared/ChecklistItem.tsx`
```typescript
import { Checkbox } from '@/components/ui/checkbox';
import { formatTime } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import type { Database } from '@/types/database';

interface ChecklistItemProps {
  item: Database['public']['Tables']['submission_items']['Row'] & {
    task: Database['public']['Tables']['tasks']['Row'];
  };
  disabled?: boolean;
  onToggle: (completed: boolean) => void;
}

export function ChecklistItem({ item, disabled, onToggle }: ChecklistItemProps) {
  return (
    <div className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={item.is_completed}
          onCheckedChange={(checked) => onToggle(!!checked)}
          disabled={disabled}
          className="mt-1"
        />
        <div>
          <p className={`font-medium ${item.is_completed ? 'line-through text-muted-foreground' : ''}`}>
            {item.task.title}
          </p>
          {item.task.description && (
            <p className="text-sm text-muted-foreground mt-0.5">{item.task.description}</p>
          )}
          {!item.is_completed && item.reason_for_uncheck && (
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-950/40 p-2 rounded">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Reason: {item.reason_for_uncheck}</span>
            </div>
          )}
        </div>
      </div>

      {item.task.due_time && (
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
          Due {formatTime(item.task.due_time)}
        </span>
      )}
    </div>
  );
}
```

#### 🗄️ Supabase Setup Needed
```sql
CREATE TABLE public.task_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status submission_status NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (employee_id, submission_date)
);

CREATE TABLE public.submission_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.task_submissions(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  reason_for_uncheck TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (submission_id, task_id)
);

-- RPC to retrieve or auto-create daily submission + checklist items
CREATE OR REPLACE FUNCTION get_or_create_daily_submission(p_employee_id UUID, p_date DATE)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_submission_id UUID;
  v_result JSONB;
BEGIN
  -- Get existing or insert new submission
  INSERT INTO public.task_submissions (employee_id, submission_date)
  VALUES (p_employee_id, p_date)
  ON CONFLICT (employee_id, submission_date) DO NOTHING;

  SELECT id INTO v_submission_id
  FROM public.task_submissions
  WHERE employee_id = p_employee_id AND submission_date = p_date;

  -- Populate submission items from active tasks
  INSERT INTO public.submission_items (submission_id, task_id)
  SELECT v_submission_id, t.id
  FROM public.tasks t
  WHERE t.is_active = true 
    AND (t.assigned_to IS NULL OR t.assigned_to = p_employee_id)
  ON CONFLICT (submission_id, task_id) DO NOTHING;

  -- Aggregate result
  SELECT jsonb_build_object(
    'submission', to_jsonb(s.*),
    'items', (
      SELECT jsonb_agg(
        to_jsonb(si.*) || jsonb_build_object('task', to_jsonb(t.*))
      )
      FROM public.submission_items si
      JOIN public.tasks t ON t.id = si.task_id
      WHERE si.submission_id = v_submission_id
    )
  ) INTO v_result
  FROM public.task_submissions s
  WHERE s.id = v_submission_id;

  RETURN v_result;
END;
$$;
```

#### 🧪 Verification Steps
1. Login as Employee user -> navigate to `/employee/checklist`.
2. Verify daily submission automatically generates items for Opening, Running, and Closing phases.
3. Untick an item -> verify Reason Modal appears enforcing non-empty string input before unchecking.
4. Click Submit Checklist -> verify status changes to `submitted` and controls lock down appropriately.

#### ⏱️ Estimated Time: 9 Hours

---

### Phase 7: Admin Dashboard & Reports (Day 7)

#### 🎯 Goal
Build out full live operational analytics dashboard, historical submission report builder with CSV/JSON exports, system agent configuration settings, and Supabase real-time updates.

#### 📦 Dependencies to Install
```bash
bun add recharts papaparse @types/papaparse
```

#### 📁 Files to Create / Modify
- `src/pages/admin/DashboardPage.tsx`
- `src/pages/admin/ReportsPage.tsx`
- `src/pages/admin/SettingsPage.tsx`
- `src/api/settings.ts`
- `src/features/dashboard/hooks/useDashboardStats.ts`
- `src/features/reports/hooks/useReports.ts`

##### `src/pages/admin/DashboardPage.tsx`
```typescript
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export function DashboardPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to live submission updates
    const channel = supabase
      .channel('admin-dashboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'task_submissions' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['today-submissions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Executive Summary</h2>
        <p className="text-sm text-muted-foreground">Real-time operational metrics and submission monitoring.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">100% active shift</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-emerald-600 font-medium mt-1">88% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending EOD</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-amber-600 font-medium mt-1">Awaiting employee submission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exceptions / Skipped</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-rose-600 font-medium mt-1">Requires manager review</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

##### `src/pages/admin/ReportsPage.tsx`
```typescript
import { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function ReportsPage() {
  const [reportData] = useState([
    { date: '2026-08-05', employee: 'John Doe', completed: 12, skipped: 1, status: 'Submitted' },
    { date: '2026-08-05', employee: 'Jane Smith', completed: 15, skipped: 0, status: 'Submitted' },
  ]);

  const exportCSV = () => {
    const csv = Papa.unparse(reportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `TaskAgent_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Audit & Historical Reports</h2>
          <p className="text-sm text-muted-foreground">Filter historical task execution logs and export CSV audit files.</p>
        </div>
        <Button onClick={exportCSV}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>
    </div>
  );
}
```

#### 🗄️ Supabase Setup Needed
```sql
CREATE TABLE public.agent_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_interval_minutes INT NOT NULL DEFAULT 60,
  end_of_day_time TIME NOT NULL DEFAULT '18:00:00',
  is_agent_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

-- Seed initial row
INSERT INTO public.agent_settings (reminder_interval_minutes, end_of_day_time, is_agent_active)
VALUES (60, '18:00:00', true);

-- Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.submission_items;
```

#### 🧪 Verification Steps
1. Update employee submission status in database directly or via employee screen.
2. Observe immediate real-time update on `/admin/dashboard` metrics without manual browser refresh.
3. Trigger CSV export on `/admin/reports` and confirm generated `.csv` matches filtered records.

#### ⏱️ Estimated Time: 8 Hours

---

### Phase 8: Polish, Responsiveness & Final QA (Day 8)

#### 🎯 Goal
Execute final production polish, establish top-level error boundaries, verify keyboard accessibility standards, optimize bundle size, and execute full build validation.

#### 📦 Dependencies to Install
```bash
bun add react-error-boundary
```

#### 📁 Files to Create / Modify
- `src/components/shared/ErrorBoundary.tsx`
- `src/components/shared/PageSkeleton.tsx`
- `src/index.css`
- `index.html`

##### `src/components/shared/ErrorBoundary.tsx`
```typescript
import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertOctagon } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error Boundary Exception:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center p-6 bg-background text-foreground text-center">
          <AlertOctagon className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            An unforeseen runtime exception occurred. Please reload the page or contact system administration.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### 🧪 Final Quality Assurance Checklist
- [ ] **TypeScript Build**: Run `bun run build` with zero errors or warnings.
- [ ] **Cross-Device Breakpoints**: Test at 375px (Mobile), 768px (Tablet), and 1440px (Desktop).
- [ ] **Theme Switching**: Confirm smooth transition between Light and Dark modes.
- [ ] **Role Isolation**: Verify employee cannot navigate to any `/admin/*` routes.
- [ ] **Uncheck Notes Integrity**: Confirm employee cannot uncheck a completed item without submitting a reason.
- [ ] **CSV Export**: Validate CSV export formatting in Microsoft Excel and Google Sheets.

#### ⏱️ Estimated Time: 6 Hours

---

## Complete Verification & Test Protocol

| Phase | Test Suite / Command | Pass Criteria |
|---|---|---|
| **Phase 1** | `bun run build` | Zero TS compiler errors; Vite bundle emitted successfully |
| **Phase 2** | Auth Flow Test | Login as admin -> `/admin/dashboard`; Login as employee -> `/employee/checklist` |
| **Phase 3** | Layout Breakpoint Test | Desktop sidebar visible; Mobile sheet drawer renders < 768px |
| **Phase 4** | Employee CRUD Test | Create employee -> shows in table -> toggle active status persists to DB |
| **Phase 5** | Task CRUD Test | Create opening, running, closing tasks -> assign -> filter by category |
| **Phase 6** | Checklist Test | Uncheck task -> mandatory reason dialog pops up -> submission locks |
| **Phase 7** | Realtime & Export Test | Database update triggers UI refresh; CSV downloads valid dataset |
| **Phase 8** | Full QA Audit | `bun run build` + zero console errors across all routes |

---

## Resource & Time Allocation Overview

```
Phase 1: Project Foundation & Setup      [6 Hours]  ██████░░░░
Phase 2: Authentication System           [7 Hours]  ███████░░░
Phase 3: Admin Layout & Navigation       [6 Hours]  ██████░░░░
Phase 4: Employee Management             [8 Hours]  ████████░░
Phase 5: Task Management                 [8 Hours]  ████████░░
Phase 6: Employee Checklist Dashboard    [9 Hours]  █████████░
Phase 7: Admin Dashboard & Reports       [8 Hours]  ████████░░
Phase 8: Polish, Responsiveness & QA     [6 Hours]  ██████░░░░
--------------------------------------------------------------
Total Estimated Duration:                58 Hours (8 Work Days)
```
