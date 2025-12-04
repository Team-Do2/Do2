import { useSuspenseQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { User } from '../models/User';

export function useGetUser(email: string) {
  return useSuspenseQuery<User>({
    queryKey: ['getUser', email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/User?email=${encodeURIComponent(email)}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });
}

export function useUpdateEmail() {
  return useMutation({
    mutationFn: async (data: { currentEmail: string; newEmail: string; password: string }) => {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/User/UpdateEmail`, data, {
        withCredentials: true,
      });
      return res.data;
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { email: string; currentPassword: string; newPassword: string }) => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/User/ChangePassword`,
        data,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
  });
}
