/*
  # Grant Authenticator Role Membership

  1. Problem
    - The authenticator role cannot access the auth schema
    - It needs to inherit permissions from anon, authenticated, and service_role
    - Currently authentication is failing with "Database error querying schema"

  2. Solution
    - Ensure authenticator role is a member of anon, authenticated, and service_role
    - Grant direct USAGE on auth schema to authenticator as backup
    - Grant necessary table permissions for authentication to work

  3. Security
    - These are standard Supabase role memberships required for authentication
    - The authenticator role is the connection pooler role used by PostgREST
*/

-- Ensure authenticator has the proper role memberships
DO $$
BEGIN
  -- Grant anon role to authenticator
  IF NOT EXISTS (
    SELECT 1 FROM pg_auth_members 
    WHERE roleid = (SELECT oid FROM pg_roles WHERE rolname = 'anon')
    AND member = (SELECT oid FROM pg_roles WHERE rolname = 'authenticator')
  ) THEN
    GRANT anon TO authenticator;
  END IF;

  -- Grant authenticated role to authenticator
  IF NOT EXISTS (
    SELECT 1 FROM pg_auth_members 
    WHERE roleid = (SELECT oid FROM pg_roles WHERE rolname = 'authenticated')
    AND member = (SELECT oid FROM pg_roles WHERE rolname = 'authenticator')
  ) THEN
    GRANT authenticated TO authenticator;
  END IF;

  -- Grant service_role to authenticator
  IF NOT EXISTS (
    SELECT 1 FROM pg_auth_members 
    WHERE roleid = (SELECT oid FROM pg_roles WHERE rolname = 'service_role')
    AND member = (SELECT oid FROM pg_roles WHERE rolname = 'authenticator')
  ) THEN
    GRANT service_role TO authenticator;
  END IF;
END $$;

-- Also grant direct access as a backup
GRANT USAGE ON SCHEMA auth TO authenticator;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO authenticator;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO authenticator;
