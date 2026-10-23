"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const auth_1 = require("../middleware/auth");
const node_fetch_1 = __importDefault(require("node-fetch"));
const router = express_1.default.Router();
function getGemini() {
    const key = (process.env.GEMINI_API_KEY || '').trim();
    if (!key)
        throw new Error('GEMINI_API_KEY not configured');
    return new generative_ai_1.GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-1.5-flash' });
}
// ── ATS Resume Scanner ────────────────────────────────────────────────────────
router.post('/ats-scan', auth_1.authMiddleware, async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        if (!resumeText?.trim() || !jobDescription?.trim()) {
            return res.status(400).json({ message: 'resumeText and jobDescription are required' });
        }
        if (resumeText.length > 10000) {
            return res.status(400).json({ message: 'Resume text too long (max 10,000 chars)' });
        }
        const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume against the job description.

JOB DESCRIPTION:
${jobDescription.slice(0, 2000)}

RESUME TEXT:
${resumeText.slice(0, 5000)}

Provide a detailed ATS analysis. Return ONLY valid JSON:
{
  "overallScore": 72,
  "breakdown": {
    "keywordMatch": 65,
    "skillsMatch": 80,
    "experienceMatch": 70,
    "educationMatch": 85,
    "formattingScore": 75
  },
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "missingSkills": ["skill1", "skill2"],
  "sectionChecks": {
    "hasContactInfo": true,
    "hasSummary": false,
    "hasExperience": true,
    "hasEducation": true,
    "hasSkills": true
  },
  "formattingIssues": ["Issue 1", "Issue 2"],
  "recommendations": ["Specific recommendation 1", "Specific recommendation 2", "Specific recommendation 3"],
  "verdict": "Strong Match|Good Match|Fair Match|Weak Match",
  "disclaimer": "This is an estimated ATS compatibility score. Actual ATS systems vary by employer."
}`;
        let analysis;
        try {
            const model = getGemini();
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        }
        catch (err) {
            console.error('[ats-scan] Gemini error:', err?.message);
        }
        if (!analysis) {
            return res.status(503).json({ message: 'ATS analysis temporarily unavailable. Please try again.' });
        }
        res.json(analysis);
    }
    catch (err) {
        console.error('[ats-scan]', err?.message);
        res.status(500).json({ message: 'Failed to analyze resume' });
    }
});
// ── Salary Intelligence ───────────────────────────────────────────────────────
router.post('/salary', auth_1.authMiddleware, async (req, res) => {
    try {
        const { role, location = 'India', experience = 'Fresher' } = req.body;
        if (!role)
            return res.status(400).json({ message: 'role is required' });
        const prompt = `Provide salary intelligence for the Indian job market.

Role: ${role}
Location: ${location}
Experience Level: ${experience}

Return ONLY valid JSON (all salaries in INR LPA - Lakhs Per Annum):
{
  "role": "${role}",
  "location": "${location}",
  "experienceLevel": "${experience}",
  "salaryRanges": {
    "fresher": { "min": 3, "max": 6, "median": 4.5 },
    "junior": { "min": 5, "max": 12, "median": 8 },
    "mid": { "min": 10, "max": 22, "median": 16 },
    "senior": { "min": 18, "max": 40, "median": 28 }
  },
  "topPayingCompanies": ["Company1", "Company2", "Company3", "Company4", "Company5"],
  "topPayingCities": ["City1", "City2", "City3"],
  "inDemandSkills": ["skill1", "skill2", "skill3", "skill4"],
  "growthOutlook": "High|Medium|Low",
  "keyFactors": ["factor1", "factor2", "factor3"],
  "disclaimer": "These are estimated market ranges based on general knowledge. Actual salaries vary. Verify with Glassdoor, LinkedIn, or Naukri for current data.",
  "dataNote": "AI-estimated ranges for the Indian job market as of 2024-2025"
}`;
        let data;
        try {
            const model = getGemini();
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            data = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        }
        catch {
            data = null;
        }
        if (!data) {
            return res.status(503).json({ message: 'Salary data temporarily unavailable.' });
        }
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch salary data' });
    }
});
// ── Company Interview Preparation ─────────────────────────────────────────────
router.post('/company-prep', auth_1.authMiddleware, async (req, res) => {
    try {
        const { company, role } = req.body;
        if (!company || !role)
            return res.status(400).json({ message: 'company and role are required' });
        const prompt = `Create interview preparation material for this company and role.

Company: ${company}
Role: ${role}

Note: Generate realistic preparation material. Do NOT claim these are actual questions used by ${company}.
Return ONLY valid JSON:
{
  "company": "${company}",
  "role": "${role}",
  "interviewProcess": ["Round 1: Online Assessment", "Round 2: Technical Interview", "Round 3: HR Interview"],
  "topicAreas": [
    { "area": "Data Structures & Algorithms", "importance": "High", "topics": ["Arrays", "Trees", "Graphs"] }
  ],
  "practiceQuestions": [
    { "question": "Practice question 1?", "category": "Technical", "difficulty": "Medium" },
    { "question": "Practice question 2?", "category": "HR", "difficulty": "Easy" }
  ],
  "preparationPlan": [
    { "week": 1, "focus": "What to focus on in week 1", "tasks": ["Task 1", "Task 2"] }
  ],
  "keySkillsToHighlight": ["skill1", "skill2", "skill3"],
  "companyValues": ["value1", "value2"],
  "disclaimer": "These are AI-generated practice questions based on general knowledge. Actual interview questions are proprietary and vary per interview."
}`;
        let prep;
        try {
            const model = getGemini();
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            prep = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        }
        catch {
            prep = null;
        }
        if (!prep)
            return res.status(503).json({ message: 'Company prep data temporarily unavailable.' });
        res.json(prep);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to generate preparation material' });
    }
});
// ── Outreach Message Generator ────────────────────────────────────────────────
router.post('/outreach', auth_1.authMiddleware, async (req, res) => {
    try {
        const { type, role, company, recipientRole, tone = 'Professional', userContext } = req.body;
        if (!type || !role)
            return res.status(400).json({ message: 'type and role are required' });
        const validTypes = ['recruiter', 'referral', 'follow-up', 'inquiry'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: `type must be one of: ${validTypes.join(', ')}` });
        }
        const prompt = `Generate a professional outreach message draft.

Type: ${type} message
Role Applying For: ${role}
Company: ${company || 'the company'}
Recipient Role: ${recipientRole || 'Hiring Manager'}
Tone: ${tone}
Sender Context: ${userContext || 'A job seeker interested in this role'}

IMPORTANT RULES:
- Do NOT fabricate prior relationships or accomplishments not mentioned in the context
- Write a genuine, professional draft only — this is NOT to be sent automatically
- Keep it concise (under 200 words)
- Make it personalized but honest

Return ONLY valid JSON:
{
  "subject": "Email subject line",
  "message": "Full message body here",
  "tips": ["Tip 1 for customizing", "Tip 2 for customizing"],
  "disclaimer": "This is a draft template. Customize it with specific details before sending."
}`;
        let draft;
        try {
            const model = getGemini();
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            draft = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        }
        catch {
            draft = null;
        }
        if (!draft)
            return res.status(503).json({ message: 'Message generation temporarily unavailable.' });
        res.json(draft);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to generate outreach message' });
    }
});
// ── GitHub Portfolio Analyzer ─────────────────────────────────────────────────
router.post('/github-analyze', auth_1.authMiddleware, async (req, res) => {
    try {
        const { username } = req.body;
        if (!username?.trim())
            return res.status(400).json({ message: 'GitHub username is required' });
        const cleanUsername = username.trim().replace(/^https?:\/\/github\.com\//, '').split('/')[0];
        if (!/^[a-zA-Z0-9-]+$/.test(cleanUsername)) {
            return res.status(400).json({ message: 'Invalid GitHub username' });
        }
        // Fetch public GitHub data
        const headers = { 'User-Agent': 'CareerNavigator/1.0', Accept: 'application/vnd.github.v3+json' };
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        if (GITHUB_TOKEN)
            headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        let userData, repoData;
        try {
            const [userRes, reposRes] = await Promise.all([
                (0, node_fetch_1.default)(`https://api.github.com/users/${cleanUsername}`, { headers, signal: AbortSignal.timeout(10000) }),
                (0, node_fetch_1.default)(`https://api.github.com/users/${cleanUsername}/repos?sort=updated&per_page=10`, { headers, signal: AbortSignal.timeout(10000) }),
            ]);
            if (userRes.status === 404)
                return res.status(404).json({ message: `GitHub user '${cleanUsername}' not found` });
            if (userRes.status === 403)
                return res.status(429).json({ message: 'GitHub API rate limit reached. Try again later.' });
            if (!userRes.ok)
                return res.status(502).json({ message: 'Failed to fetch GitHub data' });
            userData = await userRes.json();
            repoData = reposRes.ok ? (await reposRes.json()) : [];
        }
        catch (fetchErr) {
            return res.status(502).json({ message: 'Could not reach GitHub API. Check username and try again.' });
        }
        // Extract safe, non-sensitive public metadata only
        const repoSummary = repoData.slice(0, 10).map(r => ({
            name: r.name,
            description: r.description,
            language: r.language,
            stars: r.stargazers_count,
            forks: r.forks_count,
            hasReadme: r.has_readme ?? true,
            topics: r.topics || [],
            updatedAt: r.updated_at,
        }));
        const languages = [...new Set(repoSummary.map(r => r.language).filter(Boolean))];
        const prompt = `Analyze this GitHub profile and provide portfolio improvement suggestions.

Username: ${cleanUsername}
Public repos: ${userData.public_repos}
Followers: ${userData.followers}
Bio: ${userData.bio || 'None'}
Languages used: ${languages.join(', ') || 'None visible'}

Recent repos:
${repoSummary.map(r => `- ${r.name}: ${r.description || 'No description'} (${r.language || 'Unknown'}, ${r.stars} stars)`).join('\n')}

Provide honest, actionable feedback. Return ONLY valid JSON:
{
  "overallScore": 65,
  "breakdown": {
    "projectDiversity": 70,
    "documentation": 50,
    "activityLevel": 60,
    "codeQuality": 65,
    "portfolioPresentation": 55
  },
  "strengths": ["strength1", "strength2"],
  "improvements": [
    { "area": "README Quality", "suggestion": "Specific suggestion", "priority": "High|Medium|Low" }
  ],
  "topProjects": ["repo1", "repo2"],
  "languageDiversity": ${languages.length},
  "recruitersWillNotice": ["positive thing 1", "positive thing 2"],
  "quickWins": ["Quick improvement 1", "Quick improvement 2", "Quick improvement 3"],
  "disclaimer": "Analysis is based on publicly available repository metadata only. Source code files were not inspected."
}`;
        let analysis;
        try {
            const model = getGemini();
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        }
        catch {
            analysis = null;
        }
        res.json({
            profile: {
                username: userData.login,
                name: userData.name,
                bio: userData.bio,
                publicRepos: userData.public_repos,
                followers: userData.followers,
                avatarUrl: userData.avatar_url,
            },
            repos: repoSummary,
            languages,
            analysis,
        });
    }
    catch (err) {
        console.error('[github-analyze]', err?.message);
        res.status(500).json({ message: 'Failed to analyze GitHub profile' });
    }
});
exports.default = router;
