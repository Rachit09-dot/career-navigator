import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowLeft, FileText, Shield, AlertCircle, Users, Globe, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'

const sections = [
  {
    icon: FileText, color: '#a78bfa',
    title: '1. Acceptance of Terms',
    content: `By accessing or using CareerNavigator ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms apply to all visitors, users, and others who access or use the service.`,
  },
  {
    icon: Users, color: '#60a5fa',
    title: '2. Use of the Platform',
    content: `CareerNavigator is designed for students and professionals seeking career guidance. You agree to use the platform only for lawful purposes. You must not misuse our services, attempt to gain unauthorized access, or use the platform to harm others. You are responsible for maintaining the confidentiality of your account credentials.`,
  },
  {
    icon: Shield, color: '#34d399',
    title: '3. Account Registration',
    content: `To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration. You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use of your account at support@careernavigator.in.`,
  },
  {
    icon: Globe, color: '#fbbf24',
    title: '4. Intellectual Property',
    content: `All content on CareerNavigator — including text, graphics, logos, icons, and software — is the property of CareerNavigator and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
  },
  {
    icon: AlertCircle, color: '#f472b6',
    title: '5. Disclaimer of Warranties',
    content: `CareerNavigator is provided "as is" without warranties of any kind. We do not guarantee that the platform will be error-free, uninterrupted, or that the results obtained will be accurate. Career guidance provided is for informational purposes only and should not replace professional career counseling.`,
  },
  {
    icon: FileText, color: '#fb923c',
    title: '6. Limitation of Liability',
    content: `To the maximum extent permitted by law, CareerNavigator shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid us in the past 12 months.`,
  },
  {
    icon: Mail, color: '#a78bfa',
    title: '7. Changes to Terms',
    content: `We reserve the right to modify these terms at any time. We will notify users of significant changes via email or a prominent notice on the platform. Continued use of the platform after changes constitutes acceptance of the new terms. Last updated: April 2026.`,
  },
];

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Dot grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Glow blob */}
      <div style={{ position: 'fixed', top: '-10%', left: '30%', width: 600, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Back button */}
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
            Terms of{' '}
            <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Service
            </span>
          </h1>
          <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 16, margin: 0 }}>
            Effective Date: April 1, 2026 &nbsp;·&nbsp; Last Updated: April 10, 2026
          </p>

          {/* Divider */}
          <div style={{ height: 1, marginTop: 28 }} />
        </motion.div>

        {/* Intro box */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: '20px 24px', marginBottom: 36 }}>
          <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 14.5, lineHeight: 1.75, margin: 0 }}>
            Please read these Terms of Service carefully before using CareerNavigator. These terms govern your access to and use of our AI-powered career guidance platform. By creating an account, you acknowledge that you have read, understood, and agree to be bound by these terms.
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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ marginTop: 36, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Questions about these terms?</div>
            <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 13 }}>Reach out to our team anytime</div>
          </div>
          <a href="mailto:support@careernavigator.in"
            style={{ display: 'flex', alignItems: 'center', gap: 8, color: theme === 'dark' ? 'white' : '#0f172a', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: 'none', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}>
            <Mail style={{ width: 14, height: 14 }} /> support@careernavigator.in
          </a>
        </motion.div>

        {/* Footer links */}
        <div style={{ marginTop: 32, textAlign: 'center', display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/privacy" style={{ color: 'rgba(167,139,250,0.6)', fontSize: 13, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#a78bfa')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(167,139,250,0.6)')}>
            Privacy Policy
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
