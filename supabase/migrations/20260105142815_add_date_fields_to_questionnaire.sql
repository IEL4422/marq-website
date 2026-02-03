/*
  # Add Date Fields to Trademark Questionnaire Responses

  1. Changes
    - Add `name_in_use_start_date` (date, nullable) - When user started using the name (if already using)
    - Add `name_in_use_plan_date` (date, nullable) - When user plans to start using the name (if planning to use)

  2. Notes
    - These fields are conditional based on the `name_in_use` response
    - Both fields are nullable since only one will be filled based on the user's answer
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'name_in_use_start_date'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ADD COLUMN name_in_use_start_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'name_in_use_plan_date'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ADD COLUMN name_in_use_plan_date date;
  END IF;
END $$;