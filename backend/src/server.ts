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
import chatRoutes from './routes/chat'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

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
  max: 5,
  message: { message: 'Too many auth attempts, please wait a minute.' },
})

app.use(globalLimiter)

// CORS (production safe)
app.use(cors({
  origin: true,
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ✅ ROOT ROUTE (VERY IMPORTANT for Railway)
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
app.use('/api/chat', chatRoutes)

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🔒 Security: Helmet + Rate Limiting enabled`)
})

export default app