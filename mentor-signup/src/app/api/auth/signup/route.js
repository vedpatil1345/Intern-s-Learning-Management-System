import { NextResponse } from 'next/server';
import { supabase, supabaseServiceRole } from '@/lib/supabase';

export async function POST(request) {
  try {
    const formData = await request.json();
    const email = formData.email;
    const password = formData.password;
    const firstName = formData.first_name;
    const lastName = formData.last_name;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check for existing email in user table
    const { data: existingUser } = await supabase
      .from('user')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email is already registered' },
        { status: 409 }
      );
    }

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Supabase sign-up error:', authError);
      let errorMessage = 'Failed to sign up';
      if (authError.message.includes('already registered')) {
        errorMessage = 'Email is already registered';
      } else if (authError.message.includes('password')) {
        errorMessage = 'Password does not meet requirements';
      } else if (authError.message.includes('email')) {
        errorMessage = 'Invalid email address';
      }
      return NextResponse.json(
        { error: errorMessage, details: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'No user data returned from authentication' },
        { status: 500 }
      );
    }

    const finalUserId = authData.user.id;

    // Prepare insert data for mentor
    const insertData = {
      id: finalUserId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      type: 'mentor',
    };

    // Insert into user table using service role to bypass RLS
    const { data: mentorData, error: mentorError } = await supabaseServiceRole
      .from('user')
      .insert([insertData])
      .select('*')
      .single();

    if (mentorError) {
      console.error('Mentor record creation error:', {
        code: mentorError.code,
        message: mentorError.message,
        details: mentorError.details,
        hint: mentorError.hint,
      });

      // Clean up auth user if insert fails
      await supabaseServiceRole.auth.admin.deleteUser(finalUserId);

      if (mentorError.code === '23505' && mentorError.message.includes('email')) {
        return NextResponse.json(
          { error: 'A mentor with this email already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create mentor record', details: mentorError.message },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Mentor registration successful',
      data: {
        id: mentorData.id,
        email: mentorData.email,
        firstName: mentorData.first_name,
        lastName: mentorData.last_name,
        type: mentorData.type,
        createdAt: mentorData.created_at,
      },
    });
  } catch (error) {
    console.error('Unexpected mentor registration error:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred during registration',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';