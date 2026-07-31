import { api } from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  token: string;
}

export const register = (name: string, email: string, password: string) =>
  api.post<AuthResponse>('/auth/register', { name, email, password });

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password });
