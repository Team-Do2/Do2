import { useSuspenseQuery } from '@tanstack/react-query';
import type { Task } from '../../../models/Task';

export function useGetTasks() {
  return useSuspenseQuery<Task[]>({
    queryKey: ['getTasks'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5015/api/task');
      if (!res.ok) throw new Error('Network response failed');
      return await res.json();
    },
  });
}
