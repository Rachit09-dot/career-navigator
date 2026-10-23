"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const db_1 = require("../utils/db");
const auth_1 = require("../middleware/auth");
const gamification_1 = require("./gamification");
const router = express_1.default.Router();
function getGemini() {
    const key = (process.env.GEMINI_API_KEY || '').trim();
    if (!key)
        throw new Error('GEMINI_API_KEY not configured');
    return new generative_ai_1.GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-1.5-flash' });
}
// ── Generate MCQ questions ────────────────────────────────────────────────────
router.post('/generate', auth_1.authMiddleware, async (req, res) => {
    try {
        const { role, topic, difficulty = 'Medium', count = 10 } = req.body;
        if (!role)
            return res.status(400).json({ message: 'role is required' });
        const safeCount = Math.min(Math.max(Number(count) || 10, 5), 15);
        const prompt = `You are an expert technical interviewer. Generate ${safeCount} multiple-choice questions.

Role: ${role}
Topic: ${topic || 'General ' + role + ' concepts'}
Difficulty: ${difficulty}

Rules:
1. Questions must be specific, practical, and commonly asked in real interviews
2. Each question must have exactly 4 distinct options
3. The correct answer must match EXACTLY one of the options
4. Include a brief explanation for the correct answer
5. Mix conceptual, application, and problem-solving questions
6. Avoid trivially obvious or trick questions

Return ONLY valid JSON array (no markdown):
[
  {
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation why this is correct",
    "topic": "Sub-topic name",
    "difficulty": "Easy|Medium|Hard"
  }
]`;
        let questions;
        try {
            const model = getGemini();
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            questions = jsonMatch ? JSON.parse(jsonMatch[0]) : getFallbackQuestions(role, safeCount);
        }
        catch {
            questions = getFallbackQuestions(role, safeCount);
        }
        // Validate structure
        questions = questions.map((q, i) => ({
            id: q.id || i + 1,
            question: q.question || `Question ${i + 1}`,
            options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: q.correctAnswer || q.options?.[0] || 'Option A',
            explanation: q.explanation || 'No explanation provided.',
            topic: q.topic || topic || role,
            difficulty: q.difficulty || difficulty,
        }));
        res.json({ questions, role, topic, difficulty });
    }
    catch (err) {
        console.error('[mcq/generate]', err?.message);
        res.status(500).json({ message: 'Failed to generate questions' });
    }
});
// ── Submit test results ───────────────────────────────────────────────────────
router.post('/submit', auth_1.authMiddleware, async (req, res) => {
    try {
        const { role, topic, difficulty, questions, userAnswers, timeTaken } = req.body;
        if (!questions || !userAnswers || !role) {
            return res.status(400).json({ message: 'role, questions, and userAnswers are required' });
        }
        // Calculate score
        let correct = 0;
        const detailed = questions.map((q) => {
            const userAnswer = userAnswers[q.id];
            const isCorrect = userAnswer === q.correctAnswer;
            if (isCorrect)
                correct++;
            return {
                id: q.id,
                question: q.question,
                userAnswer,
                correctAnswer: q.correctAnswer,
                isCorrect,
                explanation: q.explanation,
                topic: q.topic,
            };
        });
        const score = Math.round((correct / questions.length) * 100);
        // Topic-wise breakdown
        const topicMap = {};
        detailed.forEach((q) => {
            const t = q.topic || 'General';
            if (!topicMap[t])
                topicMap[t] = { correct: 0, total: 0 };
            topicMap[t].total++;
            if (q.isCorrect)
                topicMap[t].correct++;
        });
        const topicBreakdown = Object.entries(topicMap).map(([topic, data]) => ({
            topic,
            correct: data.correct,
            total: data.total,
            percentage: Math.round((data.correct / data.total) * 100),
        }));
        // Save to DB
        const { data: result, error } = await db_1.supabase
            .from('mcq_results')
            .insert({
            user_id: req.userId,
            role,
            topic: topic || role,
            score,
            total: questions.length,
            answers: JSON.stringify(detailed),
            questions: JSON.stringify(questions),
            time_taken: timeTaken || 0,
        })
            .select()
            .single();
        if (error)
            console.error('[mcq/submit] DB error:', error?.message);
        // Award XP
        (0, gamification_1.awardXP)(req.userId, 'mcq_completed');
        if (score >= 80)
            (0, gamification_1.awardXP)(req.userId, 'mcq_score_80');
        res.json({
            score,
            correct,
            total: questions.length,
            grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'F',
            detailed,
            topicBreakdown,
            timeTaken,
            resultId: result?.id,
        });
    }
    catch (err) {
        console.error('[mcq/submit]', err?.message);
        res.status(500).json({ message: 'Failed to submit test' });
    }
});
// ── Get test history ──────────────────────────────────────────────────────────
router.get('/history', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data } = await db_1.supabase
            .from('mcq_results')
            .select('id, role, topic, score, total, time_taken, created_at')
            .eq('user_id', req.userId)
            .order('created_at', { ascending: false })
            .limit(20);
        res.json(data || []);
    }
    catch {
        res.json([]);
    }
});
// ── Get single result ─────────────────────────────────────────────────────────
router.get('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data } = await db_1.supabase
            .from('mcq_results')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.userId)
            .maybeSingle();
        if (!data)
            return res.status(404).json({ message: 'Result not found' });
        res.json({
            ...data,
            answers: data.answers ? JSON.parse(data.answers) : [],
            questions: data.questions ? JSON.parse(data.questions) : [],
        });
    }
    catch {
        res.status(500).json({ message: 'Failed to fetch result' });
    }
});
// ── Fallback questions ────────────────────────────────────────────────────────
function getFallbackQuestions(role, count) {
    const base = [
        { id: 1, question: `What is a fundamental concept in ${role}?`, options: ['Core principle A', 'Core principle B', 'Core principle C', 'Core principle D'], correctAnswer: 'Core principle A', explanation: 'This is a core concept in the field.', topic: role, difficulty: 'Easy' },
        { id: 2, question: 'Which approach is best for solving complex problems systematically?', options: ['Divide and conquer', 'Ignore constraints', 'Random guessing', 'Brute force always'], correctAnswer: 'Divide and conquer', explanation: 'Breaking complex problems into smaller parts is a proven strategy.', topic: 'Problem Solving', difficulty: 'Easy' },
        { id: 3, question: 'What does good code/work quality mean?', options: ['Readable, maintainable, tested', 'Fast only', 'Works once', 'Shortest possible'], correctAnswer: 'Readable, maintainable, tested', explanation: 'Quality work is readable, maintainable, and properly tested.', topic: 'Best Practices', difficulty: 'Easy' },
        { id: 4, question: 'How should you handle a task you are unfamiliar with?', options: ['Research, ask for help, learn systematically', 'Give up immediately', 'Pretend you know', 'Skip the task'], correctAnswer: 'Research, ask for help, learn systematically', explanation: 'A growth mindset involves systematic learning and collaboration.', topic: 'Professional Skills', difficulty: 'Easy' },
        { id: 5, question: 'What is version control used for?', options: ['Tracking code/work changes over time', 'Slowing down development', 'Only for large teams', 'Replacing backups'], correctAnswer: 'Tracking code/work changes over time', explanation: 'Version control systems track changes and enable collaboration.', topic: 'Tools', difficulty: 'Easy' },
    ];
    // Extend to requested count
    const extended = [...base];
    while (extended.length < count) {
        extended.push({ ...base[extended.length % base.length], id: extended.length + 1 });
    }
    return extended.slice(0, count);
}
exports.default = router;
