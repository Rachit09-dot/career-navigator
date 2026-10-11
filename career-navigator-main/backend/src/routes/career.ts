import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '../utils/db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Rate limit: track last call per user (in-memory, simple)
const lastCallMap = new Map<string, number>()

function getGemini() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
}

// Submit career assessment & get AI results
router.post('/assessment', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { answers } = req.body
    if (!answers) return res.status(400).json({ message: 'Answers required' })

    // Rate limit: 1 call per user per 10 minutes
    const now = Date.now()
    const lastCall = lastCallMap.get(String(req.userId!))
    if (lastCall && now - lastCall < 10 * 60 * 1000) {
      // Return cached result from DB instead
      const { data: cached } = await supabase
        .from('career_assessments')
        .select('results')
        .eq('user_id', req.userId)
        .order('completed_date', { ascending: false })
        .limit(1)
        .single()
      if (cached) return res.json({ results: cached.results, cached: true })
    }

    let results: any[]

    try {
      const genAI = getGemini()
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const fieldContext = answers.stream || answers.field || answers._field_of_study || 'General'
      const prompt = `You are a career counselor AI for Indian students. Based on these answers, suggest top 3 career paths.

Student Background:
- Stream/Field: ${fieldContext}
- Answers: ${JSON.stringify(Object.entries(answers).filter(([k]) => !k.startsWith('_')).slice(0, 10))}

CRITICAL RULE: You MUST suggest careers ONLY relevant to "${fieldContext}".
- Law/Legal Studies → Advocate, Legal Advisor, Judge, Corporate Lawyer, Legal Consultant
- Medical/Health → Doctor, Surgeon, Pharmacist, Physiotherapist, Healthcare Manager
- Engineering/CSE/IT → Software Engineer, Data Scientist, DevOps, Product Manager
- Commerce/Finance → CA, Financial Analyst, Investment Banker, Business Analyst
- Mass Communication/Media → Journalist, Content Creator, PR Manager, News Anchor
- Agriculture → Agricultural Officer, Food Scientist, Farm Manager, Agri Researcher
- Arts/Humanities → Civil Services, Content Writer, Historian, Psychologist
- Design → UI/UX Designer, Graphic Designer, Product Designer, Art Director
- Education → Teacher, Professor, Education Consultant, Curriculum Designer
- Hotel Management → Hotel Manager, Chef, Event Manager, Tourism Officer
- Sports → Sports Coach, Sports Analyst, Fitness Trainer, Sports Manager
- Social Work → NGO Manager, Social Worker, Community Developer, Policy Analyst
- Defence → Army Officer, Navy Officer, Air Force Officer, Defence Analyst
- Civil Services → IAS Officer, IPS Officer, IFS Officer, Government Administrator
- Fine Arts → Artist, Art Director, Animator, Creative Director
- Paramedical → Radiologist, Lab Technician, Physiotherapist, Medical Coder
- Diploma/ITI → Electrician, Mechanic, Technician, Supervisor

DO NOT suggest Software Engineer or tech careers for non-tech fields.

Return ONLY valid JSON array (no markdown, no explanation):
[
  {
    "career": "Career Title",
    "match": 85,
    "salary": "₹X-Y LPA",
    "growth": "Very High/High/Medium",
    "skills": ["Skill1", "Skill2", "Skill3"],
    "reason": "One line why this fits their ${fieldContext} background",
    "path": "How to get there in 1-2 sentences"
  }
]`

      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      results = jsonMatch ? JSON.parse(jsonMatch[0]) : getFallbackResults(answers)
    } catch (aiError) {
      console.error('Gemini error, using fallback:', aiError)
      results = getFallbackResults(answers)
    }

    // Save to career_assessments table
    lastCallMap.set(String(req.userId!), now)
    await supabase.from('career_assessments').insert({
      user_id: req.userId,
      assessment_type: 'career_dna',
      results: results,
      completed_date: new Date().toISOString(),
    })

    // Also save to profiles.career_dna for quick access
    await supabase.from('profiles').update({
      career_dna: { results, completedAt: new Date().toISOString() },
    }).eq('user_id', req.userId)

    res.json({ results })
  } catch (error) {
    console.error('Assessment error:', error)
    res.status(500).json({ message: 'Assessment failed' })
  }
})

// Get last assessment results
router.get('/assessment', authMiddleware, async (req: AuthRequest, res) => {
  try {
    // First try career_assessments table
    const { data } = await supabase
      .from('career_assessments')
      .select('results, completed_date')
      .eq('user_id', req.userId)
      .order('completed_date', { ascending: false })
      .limit(1)
      .single()

    if (data?.results?.length) {
      return res.json({ results: data.results, date: data.completed_date })
    }

    // Fallback: check profiles.career_dna
    const { data: profile } = await supabase
      .from('profiles')
      .select('career_dna')
      .eq('user_id', req.userId)
      .single()

    if (profile?.career_dna?.results?.length) {
      return res.json({ results: profile.career_dna.results, date: profile.career_dna.completedAt })
    }

    res.json(null)
  } catch {
    res.json(null)
  }
})

function getFallbackResults(answers: any) {
  const field = (answers.stream || answers.field || answers._field_of_study || '').toLowerCase()
  console.log('🔍 Backend fallback for field:', field) // DEBUG
  
  // Field-specific fallback careers (check for keywords in the field string)
  if (field.includes('law') || field.includes('legal') || field.includes('llb') || field.includes('advocate')) {
    return [
      { career: 'Advocate', match: 85, salary: '₹5-20 LPA', growth: 'High', skills: ['Legal Research', 'Drafting', 'Litigation', 'IPC'], reason: 'Core law career with strong growth' },
      { career: 'Corporate Lawyer', match: 78, salary: '₹8-30 LPA', growth: 'Very High', skills: ['Contract Law', 'M&A', 'Compliance', 'Negotiation'], reason: 'High-paying corporate legal work' },
      { career: 'Legal Advisor', match: 70, salary: '₹6-18 LPA', growth: 'High', skills: ['Advisory', 'Risk Assessment', 'Documentation', 'Compliance'], reason: 'Consulting role with flexible work' },
    ]
  }
  if (field.includes('medical') || field.includes('mbbs') || field.includes('health')) {
    return [
      { career: 'Doctor/Physician', match: 90, salary: '₹8-40 LPA', growth: 'Very High', skills: ['Clinical Skills', 'Diagnosis', 'Patient Care', 'Medical Ethics'], reason: 'Core medical career' },
      { career: 'Healthcare Manager', match: 72, salary: '₹6-20 LPA', growth: 'High', skills: ['Hospital Management', 'Healthcare IT', 'Administration'], reason: 'Management track in healthcare' },
      { career: 'Pharmacist', match: 68, salary: '₹4-12 LPA', growth: 'Medium', skills: ['Pharmacology', 'Drug Dispensing', 'Patient Counseling'], reason: 'Stable healthcare career' },
    ]
  }
  if (field.includes('mass communication') || field.includes('media') || field.includes('journalism')) {
    return [
      { career: 'Journalist', match: 85, salary: '₹4-15 LPA', growth: 'High', skills: ['Writing', 'Research', 'Interviewing', 'Storytelling'], reason: 'Core media career' },
      { career: 'Content Creator', match: 78, salary: '₹5-20 LPA', growth: 'Very High', skills: ['Video Production', 'Social Media', 'SEO', 'Editing'], reason: 'High-growth digital media' },
      { career: 'PR Manager', match: 70, salary: '₹6-18 LPA', growth: 'High', skills: ['Communication', 'Brand Management', 'Crisis Management'], reason: 'Corporate communications role' },
    ]
  }
  if (field.includes('commerce') || field.includes('finance') || field.includes('bcom') || field.includes('bba')) {
    return [
      { career: 'Chartered Accountant', match: 88, salary: '₹8-30 LPA', growth: 'Very High', skills: ['Accounting', 'Taxation', 'Audit', 'Financial Reporting'], reason: 'Top commerce career' },
      { career: 'Financial Analyst', match: 80, salary: '₹6-20 LPA', growth: 'High', skills: ['Excel', 'Financial Modeling', 'Valuation', 'Research'], reason: 'Strong finance career' },
      { career: 'Business Analyst', match: 72, salary: '₹7-18 LPA', growth: 'High', skills: ['Data Analysis', 'SQL', 'Business Strategy', 'Reporting'], reason: 'Bridge between business and tech' },
    ]
  }
  
  // Default engineering fallback
  return [
    { career: 'Software Engineer', match: 80, salary: '₹8-25 LPA', growth: 'Very High', skills: ['Programming', 'Problem Solving', 'System Design'], reason: 'High demand tech career' },
    { career: 'Data Analyst', match: 72, salary: '₹6-18 LPA', growth: 'High', skills: ['SQL', 'Python', 'Excel', 'Visualization'], reason: 'Data-driven career' },
    { career: 'Product Manager', match: 65, salary: '₹12-35 LPA', growth: 'High', skills: ['Strategy', 'Analytics', 'Communication'], reason: 'Leadership + tech blend' },
  ]
}

function getSalary(career: string) {
  const map: Record<string, string> = {
    'Software Engineer': '₹8-25 LPA', 'Data Scientist': '₹10-30 LPA',
    'Product Manager': '₹12-35 LPA', 'UI/UX Designer': '₹6-18 LPA', 'DevOps Engineer': '₹10-28 LPA',
  }
  return map[career] || '₹8-20 LPA'
}
function getGrowth(career: string) {
  const map: Record<string, string> = {
    'Software Engineer': 'Very High', 'Data Scientist': 'High',
    'Product Manager': 'High', 'UI/UX Designer': 'Medium', 'DevOps Engineer': 'Very High',
  }
  return map[career] || 'High'
}
function getSkills(career: string) {
  const map: Record<string, string[]> = {
    'Software Engineer': ['React', 'Node.js', 'System Design', 'DSA'],
    'Data Scientist': ['Python', 'ML', 'SQL', 'Statistics'],
    'Product Manager': ['Strategy', 'Analytics', 'Agile', 'Communication'],
    'UI/UX Designer': ['Figma', 'User Research', 'Prototyping', 'CSS'],
    'DevOps Engineer': ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  }
  return map[career] || []
}

export default router
