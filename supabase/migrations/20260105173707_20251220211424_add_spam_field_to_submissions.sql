/*
  # Add spam field to contact and trademark search submissions

  1. Changes
    - Add `spam` boolean column to `contact_submissions` table with default value `false`
    - Add `spam` boolean column to `trademark_search_requests` table with default value `false`
  
  2. Security
    - No changes to RLS policies (existing policies remain)
*/

-- Add spam field to contact_submissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'spam'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN spam boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Add spam field to trademark_search_requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_search_requests' AND column_name = 'spam'
  ) THEN
    ALTER TABLE trademark_search_requests ADD COLUMN spam boolean DEFAULT false NOT NULL;
  END IF;
END $$;