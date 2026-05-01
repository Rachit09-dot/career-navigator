-- CareerNavigator Database Schema for Supabase
-- Run this in Supabase Dashboard > SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  profile_complete INTEGER DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone TEXT,
  location TEXT,
  bio TEXT,
  college TEXT,
  degree TEXT,
  current_year TEXT,
  field_of_study TEXT,
  skills TEXT[] DEFAULT '{}',
  completed_skills TEXT[] DEFAULT '{}',
  experience JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  resume_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  career_goal TEXT,
  career_dna JSONB,
  career_dna_last_run TIMESTAMPTZ,
  skill_gap_last_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  salary_range TEXT,
  field TEXT,
  source TEXT DEFAULT 'manual',
  external_url TEXT,
  posted_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active'
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id BIGINT REFERENCES jobs(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  job_url TEXT,
  status TEXT DEFAULT 'applied' CHECK (
    status IN ('applied','screening','interview_scheduled','technical','hr_round','offer','rejected','withdrawn')
  ),
  applied_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  salary_offered TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Career assessments table
CREATE TABLE IF NOT EXISTS career_assessments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  results JSONB NOT NULL,
  completed_date TIMESTAMPTZ DEFAULT NOW()
);

-- Saved jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_data JSONB NOT NULL,
  saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample jobs
INSERT INTO jobs (title, company, location, type, description, requirements, salary_range, field) VALUES
('Software Engineer', 'TCS', 'Bangalore', 'Full-time', 'Build scalable web applications', 'React, Node.js, 2+ years', '8-15 LPA', 'Engineering'),
('Data Analyst', 'Infosys', 'Hyderabad', 'Full-time', 'Analyze business data and create reports', 'Python, SQL, Excel', '6-12 LPA', 'Engineering'),
('Frontend Developer', 'Wipro', 'Pune', 'Full-time', 'Build responsive UI components', 'React, TypeScript, CSS', '7-14 LPA', 'Engineering'),
('Backend Developer', 'HCL', 'Noida', 'Full-time', 'Design and build REST APIs', 'Node.js, PostgreSQL, AWS', '8-16 LPA', 'Engineering'),
('Full Stack Intern', 'Startup', 'Remote', 'Internship', 'Work on full stack features', 'React, Node.js basics', '15-25k/month', 'Engineering'),
('Product Manager', 'Flipkart', 'Bangalore', 'Full-time', 'Define product roadmap and features', 'MBA, 3+ years experience', '20-35 LPA', 'Management'),
('Business Analyst', 'Deloitte', 'Mumbai', 'Full-time', 'Analyze business processes', 'Excel, SQL, Communication', '8-15 LPA', 'Commerce'),
('UI/UX Designer', 'Zomato', 'Gurgaon', 'Full-time', 'Design user interfaces', 'Figma, Adobe XD, 2+ years', '8-18 LPA', 'Design'),
('DevOps Engineer', 'Amazon', 'Hyderabad', 'Full-time', 'Manage CI/CD pipelines', 'Docker, Kubernetes, AWS', '15-25 LPA', 'Engineering'),
('ML Engineer', 'Google', 'Bangalore', 'Full-time', 'Build machine learning models', 'Python, TensorFlow, 3+ years', '25-45 LPA', 'Engineering');
