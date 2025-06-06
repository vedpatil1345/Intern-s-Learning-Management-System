import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request) {
  const cookieStore = await cookies();
  const supabase = createClient({ cookies: () => cookieStore });

  try {
    const { email, password, first_name = '', last_name = '' } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Sign-up error:', error);
      return NextResponse.json(
        { error: 'Failed to sign up', details: error.message },
        { status: 400 }
      );
    }

    if (data.user) {
      // Create profile for new user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            first_name,
            last_name,
            profile_photo: null,
            type: 'student',
            batch: null,
            certi_issued: false,
            certificate: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return NextResponse.json(
          { error: 'Failed to create user profile', details: profileError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        user: data.user,
      });
    }

    return NextResponse.json(
      { error: 'No user data returned' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during sign-up', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';