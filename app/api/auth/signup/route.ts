import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// SQL to run in Supabase SQL editor:
/*
-- Grant necessary permissions to the service role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;

-- Ensure the service role has access to auth schema
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO service_role;
*/

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: Request) {
  try {
    const { email, password, full_name, university_id } = await request.json()

    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error('Debug - Auth signup error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      console.error('Debug - No user data returned from auth signup')
      return NextResponse.json({ error: 'No user data returned from auth signup' }, { status: 400 })
    }

    console.log('Debug - Auth user created successfully:', authData.user.id)

    // Step 2: Create user profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email,
          full_name,
          university_id,
          role: 'user',
          status: 'pending',
          verified: false,
        },
      ])
      .select()
      .single()

    if (profileError) {
      console.error('Debug - Profile creation error:', profileError)
      
      // Clean up auth user if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      } catch (cleanupError) {
        console.error('Debug - Error during cleanup:', cleanupError)
      }

      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    console.log('Debug - User profile created successfully:', profileData)

    return NextResponse.json({
      user: authData.user,
      profile: profileData,
    })
  } catch (error: any) {
    console.error('Debug - Unexpected error in signup:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred during signup' },
      { status: 500 }
    )
  }
} 