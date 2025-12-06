import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Task } from '../models/Task';

// Get Tasks
export function useGetAllUserTasks(userEmail: string) {
  return useSuspenseQuery<Task[]>({
    queryKey: ['getTasks'],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/task/user/${encodeURIComponent(userEmail)}`,
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
        `${import.meta.env.VITE_API_URL}/api/task/user/${encodeURIComponent(userEmail)}/pinned`,
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
        `${import.meta.env.VITE_API_URL}/api/task/user/${encodeURIComponent(
          userEmail
        )}/search?search=${encodeURIComponent(search)}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });
}

// Helper to recursively update a task in a list (handles subtasks)
const updateTaskInList = (
  tasks: Task[] | undefined,
  id: number,
  updates: Partial<Task>
): Task[] | undefined => {
  if (!tasks) return tasks;
  return tasks.map((task) => {
    // Check if this task matches
    if (task.id === id) {
      return { ...task, ...updates };
    }
    // Recursively check subtasks
    if (task.subtasks && task.subtasks.length > 0) {
      return {
        ...task,
        subtasks: updateTaskInList(task.subtasks, id, updates),
      };
    }
    return task;
  });
};

// Helper to mark a task and all its subtasks as done/not done
const markTaskAndSubtasksDone = (
  tasks: Task[] | undefined,
  id: number,
  isDone: boolean
): Task[] | undefined => {
  if (!tasks) return tasks;
  return tasks.map((task) => {
    if (task.id === id) {
      // Mark this task and all subtasks recursively
      return {
        ...task,
        isDone,
        subtasks: task.subtasks ? markAllSubtasksDone(task.subtasks, isDone) : undefined,
      };
    }
    // Recursively search in subtasks
    if (task.subtasks && task.subtasks.length > 0) {
      return {
        ...task,
        subtasks: markTaskAndSubtasksDone(task.subtasks, id, isDone),
      };
    }
    return task;
  });
};

// Helper to mark all subtasks in a list as done/not done
const markAllSubtasksDone = (subtasks: Task[], isDone: boolean): Task[] => {
  return subtasks.map((subtask) => ({
    ...subtask,
    isDone,
    subtasks: subtask.subtasks ? markAllSubtasksDone(subtask.subtasks, isDone) : undefined,
  }));
};

// Update Tasks
export function useUpdateTaskDone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isDone }: { id: number; isDone: boolean }) => {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/task/${id}/done?isDone=${isDone}`,
        {},
        { withCredentials: true }
      );
      return res.data;
    },
    onMutate: async ({ id, isDone }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['getTasks'] });
      await queryClient.cancelQueries({ queryKey: ['getPinnedTasks'] });
      await queryClient.cancelQueries({ queryKey: ['getTasksBySearch'] });

      // Snapshot the previous values
      const previousTasks = queryClient.getQueryData<Task[]>(['getTasks']);
      const previousPinnedTasks = queryClient.getQueryData<Task[]>(['getPinnedTasks']);
      const previousSearchQueries = queryClient.getQueriesData<Task[]>({
        queryKey: ['getTasksBySearch'],
      });

      // Optimistically update all caches
      // Use markTaskAndSubtasksDone when marking as done to also mark subtasks
      // Use updateTaskInList when marking as not done (only affects the specific task)
      if (isDone) {
        queryClient.setQueryData<Task[]>(['getTasks'], (old) =>
          markTaskAndSubtasksDone(old, id, isDone)
        );
        queryClient.setQueryData<Task[]>(['getPinnedTasks'], (old) =>
          markTaskAndSubtasksDone(old, id, isDone)
        );
        previousSearchQueries.forEach(([queryKey]) => {
          queryClient.setQueryData<Task[]>(queryKey, (old) =>
            markTaskAndSubtasksDone(old, id, isDone)
          );
        });
      } else {
        queryClient.setQueryData<Task[]>(['getTasks'], (old) =>
          updateTaskInList(old, id, { isDone })
        );
        queryClient.setQueryData<Task[]>(['getPinnedTasks'], (old) =>
          updateTaskInList(old, id, { isDone })
        );
        previousSearchQueries.forEach(([queryKey]) => {
          queryClient.setQueryData<Task[]>(queryKey, (old) =>
            updateTaskInList(old, id, { isDone })
          );
        });
      }

      return { previousTasks, previousPinnedTasks, previousSearchQueries };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['getTasks'], context.previousTasks);
      }
      if (context?.previousPinnedTasks) {
        queryClient.setQueryData(['getPinnedTasks'], context.previousPinnedTasks);
      }
      context?.previousSearchQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      // Refetch to verify server state
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
        `${import.meta.env.VITE_API_URL}/api/task/${id}/pinned?isPinned=${isPinned}`,
        {},
        { withCredentials: true }
      );
      return res.data;
    },
    onMutate: async ({ id, isPinned }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['getTasks'] });
      await queryClient.cancelQueries({ queryKey: ['getPinnedTasks'] });
      await queryClient.cancelQueries({ queryKey: ['getTasksBySearch'] });

      // Snapshot the previous values
      const previousTasks = queryClient.getQueryData<Task[]>(['getTasks']);
      const previousPinnedTasks = queryClient.getQueryData<Task[]>(['getPinnedTasks']);
      const previousSearchQueries = queryClient.getQueriesData<Task[]>({
        queryKey: ['getTasksBySearch'],
      });

      // Optimistically update all caches
      queryClient.setQueryData<Task[]>(['getTasks'], (old) =>
        updateTaskInList(old, id, { isPinned })
      );
      queryClient.setQueryData<Task[]>(['getPinnedTasks'], (old) =>
        updateTaskInList(old, id, { isPinned })
      );
      previousSearchQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<Task[]>(queryKey, (old) =>
          updateTaskInList(old, id, { isPinned })
        );
      });

      return { previousTasks, previousPinnedTasks, previousSearchQueries };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['getTasks'], context.previousTasks);
      }
      if (context?.previousPinnedTasks) {
        queryClient.setQueryData(['getPinnedTasks'], context.previousPinnedTasks);
      }
      context?.previousSearchQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      // Refetch to verify server state
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
        `${import.meta.env.VITE_API_URL}/api/task/${id}/description`,
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
export function useUpdateTaskName() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/task/${id}/name`,
        {
          name,
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

export function useUpdateTaskSupertask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, supertaskId }: { id: number; supertaskId: number | null }) => {
      const params = new URLSearchParams();
      if (supertaskId !== null) params.append('supertaskId', supertaskId.toString());
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/task/${id}/supertask?${params.toString()}`,
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

export function useUpdateTaskDueDate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dueDate }: { id: number; dueDate: string | null }) => {
      const params = new URLSearchParams();
      if (dueDate) params.append('dueDate', dueDate);
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/task/${id}/duedate?${params.toString()}`,
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

// Delete Tasks
export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/task/${id}`, {
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
      supertaskId = null,
      dueDate = null,
    }: {
      name: string;
      description: string;
      userEmail: string;
      supertaskId: number | null;
      dueDate?: string | null;
    }) => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/task`,
        {
          name,
          description,
          isPinned: false,
          isDone: false,
          userEmail,
          datetimeToDelete: null,
          supertaskId: supertaskId,
          Tags: [],
          dueDate: dueDate,
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
