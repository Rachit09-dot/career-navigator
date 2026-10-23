import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Compass, Mail, MapPin, Github, Linkedin, Twitter,
  Brain, Target, Briefcase, TrendingUp, ArrowRight,
  Shield, Globe, Zap
} from 'lucide-react';

const stats = [
  { value: '18+', label: 'Career Fields' },
  { value: '50+', label: 'Job Platforms' },
  { value: '60+', label: 'Personality Types' },
  { value: '100%', label: 'Free to Use' },
];

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'About', to: '/about' },
];

const appLinks = [
  { label: 'Career DNA', to: '/register', icon: Brain },
  { label: 'Skill Gap', to: '/register', icon: Target },
  { label: 'Jobs', to: '/register', icon: Briefcase },
  { label: 'Resume Builder', to: '/register', icon: TrendingUp },
];

const features = [
  { icon: Brain, label: 'Career DNA Analysis', color: '#a78bfa' },
  { icon: Target, label: 'Skill Gap Tracker', color: '#60a5fa' },
  { icon: Briefcase, label: 'Smart Job Matching', color: '#34d399' },
  { icon: Shield, label: 'Application Tracker', color: '#f472b6' },
  { icon: Globe, label: '18+ Field Support', color: '#fb923c' },
  { icon: Zap, label: 'AI Resume Bullets', color: '#fbbf24' },
];

export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer style={{ background: 'linear-gradient(180deg, #0d0820 0%, #0a0618 100%)', borderTop: '1px solid rgba(124,58,237,0.15)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Top glow line */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), rgba(96,165,250,0.4), transparent)' }} />

      {/* Stats bar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {stats.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              style={{ textAlign: 'center', padding: '16px 8px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 14 }}>
              <div style={{ color: '#a78bfa', fontSize: 26, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12, marginTop: 4 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main footer content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr', gap: 48 }}>

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
                <Compass style={{ width: 20, height: 20, color: theme === 'dark' ? 'white' : '#0f172a' }} />
              </div>
              <span style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800 }}>CareerNavigator</span>
            </div>
            <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 13.5, lineHeight: 1.7, marginBottom: 20, maxWidth: 280 }}>
              India's AI-powered career guidance platform. Helping students across 18+ fields discover their perfect career path.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${f.color}10`, border: `1px solid ${f.color}25`, borderRadius: 999, padding: '4px 10px' }}>
                    <Icon style={{ width: 11, height: 11, color: f.color }} />
                    <span style={{ color: f.color, fontSize: 11, fontWeight: 600 }}>{f.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(167,139,250,0.7)', transition: 'all 0.2s', textDecoration: 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.25)'; (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(167,139,250,0.7)'; }}>
                    <Icon style={{ width: 16, height: 16 }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(124,58,237,0.15)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <Link to={l.to} style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.65)')}>
                    <ArrowRight style={{ width: 12, height: 12, opacity: 0.5 }} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App Features */}
          <div>
            <h4 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(124,58,237,0.15)' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {appLinks.map((l, i) => {
                const Icon = l.icon;
                return (
                  <li key={i}>
                    <Link to={l.to} style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.65)')}>
                      <Icon style={{ width: 13, height: 13, opacity: 0.6 }} />
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid rgba(124,58,237,0.15)' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="mailto:support@careernavigator.in" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, textDecoration: 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Mail style={{ width: 13, height: 13, color: '#a78bfa' }} />
                </div>
                <div>
                  <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 11, marginBottom: 2 }}>Email</div>
                  <div style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 13 }}>support@careernavigator.in</div>
                </div>
              </a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <MapPin style={{ width: 13, height: 13, color: '#60a5fa' }} />
                </div>
                <div>
                  <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 11, marginBottom: 2 }}>Location</div>
                  <div style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 13 }}>India — Built for Indian Students</div>
                </div>
              </div>

              {/* CTA mini */}
              <Link to="/register" style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: theme === 'dark' ? 'white' : '#0f172a', padding: '11px 16px', borderRadius: 12, fontWeight: 700, fontSize: 13, textDecoration: 'none', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
                Get Started Free <ArrowRight style={{ width: 13, height: 13 }} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'rgba(148,163,184,0.45)', fontSize: 12, margin: 0 }}>
            © 2026 CareerNavigator. Built with care for Indian students.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms of Service', to: '/terms' },
            ].map((t, i) => (
              <Link key={i} to={t.to} style={{ color: 'rgba(148,163,184,0.4)', fontSize: 12, textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.4)')}>
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
