/*
  # Add viewed field to contact submissions and trademark requests

  1. Changes
    - Add `viewed` boolean column to `contact_submissions` table (default: false)
    - Add `viewed` boolean column to `trademark_search_requests` table (default: false)
    - These fields allow staff to mark items as read/reviewed
  
  2. Notes
    - Existing records will default to `viewed = false` (unread)
    - This enables better tracking of new vs. reviewed submissions
*/

-- Add viewed field to contact_submissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'viewed'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN viewed boolean DEFAULT false;
  END IF;
END $$;

-- Add viewed field to trademark_search_requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_search_requests' AND column_name = 'viewed'
  ) THEN
    ALTER TABLE trademark_search_requests ADD COLUMN viewed boolean DEFAULT false;
  END IF;
END $$;