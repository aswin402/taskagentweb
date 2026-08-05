import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDailyTasksAndSubmissions, submitTaskSubmissions } from '@/api/submissions';

export function useSubmissions(employeeId: string | undefined, dateStr: string) {
  const queryClient = useQueryClient();

  const submissionsQuery = useQuery({
    queryKey: ['submissions', employeeId, dateStr],
    queryFn: () => getDailyTasksAndSubmissions(employeeId || '', dateStr),
    enabled: !!employeeId,
    staleTime: 5 * 1000, // 5 seconds fresh
  });

  const submitMutation = useMutation({
    mutationFn: submitTaskSubmissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', employeeId, dateStr] });
    },
  });

  return {
    tasks: submissionsQuery.data?.tasks || [],
    submissions: submissionsQuery.data?.submissions || [],
    isLoading: submissionsQuery.isLoading,
    error: submissionsQuery.error,
    submitReport: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
    refetch: submissionsQuery.refetch,
  };
}

export default useSubmissions;
