import { useQuery } from '@tanstack/react-query';
import { getTryOnUsage } from '@/services/api';

export interface TryOnUsage {
  used: number;
  limit: number;
}

/** Lifetime AI try-on usage for the signed-in account (`used` of `limit`).
 *  Silent when the user is not signed in (the endpoint 401s). */
export const useTryOnUsage = () =>
  useQuery<TryOnUsage>({
    queryKey: ['tryon-usage'],
    queryFn: async () => {
      const res = await getTryOnUsage();
      return { used: res.used, limit: res.limit };
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: 2,
  });