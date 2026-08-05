# TaskAgent 📋🛡️

A modern, fast, and responsive **Task Management and Operational Accountability Dashboard** built using React, Vite, Tailwind CSS v4, and Supabase. Tailored for admins (managers & AI agents) to assign, track, and monitor daily employee tasks, stable works, and scheduled appointments, and for workers to log their progress with enforced accountability reasons for unfinished tasks.

---

## 🎨 Immersive Previews & Design
* **Role-Based Workspaces**: Automatic redirects to either the Manager Dashboard or the Employee Checklist interface.
* **Responsive Layouts**: Fully responsive interface tailored for Desktop, Tablet, and Mobile viewport grids.
* **Premium Theme Control**: Dynamic, smooth Light & Dark mode theme toggles built with Tailwind CSS variables and OKLCH color spaces.
* **Toast System**: Interactive top-right corner alert system tracking validation warnings, system successes, and error feedback.

---

## ✨ Features

### 👑 Manager & AI Portal (Admin)
* **Real-time Analytics**: High-level statistics on task completion ratios, active workforce, and live checklist progress logs.
* **Task Management (CRUD)**: Easily create, update, filter, and delete tasks categorized under *Daily Tasks*, *Stable Works*, or *Scheduled Appointments*.
* **Employee Directory (CRUD)**: Manage your team roster, edit detail cards, and toggle worker activation status.
* **Interactive CSV Reports**: Filter historical submissions by employees, dates, or task categories, and export audit trails instantly.
* **System Settings**: Trigger manual task rollovers and adjust global rules.

### 👷 Worker Workspace (Employee)
* **Personalized Checklist**: Clean list showing assigned tasks, schedules, and stable works.
* **Accountability Enforcement**: Toggling a task to *unfinished* prompts a reasons dialog, requiring the worker to record the delay context before submitting.
* **Automated Reset**: Synced checklist resets based on manager rollover actions.

---

## 🛠️ Tech Stack

* **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build System**: [Vite 8](https://vite.dev/)
* **CSS & Design**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Shadcn UI foundations
* **State Management**: [Zustand](https://docs.pmnd.rs/zustand)
* **Data Fetching**: [TanStack Query v5](https://tanstack.com/query)
* **Form Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
* **Database & Auth**: [Supabase](https://supabase.com/) (Serverless Postgres)

---

## 🚀 Getting Started

### 1. Requirements
Ensure you have [Bun](https://bun.sh/) installed:
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Environment Setup
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

### 3. Local Installation
Clone the project and install local dependencies:
```bash
bun install
```

### 4. Database Setup
Execute the SQL migrations found under the `docs/db.sql` schema folder in your **Supabase SQL Editor** to bootstrap your tables, functions, triggers, and Row Level Security policies.

### 5. Running the Application
Start the local development server:
```bash
bun run dev
```

---

## 📂 Architecture

```text
src/
├── api/             # Supabase clients and table queries
├── components/      # Common UI primitives (forms, buttons, inputs)
├── features/        # Feature domains (auth, employees, submissions, tasks)
├── layouts/         # Page shells (AdminLayout, EmployeeLayout, AuthLayout)
├── lib/             # Utility logs and constants
├── pages/           # Route viewport pages (Dashboard, Reports, checklist)
├── providers/       # Global context wrapper states (AuthProvider)
├── store/           # Zustand global state (theme toggles)
└── types/           # Type definitions and database structures
```

---

## 📜 License
MIT
