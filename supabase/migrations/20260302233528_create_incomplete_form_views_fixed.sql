/*
  # Track Incomplete Form Views

  1. New Tables
    - `incomplete_form_views`
      - `id` (uuid, primary key)
      - `session_id` (text, unique) - The analytics session ID for the incomplete form
      - `viewed_at` (timestamptz) - When the form was marked as viewed
      - `viewed_by` (uuid) - Staff user who marked it as viewed (references auth.users)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `incomplete_form_views` table
    - Add policy for staff users to insert records using correct metadata path
    - Add policy for staff users to view records using correct metadata path
*/

CREATE TABLE IF NOT EXISTS incomplete_form_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  viewed_at timestamptz DEFAULT now(),
  viewed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE incomplete_form_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can insert incomplete form view records"
  ON incomplete_form_views
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

CREATE POLICY "Staff can view incomplete form view records"
  ON incomplete_form_views
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt()->'app_metadata'->>'role') = 'staff');

CREATE INDEX IF NOT EXISTS idx_incomplete_form_views_session_id 
  ON incomplete_form_views(session_id);

CREATE INDEX IF NOT EXISTS idx_incomplete_form_views_viewed_at 
  ON incomplete_form_views(viewed_at DESC);
