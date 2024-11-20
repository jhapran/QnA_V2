import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '../../lib/store/auth';
import { supabase, isSupabaseConfigured } from '../../lib/config/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      toast.error('Authentication is not properly configured. Please check your environment variables.', {
        duration: 5000,
      });
      return;
    }

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error fetching session:', error);
        return;
      }

      if (session?.user) {
        // Fetch user data and update store
        supabase
          .from('users')
          .select('*, organizations(*)')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error: userError }) => {
            if (userError) {
              console.error('Error fetching user data:', userError);
              return;
            }
            useAuthStore.setState({
              user: data,
              organization: data.organizations,
            });
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('*, organizations(*)')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        useAuthStore.setState({
          user: data,
          organization: data.organizations,
        });
      } else if (event === 'SIGNED_OUT') {
        useAuthStore.setState({
          user: null,
          organization: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);