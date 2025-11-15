import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Task } from '../models/Task';

// Get Tasks
export function useGetAllUserTasks(userEmail: string) {
  return useSuspenseQuery<Task[]>({
    queryKey: ['getTasks'],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5015/api/task/user/${encodeURIComponent(userEmail)}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });
}
export function useGetPinnedUserTasks(userEmail: string) {
  return useSuspenseQuery<Task[]>({
    queryKey: ['getPinnedTasks'],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5015/api/task/user/${encodeURIComponent(userEmail)}/pinned`,
        { withCredentials: true }
      );
      return res.data;
    },
  });
}
export function useGetUserTasksBySearch(userEmail: string, search: string) {
  return useQuery<Task[]>({
    queryKey: ['getTasksBySearch', search],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5015/api/task/user/${encodeURIComponent(
          userEmail
        )}/search?search=${encodeURIComponent(search)}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });
}

// Update Tasks
export function useUpdateTaskDone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isDone }: { id: number; isDone: boolean }) => {
      const res = await axios.patch(
        `http://localhost:5015/api/task/${id}/done?isDone=${isDone}`,
        {},
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getPinnedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getTasksBySearch'] });
    },
  });
}
export function useUpdateTaskPinned() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isPinned }: { id: number; isPinned: boolean }) => {
      const res = await axios.patch(
        `http://localhost:5015/api/task/${id}/pinned?isPinned=${isPinned}`,
        {},
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getPinnedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getTasksBySearch'] });
    },
  });
}
export function useUpdateTaskDescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, description }: { id: number; description: string }) => {
      const res = await axios.patch(
        `http://localhost:5015/api/task/${id}/description`,
        {
          description,
        },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getPinnedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getTasksBySearch'] });
    },
  });
}

// Delete Tasks
export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`http://localhost:5015/api/task/${id}`, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getPinnedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getTasksBySearch'] });
    },
  });
}

// Create Task
export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      userEmail,
    }: {
      name: string;
      description: string;
      userEmail: string;
    }) => {
      const res = await axios.post(
        `http://localhost:5015/api/task`,
        {
          name,
          description,
          isPinned: false,
          isDone: false,
          userEmail,
          datetimeToDelete: null,
          supertaskId: null,
          Tags: [],
        },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getPinnedTasks'] });
      queryClient.invalidateQueries({ queryKey: ['getTasksBySearch'] });
    },
  });
}
