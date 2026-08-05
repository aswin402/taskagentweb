# AI Agent Integration Guide (Hermes Agent)

This document provides a reference on how to connect your **Hermes Agent** (or any AI agent) to the **TaskAgent** database and workflow.

---

## 🔑 Authentication & Connection

Since the website is backed by **Supabase**, the AI agent does not need to scrape the frontend HTML or automate a browser. It can connect **directly to the database** using Supabase SDKs. This ensures fast, secure, and real-time synchronization.

### Required Credentials
Provide these environment variables to the Hermes Agent:
1. `SUPABASE_URL`: `https://hqsdyvwkqowdbrnzxjek.supabase.co`
2. `SUPABASE_SERVICE_ROLE_KEY`: *(Get this secret from your Supabase Dashboard -> Project Settings -> API. It bypasses RLS and grants the agent admin-level capabilities)*.

---

## 🗄️ Database Tables Schema Reference

The agent should target these three primary tables:

### 1. `public.profiles`
Represents the employee directory.
* `id` (UUID): Reference to auth.users.
* `email` (TEXT): Employee email.
* `full_name` (TEXT): Employee full name.
* `role` (TEXT): `'admin'` or `'employee'`.
* `is_active` (BOOLEAN): Status toggle.

### 2. `public.tasks`
Stores all assigned works, appointments, and checklists.
* `id` (UUID, Primary Key)
* `title` (TEXT): Title of the task.
* `description` (TEXT): Optional guidelines.
* `category` (TEXT): `'dynamic_task'`, `'stable_work'`, or `'scheduled_task'`.
* `priority` (TEXT): `'low'`, `'medium'`, `'high'`, `'urgent'`.
* `status` (TEXT): `'active'`, `'completed'`, `'cancelled'`, `'rolled_over'`.
* `assigned_to` (UUID, Nullable): References `profiles.id` (Null means assigned to everyone).
* `due_date` (DATE, Nullable)
* `scheduled_at` (TIMESTAMP WITH TIME ZONE, Nullable)

### 3. `public.task_submissions`
Contains the daily checklist logs.
* `id` (UUID, Primary Key)
* `task_id` (UUID): References `tasks.id`.
* `employee_id` (UUID): References `profiles.id`.
* `submission_date` (DATE): Format `YYYY-MM-DD`.
* `is_completed` (BOOLEAN): Checkbox status.
* `reason` (TEXT, Nullable): Required explanation if `is_completed` is false.

---

## 💻 AI Agent Code Integration Examples

### Python SDK Integration (recommended for AI scripts)

First, install the SDK:
```bash
pip install supabase
```

#### 1. Initialize Client
```python
import os
from supabase import create_client, Client

url: str = "https://hqsdyvwkqowdbrnzxjek.supabase.co"
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)
```

#### 2. Create and Assign a New Task (AI Agent writes a task)
```python
new_task = {
    "title": "Perform server health audit",
    "description": "Ensure average response times are below 200ms",
    "category": "dynamic_task",
    "priority": "high",
    "status": "active",
    "assigned_to": "employee_user_uuid_here", # Null for 'All Employees'
    "due_date": "2026-08-06"
}

response = supabase.table("tasks").insert(new_task).execute()
print("Task Created:", response.data)
```

#### 3. Audit Today's checklist status and exceptions (AI reads progress)
```python
from datetime import date

today = str(date.today())

# Fetch submissions along with task titles
submissions = supabase.table("task_submissions") \
    .select("*, task:tasks(title)") \
    .eq("submission_date", today) \
    .execute()

for sub in submissions.data:
    task_title = sub["task"]["title"]
    status = "✅ Completed" if sub["is_completed"] else "❌ Unfinished"
    reason = f" (Reason: {sub['reason']})" if not sub["is_completed"] else ""
    print(f"Task: '{task_title}' | Status: {status}{reason}")
```

#### 4. Automated Task Rollover (AI rolls over yesterday's active tasks)
If a task was active yesterday but not marked completed, the AI agent can transition it:
```python
# Mark incomplete tasks as rolled_over
response = supabase.table("tasks") \
    .update({"status": "rolled_over"}) \
    .eq("status", "active") \
    .execute()
```
