import { create } from 'zustand';
import { supabase } from '../config/supabase';

interface OrganizationState {
  organization: {
    id: string;
    name: string;
    domain: string;
    logo?: string;
    plan: string;
    features: string[];
    maxUsers: number;
    currentUsers: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  fetchOrganization: () => Promise<void>;
  updateOrganization: (data: Partial<OrganizationState['organization']>) => Promise<void>;
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
  organization: null,
  isLoading: false,
  error: null,

  fetchOrganization: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data: organization, error } = await supabase
        .from('organizations')
        .select('*')
        .single();

      if (error) throw error;
      set({ organization });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch organization' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrganization: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase
        .from('organizations')
        .update(data)
        .eq('id', data.id);

      if (error) throw error;
      set((state) => ({
        organization: state.organization ? { ...state.organization, ...data } : null,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update organization' });
    } finally {
      set({ isLoading: false });
    }
  },
}));