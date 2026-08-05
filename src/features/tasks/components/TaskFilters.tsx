import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { type Profile } from '@/api/employees';
import { TASK_CATEGORIES, TASK_STATUSES } from '@/lib/constants';

interface TaskFiltersProps {
  filters: {
    category: string;
    assignedTo: string;
    status: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    category: string;
    assignedTo: string;
    status: string;
  }>>;
  employees: Profile[];
}

export function TaskFilters({ filters, setFilters, employees }: TaskFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
      <div className="space-y-1.5">
        <Label htmlFor="filter-category" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</Label>
        <Select
          value={filters.category}
          onValueChange={(val) => handleFilterChange('category', val)}
        >
          <SelectTrigger id="filter-category">
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
        <Label htmlFor="filter-assignee" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assignee</Label>
        <Select
          value={filters.assignedTo}
          onValueChange={(val) => handleFilterChange('assignedTo', val)}
        >
          <SelectTrigger id="filter-assignee">
            <SelectValue placeholder="All Employees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Assignees</SelectItem>
            <SelectItem value="unassigned">Unassigned (Everyone)</SelectItem>
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={emp.id}>
                {emp.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="filter-status" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(val) => handleFilterChange('status', val)}
        >
          <SelectTrigger id="filter-status">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={TASK_STATUSES.ACTIVE}>Active</SelectItem>
            <SelectItem value={TASK_STATUSES.COMPLETED}>Completed</SelectItem>
            <SelectItem value={TASK_STATUSES.CANCELLED}>Cancelled</SelectItem>
            <SelectItem value={TASK_STATUSES.ROLLED_OVER}>Rolled Over</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default TaskFilters;
