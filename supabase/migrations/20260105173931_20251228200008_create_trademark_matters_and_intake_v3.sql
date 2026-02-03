/*
  # Create Trademark Matters and Intake Questionnaire System
  
  1. New Tables
    - `trademark_matters` - Track trademark cases with stage/progress
    - `trademark_intake_responses` - Store all form field responses
    - `matter_todos` - Track required tasks for each matter
    - `matter_files` - Track uploaded files
  
  2. Storage Buckets
    - `trademark-intake-files` - For all intake form uploads
  
  3. Security
    - Enable RLS on all tables
    - Clients can read/update their own matters
    - Staff can read/update all matters
  
  4. Functions
    - Auto-generate client docket numbers (MARQ-YYYY-####)
    - Auto-update timestamps
*/

-- Create trademark_matters table
CREATE TABLE IF NOT EXISTS trademark_matters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES auth.users(id) NOT NULL,
  client_docket text UNIQUE NOT NULL,
  stage text NOT NULL DEFAULT 'Stage 1 – Intake (Required)',
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  intake_completed_at timestamptz,
  specimen_ready boolean DEFAULT false,
  teas_candidate text,
  estimated_class_count integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trademark_intake_responses table
CREATE TABLE IF NOT EXISTS trademark_intake_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  matter_id uuid REFERENCES trademark_matters(id) ON DELETE CASCADE NOT NULL,
  section text NOT NULL,
  field_name text NOT NULL,
  field_value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(matter_id, section, field_name)
);

-- Create matter_todos table
CREATE TABLE IF NOT EXISTS matter_todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  matter_id uuid REFERENCES trademark_matters(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  completed_at timestamptz,
  owner_id uuid REFERENCES auth.users(id) NOT NULL,
  reminder_48h_sent boolean DEFAULT false,
  reminder_24h_sent boolean DEFAULT false,
  overdue_notified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create matter_files table
CREATE TABLE IF NOT EXISTS matter_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  matter_id uuid REFERENCES trademark_matters(id) ON DELETE CASCADE NOT NULL,
  field_name text NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create storage bucket for intake files
INSERT INTO storage.buckets (id, name, public)
VALUES ('trademark-intake-files', 'trademark-intake-files', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE trademark_matters ENABLE ROW LEVEL SECURITY;
ALTER TABLE trademark_intake_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE matter_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE matter_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trademark_matters

CREATE POLICY "Clients can view own matters"
  ON trademark_matters FOR SELECT
  TO authenticated
  USING (
    auth.uid() = client_id
    OR
    (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
  );

CREATE POLICY "Clients can update own matters"
  ON trademark_matters FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = client_id
    OR
    (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
  )
  WITH CHECK (
    auth.uid() = client_id
    OR
    (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
  );

CREATE POLICY "Staff can insert matters"
  ON trademark_matters FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
  );

-- RLS Policies for trademark_intake_responses

CREATE POLICY "Clients can view own intake responses"
  ON trademark_intake_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = trademark_intake_responses.matter_id
      AND (
        trademark_matters.client_id = auth.uid()
        OR
        (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
      )
    )
  );

CREATE POLICY "Clients can insert own intake responses"
  ON trademark_intake_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = trademark_intake_responses.matter_id
      AND trademark_matters.client_id = auth.uid()
    )
  );

CREATE POLICY "Clients can update own intake responses"
  ON trademark_intake_responses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = trademark_intake_responses.matter_id
      AND (
        trademark_matters.client_id = auth.uid()
        OR
        (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = trademark_intake_responses.matter_id
      AND (
        trademark_matters.client_id = auth.uid()
        OR
        (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
      )
    )
  );

-- RLS Policies for matter_todos

CREATE POLICY "Users can view own todos"
  ON matter_todos FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR
    (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
  );

CREATE POLICY "Staff can insert todos"
  ON matter_todos FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
  );

CREATE POLICY "Users can update own todos"
  ON matter_todos FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR
    (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
  )
  WITH CHECK (
    owner_id = auth.uid()
    OR
    (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
  );

-- RLS Policies for matter_files

CREATE POLICY "Users can view own matter files"
  ON matter_files FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = matter_files.matter_id
      AND (
        trademark_matters.client_id = auth.uid()
        OR
        (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
      )
    )
  );

CREATE POLICY "Users can insert matter files"
  ON matter_files FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trademark_matters
      WHERE trademark_matters.id = matter_files.matter_id
      AND trademark_matters.client_id = auth.uid()
    )
    OR
    (auth.jwt()->>'user_metadata')::jsonb->>'is_staff' = 'true'
  );

-- Storage policies for trademark-intake-files bucket

CREATE POLICY "Authenticated users can upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'trademark-intake-files');

CREATE POLICY "Authenticated users can view files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'trademark-intake-files');

CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'trademark-intake-files' AND auth.uid() = owner)
  WITH CHECK (bucket_id = 'trademark-intake-files' AND auth.uid() = owner);

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'trademark-intake-files' AND auth.uid() = owner);

-- Indexes

CREATE INDEX IF NOT EXISTS idx_trademark_matters_client_docket ON trademark_matters(client_docket);
CREATE INDEX IF NOT EXISTS idx_trademark_matters_client_id ON trademark_matters(client_id);
CREATE INDEX IF NOT EXISTS idx_trademark_matters_stage ON trademark_matters(stage);
CREATE INDEX IF NOT EXISTS idx_intake_responses_matter_id ON trademark_intake_responses(matter_id);
CREATE INDEX IF NOT EXISTS idx_matter_todos_matter_id ON matter_todos(matter_id);
CREATE INDEX IF NOT EXISTS idx_matter_todos_owner_id ON matter_todos(owner_id);
CREATE INDEX IF NOT EXISTS idx_matter_todos_due_date ON matter_todos(due_date);
CREATE INDEX IF NOT EXISTS idx_matter_files_matter_id ON matter_files(matter_id);

-- Function to generate client docket number
CREATE OR REPLACE FUNCTION generate_client_docket()
RETURNS text AS $$
DECLARE
  current_year text;
  next_number integer;
  new_docket text;
BEGIN
  current_year := to_char(now(), 'YYYY');
  
  SELECT COALESCE(MAX(
    CAST(
      SUBSTRING(client_docket FROM 'MARQ-' || current_year || '-(\d+)')
      AS integer
    )
  ), 0) + 1
  INTO next_number
  FROM trademark_matters
  WHERE client_docket LIKE 'MARQ-' || current_year || '-%';
  
  new_docket := 'MARQ-' || current_year || '-' || LPAD(next_number::text, 4, '0');
  
  RETURN new_docket;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trademark_matters_updated_at
  BEFORE UPDATE ON trademark_matters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intake_responses_updated_at
  BEFORE UPDATE ON trademark_intake_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();