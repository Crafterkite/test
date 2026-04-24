'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { get, post } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useOrgStore } from '@/store/org.store';
import type { Organization, CreateOrganizationPayload } from '@/types';

// Query keys
export const orgKeys = {
  all: ['organizations'] as const,
  lists: () => [...orgKeys.all, 'list'] as const,
  detail: (id: string) => [...orgKeys.all, 'detail', id] as const,
};

/**
 * Fetches all organizations the current user is a member of.
 */
export function useOrganizations() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setOrgs = useOrgStore((s) => s.setOrgs);

  return useQuery({
    queryKey: orgKeys.lists(),
    queryFn: async () => {
      const orgs = await get<Organization[]>('/organizations');
      setOrgs(orgs);
      return orgs;
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetches a single organization by ID.
 */
export function useOrganization(id: string) {
  return useQuery({
    queryKey: orgKeys.detail(id),
    queryFn: () => get<Organization>(`/organizations/${id}`),
    enabled: Boolean(id),
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Creates a new organization. On success, adds to store and redirects to /(dashboard).
 */
export function useCreateOrganization() {
  const router = useRouter();
  const addOrg = useOrgStore((s) => s.addOrg);
  const setCurrentOrg = useOrgStore((s) => s.setCurrentOrg);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) =>
      post<Organization, CreateOrganizationPayload>('/organizations', payload),

    onSuccess: (org) => {
      addOrg(org);
      setCurrentOrg(org);
      queryClient.invalidateQueries({ queryKey: orgKeys.lists() });
      router.push('/');
    },
  });
}
