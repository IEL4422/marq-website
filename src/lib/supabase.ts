// This file is kept for backward compatibility during migration.
// All functionality has moved to src/lib/api.ts which uses the MongoDB backend.
// Do not use this file for new code.

export const supabase = null as any;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  published_date: string;
  updated_at: string | null;
  reading_time: number;
  featured: boolean;
  created_at: string;
}

export interface EducationalGuide {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  topics: string[];
  meta_title: string;
  meta_description: string;
  reading_time: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ClientAgreement {
  id: string;
  client_name: string;
  client_email: string;
  client_company: string | null;
  package_name: string;
  package_price: string;
  signature_type: 'drawn' | 'typed';
  signature_data: string;
  signed_date: string;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServicePackage {
  name: string;
  price: string;
  description: string;
}
