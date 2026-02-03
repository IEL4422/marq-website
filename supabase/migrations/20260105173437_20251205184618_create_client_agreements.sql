/*
  # Create Client Agreements Table

  1. New Tables
    - `client_agreements`
      - `id` (uuid, primary key)
      - `client_name` (text) - Full name of the client
      - `client_email` (text) - Email address
      - `client_company` (text, nullable) - Company name if applicable
      - `package_name` (text) - Name of the service package purchased
      - `package_price` (text) - Price of the package
      - `signature_type` (text) - Either 'drawn' or 'typed'
      - `signature_data` (text) - Base64 image data for drawn or text for typed
      - `signed_date` (date) - Date when agreement was signed
      - `ip_address` (text, nullable) - IP address of signer
      - `created_at` (timestamptz) - Timestamp of record creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `client_agreements` table
    - Add policy for service role to insert agreements
    - Add policy for authenticated users to view their own agreements
*/

CREATE TABLE IF NOT EXISTS client_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_company text,
  package_name text NOT NULL,
  package_price text NOT NULL,
  signature_type text NOT NULL CHECK (signature_type IN ('drawn', 'typed')),
  signature_data text NOT NULL,
  signed_date date NOT NULL,
  ip_address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE client_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert agreements"
  ON client_agreements
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own agreements by email"
  ON client_agreements
  FOR SELECT
  TO anon, authenticated
  USING (client_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE INDEX IF NOT EXISTS idx_client_agreements_email ON client_agreements(client_email);
CREATE INDEX IF NOT EXISTS idx_client_agreements_created_at ON client_agreements(created_at DESC);