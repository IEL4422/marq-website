/*
  # Add Storage Policies for Authenticated Users

  1. Changes
    - Add policy to allow authenticated users to upload to trademark-logos bucket
    - Add policy to allow authenticated users to view trademark logos

  2. Security
    - Authenticated users can upload and view files in the trademark-logos bucket
    - This ensures users who are logged in can also use the trademark search form
*/

CREATE POLICY "Authenticated users can upload trademark logos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'trademark-logos');

CREATE POLICY "Authenticated users can view trademark logos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'trademark-logos');