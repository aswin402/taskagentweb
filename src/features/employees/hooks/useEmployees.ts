import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployees, createEmployee, updateEmployee, deactivateEmployee, deleteEmployee, type Profile } from '@/api/employees';

export function useEmployees() {
  const queryClient = useQueryClient();

  const employeesQuery = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const createMutation = useMutation({
    mutationFn: ({ email, password, fullName }: { email: string; password: string; fullName: string }) =>
      createEmployee(email, password, fullName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Profile> }) =>
      updateEmployee(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  return {
    employees: employeesQuery.data || [],
    isLoading: employeesQuery.isLoading,
    error: employeesQuery.error,
    createEmployee: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEmployee: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deactivateEmployee: deactivateMutation.mutateAsync,
    isDeactivating: deactivateMutation.isPending,
    deleteEmployee: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export default useEmployees;
