import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient(
    { cookies: () => cookieStore },
    { auth: { debug: true } }
  );

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const storedState = cookieStore.get('oauth_state')?.value;
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const redirectTo = searchParams.get('redirect_to') || '/dashboard';
  console.log('Redirecting to:', redirectTo);
  

  console.log('Callback params:', { code, state, storedState, error, errorDescription });

  if (error) {
    console.error('OAuth provider error:', { error, errorDescription });
    return NextResponse.redirect(
      new URL(`/sign-up?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    );
  }

  if (!state || state !== storedState) {
    console.error('State mismatch. Possible CSRF attack.', { state, storedState });
    return NextResponse.redirect(
      new URL('/sign-up?error=State mismatch. Possible CSRF attack', request.url)
    );
  }

  if (!code) {
    console.error('No authorization code provided');
    return NextResponse.redirect(
      new URL('/sign-up?error=No authorization code provided', request.url)
    );
  }

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('Error exchanging code for session:', error);
      throw error;
    }

    cookieStore.delete('oauth_state');

    if (data.user) {
      // Check if profile exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error('Profile check error:', profileCheckError);
      }

      if (!existingProfile) {
        // Create profile for new user
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              first_name: data.user.user_metadata?.given_name || data.user.user_metadata?.name || '',
              last_name: data.user.user_metadata?.family_name || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return NextResponse.redirect(
            new URL('/sign-up?error=Failed to create user profile', request.url)
          );
        }
      } else {
        // Profile exists, check if email is from a different provider
        const { data: profileData, error: profileFetchError } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', data.user.id)
          .single();

        if (profileFetchError) {
          console.error('Profile fetch error:', profileFetchError);
        }

        if (profileData && profileData.email !== data.user.email) {
          return NextResponse.redirect(
            new URL('/sign-up?error=Account already exists with a different provider', request.url)
          );
        }
      }

      const redirectTo = searchParams.get('redirect_to') || '/dashboard';
      console.log('Redirecting to:', redirectTo);
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    return NextResponse.redirect(new URL('/sign-up?error=No user data returned', request.url));
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      new URL(`/sign-up?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}

export const dynamic = 'force-dynamic';