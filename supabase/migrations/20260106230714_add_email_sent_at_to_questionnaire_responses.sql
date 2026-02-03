/*
  # Add email_sent_at field to trademark questionnaire responses

  1. Changes
    - Add `email_sent_at` column to `trademark_questionnaire_responses` table
      - This tracks when the intake email was sent to the client
      - Nullable timestamp field (null means email not yet sent)
  
  2. Purpose
    - Allow staff to see when an intake email was sent
    - Prevent duplicate emails from being sent
    - Show "Email Sent on [date]" in the UI
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses' AND column_name = 'email_sent_at'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses 
    ADD COLUMN email_sent_at timestamptz DEFAULT NULL;
  END IF;
END $$;