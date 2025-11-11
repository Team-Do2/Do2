import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Task } from '../../../models/Task';

export function useGetAllUserTasks(userEmail: string) {
  return useSuspenseQuery<Task[]>({
    queryKey: ['getTasks'],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5015/api/task/user/${encodeURIComponent(userEmail)}`
      );
      return res.data;
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

export function useUpdateTaskDescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, description }: { id: number; description: string }) => {
      const res = await axios.patch(`http://localhost:5015/api/task/${id}/description`, {
        description,
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.setQueryData<Task[]>(['getTasks'], (oldTasks) => {
        if (!oldTasks) return [];
        const idx = oldTasks.findIndex((task) => task.id === variables.id);
        if (idx === -1) return oldTasks;
        const newTasks = oldTasks.slice();
        newTasks[idx] = { ...newTasks[idx], description: variables.description };
        return newTasks;
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`http://localhost:5015/api/task/${id}`);
      return res.data;
    },
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Task[]>(['getTasks'], (oldTasks) => {
        if (!oldTasks) return [];
        return oldTasks.filter((task) => task.id !== id);
      });
    },
  });
}
