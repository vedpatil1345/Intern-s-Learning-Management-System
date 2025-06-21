'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session fetch error:', error.message);
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Session initialization failed:', error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      // Only handle specific auth events to prevent unwanted state updates
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => subscription?.subscription?.unsubscribe?.();
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signUp = useCallback(async (email, password, extraData = {}) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, ...extraData }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Signup failed');
    return data;
  }, []);

  const resetPassword = useCallback(async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return data;
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Clear localStorage to prevent session restoration
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.refresh_token');

      // Check session existence
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Call signOut without scope: 'global' to avoid potential 403 errors
        const { error } = await supabase.auth.signOut({ scope: 'local' });
        if (error) {
          if (error.message === 'Auth session missing!' || error.status === 403) {
            setUser(null);
            return { data: null, error: null }; // Treat as success
          }
          throw error;
        }
      }

      setUser(null);
      return { data: null, error: null };
    } catch (error) {
      console.error('Sign out error:', error.message);
      setUser(null);
      return { data: null, error: null }; // Ensure state is cleared even on error
    }
  }, []);

  const getSession = useCallback(async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }, []);

  const refreshSession = useCallback(async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data;
  }, []);

  return {
    user,
    setUser,
    loading,
    signInWithEmail,
    signUp,
    resetPassword,
    updatePassword,
    signOut,
    getSession,
    refreshSession
  };
};