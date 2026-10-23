# CareerNavigator — AI-Powered Career Platform

A full-stack career guidance platform built for Indian students and freshers. Helps with career discovery, skill development, job search, interview preparation, and resume building.

**Live Demo:** https://career-navigator-murex.vercel.app/

---

## Features

| Feature | Description |
|---|---|
| Career DNA | AI assessment mapping personality to career paths (18+ fields) |
| Skill Gap Analysis | Role-specific skill gap with learning resources |
| Mock Interview | AI evaluates answers, gives feedback + final report |
| MCQ Tests | Role-based tests with timer, flag, explanations |
| Learning Roadmap | Personalized milestone-based roadmap with progress tracking |
| Resume Builder | Live editor with 3 templates (Classic/Modern/Minimal), PDF export, DB save |
| ATS Scanner | Resume vs job description match score |
| Salary Intelligence | AI-estimated salary ranges for Indian market |
| Company Prep | Interview prep material for any company + role |
| Outreach Generator | Draft professional LinkedIn/email messages |
| GitHub Analyzer | Public repo metadata analysis and portfolio improvement |
| Job Tracker | Track applications with status updates |
| Gamification | XP system, badges, leaderboard, notifications |
| AI Chatbot | Career Q&A with profile context |

---

## Tech Stack

**Frontend:** React 18 + TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, React Router v6

**Backend:** Node.js, Express, TypeScript

**AI:** Google Gemini 1.5 Flash (via `@google/generative-ai`)

**Database:** Supabase (PostgreSQL) with automatic SQLite fallback for local dev

**Deployment:** Frontend → Vercel | Backend → Railway / Render

---

## Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone and install

```bash
git clone https://github.com/Rachit09-dot/career-navigator
cd career-navigator

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Configure backend environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` — **minimum required:**

```env
JWT_SECRET=any-long-random-string
GEMINI_API_KEY=your_key_from_aistudio.google.com
```

Everything else is optional. The app uses SQLite automatically if Supabase is not configured.

### 3. Set up the database

**Option A — SQLite (easiest, no setup needed):**
The database file (`database.sqlite`) is created automatically on first run.

**Option B — Supabase (production recommended):**
1. Create a project at https://supabase.com
2. Go to SQL Editor and run `backend/supabase-schema.sql`
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to your `.env`

### 4. Configure frontend environment

```bash
cd frontend
cp .env.example .env   # or create manually
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Run development servers

**Backend:**
```bash
cd backend
npm run dev
# Starts on http://localhost:5000
```

**Frontend** (new terminal):
```bash
cd frontend
npm run dev
# Starts on http://localhost:5173
```

---

## API Keys Reference

| Variable | Required | Where to get |
|---|---|---|
| `JWT_SECRET` | ✅ Yes | Generate any random string |
| `GEMINI_API_KEY` | ✅ Yes (for AI) | https://aistudio.google.com/apikey |
| `SUPABASE_URL` | Optional | https://supabase.com/dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase → Project Settings → API |
| `ADZUNA_APP_ID` + `ADZUNA_APP_KEY` | Optional | https://developer.adzuna.com |
| `JSEARCH_API_KEY` | Optional | https://rapidapi.com (JSearch) |
| `GITHUB_TOKEN` | Optional | https://github.com/settings/tokens |

Without job API keys, sample jobs are shown. Without Gemini, AI features use built-in fallback responses.

---

## Database Schema

All tables are in `backend/supabase-schema.sql`. Key tables:

- `users` — authentication
- `profiles` — extended profile info, skills, education
- `career_assessments` — Career DNA + skill gap results
- `interview_sessions` — mock interview Q&A + reports
- `mcq_results` — test scores and answers
- `roadmap_progress` — learning roadmap + milestone completion
- `resumes` — saved resume data (JSON) per user
- `applications` — job application tracker
- `user_xp` + `xp_events` — gamification
- `notifications` — in-app notifications

---

## Production Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# deploy dist/ to Vercel
```

Set environment variable in Vercel:
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

### Backend (Railway / Render)

Set all environment variables from `.env.example` in the platform dashboard.

Build command: `npm run build`
Start command: `npm start`

> **Note:** Railway and Render free tiers have ephemeral filesystems — SQLite data is lost on restart. Use Supabase for persistent data in production.

---

## Project Structure

```
career-navigator/
├── backend/
│   ├── src/
│   │   ├── routes/          # All API route handlers
│   │   ├── middleware/       # JWT auth middleware
│   │   └── utils/           # DB client (Supabase + SQLite fallback)
│   ├── supabase-schema.sql  # Full database schema
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/           # All page components
    │   ├── components/      # Shared components (Navbar, Chatbot, etc.)
    │   ├── services/        # Axios API client
    │   ├── store/           # Zustand auth store
    │   ├── context/         # Theme context
    │   └── data/            # Career DNA questions, stream config
    └── .env (create from example)
```

---

## Phase 2 Changes (implemented)

- Fixed Gemini model names (`gemini-1.5-flash` across all routes)
- Resume Builder: 3 templates (Classic/Modern/Minimal), save/load from DB
- Notifications system: backend route + in-app bell with badge/XP alerts
- Navbar: notifications bell, "More" dropdown for extra links, mobile 2-column grid
- Added `resumes` and `notifications` tables to both SQLite and Supabase schemas
- XP awards now create in-app notifications on badge unlock and level-up
