// hooks/useProfile.js
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useProfile = (user) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const { data, error } = await supabase
          .from('user')
          .select(`
            id,
            first_name,
            last_name,
            email,
            resume,
            internship_title,
            type,
            cert_issued,
            certificate_url,
            application_status,
            created_at,
            updated_at
          `)
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            throw new Error('Profile not found');
          }
          throw error;
        }

        setProfile(data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates) => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('interns')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { success: true, data };
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('interns')
        .select(`
          id,
          first_name,
          last_name,
          email,
          resume,
          internship_title,
          type,
          cert_issued,
          certificate_url,
          application_status,
          created_at,
          updated_at
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Profile refresh error:', err);
      setError(err.message || 'Failed to refresh profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  const id = user?.id || null;

  return { 
    id,
    profile, 
    isLoading, 
    error, 
    setProfile, 
    updateProfile, 
    refreshProfile 
  };
};

// Alternative hook that automatically gets current user's profile
export const useCurrentUserProfile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      return user;
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    getCurrentUser();

    return () => subscription.unsubscribe();
  }, []);

  // Fetch profile when user changes
  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');

      try {
        const { data, error } = await supabase
          .from('interns')
          .select(`
            id,
            first_name,
            last_name,
            email,
            resume,
            internship_title,
            type,
            cert_issued,
            certificate_url,
            application_status,
            created_at,
            updated_at
          `)
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            throw new Error('Profile not found');
          }
          throw error;
        }

        setProfile(data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const updateProfile = async (updates) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };

    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('interns')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { success: true, data };
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    profile,
    isLoading,
    error,
    updateProfile,
    isAuthenticated: !!user
  };
};