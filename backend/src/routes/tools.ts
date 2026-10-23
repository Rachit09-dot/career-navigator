import express from 'express'
import { geminiJSON } from '../utils/gemini'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import fetch from 'node-fetch'

const router = express.Router()

// ── ATS Resume Scanner ────────────────────────────────────────────────────────
router.post('/ats-scan', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { resumeText, jobDescription } = req.body
    if (!resumeText?.trim() || !jobDescription?.trim())
      return res.status(400).json({ message: 'resumeText and jobDescription are required' })
    if (resumeText.length > 10000)
      return res.status(400).json({ message: 'Resume text too long (max 10,000 chars)' })

    const prompt = `You are an ATS expert. Analyze this resume against the job description.

JOB DESCRIPTION:
${jobDescription.slice(0, 2000)}

RESUME TEXT:
${resumeText.slice(0, 5000)}

Return ONLY valid JSON (no markdown):
{
  "overallScore": 72,
  "breakdown": { "keywordMatch": 65, "skillsMatch": 80, "experienceMatch": 70, "educationMatch": 85, "formattingScore": 75 },
  "matchedKeywords": ["keyword1"],
  "missingKeywords": ["keyword1"],
  "missingSkills": ["skill1"],
  "sectionChecks": { "hasContactInfo": true, "hasSummary": false, "hasExperience": true, "hasEducation": true, "hasSkills": true },
  "formattingIssues": ["Issue 1"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "verdict": "Good Match",
  "disclaimer": "This is an estimated ATS compatibility score. Actual ATS systems vary by employer."
}`

    const analysis = await geminiJSON(prompt)
    if (!analysis) return res.status(503).json({ message: 'ATS analysis temporarily unavailable. Please try again.' })
    res.json(analysis)
  } catch (err: any) {
    console.error('[ats-scan]', err?.message)
    res.status(500).json({ message: 'Failed to analyze resume' })
  }
})

// ── Salary Intelligence ───────────────────────────────────────────────────────
router.post('/salary', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { role, location = 'India', experience = 'Fresher' } = req.body
    if (!role) return res.status(400).json({ message: 'role is required' })

    const prompt = `Provide salary intelligence for the Indian job market.

Role: ${role}
Location: ${location}
Experience Level: ${experience}

Return ONLY valid JSON (salaries in INR LPA):
{
  "role": "${role}",
  "location": "${location}",
  "experienceLevel": "${experience}",
  "salaryRanges": {
    "fresher": { "min": 3, "max": 6, "median": 4.5 },
    "junior": { "min": 5, "max": 12, "median": 8 },
    "mid": { "min": 10, "max": 22, "median": 16 },
    "senior": { "min": 18, "max": 40, "median": 28 }
  },
  "topPayingCompanies": ["Company1", "Company2", "Company3", "Company4", "Company5"],
  "topPayingCities": ["City1", "City2", "City3"],
  "inDemandSkills": ["skill1", "skill2", "skill3", "skill4"],
  "growthOutlook": "High",
  "keyFactors": ["factor1", "factor2"],
  "disclaimer": "AI-estimated ranges for Indian job market. Verify with Glassdoor, LinkedIn, or Naukri.",
  "dataNote": "AI-estimated ranges as of 2024-2025"
}`

    const data = await geminiJSON(prompt)
    if (!data) return res.status(503).json({ message: 'Salary data temporarily unavailable.' })
    res.json(data)
  } catch (err: any) {
    console.error('[salary]', err?.message)
    res.status(500).json({ message: 'Failed to fetch salary data' })
  }
})

// ── Company Interview Preparation ─────────────────────────────────────────────
router.post('/company-prep', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { company, role } = req.body
    if (!company || !role) return res.status(400).json({ message: 'company and role are required' })

    const prompt = `Create interview preparation material for ${company} — ${role}.

Return ONLY valid JSON (no markdown):
{
  "company": "${company}",
  "role": "${role}",
  "interviewProcess": ["Round 1: Online Assessment", "Round 2: Technical Interview", "Round 3: HR Interview"],
  "topicAreas": [
    { "area": "Data Structures & Algorithms", "importance": "High", "topics": ["Arrays", "Trees", "Graphs"] }
  ],
  "practiceQuestions": [
    { "question": "Practice question?", "category": "Technical", "difficulty": "Medium" },
    { "question": "HR question?", "category": "HR", "difficulty": "Easy" }
  ],
  "preparationPlan": [
    { "week": 1, "focus": "Core concepts", "tasks": ["Task 1", "Task 2"] }
  ],
  "keySkillsToHighlight": ["skill1", "skill2", "skill3"],
  "companyValues": ["value1", "value2"],
  "disclaimer": "AI-generated practice material. Actual interview questions are proprietary."
}`

    const prep = await geminiJSON(prompt)
    if (!prep) return res.status(503).json({ message: 'Company prep data temporarily unavailable.' })
    res.json(prep)
  } catch (err: any) {
    console.error('[company-prep]', err?.message)
    res.status(500).json({ message: 'Failed to generate preparation material' })
  }
})

// ── Outreach Message Generator ────────────────────────────────────────────────
router.post('/outreach', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { type, role, company, recipientRole, tone = 'Professional', userContext } = req.body
    if (!type || !role) return res.status(400).json({ message: 'type and role are required' })

    const prompt = `Generate a professional outreach message draft.

Type: ${type}
Role: ${role}
Company: ${company || 'the company'}
Recipient: ${recipientRole || 'Hiring Manager'}
Tone: ${tone}
Context: ${userContext || 'A job seeker interested in this role'}

Rules: Do NOT fabricate relationships. Keep under 200 words. Be genuine.

Return ONLY valid JSON (no markdown):
{
  "subject": "Email subject line",
  "message": "Full message body here",
  "tips": ["Tip 1", "Tip 2"],
  "disclaimer": "This is a draft template. Customize before sending."
}`

    const draft = await geminiJSON(prompt)
    if (!draft) return res.status(503).json({ message: 'Message generation temporarily unavailable.' })
    res.json(draft)
  } catch (err: any) {
    console.error('[outreach]', err?.message)
    res.status(500).json({ message: 'Failed to generate outreach message' })
  }
})

// ── GitHub Portfolio Analyzer ─────────────────────────────────────────────────
router.post('/github-analyze', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { username } = req.body
    if (!username?.trim()) return res.status(400).json({ message: 'GitHub username is required' })

    const cleanUsername = username.trim().replace(/^https?:\/\/github\.com\//, '').split('/')[0]
    if (!/^[a-zA-Z0-9-]+$/.test(cleanUsername))
      return res.status(400).json({ message: 'Invalid GitHub username' })

    const headers: any = { 'User-Agent': 'CareerNavigator/1.0', Accept: 'application/vnd.github.v3+json' }
    if (process.env.GITHUB_TOKEN) headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`

    let userData: any, repoData: any[]
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${cleanUsername}`, { headers, signal: AbortSignal.timeout(10000) }),
        fetch(`https://api.github.com/users/${cleanUsername}/repos?sort=updated&per_page=10`, { headers, signal: AbortSignal.timeout(10000) }),
      ])
      if (userRes.status === 404) return res.status(404).json({ message: `GitHub user '${cleanUsername}' not found` })
      if (userRes.status === 403) return res.status(429).json({ message: 'GitHub API rate limit reached. Try again later.' })
      if (!userRes.ok) return res.status(502).json({ message: 'Failed to fetch GitHub data' })
      userData = await userRes.json()
      repoData = reposRes.ok ? (await reposRes.json()) as any[] : []
    } catch {
      return res.status(502).json({ message: 'Could not reach GitHub API. Check username and try again.' })
    }

    const repoSummary = repoData.slice(0, 10).map(r => ({
      name: r.name, description: r.description, language: r.language,
      stars: r.stargazers_count, forks: r.forks_count, topics: r.topics || [],
    }))
    const languages = [...new Set(repoSummary.map(r => r.language).filter(Boolean))]

    const prompt = `Analyze this GitHub profile and give portfolio improvement suggestions.

Username: ${cleanUsername}
Public repos: ${userData.public_repos}
Followers: ${userData.followers}
Bio: ${userData.bio || 'None'}
Languages: ${languages.join(', ') || 'None'}

Recent repos:
${repoSummary.map(r => `- ${r.name}: ${r.description || 'No description'} (${r.language || 'Unknown'}, ${r.stars} stars)`).join('\n')}

Return ONLY valid JSON (no markdown):
{
  "overallScore": 65,
  "breakdown": { "projectDiversity": 70, "documentation": 50, "activityLevel": 60, "codeQuality": 65, "portfolioPresentation": 55 },
  "strengths": ["strength1", "strength2"],
  "improvements": [{ "area": "README Quality", "suggestion": "Add detailed README", "priority": "High" }],
  "topProjects": ["repo1", "repo2"],
  "languageDiversity": ${languages.length},
  "recruitersWillNotice": ["positive thing 1"],
  "quickWins": ["Quick improvement 1", "Quick improvement 2"],
  "disclaimer": "Analysis based on public repository metadata only."
}`

    const analysis = await geminiJSON(prompt)

    res.json({
      profile: { username: userData.login, name: userData.name, bio: userData.bio, publicRepos: userData.public_repos, followers: userData.followers, avatarUrl: userData.avatar_url },
      repos: repoSummary, languages, analysis,
    })
  } catch (err: any) {
    console.error('[github-analyze]', err?.message)
    res.status(500).json({ message: 'Failed to analyze GitHub profile' })
  }
})

export default router
