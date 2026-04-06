-- Phase 9B: Media Storage Infrastructure Setup

-- 1. Create Media Assets Metadata Table
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    full_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    category TEXT DEFAULT 'General',
    tags TEXT[] DEFAULT '{}',
    alt_text TEXT,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on metadata table
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Metadata Table Policies
CREATE POLICY "Public Read Access" ON public.media_assets
    FOR SELECT USING (true);

CREATE POLICY "Admin All Access" ON public.media_assets
    FOR ALL USING (auth.role() = 'authenticated');

-- 2. Storage Bucket Setup (Bucket creation usually handled via UI or Admin API, but here are the policies)
-- Assuming bucket 'portfolio_media' is created via Supabase Dashboard.

-- Note: In Supabase, bucket policies are managed in the storage schema.
-- These must be run if you have permissions, or set via Dashboard:

/*
-- ALLOW PUBLIC READ
CREATE POLICY "Public Media Read" ON storage.objects
    FOR SELECT USING (bucket_id = 'portfolio_media');

-- ALLOW ADMIN ONLY UPLOAD
CREATE POLICY "Admin Media Upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'portfolio_media' AND 
        (auth.role() = 'authenticated')
    );

-- ALLOW ADMIN ONLY DELETE
CREATE POLICY "Admin Media Delete" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'portfolio_media' AND 
        (auth.role() = 'authenticated')
    );
*/
