import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, getUserProfile } from '../lib/supabase';
import { UserProfile, UserRole } from '../types/cms';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isModerator: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  // Dev / preview mode quick-switcher when Supabase credentials are not yet set
  setDemoRole: (role: UserRole | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN_PROFILE: UserProfile = {
  id: 'demo-admin-uuid-0001',
  email: 'admin@mostomotion.com',
  role: 'admin',
  created_at: new Date().toISOString(),
};

const DEMO_MODERATOR_PROFILE: UserProfile = {
  id: 'demo-moderator-uuid-0002',
  email: 'moderator@mostomotion.com',
  role: 'moderator',
  created_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isConfigured = isSupabaseConfigured();

  // Load active session on mount
  useEffect(() => {
    let mounted = true;

    if (!isConfigured) {
      // In local development before Supabase keys are inserted, check localStorage for demo session
      const savedDemoRole = localStorage.getItem('mostomotion_demo_role');
      if (savedDemoRole === 'admin') {
        setProfile(DEMO_ADMIN_PROFILE);
      } else if (savedDemoRole === 'moderator') {
        setProfile(DEMO_MODERATOR_PROFILE);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
      return;
    }

    async function initializeAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          setUser(session.user);
          const prof = await getUserProfile(session.user.id);
          setProfile(prof);
        }
      } catch (err) {
        console.warn('[AuthContext] Session init error:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const prof = await getUserProfile(session.user.id);
        setProfile(prof);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isConfigured) {
      // Demo authentication simulation
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail.includes('admin') || password === 'admin123') {
        setProfile(DEMO_ADMIN_PROFILE);
        localStorage.setItem('mostomotion_demo_role', 'admin');
        return { success: true };
      } else if (normalizedEmail.includes('mod') || password === 'mod123') {
        setProfile(DEMO_MODERATOR_PROFILE);
        localStorage.setItem('mostomotion_demo_role', 'moderator');
        return { success: true };
      }
      // Default to admin for convenient setup testing
      setProfile(DEMO_ADMIN_PROFILE);
      localStorage.setItem('mostomotion_demo_role', 'admin');
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        const prof = await getUserProfile(data.user.id);
        setProfile(prof);
        return { success: true };
      }

      return { success: false, error: 'User account not found' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      return { success: false, error: message };
    }
  };

  const signOut = async () => {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('mostomotion_demo_role');
  };

  const setDemoRole = (role: UserRole | null) => {
    if (role === 'admin') {
      setProfile(DEMO_ADMIN_PROFILE);
      localStorage.setItem('mostomotion_demo_role', 'admin');
    } else if (role === 'moderator') {
      setProfile(DEMO_MODERATOR_PROFILE);
      localStorage.setItem('mostomotion_demo_role', 'moderator');
    } else {
      setProfile(null);
      localStorage.removeItem('mostomotion_demo_role');
    }
  };

  const role = profile?.role || null;
  const isAdmin = role === 'admin';
  const isModerator = role === 'moderator';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isModerator,
        isLoading,
        isConfigured,
        signIn,
        signOut,
        setDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
