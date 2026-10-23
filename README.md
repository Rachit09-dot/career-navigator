# 🚀 Career Navigator

An AI-powered career development platform built with React, Express, and Google Gemini AI.

## ✨ Features

- **Career DNA** – AI personality-based career analysis
- **Skill Gap Analyzer** – Compare your skills vs. a target role
- **Job Board** – Browse and track job applications
- **Resume Builder** – Build and export professional resumes (3 templates)
- **Mock Interviews** – AI-graded practice sessions
- **MCQ Skill Tests** – Role-specific multiple choice quizzes
- **Learning Roadmaps** – AI-generated step-by-step learning paths
- **Tools Suite** – GitHub analyzer, cover letter generator, and more
- **Gamification** – XP, badges, and streaks to keep you motivated
- **AI Chatbot** – Career guidance assistant

## 🛠️ Tech Stack

| Layer | Stack |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand, Framer Motion |
| Backend | Node.js, Express 4, TypeScript |
| AI | Google Gemini 2.0 Flash |
| Database | Supabase (PostgreSQL) / SQLite fallback |
| Auth | JWT (bcryptjs) |

---

## 🚀 Deployment

### Backend → Render

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect this GitHub repo
3. Set **Root Directory** to `backend`
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `npm start`
6. Add these **Environment Variables** in the Render dashboard:

| Variable | Required | Where to get |
|---|---|---|
| `JWT_SECRET` | ✅ | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GEMINI_API_KEY` | ✅ | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `NODE_ENV` | ✅ | `production` |
| `SUPABASE_URL` | Recommended | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended | Supabase Dashboard → Project Settings → API |
| `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` | Optional | [developer.adzuna.com](https://developer.adzuna.com) |
| `JSEARCH_API_KEY` | Optional | [rapidapi.com/jsearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) |
| `GITHUB_TOKEN` | Optional | [github.com/settings/tokens](https://github.com/settings/tokens) |

> ⚠️ **Without Supabase credentials**, the backend falls back to SQLite. On Render free tier the disk is ephemeral — **all data will be lost on redeploy**. Set up Supabase for persistent storage.

---

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import this GitHub repo
2. Set **Root Directory** to `frontend`
3. **Framework:** Vite (auto-detected)
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Add this **Environment Variable** in Vercel dashboard:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend.onrender.com/api` |

Replace `your-backend.onrender.com` with your actual Render backend URL.

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/apikey))

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set at minimum: JWT_SECRET and GEMINI_API_KEY
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env
# .env already points to http://localhost:5000/api — no change needed for local dev
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## 📁 Project Structure

```
career-navigator/
├── backend/               # Express API server
│   ├── src/
│   │   ├── server.ts      # App entry point
│   │   ├── middleware/    # Auth (JWT)
│   │   ├── routes/        # 15 API route files
│   │   └── utils/         # DB abstraction + Gemini client
│   ├── railway.toml       # Railway deployment config
│   └── Procfile           # Heroku/Render fallback
│
├── frontend/              # React SPA
│   ├── src/
│   │   ├── App.tsx        # Router + protected routes
│   │   ├── pages/         # ~20 page components
│   │   ├── components/    # Shared UI components
│   │   ├── store/         # Zustand state
│   │   └── services/      # API call helpers
│   └── vercel.json        # SPA rewrite rule for Vercel
│
└── render.yaml            # Render deployment config
```

---

## 📄 License

MIT
