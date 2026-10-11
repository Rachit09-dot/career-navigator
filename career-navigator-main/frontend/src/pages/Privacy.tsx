import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowLeft, Eye, Database, Lock, Share2, Trash2, Mail, Bell, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'

const sections = [
  {
    icon: Eye, color: '#a78bfa',
    title: '1. Information We Collect',
    content: `We collect information you provide directly — such as your name, email address, field of study, career goals, and skill assessments. We also collect usage data including pages visited, features used, and time spent on the platform. This helps us improve your experience and provide personalized recommendations.`,
  },
  {
    icon: Database, color: '#60a5fa',
    title: '2. How We Use Your Information',
    content: `Your data is used to personalize your career guidance experience, generate Career DNA results, match you with relevant job opportunities, and improve our AI models. We use your email to send important account notifications and, with your consent, career tips and platform updates.`,
  },
  {
    icon: Lock, color: '#34d399',
    title: '3. Data Security',
    content: `We implement industry-standard security measures including encryption in transit (HTTPS/TLS), hashed passwords, and secure database storage. While we strive to protect your data, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password for your account.`,
  },
  {
    icon: Share2, color: '#fbbf24',
    title: '4. Data Sharing',
    content: `We do not sell your personal data to third parties. We may share anonymized, aggregated data for research purposes. We may share data with trusted service providers who assist in operating our platform, subject to strict confidentiality agreements. We may disclose data if required by law.`,
  },
  {
    icon: Bell, color: '#f472b6',
    title: '5. Cookies & Tracking',
    content: `We use cookies and similar technologies to maintain your session, remember your preferences, and analyze platform usage. You can control cookie settings through your browser. Disabling cookies may affect some platform functionality. We do not use third-party advertising cookies.`,
  },
  {
    icon: Shield, color: '#fb923c',
    title: '6. Your Rights',
    content: `You have the right to access, correct, or delete your personal data at any time. You can export your data from your profile settings. You may opt out of marketing emails using the unsubscribe link. To exercise any of these rights, contact us at support@careernavigator.in.`,
  },
  {
    icon: Trash2, color: '#a78bfa',
    title: '7. Data Retention',
    content: `We retain your data for as long as your account is active or as needed to provide services. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law. Anonymized usage data may be retained for analytics purposes.`,
  },
  {
    icon: Mail, color: '#60a5fa',
    title: '8. Contact & Updates',
    content: `If you have questions about this Privacy Policy, contact us at support@careernavigator.in. We may update this policy periodically. We will notify you of significant changes via email or a notice on the platform. Continued use after changes constitutes acceptance. Last updated: April 2026.`,
  },
];

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '-10%', right: '20%', width: 600, height: 400, background: 'radial-gradient(circle, rgba(96,165,250,0.1), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(167,139,250,0.7)', fontSize: 14, textDecoration: 'none', marginBottom: 40, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(167,139,250,0.7)')}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> Back to Register
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
              <Compass style={{ width: 22, height: 22, color: theme === 'dark' ? 'white' : '#0f172a' }} />
            </div>
            <span style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800 }}>CareerNavigator</span>
          </div>

          <h1 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-1px', lineHeight: 1.1 }}>
            Privacy{' '}
            <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Policy
            </span>
          </h1>
          <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 16, margin: 0 }}>
            Effective Date: April 1, 2026 &nbsp;·&nbsp; Last Updated: April 10, 2026
          </p>
          <div style={{ height: 1, marginTop: 28 }} />
        </motion.div>

        {/* Intro */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.18)', borderRadius: 16, padding: '20px 24px', marginBottom: 36 }}>
          <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 14.5, lineHeight: 1.75, margin: 0 }}>
            At CareerNavigator, your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform. We are committed to being transparent about our data practices and giving you control over your information.
          </p>
        </motion.div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}
                style={{ background: `${s.color}06`, border: `1px solid ${s.color}18`, borderRadius: 18, padding: '24px 28px', transition: 'all 0.2s' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.border = `1px solid ${s.color}35`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${s.color}12`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.border = `1px solid ${s.color}18`;
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: 17, height: 17, color: s.color }} />
                  </div>
                  <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 16, fontWeight: 800, margin: 0 }}>{s.title}</h2>
                </div>
                <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{s.content}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          style={{ marginTop: 36, background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.18)', borderRadius: 16, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Privacy concerns or data requests?</div>
            <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 13 }}>We respond within 48 hours</div>
          </div>
          <a href="mailto:support@careernavigator.in"
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: theme === 'dark' ? 'white' : '#0f172a', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: 'none', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}>
            <Mail style={{ width: 14, height: 14 }} /> support@careernavigator.in
          </a>
        </motion.div>

        {/* Footer links */}
        <div style={{ marginTop: 32, textAlign: 'center', display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ color: 'rgba(167,139,250,0.6)', fontSize: 13, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(167,139,250,0.6)')}>
            Terms of Service
          </Link>
          <span style={{ color: 'rgba(148,163,184,0.3)', fontSize: 13 }}>·</span>
          <Link to="/" style={{ color: 'rgba(167,139,250,0.6)', fontSize: 13, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(167,139,250,0.6)')}>
            Back to Home
          </Link>
          <span style={{ color: 'rgba(148,163,184,0.3)', fontSize: 13 }}>·</span>
          <span style={{ color: 'rgba(148,163,184,0.35)', fontSize: 13 }}>© 2026 CareerNavigator</span>
        </div>
      </div>
    </div>
  );
}
