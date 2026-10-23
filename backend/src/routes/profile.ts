import express from 'express'
import { supabase } from '../utils/db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Get profile
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing from token' })
    }

    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', req.userId)
      .maybeSingle()

    // Ensure profile row exists
    if (!profile) {
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({ user_id: req.userId })
        .select()
        .maybeSingle()
      profile = newProfile || {}
    }

    const { data: user } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', req.userId)
      .maybeSingle()

    res.json({ ...profile, name: user?.name, email: user?.email })
  } catch (error: any) {
    console.error('Failed to get profile:', error?.message || error)
    res.status(500).json({ message: 'Failed to get profile' })
  }
})

// Update profile
router.put('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing from token' })
    }

    const {
      name, phone, location, bio, college, degree, current_year, field_of_study,
      skills, linkedin_url, github_url, portfolio_url, career_goal, experience,
      education, certifications
    } = req.body

    // Update user name if provided
    if (typeof name === 'string' && name.trim()) {
      await supabase
        .from('users')
        .update({ name: name.trim() })
        .eq('id', req.userId)
    }

    // Ensure profile row exists for this user before updating
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', req.userId)
      .maybeSingle()

    if (!existingProfile) {
      await supabase.from('profiles').insert({ user_id: req.userId })
    }

    // Only update fields that were explicitly provided
    const profileUpdates: Record<string, any> = {}
    if (phone !== undefined) profileUpdates.phone = phone
    if (location !== undefined) profileUpdates.location = location
    if (bio !== undefined) profileUpdates.bio = bio
    if (college !== undefined) profileUpdates.college = college
    if (degree !== undefined) profileUpdates.degree = degree
    if (current_year !== undefined) profileUpdates.current_year = current_year
    if (field_of_study !== undefined) profileUpdates.field_of_study = field_of_study
    if (linkedin_url !== undefined) profileUpdates.linkedin_url = linkedin_url
    if (github_url !== undefined) profileUpdates.github_url = github_url
    if (portfolio_url !== undefined) profileUpdates.portfolio_url = portfolio_url
    if (career_goal !== undefined) profileUpdates.career_goal = career_goal
    if (experience !== undefined) profileUpdates.experience = experience
    if (education !== undefined) profileUpdates.education = education
    if (certifications !== undefined) profileUpdates.certifications = certifications

    if (skills !== undefined) {
      if (typeof skills === 'string') {
        profileUpdates.skills = skills.trim()
          ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : []
      } else if (Array.isArray(skills)) {
        profileUpdates.skills = skills
      } else {
        profileUpdates.skills = []
      }
    }

    let updatedProfile = existingProfile || {}

    if (Object.keys(profileUpdates).length > 0) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('user_id', req.userId)
        .select()
        .single()

      if (error) {
        console.error('Update profile database error:', error?.message || error)
        return res.status(500).json({ message: 'Failed to update profile' })
      }
      updatedProfile = profile || updatedProfile
    }

    // Calculate profile completion
    const mergedData = { ...existingProfile, ...profileUpdates, name: name || existingProfile?.name }
    const completion = calculateCompletion(mergedData)

    // Update profile_complete in users table
    await supabase.from('users').update({ profile_complete: completion }).eq('id', req.userId)

    res.json({ ...updatedProfile, completion })
  } catch (error: any) {
    console.error('Update profile error:', error?.message || error)
    res.status(500).json({ message: 'Failed to update profile' })
  }
})

function calculateCompletion(data: any): number {
  let score = 0
  if (data?.name || data?.college) score += 30
  if (data?.skills && data?.skills.length > 0) score += 20
  if (data?.linkedin_url || data?.github_url || data?.portfolio_url) score += 10
  if (data?.education && (typeof data.education === 'string' ? data.education.trim().length > 0 : data.education.length > 0)) score += 20
  if (data?.experience && (typeof data.experience === 'string' ? data.experience.trim().length > 0 : data.experience.length > 0)) score += 15
  if (data?.certifications && (typeof data.certifications === 'string' ? data.certifications.trim().length > 0 : data.certifications.length > 0)) score += 5
  return Math.min(score, 100)
}

export default router

