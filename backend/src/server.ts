import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'
import careerRoutes from './routes/career'
import skillGapRoutes from './routes/skillGap'
import jobRoutes from './routes/jobs'
import applicationRoutes from './routes/applications'
import resumeRoutes from './routes/resume'
import resumeDataRoutes from './routes/resumeData'
import chatRoutes from './routes/chat'
import interviewRoutes from './routes/interview'
import roadmapRoutes from './routes/roadmap'
import toolsRoutes from './routes/tools'
import mcqRoutes from './routes/mcq'
import gamificationRoutes from './routes/gamification'
import notificationsRoutes from './routes/notifications'

dotenv.config()

const app = express()

// ✅ FIX: ensure PORT is always a number
const PORT: number = Number(process.env.PORT) || 5000

// Trust proxy for Render/Railway deployments (required for express-rate-limit)
app.set('trust proxy', 1)

// Security
app.use(helmet())

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { message: 'Too many requests, please try again later.' },
})

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { message: 'Too many auth attempts, please wait a minute.' },
})

app.use(globalLimiter)

// CORS
app.use(cors({
  origin: true,
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Root route
app.get('/', (_req, res) => {
  res.send('Server is running 🚀')
})

// Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/career', careerRoutes)
app.use('/api/skill-gap', skillGapRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/resume-data', resumeDataRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/interview', interviewRoutes)
app.use('/api/roadmap', roadmapRoutes)
app.use('/api/tools', toolsRoutes)
app.use('/api/mcq', mcqRoutes)
app.use('/api/gamification', gamificationRoutes)
app.use('/api/notifications', notificationsRoutes)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'CareerNavigator API is running',
    timestamp: new Date().toISOString()
  })
})

// Error handling
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// 🚀 START SERVER
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🔒 Security: Helmet + Rate Limiting enabled`)
})

export default app

