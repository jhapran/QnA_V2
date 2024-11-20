import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import type { AuthState, User, Organization } from '../types/auth';
import { toast } from 'sonner';

interface AuthStore extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  organization: null,
  isLoading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Authentication is not properly configured');
    }

    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*, organizations(*)')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        set({
          user: userData,
          organization: userData.organizations,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Authentication is not properly configured');
    }

    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // User will be created via database trigger
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign up';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    if (!isSupabaseConfigured || !supabase) {
      set({ user: null, organization: null });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, organization: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign out';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (userData: Partial<User>) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('User management is not properly configured');
    }

    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userData.id);

      if (error) throw error;
      set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));