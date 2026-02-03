/*
  # Create Trademark Search Requests Table

  1. New Tables
    - `trademark_search_requests`
      - `id` (uuid, primary key) - Unique identifier
      - `full_name` (text) - Client's full name
      - `email` (text) - Client's email address
      - `trademark_name` (text) - Name they wish to protect
      - `logo_url` (text, optional) - URL to uploaded logo/image
      - `business_description` (text) - Description of their business
      - `created_at` (timestamptz) - Timestamp of request
      - `status` (text) - Status of the search request (pending, in_progress, completed)

  2. Security
    - Enable RLS on `trademark_search_requests` table
    - Add policy for anonymous users to insert their own requests
    - Add policy for authenticated users to view all requests (for admin access)
*/

CREATE TABLE IF NOT EXISTS trademark_search_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  trademark_name text NOT NULL,
  logo_url text,
  business_description text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE trademark_search_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit trademark search requests"
  ON trademark_search_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all requests"
  ON trademark_search_requests
  FOR SELECT
  TO authenticated
  USING (true);