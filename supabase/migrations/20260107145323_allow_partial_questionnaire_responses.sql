/*
  # Allow Partial Questionnaire Responses
  
  1. Changes
    - Make most questionnaire fields nullable to allow partial submissions
    - Only keep required fields: email, full_name (contact information)
    - This allows staff to see incomplete forms where users provided at least their contact info
    
  2. Fields Made Nullable
    - trademark_name
    - name_in_use
    - business_type
    - trademark_type
    - brand_usage_locations
    - products_services_description
    - product_service_type
    - sales_locations
    - prior_trademark_filing
    - similar_business_names
    - phone
    - confirmation_accurate
    - confirmation_understand
    
  3. Required Fields (NOT NULL)
    - email (essential contact info)
    - full_name (essential contact info)
*/

DO $$
BEGIN
  -- Make trademark_name nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'trademark_name'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN trademark_name DROP NOT NULL;
  END IF;

  -- Make name_in_use nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'name_in_use'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN name_in_use DROP NOT NULL;
  END IF;

  -- Make business_type nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'business_type'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN business_type DROP NOT NULL;
  END IF;

  -- Make trademark_type nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'trademark_type'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN trademark_type DROP NOT NULL;
  END IF;

  -- Make products_services_description nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'products_services_description'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN products_services_description DROP NOT NULL;
  END IF;

  -- Make product_service_type nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'product_service_type'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN product_service_type DROP NOT NULL;
  END IF;

  -- Make prior_trademark_filing nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'prior_trademark_filing'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN prior_trademark_filing DROP NOT NULL;
  END IF;

  -- Make similar_business_names nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'similar_business_names'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN similar_business_names DROP NOT NULL;
  END IF;

  -- Make phone nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'phone'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN phone DROP NOT NULL;
  END IF;

  -- Make confirmation_accurate nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'confirmation_accurate'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN confirmation_accurate DROP NOT NULL;
  END IF;

  -- Make confirmation_understand nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trademark_questionnaire_responses'
    AND column_name = 'confirmation_understand'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE trademark_questionnaire_responses
    ALTER COLUMN confirmation_understand DROP NOT NULL;
  END IF;
END $$;
