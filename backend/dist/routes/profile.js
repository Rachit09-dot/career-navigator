"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../utils/db");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get profile
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data: profile } = await db_1.supabase
            .from('profiles')
            .select('*')
            .eq('user_id', req.userId)
            .single();
        const { data: user } = await db_1.supabase
            .from('users')
            .select('name, email')
            .eq('id', req.userId)
            .single();
        res.json({ ...profile, name: user?.name, email: user?.email });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get profile' });
    }
});
// Update profile
router.put('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { name, phone, location, bio, college, degree, current_year, field_of_study, skills, linkedin_url, github_url, portfolio_url, career_goal, experience, education, certifications } = req.body;
        // Update user name if provided
        if (name) {
            await db_1.supabase.from('users').update({ name }).eq('id', req.userId);
        }
        // Calculate profile completion
        const completion = calculateCompletion(req.body);
        // Convert skills string to array if needed
        let skillsValue = skills;
        if (typeof skills === 'string' && skills.trim()) {
            skillsValue = skills.split(',').map((s) => s.trim()).filter(Boolean);
        }
        const { data: profile, error } = await db_1.supabase
            .from('profiles')
            .update({
            phone, location, bio, college, degree, current_year, field_of_study,
            skills: skillsValue, linkedin_url, github_url, portfolio_url, career_goal,
            experience, education, certifications,
            updated_at: new Date().toISOString()
        })
            .eq('user_id', req.userId)
            .select()
            .single();
        if (error)
            throw error;
        // Update profile_complete in users table
        await db_1.supabase.from('users').update({ profile_complete: completion }).eq('id', req.userId);
        res.json({ ...profile, completion });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});
function calculateCompletion(data) {
    let score = 0;
    if (data.name || data.college)
        score += 30;
    if (data.skills && data.skills.length > 0)
        score += 20;
    if (data.linkedin_url || data.github_url || data.portfolio_url)
        score += 10;
    if (data.education && data.education.length > 0)
        score += 20;
    if (data.experience && data.experience.length > 0)
        score += 15;
    if (data.certifications && data.certifications.length > 0)
        score += 5;
    return Math.min(score, 100);
}
exports.default = router;
