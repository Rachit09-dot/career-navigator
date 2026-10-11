import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Compass, Menu, X, LogOut, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { scrollYProgress } = useScroll()
  const { theme, toggleTheme } = useTheme()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  const navLinks = isAuthenticated
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Career DNA', path: '/career-dna' },
        { name: 'Skill Gap', path: '/skill-gap' },

        { name: 'Jobs', path: '/jobs' },
        { name: 'Applications', path: '/applications' },
        { name: 'Resume', path: '/resume-builder' },
      ]
    : [
        { name: 'Features', path: '/features' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'About', path: '/about' },
      ]

  const navStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: theme === 'dark' ? 'rgba(11, 7, 28, 0.6)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: theme === 'dark' ? '1px solid rgba(124, 58, 237, 0.15)' : '1px solid rgba(124, 58, 237, 0.1)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Inter', sans-serif",
  }

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.4 }} style={navStyle}>
      {/* Scroll Progress Bar */}
      <motion.div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #60a5fa)',
        transformOrigin: '0%',
        scaleX,
        boxShadow: '0 0 10px rgba(167,139,250,0.6)',
        zIndex: 100,
      }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <motion.div whileHover={{ rotate: 15, scale: 1.1 }} transition={{ duration: 0.3 }}
              style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(124,58,237,0.5)' }}>
              <Compass style={{ width: 18, height: 18, color: theme === 'dark' ? 'white' : '#0f172a' }} />
            </motion.div>
            <span className="bg-clip-text text-transparent" style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", backgroundImage: theme === 'dark' ? 'linear-gradient(135deg, #c4b5fd, #a78bfa, #7c3aed)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)', letterSpacing: '-0.3px' }}>
              CareerNavigator
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => {
              const active = location.pathname === link.path
              return (
                <Link key={link.path} to={link.path}
                  style={{
                    position: 'relative',
                    padding: '8px 16px', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 500,
                    color: active ? (theme === 'dark' ? '#ffffff' : '#7c3aed') : (theme === 'dark' ? 'rgba(203,213,225,0.7)' : '#475569'),
                    background: active ? (theme === 'dark' ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)') : 'transparent',
                    border: active ? (theme === 'dark' ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(124,58,237,0.2)') : '1px solid transparent',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', letterSpacing: '0.02em',
                    boxShadow: active ? '0 0 20px rgba(124,58,237,0.3), inset 0 0 10px rgba(124,58,237,0.1)' : 'none',
                    textShadow: active && theme === 'dark' ? '0 0 10px rgba(255,255,255,0.3)' : 'none',
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = theme === 'dark' ? '#ffffff' : '#0f172a'; (e.currentTarget as HTMLElement).style.background = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = theme === 'dark' ? 'rgba(203,213,225,0.7)' : '#475569'; (e.currentTarget as HTMLElement).style.background = 'transparent' } }}>
                  {link.name}
                  {active && (
                    <motion.div layoutId="navbar-active" className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-purple-400"
                      style={{ boxShadow: '0 -2px 10px rgba(167, 139, 250, 0.8)' }} />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Auth section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
              style={{ color: theme === 'dark' ? '#a78bfa' : '#7c3aed' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 12, fontWeight: 700, boxShadow: '0 0 12px rgba(124,58,237,0.4)', flexShrink: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(203,213,225,0.9)' }}>{user?.name?.split(' ')[0] || 'User'}</span>
                </Link>
                <button onClick={logout}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: '#f87171', fontSize: 13, fontWeight: 500, transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.4)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.2)' }}>
                  <LogOut style={{ width: 14, height: 14 }} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ padding: '7px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600, color: '#a78bfa', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', transition: 'all 0.15s' }}>
                  Login
                </Link>
                <Link to="/register" style={{ padding: '7px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700, color: theme === 'dark' ? 'white' : '#0f172a', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)', transition: 'all 0.15s', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Theme Toggle Mobile */}
          <div className="flex items-center md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
              style={{ color: theme === 'dark' ? '#a78bfa' : '#7c3aed', marginRight: 8 }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile menu button */}
            <button onClick={() => setIsOpen(!isOpen)} 
              style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: 8, cursor: 'pointer', color: theme === 'dark' ? '#a78bfa' : '#7c3aed' }}>
              {isOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ borderTop: theme === 'dark' ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(124,58,237,0.1)', background: theme === 'dark' ? 'rgba(10,6,24,0.95)' : 'rgba(255,255,255,0.95)', padding: '12px 24px 16px' }}>
          {navLinks.map(link => {
            const active = location.pathname === link.path
            return (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}
                style={{ display: 'block', padding: '10px 14px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 400, color: active ? '#c4b5fd' : 'rgba(203,213,225,0.7)', background: active ? 'rgba(124,58,237,0.15)' : 'transparent', marginBottom: 4 }}>
                {link.name}
              </Link>
            )
          })}
          {isAuthenticated && (
            <button onClick={() => { logout(); setIsOpen(false) }}
              style={{ width: '100%', textAlign: 'left', padding: '10px 14px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: 14, marginTop: 4 }}>
              Logout
            </button>
          )}
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar
