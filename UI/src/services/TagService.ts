import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Tag } from '../models/Tag';

// Get Tags
export function useGetAllUserTags(userEmail: string) {
  return useSuspenseQuery<Tag[], Error>({
    queryKey: ['userTags', userEmail],
    queryFn: async () => {
      const response = await axios.get<Tag[]>(
        `${import.meta.env.VITE_API_URL}/api/tag?userEmail=${encodeURIComponent(userEmail)}`,
        { withCredentials: true }
      );
      return response.data;
    },
  });
}

// Create Tags
export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tag: Omit<Tag, 'id'> & { userEmail: string }) => {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/tag`, tag, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTags'] });
    },
  });
}

// Update Tags
export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tag: Tag & { userEmail: string }) => {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/tag`, tag, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTags'] });
    },
  });
}

// Delete Tags
export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tagId, userEmail }: { tagId: number; userEmail: string }) => {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/tag?tagId=${tagId}&userEmail=${encodeURIComponent(userEmail)}`,
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTags'] });
    },
  });
}

// Add Tag to Task
export function useAddTagToTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tagId, taskId }: { tagId: number; taskId: number }) => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tag/add-to-task?tagId=${tagId}&taskId=${taskId}`,
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

// Remove Tag from Task
export function useRemoveTagFromTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tagId, taskId }: { tagId: number; taskId: number }) => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tag/remove-from-task?tagId=${tagId}&taskId=${taskId}`,
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
