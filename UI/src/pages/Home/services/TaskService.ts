// Unfinished task service

import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Task } from '../../../models/Task';

export function useGetTasks() {
  return useSuspenseQuery<Task[]>({
    queryKey: ['getTasks'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5015/api/task');
      return res.data;
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Task) => {
      const res = await axios.put(`http://localhost:5015/api/task`, task);
      return res.data;
    },
    onSuccess: (updatedTask: Task) => {
      //   Update local cache
      queryClient.setQueryData<Task[]>(['getTasks'], (oldTasks) => {
        if (!oldTasks) return [];
        const idx = oldTasks.findIndex((task) => task.id === updatedTask.id);
        if (idx === -1) return oldTasks;
        const newTasks = oldTasks.slice();
        newTasks[idx] = updatedTask;
        return newTasks;
      });
    },
  });
}
