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
// ── Generate interview questions ──────────────────────────────────────────────
router.post('/generate', auth_1.authMiddleware, async (req, res) => {
    try {
        const { role, category, difficulty = 'Medium' } = req.body;
        if (!role || !category) {
            return res.status(400).json({ message: 'role and category are required' });
        }
        // Get user profile for context
        const { data: profile } = await db_1.supabase
            .from('profiles')
            .select('skills, experience, education, field_of_study')
            .eq('user_id', req.userId)
            .maybeSingle();
        const skillsStr = Array.isArray(profile?.skills)
            ? profile.skills.join(', ')
            : (profile?.skills || 'Not specified');
        const prompt = `You are an expert interviewer at a top tech company in India.
Generate exactly 8 interview questions for the following context:

Role: ${role}
Category: ${category} (HR / Technical / Behavioral)
Difficulty: ${difficulty}
Candidate Skills: ${skillsStr}
Experience: ${profile?.experience?.slice(0, 200) || 'Fresher'}

Rules:
1. Questions must be specific to the role and category
2. For Technical: include DSA, system design, or domain-specific questions
3. For HR: focus on motivation, culture fit, situational questions
4. For Behavioral: use STAR-method style questions
5. Mix easy, medium, and hard based on difficulty level
6. Make questions realistic and commonly asked in actual interviews

Return ONLY valid JSON array (no markdown):
[
  {
    "id": 1,
    "question": "Question text here?",
    "type": "technical|behavioral|hr",
    "hint": "Brief hint about what a good answer covers",
    "expectedDuration": 120
  }
]`;
        let questions;
        try {
            const model = getGemini();
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            questions = jsonMatch ? JSON.parse(jsonMatch[0]) : getFallbackQuestions(role, category);
        }
        catch {
            questions = getFallbackQuestions(role, category);
        }
        // Save session
        const { data: session, error } = await db_1.supabase
            .from('interview_sessions')
            .insert({
            user_id: req.userId,
            role,
            category,
            difficulty,
            questions: JSON.stringify(questions),
            status: 'in_progress',
        })
            .select()
            .single();
        if (error)
            throw error;
        res.json({ sessionId: session.id, questions });
    }
    catch (err) {
        console.error('[interview/generate]', err?.message);
        res.status(500).json({ message: 'Failed to generate questions' });
    }
});
// ── Submit answer and get AI feedback ────────────────────────────────────────
router.post('/evaluate', auth_1.authMiddleware, async (req, res) => {
    try {
        const { sessionId, questionId, question, answer, role } = req.body;
        if (!question || !answer?.trim()) {
            return res.status(400).json({ message: 'question and answer are required' });
        }
        const prompt = `You are an expert technical interviewer evaluating a candidate's answer.

Role: ${role || 'Software Engineer'}
Question: ${question}
Candidate's Answer: ${answer}

Evaluate this answer and provide structured feedback. Return ONLY valid JSON:
{
  "score": 7,
  "scoreOutOf": 10,
  "strengths": ["Point 1", "Point 2"],
  "improvements": ["Point 1", "Point 2"],
  "suggestedAnswer": "A stronger answer would be...",
  "verdict": "Good|Excellent|Needs Improvement|Poor"
}`;
        let feedback;
        try {
            const model = getGemini();
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            feedback = jsonMatch ? JSON.parse(jsonMatch[0]) : getDefaultFeedback(answer);
        }
        catch {
            feedback = getDefaultFeedback(answer);
        }
        // Update session with this answer
        if (sessionId) {
            const { data: session } = await db_1.supabase
                .from('interview_sessions')
                .select('answers')
                .eq('id', sessionId)
                .eq('user_id', req.userId)
                .maybeSingle();
            const currentAnswers = session?.answers ? JSON.parse(session.answers) : [];
            currentAnswers.push({ questionId, question, answer, feedback });
            await db_1.supabase
                .from('interview_sessions')
                .update({ answers: JSON.stringify(currentAnswers) })
                .eq('id', sessionId)
                .eq('user_id', req.userId);
        }
        res.json({ feedback });
    }
    catch (err) {
        console.error('[interview/evaluate]', err?.message);
        res.status(500).json({ message: 'Failed to evaluate answer' });
    }
});
// ── Complete session and generate final report ────────────────────────────────
router.post('/complete/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data: session } = await db_1.supabase
            .from('interview_sessions')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.userId)
            .maybeSingle();
        if (!session)
            return res.status(404).json({ message: 'Session not found' });
        const answers = session.answers ? JSON.parse(session.answers) : [];
        const scores = answers.map((a) => a.feedback?.score || 5);
        const avgScore = scores.length > 0
            ? Math.round(scores.reduce((s, c) => s + c, 0) / scores.length * 10)
            : 50;
        const prompt = `Based on this mock interview performance, generate a concise final report.

Role: ${session.role}
Category: ${session.category}
Questions answered: ${answers.length}
Average score: ${avgScore}/100

Answers and feedback summary:
${answers.slice(0, 5).map((a) => `Q: ${a.question?.slice(0, 100)}\nVerdict: ${a.feedback?.verdict || 'N/A'}`).join('\n\n')}

Return ONLY valid JSON:
{
  "overallScore": ${avgScore},
  "grade": "A|B|C|D|F",
  "summary": "2-3 sentence overall assessment",
  "topStrengths": ["strength1", "strength2", "strength3"],
  "priorityImprovements": ["area1", "area2", "area3"],
  "nextSteps": ["step1", "step2", "step3"],
  "readinessLevel": "Ready|Almost Ready|Needs Preparation|Not Ready"
}`;
        let report;
        try {
            const model = getGemini();
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            report = jsonMatch ? JSON.parse(jsonMatch[0]) : getDefaultReport(avgScore);
        }
        catch {
            report = getDefaultReport(avgScore);
        }
        await db_1.supabase
            .from('interview_sessions')
            .update({
            status: 'completed',
            score: avgScore,
            feedback: JSON.stringify(report),
            completed_at: new Date().toISOString(),
        })
            .eq('id', req.params.id)
            .eq('user_id', req.userId);
        // Award XP for completing interview
        (0, gamification_1.awardXP)(req.userId, 'mock_interview');
        if (avgScore >= 80)
            (0, gamification_1.awardXP)(req.userId, 'interview_score_80');
        res.json({ report, score: avgScore, answers });
    }
    catch (err) {
        console.error('[interview/complete]', err?.message);
        res.status(500).json({ message: 'Failed to complete session' });
    }
});
// ── Get session history ───────────────────────────────────────────────────────
router.get('/history', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data } = await db_1.supabase
            .from('interview_sessions')
            .select('id, role, category, difficulty, score, status, created_at, completed_at')
            .eq('user_id', req.userId)
            .order('created_at', { ascending: false })
            .limit(20);
        res.json(data || []);
    }
    catch {
        res.json([]);
    }
});
// ── Get single session ────────────────────────────────────────────────────────
router.get('/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { data } = await db_1.supabase
            .from('interview_sessions')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.userId)
            .maybeSingle();
        if (!data)
            return res.status(404).json({ message: 'Session not found' });
        res.json({
            ...data,
            questions: data.questions ? JSON.parse(data.questions) : [],
            answers: data.answers ? JSON.parse(data.answers) : [],
            feedback: data.feedback ? JSON.parse(data.feedback) : null,
        });
    }
    catch {
        res.status(500).json({ message: 'Failed to fetch session' });
    }
});
// ── Fallbacks ─────────────────────────────────────────────────────────────────
function getFallbackQuestions(role, category) {
    const techQ = [
        { id: 1, question: `Explain the core technical concepts required for a ${role} role.`, type: 'technical', hint: 'Cover fundamentals specific to the role', expectedDuration: 120 },
        { id: 2, question: 'Describe a challenging technical problem you solved. What was your approach?', type: 'technical', hint: 'Use STAR method, focus on your specific contribution', expectedDuration: 150 },
        { id: 3, question: 'How do you approach debugging a production issue with no immediate reproduction steps?', type: 'technical', hint: 'Mention logging, monitoring, systematic elimination', expectedDuration: 120 },
        { id: 4, question: 'What is the difference between SQL and NoSQL databases? When would you use each?', type: 'technical', hint: 'ACID vs BASE, use cases, examples', expectedDuration: 90 },
        { id: 5, question: 'Explain RESTful API design principles and best practices.', type: 'technical', hint: 'Stateless, HTTP methods, status codes, versioning', expectedDuration: 90 },
        { id: 6, question: 'How do you ensure code quality in a team environment?', type: 'technical', hint: 'Code reviews, testing, linting, CI/CD', expectedDuration: 90 },
        { id: 7, question: 'Describe your experience with version control and Git workflows.', type: 'technical', hint: 'Branching strategies, PR process, conflict resolution', expectedDuration: 90 },
        { id: 8, question: `What are the key skills and technologies you are currently learning for ${role}?`, type: 'technical', hint: 'Show growth mindset and awareness of the field', expectedDuration: 60 },
    ];
    const hrQ = [
        { id: 1, question: `Why do you want to work as a ${role}?`, type: 'hr', hint: 'Connect your skills, passion, and career goals', expectedDuration: 90 },
        { id: 2, question: 'Tell me about yourself and your background.', type: 'hr', hint: 'Keep it professional: education, skills, experience, goals', expectedDuration: 120 },
        { id: 3, question: 'Where do you see yourself in 5 years?', type: 'hr', hint: 'Show ambition aligned with the company/role', expectedDuration: 90 },
        { id: 4, question: 'What are your greatest strengths and how do they apply to this role?', type: 'hr', hint: 'Give specific examples, not generic traits', expectedDuration: 90 },
        { id: 5, question: 'Describe a situation where you had to work under pressure and how you handled it.', type: 'hr', hint: 'STAR method: Situation, Task, Action, Result', expectedDuration: 120 },
        { id: 6, question: 'How do you handle constructive criticism or feedback?', type: 'hr', hint: 'Show openness to learning, give a real example', expectedDuration: 90 },
        { id: 7, question: 'Why are you leaving (or why did you leave) your previous position?', type: 'hr', hint: 'Stay positive, focus on growth, not negativity', expectedDuration: 90 },
        { id: 8, question: 'Do you have any questions for us?', type: 'hr', hint: 'Ask about team culture, growth, day-to-day responsibilities', expectedDuration: 60 },
    ];
    return category.toLowerCase() === 'hr' ? hrQ : techQ;
}
function getDefaultFeedback(answer) {
    const wordCount = answer.split(' ').length;
    const score = wordCount > 50 ? 7 : wordCount > 20 ? 5 : 3;
    return {
        score,
        scoreOutOf: 10,
        strengths: ['Attempted to answer the question', 'Showed some understanding'],
        improvements: ['Provide more specific examples', 'Structure your answer using STAR method', 'Add quantifiable results'],
        suggestedAnswer: 'A stronger answer would include specific examples, quantifiable outcomes, and clear structure.',
        verdict: score >= 7 ? 'Good' : score >= 5 ? 'Needs Improvement' : 'Poor',
    };
}
function getDefaultReport(score) {
    return {
        overallScore: score,
        grade: score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : 'D',
        summary: 'You completed the mock interview. Review the individual feedback to identify areas for improvement.',
        topStrengths: ['Completed the interview', 'Showed willingness to attempt all questions'],
        priorityImprovements: ['Practice structured answers', 'Use STAR method for behavioral questions', 'Research role-specific technical concepts'],
        nextSteps: ['Review feedback for each question', 'Practice daily with different roles', 'Work on weak areas from skill gap analysis'],
        readinessLevel: score >= 80 ? 'Ready' : score >= 60 ? 'Almost Ready' : 'Needs Preparation',
    };
}
exports.default = router;
