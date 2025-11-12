import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Task } from '../models/Task';

function updateTaskInList(tasks: Task[] | undefined, id: number, update: Partial<Task>): Task[] {
  if (!tasks) return [];
  const idx = tasks.findIndex((task) => task.id === id);
  if (idx === -1) return tasks;
  const newTasks = tasks.slice();
  newTasks[idx] = { ...newTasks[idx], ...update };
  return newTasks;
}

function updateTaskInCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  id: number,
  update: Partial<Task>
) {
  const keys = [['getTasks'], ['getPinnedTasks'], ['getTasksBySearch']];
  keys.forEach((key) => {
    queryClient.setQueryData<Task[]>(key, (oldTasks) => updateTaskInList(oldTasks, id, update));
  });
}

function removeTaskFromList(tasks: Task[] | undefined, id: number): Task[] {
  if (!tasks) return [];
  return tasks.filter((task) => task.id !== id);
}

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
    onSuccess: (_data, variables) => {
      updateTaskInCaches(queryClient, variables.id, { isDone: variables.isDone });
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['getPinnedTasks'] });
      updateTaskInCaches(queryClient, variables.id, { isPinned: variables.isPinned });
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
    onSuccess: (_data, variables) => {
      updateTaskInCaches(queryClient, variables.id, { description: variables.description });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`http://localhost:5015/api/task/${id}`, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (_data, id) => {
      const keys = [['getTasks'], ['getPinnedTasks'], ['getTasksBySearch']];
      keys.forEach((key) => {
        queryClient.setQueryData<Task[]>(key, (oldTasks) => removeTaskFromList(oldTasks, id));
      });
    },
  });
}
