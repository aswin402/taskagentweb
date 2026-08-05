# TaskAgent — Project Implementation Roadmap & Task Tracker

> **Project Overview**: TaskAgent is an enterprise-grade task management platform and admin dashboard designed for daily employee task tracking, automated task rollover, role-based workflows, and AI agent integration.

---

## 📊 Progress Summary

| Phase / Module | Status | Total Items | Completed | Progress |
| :--- | :---: | :---: | :---: | :---: |
| **Phase 1: Foundation & Setup** | 🟢 Completed | 10 | 10 | `[██████████]` 100% |
| **Phase 2: Authentication** | 🟢 Completed | 11 | 11 | `[██████████]` 100% |
| **Phase 3: Admin Layout & Navigation** | 🟢 Completed | 8 | 8 | `[██████████]` 100% |
| **Phase 4: Employee Management** | 🟢 Completed | 9 | 9 | `[██████████]` 100% |
| **Phase 5: Task Management** | 🟢 Completed | 16 | 16 | `[██████████]` 100% |
| **Phase 6: Employee Checklist** | ⚪ Not Started | 13 | 0 | `[░░░░░░░░░░]` 0% |
| **Phase 7: Dashboard & Reports** | ⚪ Not Started | 12 | 0 | `[░░░░░░░░░░]` 0% |
| **Phase 8: Polish & QA** | ⚪ Not Started | 11 | 0 | `[░░░░░░░░░░]` 0% |
| **Supabase Setup** | ⚪ Not Started | 13 | 0 | `[░░░░░░░░░░]` 0% |
| **AI Agent Integration** | ⚪ Not Started | 6 | 0 | `[░░░░░░░░░░]` 0% |
| **TOTAL** | **🟡 In Progress** | **109** | **54** | **`[█████░░░░░]` 49%** |

---

## 🚀 Detailed Implementation Tasks

### Phase 1: Foundation & Setup
- [x] **Install shadcn/ui (`bunx shadcn@latest init`)**
  - Initialize shadcn/ui component library configured for Vite + React 19 + Tailwind CSS v4.
  - Set up `components.json` with base path `@/components` and utility path `@/lib/utils`.
- [x] **Install @supabase/supabase-js**
  - Execute `bun add @supabase/supabase-js` to install the official Supabase JavaScript/TypeScript client library.
- [x] **Create .env.local with Supabase credentials**
  - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for client-side queries.
  - Add `SUPABASE_SERVICE_ROLE_KEY` for administrative/agent tasks (server/script usage).
- [x] **Create src/api/supabase.ts (client init)**
  - Instantiate and export single `@supabase/supabase-js` client bound to TypeScript database schema types.
- [x] **Create src/lib/utils.ts (cn helper)**
  - Implement and export `cn(...inputs: ClassValue[])` helper combining `clsx` and `tailwind-merge`.
- [x] **Create src/lib/constants.ts**
  - Store application-wide constants: task categories (`dynamic`, `stable`, `scheduled`), roles (`admin`, `employee`), default cutoff times, and query keys.
- [x] **Create src/types/database.ts (DB types)**
  - Export full Supabase TypeScript database schema definitions representing tables (`profiles`, `tasks`, `task_submissions`, `agent_settings`, `reminders`).
- [x] **Set up folder structure (api, features, layouts, components subdirs)**
  - Organize `src/` into structured modular directories: `api`, `features`, `layouts`, `components`, `hooks`, `store`, and `types`.
- [x] **Install shadcn components: Button, Card, Input, Label, Dialog, Select, Checkbox, Badge, Table, Tabs, Toast/Sonner, Avatar, DropdownMenu, Sheet, Textarea, Separator, Skeleton, Switch, Calendar, Popover**
  - Run CLI command to install all mandatory shadcn primitives into `src/components/ui/`.
- [x] **Verify build passes**
  - Run `bun run build` and `bun run lint` to guarantee clean setup without compile errors or missing dependencies.

---

### Phase 2: Authentication
- [x] **Create src/api/auth.ts**
  - Implement Supabase Auth methods: `signInWithPassword`, `signOut`, `getSession`, `getCurrentUser`, and `onAuthStateChange`.
- [x] **Create useAuthStore (Zustand)**
  - Build persistent Zustand store for session state, active user profile, user role, and loading state.
- [x] **Create useAuth hook**
  - React hook exposing `login`, `logout`, `user`, `role`, `isAdmin`, `isEmployee`, and state revalidation helpers.
- [x] **Create ProtectedRoute component**
  - Route wrapper verifying authentication and role authorization (`requiredRole`), redirecting unauthenticated users to `/login`.
- [x] **Create AuthProvider**
  - Top-level context listener that initializes Supabase auth session on mount and handles token refresh events.
- [x] **Create LoginForm with Zod validation**
  - Build validated form using `react-hook-form` and `zod` for email/password validation with error feedback.
- [x] **Create LoginPage**
  - Render login interface with responsive design, brand logo, and authentication form container.
- [x] **Create AuthLayout**
  - Centered visual layout container dedicated to authentication views.
- [x] **Update App.tsx with React Router routes**
  - Map routes: `/login` (public), `/admin/*` (admin protected), `/app/*` (employee protected), and default redirects.
- [x] **Test login flow**
  - Verify credentials submission, session creation, token storage, and invalid login handling.
- [x] **Test role-based redirect**
  - Verify automatic routing to `/admin/dashboard` for admins and `/app/checklist` for employees upon sign in.

---

### Phase 3: Admin Layout & Navigation
- [x] **Create AdminLayout (sidebar + topbar + content)**
  - Main administrative wrapper providing responsive grid layout for sidebar, top header bar, and content viewport.
- [x] **Create Sidebar with nav links**
  - Navigation panel featuring route links to Dashboard, Employees, Tasks, Reports, and Settings with active states.
- [x] **Create admin Navbar (user info, logout, theme)**
  - Top bar containing breadcrumbs, user avatar, display name, role badge, theme toggle, and sign-out dropdown.
- [x] **Create MobileNav (Sheet)**
  - Responsive side sheet navigation drawer triggered via hamburger button on small screens.
- [x] **Create Footer**
  - System footer displaying app version, copyright, and API connection status indicator.
- [x] **Create DashboardPage (placeholder)**
  - Placeholder component verifying route registration and layout mounting for admin main view.
- [x] **Test sidebar collapse on mobile**
  - Verify layout responsiveness and sheet drawer collapse/expand functionality on mobile viewports (< 768px).
- [x] **Test theme toggle**
  - Verify light, dark, and system theme switching updates root CSS classes and local storage correctly.

---

### Phase 4: Employee Management
- [x] **Create src/api/employees.ts**
  - API service layer for employee CRUD: `getEmployees`, `createEmployee`, `updateEmployee`, and `toggleEmployeeStatus`.
- [x] **Create useEmployees hook**
  - TanStack Query hooks (`useEmployeesQuery`, `useEmployeeMutations`) with query caching and invalidation logic.
- [x] **Create EmployeeTable component**
  - Interactive data table rendering list of employees, status indicators (`active`/`inactive`), role, department, and action actions.
- [x] **Create EmployeeDialog (create/edit)**
  - Modal component housing user creation and editing forms.
- [x] **Create EmployeeForm with validation**
  - Zod-schema validated form capturing full name, email, role, department, phone number, and status.
- [x] **Create EmployeesPage**
  - Full admin management page integrating search filters, department dropdowns, employee table, and modal triggers.
- [x] **Test create employee**
  - Verify adding a new employee generates profile entry in Supabase and triggers auth invitation/provisioning.
- [x] **Test edit employee**
  - Verify updating employee metadata updates database records and refreshes table state instantly.
- [x] **Test deactivate employee**
  - Verify setting status to inactive blocks user authentication while preserving historical task records.

---

### Phase 5: Task Management
- [x] **Create src/api/tasks.ts**
  - API module handling `fetchTasks`, `createTask`, `updateTask`, `deleteTask`, and `assignTaskToEmployee`.
- [x] **Create useTasks hook**
  - React Query custom hook for fetching and caching tasks with category and employee filter support.
- [x] **Create useTaskMutations hook**
  - Encapsulated mutation functions for creating, updating, deleting, and reassigning tasks with optimistic UI updates.
- [x] **Create TaskList component**
  - List and grid container rendering tasks grouped by category or assignment.
- [x] **Create TaskFilters component**
  - Filter bar supporting search query input, category selector (`dynamic`, `stable`, `scheduled`), assignment selector, and status filter.
- [x] **Create TaskDialog (create/edit)**
  - Responsive modal dialog containing the task creation/editing form.
- [x] **Create TaskForm (dynamic by category)**
  - Dynamic form adapting fields based on selected category (e.g. deadline for dynamic, recurrence schedule for stable, cron expression for scheduled).
- [x] **Create TaskCard component**
  - Visual card component displaying task title, category tag, assignee, target completion window, and quick action buttons.
- [x] **Create StatusBadge component**
  - Color-coded status indicator for task states (`pending`, `in_progress`, `completed`, `rolled_over`, `missed`).
- [x] **Create TasksPage**
  - Complete admin task dashboard combining filter toolbar, category tabs, task statistics, and creation dialog.
- [x] **Test create dynamic task**
  - Verify creation of one-time dynamic tasks with specific assignees and due dates.
- [x] **Test create stable work**
  - Verify creation of recurring daily operational checklist tasks.
- [x] **Test create scheduled task**
  - Verify creation of time-scheduled or cron-based periodic tasks.
- [x] **Test assign to employee**
  - Verify reassigning tasks updates database assignees and notifies employee checklist view.
- [x] **Test filter by category/employee/status**
  - Verify filtering controls correctly slice task datasets in real time.
- [x] **Test edit and delete task**
  - Verify editing task parameters and removing obsolete tasks propagates across database and UI.

---

### Phase 6: Employee Checklist
- [ ] **Create EmployeeLayout**
  - Streamlined, mobile-optimized header and content wrapper tailored for employee daily checklist workflows.
- [ ] **Create src/api/submissions.ts**
  - API handlers for `fetchTodayChecklist`, `toggleTaskItem`, `saveReason`, and `submitDailyReport`.
- [ ] **Create useSubmissions hook**
  - TanStack Query hooks managing daily employee checklist data, local completion states, and report submission.
- [ ] **Create ChecklistSection component**
  - Visual category container (`Dynamic Tasks`, `Stable Work`, `Scheduled Tasks`) displaying completion progress counters.
- [ ] **Create ReasonDialog component**
  - Modal prompting the employee to provide a mandatory justification text when unchecking or omitting a task.
- [ ] **Create SubmitButton component**
  - Action button enabling daily checklist submission once all items are checked or justified with reasons.
- [ ] **Create ChecklistItem component**
  - Interactive row item with checkbox, task details, status tag, deadline indicator, and reason button.
- [ ] **Create EmptyState component**
  - Display component shown when an employee has no tasks assigned for the selected day.
- [ ] **Create ChecklistPage**
  - Main employee screen loading today's tasks, managing checkbox states, capturing non-completion reasons, and submitting the daily report.
- [ ] **Test tick/untick tasks**
  - Verify toggling checkbox updates local checklist state and updates task completion progress metrics.
- [ ] **Test reason required for unchecked**
  - Verify unchecking an item or leaving an item incomplete enforces entering a valid reason string before submission.
- [ ] **Test submit daily report**
  - Verify clicking submit records a complete snapshot entry in `task_submissions` with timestamps.
- [ ] **Test task rollover display**
  - Verify incomplete tasks from previous days automatically appear in today's checklist tagged with a `Rolled Over` badge.

---

### Phase 7: Dashboard & Reports
- [ ] **Build full DashboardPage with stats cards**
  - Admin dashboard displaying summary metric cards (Total Employees, Tasks Completed Today, Outstanding Submissions, Rollover Count).
- [ ] **Add today's submission status table**
  - Real-time monitoring table showing daily employee checklist submission statuses (`Submitted`, `Pending`, `Overdue`).
- [ ] **Add quick actions**
  - Dashboard quick-action shortcuts for creating tasks, adding employees, and sending instant agent reminders.
- [ ] **Create ReportsPage with date filters**
  - Historical reports view with date range pickers (Today, Yesterday, Last 7 Days, This Month, Custom Range).
- [ ] **Add employee/category filters**
  - Report filters to segment historical submission data by individual employee, department, or task category.
- [ ] **Add submissions table with expand**
  - Data table with expandable detail rows revealing itemized task responses and employee reasons.
- [ ] **Add CSV/JSON export**
  - Data exporter generating downloadable CSV reports and JSON summaries for administrative auditing.
- [ ] **Create SettingsPage**
  - Admin configuration screen for global system parameters and AI agent behaviors.
- [ ] **Add reminder interval config**
  - Setting controls to configure automated notification intervals (e.g. every 30/60/120 minutes).
- [ ] **Add end-of-day time config**
  - Setting controls to establish the official daily submission cutoff time (e.g., 18:00 IST).
- [ ] **Set up Supabase real-time subscriptions**
  - Subscribe to Supabase Realtime WebSocket changes on `task_submissions` and `tasks` tables.
- [ ] **Test live updates on dashboard**
  - Verify admin dashboard updates live when an employee submits their daily checklist without requiring manual page refresh.

---

### Phase 8: Polish & QA
- [ ] **Responsive testing: Mobile (< 640px)**
  - Audit UI layout on small mobile screens down to 320px width; ensure minimum 44px touch targets and readable cards.
- [ ] **Responsive testing: Tablet (640-1024px)**
  - Audit UI layout and grid reflow on mid-sized viewports across portrait and landscape orientations.
- [ ] **Responsive testing: Desktop (> 1024px)**
  - Audit widescreen layout scaling, table scrolling, sidebars, and multi-column dashboard widgets.
- [ ] **Add Skeleton loading states**
  - Replace raw spinners with accessible shadcn `Skeleton` placeholders for tables, cards, and checklist items during fetching.
- [ ] **Add error boundaries**
  - Implement top-level and feature-level React `ErrorBoundary` components to catch runtime render failures gracefully.
- [ ] **Add toast notifications for all actions**
  - Integrate `sonner` toast feedback for creation, modification, deletion, submission, and network error events.
- [ ] **Implement optimistic updates for checkboxes**
  - Enable instant UI checkbox state changes using TanStack Query optimistic updates while persisting in background.
- [ ] **Keyboard accessibility audit**
  - Verify full keyboard navigation compliance (Tab order, Focus indicators, Dialog closing via `Escape`, Form submit via `Enter`).
- [ ] **SEO meta tags**
  - Add page title routing tags, meta descriptions, and application favicons.
- [ ] **Final build verification**
  - Run complete production build pipeline (`bun run build`) and zero-error TypeScript typecheck (`tsc --noEmit`).
- [ ] **Cross-browser testing (Chrome, Firefox, Safari)**
  - Validate visual aesthetics, CSS variables, layout consistency, and WebSocket stability across all target browsers.

---

### Supabase Setup
- [ ] **Create Supabase project**
  - Provision a new Supabase cloud project instance and retrieve project URL, anon key, and service role key.
- [ ] **Create profiles table with trigger**
  - Define `profiles` table schema (`id`, `email`, `full_name`, `role`, `department`, `is_active`, `created_at`) with automatic `on_auth_user_created` trigger.
- [ ] **Create tasks table**
  - Define `tasks` table schema (`id`, `title`, `description`, `category`, `assigned_to`, `due_date`, `is_recurring`, `status`, `created_at`).
- [ ] **Create task_submissions table**
  - Define `task_submissions` table schema (`id`, `employee_id`, `submission_date`, `completed_tasks`, `missed_tasks`, `status`, `created_at`).
- [ ] **Create agent_settings table**
  - Define `agent_settings` key-value table schema storing system configurations (`reminder_interval_minutes`, `end_of_day_cutoff`, `auto_rollover`).
- [ ] **Create reminders table**
  - Define `reminders` table schema tracking automated agent notifications (`id`, `employee_id`, `sent_at`, `type`, `acknowledged`).
- [ ] **Set up RLS policies for profiles**
  - Enable RLS on `profiles`: users can read their own profile; admins have full select/insert/update access.
- [ ] **Set up RLS policies for tasks**
  - Enable RLS on `tasks`: employees can read assigned tasks; admins have full CRUD permissions.
- [ ] **Set up RLS policies for task_submissions**
  - Enable RLS on `task_submissions`: employees can insert/view their own submissions; admins can read all submissions.
- [ ] **Set up RLS policies for agent_settings**
  - Enable RLS on `agent_settings`: authenticated users can read configuration; only admins and service role can update settings.
- [ ] **Create admin user account**
  - Execute seed script or SQL query to create initial primary admin account and set `role = 'admin'` in `profiles`.
- [ ] **Test RLS policies**
  - Test database queries using client tokens under `admin` and `employee` roles to verify security boundaries.
- [ ] **Enable real-time for task_submissions**
  - Turn on Supabase Realtime publication for `task_submissions` table to stream live submission updates to clients.

---

### AI Agent Integration
- [ ] **Document Supabase service role key usage**
  - Write technical specification detailing how backend background agents utilize `SUPABASE_SERVICE_ROLE_KEY` to query and update tables bypassing client RLS.
- [ ] **Document REST API endpoints for Hermes**
  - Detail Supabase PostgREST endpoints, authentication headers, and request parameter formats for external AI agent integration.
- [ ] **Document task CRUD operations for agent**
  - Provide JSON payload definitions and REST examples for AI agent driven task creation, updates, and assignment triggers.
- [ ] **Document reminder system interface**
  - Specify notification dispatch payload, employee message structure, and acknowledgment webhook callbacks for the automated reminder engine.
- [ ] **Document daily summary data format**
  - Define output JSON schema for automated daily summary reports generated by the agent for administrative review.
- [ ] **Document monthly export format**
  - Define data structures and aggregation schemas for automated monthly performance exports and compliance auditing.
