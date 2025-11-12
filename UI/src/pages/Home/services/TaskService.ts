import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Task } from '../../../models/Task';

function updateTaskInList(tasks: Task[] | undefined, id: number, update: Partial<Task>): Task[] {
  if (!tasks) return [];
  const idx = tasks.findIndex((task) => task.id === id);
  if (idx === -1) return tasks;
  const newTasks = tasks.slice();
  newTasks[idx] = { ...newTasks[idx], ...update };
  return newTasks;
}

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

export function useGetPinnedUserTasks(userEmail: string) {
  return useSuspenseQuery<Task[]>({
    queryKey: ['getPinnedTasks'],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5015/api/task/user/${encodeURIComponent(userEmail)}/pinned`
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
        )}/search?search=${encodeURIComponent(search)}`
      );
      return res.data;
    },
  });
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

export function useUpdateTaskDone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isDone }: { id: number; isDone: boolean }) => {
      const res = await axios.patch(`http://localhost:5015/api/task/${id}/done?isDone=${isDone}`);
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
        `http://localhost:5015/api/task/${id}/pinned?isPinned=${isPinned}`
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
      const res = await axios.patch(`http://localhost:5015/api/task/${id}/description`, {
        description,
      });
      return res.data;
    },
    onSuccess: (_data, variables) => {
      updateTaskInCaches(queryClient, variables.id, { description: variables.description });
    },
  });
}

function removeTaskFromList(tasks: Task[] | undefined, id: number): Task[] {
  if (!tasks) return [];
  return tasks.filter((task) => task.id !== id);
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`http://localhost:5015/api/task/${id}`);
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
