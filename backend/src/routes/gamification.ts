import express from 'express'
import { supabase } from '../utils/db'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import { createNotification } from './notifications'

const router = express.Router()

// XP values for each action
export const XP_RULES = {
  profile_complete:     { xp: 50,  label: 'Profile Completed',        once: true },
  career_dna:           { xp: 30,  label: 'Career DNA Analyzed',      once: false },
  skill_gap:            { xp: 20,  label: 'Skill Gap Analyzed',       once: false },
  skill_completed:      { xp: 10,  label: 'Skill Mastered',           once: false },
  job_applied:          { xp: 15,  label: 'Job Applied',              once: false },
  mock_interview:       { xp: 40,  label: 'Mock Interview Completed', once: false },
  interview_score_80:   { xp: 25,  label: 'Interview Score 80%+',     once: false },
  mcq_completed:        { xp: 20,  label: 'MCQ Test Completed',       once: false },
  mcq_score_80:         { xp: 15,  label: 'MCQ Score 80%+',           once: false },
  roadmap_milestone:    { xp: 10,  label: 'Roadmap Milestone Done',   once: false },
  first_login:          { xp: 10,  label: 'First Login',              once: true  },
} as const

export type XPAction = keyof typeof XP_RULES

// Badge definitions
export const BADGES = [
  { id: 'first_steps',     name: 'First Steps',      icon: '🚀', desc: 'Complete your profile',          xpRequired: 50  },
  { id: 'career_seeker',   name: 'Career Seeker',    icon: '🧭', desc: 'Reach 100 XP',                   xpRequired: 100 },
  { id: 'skill_builder',   name: 'Skill Builder',    icon: '🔨', desc: 'Reach 200 XP',                   xpRequired: 200 },
  { id: 'interview_ready', name: 'Interview Ready',  icon: '🎯', desc: 'Complete a mock interview',       xpRequired: 150 },
  { id: 'knowledge_test',  name: 'Knowledge Test',   icon: '📝', desc: 'Score 80%+ on an MCQ test',      xpRequired: 120 },
  { id: 'path_finder',     name: 'Path Finder',      icon: '🗺️', desc: 'Generate a learning roadmap',    xpRequired: 80  },
  { id: 'achiever',        name: 'Achiever',          icon: '⭐', desc: 'Reach 500 XP',                   xpRequired: 500 },
  { id: 'elite',           name: 'Elite',             icon: '👑', desc: 'Reach 1000 XP',                  xpRequired: 1000},
]

// ── Award XP (called internally by other routes) ──────────────────────────────
export async function awardXP(userId: number | string, action: XPAction): Promise<{ xp: number; newTotal: number; newBadges: string[] }> {
  try {
    const rule = XP_RULES[action]

    // Get current XP record
    const { data: existing } = await supabase
      .from('user_xp')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    const currentXP = existing?.total_xp || 0
    const earnedActions: string[] = existing?.earned_actions ? JSON.parse(existing.earned_actions) : []
    const earnedBadges: string[] = existing?.badges ? JSON.parse(existing.badges) : []

    // Check "once" constraint
    if (rule.once && earnedActions.includes(action)) {
      return { xp: 0, newTotal: currentXP, newBadges: [] }
    }

    const newTotal = currentXP + rule.xp
    const newEarnedActions = rule.once ? [...earnedActions, action] : earnedActions

    // Check new badges
    const newBadges = BADGES
      .filter(b => !earnedBadges.includes(b.id) && newTotal >= b.xpRequired)
      .map(b => b.id)
    const allBadges = [...earnedBadges, ...newBadges]

    // Upsert XP record
    if (existing) {
      await supabase.from('user_xp').update({
        total_xp: newTotal,
        earned_actions: JSON.stringify(newEarnedActions),
        badges: JSON.stringify(allBadges),
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId)
    } else {
      await supabase.from('user_xp').insert({
        user_id: userId,
        total_xp: newTotal,
        earned_actions: JSON.stringify(newEarnedActions),
        badges: JSON.stringify(allBadges),
      })
    }

    // Log XP event
    await supabase.from('xp_events').insert({
      user_id: userId,
      action,
      xp_earned: rule.xp,
      label: rule.label,
    })

    // Create notification for badge unlocks
    if (newBadges.length > 0) {
      for (const badgeId of newBadges) {
        const badge = BADGES.find(b => b.id === badgeId)
        if (badge) {
          await createNotification(
            userId,
            `🏅 Badge Unlocked: ${badge.name}`,
            `You earned the "${badge.name}" badge — ${badge.desc}`,
            'badge',
            '/achievements'
          )
        }
      }
    }

    // Create notification for level-up
    const oldLevel = Math.floor(currentXP / 100) + 1
    const newLevel = Math.floor(newTotal / 100) + 1
    if (newLevel > oldLevel) {
      await createNotification(
        userId,
        `⬆️ Level Up! You're now Level ${newLevel}`,
        `You gained ${rule.xp} XP from "${rule.label}" and reached Level ${newLevel}!`,
        'xp',
        '/achievements'
      )
    }

    return { xp: rule.xp, newTotal, newBadges }
  } catch (err: any) {
    console.error('[xp] awardXP error:', err?.message)
    return { xp: 0, newTotal: 0, newBadges: [] }
  }
}

// ── GET /api/gamification/me ──────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { data: xpData } = await supabase
      .from('user_xp')
      .select('*')
      .eq('user_id', req.userId!)
      .maybeSingle()

    const totalXP = xpData?.total_xp || 0
    const earnedBadgeIds: string[] = xpData?.badges ? JSON.parse(xpData.badges) : []

    // Get recent XP events
    const { data: events } = await supabase
      .from('xp_events')
      .select('action, xp_earned, label, created_at')
      .eq('user_id', req.userId!)
      .order('created_at', { ascending: false })
      .limit(10)

    // Calculate level
    const level = Math.floor(totalXP / 100) + 1
    const xpInLevel = totalXP % 100
    const xpToNextLevel = 100 - xpInLevel

    const earnedBadges = BADGES.filter(b => earnedBadgeIds.includes(b.id))
    const nextBadge = BADGES.find(b => !earnedBadgeIds.includes(b.id) && b.xpRequired > totalXP)

    res.json({
      totalXP,
      level,
      xpInLevel,
      xpToNextLevel,
      earnedBadges,
      nextBadge: nextBadge ? { ...nextBadge, xpNeeded: nextBadge.xpRequired - totalXP } : null,
      recentEvents: events || [],
      allBadges: BADGES,
    })
  } catch {
    res.json({ totalXP: 0, level: 1, xpInLevel: 0, xpToNextLevel: 100, earnedBadges: [], recentEvents: [], allBadges: BADGES })
  }
})

// ── GET /api/gamification/leaderboard ─────────────────────────────────────────
router.get('/leaderboard', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { data: topUsers } = await supabase
      .from('user_xp')
      .select('user_id, total_xp, badges')
      .order('total_xp', { ascending: false })
      .limit(10)

    if (!topUsers?.length) return res.json([])

    // Get names (only first name for privacy)
    const leaderboard = await Promise.all(
      topUsers.map(async (u: Record<string, any>, rank: number) => {
        const { data: user } = await supabase
          .from('users')
          .select('name')
          .eq('id', u.user_id)
          .maybeSingle()
        const name = user?.name ? user.name.split(' ')[0] + (user.name.split(' ').length > 1 ? ' ' + user.name.split(' ')[1][0] + '.' : '') : 'User'
        const badgeIds = u.badges ? JSON.parse(u.badges) : []
        const topBadge = BADGES.filter(b => badgeIds.includes(b.id)).pop()
        return {
          rank: rank + 1,
          name,
          xp: u.total_xp,
          level: Math.floor(u.total_xp / 100) + 1,
          topBadge: topBadge?.icon || '🎯',
          isMe: u.user_id === req.userId,
        }
      })
    )

    res.json(leaderboard)
  } catch {
    res.json([])
  }
})

export default router
