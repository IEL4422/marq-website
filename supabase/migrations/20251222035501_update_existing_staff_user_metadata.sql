/*
  # Update Existing Staff User Metadata

  This migration updates the app_metadata for existing staff users to include the role field.
  
  1. Updates
    - Set `app_metadata.role = 'staff'` for user with email 'contact@illinoisestatelaw.com'
  
  2. Security Notes
    - This is a one-time update to grant existing staff users proper access
    - Future staff users should be created with the role already set
*/

-- Update the staff user's app_metadata to include the role
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"staff"'
)
WHERE email = 'contact@illinoisestatelaw.com'
AND (raw_app_meta_data->>'role' IS NULL OR raw_app_meta_data->>'role' != 'staff');
