'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function ProtectedRoute({ user, children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && pathname.startsWith('/dashboard')) {
      router.push('/sign-in');
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}
