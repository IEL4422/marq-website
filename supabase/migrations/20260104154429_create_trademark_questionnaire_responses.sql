/*
  # Create Trademark Questionnaire Responses Table

  1. New Tables
    - `trademark_questionnaire_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable - for authenticated users)
      - `trademark_name` (text) - Question 1
      - `name_in_use` (text) - Question 2
      - `business_type` (text) - Question 3
      - `trademark_type` (text) - Question 4 (name, logo, or both)
      - `logo_url` (text, nullable) - Question 5
      - `brand_usage_locations` (text[]) - Question 6
      - `sells_on_amazon` (text) - Question 7
      - `amazon_brand_registry` (text) - Question 8
      - `needs_quick_filing` (text) - Question 9
      - `products_services_description` (text) - Question 10
      - `product_service_type` (text) - Question 11
      - `sales_locations` (text[]) - Question 12
      - `prior_trademark_filing` (text) - Question 13
      - `similar_business_names` (text) - Question 14
      - `additional_info` (text, nullable) - Question 15
      - `full_name` (text) - Question 16
      - `email` (text) - Question 17
      - `phone` (text) - Question 18
      - `package_selected` (text, nullable) - Which package they selected
      - `confirmation_accurate` (boolean) - Question 20
      - `confirmation_understand` (boolean) - Question 21
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `viewed` (boolean) - For staff portal
      - `notes` (text, nullable) - For staff notes

  2. Security
    - Enable RLS on `trademark_questionnaire_responses` table
    - Add policies for authenticated and anonymous users to insert
    - Add policies for staff users to view and update all responses
    - Add policies for users to view their own responses
*/

CREATE TABLE IF NOT EXISTS trademark_questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  trademark_name text NOT NULL,
  name_in_use text NOT NULL,
  business_type text NOT NULL,
  trademark_type text NOT NULL,
  logo_url text,
  brand_usage_locations text[] NOT NULL DEFAULT '{}',
  sells_on_amazon text NOT NULL,
  amazon_brand_registry text NOT NULL,
  needs_quick_filing text NOT NULL,
  products_services_description text NOT NULL,
  product_service_type text NOT NULL,
  sales_locations text[] NOT NULL DEFAULT '{}',
  prior_trademark_filing text NOT NULL,
  similar_business_names text NOT NULL,
  additional_info text,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  package_selected text,
  confirmation_accurate boolean NOT NULL DEFAULT false,
  confirmation_understand boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  viewed boolean DEFAULT false,
  notes text
);

ALTER TABLE trademark_questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert questionnaire responses"
  ON trademark_questionnaire_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anonymous users can insert questionnaire responses"
  ON trademark_questionnaire_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view their own questionnaire responses"
  ON trademark_questionnaire_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can view all questionnaire responses"
  ON trademark_questionnaire_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_app_meta_data->>'role' = 'staff'
           OR auth.users.raw_app_meta_data->>'is_staff' = 'true')
    )
  );

CREATE POLICY "Staff can update all questionnaire responses"
  ON trademark_questionnaire_responses
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_app_meta_data->>'role' = 'staff'
           OR auth.users.raw_app_meta_data->>'is_staff' = 'true')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_app_meta_data->>'role' = 'staff'
           OR auth.users.raw_app_meta_data->>'is_staff' = 'true')
    )
  );

CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_user_id ON trademark_questionnaire_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_email ON trademark_questionnaire_responses(email);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_created_at ON trademark_questionnaire_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_viewed ON trademark_questionnaire_responses(viewed);
