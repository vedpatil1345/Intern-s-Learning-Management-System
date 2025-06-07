import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request) {
  const cookieStore = await cookies();
  console.log('OAuth route: Initializing Supabase client with cookies'); // Debug log
  const supabase = createClient({ cookies: () => cookieStore });

  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');
  const redirectTo = searchParams.get('redirect_to') || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

  if (!['google', 'github'].includes(provider)) {
    return NextResponse.json(
      { error: 'Invalid provider' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?redirect_to=${redirectTo}`,
      },
    });

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=${encodeURIComponent(error.message)}`
      );
    }

    if (!data.url) {
      console.error('No OAuth URL returned');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=${encodeURIComponent('Failed to initiate OAuth login')}`
      );
    }

    return NextResponse.redirect(data.url);
  } catch (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=${encodeURIComponent('An unexpected error occurred: ' + error?.message)}`
    );
  }
}

export const dynamic = 'force-dynamic';