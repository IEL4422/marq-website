/*
  # Update Trademark Questionnaire - Remove Amazon Fields, Add Social Media Fields

  1. Changes
    - Add `website_url` (text, nullable) - Website URL if user is already using the brand
    - Add `social_media_accounts` (text, nullable) - Social media accounts if user is already using the brand
    - Make Amazon-related fields nullable (these are no longer collected in the form):
      - `sells_on_amazon`
      - `amazon_brand_registry`
      - `needs_quick_filing`

  2. Notes
    - Website and social media fields are conditional - only shown if user selected "Yes, I'm already using it"
      and selected Website or Social media in brand usage locations
    - Amazon fields are kept for historical data but made nullable since they're removed from the form
*/

DO $$
BEGIN
  -- Add new fields for website and social media
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'website_url'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ADD COLUMN website_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'social_media_accounts'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ADD COLUMN social_media_accounts text;
  END IF;

  -- Make Amazon fields nullable (they're no longer required in the form)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'sells_on_amazon'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN sells_on_amazon DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'amazon_brand_registry'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN amazon_brand_registry DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'needs_quick_filing'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN needs_quick_filing DROP NOT NULL;
  END IF;
END $$;
