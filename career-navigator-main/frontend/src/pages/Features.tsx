import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Brain, Target, Briefcase, TrendingUp, Shield, Globe,
  CheckCircle, ArrowRight, Zap, Star, BarChart2,
  Users, Award, Rocket, ChevronRight, BookOpen, MapPin
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
});

// Skill gap chart data
const skillData = [
  { skill: 'Python', you: 40, market: 90, color: '#a78bfa' },
  { skill: 'React', you: 65, market: 85, color: '#60a5fa' },
  { skill: 'SQL', you: 30, market: 80, color: '#34d399' },
  { skill: 'ML/AI', you: 20, market: 75, color: '#fbbf24' },
  { skill: 'Docker', you: 10, market: 60, color: '#f472b6' },
];

// Salary growth data
const salaryData = [
  { month: 'Jan', val: 35 },
  { month: 'Mar', val: 42 },
  { month: 'May', val: 48 },
  { month: 'Jul', val: 55 },
  { month: 'Sep', val: 68 },
  { month: 'Nov', val: 82 },
];

const features = [
  {
    icon: Brain, color: '#a78bfa', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.25)',
    title: 'Career DNA Analysis',
    subtitle: 'AI-powered personality mapping',
    desc: 'Answer 10 targeted questions and our AI maps your unique career personality to 60+ personality types across 18 fields.',
    points: ['Personalized career path', '60+ personality types', 'Field-specific insights', 'Instant results'],
  },
  {
    icon: Target, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)',
    title: 'Skill Gap Tracker',
    subtitle: 'Know exactly what to learn',
    desc: 'See the exact skills you\'re missing for your target role, with progress tracking and learning resources.',
    points: ['Role-specific skill gaps', 'Mark skills as done', 'Progress bar tracking', 'Dashboard integration'],
  },
  {
    icon: Briefcase, color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.25)',
    title: 'Smart Job Matching',
    subtitle: '50+ platforms, pre-searched',
    desc: 'Jobs and internships from 50+ platforms — LinkedIn, Naukri, Indeed and more — all pre-searched for your exact role.',
    points: ['50+ job platforms', '20+ internship sites', 'Field-specific roles', 'One-click apply'],
  },
  {
    icon: TrendingUp, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)',
    title: 'AI Resume Bullets',
    subtitle: 'Powered by Gemini AI',
    desc: 'Click "AI Suggest" on any experience card and get 4 powerful, ATS-optimized bullet points generated instantly.',
    points: ['Gemini AI powered', 'ATS-optimized bullets', 'Per-experience cards', 'One-click generation'],
  },
  {
    icon: Shield, color: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.25)',
    title: 'Application Tracker',
    subtitle: 'Auto-track every application',
    desc: 'Every job you apply to is automatically tracked. View status, company, date — all in one organized dashboard.',
    points: ['Auto-tracking on apply', 'Status management', 'Company & date logs', 'Application history'],
  },
  {
    icon: Globe, color: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.25)',
    title: '18+ Field Support',
    subtitle: 'Engineering to Law to Medical',
    desc: 'Fully personalized for 18+ fields — CSE, ECE, Mechanical, Medical, Commerce, Law, Design, and more.',
    points: ['18+ study fields', 'Field-specific jobs', 'Custom skill gaps', 'Tailored roadmaps'],
  },
];

const comparison = [
  { feature: 'Career DNA Analysis', us: true, others: false },
  { feature: 'Field-Specific Skill Gaps', us: true, others: false },
  { feature: '50+ Job Platforms', us: true, others: false },
  { feature: 'AI Resume Bullets', us: true, others: false },
  { feature: 'Auto Application Tracking', us: true, others: false },
  { feature: '18+ Fields Supported', us: true, others: false },
  { feature: 'Free to Use', us: true, others: false },
  { feature: 'India-Focused', us: true, others: false },
];

export default function Features() {
  const { theme } = useTheme();
  const maxSalary = Math.max(...salaryData.map(d => d.val));

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', overflow: 'hidden' }}>
        <motion.div animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }} transition={{ duration: 12, repeat: Infinity }}
          style={{ position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <motion.h1 {...fadeUp(0.2)} style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, margin: '0 0 18px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1px', lineHeight: 1.1 }}>
            Everything You Need to
            <br />
            <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Succeed in Your Career
            </span>
          </motion.h1>
          <motion.p {...fadeUp(0.3)} style={{ color: 'rgba(148,163,184,0.75)', fontSize: 18, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Comprehensive tools and resources designed to accelerate your professional growth — all in one platform.
          </motion.p>
          <motion.div {...fadeUp(0.4)} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: theme === 'dark' ? 'white' : '#0f172a', padding: '13px 28px', borderRadius: 14, fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 28px rgba(124,58,237,0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Get Started Free <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── SKILL GAP CHART ── */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp(0)}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: 999, padding: '5px 14px', marginBottom: 16 }}>
                <BarChart2 style={{ width: 13, height: 13, color: '#60a5fa' }} />
                <span style={{ color: '#93c5fd', fontSize: 12, fontWeight: 700 }}>SKILL GAP ANALYSIS</span>
              </div>
              <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, margin: '0 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>
                See Exactly What Skills You're Missing
              </h2>
              <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                Our AI compares your current skills against market demand for your target role — giving you a clear, actionable gap analysis.
              </p>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(124,58,237,0.6)' }} />
                  <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: 13 }}>Your Level</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(167,139,250,0.9)' }} />
                  <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: 13 }}>Market Demand</span>
                </div>
              </div>
            </motion.div>

            {/* Chart */}
            <motion.div {...fadeUp(0.15)} style={{ border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {skillData.map((s, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600 }}>{s.skill}</span>
                      <span style={{ color: s.color, fontSize: 12, fontWeight: 700 }}>{s.you}% → {s.market}%</span>
                    </div>
                    {/* Market demand bar */}
                    <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden', marginBottom: 4 }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.market}%` }} viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                        style={{ position: 'absolute', height: '100%', background: `${s.color}40`, borderRadius: 999 }} />
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.you}%` }} viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.5, duration: 0.8 }}
                        style={{ position: 'absolute', height: '100%', background: s.color, borderRadius: 999, boxShadow: `0 0 8px ${s.color}60` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{ color: 'rgba(239,68,68,0.8)', fontSize: 11, fontWeight: 600 }}>Gap: {s.market - s.you}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SALARY GROWTH CHART ── */}
      <section style={{ padding: '60px 24px 80px', background: 'rgba(124,58,237,0.03)', borderTop: '1px solid rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.08)' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Chart */}
            <motion.div {...fadeUp(0)} style={{ border: '1px solid rgba(52,211,153,0.2)', borderRadius: 24, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <div style={{ marginBottom: 16 }}>
                <span style={{ color: '#34d399', fontSize: 13, fontWeight: 700 }}>Average Salary Growth After Using CareerNavigator</span>
              </div>
              {/* Bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140, paddingBottom: 8 }}>
                {salaryData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#34d399', fontSize: 11, fontWeight: 700 }}>₹{d.val}k</span>
                    <motion.div
                      initial={{ height: 0 }} whileInView={{ height: `${(d.val / maxSalary) * 110}px` }} viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                      style={{ width: '100%', background: `linear-gradient(180deg, #34d399, #059669)`, borderRadius: '6px 6px 0 0', boxShadow: '0 0 12px rgba(52,211,153,0.3)' }} />
                    <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 10 }}>{d.month}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(52,211,153,0.1)', borderRadius: 10, border: '1px solid rgba(52,211,153,0.2)' }}>
                <span style={{ color: '#34d399', fontSize: 13, fontWeight: 700 }}>+134% average salary increase</span>
                <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12, marginLeft: 8 }}>within 12 months</span>
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.15)}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 999, padding: '5px 14px', marginBottom: 16 }}>
                <TrendingUp style={{ width: 13, height: 13, color: '#34d399' }} />
                <span style={{ color: '#6ee7b7', fontSize: 12, fontWeight: 700 }}>PROVEN RESULTS</span>
              </div>
              <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, margin: '0 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>
                Real Career Growth, Real Numbers
              </h2>
              <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                Students who complete their Career DNA and follow our roadmap see measurable salary growth within months.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { val: '10K+', label: 'Students Placed', color: '#a78bfa' },
                  { val: '95%', label: 'Success Rate', color: '#34d399' },
                  { val: '3 mo', label: 'Avg. Time to Job', color: '#60a5fa' },
                  { val: '4.9★', label: 'User Rating', color: '#fbbf24' },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    style={{ background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 16, padding: '16px 18px' }}>
                    <div style={{ color: s.color, fontSize: 26, fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.val}</div>
                    <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 12 }}>{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section style={{ padding: '100px 24px' }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, margin: '0 0 14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Every Feature You Need
            </h2>
            <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 16 }}>Built specifically for Indian students and professionals</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -6, boxShadow: `0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px ${f.color}35` }}
                  style={{ background: f.bg, border: `1px solid ${f.border}`, borderRadius: 22, padding: '28px 24px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${f.color}50, transparent)` }} />
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `${f.color}18`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: `0 4px 16px ${f.color}20` }}>
                    <Icon style={{ width: 24, height: 24, color: f.color }} />
                  </div>
                  <div style={{ color: f.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{f.subtitle}</div>
                  <h3 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: '0 0 10px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</h3>
                  <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 13.5, lineHeight: 1.65, margin: '0 0 18px' }}>{f.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {f.points.map((p, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle style={{ width: 13, height: 13, color: f.color, flexShrink: 0 }} />
                        <span style={{ color: 'rgba(196,181,253,0.75)', fontSize: 12.5 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section style={{ padding: '80px 24px 100px' }}>
        <div className="container mx-auto max-w-3xl">
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Why CareerNavigator?
            </h2>
            <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 15 }}>See how we compare to other platforms</p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} style={{ border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 140px', background: 'rgba(124,58,237,0.15)', padding: '16px 24px', borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
              <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: 13, fontWeight: 600 }}>Feature</span>
              <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 800, textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CareerNavigator</span>
              <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>Others</span>
            </div>
            {comparison.map((row, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 140px 140px', padding: '14px 24px', borderBottom: i < comparison.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{row.feature}</span>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle style={{ width: 14, height: 14, color: '#34d399' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'rgba(239,68,68,0.6)', fontSize: 14, fontWeight: 700, lineHeight: 1 }}>✕</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '60px 24px 100px' }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeUp(0)}
            style={{ border: '1px solid rgba(124,58,237,0.3)', borderRadius: 32, padding: '60px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(124,58,237,0.2)' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Rocket style={{ width: 40, height: 40, color: '#a78bfa', margin: '0 auto 16px' }} />
              <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900, margin: '0 0 14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Ready to Unlock All Features?
              </h2>
              <p style={{ color: 'rgba(196,181,253,0.75)', fontSize: 16, margin: '0 0 32px' }}>
                Join 10,000+ students who've already transformed their careers.
              </p>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: theme === 'dark' ? 'white' : '#0f172a', padding: '16px 36px', borderRadius: 14, fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 32px rgba(124,58,237,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Start Free Today <ChevronRight style={{ width: 18, height: 18 }} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
