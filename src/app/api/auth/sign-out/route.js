import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createClient({ cookies: () => cookieStore });

  try {
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) throw error;

    // Clear auth cookies
    const storageKey = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL.split('.')[0]}-auth-token`;
    cookieStore.delete(storageKey); // Use the cookieStore object directly
    

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server sign-out error:', error);
    return NextResponse.json(
      { error: 'Failed to sign out', details: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure this route is always fresh