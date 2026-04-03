-- SQL Schema for PersonaLab AI Engine
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    user_id UUID NOT NULL,
    url TEXT NOT NULL,
    conversion_rate FLOAT NOT NULL,
    ux_score INT NOT NULL,
    engagement_score INT NOT NULL,
    personas JSONB NOT NULL,
    friction_points JSONB NOT NULL,
    insights JSONB NOT NULL,
    summary TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_analyses_project_id ON public.analyses(project_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);

-- RLS Policies (Example: Allow authenticated users to read their own analyses)
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analyses" ON public.analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can do everything" ON public.analyses
    USING (true)
    WITH CHECK (true);
