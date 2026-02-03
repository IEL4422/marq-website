/*
  # Add Notes Field to Trademark Search Requests

  1. Changes
    - Add `staff_notes` column to `trademark_search_requests` table
      - Type: text (allows long-form notes)
      - Default: empty string
      - Nullable: false

  2. Notes
    - This field stores staff notes about the trademark search
    - Notes are sent with the webhook when status is updated
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_search_requests' AND column_name = 'staff_notes'
  ) THEN
    ALTER TABLE trademark_search_requests ADD COLUMN staff_notes text DEFAULT '' NOT NULL;
  END IF;
END $$;
