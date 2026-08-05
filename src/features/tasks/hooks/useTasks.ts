import { useQuery } from '@tanstack/react-query';
import { getTasks } from '@/api/tasks';
import { useState } from 'react';

export function useTasks() {
  const [filters, setFilters] = useState<{
    category: string;
    assignedTo: string;
    status: string;
  }>({
    category: 'all',
    assignedTo: 'all',
    status: 'all',
  });

  const tasksQuery = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => getTasks(filters),
    staleTime: 10 * 1000, // 10 seconds refresh
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    filters,
    setFilters,
    refetch: tasksQuery.refetch,
  };
}

export default useTasks;
