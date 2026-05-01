-- Copy and run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.mock_interviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    field TEXT NOT NULL,
    experience_level TEXT NOT NULL,
    type TEXT NOT NULL, -- 'HR', 'Technical', 'Behavioral'
    mode TEXT NOT NULL, -- 'Video', 'Audio', 'Text'
    total_questions INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    score INTEGER NOT NULL,
    feedback TEXT,
    face_violations INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mock_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    field TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    score INTEGER NOT NULL,
    answers_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own mock interviews" 
ON public.mock_interviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own mock interviews" 
ON public.mock_interviews FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mock tests" 
ON public.mock_tests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own mock tests" 
ON public.mock_tests FOR SELECT 
USING (auth.uid() = user_id);
