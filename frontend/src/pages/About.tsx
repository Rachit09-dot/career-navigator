import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Target, Heart, Zap, Globe, Users, TrendingUp,
  Star, Award, CheckCircle, ArrowRight, ChevronRight,
  Rocket, Brain, Shield, BookOpen
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
});

const impactData = [
  { val: '18+', label: 'Career Fields', color: '#a78bfa', icon: Globe },
  { val: '50+', label: 'Job Platforms', color: '#60a5fa', icon: BookOpen },
  { val: '60+', label: 'Personality Types', color: '#34d399', icon: Brain },
  { val: '100%', label: 'Free to Use', color: '#fbbf24', icon: Heart },
];

const values = [
  { icon: Target, color: '#a78bfa', title: 'Student-First', desc: 'Every feature is built with the Indian student in mind — from tier-2 cities to metro colleges.' },
  { icon: Brain, color: '#60a5fa', title: 'AI-Powered', desc: 'We use cutting-edge AI to give personalized guidance that was previously only available to the privileged few.' },
  { icon: Heart, color: '#f472b6', title: 'Accessible', desc: 'Quality career guidance should be free and accessible to every student, regardless of background.' },
  { icon: Shield, color: '#34d399', title: 'Trustworthy', desc: 'We never sell your data. Your career journey is private, secure, and belongs to you.' },
];

const milestones = [
  { year: 'Jan 2026', event: 'Project Kickoff', desc: 'CareerNavigator was born — the idea that every student deserves an AI career mentor', color: '#a78bfa' },
  { year: 'Feb 2026', event: 'Core Features Built', desc: 'Career DNA, Skill Gap Tracker and Job Matching — first version ready', color: '#60a5fa' },
  { year: 'Mar 2026', event: 'Beta Launch', desc: 'First 50 beta users tested the platform and shared valuable feedback', color: '#34d399' },
  { year: 'Apr 2026', event: '18+ Fields Added', desc: 'Engineering, Medical, Law, Commerce — personalization for every field', color: '#fbbf24' },
  { year: 'Apr 2026', event: 'AI Resume Bullets', desc: 'Gemini AI powered resume bullet generator launched for all users', color: '#f472b6' },
];

const growthData = [
  { quarter: 'Jan', students: 20 },
  { quarter: 'Feb', students: 45 },
  { quarter: 'Mar', students: 70 },
  { quarter: 'Apr', students: 100 },
];



const maxStudents = Math.max(...growthData.map(d => d.students));

export default function About() {
  const { theme } = useTheme();
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', overflow: 'hidden' }}>
        <motion.div animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }} transition={{ duration: 12, repeat: Infinity }}
          style={{ position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <motion.div {...fadeUp(0.1)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 999, padding: '6px 18px', marginBottom: 20 }}>
            <Rocket style={{ width: 13, height: 13, color: '#a78bfa' }} />
            <span style={{ color: '#c4b5fd', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Our Story</span>
          </motion.div>
          <motion.h1 {...fadeUp(0.2)} style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, margin: '0 0 18px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1px', lineHeight: 1.1 }}>
            Empowering Students to
            <br />
            <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Build Successful Careers
            </span>
          </motion.h1>
          <motion.p {...fadeUp(0.3)} style={{ color: 'rgba(148,163,184,0.75)', fontSize: 18, maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
            We're on a mission to make quality career guidance accessible to every student in India — regardless of college, city, or background.
          </motion.p>
        </div>
      </section>

      {/* ── IMPACT STATS ── */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {impactData.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 24, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.03 }}
                  style={{ background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 22, padding: '28px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: `0 8px 28px rgba(0,0,0,0.3)` }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}60, transparent)` }} />
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: `0 4px 16px ${s.color}20` }}>
                    <Icon style={{ width: 22, height: 22, color: s.color }} />
                  </div>
                  <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 34, fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1, marginBottom: 6 }}>{s.val}</div>
                  <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 13 }}>{s.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MISSION + GROWTH CHART ── */}
      <section style={{ padding: '60px 24px 80px', background: 'rgba(124,58,237,0.03)', borderTop: '1px solid rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.08)' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div {...fadeUp(0)}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 999, padding: '5px 14px', marginBottom: 16 }}>
                <Target style={{ width: 13, height: 13, color: '#a78bfa' }} />
                <span style={{ color: '#c4b5fd', fontSize: 12, fontWeight: 700 }}>OUR MISSION</span>
              </div>
              <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, margin: '0 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>
                Making Career Guidance Accessible to All
              </h2>
              <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 16, lineHeight: 1.75, marginBottom: 20 }}>
                In India, quality career mentorship is often limited to students at top colleges or those who can afford expensive coaching. We're changing that.
              </p>
              <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 16, lineHeight: 1.75, marginBottom: 28 }}>
                CareerNavigator uses AI to give every student — from Tier-1 to Tier-3 cities — the same quality of career guidance that was previously only available to the privileged few.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Free for all students', 'Works for 18+ career fields', 'AI-powered, not generic advice', 'Built specifically for India'].map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle style={{ width: 16, height: 16, color: '#34d399', flexShrink: 0 }} />
                    <span style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 15 }}>{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Growth Chart */}
            <motion.div {...fadeUp(0.15)} style={{ border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ color: '#a78bfa', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Features Shipped</div>
                <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 28, fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>100+ Features</div>
                <div style={{ color: 'rgba(52,211,153,0.8)', fontSize: 13, fontWeight: 600 }}>Built in 4 months — Jan to Apr 2026</div>
              </div>
              {/* Bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
                {growthData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <motion.div
                      initial={{ height: 0 }} whileInView={{ height: `${(d.students / maxStudents) * 120}px` }} viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.6 }}
                      style={{ width: '100%', background: i === growthData.length - 1 ? 'linear-gradient(180deg, #a78bfa, #7c3aed)' : 'linear-gradient(180deg, rgba(124,58,237,0.6), rgba(124,58,237,0.3))', borderRadius: '6px 6px 0 0', boxShadow: i === growthData.length - 1 ? '0 0 16px rgba(124,58,237,0.5)' : 'none' }} />
                    <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 9, textAlign: 'center', lineHeight: 1.2 }}>{d.quarter}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(52,211,153,0.08)', borderRadius: 10, border: '1px solid rgba(52,211,153,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp style={{ width: 16, height: 16, color: '#34d399' }} />
                <span style={{ color: '#34d399', fontSize: 13, fontWeight: 700 }}>Built in 2026 — actively growing</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container mx-auto max-w-6xl">
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              What We Stand For
            </h2>
            <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 15 }}>The principles that guide everything we build</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                  style={{ background: `${v.color}10`, border: `1px solid ${v.color}25`, borderRadius: 20, padding: '24px 20px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${v.color}50, transparent)` }} />
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${v.color}18`, border: `1px solid ${v.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: `0 4px 14px ${v.color}20` }}>
                    <Icon style={{ width: 22, height: 22, color: v.color }} />
                  </div>
                  <h3 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 16, fontWeight: 800, margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{v.title}</h3>
                  <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MILESTONES TIMELINE ── */}
      <section style={{ padding: '60px 24px 80px', background: 'rgba(124,58,237,0.03)', borderTop: '1px solid rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.08)' }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Our Journey
            </h2>
            <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 15 }}>Key milestones that shaped CareerNavigator</p>
          </motion.div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, transform: 'translateX(-50%)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {milestones.map((m, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
                  {i % 2 === 0 ? (
                    <>
                      <div style={{ width: '44%', textAlign: 'right', paddingRight: 28 }}>
                        <div style={{ background: `${m.color}12`, border: `1px solid ${m.color}25`, borderRadius: 16, padding: '14px 18px', display: 'inline-block', textAlign: 'left' }}>
                          <div style={{ color: m.color, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{m.year}</div>
                          <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, fontWeight: 700, marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.event}</div>
                          <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12 }}>{m.desc}</div>
                        </div>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: m.color, border: '3px solid rgba(15,10,46,1)', boxShadow: `0 0 14px ${m.color}70`, flexShrink: 0, zIndex: 1 }} />
                      <div style={{ width: '44%' }} />
                    </>
                  ) : (
                    <>
                      <div style={{ width: '44%' }} />
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: m.color, border: '3px solid rgba(15,10,46,1)', boxShadow: `0 0 14px ${m.color}70`, flexShrink: 0, zIndex: 1 }} />
                      <div style={{ width: '44%', paddingLeft: 28 }}>
                        <div style={{ background: `${m.color}12`, border: `1px solid ${m.color}25`, borderRadius: 16, padding: '14px 18px', display: 'inline-block' }}>
                          <div style={{ color: m.color, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{m.year}</div>
                          <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, fontWeight: 700, marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.event}</div>
                          <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12 }}>{m.desc}</div>
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
      <section style={{ padding: '60px 24px 100px' }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeUp(0)}
            style={{ border: '1px solid rgba(124,58,237,0.3)', borderRadius: 32, padding: '60px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(124,58,237,0.2)' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Heart style={{ width: 40, height: 40, color: '#f472b6', margin: '0 auto 16px' }} />
              <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900, margin: '0 0 14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Join Our Mission
              </h2>
              <p style={{ color: 'rgba(196,181,253,0.75)', fontSize: 16, margin: '0 0 32px' }}>
                Be part of the movement to democratize career guidance in India.
              </p>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: theme === 'dark' ? 'white' : '#0f172a', padding: '16px 36px', borderRadius: 14, fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 32px rgba(124,58,237,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Get Started Free <ChevronRight style={{ width: 18, height: 18 }} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
