"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../utils/db");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// ── GET /api/resume-data — load saved resume ──────────────────────────────────
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data } = await db_1.supabase
            .from('resumes')
            .select('id, resume_data, template, updated_at')
            .eq('user_id', req.userId)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        if (!data)
            return res.json(null);
        res.json({
            id: data.id,
            resumeData: data.resume_data,
            template: data.template || 'classic',
            updatedAt: data.updated_at,
        });
    }
    catch (err) {
        console.error('[resume-data/get]', err?.message);
        res.status(500).json({ message: 'Failed to load resume' });
    }
});
// ── POST /api/resume-data — save / upsert resume ──────────────────────────────
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { resumeData, template = 'classic' } = req.body;
        if (!resumeData) {
            return res.status(400).json({ message: 'resumeData is required' });
        }
        // Check if user already has a saved resume
        const { data: existing } = await db_1.supabase
            .from('resumes')
            .select('id')
            .eq('user_id', req.userId)
            .maybeSingle();
        let saved;
        if (existing) {
            // Update
            const { data, error } = await db_1.supabase
                .from('resumes')
                .update({
                resume_data: resumeData,
                template,
                updated_at: new Date().toISOString(),
            })
                .eq('id', existing.id)
                .eq('user_id', req.userId)
                .select()
                .single();
            if (error)
                throw error;
            saved = data;
        }
        else {
            // Insert
            const { data, error } = await db_1.supabase
                .from('resumes')
                .insert({
                user_id: req.userId,
                resume_data: resumeData,
                template,
            })
                .select()
                .single();
            if (error)
                throw error;
            saved = data;
        }
        res.json({
            id: saved.id,
            message: 'Resume saved successfully',
            updatedAt: saved.updated_at,
        });
    }
    catch (err) {
        console.error('[resume-data/save]', err?.message);
        res.status(500).json({ message: 'Failed to save resume' });
    }
});
exports.default = router;
