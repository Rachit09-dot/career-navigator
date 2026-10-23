import express from 'express'
import { supabase } from '../utils/db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = express.Router()

// ── GET /api/resume-data — load saved resume ──────────────────────────────────
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { data } = await supabase
      .from('resumes')
      .select('id, resume_data, template, updated_at')
      .eq('user_id', req.userId!)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!data) return res.json(null)

    res.json({
      id: data.id,
      resumeData: data.resume_data,
      template: data.template || 'classic',
      updatedAt: data.updated_at,
    })
  } catch (err: any) {
    console.error('[resume-data/get]', err?.message)
    res.status(500).json({ message: 'Failed to load resume' })
  }
})

// ── POST /api/resume-data — save / upsert resume ──────────────────────────────
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { resumeData, template = 'classic' } = req.body

    if (!resumeData) {
      return res.status(400).json({ message: 'resumeData is required' })
    }

    // Check if user already has a saved resume
    const { data: existing } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', req.userId!)
      .maybeSingle()

    let saved: any
    if (existing) {
      // Update
      const { data, error } = await supabase
        .from('resumes')
        .update({
          resume_data: resumeData,
          template,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .eq('user_id', req.userId!)
        .select()
        .single()
      if (error) throw error
      saved = data
    } else {
      // Insert
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: req.userId,
          resume_data: resumeData,
          template,
        })
        .select()
        .single()
      if (error) throw error
      saved = data
    }

    res.json({
      id: saved.id,
      message: 'Resume saved successfully',
      updatedAt: saved.updated_at,
    })
  } catch (err: any) {
    console.error('[resume-data/save]', err?.message)
    res.status(500).json({ message: 'Failed to save resume' })
  }
})

export default router
