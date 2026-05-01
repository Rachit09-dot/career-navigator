import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = express.Router()

// AI bullet point suggestions for resume
router.post('/ai-bullets', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { role, company, context } = req.body
    if (!role) return res.status(400).json({ message: 'role is required' })

    let bullets: string[]

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const prompt = `Generate 4 strong resume bullet points for this role.

Role: ${role}
Company: ${company || 'a tech company'}
Context/Notes: ${context || 'general responsibilities'}

Rules:
- Start each bullet with a strong action verb (Developed, Built, Implemented, Led, Optimized, etc.)
- Include quantifiable metrics where possible (X%, X users, X% improvement)
- Keep each bullet under 120 characters
- Make them ATS-friendly and impactful
- Relevant to Indian job market

Return ONLY a JSON array of 4 strings, no markdown:
["bullet 1", "bullet 2", "bullet 3", "bullet 4"]`

      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      bullets = jsonMatch ? JSON.parse(jsonMatch[0]) : getFallbackBullets(role)
    } catch {
      bullets = getFallbackBullets(role)
    }

    res.json({ bullets })
  } catch (error) {
    console.error('AI bullets error:', error)
    res.status(500).json({ message: 'Failed to generate bullets' })
  }
})

function getFallbackBullets(role: string): string[] {
  const r = role.toLowerCase()
  if (r.includes('software') || r.includes('developer') || r.includes('engineer')) {
    return [
      'Developed and maintained RESTful APIs using Node.js, improving response time by 30%.',
      'Built reusable React components used across 5+ modules, reducing development time by 40%.',
      'Collaborated with cross-functional team of 8 engineers in agile environment, delivering 3 sprint milestones on time.',
      'Wrote unit tests achieving 85% code coverage, reducing production bugs by 25%.',
    ]
  }
  if (r.includes('data') || r.includes('analyst')) {
    return [
      'Analyzed datasets of 500K+ records using Python and SQL to identify key business trends.',
      'Built interactive dashboards in Power BI, reducing reporting time by 60% for stakeholders.',
      'Developed predictive models with 87% accuracy to forecast quarterly revenue.',
      'Automated data cleaning pipeline saving 15 hours of manual work per week.',
    ]
  }
  if (r.includes('intern')) {
    return [
      'Assisted in developing 3 key features for the core product, contributing to 15% user growth.',
      'Collaborated with senior engineers to debug and resolve 20+ critical issues in production.',
      'Documented API endpoints and created technical guides used by the entire development team.',
      'Participated in daily standups and sprint planning, completing all assigned tasks on schedule.',
    ]
  }
  return [
    'Led cross-functional initiatives resulting in 20% improvement in team productivity.',
    'Managed end-to-end project delivery for 3 major client accounts worth ₹50L+ combined.',
    'Developed and implemented process improvements reducing operational costs by 15%.',
    'Collaborated with stakeholders to define requirements and deliver solutions on time.',
  ]
}

export default router
