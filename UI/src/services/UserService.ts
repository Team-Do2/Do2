import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { User } from '../models/User';

export function useGetUser(email: string) {
  return useQuery<User>({
    queryKey: ['getUser', email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:5015/api/User?email=${encodeURIComponent(email)}`,
        { withCredentials: true }
      );
      return res.data;
    },
    enabled: !!email,
  });
}
