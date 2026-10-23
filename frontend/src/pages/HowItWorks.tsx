import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  UserPlus, Brain, Target, Rocket, ArrowRight,
  CheckCircle, ChevronRight, Zap, TrendingUp,
  Clock, Star, Users, Briefcase, ArrowDown
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
});

const steps = [
  {
    num: '01', icon: UserPlus, color: '#a78bfa', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)',
    title: 'Create Your Profile',
    subtitle: 'Get Started in Minutes',
    desc: 'Sign up and complete your profile — tell us your field, skills, education, and career goals. Takes less than 2 minutes.',
    points: ['Choose your field (18+ options)', 'Add your current skills', 'Set your career goal', 'Pick your location preference'],
    time: '2 min',
    outcome: 'Personalized dashboard unlocked',
  },
  {
    num: '02', icon: Brain, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)',
    title: 'Take Career DNA',
    subtitle: 'Discover Your Strengths',
    desc: 'Answer 10 field-specific questions. Our AI maps your personality to 60+ career types and identifies your ideal path.',
    points: ['10 targeted questions', 'Field-specific analysis', '60+ personality types', 'Instant AI results'],
    time: '5 min',
    outcome: 'Your career personality revealed',
  },
  {
    num: '03', icon: Target, color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.3)',
    title: 'Get Personalized Roadmap',
    subtitle: 'Your Custom Career Path',
    desc: 'See your skill gaps, recommended jobs, and a step-by-step roadmap tailored to your field and career DNA results.',
    points: ['Skill gap analysis', 'Role-specific learning path', 'Job match percentage', 'Priority skill list'],
    time: 'Instant',
    outcome: 'Clear action plan ready',
  },
  {
    num: '04', icon: Rocket, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.3)',
    title: 'Apply & Track Progress',
    subtitle: 'Launch Your Career',
    desc: 'Browse 50+ job platforms pre-searched for your role, apply with one click, and track every application automatically.',
    points: ['50+ job platforms', 'Auto application tracking', 'AI resume bullets', 'Progress dashboard'],
    time: 'Ongoing',
    outcome: 'Dream job secured',
  },
];

const timeline = [
  { day: 'Day 1', action: 'Sign up & complete profile', color: '#a78bfa' },
  { day: 'Day 1', action: 'Take Career DNA test', color: '#60a5fa' },
  { day: 'Day 2', action: 'Review skill gap analysis', color: '#34d399' },
  { day: 'Week 1', action: 'Start learning priority skills', color: '#fbbf24' },
  { day: 'Week 2', action: 'Apply to matched jobs', color: '#f472b6' },
  { day: 'Month 1', action: 'Track applications & iterate', color: '#fb923c' },
  { day: 'Month 3', action: 'Land your dream job', color: '#4ade80' },
];

const successMetrics = [
  { val: '2 min', label: 'Profile setup time', icon: Clock, color: '#a78bfa' },
  { val: '5 min', label: 'Career DNA test', icon: Brain, color: '#60a5fa' },
  { val: '3 mo', label: 'Avg. time to job', icon: TrendingUp, color: '#34d399' },
  { val: '95%', label: 'Success rate', icon: Star, color: '#fbbf24' },
];

export default function HowItWorks() {
  const { theme } = useTheme();
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', overflow: 'hidden' }}>
        <motion.div animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }} transition={{ duration: 12, repeat: Infinity }}
          style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <motion.div {...fadeUp(0.1)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 999, padding: '6px 18px', marginBottom: 20 }}>
            <Zap style={{ width: 13, height: 13, color: '#a78bfa' }} />
            <span style={{ color: '#c4b5fd', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Simple 4-Step Process</span>
          </motion.div>
          <motion.h1 {...fadeUp(0.2)} style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, margin: '0 0 18px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1px', lineHeight: 1.1 }}>
            How CareerNavigator
            <br />
            <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Works for You
            </span>
          </motion.h1>
          <motion.p {...fadeUp(0.3)} style={{ color: 'rgba(148,163,184,0.75)', fontSize: 18, maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Your journey from student to professional in 4 simple steps — powered by AI, built for India.
          </motion.p>

          {/* Quick metrics */}
          <motion.div {...fadeUp(0.4)} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {successMetrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: `${m.color}12`, border: `1px solid ${m.color}25`, borderRadius: 12, padding: '10px 16px' }}>
                  <Icon style={{ width: 16, height: 16, color: m.color }} />
                  <span style={{ color: m.color, fontWeight: 800, fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.val}</span>
                  <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12 }}>{m.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── STEP CARDS ── */}
      <section style={{ padding: '60px 24px 80px' }}>
        <div className="container mx-auto max-w-6xl">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isEven = i % 2 === 1;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: isEven ? 40 : -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}
                  className="grid-cols-1 md:grid-cols-2">
                  {/* Content side */}
                  <div style={{ order: isEven ? 2 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 18, background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${s.color}25` }}>
                        <Icon style={{ width: 26, height: 26, color: s.color }} />
                      </div>
                      <div>
                        <div style={{ color: s.color, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step {s.num}</div>
                        <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12 }}>{s.subtitle}</div>
                      </div>
                    </div>
                    <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.3px' }}>{s.title}</h2>
                    <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px' }}>{s.desc}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                      {s.points.map((p, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <CheckCircle style={{ width: 14, height: 14, color: s.color, flexShrink: 0 }} />
                          <span style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 14 }}>{p}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ background: `${s.color}12`, border: `1px solid ${s.color}25`, borderRadius: 10, padding: '8px 14px' }}>
                        <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}>Time</div>
                        <div style={{ color: s.color, fontSize: 14, fontWeight: 800 }}>{s.time}</div>
                      </div>
                      <div style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.04)', borderRadius: 10, padding: '8px 14px', flex: 1 }}>
                        <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }}>Outcome</div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600 }}>{s.outcome}</div>
                      </div>
                    </div>
                  </div>

                  {/* Visual side */}
                  <motion.div style={{ order: isEven ? 1 : 2 }}
                    whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 24, padding: 28, position: 'relative', overflow: 'hidden', boxShadow: `0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px ${s.color}10` }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}60, transparent)` }} />
                      {/* Step number big */}
                      <div style={{ position: 'absolute', top: 16, right: 20, color: `${s.color}15`, fontSize: 80, fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1, userSelect: 'none' }}>{s.num}</div>
                      {/* Icon big */}
                      <div style={{ width: 72, height: 72, borderRadius: 22, background: `${s.color}20`, border: `2px solid ${s.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: `0 0 32px ${s.color}30` }}>
                        <Icon style={{ width: 34, height: 34, color: s.color }} />
                      </div>
                      <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.title}</div>
                      {/* Mini progress bar */}
                      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 999, height: 6, overflow: 'hidden', marginBottom: 12 }}>
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${(i + 1) * 25}%` }} viewport={{ once: true }}
                          transition={{ delay: 0.4, duration: 0.8 }}
                          style={{ height: '100%', background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, borderRadius: 999, boxShadow: `0 0 8px ${s.color}50` }} />
                      </div>
                      <div style={{ color: s.color, fontSize: 12, fontWeight: 700 }}>Step {i + 1} of 4 — {(i + 1) * 25}% complete</div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(124,58,237,0.04)', borderTop: '1px solid rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Your Journey Timeline
            </h2>
            <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 15 }}>From signup to dream job — here's what to expect</p>
          </motion.div>

          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, transform: 'translateX(-50%)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {timeline.map((t, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 0, justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
                  {i % 2 === 0 ? (
                    <>
                      <div style={{ width: '45%', textAlign: 'right', paddingRight: 24 }}>
                        <div style={{ background: `${t.color}12`, border: `1px solid ${t.color}25`, borderRadius: 14, padding: '12px 18px', display: 'inline-block' }}>
                          <div style={{ color: t.color, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{t.day}</div>
                          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600 }}>{t.action}</div>
                        </div>
                      </div>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: t.color, border: '3px solid rgba(15,10,46,1)', boxShadow: `0 0 12px ${t.color}60`, flexShrink: 0, zIndex: 1 }} />
                      <div style={{ width: '45%' }} />
                    </>
                  ) : (
                    <>
                      <div style={{ width: '45%' }} />
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: t.color, border: '3px solid rgba(15,10,46,1)', boxShadow: `0 0 12px ${t.color}60`, flexShrink: 0, zIndex: 1 }} />
                      <div style={{ width: '45%', paddingLeft: 24 }}>
                        <div style={{ background: `${t.color}12`, border: `1px solid ${t.color}25`, borderRadius: 14, padding: '12px 18px', display: 'inline-block' }}>
                          <div style={{ color: t.color, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{t.day}</div>
                          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600 }}>{t.action}</div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px 100px' }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeUp(0)}
            style={{ border: '1px solid rgba(124,58,237,0.3)', borderRadius: 32, padding: '60px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(124,58,237,0.2)' }}>
            <div style={{ position: 'absolute', top: -60, left: -60, width: 280, height: 280, background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Rocket style={{ width: 40, height: 40, color: '#a78bfa', margin: '0 auto 16px' }} />
              <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900, margin: '0 0 14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Ready to Start Your Journey?
              </h2>
              <p style={{ color: 'rgba(196,181,253,0.75)', fontSize: 16, margin: '0 0 32px' }}>
                Join 10,000+ students — takes less than 2 minutes to get started.
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
