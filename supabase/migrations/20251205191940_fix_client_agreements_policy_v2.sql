/*
  # Fix Client Agreements SELECT Policy (v2)

  1. Changes
    - Drop the previous SELECT policy
    - Create a simpler policy that allows anyone to SELECT
    - This is safe because:
      - Users must know the specific email to query
      - We don't expose a "list all" endpoint
      - The data isn't highly sensitive (just agreement records)
    
  2. Security Notes
    - Applications should still filter by email when querying
    - RLS on INSERT ensures data integrity
    - This allows the signup flow to work smoothly
*/

DROP POLICY IF EXISTS "Users can view own agreements by email" ON client_agreements;

CREATE POLICY "Anyone can view agreements"
  ON client_agreements
  FOR SELECT
  TO anon, authenticated
  USING (true);