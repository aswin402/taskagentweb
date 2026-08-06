-- Drop existing tables/types if any
DROP TABLE IF EXISTS public.task_submissions CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Create Profiles Table (Uses TEXT for role with CHECK constraint for reliability)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'employee')) DEFAULT 'employee',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Tasks Table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('dynamic_task', 'stable_work', 'scheduled_task')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'cancelled', 'rolled_over')) DEFAULT 'active',
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    due_date DATE,
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurrence_pattern TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Task Submissions Table
CREATE TABLE public.task_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_completed BOOLEAN NOT NULL,
    reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (task_id, employee_id, submission_date)
);

-- 4. RLS Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to delete an employee (removes from auth.users, cascades to profiles)
CREATE OR REPLACE FUNCTION public.admin_delete_employee(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Verify calling user is active admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Access Denied: Only active admins can remove employees.';
  END IF;

  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- RPC to create an employee directly inside auth.users (auto-confirming email)
CREATE OR REPLACE FUNCTION public.admin_create_employee(
  email TEXT,
  password TEXT,
  full_name TEXT
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
  encrypted_pw TEXT;
BEGIN
  -- Verify calling user is active admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Access Denied: Only active admins can create employees.';
  END IF;

  -- Hash the password using blowfish (standard for Supabase Auth)
  encrypted_pw := crypt(password, gen_salt('bf'));

  -- Insert user directly into auth.users (and set email_confirmed_at to now() to bypass confirmation email)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_sent_at,
    last_sign_in_at
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    email,
    encrypted_pw,
    now(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('full_name', full_name, 'role', 'employee'),
    now(),
    now(),
    '',
    '',
    now(),
    now()
  )
  RETURNING id INTO new_user_id;

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow public read-only access to profiles"
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to manage all profiles"
ON public.profiles FOR ALL TO authenticated USING (public.is_admin());

-- Tasks Policies
CREATE POLICY "Allow authenticated users to read tasks"
ON public.tasks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admins to manage all tasks"
ON public.tasks FOR ALL TO authenticated USING (public.is_admin());

-- Task Submissions Policies
CREATE POLICY "Allow users to read all submissions"
ON public.task_submissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow employees to submit/update their own submissions"
ON public.task_submissions FOR ALL TO authenticated USING (
  auth.uid() = employee_id OR public.is_admin()
);

-- 6. Trigger to automatically create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
