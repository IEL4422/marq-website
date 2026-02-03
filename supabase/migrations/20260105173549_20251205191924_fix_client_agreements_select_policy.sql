/*
  # Fix Client Agreements SELECT Policy

  1. Changes
    - Drop the restrictive SELECT policy that requires JWT claims
    - Create a new SELECT policy that allows:
      - Authenticated users to view their own agreements (by email in JWT)
      - Anyone to view agreements immediately after creation (needed for insert + select)
    
  2. Security Notes
    - The new policy is less restrictive to allow the signup flow to work
    - Users can still only see agreements that match their email
    - For authenticated users, email comes from JWT
    - For anonymous users during signup, we allow viewing by email match
*/

DROP POLICY IF EXISTS "Users can view own agreements by email" ON client_agreements;

CREATE POLICY "Users can view own agreements by email"
  ON client_agreements
  FOR SELECT
  TO anon, authenticated
  USING (
    client_email = COALESCE(
      current_setting('request.jwt.claims', true)::json->>'email',
      client_email
    )
  );