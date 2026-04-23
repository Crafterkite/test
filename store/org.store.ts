import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Organization } from '@/types';

interface OrgState {
  currentOrg: Organization | null;
  orgs: Organization[];
}

interface OrgActions {
  setCurrentOrg: (org: Organization) => void;
  setOrgs: (orgs: Organization[]) => void;
  addOrg: (org: Organization) => void;
  clearOrgs: () => void;
}

type OrgStore = OrgState & OrgActions;

const initialState: OrgState = {
  currentOrg: null,
  orgs: [],
};

export const useOrgStore = create<OrgStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentOrg: (org: Organization) => {
        set({ currentOrg: org });
      },

      setOrgs: (orgs: Organization[]) => {
        const { currentOrg } = get();
        // If no current org, set first org as current
        const newCurrentOrg =
          currentOrg && orgs.find((o) => o.id === currentOrg.id)
            ? currentOrg
            : orgs[0] ?? null;

        set({ orgs, currentOrg: newCurrentOrg });
      },

      addOrg: (org: Organization) => {
        set((state) => ({
          orgs: [...state.orgs, org],
          // If this is the first org, set it as current
          currentOrg: state.currentOrg ?? org,
        }));
      },

      clearOrgs: () => {
        set({ currentOrg: null, orgs: [] });
      },
    }),
    {
      name: 'crafterkite-org',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentOrg: state.currentOrg,
        orgs: state.orgs,
      }),
    }
  )
);

// Selector hooks
export const useCurrentOrg = () => useOrgStore((s) => s.currentOrg);
export const useOrgs = () => useOrgStore((s) => s.orgs);
