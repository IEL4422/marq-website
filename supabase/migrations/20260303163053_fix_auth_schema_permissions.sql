/*
  # Fix Authentication Schema Permissions

  1. Problem
    - The authenticator role lacks USAGE permission on the auth schema
    - This causes "Database error querying schema" when attempting to sign in
    - Authentication fails with a 500 error before reaching application code

  2. Solution
    - Grant USAGE permission on auth schema to authenticator role
    - Grant USAGE permission on storage schema to authenticator role
    - These are critical system schemas that must be accessible for Supabase to function

  3. Security
    - These are standard Supabase permissions required for normal operation
    - The authenticator role is a built-in Supabase role, not a user-facing role
*/

-- Grant necessary schema permissions to the authenticator role
GRANT USAGE ON SCHEMA auth TO authenticator;
GRANT USAGE ON SCHEMA storage TO authenticator;

-- Grant permissions on auth.users table (required for authentication)
GRANT SELECT ON auth.users TO authenticator;

-- Grant permissions on storage tables (required for file operations)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA storage TO authenticator;
