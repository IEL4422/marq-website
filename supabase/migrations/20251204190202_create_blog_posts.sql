/*
  # Create blog posts table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, not null) - Blog post title
      - `slug` (text, unique, not null) - URL-friendly version of title
      - `excerpt` (text, not null) - Brief summary for listing pages
      - `content` (text, not null) - Full blog post content
      - `author` (text, not null) - Author name
      - `category` (text, not null) - Post category
      - `tags` (text[], not null) - Array of tags for categorization
      - `published_date` (timestamptz, not null) - Publication date
      - `updated_at` (timestamptz) - Last update timestamp
      - `reading_time` (integer, not null) - Estimated reading time in minutes
      - `featured` (boolean, default false) - Whether post is featured
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on `blog_posts` table
    - Add policy for public read access to all blog posts
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author text NOT NULL DEFAULT 'Marq Legal Team',
  category text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  published_date timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  reading_time integer NOT NULL DEFAULT 5,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog posts are publicly readable"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_date ON blog_posts(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;