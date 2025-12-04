import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export type Settings = {
  userEmail: string;
  theme: 'light' | 'dark';
  timeToDelete: number;
};

export function useGetUserSettings(userEmail: string) {
  return useSuspenseQuery<Settings, Error>({
    queryKey: ['userSettings', userEmail],
    queryFn: async () => {
      const response = await axios.get<Settings>(
        `http://localhost:5015/api/settings/${encodeURIComponent(userEmail)}`,
        { withCredentials: true }
      );
      return response.data;
    },
  });
}

export function useUpdateTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, theme }: { email: string; theme: 'light' | 'dark' }) => {
      await axios.patch(
        `http://localhost:5015/api/settings/theme`,
        { email, theme },
        { withCredentials: true }
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userSettings', variables.email] });
    },
  });
}

export function useUpdateTimeToDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, timeToDelete }: { email: string; timeToDelete: number }) => {
      await axios.patch(
        `http://localhost:5015/api/settings/time-to-delete`,
        { email, timeToDelete },
        { withCredentials: true }
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userSettings', variables.email] });
    },
  });
}
