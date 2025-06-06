import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const UserMenu = () => {
  const { user, loading, supabaseClient, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabaseClient
            .from('profiles')
            .select('email, first_name, last_name, profile_photo, type, course, batch')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setProfile(data);
        } catch (err) {
          console.error('Error fetching profile:', err);
          setError('Failed to load profile');
        }
      };
      fetchProfile();
    }
  }, [user, loading, supabaseClient]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!user) {
      router.push('/sign-in');
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
      router.push('/sign-in');
      router.refresh(); // Force page refresh to clear state
    } catch (err) {
      console.error('Sign-out error:', err);
      setError('Failed to sign out');
    }
  };

  if (loading) {
    return <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  const displayName = profile?.first_name || user?.email || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="w-10 h-10 rounded-full overflow-hidden bg-indigo-600 text-white flex items-center justify-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        title={displayName}
        aria-label={`User menu for ${displayName}`}
      >
        {profile?.profile_photo ? (
          <Image
            src={profile.profile_photo}
            alt={displayName}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        ) : (
          <span>{initial}</span>
        )}
      </button>
      {isOpen && user && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {profile?.first_name} {profile?.last_name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{profile?.email || user.email}</p>
          </div>
          <div className="p-4 space-y-2">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="text-sm text-gray-700">
              <span className="font-medium">Type:</span> {profile?.type || 'student'}
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-medium">Course:</span> {profile?.course || 'Not enrolled'}
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-medium">Batch:</span> {profile?.batch || 'Not assigned'}
            </div>
            {profile?.profile_photo && (
              <div className="text-sm text-gray-700">
                <span className="font-medium">Profile Photo:</span>
                <Image
                  src={profile.profile_photo}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="rounded-full mt-1"
                />
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleSignOut}
              className="w-full text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;