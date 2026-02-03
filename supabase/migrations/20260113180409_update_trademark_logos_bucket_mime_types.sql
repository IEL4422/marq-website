/*
  # Update Storage Bucket MIME Types

  1. Changes
    - Update `trademark-logos` bucket to accept document formats
    - Add support for PDF, DOC, and DOCX files
    - Keep existing image format support
    - Increase file size limit to 15MB to accommodate larger documents

  2. Supported Formats After Update
    - Images: JPEG, PNG, GIF, WebP, SVG
    - Documents: PDF, DOC, DOCX

  3. Notes
    - Office action documents and cease & desist materials are uploaded to this bucket
    - File size increased from 5MB to 15MB to support typical legal documents
*/

UPDATE storage.buckets
SET 
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  file_size_limit = 15728640
WHERE id = 'trademark-logos';