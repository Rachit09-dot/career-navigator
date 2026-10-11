import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, Clock, CheckCircle, XCircle, Calendar, X, Plus,
  Building, MapPin, FileText, TrendingUp, Award, ChevronRight, Sparkles, ChevronDown
} from 'lucide-react'
import { applicationAPI } from '../services/api'
import { useTheme } from '../context/ThemeContext'

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; label: string; icon: any }> = {
  applied:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', label: 'Applied', icon: Clock },
  interview: { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.35)', label: 'Interview', icon: Calendar },
  offer:     { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.35)', label: 'Offer', icon: CheckCircle },
  rejected:  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)', label: 'Rejected', icon: XCircle },
  pending:   { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.35)', label: 'Pending', icon: Clock },
}

const STATS = [
  { key: 'total',     label: 'Total Applied', color: '#a78bfa', icon: TrendingUp },
  { key: 'applied',   label: 'Pending',       color: '#f59e0b', icon: Clock },
  { key: 'interview', label: 'Interviews',    color: '#60a5fa', icon: Calendar },
  { key: 'offer',     label: 'Offers',        color: '#34d399', icon: Award },
  { key: 'rejected',  label: 'Rejected',      color: '#ef4444', icon: XCircle },
]

const StatusDropdown = ({ currentStatus, onChange, theme }: any) => {
  const [open, setOpen] = useState(false)
  const options = [
    { value: 'applied', label: 'Applied', icon: Clock, color: '#f59e0b' },
    { value: 'interview', label: 'Interview', icon: Calendar, color: '#60a5fa' },
    { value: 'offer', label: 'Offer', icon: CheckCircle, color: '#34d399' },
    { value: 'rejected', label: 'Rejected', icon: XCircle, color: '#ef4444' }
  ]
  
  const current = options.find(o => o.value === currentStatus) || options[0]
  const CurrentIcon = current.icon

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        style={{ 
          display: 'flex', alignItems: 'center', gap: 6, 
          background: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)', 
          border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', 
          color: theme === 'dark' ? 'white' : '#0f172a', 
          padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, 
          outline: 'none', cursor: 'pointer', minWidth: 110, justifyContent: 'space-between'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CurrentIcon style={{ width: 12, height: 12, color: current.color }} />
          {current.label}
        </span>
        <ChevronDown style={{ width: 14, height: 14, opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.95 }} transition={{ duration: 0.15 }}
            style={{ 
              position: 'absolute', bottom: '100%', right: 0, marginBottom: 6, 
              background: theme === 'dark' ? '#1e1b4b' : 'white', 
              border: theme === 'dark' ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(0,0,0,0.1)', 
              borderRadius: 12, padding: 6, zIndex: 100, minWidth: 140,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}
          >
            {options.map(opt => {
              const Icon = opt.icon
              const isSelected = current.value === opt.value
              return (
                <button key={opt.value} 
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%', 
                    padding: '8px 10px', borderRadius: 8, border: 'none', 
                    background: isSelected ? (theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)') : 'transparent', 
                    color: theme === 'dark' ? 'white' : '#0f172a', 
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { if(!isSelected) (e.currentTarget as HTMLElement).style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                  onMouseLeave={e => { if(!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <Icon style={{ width: 14, height: 14, color: opt.color }} />
                  {opt.label}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Applications = () => {
  const { theme } = useTheme()
  const [applications, setApplications] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, applied: 0, interview: 0, rejected: 0, offer: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newApp, setNewApp] = useState({ job_title: '', company: '', job_url: '', notes: '' })
  const [addingApp, setAddingApp] = useState(false)
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => { fetchApplications(); fetchStats() }, [])

  const fetchApplications = async () => {
    try {
      const res = await applicationAPI.getApplications()
      const data = res.data
      setApplications(Array.isArray(data) ? data : (data?.applications || []))
    } catch { setApplications([]) }
    finally { setLoading(false) }
  }

  const fetchStats = async () => {
    try {
      const res = await applicationAPI.getStats()
      const data = res.data
      setStats({
        total: data?.total || 0,
        applied: data?.applied || 0,
        interview: data?.interviews || data?.interview || 0,
        rejected: data?.rejected || 0,
        offer: data?.offers || data?.offer || 0,
      })
    } catch {}
  }

  const saveNotes = async () => {
    if (!selectedApp) return
    setSaving(true)
    try {
      await applicationAPI.addNotes(selectedApp.id, notes)
      setApplications(apps => apps.map(a => a.id === selectedApp.id ? { ...a, cover_letter: notes } : a))
      setShowNotesModal(false); setSelectedApp(null)
    } catch { alert('Failed to save notes') }
    finally { setSaving(false) }
  }

  const handleAddApplication = async () => {
    if (!newApp.job_title || !newApp.company) {
      alert('Job Title and Company are required');
      return;
    }
    setAddingApp(true);
    try {
      await applicationAPI.addApplication({
        ...newApp,
        status: 'applied',
        applied_date: new Date().toISOString().split('T')[0]
      });
      setShowAddModal(false);
      setNewApp({ job_title: '', company: '', job_url: '', notes: '' });
      fetchApplications();
      fetchStats();
    } catch {
      alert('Failed to track application');
    } finally {
      setAddingApp(false);
    }
  }

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      await applicationAPI.updateStatus(appId, newStatus)
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: newStatus } : a))
      fetchStats()
    } catch {
      alert('Failed to update status')
    }
  }

  const totalApplied = stats.total || applications.length
  const statValues: Record<string, number> = { total: totalApplied, applied: stats.applied, interview: stats.interview, offer: stats.offer, rejected: stats.rejected }

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>

      {/* Animated background blobs */}
      <motion.div animate={{ x: [-30, 30, -30], y: [-20, 20, -20] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'fixed', top: '5%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <motion.div animate={{ x: [20, -20, 20], y: [30, -30, 30] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'fixed', bottom: '10%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(96,165,250,0.1), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 900, margin: '0 0 8px', letterSpacing: '-1px', lineHeight: 1.1 }}>
              My{' '}
              <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(135deg, #a855f7, #3b82f6)', backgroundClip: 'text' }}>
                Applications
              </span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 15, margin: 0 }}>
              Track every job application in one place
            </motion.p>
          </div>
          <motion.button onClick={() => setShowAddModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', border: 'none', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,0.3)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Plus style={{ width: 16, height: 16 }} />
            Track External App
          </motion.button>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 40 }}>
          {STATS.map(({ key, label, color, icon: Icon }, i) => (
            <motion.div key={key}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              onMouseEnter={() => setHoveredStat(i)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{
                background: hoveredStat === i ? `${color}12` : `${color}07`,
                border: `1px solid ${hoveredStat === i ? color + '50' : color + '20'}`,
                borderRadius: 18, padding: '20px 18px', position: 'relative', overflow: 'hidden',
                cursor: 'default', transition: 'all 0.25s ease',
                boxShadow: hoveredStat === i ? `0 0 32px ${color}30, 0 8px 32px rgba(0,0,0,0.3)` : 'none',
                transform: hoveredStat === i ? 'translateY(-5px) scale(1.03)' : 'none',
              }}>
              {/* Top glow line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}${hoveredStat === i ? '90' : '50'}, transparent)`, transition: 'all 0.25s' }} />
              {/* Corner glow on hover */}
              {hoveredStat === i && (
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: `radial-gradient(circle, ${color}25, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
              )}
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, boxShadow: hoveredStat === i ? `0 0 16px ${color}30` : 'none', transition: 'all 0.25s' }}>
                <Icon style={{ width: 18, height: 18, color }} />
              </div>
              <div style={{ color, fontSize: 32, fontWeight: 900, lineHeight: 1, transition: 'all 0.25s' }}>{statValues[key]}</div>
              <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12, marginTop: 5, fontWeight: 500 }}>{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 22, padding: 24 }}>
                <div style={{ height: 16, background: theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'white', borderRadius: 8, marginBottom: 10, width: '45%' }} />
                <div style={{ height: 12, background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', borderRadius: 6, width: '28%' }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && applications.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 28, padding: '80px 24px', textAlign: 'center', boxShadow: '0 0 60px rgba(124,58,237,0.08)' }}>
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(124,58,237,0.25)' }}>
              <Briefcase style={{ width: 40, height: 40, color: '#a78bfa' }} />
            </motion.div>
            <h3 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 22, fontWeight: 800, marginBottom: 10 }}>No Applications Yet</h3>
            <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 14, marginBottom: 28, maxWidth: 300, margin: '0 auto 28px' }}>
              Start applying to jobs that match your profile and track them all here.
            </p>
            <Link to="/jobs"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: theme === 'dark' ? 'white' : '#0f172a', borderRadius: 14, padding: '13px 28px', fontSize: 14, fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 28px rgba(124,58,237,0.45)' }}>
              Browse Jobs <ChevronRight style={{ width: 15, height: 15 }} />
            </Link>
          </motion.div>
        )}

        {/* Applications list */}
        {!loading && applications.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {applications.map((app, index) => {
              const statusKey = app.status || 'pending'
              const sc = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending
              const StatusIcon = sc.icon
              const isHovered = hoveredCard === app.id

              return (
                <motion.div key={app.id}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
                  onMouseEnter={() => setHoveredCard(app.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: isHovered ? `${sc.color}08` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isHovered ? sc.color + '40' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 22, padding: 24, position: 'relative', overflow: 'hidden',
                    transition: 'all 0.25s ease',
                    boxShadow: isHovered ? `0 0 36px ${sc.color}20, 0 16px 48px rgba(0,0,0,0.35)` : 'none',
                    transform: isHovered ? 'translateY(-3px)' : 'none',
                  }}>

                  {/* Top shimmer line */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${sc.color}${isHovered ? '70' : '35'}, transparent)`, transition: 'all 0.25s' }} />

                  {/* Corner glow */}
                  {isHovered && (
                    <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: `radial-gradient(circle, ${sc.color}15, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Title + status */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                        <h3 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 16, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {app.job_title || app.title || 'Job Title'}
                        </h3>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <StatusIcon style={{ width: 11, height: 11 }} />
                          {sc.label}
                        </span>
                      </div>

                      {/* Company + location */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Building style={{ width: 13, height: 13, color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8' }} />
                          <span style={{ color: 'rgba(196,181,253,0.85)', fontSize: 13, fontWeight: 600 }}>{app.company || 'Company'}</span>
                        </div>
                        {app.location && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <MapPin style={{ width: 13, height: 13, color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8' }} />
                            <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 13 }}>{app.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Date */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Calendar style={{ width: 12, height: 12, color: 'rgba(148,163,184,0.4)' }} />
                        <span style={{ color: 'rgba(148,163,184,0.45)', fontSize: 12 }}>
                          Applied {app.applied_date ? new Date(app.applied_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                        </span>
                      </div>

                      {/* Notes */}
                      {app.cover_letter && (
                        <div style={{ marginTop: 12, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '10px 12px' }}>
                          <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 12, margin: 0, lineHeight: 1.6 }}>{app.cover_letter}</p>
                        </div>
                      )}
                    </div>

                    {/* View Job */}
                    {app.job_url && (
                      <a href={app.job_url} target="_blank" rel="noopener noreferrer"
                        title="Opens original posting. Your application is tracked internally."
                        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 700, textDecoration: 'none', flexShrink: 0, transition: 'all 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.3)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(124,58,237,0.3)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.15)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                        View Job
                      </a>
                    )}
                  </div>

                  {/* Footer actions: Notes + Status Update */}
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <button onClick={() => { setSelectedApp(app); setNotes(app.cover_letter || ''); setShowNotesModal(true) }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)', color: theme === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.65)', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.2)'; (e.currentTarget as HTMLElement).style.color = '#c4b5fd'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.4)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white'; (e.currentTarget as HTMLElement).style.color = theme === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(15,23,42,0.65)'; (e.currentTarget as HTMLElement).style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}>
                      <FileText style={{ width: 13, height: 13 }} />
                      {app.cover_letter ? 'Edit Notes' : 'Add Notes'}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b' }}>Update Status:</span>
                      <StatusDropdown currentStatus={statusKey} onChange={(val: string) => handleStatusChange(app.id, val)} theme={theme} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Notes Modal */}
      <AnimatePresence>
        {showNotesModal && selectedApp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
            <motion.div initial={{ scale: 0.88, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.88, opacity: 0 }} transition={{ type: 'spring', damping: 20 }}
              style={{ background: theme === 'dark' ? '#1e1b4b' : 'white', border: '1px solid rgba(124,58,237,0.35)', borderRadius: 24, padding: 28, maxWidth: 480, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {selectedApp.cover_letter ? 'Edit Notes' : 'Add Notes'}
                </h2>
                <button onClick={() => { setShowNotesModal(false); setSelectedApp(null) }}
                  style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)', borderRadius: 8, padding: 6, cursor: 'pointer', color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.6)', display: 'flex', transition: 'all 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}>
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>
              <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 13, marginBottom: 16 }}>
                {selectedApp.job_title || selectedApp.title} at {selectedApp.company}
              </p>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Add interview notes, follow-up reminders, or anything relevant..."
                style={{ width: '100%', height: 140, padding: '12px 14px', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 12, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6, fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={() => { setShowNotesModal(false); setSelectedApp(null) }}
                  style={{ flex: 1, background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'white', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.15)', borderRadius: 12, padding: '11px', color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Cancel
                </button>
                <motion.button onClick={saveNotes} disabled={saving}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ flex: 1, background: '#7c3aed', border: 'none', borderRadius: 12, padding: '11px', color: 'white', fontSize: 14, fontWeight: 800, cursor: 'pointer', opacity: saving ? 0.7 : 1, boxShadow: '0 4px 16px rgba(124,58,237,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {saving ? 'Saving...' : 'Save Notes'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add External App Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
            <motion.div initial={{ scale: 0.88, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.88, opacity: 0 }} transition={{ type: 'spring', damping: 20 }}
              style={{ background: theme === 'dark' ? '#1e1b4b' : 'white', border: '1px solid rgba(124,58,237,0.35)', borderRadius: 24, padding: 28, maxWidth: 480, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Track External Application
                </h2>
                <button onClick={() => setShowAddModal(false)}
                  style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)', borderRadius: 8, padding: 6, cursor: 'pointer', color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.6)', display: 'flex', transition: 'all 0.15s' }}>
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : '#0f172a', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Job Title *</label>
                  <input type="text" value={newApp.job_title} onChange={e => setNewApp({...newApp, job_title: e.target.value})} placeholder="e.g. Frontend Developer"
                    style={{ width: '100%', padding: '10px 14px', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : '#0f172a', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Company *</label>
                  <input type="text" value={newApp.company} onChange={e => setNewApp({...newApp, company: e.target.value})} placeholder="e.g. Google"
                    style={{ width: '100%', padding: '10px 14px', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : '#0f172a', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Job Link (Optional)</label>
                  <input type="text" value={newApp.job_url} onChange={e => setNewApp({...newApp, job_url: e.target.value})} placeholder="https://linkedin.com/jobs/..."
                    style={{ width: '100%', padding: '10px 14px', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : '#0f172a', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Notes (Optional)</label>
                  <textarea value={newApp.notes} onChange={e => setNewApp({...newApp, notes: e.target.value})} placeholder="Any important details..."
                    style={{ width: '100%', height: 80, padding: '10px 14px', background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button onClick={() => setShowAddModal(false)}
                  style={{ flex: 1, background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'white', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.15)', borderRadius: 12, padding: '11px', color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Cancel
                </button>
                <motion.button onClick={handleAddApplication} disabled={addingApp || !newApp.job_title || !newApp.company}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ flex: 1, background: '#7c3aed', border: 'none', borderRadius: 12, padding: '11px', color: 'white', fontSize: 14, fontWeight: 800, cursor: (!newApp.job_title || !newApp.company) ? 'not-allowed' : 'pointer', opacity: (addingApp || !newApp.job_title || !newApp.company) ? 0.7 : 1, boxShadow: '0 4px 16px rgba(124,58,237,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {addingApp ? 'Adding...' : 'Add Application'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Applications
