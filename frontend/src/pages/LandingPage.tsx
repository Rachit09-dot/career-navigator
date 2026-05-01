import { Link } from 'react-router-dom';
import StatsMarquee from '../components/StatsMarquee';
import CompanyLogos from '../components/CompanyLogos';
import FAQSection from '../components/FAQSection';
import BeforeAfter from '../components/BeforeAfter';
import CareerFieldSelector from '../components/CareerFieldSelector';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Target, Zap, TrendingUp, Users,
  Briefcase, Star, CheckCircle, Rocket, Shield, Globe,
  ChevronRight, Sparkles, GraduationCap, Award
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../context/ThemeContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: 'easeOut' } },
});

const features = [
  { icon: Brain, title: 'Career DNA Analysis', desc: 'AI discovers your unique career personality and maps it to ideal roles', color: '#a78bfa', bg: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.3)' },
  { icon: Target, title: 'Skill Gap Tracker', desc: 'Know exactly what skills you need and track your learning progress', color: '#60a5fa', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
  { icon: Briefcase, title: 'Smart Job Matching', desc: '50+ job platforms pre-searched for your exact role and field', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
  { icon: TrendingUp, title: 'Resume AI Bullets', desc: 'AI generates powerful bullet points for your experience sections', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
  { icon: Shield, title: 'Application Tracker', desc: 'Auto-track every job you apply to � never lose a lead again', color: '#f472b6', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.3)' },
  { icon: Globe, title: 'Field-Specific Paths', desc: 'Personalized for 18+ fields � Engineering, Medical, Law, Commerce & more', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)' },
];

const stats = [
  { icon: Users, value: '18+', label: 'Career Fields', color: '#a78bfa' },
  { icon: Briefcase, value: '50+', label: 'Job Platforms', color: '#60a5fa' },
  { icon: TrendingUp, value: '60+', label: 'Personality Types', color: '#34d399' },
  { icon: Star, value: '100%', label: 'Free to Use', color: '#fbbf24' },
];

const steps = [
  { num: '01', title: 'Create Your Profile', desc: 'Tell us your field, skills, and career goals in 2 minutes', icon: GraduationCap },
  { num: '02', title: 'Take Career DNA', desc: 'Answer 10 questions � AI maps your perfect career path', icon: Brain },
  { num: '03', title: 'Get Matched', desc: 'See jobs, skill gaps, and a personalized roadmap instantly', icon: Rocket },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer at TCS', text: 'CareerNavigator helped me identify my skill gaps and land my dream job in 3 months!', rating: 5 },
  { name: 'Rahul Verma', role: 'Data Analyst at Infosys', text: 'The Career DNA feature is incredible. It told me exactly what I needed to focus on.', rating: 5 },
  { name: 'Ananya Singh', role: 'Product Manager at Startup', text: 'From confused fresher to confident professional � this platform changed everything.', rating: 5 },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const { theme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>

      {/* -- HERO -- */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Animated background blobs */}
        <motion.div animate={{ x: [-30, 30, -30], y: [-20, 20, -20] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '-10%', left: '-5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <motion.div animate={{ x: [20, -20, 20], y: [15, -15, 15] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(91,33,182,0.2), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, background: 'radial-gradient(circle, rgba(167,139,250,0.08), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

        <div className="container mx-auto max-w-7xl px-6 relative z-10 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <motion.h1 {...fadeUp(0.2)} style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 20px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1.5px' }}>
                Your Dream Career
                <br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: theme === 'dark' ? 'linear-gradient(135deg, #c4b5fd, #a78bfa, #7c3aed)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
                  Starts Here
                </span>
              </motion.h1>

              <motion.p {...fadeUp(0.3)} style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#475569', fontSize: 18, lineHeight: 1.7, margin: '0 0 36px', maxWidth: 480, fontFamily: "'Inter', sans-serif" }}>
                Get AI-powered career guidance, discover your perfect job match, and accelerate your professional growth with India's most trusted career platform.
              </motion.p>

              <motion.div {...fadeUp(0.4)} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
                <Link to={isAuthenticated ? '/dashboard' : '/register'}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: theme === 'dark' ? 'white' : '#0f172a', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', padding: '14px 28px', borderRadius: 14, fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: '0 8px 32px rgba(124,58,237,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Start Free Trial <ArrowRight style={{ width: 16, height: 16 }} />
                </Link>
                <Link to="/login"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', color: theme === 'dark' ? 'white' : '#0f172a', padding: '14px 28px', borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: 'none', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Sign In
                </Link>
              </motion.div>

              <motion.div {...fadeUp(0.5)} style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {['Free Trial Available', 'AI-Powered Matching', '18+ Career Fields'].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle style={{ width: 14, height: 14, color: '#34d399' }} />
                    <span style={{ color: 'rgba(148,163,184,0.8)', fontSize: 13 }}>{t}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Stats tiles */}
            <div className="grid grid-cols-2 gap-5">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                    style={{ border: `1px solid ${s.color}${theme === 'dark' ? '30' : '40'}`, borderRadius: 24, padding: '28px 24px', position: 'relative', overflow: 'hidden', cursor: 'default', boxShadow: theme === 'dark' ? `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${s.color}15` : `0 8px 24px rgba(0,0,0,0.05), 0 0 0 1px ${s.color}15`, background: theme === 'dark' ? 'transparent' : 'white' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}60, transparent)` }} />
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: `0 4px 16px ${s.color}20` }}>
                      <Icon style={{ width: 22, height: 22, color: s.color }} />
                    </div>
                    <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 36, fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
                    <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.7)' : '#64748b', fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* -- STATS MARQUEE -- */}
      <StatsMarquee />

      {/* -- FEATURES -- */}
      <section style={{ padding: '100px 24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(124,58,237,0.08), transparent 70%)', pointerEvents: 'none' }} />
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, margin: '0 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>
              Everything You Need to
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: theme === 'dark' ? 'linear-gradient(135deg, #c4b5fd, #a78bfa, #7c3aed)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>Land Your Dream Job</span>
            </h2>
            <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.7)' : '#475569', fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
              From career discovery to job application � we've got every step covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -6, boxShadow: theme === 'dark' ? `0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px ${f.color}40` : `0 20px 48px rgba(0,0,0,0.1), 0 0 0 1px ${f.color}40` }}
                  style={{ background: theme === 'dark' ? f.bg : 'white', border: `1px solid ${f.border}`, borderRadius: 22, padding: '28px 24px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s', cursor: 'default' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${f.color}50, transparent)` }} />
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `${f.color}18`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: `0 4px 16px ${f.color}20` }}>
                    <Icon style={{ width: 24, height: 24, color: f.color }} />
                  </div>
                  <h3 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 17, fontWeight: 800, margin: '0 0 10px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</h3>
                  <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.7)' : '#64748b', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -- BEFORE/AFTER -- */}
      <BeforeAfter />

      {/* -- HOW IT WORKS -- */}
      <section style={{ padding: '100px 24px', background: theme === 'dark' ? 'rgba(124,58,237,0.04)' : 'rgba(124,58,237,0.02)', borderTop: theme === 'dark' ? '1px solid rgba(124,58,237,0.1)' : '1px solid rgba(124,58,237,0.05)', borderBottom: theme === 'dark' ? '1px solid rgba(124,58,237,0.1)' : '1px solid rgba(124,58,237,0.05)' }}>
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, margin: '0 0 14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              How It Works
            </h2>
            <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.7)' : '#475569', fontSize: 16 }}>Three simple steps to your dream career</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  style={{ textAlign: 'center', position: 'relative' }}>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block" style={{ position: 'absolute', top: 40, left: '60%', width: '80%', height: 1, zIndex: 0 }} />
                  )}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 32px rgba(124,58,237,0.3)' }}>
                      <Icon style={{ width: 32, height: 32, color: '#a78bfa' }} />
                    </div>
                    <div style={{ color: 'rgba(124,58,237,0.5)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', marginBottom: 8 }}>STEP {s.num}</div>
                    <h3 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: '0 0 10px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.title}</h3>
                    <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -- CAREER FIELD SELECTOR -- */}
      <CareerFieldSelector />

      {/* -- TESTIMONIALS -- */}
      <section style={{ padding: '100px 24px' }}>
        <div className="container mx-auto max-w-6xl">
          <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, margin: '0 0 14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              What Students Say
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                style={{ border: '1px solid rgba(124,58,237,0.2)', borderRadius: 22, padding: '28px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {Array(t.rating).fill(0).map((_, j) => <Star key={j} style={{ width: 14, height: 14, color: '#fbbf24', fill: '#fbbf24' }} />)}
                </div>
                <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.85)' : '#475569', fontSize: 14, lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div>
                  <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: 700, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.name}</div>
                  <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#94a3b8', fontSize: 12 }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -- COMPANY LOGOS -- */}
      <CompanyLogos />

      {/* -- FAQ -- */}
      <FAQSection />

      {/* -- CTA -- */}
      <section style={{ padding: '80px 24px 120px' }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ border: '1px solid rgba(124,58,237,0.3)', borderRadius: 32, padding: '64px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(124,58,237,0.2)' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -40, width: 250, height: 250, background: 'radial-gradient(circle, rgba(167,139,250,0.15), transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, margin: '0 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>
                Ready to Find Your Dream Career?
              </h2>
              <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.75)' : '#475569', fontSize: 17, margin: '0 0 36px' }}>
                Join 10,000+ students who've already transformed their careers with CareerNavigator.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to={isAuthenticated ? '/dashboard' : '/register'}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: theme === 'dark' ? 'white' : '#0f172a', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', padding: '16px 36px', borderRadius: 14, fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 32px rgba(124,58,237,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Get Started Free <ChevronRight style={{ width: 18, height: 18 }} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}


