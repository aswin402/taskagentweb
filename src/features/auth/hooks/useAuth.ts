import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { signIn, signOut as apiSignOut, getProfile } from '@/api/auth';

export function useAuth() {
  const { user, profile, isLoading, setUser, setProfile, setLoading, clearAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, pass: string) => {
    try {
      setError(null);
      setLoading(true);
      const data = await signIn(email, pass);
      if (data.user) {
        setUser(data.user);
        const profileData = await getProfile(data.user.id);
        setProfile(profileData);
        return { user: data.user, profile: profileData };
      }
      return null;
    } catch (err: any) {
      const errMsg = err?.message || 'Login failed';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      await apiSignOut();
      clearAuth();
    } catch (err: any) {
      setError(err?.message || 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    isLoading,
    role: profile?.role || null,
    isAdmin: profile?.role === 'admin',
    isEmployee: profile?.role === 'employee',
    error,
    login,
    logout,
  };
}
export default useAuth;
