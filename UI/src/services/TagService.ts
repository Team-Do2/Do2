import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Tag } from '../models/Tag';

export function useGetAllUserTags(userEmail: string) {
  return useSuspenseQuery<Tag[], Error>({
    queryKey: ['userTags', userEmail],
    queryFn: async () => {
      const response = await axios.get<Tag[]>(
        `http://localhost:5015/api/tag?userEmail=${encodeURIComponent(userEmail)}`,
        { withCredentials: true }
      );
      return response.data;
    },
  });
}
