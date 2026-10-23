"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
const express_1 = __importDefault(require("express"));
const db_1 = require("../utils/db");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// ── GET /api/notifications — get user notifications ───────────────────────────
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data } = await db_1.supabase
            .from('notifications')
            .select('*')
            .eq('user_id', req.userId)
            .order('created_at', { ascending: false })
            .limit(30);
        res.json(data || []);
    }
    catch (err) {
        console.error('[notifications/get]', err?.message);
        res.json([]);
    }
});
// ── GET /api/notifications/unread-count ──────────────────────────────────────
router.get('/unread-count', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data } = await db_1.supabase
            .from('notifications')
            .select('id')
            .eq('user_id', req.userId)
            .eq('is_read', false);
        res.json({ count: data?.length || 0 });
    }
    catch {
        res.json({ count: 0 });
    }
});
// ── POST /api/notifications/mark-read — mark one or all as read ───────────────
router.post('/mark-read', auth_1.authMiddleware, async (req, res) => {
    try {
        const { id, all } = req.body;
        if (all) {
            await db_1.supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', req.userId)
                .eq('is_read', false);
        }
        else if (id) {
            await db_1.supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', id)
                .eq('user_id', req.userId);
        }
        res.json({ message: 'Marked as read' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to update notification' });
    }
});
// ── POST /api/notifications — create a notification (internal use) ────────────
// This can be called internally by other routes to push notifications
async function createNotification(userId, title, message, type = 'system', link) {
    try {
        await db_1.supabase.from('notifications').insert({
            user_id: userId,
            title,
            message,
            type,
            link: link || null,
            is_read: false,
        });
    }
    catch (err) {
        console.error('[notifications/create]', err?.message);
    }
}
// ── DELETE /api/notifications/:id ────────────────────────────────────────────
router.delete('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        await db_1.supabase
            .from('notifications')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.userId);
        res.json({ message: 'Deleted' });
    }
    catch {
        res.status(500).json({ message: 'Failed to delete notification' });
    }
});
exports.default = router;
