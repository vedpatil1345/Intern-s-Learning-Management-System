'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if not loading and user is not authenticated
    if (!loading && !user && pathname.startsWith('/dashboard')) {
      router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  // Render nothing while loading to prevent flickering
  if (loading) {
    return null; // Or a loading spinner: <div>Loading...</div>
  }

  return <>{children}</>;
}