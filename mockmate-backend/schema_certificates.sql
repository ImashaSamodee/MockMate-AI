-- mockmate-backend/schema_certificates.sql
-- Run this in Supabase SQL Editor to synchronize the certificates schema

CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY,
    certificate_id TEXT UNIQUE NOT NULL,
    user_id TEXT,
    user_email TEXT NOT NULL,
    candidate_name TEXT NOT NULL,
    assessment_id TEXT NOT NULL,
    title TEXT NOT NULL,
    level TEXT NOT NULL,
    category TEXT NOT NULL,
    score TEXT NOT NULL,
    numeric_score INTEGER,
    issue_date TEXT NOT NULL,
    issue_date_iso TIMESTAMPTZ DEFAULT NOW(),
    skills TEXT[] DEFAULT '{}',
    issuer TEXT DEFAULT 'MockMate AI Certification Board',
    status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS public.assessment_attempts (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    user_name TEXT,
    assessment_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;

-- Allow public read of verified certificates
CREATE POLICY "Allow public verification lookup" ON public.certificates
    FOR SELECT USING (true);
