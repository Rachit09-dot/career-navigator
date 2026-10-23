"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const db_1 = require("../utils/db");
const router = express_1.default.Router();
// ── Gemini client (lazy — avoids crash at startup if key missing) ─────────────
const MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
function getGeminiModel(modelName) {
    const key = (process.env.GEMINI_API_KEY || '').trim();
    if (!key) {
        throw new Error('GEMINI_API_KEY is not configured. Add it in Render → Environment.');
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(key);
    return genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: `You are CareerNavigator AI — a friendly, knowledgeable career counsellor for students and freshers in India.

CORE CAPABILITIES:
• Career guidance: Data Analyst, Data Scientist, AI/ML Engineer, Software Developer, Full-Stack Developer, Product Manager, DevOps, Cybersecurity, and other tech & non-tech paths
• Resume & ATS: review structure, bullet points, keyword optimisation, formatting
• Job & internship prep: how to apply, what recruiters look for, platforms (LinkedIn, Naukri, Internshala, etc.)
• Interview preparation: DSA questions, system design, HR rounds, behavioural questions with STAR framework
• Skills & roadmaps: what to learn, in what order, free vs paid resources
• Skill gap analysis: what skills are missing for a target role
• Personalised advice: when the user's profile is provided, use it — do NOT invent information

RESPONSE RULES:
1. Answer the EXACT question asked — do not pivot to generic career advice unless the question is generic.
2. Use the user's profile data (skills, education, experience, career goal) when provided in context.
3. If profile info is missing, answer the general question first. Ask for more info only when it genuinely helps.
4. Give structured answers: use bullet points, numbered steps, and code blocks where appropriate.
5. For interview questions, provide realistic sample answers. Never invent the user's experience.
6. For job listings, do not fabricate openings, salaries, deadlines, or links.
7. Be concise but complete. Avoid filler phrases like "Great question!".
8. If the Gemini API cannot help with something, say so honestly.`,
    });
}
// ── Fetch user profile for context (best-effort) ─────────────────────────────
async function getUserContext(userId) {
    try {
        const { data: profile } = await db_1.supabase
            .from('profiles')
            .select('skills, education, experience, career_goal, college, degree, field_of_study, certifications')
            .eq('user_id', userId)
            .maybeSingle();
        const { data: user } = await db_1.supabase
            .from('users')
            .select('name')
            .eq('id', userId)
            .maybeSingle();
        if (!profile && !user)
            return '';
        const parts = ['[User Profile]'];
        if (user?.name)
            parts.push(`Name: ${user.name}`);
        if (profile?.college)
            parts.push(`College: ${profile.college}`);
        if (profile?.degree)
            parts.push(`Degree: ${profile.degree}`);
        if (profile?.field_of_study)
            parts.push(`Field: ${profile.field_of_study}`);
        if (profile?.career_goal)
            parts.push(`Career Goal: ${profile.career_goal}`);
        if (profile?.skills) {
            const skillStr = Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills;
            if (skillStr.trim())
                parts.push(`Skills: ${skillStr}`);
        }
        if (profile?.experience)
            parts.push(`Experience: ${String(profile.experience).slice(0, 300)}`);
        if (profile?.education)
            parts.push(`Education: ${String(profile.education).slice(0, 200)}`);
        if (profile?.certifications)
            parts.push(`Certifications: ${String(profile.certifications).slice(0, 200)}`);
        return parts.length > 1 ? parts.join('\n') : '';
    }
    catch {
        return ''; // profile fetch failure must never block the chat
    }
}
// ── POST /api/chat ─────────────────────────────────────────────────────────────
// Auth is optional — unauthenticated users get the chatbot without profile context
router.post('/', async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ message: 'messages array is required and must not be empty' });
        }
        const latestMessage = messages[messages.length - 1];
        if (!latestMessage?.content?.trim()) {
            return res.status(400).json({ message: 'Last message content must not be empty' });
        }
        // Build chat history (all except last message)
        // Gemini requires history to start with a 'user' turn
        const previousMessages = messages.slice(0, -1);
        const firstUserIdx = previousMessages.findIndex((m) => m.role === 'user');
        const chatHistory = firstUserIdx === -1
            ? []
            : previousMessages.slice(firstUserIdx).map((m) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: String(m.content) }],
            }));
        // Prepend profile context if user is authenticated
        let userText = latestMessage.content.trim();
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            try {
                const jwt = await import('jsonwebtoken');
                const secret = process.env.JWT_SECRET || 'careernavigator_secret_key_2024';
                const decoded = jwt.default.verify(authHeader.slice(7), secret);
                if (decoded?.userId) {
                    const profileContext = await getUserContext(decoded.userId);
                    if (profileContext)
                        userText = `${profileContext}\n\n[User Question]\n${userText}`;
                }
            }
            catch { /* skip profile context on auth failure */ }
        }
        // Get model — throws a clear error if key is missing
        let reply = '';
        let lastError = null;
        for (const modelName of MODELS) {
            try {
                const model = getGeminiModel(modelName);
                const chat = model.startChat({ history: chatHistory });
                const result = await chat.sendMessage(userText);
                reply = result.response.text();
                if (reply?.trim())
                    break; // success — stop trying
            }
            catch (err) {
                lastError = err;
                const msg = err?.message || '';
                // Only retry on 503 overload or 404 model-not-found
                if (msg.includes('503') || msg.includes('404') || msg.includes('not found') || msg.includes('no longer available')) {
                    console.warn(`[chat] Model ${modelName} unavailable, trying next...`);
                    continue;
                }
                throw err; // non-retryable error — bubble up
            }
        }
        if (!reply?.trim()) {
            if (lastError)
                throw lastError;
            return res.status(502).json({ message: 'AI service is temporarily unavailable. Please try again in a moment.' });
        }
        res.json({ reply });
    }
    catch (error) {
        const msg = error?.message || '';
        if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
            console.error('[chat] Invalid Gemini API key');
            return res.status(503).json({
                message: 'Chatbot is misconfigured: Gemini API key is invalid. Please contact support.'
            });
        }
        if (msg.includes('QUOTA_EXCEEDED') || msg.includes('429')) {
            return res.status(429).json({ message: 'Chatbot is temporarily unavailable due to API quota. Please try again later.' });
        }
        if (msg.includes('PERMISSION_DENIED') || msg.includes('403')) {
            return res.status(503).json({ message: 'Chatbot access denied. API key may not have Gemini access.' });
        }
        console.error('[chat] Unexpected error:', msg, error?.status, error?.errorDetails);
        res.status(500).json({ message: 'Failed to get a response. Please try again.' });
    }
});
exports.default = router;
