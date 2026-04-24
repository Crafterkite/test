'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { post, get } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useOrgStore } from '@/store/org.store';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '@/types';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

/**
 * Fetches the current authenticated user.
 * Only runs when the user is authenticated.
 */
export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const user = await get<User>('/auth/me');
      // Keep user in store in sync
      if (accessToken) {
        setAuth(user, accessToken);
      }
      return user;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

/**
 * Login mutation. On success, stores auth state and redirects to dashboard ('/').
 */
export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setOrgs = useOrgStore((s) => s.setOrgs);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      post<AuthResponse, LoginPayload>('/auth/login', payload),

    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);

      // Invalidate any stale queries
      queryClient.invalidateQueries({ queryKey: authKeys.me() });

      // Redirect to dashboard
      router.push('/');
    },
  });
}

/**
 * Register mutation. On success, stores auth state and redirects to onboarding.
 */
export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      post<AuthResponse, RegisterPayload>('/auth/register', payload),

    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
      router.push('/onboarding/create-org');
    },
  });
}

/**
 * Logout mutation. Clears auth state and redirects to login.
 */
export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearOrgs = useOrgStore((s) => s.clearOrgs);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await post('/auth/logout');
      } catch {
        // Ignore errors on logout - we clear local state regardless
      }
    },

    onSettled: () => {
      clearAuth();
      clearOrgs();
      queryClient.clear();
      router.push('/login');
    },
  });
}
