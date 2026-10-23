import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { Compass, Menu, X, LogOut, Moon, Sun, Bell, CheckCheck, Trash2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '../store/authStore'
import { useTheme } from '../context/ThemeContext'
import { notificationsAPI } from '../services/api'

// ── Notification Bell Component ───────────────────────────────────────────────
function NotificationBell({ theme }: { theme: string }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Poll unread count every 60 seconds
  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 60000)
    return () => clearInterval(interval)
  }, [])

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationsAPI.getUnreadCount()
      setUnread(res.data.count || 0)
    } catch { /* silent */ }
  }

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const res = await notificationsAPI.getAll()
      setNotifications(res.data || [])
      setUnread(res.data?.filter((n: any) => !n.is_read).length || 0)
    } catch { setNotifications([]) }
    finally { setLoading(false) }
  }

  const handleOpen = () => {
    setOpen(v => !v)
    if (!open) loadNotifications()
  }

  const markAllRead = async () => {
    try {
      await notificationsAPI.markRead(undefined, true)
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnread(0)
    } catch { /* silent */ }
  }

  const deleteOne = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await notificationsAPI.delete(id)
      setNotifications(prev => {
        const updated = prev.filter(n => n.id !== id)
        setUnread(updated.filter(n => !n.is_read).length)
        return updated
      })
    } catch { /* silent */ }
  }

  const typeColor: Record<string, string> = {
    xp: '#a78bfa',
    badge: '#fbbf24',
    application: '#34d399',
    reminder: '#60a5fa',
    system: '#94a3b8',
  }

  const isDark = theme === 'dark'

  return (
    <div style={{ position: 'relative' }} ref={panelRef}>
      <button
        onClick={handleOpen}
        aria-label="Notifications"
        style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: isDark ? '#a78bfa' : '#7c3aed', display: 'flex', alignItems: 'center' }}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', color: 'white', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${isDark ? '#0b071c' : 'white'}` }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 340, maxHeight: 440,
              background: isDark ? '#0f0a24' : 'white',
              border: `1px solid ${isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.15)'}`,
              borderRadius: 16, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.7)' : '0 20px 60px rgba(0,0,0,0.15)',
              zIndex: 200, overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: isDark ? 'white' : '#0f172a', fontWeight: 700, fontSize: 14 }}>Notifications</span>
              {unread > 0 && (
                <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 11, fontWeight: 600 }}>
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>

            {/* Body */}
            <div style={{ overflowY: 'auto', maxHeight: 360 }}>
              {loading && (
                <div style={{ padding: 24, textAlign: 'center', color: isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 13 }}>
                  Loading...
                </div>
              )}
              {!loading && notifications.length === 0 && (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <Bell size={28} style={{ color: isDark ? 'rgba(148,163,184,0.3)' : '#cbd5e1', margin: '0 auto 10px' }} />
                  <p style={{ color: isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 13, margin: 0 }}>No notifications yet</p>
                  <p style={{ color: isDark ? 'rgba(148,163,184,0.35)' : '#cbd5e1', fontSize: 11, margin: '4px 0 0' }}>Complete activities to earn XP and badges</p>
                </div>
              )}
              {!loading && notifications.map((n: any) => (
                <div key={n.id}
                  style={{ display: 'flex', gap: 10, padding: '12px 16px', background: !n.is_read ? (isDark ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.04)') : 'transparent', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`, cursor: n.link ? 'pointer' : 'default', position: 'relative' }}
                  onClick={() => { if (n.link) window.location.href = n.link }}
                >
                  {/* Unread dot */}
                  {!n.is_read && (
                    <div style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#7c3aed' }} />
                  )}
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${typeColor[n.type] || '#94a3b8'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                    {n.type === 'xp' ? '⚡' : n.type === 'badge' ? '🏅' : n.type === 'application' ? '💼' : n.type === 'reminder' ? '🔔' : '📢'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: isDark ? 'white' : '#0f172a', fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{n.title}</p>
                    <p style={{ color: isDark ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 11, margin: '2px 0 0', lineHeight: 1.4 }}>{n.message}</p>
                    <p style={{ color: isDark ? 'rgba(148,163,184,0.4)' : '#94a3b8', fontSize: 10, margin: '3px 0 0' }}>
                      {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button onClick={(e) => deleteOne(n.id, e)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? 'rgba(148,163,184,0.3)' : '#cbd5e1', padding: 2, flexShrink: 0, alignSelf: 'flex-start', borderRadius: 4 }}
                    aria-label="Delete notification">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { scrollYProgress } = useScroll()
  const { theme, toggleTheme } = useTheme()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false) }, [location.pathname])

  // Primary nav links shown in desktop bar (keep lean — max 8)
  const primaryLinks = isAuthenticated
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Career DNA', path: '/career-dna' },
        { name: 'Skill Gap', path: '/skill-gap' },
        { name: 'Jobs', path: '/jobs' },
        { name: 'Applications', path: '/applications' },
        { name: 'Tools', path: '/tools' },
        { name: '🏆 XP', path: '/achievements' },
      ]
    : [
        { name: 'Features', path: '/features' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'About', path: '/about' },
      ]

  // Extra links only in mobile menu
  const moreLinks = isAuthenticated
    ? [
        { name: 'Mock Interview', path: '/mock-interview' },
        { name: 'MCQ Test', path: '/mcq' },
        { name: 'Roadmap', path: '/roadmap' },
        { name: 'Resume', path: '/resume-builder' },
        { name: 'Profile', path: '/profile' },
      ]
    : []

  const allMobileLinks = [...primaryLinks, ...moreLinks]

  const navStyle: React.CSSProperties = {
    position: 'sticky', top: 0, zIndex: 50,
    background: theme === 'dark' ? 'rgba(11, 7, 28, 0.7)' : 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
    borderBottom: theme === 'dark' ? '1px solid rgba(124, 58, 237, 0.15)' : '1px solid rgba(124, 58, 237, 0.1)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    fontFamily: "'Inter', sans-serif",
  }

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.4 }} style={navStyle}>
      {/* Scroll progress bar */}
      <motion.div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #60a5fa)', transformOrigin: '0%', scaleX, boxShadow: '0 0 8px rgba(167,139,250,0.5)', zIndex: 100 }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 60 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
            <motion.div whileHover={{ rotate: 15, scale: 1.1 }} transition={{ duration: 0.2 }}
              style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(124,58,237,0.5)' }}>
              <Compass style={{ width: 16, height: 16, color: 'white' }} />
            </motion.div>
            <span style={{ fontSize: 17, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", background: theme === 'dark' ? 'linear-gradient(135deg, #c4b5fd, #a78bfa, #7c3aed)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.3px' }}>
              CareerNavigator
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center" style={{ gap: 2 }}>
            {primaryLinks.map((link) => {
              const active = location.pathname === link.path
              return (
                <Link key={link.path} to={link.path}
                  style={{ position: 'relative', padding: '7px 13px', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 500, color: active ? (theme === 'dark' ? '#ffffff' : '#7c3aed') : (theme === 'dark' ? 'rgba(203,213,225,0.7)' : '#475569'), background: active ? (theme === 'dark' ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.08)') : 'transparent', border: active ? `1px solid ${theme === 'dark' ? 'rgba(124,58,237,0.4)' : 'rgba(124,58,237,0.2)'}` : '1px solid transparent', transition: 'all 0.15s', letterSpacing: '0.01em' }}
                  onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.color = theme === 'dark' ? '#ffffff' : '#0f172a'; el.style.background = theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)' } }}
                  onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.color = theme === 'dark' ? 'rgba(203,213,225,0.7)' : '#475569'; el.style.background = 'transparent' } }}>
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Right section */}
          <div className="hidden lg:flex items-center" style={{ gap: 8 }}>
            {/* More dropdown for authenticated extra links */}
            {isAuthenticated && moreLinks.length > 0 && (
              <MoreDropdown links={moreLinks} theme={theme} currentPath={location.pathname} />
            )}

            {/* Theme toggle */}
            <button onClick={toggleTheme} aria-label="Toggle theme"
              style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 8, padding: 7, cursor: 'pointer', color: theme === 'dark' ? '#a78bfa' : '#7c3aed', display: 'flex' }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {isAuthenticated && <NotificationBell theme={theme} />}

            {isAuthenticated ? (
              <>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, boxShadow: '0 0 10px rgba(124,58,237,0.4)', flexShrink: 0 }}>
                    {user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: theme === 'dark' ? 'rgba(203,213,225,0.85)' : '#374151' }}>{user?.name?.split(' ')[0] || 'User'}</span>
                </Link>
                <button onClick={logout}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 11px', cursor: 'pointer', color: '#f87171', fontSize: 12, fontWeight: 500 }}>
                  <LogOut style={{ width: 13, height: 13 }} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ padding: '7px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, color: '#a78bfa', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}>
                  Login
                </Link>
                <Link to="/register" style={{ padding: '7px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile right: theme + bell + hamburger */}
          <div className="flex items-center lg:hidden" style={{ gap: 6 }}>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: theme === 'dark' ? '#a78bfa' : '#7c3aed', display: 'flex' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isAuthenticated && <NotificationBell theme={theme} />}
            <button onClick={() => setIsOpen(!isOpen)}
              style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: 7, cursor: 'pointer', color: theme === 'dark' ? '#a78bfa' : '#7c3aed', display: 'flex' }}>
              {isOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', borderTop: theme === 'dark' ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(124,58,237,0.1)', background: theme === 'dark' ? 'rgba(8,5,20,0.97)' : 'rgba(255,255,255,0.97)' }}>
            <div style={{ padding: '12px 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {allMobileLinks.map(link => {
                const active = location.pathname === link.path
                return (
                  <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}
                    style={{ display: 'block', padding: '9px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#c4b5fd' : (theme === 'dark' ? 'rgba(203,213,225,0.7)' : '#475569'), background: active ? 'rgba(124,58,237,0.15)' : 'transparent' }}>
                    {link.name}
                  </Link>
                )
              })}
            </div>
            {isAuthenticated && (
              <div style={{ padding: '0 16px 14px', borderTop: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', marginTop: 4 }}>
                <button onClick={() => { logout(); setIsOpen(false) }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', color: '#f87171', fontSize: 13, fontWeight: 500, width: '100%' }}>
                  <LogOut size={13} /> Logout
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ── More dropdown (desktop) ───────────────────────────────────────────────────
function MoreDropdown({ links, theme, currentPath }: { links: { name: string; path: string }[]; theme: string; currentPath: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isDark = theme === 'dark'
  const hasActive = links.some(l => currentPath === l.path)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button onClick={() => setOpen(v => !v)}
        style={{ padding: '7px 13px', borderRadius: 9, border: `1px solid ${hasActive ? (isDark ? 'rgba(124,58,237,0.4)' : 'rgba(124,58,237,0.2)') : 'transparent'}`, background: hasActive ? (isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.08)') : 'transparent', color: hasActive ? (isDark ? 'white' : '#7c3aed') : (isDark ? 'rgba(203,213,225,0.7)' : '#475569'), cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
        More ▾
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 160, background: isDark ? '#0f0a24' : 'white', border: `1px solid ${isDark ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.12)'}`, borderRadius: 12, boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.6)' : '0 16px 40px rgba(0,0,0,0.12)', zIndex: 200, overflow: 'hidden', padding: '6px' }}>
            {links.map(link => {
              const active = currentPath === link.path
              return (
                <Link key={link.path} to={link.path} onClick={() => setOpen(false)}
                  style={{ display: 'block', padding: '8px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 400, color: active ? (isDark ? '#c4b5fd' : '#7c3aed') : (isDark ? 'rgba(203,213,225,0.8)' : '#374151'), background: active ? (isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.07)') : 'transparent', marginBottom: 2 }}>
                  {link.name}
                </Link>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbar
