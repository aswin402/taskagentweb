import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, ClipboardList, CheckCircle2, AlertCircle, Plus, BarChart3, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { Profile } from '@/api/employees';
import type { Task } from '@/api/tasks';
import type { TaskSubmission } from '@/api/submissions';

export function DashboardPage() {
  const navigate = useNavigate();
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Fetch active employees
  const employeesQuery = useQuery({
    queryKey: ['admin', 'employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'employee')
        .eq('is_active', true);
      if (error) throw error;
      return (data || []) as Profile[];
    },
  });

  // 2. Fetch active tasks
  const tasksQuery = useQuery({
    queryKey: ['admin', 'tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .in('status', ['active', 'rolled_over']);
      if (error) throw error;
      return (data || []) as Task[];
    },
  });

  // 3. Fetch today's submissions
  const submissionsQuery = useQuery({
    queryKey: ['admin', 'submissions', todayStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('task_submissions')
        .select('*, task:tasks(*)')
        .eq('submission_date', todayStr);
      if (error) throw error;
      return (data || []) as (TaskSubmission & { task: Task })[];
    },
  });

  const isLoading = employeesQuery.isLoading || tasksQuery.isLoading || submissionsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const employees = employeesQuery.data || [];
  const tasks = tasksQuery.data || [];
  const submissions = submissionsQuery.data || [];

  // --- Calculate Analytics ---
  const totalEmployees = employees.length;

  // Calculate total task instances assigned today
  // If task.assigned_to is null, it's assigned to ALL active employees
  let totalTaskInstances = 0;
  const employeeTaskMap: Record<string, { total: number; completed: number; submitted: boolean }> = {};

  // Initialize map for all employees
  employees.forEach((emp) => {
    employeeTaskMap[emp.id] = { total: 0, completed: 0, submitted: false };
  });

  tasks.forEach((task) => {
    if (task.assigned_to === null) {
      // Assigned to all
      employees.forEach((emp) => {
        if (employeeTaskMap[emp.id]) {
          employeeTaskMap[emp.id].total += 1;
          totalTaskInstances += 1;
        }
      });
    } else {
      // Assigned to specific
      if (employeeTaskMap[task.assigned_to]) {
        employeeTaskMap[task.assigned_to].total += 1;
        totalTaskInstances += 1;
      }
    }
  });

  // Populate completed counts from submissions
  let totalCompletedInstances = 0;
  submissions.forEach((sub) => {
    if (employeeTaskMap[sub.employee_id]) {
      employeeTaskMap[sub.employee_id].submitted = true;
      if (sub.is_completed) {
        employeeTaskMap[sub.employee_id].completed += 1;
        totalCompletedInstances += 1;
      }
    }
  });

  const totalSubmittedEmployees = Object.values(employeeTaskMap).filter((v) => v.submitted).length;
  const overallCompletionRate = totalTaskInstances > 0 ? Math.round((totalCompletedInstances / totalTaskInstances) * 100) : 0;

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Active Workers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Currently active profiles
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Submissions Today</CardTitle>
            <ClipboardList className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubmittedEmployees} / {totalEmployees}</div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Workers who submitted reports
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Overall Completion</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallCompletionRate}%</div>
            <Progress value={overallCompletionRate} className="h-1.5 mt-2 bg-slate-100 dark:bg-slate-800" />
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Assigned Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTaskInstances}</div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Total individual task instances
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => navigate('/admin/tasks')} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Assign New Task
        </Button>
        <Button onClick={() => navigate('/admin/reports')} variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-1.5" />
          View Historical Reports
        </Button>
      </div>

      {/* Today's Submission Overview Table */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Worker Submissions Summary</CardTitle>
          <CardDescription>Real-time completion logs for today's assigned tasks.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Worker Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead className="pr-6 text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => {
                const stats = employeeTaskMap[emp.id] || { total: 0, completed: 0, submitted: false };
                const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

                return (
                  <TableRow key={emp.id}>
                    <TableCell className="font-semibold pl-6">{emp.full_name}</TableCell>
                    <TableCell>
                      {stats.submitted ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400">
                          Submitted
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-muted-foreground bg-muted">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 max-w-[200px]">
                        <Progress value={pct} className="h-1.5 w-24 bg-slate-100 dark:bg-slate-800" />
                        <span className="text-xs font-semibold text-muted-foreground">
                          {stats.completed}/{stats.total} ({pct}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/reports?employee=${emp.id}`)}>
                        Audit Log
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
