import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Tag } from '../models/Tag';

export function useGetAllUserTags(userEmail: string) {
  return useSuspenseQuery<Tag[], Error>({
    queryKey: ['userTags', userEmail],
    queryFn: async () => {
      const response = await axios.get<Tag[]>(
        `/api/tags?userEmail=${encodeURIComponent(userEmail)}`
      );
      return response.data;
    },
  });
}
