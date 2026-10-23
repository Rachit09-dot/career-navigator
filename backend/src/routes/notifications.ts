import express from 'express'
import { supabase } from '../utils/db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = express.Router()

// ── GET /api/notifications — get user notifications ───────────────────────────
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.userId!)
      .order('created_at', { ascending: false })
      .limit(30)

    res.json(data || [])
  } catch (err: any) {
    console.error('[notifications/get]', err?.message)
    res.json([])
  }
})

// ── GET /api/notifications/unread-count ──────────────────────────────────────
router.get('/unread-count', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { data } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', req.userId!)
      .eq('is_read', false)

    res.json({ count: data?.length || 0 })
  } catch {
    res.json({ count: 0 })
  }
})

// ── POST /api/notifications/mark-read — mark one or all as read ───────────────
router.post('/mark-read', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id, all } = req.body

    if (all) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', req.userId!)
        .eq('is_read', false)
    } else if (id) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', req.userId!)
    }

    res.json({ message: 'Marked as read' })
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update notification' })
  }
})

// ── POST /api/notifications — create a notification (internal use) ────────────
// This can be called internally by other routes to push notifications
export async function createNotification(
  userId: string | number,
  title: string,
  message: string,
  type: 'xp' | 'badge' | 'application' | 'reminder' | 'system' = 'system',
  link?: string
) {
  try {
    await supabase.from('notifications').insert({
      user_id: userId,
      title,
      message,
      type,
      link: link || null,
      is_read: false,
    })
  } catch (err: any) {
    console.error('[notifications/create]', err?.message)
  }
}

// ── DELETE /api/notifications/:id ────────────────────────────────────────────
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId!)

    res.json({ message: 'Deleted' })
  } catch {
    res.status(500).json({ message: 'Failed to delete notification' })
  }
})

export default router
