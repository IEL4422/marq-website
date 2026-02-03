/*
  # Add Estimated Completion Date to Client Cases

  1. Changes
    - Add `estimated_completion_date` column to `client_cases` table
    - This allows staff to set an estimated completion date that clients can view
    - Column is nullable since not all cases may have an estimate

  2. Security
    - No RLS changes needed as existing policies cover this column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_cases' AND column_name = 'estimated_completion_date'
  ) THEN
    ALTER TABLE client_cases ADD COLUMN estimated_completion_date date;
  END IF;
END $$;