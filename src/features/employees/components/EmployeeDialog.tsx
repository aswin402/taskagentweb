import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import EmployeeForm from '@/components/forms/EmployeeForm';
import { toast } from 'sonner';
import { type Profile } from '@/api/employees';

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Profile | null;
  createEmployee: (values: any) => Promise<any>;
  updateEmployee: (values: { id: string; updates: Partial<Profile> }) => Promise<any>;
  isCreating: boolean;
  isUpdating: boolean;
}

export function EmployeeDialog({
  isOpen,
  onClose,
  employee,
  createEmployee,
  updateEmployee,
  isCreating,
  isUpdating,
}: EmployeeDialogProps) {
  const isEditMode = !!employee;
  const isSubmitting = isCreating || isUpdating;

  const handleSubmit = async (values: any) => {
    try {
      if (isEditMode && employee) {
        await updateEmployee({
          id: employee.id,
          updates: { full_name: values.fullName },
        });
        toast.success('Employee updated successfully');
      } else {
        await createEmployee({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
        });
        toast.success('Employee created successfully');
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save employee profile');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Modify employee details here. Click save when you are done.'
              : 'Add a new employee to the system. They will be able to log in with these credentials.'}
          </DialogDescription>
        </DialogHeader>

        <EmployeeForm
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          defaultValues={
            employee
              ? {
                  email: employee.email,
                  fullName: employee.full_name,
                }
              : undefined
          }
        />
      </DialogContent>
    </Dialog>
  );
}

export default EmployeeDialog;
