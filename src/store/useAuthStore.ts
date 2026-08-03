import { create } from 'zustand';
import * as authApi from '@/services/auth';

interface AuthState {
  token: string | null;
  user: authApi.AuthUser | null;
  isAuthenticated: boolean;
  /** False until Firebase finishes its first auth-state check. */
  authReady: boolean;
  setSession: (token: string, user: authApi.AuthUser) => void;
  clearSession: () => void;
  hydrateFromFirebase: (token: string, user: authApi.AuthUser) => void;
  setAuthReady: (ready: boolean) => void;
}

/** Session comes from Firebase only — never cache auth in localStorage. */
export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  authReady: false,
  setSession: (token, user) => set({ token, user, isAuthenticated: true }),
  clearSession: () => set({ token: null, user: null, isAuthenticated: false }),
  hydrateFromFirebase: (token, user) => set({ token, user, isAuthenticated: true }),
  setAuthReady: (ready) => set({ authReady: ready }),
}));
