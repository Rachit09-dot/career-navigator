import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, ArrowLeft } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function NotFound() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 480 }}>
        <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}>
          <Compass size={36} color="white" />
        </motion.div>
        <h1 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 72, fontWeight: 900, margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-2px' }}>404</h1>
        <h2 style={{ color: isDark ? 'rgba(196,181,253,0.9)' : '#7c3aed', fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Page Not Found</h2>
        <p style={{ color: isDark ? 'rgba(148,163,184,0.7)' : '#64748b', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
          Looks like this career path doesn't exist yet. Let's get you back on track.
        </p>
        <Link to="/dashboard"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', padding: '12px 28px', borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}
