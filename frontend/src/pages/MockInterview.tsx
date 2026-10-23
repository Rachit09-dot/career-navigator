import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Play, ChevronRight, ChevronLeft, CheckCircle,
  Clock, Star, Target, AlertCircle, RotateCcw, Award,
  Mic, MicOff, Send, History, ArrowRight, Loader2
} from 'lucide-react'
import { interviewAPI } from '../services/api'
import { useTheme } from '../context/ThemeContext'

type Stage = 'setup' | 'interview' | 'report' | 'history'

interface Question {
  id: number
  question: string
  type: string
  hint: string
  expectedDuration: number
}

interface Feedback {
  score: number
  scoreOutOf: number
  strengths: string[]
  improvements: string[]
  suggestedAnswer: string
  verdict: string
}

interface Answer {
  questionId: number
  question: string
  answer: string
  feedback: Feedback
}

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Analyst', 'Data Scientist', 'ML Engineer', 'DevOps Engineer',
  'Product Manager', 'UI/UX Designer', 'Cybersecurity Analyst', 'Business Analyst',
]

const CATEGORIES = ['Technical', 'HR', 'Behavioral']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export default function MockInterview() {
  const { theme } = useTheme()
  const [stage, setStage] = useState<Stage>('setup')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('')
  const [category, setCategory] = useState('Technical')
  const [difficulty, setDifficulty] = useState('Medium')
  const [questions, setQuestions] = useState<Question[]>([])
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [evaluating, setEvaluating] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null)
  const [report, setReport] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isDark = theme === 'dark'

  // Timer
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerActive])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const startInterview = async () => {
    if (!role) return
    setLoading(true)
    try {
      const res = await interviewAPI.generate({ role, category, difficulty })
      setQuestions(res.data.questions)
      setSessionId(res.data.sessionId)
      setCurrentIdx(0)
      setAnswers([])
      setAnswer('')
      setCurrentFeedback(null)
      setTimer(0)
      setTimerActive(true)
      setStage('interview')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to start interview. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!answer.trim() || evaluating) return
    setEvaluating(true)
    setTimerActive(false)
    try {
      const q = questions[currentIdx]
      const res = await interviewAPI.evaluate({
        sessionId: sessionId!,
        questionId: q.id,
        question: q.question,
        answer,
        role,
      })
      const fb = res.data.feedback
      setCurrentFeedback(fb)
      setAnswers(prev => [...prev, { questionId: q.id, question: q.question, answer, feedback: fb }])
    } catch {
      alert('Failed to evaluate answer. Please try again.')
    } finally {
      setEvaluating(false)
    }
  }

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1)
      setAnswer('')
      setCurrentFeedback(null)
      setTimer(0)
      setTimerActive(true)
      textareaRef.current?.focus()
    } else {
      finishInterview()
    }
  }

  const finishInterview = async () => {
    setLoading(true)
    try {
      const res = await interviewAPI.complete(sessionId!)
      setReport(res.data.report)
      setStage('report')
    } catch {
      alert('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = async () => {
    try {
      const res = await interviewAPI.getHistory()
      setHistory(res.data)
    } catch { setHistory([]) }
    setStage('history')
  }

  const card = { background: isDark ? 'rgba(255,255,255,0.04)' : 'white', border: `1px solid ${isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.15)'}`, borderRadius: 20, padding: 24 }

  // ── SETUP ──────────────────────────────────────────────────────────────────
  if (stage === 'setup') return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <h1 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 32, fontWeight: 900, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                🎯 AI Mock Interview
              </h1>
              <p style={{ color: isDark ? 'rgba(196,181,253,0.7)' : '#64748b', marginTop: 8 }}>
                Practice with AI-powered interviews tailored to your target role
              </p>
            </div>
            <button onClick={loadHistory}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: 'transparent', color: isDark ? '#a78bfa' : '#7c3aed', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              <History size={14} /> History
            </button>
          </div>

          <div style={card}>
            <h2 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Configure Your Interview</h2>

            {/* Role */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Target Role *</label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Software Engineer, Data Analyst..."
                list="roles-list"
                style={{ width: '100%', padding: '12px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : 'white', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`, borderRadius: 12, color: isDark ? 'white' : '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
              <datalist id="roles-list">{ROLES.map(r => <option key={r} value={r} />)}</datalist>
            </div>

            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Interview Type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    style={{ flex: 1, padding: '10px 16px', borderRadius: 10, border: `1px solid ${category === c ? '#7c3aed' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`, background: category === c ? 'rgba(124,58,237,0.15)' : 'transparent', color: category === c ? (isDark ? '#c4b5fd' : '#7c3aed') : (isDark ? 'rgba(203,213,225,0.6)' : '#64748b'), cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.15s' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Difficulty</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {DIFFICULTIES.map(d => {
                  const colors: any = { Easy: '#16a34a', Medium: '#d97706', Hard: '#dc2626' }
                  const active = difficulty === d
                  return (
                    <button key={d} onClick={() => setDifficulty(d)}
                      style={{ flex: 1, padding: '10px 16px', borderRadius: 10, border: `1px solid ${active ? colors[d] : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`, background: active ? `${colors[d]}20` : 'transparent', color: active ? colors[d] : (isDark ? 'rgba(203,213,225,0.6)' : '#64748b'), cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.15s' }}>
                      {d}
                    </button>
                  )
                })}
              </div>
            </div>

            <motion.button onClick={startInterview} disabled={!role || loading}
              whileHover={role && !loading ? { scale: 1.02 } : {}}
              whileTap={role && !loading ? { scale: 0.98 } : {}}
              style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: role && !loading ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'rgba(124,58,237,0.3)', color: 'white', fontSize: 16, fontWeight: 700, cursor: role && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: role ? '0 4px 20px rgba(124,58,237,0.3)' : 'none' }}>
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating Questions...</> : <><Play size={18} /> Start Interview</>}
            </motion.button>
          </div>

          {/* Tips */}
          <div style={{ ...card, marginTop: 20 }}>
            <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>💡 Tips for Best Results</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {['Type your answer as you would speak it — be specific and detailed', 'Use the STAR method for behavioral questions: Situation, Task, Action, Result', 'Technical questions: explain your thought process, not just the answer', 'HR questions: be honest and connect answers to your actual experience'].map((tip, i) => (
                <li key={i} style={{ color: isDark ? 'rgba(203,213,225,0.7)' : '#64748b', fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>{tip}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ── INTERVIEW ──────────────────────────────────────────────────────────────
  if (stage === 'interview') {
    const q = questions[currentIdx]
    const answered = answers.find(a => a.questionId === q?.id)

    return (
      <div style={{ minHeight: '100vh', padding: '24px 16px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 20, fontWeight: 800, margin: 0 }}>{role} — {category}</h2>
              <p style={{ color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 13, margin: '4px 0 0' }}>{difficulty} difficulty</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderRadius: 20, padding: '6px 14px' }}>
                <Clock size={14} color={isDark ? '#a78bfa' : '#7c3aed'} />
                <span style={{ color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 13, fontWeight: 600 }}>{formatTime(timer)}</span>
              </div>
              <span style={{ color: isDark ? 'rgba(203,213,225,0.6)' : '#64748b', fontSize: 13 }}>
                {currentIdx + 1} / {questions.length}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', borderRadius: 999, height: 6, marginBottom: 24, overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 999 }}
              animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>

          {/* Question */}
          <motion.div key={currentIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ ...card, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Brain size={18} color="white" />
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#a78bfa' : '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Question {currentIdx + 1}</span>
                <p style={{ color: isDark ? 'white' : '#0f172a', fontSize: 17, fontWeight: 600, margin: '4px 0 0', lineHeight: 1.5 }}>{q?.question}</p>
              </div>
            </div>
            {q?.hint && (
              <div style={{ background: isDark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)', border: `1px solid ${isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)'}`, borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ color: isDark ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 12, margin: 0 }}>💡 Hint: {q.hint}</p>
              </div>
            )}
          </motion.div>

          {/* Answer */}
          {!currentFeedback ? (
            <div style={card}>
              <label style={{ display: 'block', color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Answer</label>
              <textarea
                ref={textareaRef}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer here... Be specific and detailed."
                rows={6}
                style={{ width: '100%', padding: '12px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: isDark ? 'white' : '#0f172a', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <span style={{ color: isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 12 }}>{answer.split(' ').filter(w => w).length} words</span>
                <motion.button onClick={submitAnswer} disabled={!answer.trim() || evaluating}
                  whileHover={answer.trim() && !evaluating ? { scale: 1.03 } : {}}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 12, border: 'none', background: answer.trim() && !evaluating ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'rgba(124,58,237,0.3)', color: 'white', fontSize: 14, fontWeight: 700, cursor: answer.trim() && !evaluating ? 'pointer' : 'not-allowed' }}>
                  {evaluating ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Evaluating...</> : <><Send size={15} /> Submit Answer</>}
                </motion.button>
              </div>
            </div>
          ) : (
            /* Feedback */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 17, fontWeight: 700, margin: 0 }}>📊 Answer Feedback</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: currentFeedback.score >= 7 ? '#16a34a' : currentFeedback.score >= 5 ? '#d97706' : '#dc2626', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{currentFeedback.score}/{currentFeedback.scoreOutOf}</span>
                  <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, fontWeight: 700, background: currentFeedback.verdict === 'Excellent' ? 'rgba(22,163,74,0.15)' : currentFeedback.verdict === 'Good' ? 'rgba(124,58,237,0.15)' : 'rgba(217,119,6,0.15)', color: currentFeedback.verdict === 'Excellent' ? '#16a34a' : currentFeedback.verdict === 'Good' ? '#7c3aed' : '#d97706' }}>{currentFeedback.verdict}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div style={{ background: isDark ? 'rgba(22,163,74,0.1)' : 'rgba(22,163,74,0.05)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 12, padding: 14 }}>
                  <p style={{ color: '#16a34a', fontSize: 12, fontWeight: 700, margin: '0 0 8px' }}>✅ STRENGTHS</p>
                  {currentFeedback.strengths.map((s, i) => <p key={i} style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 13, margin: '4px 0' }}>• {s}</p>)}
                </div>
                <div style={{ background: isDark ? 'rgba(217,119,6,0.1)' : 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 12, padding: 14 }}>
                  <p style={{ color: '#d97706', fontSize: 12, fontWeight: 700, margin: '0 0 8px' }}>🔧 IMPROVE</p>
                  {currentFeedback.improvements.map((s, i) => <p key={i} style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 13, margin: '4px 0' }}>• {s}</p>)}
                </div>
              </div>

              {currentFeedback.suggestedAnswer && (
                <div style={{ background: isDark ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
                  <p style={{ color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 700, margin: '0 0 6px' }}>💡 SUGGESTED APPROACH</p>
                  <p style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{currentFeedback.suggestedAnswer}</p>
                </div>
              )}

              <button onClick={nextQuestion}
                style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating Report...</>
                  : currentIdx < questions.length - 1 ? <><ChevronRight size={16} /> Next Question</> : <><Award size={16} /> Finish & Get Report</>}
              </button>
            </motion.div>
          )}
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  // ── REPORT ─────────────────────────────────────────────────────────────────
  if (stage === 'report' && report) return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}>
              <Award size={36} color="white" />
            </div>
            <h1 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 28, fontWeight: 900, margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Interview Complete!</h1>
            <p style={{ color: isDark ? '#a78bfa' : '#7c3aed' }}>{role} — {category} Interview</p>
          </div>

          {/* Score */}
          <div style={{ ...card, textAlign: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 64, fontWeight: 900, color: report.overallScore >= 80 ? '#4ade80' : report.overallScore >= 60 ? '#a78bfa' : '#fbbf24', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{report.overallScore}</p>
            <p style={{ color: isDark ? 'rgba(203,213,225,0.7)' : '#64748b', margin: '4px 0 12px' }}>Overall Score</p>
            <span style={{ fontSize: 14, fontWeight: 700, padding: '6px 16px', borderRadius: 999, background: 'rgba(124,58,237,0.15)', color: isDark ? '#c4b5fd' : '#7c3aed' }}>Grade: {report.grade} — {report.readinessLevel}</span>
            <p style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', margin: '16px 0 0', lineHeight: 1.6 }}>{report.summary}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={card}>
              <h3 style={{ color: '#4ade80', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>✅ Top Strengths</h3>
              {report.topStrengths?.map((s: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <CheckCircle size={14} color="#4ade80" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 13 }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={card}>
              <h3 style={{ color: '#fbbf24', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🎯 Priority Improvements</h3>
              {report.priorityImprovements?.map((s: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Target size={14} color="#fbbf24" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 13 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...card, marginBottom: 20 }}>
            <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📋 Next Steps</h3>
            {report.nextSteps?.map((s: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#a78bfa', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                </div>
                <span style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 13, lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>

          {/* Per-question scores */}
          {answers.length > 0 && (
            <div style={card}>
              <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📊 Question-by-Question</h3>
              {answers.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < answers.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}` : 'none' }}>
                  <span style={{ color: isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 12, minWidth: 24 }}>Q{i + 1}</span>
                  <p style={{ flex: 1, color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.question}</p>
                  <span style={{ fontSize: 13, fontWeight: 700, color: a.feedback.score >= 7 ? '#4ade80' : a.feedback.score >= 5 ? '#fbbf24' : '#f87171', minWidth: 40, textAlign: 'right' }}>{a.feedback.score}/10</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button onClick={() => setStage('setup')}
              style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: 'transparent', color: isDark ? 'white' : '#0f172a', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <RotateCcw size={15} /> New Interview
            </button>
            <button onClick={loadHistory}
              style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <History size={15} /> View History
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )

  // ── HISTORY ────────────────────────────────────────────────────────────────
  if (stage === 'history') return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 24, fontWeight: 800, margin: 0 }}>Interview History</h1>
          <button onClick={() => setStage('setup')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <Play size={13} /> New Interview
          </button>
        </div>
        {history.length === 0 ? (
          <div style={{ ...card, textAlign: 'center', padding: 48 }}>
            <Brain size={48} color={isDark ? '#a78bfa' : '#7c3aed'} style={{ margin: '0 auto 16px' }} />
            <p style={{ color: isDark ? 'rgba(203,213,225,0.7)' : '#64748b' }}>No interviews yet. Start your first mock interview!</p>
          </div>
        ) : (
          history.map(session => (
            <motion.div key={session.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ ...card, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Brain size={22} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, margin: 0 }}>{session.role}</p>
                <p style={{ color: isDark ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12, margin: '2px 0 0' }}>{session.category} · {session.difficulty} · {new Date(session.created_at).toLocaleDateString()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                {session.score !== null && session.score !== undefined
                  ? <p style={{ color: session.score >= 80 ? '#4ade80' : session.score >= 60 ? '#a78bfa' : '#fbbf24', fontSize: 20, fontWeight: 900, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{session.score}</p>
                  : <span style={{ background: 'rgba(217,119,6,0.15)', color: '#d97706', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>In Progress</span>}
                {session.status === 'completed' && <p style={{ color: isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 11, margin: '2px 0 0' }}>Score</p>}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )

  return null
}
