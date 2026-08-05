import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabase';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, Search, Loader2 } from 'lucide-react';
import { TASK_CATEGORIES } from '@/lib/constants';

export function ReportsPage() {
  const { employees } = useEmployees();
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    employeeId: 'all',
    category: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');

  const reportsQuery = useQuery({
    queryKey: ['reports', filters],
    queryFn: async () => {
      let query = supabase
        .from('task_submissions')
        .select('*, task:tasks(*), employee:profiles(*)');

      if (filters.date) {
        query = query.eq('submission_date', filters.date);
      }
      if (filters.employeeId !== 'all') {
        query = query.eq('employee_id', filters.employeeId);
      }

      const { data, error } = await query.order('submitted_at', { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredSubmissions = (reportsQuery.data || []).filter((sub: any) => {
    const matchesCategory =
      filters.category === 'all' || sub.task?.category === filters.category;
    const matchesSearch =
      sub.task?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.employee?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.reason && sub.reason.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) return;
    const headers = ['Date', 'Employee', 'Task Title', 'Category', 'Completed', 'Reason', 'Submitted At'];
    const rows = filteredSubmissions.map((sub: any) => [
      sub.submission_date,
      sub.employee?.full_name,
      sub.task?.title,
      sub.task?.category,
      sub.is_completed ? 'YES' : 'NO',
      sub.reason || '',
      sub.submitted_at,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `task_report_${filters.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Historical Reports</h1>
        <p className="text-muted-foreground mt-1">
          Audit checklist completions and worker justifications.
        </p>
      </div>

      <Card className="bg-card">
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="report-date">Target Date</Label>
            <Input
              id="report-date"
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-employee">Employee</Label>
            <Select
              value={filters.employeeId}
              onValueChange={(val) => handleFilterChange('employeeId', val)}
            >
              <SelectTrigger id="report-employee">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-category">Category</Label>
            <Select
              value={filters.category}
              onValueChange={(val) => handleFilterChange('category', val)}
            >
              <SelectTrigger id="report-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value={TASK_CATEGORIES.DYNAMIC}>Daily Tasks</SelectItem>
                <SelectItem value={TASK_CATEGORIES.STABLE}>Stable Works</SelectItem>
                <SelectItem value={TASK_CATEGORIES.SCHEDULED}>Scheduled Tasks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-search">Search Text</Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="report-search"
                placeholder="Search tasks, reasons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Audit Logging</CardTitle>
            <CardDescription>
              {filteredSubmissions.length} submissions found for selected date.
            </CardDescription>
          </div>
          <Button
            onClick={handleExportCSV}
            disabled={filteredSubmissions.length === 0}
            variant="outline"
            size="sm"
          >
            <FileDown className="h-4 w-4 mr-1.5" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          {reportsQuery.isLoading ? (
            <div className="flex h-48 w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No submissions match the selected query parameters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Employee</TableHead>
                  <TableHead>Task Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="pr-6">Justification Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((sub: any) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-semibold pl-6">{sub.employee?.full_name}</TableCell>
                    <TableCell className="font-medium">{sub.task?.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                        {sub.task?.category === TASK_CATEGORIES.DYNAMIC
                          ? 'Daily'
                          : sub.task?.category === TASK_CATEGORIES.STABLE
                          ? 'Stable'
                          : 'Scheduled'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sub.is_completed ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400">
                          Incomplete
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="pr-6 italic text-muted-foreground max-w-[250px] truncate">
                      {sub.is_completed ? '-' : sub.reason || 'No justification given'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ReportsPage;
