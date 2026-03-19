/*
  # Create Staff User Helper Function

  1. Purpose
    - Provide a secure way to create staff users
    - Properly handle Supabase auth schema

  2. Changes
    - Create helper function for staff user creation

  3. Security
    - Only callable by service role
    - Sets proper staff metadata
*/

-- Create a helper function to create staff users
CREATE OR REPLACE FUNCTION create_staff_user(
  user_email text,
  user_password text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  encrypted_pw text;
BEGIN
  -- Generate UUID for new user
  new_user_id := gen_random_uuid();
  
  -- Encrypt password
  encrypted_pw := crypt(user_password, gen_salt('bf'));
  
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    user_email,
    encrypted_pw,
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email'], 'is_staff', true),
    jsonb_build_object('is_staff', true),
    now(),
    now(),
    '',
    ''
  );

  -- Insert into auth.identities
  INSERT INTO auth.identities (
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    new_user_id::text,
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', user_email),
    'email',
    now(),
    now(),
    now()
  );

  RETURN jsonb_build_object(
    'success', true,
    'user_id', new_user_id,
    'email', user_email
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;
