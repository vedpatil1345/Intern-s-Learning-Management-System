import { NextResponse } from 'next/server';
import { supabase, supabaseServiceRole } from '@/lib/supabase';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const idField = formData.get('id');
    const email = formData.get('email');
    const password = formData.get('password');
    const firstName = formData.get('first_name');
    const lastName = formData.get('last_name');
    const internshipTitle = formData.get('internship_title');
    const resumeFile = formData.get('resume');

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !internshipTitle) {
      return NextResponse.json(
        { error: 'Email, password, first name, last name, and internship title are required' },
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

    // Validate resume file if provided
    if (resumeFile && resumeFile.size > 0) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(resumeFile.type)) {
        return NextResponse.json(
          { error: 'Resume must be a PDF or Word document' },
          { status: 400 }
        );
      }

      if (resumeFile.size > maxSize) {
        return NextResponse.json(
          { error: 'Resume file size must be less than 5MB' },
          { status: 400 }
        );
      }
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

    const finalUserId = authData.user.id; // Always use authData.user.id

    let resumeUrl = null;

    // Upload resume file if provided
    if (resumeFile && resumeFile.size > 0) {
      try {
        const fileExtension = resumeFile.name.split('.').pop();
        const fileName = `${finalUserId}-resume-${Date.now()}.${fileExtension}`;
        const filePath = `${fileName}`;
        const arrayBuffer = await resumeFile.arrayBuffer();
        const fileBuffer = new Uint8Array(arrayBuffer);

        const { data: uploadData, error: uploadError } = await supabaseServiceRole.storage
          .from('resumes')
          .upload(filePath, fileBuffer, {
            contentType: resumeFile.type,
            upsert: false,
          });

        if (uploadError) {
          console.error('Resume upload error:', uploadError.message, uploadError);
          console.warn('Continuing registration without resume upload');
        } else {
          const { data: urlData } = supabaseServiceRole.storage
            .from('resumes')
            .getPublicUrl(filePath);
          resumeUrl = urlData.publicUrl;
        }
      } catch (fileError) {
        console.error('File processing error:', fileError);
      }
    }

    // Prepare insert data
    const insertData = {
      id: finalUserId, // Always include id to match auth.uid()
      first_name: firstName,
      last_name: lastName,
      email: email,
      resume: resumeUrl,
      internship_title: internshipTitle,
      type: 'student',
      cert_issued: false,
      certificate_url: null,
      application_status: 'pending',
    };

    // Insert into user table using service role to bypass RLS
    const { data: internData, error: internError } = await supabaseServiceRole
      .from('user')
      .insert([insertData])
      .select('*')
      .single();

    if (internError) {
      console.error('Intern record creation error:', {
        code: internError.code,
        message: internError.message,
        details: internError.details,
        hint: internError.hint,
      });

      // Clean up auth user if insert fails
      await supabaseServiceRole.auth.admin.deleteUser(finalUserId);

      if (internError.code === '23505' && internError.message.includes('email')) {
        return NextResponse.json(
          { error: 'An intern with this email already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create intern record', details: internError.message },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Intern registration successful',
      data: {
        id: internData.id,
        email: internData.email,
        firstName: internData.first_name,
        lastName: internData.last_name,
        internshipTitle: internData.internship_title,
        applicationStatus: internData.application_status,
        resumeUploaded: !!resumeUrl,
        createdAt: internData.created_at,
      },
    });
  } catch (error) {
    console.error('Unexpected registration error:', error);
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