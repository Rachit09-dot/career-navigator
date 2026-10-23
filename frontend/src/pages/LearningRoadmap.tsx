import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, Play, CheckCircle, Circle, BookOpen, Code, Target, Clock, ExternalLink, ChevronDown, ChevronUp, Loader2, Plus } from 'lucide-react'
import { roadmapAPI, profileAPI } from '../services/api'
import { useTheme } from '../context/ThemeContext'

const POPULAR_ROLES = [
  'Software Engineer', 'Data Analyst', 'Data Scientist', 'ML Engineer',
  'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
  'DevOps Engineer', 'UI/UX Designer', 'Product Manager',
]

export default function LearningRoadmap() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState<any>(null)
  const [roadmapId, setRoadmapId] = useState<number | null>(null)
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([])
  const [expandedPhases, setExpandedPhases] = useState<number[]>([1])
  const [myRoadmaps, setMyRoadmaps] = useState<any[]>([])
  const [view, setView] = useState<'generate' | 'roadmap' | 'my'>('generate')

  const card = { background: isDark ? 'rgba(255,255,255,0.04)' : 'white', border: `1px solid ${isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)'}`, borderRadius: 20 }

  useEffect(() => {
    // Load user's career goal as default role
    profileAPI.getProfile().then(res => {
      if (res.data?.career_goal && !targetRole) setTargetRole(res.data.career_goal)
    }).catch(() => {})
    loadMyRoadmaps()
  }, [])

  const loadMyRoadmaps = async () => {
    try {
      const res = await roadmapAPI.getMyRoadmaps()
      setMyRoadmaps(res.data || [])
    } catch { setMyRoadmaps([]) }
  }

  const generateRoadmap = async () => {
    if (!targetRole.trim()) return
    setLoading(true)
    try {
      const res = await roadmapAPI.generate(targetRole)
      setRoadmap(res.data.roadmap)
      setRoadmapId(res.data.id)
      setCompletedMilestones(res.data.completedMilestones || [])
      setExpandedPhases([1])
      setView('roadmap')
      loadMyRoadmaps()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to generate roadmap. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleMilestone = async (milestoneId: string) => {
    if (!roadmapId) return
    const newCompleted = completedMilestones.includes(milestoneId)
      ? completedMilestones.filter(id => id !== milestoneId)
      : [...completedMilestones, milestoneId]
    setCompletedMilestones(newCompleted)
    try {
      await roadmapAPI.toggleMilestone(roadmapId, milestoneId)
    } catch {
      setCompletedMilestones(completedMilestones) // revert
    }
  }

  const openRoadmap = async (id: number) => {
    setLoading(true)
    try {
      const res = await roadmapAPI.getRoadmap(id)
      setRoadmap(res.data.roadmap)
      setRoadmapId(id)
      setTargetRole(res.data.role)
      setCompletedMilestones(res.data.completedMilestones || [])
      setExpandedPhases([1])
      setView('roadmap')
    } catch { alert('Failed to load roadmap.') }
    finally { setLoading(false) }
  }

  const totalMilestones = roadmap?.phases?.reduce((acc: number, p: any) => acc + (p.milestones?.length || 0), 0) || 0
  const progressPct = totalMilestones > 0 ? Math.round((completedMilestones.length / totalMilestones) * 100) : 0

  const typeIcon = (type: string) => {
    if (type === 'project') return <Code size={14} />
    if (type === 'practice') return <Target size={14} />
    return <BookOpen size={14} />
  }

  const typeColor = (type: string) => {
    if (type === 'project') return '#7c3aed'
    if (type === 'practice') return '#d97706'
    return '#3b82f6'
  }

  // ── GENERATE VIEW ──────────────────────────────────────────────────────────
  if (view === 'generate') return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <h1 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 32, fontWeight: 900, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>🗺️ Learning Roadmap</h1>
              <p style={{ color: isDark ? 'rgba(196,181,253,0.7)' : '#64748b', marginTop: 8 }}>Get a personalized, AI-generated learning path for your target role</p>
            </div>
            {myRoadmaps.length > 0 && (
              <button onClick={() => setView('my')}
                style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: 'transparent', color: isDark ? '#a78bfa' : '#7c3aed', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                My Roadmaps ({myRoadmaps.length})
              </button>
            )}
          </div>

          <div style={{ ...card, padding: 28, marginBottom: 24 }}>
            <label style={{ display: 'block', color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Target Role</label>
            <input
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              placeholder="e.g. Data Scientist, Software Engineer..."
              list="roadmap-roles"
              style={{ width: '100%', padding: '12px 16px', background: isDark ? 'rgba(255,255,255,0.06)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 12, color: isDark ? 'white' : '#0f172a', fontSize: 15, outline: 'none', boxSizing: 'border-box', marginBottom: 20 }}
            />
            <datalist id="roadmap-roles">{POPULAR_ROLES.map(r => <option key={r} value={r} />)}</datalist>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {POPULAR_ROLES.slice(0, 6).map(r => (
                <button key={r} onClick={() => setTargetRole(r)}
                  style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${targetRole === r ? '#7c3aed' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`, background: targetRole === r ? 'rgba(124,58,237,0.15)' : 'transparent', color: targetRole === r ? (isDark ? '#c4b5fd' : '#7c3aed') : (isDark ? 'rgba(203,213,225,0.6)' : '#64748b'), cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s' }}>
                  {r}
                </button>
              ))}
            </div>

            <motion.button onClick={generateRoadmap} disabled={!targetRole.trim() || loading}
              whileHover={targetRole && !loading ? { scale: 1.02 } : {}}
              style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: targetRole && !loading ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'rgba(124,58,237,0.3)', color: 'white', fontSize: 15, fontWeight: 700, cursor: targetRole && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating Roadmap...</> : <><Map size={16} /> Generate My Roadmap</>}
            </motion.button>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ── MY ROADMAPS ────────────────────────────────────────────────────────────
  if (view === 'my') return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 24, fontWeight: 800, margin: 0 }}>My Roadmaps</h1>
          <button onClick={() => setView('generate')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <Plus size={13} /> New Roadmap
          </button>
        </div>
        {myRoadmaps.map(r => {
          const pct = r.completedMilestones?.length > 0 ? Math.round((r.completedMilestones.length / 10) * 100) : 0
          return (
            <motion.div key={r.id} onClick={() => openRoadmap(r.id)} whileHover={{ y: -2 }}
              style={{ ...card, padding: 20, marginBottom: 12, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: isDark ? 'white' : '#0f172a', fontSize: 16, fontWeight: 700, margin: 0 }}>{r.role}</p>
                  <p style={{ color: isDark ? 'rgba(148,163,184,0.6)' : '#94a3b8', fontSize: 12, margin: '4px 0 0' }}>
                    {r.completedMilestones?.length || 0} milestones completed · Updated {new Date(r.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 20, fontWeight: 900, margin: 0 }}>{r.completedMilestones?.length || 0}</p>
                  <p style={{ color: isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 11, margin: 0 }}>done</p>
                </div>
              </div>
            </motion.div>
          )
        })}
        {loading && <div style={{ textAlign: 'center', padding: 20 }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#a78bfa' }} /></div>}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // ── ROADMAP VIEW ───────────────────────────────────────────────────────────
  if (view === 'roadmap' && roadmap) return (
    <div style={{ minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 26, fontWeight: 900, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{roadmap.title}</h1>
              <p style={{ color: isDark ? '#a78bfa' : '#7c3aed', margin: '4px 0 0', fontSize: 14 }}>
                🗓️ {roadmap.totalWeeks} weeks · {totalMilestones} milestones · {completedMilestones.length} completed
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setView('generate')}
                style={{ padding: '8px 14px', borderRadius: 10, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: 'transparent', color: isDark ? 'rgba(203,213,225,0.7)' : '#64748b', cursor: 'pointer', fontSize: 12 }}>
                New Role
              </button>
              <button onClick={() => setView('my')}
                style={{ padding: '8px 14px', borderRadius: 10, border: `1px solid ${isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.2)'}`, background: 'transparent', color: isDark ? '#a78bfa' : '#7c3aed', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                My Roadmaps
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ ...card, padding: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 14, fontWeight: 600 }}>Overall Progress</span>
              <span style={{ color: isDark ? '#a78bfa' : '#7c3aed', fontWeight: 800 }}>{progressPct}%</span>
            </div>
            <div style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', borderRadius: 999, height: 10, overflow: 'hidden' }}>
              <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 999 }}
                animate={{ width: `${progressPct}%` }} transition={{ duration: 0.6 }} />
            </div>
            <p style={{ color: isDark ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12, margin: '8px 0 0' }}>
              {completedMilestones.length} of {totalMilestones} milestones completed
            </p>
          </div>

          {/* Phases */}
          {roadmap.phases?.map((phase: any) => {
            const isExpanded = expandedPhases.includes(phase.id)
            const phaseCompleted = phase.milestones?.filter((m: any) => completedMilestones.includes(m.id)).length || 0
            const phaseTotal = phase.milestones?.length || 0
            const phaseDone = phaseCompleted === phaseTotal && phaseTotal > 0

            return (
              <motion.div key={phase.id} style={{ ...card, marginBottom: 16, overflow: 'hidden' }}>
                <button onClick={() => setExpandedPhases(prev => isExpanded ? prev.filter(id => id !== phase.id) : [...prev, phase.id])}
                  style={{ width: '100%', padding: '18px 20px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: phaseDone ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {phaseDone ? <CheckCircle size={18} color="white" /> : <span style={{ color: 'white', fontSize: 14, fontWeight: 800 }}>{phase.id}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, margin: 0 }}>{phase.title}</p>
                    <p style={{ color: isDark ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12, margin: '2px 0 0' }}>
                      {phase.duration} · {phaseCompleted}/{phaseTotal} completed
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp size={18} color={isDark ? '#a78bfa' : '#7c3aed'} /> : <ChevronDown size={18} color={isDark ? '#a78bfa' : '#7c3aed'} />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 20px 20px' }}>
                        <p style={{ color: isDark ? 'rgba(196,181,253,0.7)' : '#64748b', fontSize: 13, marginBottom: 16 }}>{phase.description}</p>
                        {phase.milestones?.map((m: any) => {
                          const done = completedMilestones.includes(m.id)
                          return (
                            <div key={m.id} style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${done ? 'rgba(22,163,74,0.3)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')}`, borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                <button onClick={() => toggleMilestone(m.id)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: 2 }}>
                                  {done
                                    ? <CheckCircle size={20} color="#4ade80" />
                                    : <Circle size={20} color={isDark ? 'rgba(148,163,184,0.4)' : '#cbd5e1'} />}
                                </button>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                    <p style={{ color: done ? (isDark ? 'rgba(203,213,225,0.5)' : '#94a3b8') : (isDark ? 'white' : '#0f172a'), fontSize: 14, fontWeight: 600, margin: 0, textDecoration: done ? 'line-through' : 'none' }}>{m.title}</p>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: `${typeColor(m.type)}20`, color: typeColor(m.type) }}>
                                      {typeIcon(m.type)} {m.type}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8' }}>
                                      <Clock size={10} /> {m.estimatedHours}h
                                    </span>
                                  </div>
                                  <p style={{ color: isDark ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12, margin: '0 0 8px', lineHeight: 1.5 }}>{m.description}</p>
                                  {m.resources?.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                      {m.resources.map((r: any, i: number) => (
                                        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                                          style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, border: `1px solid ${r.type === 'free' ? 'rgba(22,163,74,0.3)' : 'rgba(217,119,6,0.3)'}`, background: r.type === 'free' ? 'rgba(22,163,74,0.08)' : 'rgba(217,119,6,0.08)', color: r.type === 'free' ? '#16a34a' : '#d97706', textDecoration: 'none' }}>
                                          <ExternalLink size={10} /> {r.title} · {r.type === 'free' ? 'Free' : 'Paid'}
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

          {/* Final Project */}
          {roadmap.finalProject && (
            <div style={{ ...card, padding: 20, marginBottom: 20 }}>
              <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>🚀 Capstone Project</h3>
              <p style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{roadmap.finalProject}</p>
            </div>
          )}

          {/* Job readiness */}
          {roadmap.jobReadinessIndicators?.length > 0 && (
            <div style={{ ...card, padding: 20 }}>
              <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>✅ Job Readiness Indicators</h3>
              {roadmap.jobReadinessIndicators.map((indicator: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <CheckCircle size={14} color="#4ade80" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 13 }}>{indicator}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return null
}
