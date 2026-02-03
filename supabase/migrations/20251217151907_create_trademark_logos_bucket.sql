/*
  # Create Storage Bucket for Trademark Logos

  1. Storage
    - Create `trademark-logos` bucket for storing uploaded logo files
    - Allow public access for viewing uploaded images
    - Set file size limit to 5MB
    - Allow common image formats (jpg, jpeg, png, gif, webp, svg)

  2. Security
    - Enable RLS on storage bucket
    - Allow anonymous users to upload files
    - Allow public read access to uploaded files
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'trademark-logos',
  'trademark-logos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload trademark logos"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'trademark-logos');

CREATE POLICY "Anyone can view trademark logos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'trademark-logos');