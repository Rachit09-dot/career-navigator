import express from 'express'
import { geminiGenerate } from '../utils/gemini'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = express.Router()

router.post('/ai-bullets', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { role, company, context } = req.body
    if (!role) return res.status(400).json({ message: 'role is required' })

    const prompt = `Generate 4 strong resume bullet points for this role.

Role: ${role}
Company: ${company || 'a tech company'}
Context: ${context || 'general responsibilities'}

Rules:
- Start each with a strong action verb (Developed, Built, Led, Optimized...)
- Include quantifiable metrics where possible (X%, X users, X% improvement)
- Keep each under 120 characters
- Make ATS-friendly and impactful
- Relevant to Indian job market

Return ONLY a JSON array of 4 strings, no markdown:
["bullet 1", "bullet 2", "bullet 3", "bullet 4"]`

    let bullets: string[]
    try {
      const text = await geminiGenerate(prompt)
      const match = text.match(/\[[\s\S]*\]/)
      bullets = match ? JSON.parse(match[0]) : getFallbackBullets(role)
    } catch {
      bullets = getFallbackBullets(role)
    }

    res.json({ bullets })
  } catch (err: any) {
    console.error('[resume/ai-bullets]', err?.message)
    res.status(500).json({ message: 'Failed to generate bullets' })
  }
})

function getFallbackBullets(role: string): string[] {
  const r = role.toLowerCase()
  if (r.includes('software') || r.includes('developer') || r.includes('engineer')) {
    return [
      'Developed and maintained RESTful APIs using Node.js, improving response time by 30%.',
      'Built reusable React components used across 5+ modules, reducing development time by 40%.',
      'Collaborated with cross-functional team of 8 engineers, delivering 3 sprint milestones on time.',
      'Wrote unit tests achieving 85% code coverage, reducing production bugs by 25%.',
    ]
  }
  if (r.includes('data') || r.includes('analyst')) {
    return [
      'Analyzed datasets of 500K+ records using Python and SQL to identify key business trends.',
      'Built interactive dashboards in Power BI, reducing reporting time by 60%.',
      'Developed predictive models with 87% accuracy to forecast quarterly revenue.',
      'Automated data cleaning pipeline saving 15 hours of manual work per week.',
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
