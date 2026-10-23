import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Play, Clock, Flag, ChevronRight, ChevronLeft,
  CheckCircle, XCircle, Award, RotateCcw, History, Loader2, AlertCircle
} from 'lucide-react'
import { mcqAPI } from '../services/api'
import { useTheme } from '../context/ThemeContext'

type Stage = 'setup' | 'test' | 'results' | 'history'

const POPULAR_ROLES = [
  'Software Engineer', 'Data Analyst', 'Data Scientist', 'Full Stack Developer',
  'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'ML Engineer',
  'UI/UX Designer', 'Product Manager', 'Business Analyst', 'Cybersecurity Analyst',
]
const TOPICS: Record<string, string[]> = {
  'Software Engineer': ['Data Structures', 'Algorithms', 'System Design', 'OOP', 'Databases', 'Operating Systems'],
  'Data Analyst': ['SQL', 'Python Pandas', 'Statistics', 'Excel', 'Power BI', 'Data Visualization'],
  'Data Scientist': ['Machine Learning', 'Statistics', 'Python', 'Deep Learning', 'Feature Engineering', 'Model Evaluation'],
  'Frontend Developer': ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Performance', 'Accessibility'],
  'Backend Developer': ['REST APIs', 'Databases', 'Node.js', 'System Design', 'Security', 'Caching'],
}
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export default function MCQTest() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [stage, setStage] = useState<Stage>('setup')
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [flagged, setFlagged] = useState<Set<number>>(new Set())
  const [timer, setTimer] = useState(0)
  const [results, setResults] = useState<any>(null)
  const [showExplanation, setShowExplanation] = useState<number | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isDark_ = isDark
  const card = { background: isDark_ ? 'rgba(255,255,255,0.04)' : 'white', border: `1px solid ${isDark_ ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)'}`, borderRadius: 20 }

  useEffect(() => {
    if (stage === 'test') {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
  }, [stage])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const startTest = async () => {
    if (!role) return
    setLoading(true)
    try {
      const res = await mcqAPI.generate({ role, topic: topic || undefined, difficulty, count: 10 })
      setQuestions(res.data.questions)
      setCurrentIdx(0)
      setUserAnswers({})
      setFlagged(new Set())
      setTimer(0)
      setStage('test')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to generate questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectAnswer = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const toggleFlag = (questionId: number) => {
    setFlagged(prev => {
      const next = new Set(prev)
      next.has(questionId) ? next.delete(questionId) : next.add(questionId)
      return next
    })
  }

  const submitTest = async () => {
    const unanswered = questions.filter(q => !userAnswers[q.id]).length
    if (unanswered > 0) {
      const proceed = window.confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)
      if (!proceed) return
    }
    if (timerRef.current) clearInterval(timerRef.current)
    setLoading(true)
    try {
      const res = await mcqAPI.submit({ role, topic, difficulty, questions, userAnswers, timeTaken: timer })
      setResults(res.data)
      setStage('results')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit test. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = async () => {
    try {
      const res = await mcqAPI.getHistory()
      setHistory(res.data)
    } catch { setHistory([]) }
    setStage('history')
  }

  const q = questions[currentIdx]
  const answered = Object.keys(userAnswers).length
  const topicsForRole = TOPICS[role] || []

  // ── SETUP ──────────────────────────────────────────────────────────────────
  if (stage === 'setup') return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
            <div>
              <h1 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 30, fontWeight: 900, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>📝 MCQ Mock Tests</h1>
              <p style={{ color: isDark ? 'rgba(196,181,253,0.7)' : '#64748b', marginTop: 8 }}>Role-specific tests with instant feedback and detailed explanations</p>
            </div>
            <button onClick={loadHistory}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: 'transparent', color: isDark ? '#a78bfa' : '#7c3aed', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              <History size={14} /> History
            </button>
          </div>

          <div style={{ ...card, padding: 28 }}>
            {/* Role */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Target Role *</label>
              <input value={role} onChange={e => { setRole(e.target.value); setTopic('') }} placeholder="e.g. Software Engineer, Data Analyst..." list="mcq-roles"
                style={{ width: '100%', padding: '12px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: isDark ? 'white' : '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              <datalist id="mcq-roles">{POPULAR_ROLES.map(r => <option key={r} value={r} />)}</datalist>
            </div>

            {/* Topic */}
            {topicsForRole.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Topic (Optional)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button onClick={() => setTopic('')}
                    style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${!topic ? '#7c3aed' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`, background: !topic ? 'rgba(124,58,237,0.15)' : 'transparent', color: !topic ? (isDark ? '#c4b5fd' : '#7c3aed') : (isDark ? 'rgba(203,213,225,0.6)' : '#64748b'), cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                    All Topics
                  </button>
                  {topicsForRole.map(t => (
                    <button key={t} onClick={() => setTopic(t)}
                      style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${topic === t ? '#7c3aed' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`, background: topic === t ? 'rgba(124,58,237,0.15)' : 'transparent', color: topic === t ? (isDark ? '#c4b5fd' : '#7c3aed') : (isDark ? 'rgba(203,213,225,0.6)' : '#64748b'), cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Difficulty</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {DIFFICULTIES.map(d => {
                  const colors: any = { Easy: '#16a34a', Medium: '#d97706', Hard: '#dc2626' }
                  const active = difficulty === d
                  return (
                    <button key={d} onClick={() => setDifficulty(d)}
                      style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${active ? colors[d] : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`, background: active ? `${colors[d]}20` : 'transparent', color: active ? colors[d] : (isDark ? 'rgba(203,213,225,0.6)' : '#64748b'), cursor: 'pointer', fontWeight: 600, fontSize: 13, transition: 'all 0.15s' }}>
                      {d}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ background: isDark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.04)', border: `1px solid ${isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)'}`, borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ color: isDark ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 13, margin: 0 }}>
                📋 <strong>10 questions</strong> · Flag questions for review · Timer tracked · Detailed explanations after submission
              </p>
            </div>

            <motion.button onClick={startTest} disabled={!role || loading}
              whileHover={role && !loading ? { scale: 1.02 } : {}}
              style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: role && !loading ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'rgba(124,58,237,0.3)', color: 'white', fontSize: 15, fontWeight: 700, cursor: role && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating Test...</> : <><Play size={16} /> Start Test</>}
            </motion.button>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ── TEST ───────────────────────────────────────────────────────────────────
  if (stage === 'test' && q) return (
    <div style={{ minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0 }}>{role}{topic ? ` — ${topic}` : ''}</h2>
            <p style={{ color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 12, margin: '4px 0 0' }}>{difficulty} difficulty</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderRadius: 20, padding: '6px 12px' }}>
              <Clock size={13} color={isDark ? '#a78bfa' : '#7c3aed'} />
              <span style={{ color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }}>{formatTime(timer)}</span>
            </div>
            <span style={{ color: isDark ? 'rgba(203,213,225,0.6)' : '#64748b', fontSize: 13 }}>{answered}/{questions.length} answered</span>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', borderRadius: 999, height: 4, marginBottom: 20, overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 999 }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>

        {/* Question navigator dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {questions.map((qn, i) => {
            const isAnswered = !!userAnswers[qn.id]
            const isFlagged = flagged.has(qn.id)
            const isCurrent = i === currentIdx
            return (
              <button key={i} onClick={() => setCurrentIdx(i)}
                style={{ width: 32, height: 32, borderRadius: 8, border: `2px solid ${isCurrent ? '#7c3aed' : isAnswered ? '#4ade80' : isFlagged ? '#f59e0b' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`, background: isCurrent ? 'rgba(124,58,237,0.2)' : isAnswered ? 'rgba(74,222,128,0.15)' : isFlagged ? 'rgba(245,158,11,0.15)' : 'transparent', color: isCurrent ? '#a78bfa' : isAnswered ? '#4ade80' : isFlagged ? '#f59e0b' : (isDark ? 'rgba(203,213,225,0.6)' : '#64748b'), cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                {i + 1}
              </button>
            )
          })}
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div key={currentIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            style={{ ...card, padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 11, color: isDark ? '#a78bfa' : '#7c3aed', fontWeight: 700 }}>Q{currentIdx + 1} of {questions.length}</span>
                {q.topic && <span style={{ marginLeft: 10, fontSize: 11, padding: '2px 8px', borderRadius: 999, background: 'rgba(124,58,237,0.15)', color: isDark ? '#c4b5fd' : '#7c3aed' }}>{q.topic}</span>}
                <p style={{ color: isDark ? 'white' : '#0f172a', fontSize: 16, fontWeight: 600, margin: '8px 0 0', lineHeight: 1.5 }}>{q.question}</p>
              </div>
              <button onClick={() => toggleFlag(q.id)}
                style={{ background: flagged.has(q.id) ? 'rgba(245,158,11,0.15)' : 'transparent', border: `1px solid ${flagged.has(q.id) ? '#f59e0b' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 12, flexShrink: 0 }}>
                <Flag size={14} color={flagged.has(q.id) ? '#f59e0b' : (isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8')} />
              </button>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt: string, i: number) => {
                const selected = userAnswers[q.id] === opt
                const labels = ['A', 'B', 'C', 'D']
                return (
                  <motion.button key={i} onClick={() => selectAnswer(q.id, opt)}
                    whileHover={{ scale: 1.01 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, border: `1.5px solid ${selected ? '#7c3aed' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)')}`, background: selected ? 'rgba(124,58,237,0.15)' : (isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'), cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: selected ? '#7c3aed' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: selected ? 'white' : (isDark ? 'rgba(148,163,184,0.7)' : '#64748b'), fontSize: 12, fontWeight: 700 }}>{labels[i]}</span>
                    </div>
                    <span style={{ color: selected ? (isDark ? 'white' : '#0f172a') : (isDark ? 'rgba(203,213,225,0.8)' : '#374151'), fontSize: 14 }}>{opt}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 12, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: 'transparent', color: isDark ? 'rgba(203,213,225,0.7)' : '#64748b', cursor: currentIdx > 0 ? 'pointer' : 'not-allowed', opacity: currentIdx === 0 ? 0.5 : 1, fontSize: 14 }}>
            <ChevronLeft size={15} /> Prev
          </button>

          {currentIdx < questions.length - 1 ? (
            <button onClick={() => setCurrentIdx(i => i + 1)}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 12, border: 'none', background: 'rgba(124,58,237,0.15)', color: isDark ? '#c4b5fd' : '#7c3aed', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              Next <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={submitTest} disabled={loading}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 12, border: 'none', background: loading ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700 }}>
              {loading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : <><Award size={15} /> Submit Test</>}
            </button>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if (stage === 'results' && results) return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Score header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: results.score >= 70 ? 'linear-gradient(135deg, #16a34a, #15803d)' : results.score >= 50 ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'linear-gradient(135deg, #dc2626, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}>
              <Award size={36} color="white" />
            </div>
            <h1 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 26, fontWeight: 900, margin: '0 0 4px' }}>Test Complete!</h1>
            <p style={{ color: isDark ? '#a78bfa' : '#7c3aed', margin: 0 }}>{role}{topic ? ` — ${topic}` : ''}</p>
          </div>

          {/* Score card */}
          <div style={{ ...card, padding: 24, textAlign: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 56, fontWeight: 900, color: results.score >= 70 ? '#4ade80' : results.score >= 50 ? '#a78bfa' : '#f87171', margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{results.score}%</p>
            <p style={{ color: isDark ? 'rgba(203,213,225,0.7)' : '#64748b', margin: '0 0 12px' }}>{results.correct}/{results.total} correct · Grade: {results.grade}</p>
            <p style={{ color: isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 13 }}>
              <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
              Time taken: {formatTime(results.timeTaken || 0)}
            </p>
          </div>

          {/* Topic breakdown */}
          {results.topicBreakdown?.length > 1 && (
            <div style={{ ...card, padding: 20, marginBottom: 20 }}>
              <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📊 Topic-wise Performance</h3>
              {results.topicBreakdown.map((t: any, i: number) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 13 }}>{t.topic}</span>
                    <span style={{ color: isDark ? 'white' : '#0f172a', fontSize: 13, fontWeight: 700 }}>{t.correct}/{t.total} ({t.percentage}%)</span>
                  </div>
                  <div style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                    <motion.div style={{ height: '100%', background: t.percentage >= 70 ? '#4ade80' : t.percentage >= 50 ? '#a78bfa' : '#f87171', borderRadius: 999 }}
                      initial={{ width: 0 }} animate={{ width: `${t.percentage}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Q&A review */}
          <div style={{ ...card, padding: 20, marginBottom: 20 }}>
            <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📋 Question Review</h3>
            {results.detailed.map((d: any, i: number) => (
              <div key={i} style={{ borderBottom: i < results.detailed.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}` : 'none', paddingBottom: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                  {d.isCorrect
                    ? <CheckCircle size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: 2 }} />
                    : <XCircle size={18} color="#f87171" style={{ flexShrink: 0, marginTop: 2 }} />}
                  <p style={{ color: isDark ? 'rgba(203,213,225,0.9)' : '#0f172a', fontSize: 14, margin: 0, fontWeight: 500, lineHeight: 1.5 }}>{d.question}</p>
                </div>
                {!d.isCorrect && d.userAnswer && (
                  <p style={{ color: '#f87171', fontSize: 12, margin: '0 0 4px 28px' }}>Your answer: {d.userAnswer}</p>
                )}
                <p style={{ color: '#4ade80', fontSize: 12, margin: '0 0 8px 28px' }}>Correct: {d.correctAnswer}</p>
                {d.explanation && (
                  <button onClick={() => setShowExplanation(showExplanation === i ? null : i)}
                    style={{ background: 'none', border: 'none', color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 12, cursor: 'pointer', marginLeft: 28, fontWeight: 600, padding: 0 }}>
                    {showExplanation === i ? '▲ Hide' : '▼ Show'} Explanation
                  </button>
                )}
                <AnimatePresence>
                  {showExplanation === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden', marginLeft: 28, marginTop: 8 }}>
                      <p style={{ color: isDark ? 'rgba(196,181,253,0.8)' : '#64748b', fontSize: 13, background: isDark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.04)', padding: '10px 12px', borderRadius: 8, margin: 0 }}>{d.explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setStage('setup')}
              style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: 'transparent', color: isDark ? 'white' : '#0f172a', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <RotateCcw size={14} /> New Test
            </button>
            <button onClick={loadHistory}
              style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <History size={14} /> View History
            </button>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ── HISTORY ────────────────────────────────────────────────────────────────
  if (stage === 'history') return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 22, fontWeight: 800, margin: 0 }}>Test History</h1>
          <button onClick={() => setStage('setup')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <Play size={13} /> New Test
          </button>
        </div>
        {history.length === 0 ? (
          <div style={{ ...card, padding: 48, textAlign: 'center' }}>
            <BookOpen size={48} color={isDark ? '#a78bfa' : '#7c3aed'} style={{ margin: '0 auto 16px' }} />
            <p style={{ color: isDark ? 'rgba(203,213,225,0.7)' : '#64748b' }}>No tests taken yet. Start your first MCQ test!</p>
          </div>
        ) : history.map(r => (
          <motion.div key={r.id} whileHover={{ y: -2 }} style={{ ...card, padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: r.score >= 70 ? 'linear-gradient(135deg, #16a34a, #15803d)' : r.score >= 50 ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'linear-gradient(135deg, #dc2626, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={22} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, margin: 0 }}>{r.role}</p>
              <p style={{ color: isDark ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12, margin: '2px 0 0' }}>{r.topic} · {new Date(r.created_at).toLocaleDateString()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: r.score >= 70 ? '#4ade80' : r.score >= 50 ? '#a78bfa' : '#f87171', fontSize: 22, fontWeight: 900, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.score}%</p>
              <p style={{ color: isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 11, margin: 0 }}>{r.total} questions</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  return null
}
