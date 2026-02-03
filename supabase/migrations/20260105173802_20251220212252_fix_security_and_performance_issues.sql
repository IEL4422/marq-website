/*
  # Fix Security and Performance Issues

  ## Changes Made

  1. **Add Missing Index**
    - Add index on `client_cases.payment_id` foreign key for better query performance

  2. **Optimize RLS Policies**
    - Update RLS policies to use `(select auth.<function>())` instead of `auth.<function>()`
    - This prevents re-evaluation for each row, significantly improving query performance
    - Affects policies on: payments, client_cases, case_messages

  3. **Remove Unused Indexes**
    - Drop indexes that are not being used to reduce maintenance overhead

  4. **Consolidate Permissive Policies**
    - Replace multiple permissive policies with single policies using OR conditions
    - Affects: case_messages, client_cases, contact_submissions
    - This improves both security clarity and performance

  5. **Fix Function Search Path**
    - Update create_client_case_from_payment function to have immutable search_path
*/

-- 1. Add missing index on client_cases.payment_id foreign key
CREATE INDEX IF NOT EXISTS idx_client_cases_payment_id ON client_cases(payment_id);

-- 2. Drop unused indexes
DROP INDEX IF EXISTS idx_blog_posts_category;
DROP INDEX IF EXISTS idx_blog_posts_featured;
DROP INDEX IF EXISTS idx_case_messages_created_at;
DROP INDEX IF EXISTS idx_client_agreements_email;
DROP INDEX IF EXISTS idx_payments_agreement_id;
DROP INDEX IF EXISTS idx_payments_stripe_id;
DROP INDEX IF EXISTS idx_payments_created_at;

-- 3. Fix RLS policies to use (select auth.<function>()) pattern

-- Fix payments table policy
DROP POLICY IF EXISTS "Users can view own payments by email" ON payments;
CREATE POLICY "Users can view own payments by email"
  ON payments FOR SELECT
  TO authenticated
  USING (client_email = (SELECT auth.jwt()->>'email'));

-- Fix client_cases policies
DROP POLICY IF EXISTS "Authenticated clients can view their own cases" ON client_cases;
DROP POLICY IF EXISTS "Staff can view all cases" ON client_cases;

CREATE POLICY "Clients and staff can view cases"
  ON client_cases FOR SELECT
  TO authenticated
  USING (
    client_email = (SELECT auth.jwt()->>'email')
    OR 
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = (SELECT auth.uid())
    )
  );

-- Fix case_messages policies
DROP POLICY IF EXISTS "Authenticated clients can view messages for their cases" ON case_messages;
DROP POLICY IF EXISTS "Staff can view all messages" ON case_messages;

CREATE POLICY "Clients and staff can view messages"
  ON case_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM client_cases
      WHERE client_cases.id = case_messages.case_id
      AND client_cases.client_email = (SELECT auth.jwt()->>'email')
    )
    OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Authenticated clients can send messages for their cases" ON case_messages;
DROP POLICY IF EXISTS "Staff can send messages" ON case_messages;

CREATE POLICY "Clients and staff can send messages"
  ON case_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM client_cases
      WHERE client_cases.id = case_messages.case_id
      AND client_cases.client_email = (SELECT auth.jwt()->>'email')
    )
    OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = (SELECT auth.uid())
    )
  );

-- Fix contact_submissions duplicate policies
DROP POLICY IF EXISTS "Anon can view contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Anon users can view submissions" ON contact_submissions;

CREATE POLICY "Anon can view contact submissions"
  ON contact_submissions FOR SELECT
  TO anon
  USING (true);

-- 4. Fix function search path for create_client_case_from_payment
DROP FUNCTION IF EXISTS create_client_case_from_payment() CASCADE;

CREATE OR REPLACE FUNCTION create_client_case_from_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_agreement_id uuid;
  v_client_name text;
  v_client_email text;
  v_trademark_name text;
  v_package_price numeric;
BEGIN
  IF NEW.status = 'succeeded' THEN
    v_agreement_id := NEW.agreement_id;
    v_client_email := NEW.client_email;
    
    IF v_agreement_id IS NOT NULL THEN
      SELECT 
        client_name, 
        client_email,
        package_name,
        CAST(REPLACE(REPLACE(package_price, '$', ''), ',', '') AS numeric)
      INTO 
        v_client_name, 
        v_client_email,
        v_trademark_name,
        v_package_price
      FROM client_agreements
      WHERE id = v_agreement_id;
    ELSE
      v_client_name := COALESCE((NEW.metadata->>'client_name')::text, 'Client');
      v_trademark_name := COALESCE((NEW.metadata->>'trademark_name')::text, 'Trademark');
      v_package_price := NEW.amount / 100.0;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM client_cases 
      WHERE client_email = v_client_email 
      AND payment_id = NEW.id
    ) THEN
      INSERT INTO client_cases (
        client_name,
        client_email,
        trademark_name,
        status,
        payment_id,
        package_price,
        notes
      ) VALUES (
        v_client_name,
        v_client_email,
        v_trademark_name,
        'Trademark Search',
        NEW.id,
        v_package_price,
        'Case automatically created from successful payment'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER create_case_on_payment_success
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION create_client_case_from_payment();