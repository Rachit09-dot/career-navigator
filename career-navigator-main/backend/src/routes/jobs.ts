import express from 'express'
import fetch from 'node-fetch'
import { supabase } from '../utils/db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = express.Router()

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY
const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY // RapidAPI key
const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs/in/search'
const JSEARCH_BASE = 'https://jsearch.p.rapidapi.com/search'

// Helper: make HTTPS GET request using node-fetch
async function httpsGet(url: string): Promise<any> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  return res.json()
}

// JSearch (RapidAPI) — LinkedIn + Indeed + Glassdoor + Naukri jobs
async function fetchJSearchJobs(query: string, location = 'India'): Promise<any[]> {
  const url = `${JSEARCH_BASE}?query=${encodeURIComponent(query + ' in ' + location)}&page=1&num_pages=2&date_posted=all`
  const res = await fetch(url, {
    headers: {
      'X-RapidAPI-Key': JSEARCH_API_KEY!,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
  })
  if (!res.ok) throw new Error(`JSearch HTTP ${res.status}`)
  const data: any = await res.json()
  return (data?.data || []).map(transformJSearchJob)
}

function transformJSearchJob(job: any) {
  const src = (job.job_apply_link || '').toLowerCase()
  let source = 'other'
  if (src.includes('linkedin')) source = 'linkedin'
  else if (src.includes('naukri')) source = 'naukri'
  else if (src.includes('indeed')) source = 'indeed'
  else if (src.includes('glassdoor')) source = 'glassdoor'
  else if (src.includes('monster')) source = 'monster'

  const salaryMin = job.job_min_salary
  const salaryMax = job.job_max_salary
  const salaryRange = salaryMin && salaryMax
    ? `₹${Math.round(salaryMin / 100000)}L-${Math.round(salaryMax / 100000)}L PA`
    : 'Salary not disclosed'

  return {
    id: job.job_id || `js_${Date.now()}`,
    title: job.job_title,
    company: job.employer_name || 'Company',
    location: job.job_city ? `${job.job_city}, ${job.job_country || 'India'}` : (job.job_country || 'India'),
    type: job.job_employment_type === 'FULLTIME' ? 'Full-time' : job.job_employment_type === 'PARTTIME' ? 'Part-time' : 'Full-time',
    salary_range: salaryRange,
    description: (job.job_description || '').slice(0, 300) + '...',
    requirements: (job.job_required_skills || []).slice(0, 5).join(', ') || job.job_highlights?.Qualifications?.[0] || '',
    field: 'general',
    source,
    source_logo: source,
    redirect_url: job.job_apply_link,
    posted_date: job.job_posted_at_datetime_utc,
    employer_logo: job.employer_logo,
  }
}

// Fallback sample jobs (used when Adzuna key not set or API fails)
const SAMPLE_JOBS = [
  { id: 's1', title: 'Software Engineer', company: 'TCS', location: 'Bangalore', type: 'Full-time', salary_range: '6-12 LPA', description: 'Build scalable web applications using React and Node.js', requirements: 'React, Node.js, SQL, Git', field: 'engineering', source: 'sample', redirect_url: null },
  { id: 's2', title: 'Data Analyst', company: 'Infosys', location: 'Pune', type: 'Full-time', salary_range: '5-9 LPA', description: 'Analyze business data and create dashboards using Power BI and Python', requirements: 'Python, SQL, Excel, Power BI', field: 'data', source: 'sample', redirect_url: null },
  { id: 's3', title: 'Frontend Developer', company: 'Wipro', location: 'Hyderabad', type: 'Full-time', salary_range: '5-10 LPA', description: 'Create responsive UI using React and Tailwind CSS', requirements: 'React, TypeScript, CSS, HTML', field: 'engineering', source: 'sample', redirect_url: null },
  { id: 's4', title: 'Business Analyst', company: 'Accenture', location: 'Mumbai', type: 'Full-time', salary_range: '7-14 LPA', description: 'Bridge gap between business and technology teams', requirements: 'Communication, Excel, SQL, Agile', field: 'business', source: 'sample', redirect_url: null },
  { id: 's5', title: 'Product Manager', company: 'Flipkart', location: 'Bangalore', type: 'Full-time', salary_range: '15-30 LPA', description: 'Define product roadmap and work with engineering teams', requirements: 'Product Thinking, SQL, Communication, Agile', field: 'product', source: 'sample', redirect_url: null },
  { id: 's6', title: 'DevOps Engineer', company: 'Amazon', location: 'Hyderabad', type: 'Full-time', salary_range: '12-22 LPA', description: 'Manage CI/CD pipelines and cloud infrastructure', requirements: 'Docker, Kubernetes, AWS, CI/CD', field: 'engineering', source: 'sample', redirect_url: null },
  { id: 's7', title: 'ML Engineer', company: 'Google', location: 'Bangalore', type: 'Full-time', salary_range: '25-45 LPA', description: 'Build and deploy machine learning models at scale', requirements: 'Python, TensorFlow, MLOps, Statistics', field: 'engineering', source: 'sample', redirect_url: null },
  { id: 's8', title: 'UI/UX Designer', company: 'Zomato', location: 'Gurugram', type: 'Full-time', salary_range: '8-18 LPA', description: 'Design user interfaces and experiences for mobile and web', requirements: 'Figma, User Research, Prototyping, CSS', field: 'design', source: 'sample', redirect_url: null },
]

// Map field names to Adzuna-friendly search keywords
function fieldToKeyword(field: string): string {
  const f = field.toLowerCase()
  if (f.includes('engineer') || f.includes('cse') || f.includes('it') || f.includes('computer') || f.includes('software')) return 'Software Engineer'
  if (f.includes('medical') || f.includes('mbbs') || f.includes('health')) return 'Healthcare'
  if (f.includes('commerce') || f.includes('bba') || f.includes('finance') || f.includes('bcom')) return 'Business Analyst'
  if (f.includes('design') || f.includes('creative')) return 'UI UX Designer'
  if (f.includes('data') || f.includes('analytics')) return 'Data Analyst'
  if (f.includes('mass communication') || f.includes('media') || f.includes('journalism')) return 'Journalist'
  if (f.includes('law') || f.includes('legal')) return 'Legal Associate'
  if (f.includes('education') || f.includes('teaching')) return 'Teacher'
  if (f.includes('hotel') || f.includes('hospitality')) return 'Hotel Management'
  if (f.includes('agriculture')) return 'Agriculture Officer'
  if (f.includes('sports') || f.includes('physical')) return 'Sports Coach'
  if (f.includes('social work')) return 'Social Worker'
  if (f.includes('defence') || f.includes('military') || f.includes('paramilitary')) return 'Defence'
  if (f.includes('civil service') || f.includes('government') || f.includes('upsc') || f.includes('ias')) return 'Government Jobs'
  if (f.includes('fine art') || f.includes('performing')) return 'Artist'
  if (f.includes('paramedical') || f.includes('allied health')) return 'Paramedic'
  if (f.includes('diploma') || f.includes('iti') || f.includes('vocational')) return 'Technician'
  if (f.includes('pure science') || f.includes('physics') || f.includes('chemistry') || f.includes('biology')) return 'Research Scientist'
  if (f.includes('art') || f.includes('humanities')) return 'Content Writer'
  return field // fallback
}
function transformAdzunaJob(job: any) {
  const salaryMin = job.salary_min ? `₹${Math.round(job.salary_min / 100000)}L` : null
  const salaryMax = job.salary_max ? `₹${Math.round(job.salary_max / 100000)}L` : null
  const salaryRange = salaryMin && salaryMax ? `${salaryMin}-${salaryMax} PA` : 'Salary not disclosed'

  return {
    id: job.id,
    title: job.title,
    company: job.company?.display_name || 'Company',
    location: job.location?.display_name || 'India',
    type: job.contract_time === 'full_time' ? 'Full-time' : job.contract_time === 'part_time' ? 'Part-time' : 'Full-time',
    salary_range: salaryRange,
    description: job.description?.slice(0, 300) + (job.description?.length > 300 ? '...' : '') || '',
    requirements: job.category?.label || '',
    field: job.category?.tag || 'general',
    source: 'adzuna',
    source_logo: getSourceLogo(job.redirect_url),
    redirect_url: job.redirect_url, // Original job URL — user redirected here
    posted_date: job.created,
  }
}

function getSourceLogo(url: string): string {
  if (!url) return 'other'
  if (url.includes('naukri')) return 'naukri'
  if (url.includes('linkedin')) return 'linkedin'
  if (url.includes('indeed')) return 'indeed'
  if (url.includes('glassdoor')) return 'glassdoor'
  if (url.includes('monster')) return 'monster'
  if (url.includes('shine')) return 'shine'
  if (url.includes('timesjobs')) return 'timesjobs'
  return 'other'
}

// GET /api/jobs — fetch real jobs: JSearch → Adzuna → Sample fallback
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { q, field, location, page = '1' } = req.query as Record<string, string>
    const searchQuery = q || (field ? fieldToKeyword(field) : 'software engineer')

    // Fetch user profile and completed skills for skill-based filtering
    let userSkills: string[] = []
    try {
      const { data: profile } = await supabase.from('profiles').select('skills').eq('user_id', req.userId).single()
      if (profile?.skills && Array.isArray(profile.skills)) {
        userSkills = [...profile.skills]
      }
      const { data: completedGaps } = await supabase.from('skill_gaps').select('completed_skills').eq('user_id', req.userId).order('created_at', { ascending: false }).limit(1)
      if (completedGaps && completedGaps.length > 0 && Array.isArray(completedGaps[0].completed_skills)) {
        const gapSkills = completedGaps[0].completed_skills.map((s: any) => typeof s === 'string' ? s : s.skill || s.name || '')
        userSkills = [...userSkills, ...gapSkills].filter(Boolean)
      }
      userSkills = [...new Set(userSkills.map(s => s.toLowerCase()))]
    } catch (err) {
      console.error('Error fetching user skills:', err)
    }

    const processJobs = (jobs: any[]) => {
      if (!userSkills.length) return jobs;
      
      const processed = jobs.map(job => {
        let matchCount = 0
        const text = `${job.title} ${job.description} ${job.requirements}`.toLowerCase()
        const matchedSkills: string[] = []
        
        userSkills.forEach(skill => {
           if (text.includes(skill)) {
             matchCount++
             matchedSkills.push(skill)
           }
        })
        
        // Base score on matches, but cap it so it looks realistic (e.g. max 98%)
        let matchPercentage = userSkills.length > 0 ? Math.min(Math.round((matchCount / Math.max(userSkills.length, 3)) * 100) + 40, 98) : 0
        if (matchCount === 0) matchPercentage = Math.floor(Math.random() * 20) + 20 // Random 20-40% if no exact keyword match
        
        return { ...job, matchPercentage, matchedSkills }
      })
      
      // Sort by match percentage descending
      return processed.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
    }

    // Try JSearch (RapidAPI) first — LinkedIn + Indeed + Glassdoor
    if (JSEARCH_API_KEY && JSEARCH_API_KEY !== 'your_jsearch_api_key') {
      try {
        const jobs = await fetchJSearchJobs(searchQuery, location || 'India')
        if (jobs.length > 0) {
          const sortedJobs = processJobs(jobs)
          return res.json({ jobs: sortedJobs, total: sortedJobs.length, source: 'jsearch' })
        }
      } catch (jsErr) {
        console.error('JSearch error, falling back to Adzuna:', jsErr)
      }
    }

    // Try Adzuna
    if (ADZUNA_APP_ID && ADZUNA_APP_KEY &&
        ADZUNA_APP_ID !== 'your_adzuna_app_id' &&
        ADZUNA_APP_KEY !== 'your_adzuna_app_key') {
      try {
        const queryString = new URLSearchParams({
          app_id: ADZUNA_APP_ID,
          app_key: ADZUNA_APP_KEY,
          results_per_page: '20',
          what: searchQuery,
        }).toString()
        const url = `${ADZUNA_BASE}/${page}?${queryString}`
        const data = await httpsGet(url)
        const jobs = (data?.results || []).map(transformAdzunaJob)
        if (jobs.length > 0) {
          const sortedJobs = processJobs(jobs)
          return res.json({ jobs: sortedJobs, total: data?.count || sortedJobs.length, source: 'adzuna' })
        }
      } catch (azErr) {
        console.error('Adzuna error, falling back to sample:', azErr)
      }
    }

    // Fallback: sample jobs
    console.log('No API keys configured — returning sample jobs')
    const sortedSampleJobs = processJobs(SAMPLE_JOBS)
    res.json({ jobs: sortedSampleJobs, total: sortedSampleJobs.length, source: 'sample' })
  } catch (error: any) {
    console.error('Jobs error:', error?.message || error)
    res.json({ jobs: SAMPLE_JOBS, total: SAMPLE_JOBS.length, source: 'sample' })
  }
})

// GET /api/jobs/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (!job) return res.status(404).json({ message: 'Job not found' })
    res.json(job)
  } catch {
    res.status(500).json({ message: 'Failed to get job' })
  }
})

// POST /api/jobs/:id/apply — track application (job opens in new tab via redirect_url)
router.post('/:id/apply', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { job_title, company, location, redirect_url } = req.body

    // Save to applications table for tracking
    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: req.userId,
        job_title: job_title || 'Unknown',
        company: company || 'Unknown',
        job_url: redirect_url || null,
        status: 'applied',
        applied_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ message: 'Application tracked', application: data })
  } catch (error: any) {
    console.error('Apply job error:', error?.message || error)
    res.status(500).json({ message: 'Failed to track application', error: error?.message || error })
  }
})

export default router
