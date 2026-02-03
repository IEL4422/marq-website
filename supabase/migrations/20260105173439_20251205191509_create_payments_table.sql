/*
  # Create Payments Table

  1. New Tables
    - `payments`
      - `id` (uuid, primary key) - Unique payment identifier
      - `agreement_id` (uuid, foreign key) - References client_agreements table
      - `stripe_payment_intent_id` (text, unique) - Stripe PaymentIntent ID
      - `amount` (integer) - Amount in cents (e.g., 1000 = $10.00)
      - `currency` (text) - Currency code (e.g., 'usd')
      - `status` (text) - Payment status: pending, processing, succeeded, failed, canceled
      - `payment_method_type` (text) - Type of payment: card, us_bank_account
      - `client_email` (text) - Email of the client making payment
      - `error_message` (text, nullable) - Error message if payment failed
      - `metadata` (jsonb, nullable) - Additional payment metadata
      - `created_at` (timestamptz) - Timestamp of record creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `payments` table
    - Add policy for anyone to insert payments (needed for checkout flow)
    - Add policy for users to view their own payments by email
    - Add policy for service role to update payment status

  3. Indexes
    - Index on agreement_id for fast lookups
    - Index on stripe_payment_intent_id for webhook processing
    - Index on client_email for user queries
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id uuid REFERENCES client_agreements(id) ON DELETE CASCADE,
  stripe_payment_intent_id text UNIQUE,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'canceled')),
  payment_method_type text CHECK (payment_method_type IN ('card', 'us_bank_account')),
  client_email text NOT NULL,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert payments"
  ON payments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own payments by email"
  ON payments
  FOR SELECT
  TO anon, authenticated
  USING (client_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Service role can update payments"
  ON payments
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_payments_agreement_id ON payments(agreement_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_email ON payments(client_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);