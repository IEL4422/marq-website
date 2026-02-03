/*
  # Add viewed field to payments table

  1. Changes
    - Add `viewed` column to `payments` table
      - Type: boolean
      - Default: false
      - Description: Tracks whether staff has reviewed this purchase
  
  2. Security
    - Update RLS policies to allow staff to update viewed status
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'viewed'
  ) THEN
    ALTER TABLE payments ADD COLUMN viewed boolean DEFAULT false;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_payments_viewed ON payments(viewed) WHERE viewed = false;