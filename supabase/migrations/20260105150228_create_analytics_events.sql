/*
  # Create Analytics Events Table

  1. New Tables
    - `analytics_events`
      - `id` (uuid, primary key)
      - `event_type` (text) - Type of event tracked
      - `event_data` (jsonb) - Additional event metadata
      - `user_agent` (text) - Browser user agent
      - `ip_address` (inet) - Client IP address
      - `created_at` (timestamptz) - Event timestamp

  2. Security
    - Enable RLS on `analytics_events` table
    - Add policy for anonymous users to insert events (tracking)
    - Add policy for authenticated staff users to read all events

  3. Indexes
    - Index on event_type for fast filtering
    - Index on created_at for time-based queries
*/

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  user_agent text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Staff can view all analytics events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (
    (SELECT COALESCE((auth.jwt()->>'user_metadata')::jsonb->>'is_staff', 'false'))::boolean = true
  );

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);