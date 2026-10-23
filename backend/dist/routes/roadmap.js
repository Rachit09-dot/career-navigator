"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const db_1 = require("../utils/db");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
function getGemini() {
    const key = (process.env.GEMINI_API_KEY || '').trim();
    if (!key)
        throw new Error('GEMINI_API_KEY not configured');
    return new generative_ai_1.GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-1.5-flash' });
}
// ── Generate personalized roadmap ─────────────────────────────────────────────
router.post('/generate', auth_1.authMiddleware, async (req, res) => {
    try {
        const { target_role } = req.body;
        if (!target_role)
            return res.status(400).json({ message: 'target_role is required' });
        // Get user profile
        const { data: profile } = await db_1.supabase
            .from('profiles')
            .select('skills, experience, education, field_of_study, career_goal')
            .eq('user_id', req.userId)
            .maybeSingle();
        const currentSkills = Array.isArray(profile?.skills)
            ? profile.skills.join(', ')
            : (profile?.skills || 'None');
        const prompt = `Create a detailed, personalized learning roadmap for this person.

Target Role: ${target_role}
Current Skills: ${currentSkills}
Field of Study: ${profile?.field_of_study || 'Not specified'}
Experience Level: ${profile?.experience ? 'Has experience' : 'Fresher'}

Create a structured roadmap with 4-6 phases. Return ONLY valid JSON:
{
  "title": "Roadmap title",
  "totalWeeks": 24,
  "phases": [
    {
      "id": 1,
      "title": "Phase title",
      "duration": "4 weeks",
      "description": "What this phase covers",
      "milestones": [
        {
          "id": "m1",
          "title": "Milestone title",
          "description": "What to learn/build",
          "type": "learn|project|practice",
          "estimatedHours": 20,
          "resources": [
            { "title": "Resource name", "url": "https://...", "type": "free|paid", "platform": "YouTube|Coursera|etc" }
          ]
        }
      ]
    }
  ],
  "finalProject": "Capstone project idea that demonstrates all skills",
  "jobReadinessIndicators": ["indicator1", "indicator2", "indicator3"]
}`;
        let roadmap;
        try {
            const model = getGemini();
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            roadmap = jsonMatch ? JSON.parse(jsonMatch[0]) : getFallbackRoadmap(target_role);
        }
        catch {
            roadmap = getFallbackRoadmap(target_role);
        }
        // Save to DB (upsert — one roadmap per user per role)
        const { data: existing } = await db_1.supabase
            .from('roadmap_progress')
            .select('id, completed_milestones')
            .eq('user_id', req.userId)
            .eq('role', target_role)
            .maybeSingle();
        let savedRoadmap;
        if (existing) {
            const { data } = await db_1.supabase
                .from('roadmap_progress')
                .update({ roadmap: JSON.stringify(roadmap), updated_at: new Date().toISOString() })
                .eq('id', existing.id)
                .select()
                .single();
            savedRoadmap = data;
        }
        else {
            const { data } = await db_1.supabase
                .from('roadmap_progress')
                .insert({
                user_id: req.userId,
                role: target_role,
                roadmap: JSON.stringify(roadmap),
                completed_milestones: '[]',
            })
                .select()
                .single();
            savedRoadmap = data;
        }
        res.json({
            id: savedRoadmap?.id,
            roadmap,
            completedMilestones: existing?.completed_milestones
                ? JSON.parse(existing.completed_milestones)
                : [],
        });
    }
    catch (err) {
        console.error('[roadmap/generate]', err?.message);
        res.status(500).json({ message: 'Failed to generate roadmap' });
    }
});
// ── Toggle milestone completion ───────────────────────────────────────────────
router.post('/milestone', auth_1.authMiddleware, async (req, res) => {
    try {
        const { roadmapId, milestoneId } = req.body;
        if (!roadmapId || !milestoneId) {
            return res.status(400).json({ message: 'roadmapId and milestoneId required' });
        }
        const { data } = await db_1.supabase
            .from('roadmap_progress')
            .select('completed_milestones')
            .eq('id', roadmapId)
            .eq('user_id', req.userId)
            .maybeSingle();
        if (!data)
            return res.status(404).json({ message: 'Roadmap not found' });
        const completed = data.completed_milestones ? JSON.parse(data.completed_milestones) : [];
        const newCompleted = completed.includes(milestoneId)
            ? completed.filter(id => id !== milestoneId)
            : [...completed, milestoneId];
        await db_1.supabase
            .from('roadmap_progress')
            .update({
            completed_milestones: JSON.stringify(newCompleted),
            updated_at: new Date().toISOString(),
        })
            .eq('id', roadmapId)
            .eq('user_id', req.userId);
        res.json({ completedMilestones: newCompleted });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to update milestone' });
    }
});
// ── Get user's roadmaps ───────────────────────────────────────────────────────
router.get('/my', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data } = await db_1.supabase
            .from('roadmap_progress')
            .select('id, role, completed_milestones, created_at, updated_at')
            .eq('user_id', req.userId)
            .order('updated_at', { ascending: false });
        res.json((data || []).map((r) => ({
            ...r,
            completedMilestones: r.completed_milestones ? JSON.parse(r.completed_milestones) : [],
        })));
    }
    catch {
        res.json([]);
    }
});
// ── Get specific roadmap ──────────────────────────────────────────────────────
router.get('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data } = await db_1.supabase
            .from('roadmap_progress')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.userId)
            .maybeSingle();
        if (!data)
            return res.status(404).json({ message: 'Roadmap not found' });
        res.json({
            ...data,
            roadmap: data.roadmap ? JSON.parse(data.roadmap) : null,
            completedMilestones: data.completed_milestones ? JSON.parse(data.completed_milestones) : [],
        });
    }
    catch {
        res.status(500).json({ message: 'Failed to fetch roadmap' });
    }
});
function getFallbackRoadmap(role) {
    return {
        title: `${role} Learning Roadmap`,
        totalWeeks: 24,
        phases: [
            {
                id: 1,
                title: 'Foundations',
                duration: '4 weeks',
                description: 'Build core fundamentals required for the role',
                milestones: [
                    {
                        id: 'm1',
                        title: 'Core Technical Skills',
                        description: 'Learn the fundamental programming and technical skills',
                        type: 'learn',
                        estimatedHours: 40,
                        resources: [
                            { title: 'FreeCodeCamp', url: 'https://freecodecamp.org', type: 'free', platform: 'Website' },
                            { title: 'CS50 by Harvard', url: 'https://cs50.harvard.edu', type: 'free', platform: 'edX' },
                        ],
                    },
                ],
            },
            {
                id: 2,
                title: 'Core Concepts',
                duration: '6 weeks',
                description: 'Deep dive into role-specific technologies',
                milestones: [
                    {
                        id: 'm2',
                        title: 'Role-Specific Technologies',
                        description: 'Master the key tools and frameworks for this role',
                        type: 'learn',
                        estimatedHours: 60,
                        resources: [
                            { title: 'Official Documentation', url: 'https://developer.mozilla.org', type: 'free', platform: 'Web' },
                        ],
                    },
                ],
            },
            {
                id: 3,
                title: 'Projects',
                duration: '8 weeks',
                description: 'Build real-world projects to demonstrate skills',
                milestones: [
                    {
                        id: 'm3',
                        title: 'Portfolio Project 1',
                        description: 'Build a complete project from scratch',
                        type: 'project',
                        estimatedHours: 80,
                        resources: [],
                    },
                ],
            },
            {
                id: 4,
                title: 'Interview Preparation',
                duration: '6 weeks',
                description: 'Prepare for technical and HR interviews',
                milestones: [
                    {
                        id: 'm4',
                        title: 'Mock Interviews',
                        description: 'Practice with mock interviews and coding challenges',
                        type: 'practice',
                        estimatedHours: 40,
                        resources: [
                            { title: 'LeetCode', url: 'https://leetcode.com', type: 'free', platform: 'Website' },
                        ],
                    },
                ],
            },
        ],
        finalProject: `Build a complete ${role}-focused application showcasing all learned skills`,
        jobReadinessIndicators: [
            'Can explain core concepts confidently',
            'Has 2+ portfolio projects',
            'Solved 50+ coding problems',
            'Completed mock interviews successfully',
        ],
    };
}
exports.default = router;
