import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { skillGapAPI } from '../services/api'
import { useTheme } from '../context/ThemeContext'
import { Brain, X, Loader2, CheckCircle, XCircle, Award, Target, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Question {
  question: string
  options: string[]
  correctAnswer: string
}

interface SkillEvaluationModalProps {
  role: string
  isOpen: boolean
  onClose: () => void
}

const SkillEvaluationModal: React.FC<SkillEvaluationModalProps> = ({ role, isOpen, onClose }) => {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      setQuestions([])
      setCurrentIndex(0)
      setAnswers({})
      setSubmitted(false)
      setError('')

      skillGapAPI.generateTest(role)
        .then((res) => {
          setQuestions(res.data.questions)
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setError('Failed to load evaluation test. Please try again.')
          setLoading(false)
        })
    }
  }, [isOpen, role])

  if (!isOpen) return null

  const handleSelectOption = (option: string) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [currentIndex]: option }))
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  let score = 0
  if (submitted) {
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        score += 1
      }
    })
  }

  const isDark = theme === 'dark'
  const currentQ = questions[currentIndex]
  const pct = Math.round((score / questions.length) * 100) || 0

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
        style={{ position: 'relative', width: '100%', maxWidth: 720, background: isDark ? '#0f172a' : '#ffffff', border: `1px solid ${isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.2)'}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124,58,237,0.15)' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(124,58,237,0.2)' }}>
              <Brain style={{ width: 18, height: 18, color: '#a78bfa' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: isDark ? 'white' : '#0f172a', fontSize: 16, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Skill Evaluation Test</h3>
              <p style={{ margin: 0, color: isDark ? 'rgba(148,163,184,0.8)' : '#64748b', fontSize: 12 }}>for <span style={{ color: '#8b5cf6', fontWeight: 600 }}>{role}</span></p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isDark ? 'rgba(148,163,184,0.8)' : '#64748b', display: 'flex', padding: 8, borderRadius: '50%', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 32px 40px', minHeight: 400, position: 'relative' }}>
          <AnimatePresence mode="wait">
            
            {/* Loading State */}
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: 64, height: 64, marginBottom: 20 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: '#8b5cf6', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain style={{ width: 24, height: 24, color: isDark ? 'white' : '#0f172a' }} />
                  </div>
                </div>
                <h4 style={{ margin: 0, color: isDark ? 'white' : '#0f172a', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Generating Questions...</h4>
                <p style={{ margin: 0, color: isDark ? 'rgba(148,163,184,0.8)' : '#64748b', fontSize: 14 }}>AI is crafting a role-specific test for you.</p>
              </motion.div>
            )}

            {/* Error State */}
            {!loading && error && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <XCircle style={{ width: 48, height: 48, color: '#ef4444', marginBottom: 16 }} />
                <h4 style={{ margin: 0, color: '#ef4444', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Error</h4>
                <p style={{ margin: 0, color: isDark ? 'rgba(148,163,184,0.8)' : '#64748b', fontSize: 14 }}>{error}</p>
                <button onClick={onClose} style={{ marginTop: 24, padding: '10px 24px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, cursor: 'pointer', fontWeight: 600 }}>Close</button>
              </motion.div>
            )}

            {/* Questions State */}
            {!loading && !error && !submitted && questions.length > 0 && (
              <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <span style={{ color: '#8b5cf6', fontWeight: 700, fontSize: 14 }}>Question {currentIndex + 1} of {questions.length}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {questions.map((_, i) => (
                      <div key={i} style={{ width: 32, height: 6, borderRadius: 3, background: i === currentIndex ? '#8b5cf6' : (answers[i] ? 'rgba(139,92,246,0.4)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')) }} />
                    ))}
                  </div>
                </div>

                <h2 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 20, fontWeight: 700, lineHeight: 1.4, marginBottom: 32, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {currentQ.question}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = answers[currentIndex] === opt
                    return (
                      <motion.button key={idx} onClick={() => handleSelectOption(opt)}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s',
                          background: isSelected ? 'rgba(139,92,246,0.1)' : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                          border: `2px solid ${isSelected ? '#8b5cf6' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                          color: isSelected ? (isDark ? 'white' : '#0f172a') : (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(15,23,42,0.8)'),
                          fontSize: 15, fontWeight: isSelected ? 600 : 500,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                        {opt}
                        {isSelected && <CheckCircle style={{ width: 18, height: 18, color: '#8b5cf6' }} />}
                      </motion.button>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                  {currentIndex < questions.length - 1 ? (
                    <button onClick={handleNext} disabled={!answers[currentIndex]}
                      style={{ padding: '12px 28px', background: answers[currentIndex] ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: answers[currentIndex] ? 'white' : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'), border: 'none', borderRadius: 12, cursor: answers[currentIndex] ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                      Next <ArrowRight style={{ width: 16, height: 16 }} />
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length}
                      style={{ padding: '12px 28px', background: Object.keys(answers).length === questions.length ? 'linear-gradient(135deg, #10b981, #059669)' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: Object.keys(answers).length === questions.length ? 'white' : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'), border: 'none', borderRadius: 12, cursor: Object.keys(answers).length === questions.length ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: Object.keys(answers).length === questions.length ? '0 4px 14px rgba(16,185,129,0.3)' : 'none' }}>
                      Submit Evaluation <CheckCircle style={{ width: 16, height: 16 }} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Results State */}
            {submitted && (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 20 }}>
                <div style={{ position: 'relative', marginBottom: 24 }}>
                  <div style={{ position: 'absolute', inset: -20, background: pct >= 80 ? 'radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%)' : 'radial-gradient(circle, rgba(245,158,11,0.3), transparent 70%)', filter: 'blur(15px)', borderRadius: '50%' }} />
                  <div style={{ width: 96, height: 96, borderRadius: '50%', background: pct >= 80 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `2px solid ${pct >= 80 ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <Target style={{ width: 40, height: 40, color: pct >= 80 ? '#10b981' : '#f59e0b' }} />
                  </div>
                </div>

                <h2 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 32, fontWeight: 800, margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {pct >= 80 ? 'Excellent Work!' : pct >= 50 ? 'Good Effort!' : 'Needs More Preparation'}
                </h2>
                <p style={{ color: isDark ? 'rgba(148,163,184,0.8)' : '#64748b', fontSize: 16, margin: '0 0 12px' }}>
                  You scored <span style={{ color: pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444', fontWeight: 800, fontSize: 18 }}>{score} out of {questions.length}</span> ({pct}%)
                </p>
                
                {pct < 50 && (
                  <p style={{ color: '#ef4444', fontSize: 14, margin: '0 0 24px', fontWeight: 600, background: 'rgba(239,68,68,0.1)', padding: '10px 16px', borderRadius: 12 }}>
                    Most of your answers were incorrect. We highly recommend going back and reviewing the learning resources carefully before trying again!
                  </p>
                )}
                {pct >= 50 && <div style={{ marginBottom: 24 }} />}

                <div style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`, borderRadius: 20, padding: 24, marginBottom: 32, textAlign: 'left' }}>
                  <h4 style={{ margin: '0 0 16px', color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700 }}>Review</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 250, overflowY: 'auto', paddingRight: 8 }}>
                    {questions.map((q, i) => {
                      const isCorrect = answers[i] === q.correctAnswer
                      return (
                        <div key={i} style={{ padding: 12, borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderLeft: `3px solid ${isCorrect ? '#10b981' : '#ef4444'}` }}>
                          <p style={{ margin: '0 0 8px', color: isDark ? 'white' : '#0f172a', fontSize: 14, fontWeight: 600 }}>{q.question}</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {!isCorrect && <span style={{ color: '#ef4444', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><XCircle style={{ width: 12, height: 12 }} /> Your answer: {answers[i]}</span>}
                            <span style={{ color: '#10b981', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle style={{ width: 12, height: 12 }} /> Correct answer: {q.correctAnswer}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                  <button onClick={onClose} style={{ padding: '12px 24px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: isDark ? 'white' : '#0f172a', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>
                    {pct < 50 ? 'Review Materials' : 'Close'}
                  </button>
                  {pct >= 80 && (
                    <Link to="/jobs" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white', textDecoration: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}>
                      Explore Jobs <ArrowRight style={{ width: 16, height: 16 }} />
                    </Link>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default SkillEvaluationModal
