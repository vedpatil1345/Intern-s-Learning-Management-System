import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request) {
  const cookieStore = await cookies();
  console.log('Login route: Initializing Supabase client with cookies'); // Debug log
  const supabase = createClient({ cookies: () => cookieStore });

  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return NextResponse.json(
        { error: 'Failed to log in', details: error.message },
        { status: 401 }
      );
    }

    if (!data.user) {
      console.error('No user data returned from signInWithPassword');
      return NextResponse.json(
        { error: 'No user data returned' },
        { status: 500 }
      );
    }

    // Ensure session is set
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No session created after login');
      return NextResponse.json(
        { error: 'Failed to establish session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';