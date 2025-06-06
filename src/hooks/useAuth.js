'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

const supabaseClient = createClient();
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session and listen for auth state changes
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error initializing session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event); // Debug log
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => authListener.subscription.unsubscribe();
  }, [supabaseClient]);

  // Email/Password Login
  const signInWithEmail = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.details || result.error || 'Login failed');
      }

      // Session will be updated via onAuthStateChange
      return result.user;
    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  };

  // OAuth Login (Google/GitHub)
  const signInWithOAuth = (provider, redirectTo = '/dashboard') => {
    if (!['google', 'github'].includes(provider)) {
      throw new Error('Invalid provider');
    }

    try {
      // Redirect to OAuth API
      const encodedRedirect = encodeURIComponent(`${window.location.origin}${redirectTo}`);
      window.location.href = `/api/auth/oauth?provider=${provider}&redirect_to=${encodedRedirect}`;
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      throw error;
    }
  };

  // Sign-Out
  const signOut = async () => {
    try {
      // Call server-side sign-out API
      const response = await fetch('/api/auth/sign-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.details || result.error || 'Sign-out failed');
      }

      // Client-side cleanup
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;

      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL.split('.')[0]}-auth-token`);
      }
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithEmail,
    signInWithOAuth,
    signOut,
    supabaseClient,
  };
};