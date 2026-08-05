import { useState } from 'react';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import EmployeeTable from '@/features/employees/components/EmployeeTable';
import EmployeeDialog from '@/features/employees/components/EmployeeDialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { type Profile } from '@/api/employees';
import { toast } from 'sonner';

export function EmployeesPage() {
  const {
    employees,
    isLoading,
    error,
    createEmployee,
    updateEmployee,
    deactivateEmployee,
    isCreating,
    isUpdating,
  } = useEmployees();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Profile | null>(null);

  const handleEdit = (employee: Profile) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleAddClick = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateEmployee(id);
      toast.success('Employee deactivated successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to deactivate employee');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await updateEmployee({ id, updates: { is_active: true } });
      toast.success('Employee activated successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to activate employee');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-destructive/10 border border-destructive/20 text-destructive rounded-xl max-w-md mx-auto mt-12">
        <h3 className="font-bold text-lg">Error Loading Directory</h3>
        <p className="text-sm mt-1">{error?.message || 'Unknown network error. Please try again.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and audit employee accounts.
          </p>
        </div>
        <Button onClick={handleAddClick} className="shadow-lg shadow-primary/10">
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <EmployeeTable
        employees={employees}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
        onActivate={handleActivate}
      />

      <EmployeeDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        employee={selectedEmployee}
        createEmployee={createEmployee}
        updateEmployee={updateEmployee}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />
    </div>
  );
}

export default EmployeesPage;
