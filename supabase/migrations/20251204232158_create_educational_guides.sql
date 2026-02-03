/*
  # Create educational guides table

  1. New Tables
    - `educational_guides`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `title` (text) - Guide title
      - `description` (text) - Short description
      - `content` (text) - Full guide content in markdown
      - `topics` (text[]) - Array of topic strings
      - `meta_title` (text) - SEO meta title
      - `meta_description` (text) - SEO meta description
      - `reading_time` (integer) - Estimated reading time in minutes
      - `order_index` (integer) - Display order
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `educational_guides` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS educational_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  topics text[] NOT NULL DEFAULT '{}',
  meta_title text NOT NULL,
  meta_description text NOT NULL,
  reading_time integer NOT NULL DEFAULT 10,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE educational_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Educational guides are publicly readable"
  ON educational_guides
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_educational_guides_slug ON educational_guides(slug);
CREATE INDEX IF NOT EXISTS idx_educational_guides_order ON educational_guides(order_index);