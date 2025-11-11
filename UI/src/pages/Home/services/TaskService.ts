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

export function useUpdateTaskDone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isDone }: { id: number; isDone: boolean }) => {
      const res = await axios.patch(`http://localhost:5015/api/task/${id}/done?isDone=${isDone}`);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<Task[]>(['getTasks'], (oldTasks) => {
        if (!oldTasks) return [];
        const idx = oldTasks.findIndex((task) => task.id === variables.id);
        if (idx === -1) return oldTasks;
        const newTasks = oldTasks.slice();
        newTasks[idx] = { ...newTasks[idx], isDone: variables.isDone };
        return newTasks;
      });
    },
  });
}

export function useUpdateTaskPinned() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isPinned }: { id: number; isPinned: boolean }) => {
      const res = await axios.patch(
        `http://localhost:5015/api/task/${id}/pinned?isPinned=${isPinned}`
      );
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<Task[]>(['getTasks'], (oldTasks) => {
        if (!oldTasks) return [];
        const idx = oldTasks.findIndex((task) => task.id === variables.id);
        if (idx === -1) return oldTasks;
        const newTasks = oldTasks.slice();
        newTasks[idx] = { ...newTasks[idx], isPinned: variables.isPinned };
        return newTasks;
      });
    },
  });
}
