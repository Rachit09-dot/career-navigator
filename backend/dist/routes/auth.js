"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../utils/db");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password required' });
        }
        // Check if user exists
        const { data: existing, error: checkError } = await db_1.supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle();
        if (checkError) {
            console.warn('Check user warning:', checkError);
        }
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const { data: user, error } = await db_1.supabase
            .from('users')
            .insert({ name, email, password: hashedPassword })
            .select('id, name, email')
            .single();
        if (error || !user) {
            console.error('Create user error:', error);
            const errStr = String(error?.message || error || '').toLowerCase();
            if (errStr.includes('unique') || errStr.includes('duplicate') || errStr.includes('already exists')) {
                return res.status(400).json({ message: 'User already exists' });
            }
            return res.status(500).json({ message: error?.message || 'Failed to create user' });
        }
        // Create empty profile
        await db_1.supabase.from('profiles').insert({ user_id: user.id });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'careernavigator_secret_key_2024', { expiresIn: '7d' });
        res.status(201).json({
            user: { id: user.id, name: user.name, email: user.email, profileComplete: false },
            token,
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: error?.message || 'Registration failed' });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }
        const { data: user, error } = await db_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();
        if (error || !user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'careernavigator_secret_key_2024', { expiresIn: '7d' });
        // Check if profile has been filled (onboarding done)
        const { data: profile } = await db_1.supabase
            .from('profiles')
            .select('college, career_goal, field_of_study')
            .eq('user_id', user.id)
            .maybeSingle();
        const profileComplete = !!(profile?.college || profile?.career_goal || profile?.field_of_study);
        res.json({
            user: { id: user.id, name: user.name, email: user.email, profileComplete },
            token,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error?.message || 'Login failed' });
    }
});
// Get current user
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data: user } = await db_1.supabase
            .from('users')
            .select('id, name, email, profile_complete')
            .eq('id', req.userId)
            .maybeSingle();
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error?.message || 'Failed to get user' });
    }
});
exports.default = router;
