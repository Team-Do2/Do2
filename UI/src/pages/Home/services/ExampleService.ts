import { useSuspenseQuery } from '@tanstack/react-query';
import type { Task } from '../../../models/Task';

// Example API call returning a list of tasks (hard-coded json)
export async function getExampleTasks(): Promise<Task[]> {
  return [
    {
      id: 1,
      isPinned: false,
      isDone: false,
      name: 'Example Task 1',
      description: 'This is an example task',
      supertaskId: 0,
      userEmail: 'user@example.com',
    },
  ];
}

// Hook to get example tasks using useSuspenseQuery
export function useGetExampleTasks() {
  return useSuspenseQuery<Task[]>({
    queryKey: ['exampleTasks'],
    queryFn: getExampleTasks,
  });
}
