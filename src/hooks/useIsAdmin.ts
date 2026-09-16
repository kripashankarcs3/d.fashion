import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

/** Whether the signed-in member is on the server's ADMIN_EMAILS allowlist.
 *  Used only to gate the admin payments screen — the real enforcement is
 *  server-side (requireAdmin on every admin route), this is just so a
 *  non-admin never lands on a broken-looking page. */
export function useIsAdmin() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['is-admin'],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; user: { role?: string } }>('/auth/profile');
      return res.data.user?.role === 'admin';
    },
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}
