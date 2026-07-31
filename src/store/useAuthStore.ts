import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '@/services/auth';

interface AuthState {
  token: string | null;
  user: authApi.AuthUser | null;
  isAuthenticated: boolean;
  setSession: (token: string, user: authApi.AuthUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setSession: (token, user) =>
        set({ token, user, isAuthenticated: true }),
      clearSession: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'dfashion_auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
