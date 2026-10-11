import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Clock, ExternalLink, Loader2, Brain,
  X, Search, BookOpen, Play, FileText,
  CheckCircle, Zap, ArrowRight, BarChart2, Sparkles, TrendingUp, Award, Check, Lock
} from 'lucide-react'
import { skillGapAPI, profileAPI } from '../services/api'
import { STREAMS } from '../data/streams.config'
import { useTheme } from '../context/ThemeContext'
import SkillEvaluationModal from '../components/SkillEvaluationModal'

const STREAM_ROLES: Record<string, string[]> = {
  engineering: ['Software Engineer', 'Data Analyst', 'DevOps Engineer', 'Product Manager', 'ML Engineer', 'Cybersecurity Analyst'],
  medical: ['Doctor/Physician', 'Surgeon', 'Pharmacist', 'Healthcare Manager', 'Physiotherapist', 'Medical Researcher'],
  commerce: ['Chartered Accountant', 'Financial Analyst', 'Business Analyst', 'Investment Banker', 'Marketing Manager', 'Entrepreneur'],
  arts: ['Civil Services Officer', 'Content Writer', 'Psychologist', 'Journalist', 'Social Worker', 'HR Manager'],
  science: ['Research Scientist', 'Data Scientist', 'Biotechnologist', 'Chemist', 'Environmental Scientist', 'Professor'],
  law: ['Advocate', 'Corporate Lawyer', 'Legal Advisor', 'Judge', 'Legal Consultant', 'Public Prosecutor'],
  education: ['Teacher', 'Professor', 'Education Consultant', 'Curriculum Designer', 'School Principal', 'Trainer'],
  design: ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Art Director', 'Motion Designer', 'Brand Designer'],
  hotel: ['Hotel Manager', 'Chef', 'Event Manager', 'Tourism Officer', 'F&B Manager', 'Front Office Manager'],
  agriculture: ['Agricultural Officer', 'Food Scientist', 'Farm Manager', 'Agri Researcher', 'Horticulturist', 'Soil Scientist'],
  mass_communication: ['Journalist', 'News Anchor', 'Content Creator', 'PR Manager', 'Film Director', 'Radio Jockey'],
  sports: ['Sports Coach', 'Sports Analyst', 'Fitness Trainer', 'Sports Manager', 'Physiotherapist', 'Sports Journalist'],
  social_work: ['NGO Manager', 'Social Worker', 'Community Developer', 'Policy Analyst', 'Counselor', 'Development Officer'],
  defence: ['Army Officer', 'Navy Officer', 'Air Force Officer', 'Defence Analyst', 'NDA Officer', 'Coast Guard'],
  civil_services: ['IAS Officer', 'IPS Officer', 'IFS Officer', 'State PCS Officer', 'Revenue Officer', 'Block Development Officer'],
  fine_arts: ['Artist', 'Art Director', 'Animator', 'Creative Director', 'Illustrator', 'Art Teacher'],
  paramedical: ['Radiologist', 'Lab Technician', 'Physiotherapist', 'Medical Coder', 'Dialysis Technician', 'OT Technician'],
  diploma: ['Electrician', 'Mechanical Technician', 'Civil Supervisor', 'ITI Instructor', 'Plant Operator', 'Quality Inspector'],
}

const PRIORITY_CONFIG = {
  critical: { color: '#ef4444', glow: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', label: 'Critical' },
  important: { color: '#f59e0b', glow: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', label: 'Important' },
  'nice-to-have': { color: '#3b82f6', glow: 'rgba(59,130,246,0.4)', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', label: 'Nice to Have' },
}

const RESOURCE_ICONS: Record<string, any> = {
  video: Play, course: BookOpen, article: FileText, documentation: FileText, book: BookOpen,
}

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }) }

const GlowIcon = ({ icon: Icon, color, size = 18 }: { icon: any; color: string; size?: number }) => {
  const { theme } = useTheme()
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: color, filter: 'blur(8px)', opacity: 0.6 }} />
      <Icon style={{ width: size, height: size, color: theme === 'dark' ? 'white' : '#0f172a', position: 'relative', zIndex: 1 }} />
    </div>
  )
}

const SkillGap = () => {
  const { theme } = useTheme()
  const location = useLocation()
  const [selectedRole, setSelectedRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [currentSkills, setCurrentSkills] = useState('')
  const [userStream, setUserStream] = useState('')
  const [gaps, setGaps] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [prefillBanner, setPrefillBanner] = useState<string | null>(null)
  const [analyzedRole, setAnalyzedRole] = useState('')
  const [completedSkills, setCompletedSkills] = useState<string[]>([])
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false)
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const roleParam = params.get('role')
    profileAPI.getProfile().then(res => {
      if (res.data?.skills) setCurrentSkills(res.data.skills)
      if (res.data?.field_of_study) {
        const streamMatch = STREAMS.find(s => res.data.field_of_study?.toLowerCase().includes(s.label.toLowerCase()))
        if (streamMatch) setUserStream(streamMatch.id)
      }
      const dnaTopCareer = res.data?.career_dna?.results?.[0]?.career
      if (!dnaTopCareer && (!res.data?.career_dna?.results || res.data?.career_dna?.results.length === 0)) {
        setAccessGranted(false);
      } else {
        setAccessGranted(true);
      }
      
      const initialRole = roleParam || dnaTopCareer || res.data?.career_goal || ''
      if (initialRole) {
        setSelectedRole(initialRole)
        if (roleParam || dnaTopCareer) setPrefillBanner(`Pre-filled from your Career DNA: "${initialRole}"`)
      }
    }).catch(() => {
      setAccessGranted(false);
      if (roleParam) { setSelectedRole(roleParam); setPrefillBanner(`Pre-filled from Career DNA: "${roleParam}"`) }
    })
    skillGapAPI.getLast().then(res => {
      if (res.data?.gaps) {
        setGaps(res.data.gaps)
        if (!roleParam) setSelectedRole(res.data.target_role || '')
        setAnalyzedRole(res.data.target_role || '')
        setAnalyzed(true)
      }
    }).catch(() => {})
    // Load completed skills
    skillGapAPI.getCompletedSkills().then(res => {
      setCompletedSkills(res.data?.completed_skills || [])
    }).catch(() => {})
  }, [location.search])

  const suggestedRoles = STREAM_ROLES[userStream] || [
    'Software Engineer', 'Data Analyst', 'Product Manager', 'Business Analyst',
    'Marketing Manager', 'Teacher', 'Doctor', 'Lawyer', 'Civil Services Officer', 'Entrepreneur'
  ]

  const analyze = async () => {
    const role = customRole.trim() || selectedRole
    if (!role) return
    setLoading(true)
    try {
      const res = await skillGapAPI.analyze({ target_role: role, current_skills: currentSkills, stream: userStream })
      setGaps(res.data.gaps)
      setAnalyzedRole(role)
      setAnalyzed(true)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalHours = gaps.reduce((sum, g) => sum + (g.estimatedHours || 0), 0)
  const criticalCount = gaps.filter(g => g.priority === 'critical').length
  const activeRole = customRole.trim() || selectedRole
  const completedCount = gaps.filter(g => completedSkills.includes(g.skill)).length
  const progressPct = gaps.length > 0 ? Math.round((completedCount / gaps.length) * 100) : 0

  const toggleSkillComplete = async (skillName: string) => {
    try {
      const res = await skillGapAPI.completeSkill(skillName)
      setCompletedSkills(res.data.completed_skills || [])
    } catch { /* silent */ }
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>

      {accessGranted === null && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 style={{ width: 40, height: 40, animation: 'spin 1s linear infinite', color: '#7c3aed' }} />
        </div>
      )}

      {accessGranted === false && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? 'transparent' : '#f8fafc', padding: 24, position: 'relative' }}>
          <motion.div animate={{ x: [-30, 30, -30], y: [-20, 20, -20] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'fixed', top: '10%', left: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
          <motion.div animate={{ x: [20, -20, 20], y: [30, -30, 30] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'fixed', bottom: '10%', right: '10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            style={{ maxWidth: 460, width: '100%', background: theme === 'dark' ? 'rgba(30, 27, 75, 0.4)' : 'white', backdropFilter: 'blur(16px)', border: theme === 'dark' ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(0,0,0,0.05)', borderRadius: 24, padding: '40px 32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative', zIndex: 10 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: theme === 'dark' ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(124,58,237,0.1)' }}>
              <Lock style={{ width: 28, height: 28, color: '#a78bfa' }} />
            </div>
            <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 24, fontWeight: 900, marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Skill Gap Locked</h2>
            <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#475569', fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
              You need to <strong>Take your Career DNA</strong> first. We need to identify your optimal career paths before we can accurately analyze your skill gaps.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link to="/career-dna" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
                Take Career DNA <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {accessGranted === true && (      <div style={{ position: 'relative', zIndex: 1, maxWidth: 920, margin: '0 auto', padding: '52px 16px 80px' }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 52 }}>


          {/* Title with glow */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{ position: 'absolute', inset: '-20px -40px', background: 'radial-gradient(ellipse, rgba(124,58,237,0.15), transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
            <h1 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.05, letterSpacing: '-1.5px', position: 'relative', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Skill Gap{' '}
              <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>
                Analysis
              </span>
            </h1>
          </div>
          <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.7)' : '#64748b', fontSize: 17, margin: 0, fontWeight: 400 }}>
            Discover exactly what skills you need to land your target role
          </p>
        </motion.div>

        {/* ── Input Card ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', backdropFilter: 'blur(24px)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 28, padding: 32, marginBottom: 32, boxShadow: '0 0 40px rgba(124,58,237,0.08), inset 0 1px 0 rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>

          {/* Card inner glow */}
          <div style={{ position: 'absolute', top: 0, left: '30%', right: '30%', height: 1, pointerEvents: 'none' }} />

          {/* Prefill banner */}
          <AnimatePresence>
            {prefillBanner && (
              <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
                style={{ border: '1px solid rgba(124,58,237,0.4)', borderRadius: 14, padding: '11px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 0 20px rgba(124,58,237,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: 'rgba(167,139,250,0.4)', filter: 'blur(6px)' }} />
                    <Brain style={{ width: 16, height: 16, color: '#c4b5fd', position: 'relative' }} />
                  </div>
                  <span style={{ color: '#c4b5fd', fontSize: 13, fontWeight: 500 }}>{prefillBanner}</span>
                </div>
                <button onClick={() => setPrefillBanner(null)} style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 6, cursor: 'pointer', color: '#a78bfa', display: 'flex', padding: '4px 6px' }}>
                  <X style={{ width: 13, height: 13 }} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Target Role */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: 'rgba(124,58,237,0.5)', filter: 'blur(8px)' }} />
                <Target style={{ width: 16, height: 16, color: '#a78bfa', position: 'relative' }} />
              </div>
              <label style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.9)', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Target Role
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 8, marginBottom: 12 }}>
              {suggestedRoles.map((role, i) => {
                const active = selectedRole === role && !customRole
                return (
                  <motion.button key={role} onClick={() => { setSelectedRole(role); setCustomRole('') }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -2, boxShadow: active ? '0 8px 24px rgba(124,58,237,0.5)' : '0 4px 16px rgba(124,58,237,0.2)' }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: '10px 12px', borderRadius: 12,
                      border: `1.5px solid ${active ? '#7c3aed' : (theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                      background: active ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(91,33,182,0.2))' : (theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                      color: active ? (theme === 'dark' ? '#c4b5fd' : '#5b21b6') : (theme === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.65)'),
                      fontSize: 13, fontWeight: active ? 700 : 400,
                      cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                      boxShadow: active ? '0 0 20px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' : 'none',
                    }}>
                    {active && <span style={{ marginRight: 6, fontSize: 10 }}>●</span>}
                    {role}
                  </motion.button>
                )
              })}
            </div>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(167,139,250,0.6)' }} />
              <input type="text" value={customRole} onChange={e => { setCustomRole(e.target.value); setSelectedRole('') }}
                placeholder="Or type any custom role..."
                style={{ width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 13, paddingBottom: 13, background: 'rgba(124,58,237,0.06)', border: '1.5px solid rgba(124,58,237,0.2)', borderRadius: 14, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.2)')} />
            </div>
          </div>

          {/* Current Skills */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: 'rgba(99,102,241,0.5)', filter: 'blur(8px)' }} />
                <Zap style={{ width: 16, height: 16, color: '#818cf8', position: 'relative' }} />
              </div>
              <label style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.9)', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Your Current Skills{' '}
                <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>(optional)</span>
              </label>
            </div>
            <input type="text" value={currentSkills} onChange={e => setCurrentSkills(e.target.value)}
              placeholder="e.g. React, Python, SQL, Communication..."
              style={{ width: '100%', padding: '13px 16px', background: 'rgba(99,102,241,0.06)', border: '1.5px solid rgba(99,102,241,0.2)', borderRadius: 14, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')} />
          </div>

          {/* Analyze Button */}
          <motion.button onClick={analyze} disabled={loading || !activeRole}
            whileHover={!loading && activeRole ? { y: -3, boxShadow: '0 16px 40px rgba(124,58,237,0.55)' } : {}}
            whileTap={!loading && activeRole ? { scale: 0.98 } : {}}
            style={{
              width: '100%', padding: '15px 24px',
              background: !activeRole ? 'rgba(124,58,237,0.2)' : 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 50%, #4c1d95 100%)',
              border: `1px solid ${activeRole ? 'rgba(167,139,250,0.3)' : 'rgba(124,58,237,0.2)'}`,
              borderRadius: 16, color: 'white', fontSize: 16, fontWeight: 700,
              cursor: !activeRole ? 'not-allowed' : 'pointer', opacity: !activeRole ? 0.4 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: activeRole ? '0 8px 32px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.15)' : 'none',
              transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
            }}>
            {activeRole && <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />}
            {loading
              ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Loader2 style={{ width: 18, height: 18 }} /></motion.div> Analyzing with AI...</>
              : <><GlowIcon icon={BarChart2} color="rgba(167,139,250,0.6)" size={18} /> Analyze Skill Gap</>
            }
          </motion.button>
        </motion.div>

        {/* ── Loading State ── */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 28 }}>
                {/* Outer spinning ring */}
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', inset: -12, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#7c3aed', borderRightColor: '#a78bfa' }} />
                {/* Middle ring */}
                <motion.div animate={{ rotate: -360 }} transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '1px solid transparent', borderTopColor: 'rgba(167,139,250,0.4)', borderLeftColor: 'rgba(124,58,237,0.4)' }} />
                {/* Glow */}
                <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)', filter: 'blur(12px)' }} />
                <div style={{ width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(124,58,237,0.6)', position: 'relative' }}>
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <Brain style={{ width: 34, height: 34, color: theme === 'dark' ? 'white' : '#0f172a' }} />
                  </motion.div>
                </div>
              </div>
              <motion.p animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Analyzing skill requirements...</motion.p>
              <p style={{ color: 'rgba(196,181,253,0.6)', fontSize: 14 }}>AI is mapping the gap between your skills and <span style={{ color: '#a78bfa', fontWeight: 600 }}>{activeRole}</span></p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {analyzed && gaps.length > 0 && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Role header card */}
              <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
                style={{ border: '1px solid rgba(124,58,237,0.35)', borderRadius: 24, padding: '22px 28px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, boxShadow: '0 0 40px rgba(124,58,237,0.1)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', background: 'rgba(124,58,237,0.4)', filter: 'blur(10px)' }} />
                    <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 0 20px rgba(124,58,237,0.5)' }}>
                      <TrendingUp style={{ width: 22, height: 22, color: theme === 'dark' ? 'white' : '#0f172a' }} />
                    </div>
                  </div>
                  <div>
                    <p style={{ color: 'rgba(196,181,253,0.7)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>Analysis for</p>
                    <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 22, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.4px' }}>{analyzedRole}</h2>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { val: criticalCount, label: 'Critical', color: '#f87171', glow: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
                    { val: gaps.length, label: 'Total Skills', color: '#a78bfa', glow: 'rgba(124,58,237,0.3)', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.3)' },
                    { val: `${totalHours}h`, label: 'Est. Hours', color: '#34d399', glow: 'rgba(16,185,129,0.3)', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
                    { val: `${completedCount}/${gaps.length}`, label: 'Completed', color: '#fbbf24', glow: 'rgba(251,191,36,0.3)', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
                  ].map(s => (
                    <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: '10px 16px', textAlign: 'center', boxShadow: `0 0 16px ${s.glow}` }}>
                      <div style={{ color: s.color, fontSize: 20, fontWeight: 800, textShadow: `0 0 12px ${s.glow}` }}>{s.val}</div>
                      <div style={{ color: 'rgba(148,163,184,0.8)', fontSize: 11, marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Overall progress bar */}
              {gaps.length > 0 && (
                <motion.div custom={0.5} variants={fadeUp} initial="hidden" animate="visible"
                  style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px 24px', marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 13, fontWeight: 600 }}>Overall Progress</span>
                    <span style={{ color: '#fbbf24', fontSize: 14, fontWeight: 800, textShadow: '0 0 10px rgba(251,191,36,0.5)' }}>{progressPct}%</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 999, boxShadow: '0 0 12px rgba(251,191,36,0.4)' }} />
                  </div>
                  <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12, marginTop: 8 }}>
                    {completedCount} of {gaps.length} skills completed · {gaps.length - completedCount} remaining
                  </p>
                </motion.div>
              )}

              {/* Skill cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {gaps.map((gap, index) => {
                  const pConfig = PRIORITY_CONFIG[gap.priority as keyof typeof PRIORITY_CONFIG] || PRIORITY_CONFIG['nice-to-have']
                  return (
                    <motion.div key={gap.skill || index} custom={index + 1} variants={fadeUp} initial="hidden" animate="visible"
                      whileHover={{ y: -2, boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${pConfig.border}` }}
                      style={{ background: completedSkills.includes(gap.skill) ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: completedSkills.includes(gap.skill) ? '1px solid rgba(16,185,129,0.25)' : `1px solid rgba(255,255,255,0.07)`, borderRadius: 22, padding: 26, borderLeft: `3px solid ${completedSkills.includes(gap.skill) ? '#34d399' : pConfig.color}`, boxShadow: completedSkills.includes(gap.skill) ? '0 0 20px rgba(16,185,129,0.1), -2px 0 12px rgba(52,211,153,0.3)' : `0 0 20px rgba(0,0,0,0.2), -2px 0 12px ${pConfig.glow}`, transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>

                      {/* Left glow streak */}
                      <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: `linear-gradient(180deg, transparent, ${pConfig.color}, transparent)`, filter: 'blur(4px)' }} />

                      {/* Skill header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                            <h3 style={{ color: completedSkills.includes(gap.skill) ? '#34d399' : (theme === 'dark' ? 'white' : '#0f172a'), fontSize: 18, fontWeight: 800, margin: 0, textShadow: theme === 'dark' ? '0 0 20px rgba(255,255,255,0.1)' : 'none', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.3px', textDecoration: completedSkills.includes(gap.skill) ? 'line-through' : 'none', opacity: completedSkills.includes(gap.skill) ? 0.7 : 1 }}>{gap.skill}</h3>
                            <span style={{ background: pConfig.bg, border: `1px solid ${pConfig.border}`, color: pConfig.color, fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.07em', boxShadow: theme === 'dark' ? `0 0 10px ${pConfig.glow}` : 'none' }}>
                              {pConfig.label}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => toggleSkillComplete(gap.skill)}
                              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 999, border: completedSkills.includes(gap.skill) ? '1px solid rgba(52,211,153,0.5)' : '1px solid rgba(255,255,255,0.15)', background: completedSkills.includes(gap.skill) ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)', color: completedSkills.includes(gap.skill) ? '#34d399' : 'rgba(148,163,184,0.7)', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                              <Check style={{ width: 11, height: 11 }} />
                              {completedSkills.includes(gap.skill) ? 'Completed' : 'Mark Done'}
                            </motion.button>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '4px 10px' }}>
                              <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: 11 }}>Current:</span>
                              <span style={{ color: '#f87171', fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{gap.currentLevel}</span>
                            </div>
                            <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                              <ArrowRight style={{ width: 14, height: 14, color: 'rgba(167,139,250,0.5)' }} />
                            </motion.div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 8, padding: '4px 10px' }}>
                              <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: 11 }}>Target:</span>
                              <span style={{ color: '#34d399', fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{gap.targetLevel}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 8, padding: '4px 10px' }}>
                              <Clock style={{ width: 12, height: 12, color: '#a78bfa' }} />
                              <span style={{ color: '#a78bfa', fontSize: 12, fontWeight: 700 }}>{gap.estimatedHours}h</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginBottom: gap.resources?.length ? 22 : 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 11, fontWeight: 500 }}>Proficiency gap</span>
                          <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 11 }}>
                            {gap.currentLevel === 'beginner' ? '0%' : gap.currentLevel === 'intermediate' ? '40%' : '70%'} → {gap.targetLevel === 'advanced' ? '90%' : gap.targetLevel === 'intermediate' ? '60%' : '30%'}
                          </span>
                        </div>
                        <div style={{ height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
                          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: gap.currentLevel === 'beginner' ? '5%' : gap.currentLevel === 'intermediate' ? '40%' : '70%', background: '#ef4444', borderRadius: 999, boxShadow: '0 0 8px rgba(239,68,68,0.6)' }} />
                          <motion.div initial={{ width: 0 }} animate={{ width: gap.targetLevel === 'advanced' ? '90%' : gap.targetLevel === 'intermediate' ? '60%' : '30%' }}
                            transition={{ duration: 1.2, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
                            style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 999, opacity: 0.5, boxShadow: '0 0 10px rgba(124,58,237,0.4)' }} />
                        </div>
                      </div>

                      {/* Resources */}
                      {gap.resources?.length > 0 && (
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                            <div style={{ position: 'relative' }}>
                              <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: 'rgba(124,58,237,0.4)', filter: 'blur(5px)' }} />
                              <BookOpen style={{ width: 13, height: 13, color: theme === 'dark' ? '#a78bfa' : '#7c3aed', position: 'relative' }} />
                            </div>
                            <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.7)' : '#7c3aed', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Learning Resources</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {gap.resources.map((r: any, idx: number) => {
                              const Icon = RESOURCE_ICONS[r.type] || FileText
                              return (
                                <motion.a key={idx} href={r.url} target="_blank" rel="noopener noreferrer"
                                  whileHover={{ x: 4 }}
                                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 14, textDecoration: 'none', transition: 'all 0.15s' }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.35)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(124,58,237,0.15)' }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.05)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.15)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ position: 'relative' }}>
                                      <div style={{ position: 'absolute', inset: -3, borderRadius: 10, background: 'rgba(124,58,237,0.3)', filter: 'blur(6px)' }} />
                                      <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', border: '1px solid rgba(124,58,237,0.3)' }}>
                                        <Icon style={{ width: 16, height: 16, color: '#a78bfa' }} />
                                      </div>
                                    </div>
                                    <div>
                                      <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, fontWeight: 600, margin: 0, marginBottom: 2 }}>{r.title}</p>
                                      <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 11, margin: 0, textTransform: 'capitalize' }}>{r.type}</p>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {r.free && (
                                      <span style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, boxShadow: '0 0 8px rgba(16,185,129,0.2)' }}>FREE</span>
                                    )}
                                    <ExternalLink style={{ width: 14, height: 14, color: 'rgba(167,139,250,0.5)' }} />
                                  </div>
                                </motion.a>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Summary footer */}
              {progressPct === 100 ? (
                <motion.div custom={gaps.length + 2} variants={fadeUp} initial="hidden" animate="visible"
                  style={{ marginTop: 28, background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.05))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 22, padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', boxShadow: '0 0 30px rgba(16,185,129,0.15)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', background: 'rgba(52,211,153,0.4)', filter: 'blur(10px)' }} />
                    <Award style={{ width: 32, height: 32, color: '#10b981', position: 'relative' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: 800, fontSize: 18, margin: 0, marginBottom: 4 }}>
                      Congratulations! You are <span style={{ color: '#10b981', textShadow: '0 0 12px rgba(16,185,129,0.5)' }}>Job-Ready</span> 🎉
                    </p>
                    <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.8)' : '#475569', fontSize: 14, margin: 0 }}>
                      You have mastered all {gaps.length} required skills for this role. Time to start applying!
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button onClick={() => setIsEvaluationOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981', padding: '10px 20px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                      <Brain style={{ width: 16, height: 16 }} /> Evaluate Skills
                    </motion.button>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '10px 20px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}>
                        Explore Jobs <ArrowRight style={{ width: 16, height: 16 }} />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div custom={gaps.length + 2} variants={fadeUp} initial="hidden" animate="visible"
                  style={{ marginTop: 28, border: '1px solid rgba(16,185,129,0.25)', borderRadius: 22, padding: '22px 28px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', boxShadow: '0 0 30px rgba(16,185,129,0.08)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1 }} />
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', background: 'rgba(52,211,153,0.3)', filter: 'blur(10px)' }} />
                    <CheckCircle style={{ width: 24, height: 24, color: '#34d399', position: 'relative' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: 800, fontSize: 16, margin: 0, marginBottom: 4 }}>
                      Estimated <span style={{ color: '#34d399', textShadow: '0 0 12px rgba(52,211,153,0.5)' }}>{Math.ceil(totalHours / 20)} weeks</span> to job-ready
                    </p>
                    <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.7)' : '#64748b', fontSize: 13, margin: 0 }}>
                      {totalHours} total hours · {gaps.length} skills to master · Focus on critical skills first
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button disabled
                      style={{ background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.2)', padding: '10px 18px', borderRadius: 10, color: 'rgba(148,163,184,0.6)', fontWeight: 700, fontSize: 13, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      title="Complete all skills to unlock your evaluation test">
                      <Lock style={{ width: 16, height: 16 }} /> Evaluation Locked
                    </button>
                    {/* Mark All Completed Button */}
                    <motion.button 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        const uncompleted = gaps.filter(g => !completedSkills.includes(g.skill));
                        if (uncompleted.length === 0) return;
                        // Optimistic UI update
                        const newCompleted = [...completedSkills, ...uncompleted.map(g => g.skill)];
                        setCompletedSkills(newCompleted);
                        try {
                          for (const gap of uncompleted) {
                            await skillGapAPI.completeSkill(gap.skill);
                          }
                        } catch (err) {
                          alert('Failed to sync completion with server. Please refresh.');
                        }
                      }}
                      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px 18px', borderRadius: 10, color: '#10b981', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.2)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.1)' }}
                    >
                      <CheckCircle style={{ width: 16, height: 16 }} />
                      Mark All Completed
                    </motion.button>
                  </div>
                  
                  <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Zap style={{ width: 22, height: 22, color: '#f59e0b', filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.6))' }} />
                  </motion.div>
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty State ── */}
        {!analyzed && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
              <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3, repeat: Infinity }}
                style={{ position: 'absolute', inset: -16, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)', filter: 'blur(12px)' }} />
              <div style={{ width: 80, height: 80, borderRadius: '50%', border: '1px solid rgba(124,58,237,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 0 30px rgba(124,58,237,0.2)' }}>
                <Target style={{ width: 36, height: 36, color: '#a78bfa', filter: 'drop-shadow(0 0 8px rgba(167,139,250,0.6))' }} />
              </div>
            </div>
            <p style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(15,23,42,0.8)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Select a role and analyze</p>
            <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 14 }}>AI will identify exactly what skills you need to bridge the gap</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {[Award, Brain, Zap].map((Icon, i) => (
                <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 16, height: 16, color: '#a78bfa' }} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <SkillEvaluationModal role={analyzedRole} isOpen={isEvaluationOpen} onClose={() => setIsEvaluationOpen(false)} />
      </div>
      )}
    </div>
  )
}

export default SkillGap
