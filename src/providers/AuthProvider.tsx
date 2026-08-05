import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { getProfile, onAuthStateChange } from '@/api/auth';
import { supabase } from '@/api/supabase';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setProfile, setLoading, clearAuth } = useAuthStore();

  useEffect(() => {
    // 1. Check active session on mount
    const initAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const profile = await getProfile(session.user.id);
          setProfile(profile);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 2. Listen to auth changes
    const subscription = onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const profile = await getProfile(session.user.id);
        setProfile(profile);
      } else {
        clearAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, setLoading, clearAuth]);

  return <>{children}</>;
}

export default AuthProvider;
