"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../utils/db");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all applications for user
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data: applications, error } = await db_1.supabase
            .from('applications')
            .select('*')
            .eq('user_id', req.userId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json(applications || []);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get applications' });
    }
});
// Get stats
router.get('/stats', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data: apps } = await db_1.supabase
            .from('applications')
            .select('status')
            .eq('user_id', req.userId);
        const stats = {
            total: apps?.length || 0,
            applied: apps?.filter(a => a.status === 'applied').length || 0,
            interviews: apps?.filter(a => ['interview_scheduled', 'technical', 'hr_round'].includes(a.status)).length || 0,
            offers: apps?.filter(a => a.status === 'offer').length || 0,
            rejected: apps?.filter(a => a.status === 'rejected').length || 0,
        };
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get stats' });
    }
});
// Add application
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { job_title, company, job_url, notes, status, applied_date } = req.body;
        if (!job_title || !company) {
            return res.status(400).json({ message: 'Job title and company required' });
        }
        const { data, error } = await db_1.supabase
            .from('applications')
            .insert({
            user_id: req.userId,
            job_title,
            company,
            job_url,
            notes,
            status: status || 'applied',
            applied_date: applied_date || new Date().toISOString().split('T')[0],
        })
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to add application' });
    }
});
// Update application status
router.put('/:id/status', auth_1.authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const { data, error } = await db_1.supabase
            .from('applications')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .eq('user_id', req.userId)
            .select()
            .single();
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update application status' });
    }
});
// Update application notes
router.put('/:id/notes', auth_1.authMiddleware, async (req, res) => {
    try {
        const { notes } = req.body;
        const { data, error } = await db_1.supabase
            .from('applications')
            .update({ notes, updated_at: new Date().toISOString() })
            .eq('id', req.params.id)
            .eq('user_id', req.userId)
            .select()
            .single();
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update application notes' });
    }
});
// Update application
router.put('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { status, notes, salary_offered } = req.body;
        const updates = { updated_at: new Date().toISOString() };
        if (status !== undefined)
            updates.status = status;
        if (notes !== undefined)
            updates.notes = notes;
        if (salary_offered !== undefined)
            updates.salary_offered = salary_offered;
        const { data, error } = await db_1.supabase
            .from('applications')
            .update(updates)
            .eq('id', req.params.id)
            .eq('user_id', req.userId)
            .select()
            .single();
        if (error)
            throw error;
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update application' });
    }
});
// Delete application
router.delete('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { error } = await db_1.supabase
            .from('applications')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.userId);
        if (error)
            throw error;
        res.json({ message: 'Deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete application' });
    }
});
exports.default = router;
