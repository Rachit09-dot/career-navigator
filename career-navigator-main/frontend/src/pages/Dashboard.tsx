import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Briefcase, Brain, Target, ArrowRight,
  UserCheck, CheckCircle, Lock, Zap, TrendingUp,
  MapPin, Bell, BookOpen,
  Cpu, Heart, Scale, Palette, Radio, Atom, Building, Leaf, GraduationCap
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { applicationAPI, profileAPI, jobAPI, skillGapAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

// ── Helpers ───────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return '🌅 Good Morning';
  if (h < 17) return '☀️ Good Afternoon';
  return '🌙 Good Evening';
}

function getFirstName(name?: string) {
  if (!name) return 'there';
  return name.split(' ')[0];
}

// Circular progress ring
function ProgressRing({ pct, size = 80, stroke = 8, color = '#7c3aed' }: {
  pct: number; size?: number; stroke?: number; color?: string
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }} />
    </svg>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } }),
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const user = useAuthStore(s => s.user);
  const { theme } = useTheme();
  const firstName = getFirstName(user?.name);

  const [stats, setStats] = useState({ profileCompletion: 0, jobsApplied: 0, skillsAdded: 0 });
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [skillProgress, setSkillProgress] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [appStats, prof, jobsRes] = await Promise.all([
          applicationAPI.getStats(),
          profileAPI.getProfile(),
          jobAPI.getJobs(),
        ]);
        // Load skill gap progress
        try {
          const [lastGap, completedRes] = await Promise.all([
            skillGapAPI.getLast(),
            skillGapAPI.getCompletedSkills(),
          ]);
          const totalSkills = lastGap.data?.gaps?.length || 0;
          const completedSkills = completedRes.data?.completed_skills?.length || 0;
          setSkillProgress({ completed: completedSkills, total: totalSkills });
        } catch { /* silent */ }        const p = prof.data;
        setProfile(p);
        const fields = [p.phone, p.location, p.bio, p.skills, p.experience, p.education, p.name, p.email];
        const filled = fields.filter(f => {
          if (!f) return false;
          if (Array.isArray(f)) return f.length > 0;
          return String(f).trim() !== '';
        }).length;
        const completion = Math.round((filled / fields.length) * 100);
        let skillsCount = 0;
        if (Array.isArray(p.skills)) skillsCount = p.skills.length;
        else if (typeof p.skills === 'string' && p.skills) skillsCount = p.skills.split(',').filter((s: string) => s.trim()).length;
        setStats({ profileCompletion: completion, jobsApplied: Number(appStats.data.total) || 0, skillsAdded: skillsCount });
        const jData = jobsRes.data;
        setJobs(Array.isArray(jData) ? jData.slice(0, 3) : (jData?.jobs || []).slice(0, 3));
      } catch {}
    };
    load();
  }, []);

  const pct = stats.profileCompletion;
  const ringColor = pct >= 80 ? '#16a34a' : pct >= 50 ? '#7c3aed' : '#d97706';
  const subtitle = pct < 50
    ? 'Complete your profile to unlock personalized job matches'
    : pct < 80
    ? "You're almost there! Add your skills to get Career DNA insights"
    : 'Your profile looks great! Ready to find your next opportunity?';

  // Actual progress logic
  const profileDone = pct >= 80;
  const dnaDone = profile?.career_dna?.results?.length > 0;
  // If they have no gaps, they haven't started. If they have gaps, are they all completed?
  const gapDone = skillProgress.total > 0 && skillProgress.completed >= skillProgress.total;

  // Roadmap steps
  const roadmap = [
    { icon: User, label: 'Complete Profile', done: profileDone, active: !profileDone, locked: false, link: '/profile' },
    { icon: Brain, label: 'Take Career DNA', done: dnaDone, active: profileDone && !dnaDone, locked: !profileDone, link: '/career-dna' },
    { icon: Target, label: 'Analyze Skill Gap', done: gapDone, active: dnaDone && !gapDone, locked: !dnaDone, link: '/skill-gap' },
    { icon: Briefcase, label: 'Apply to Jobs', done: stats.jobsApplied > 0, active: gapDone && stats.jobsApplied === 0, locked: !gapDone, link: '/jobs' },
  ];

  const quickActions = [
    { icon: UserCheck, title: 'Complete Profile', desc: 'Add skills and experience', link: '/profile', grad: 'from-emerald-500 to-teal-600' },
    { icon: Briefcase, title: 'Browse Jobs', desc: `${jobs.length || 15} jobs match your profile`, link: '/jobs', grad: 'from-violet-600 to-purple-700' },
    { icon: Brain, title: 'Take Career DNA', desc: 'Discover your ideal career path', link: '/career-dna', grad: 'from-purple-600 to-indigo-700', badge: 'New' },
    { icon: Target, title: 'Analyze Skill Gap', desc: 'See what skills you need', link: '/skill-gap', grad: 'from-amber-500 to-orange-600' },
  ];

  // Dynamic career insights based on field_of_study
  const fieldLower = (profile?.field_of_study || '').toLowerCase();
  console.log('[Dashboard] field_of_study raw:', profile?.field_of_study, '| fieldLower:', fieldLower);
  const isEngineering = fieldLower.includes('engineer') || fieldLower.includes('tech') || fieldLower.includes('cse') || fieldLower.includes('it') || fieldLower.includes('computer') || fieldLower.includes('software') || fieldLower.includes('btech') || fieldLower.includes('b.tech');
  const isMedical = fieldLower.includes('medical') || fieldLower.includes('mbbs') || fieldLower.includes('health') || fieldLower.includes('pharma') || fieldLower.includes('nursing') || fieldLower.includes('bsc') && fieldLower.includes('bio');
  const isCommerce = fieldLower.includes('commerce') || fieldLower.includes('bba') || fieldLower.includes('mba') || fieldLower.includes('ca') || fieldLower.includes('finance') || fieldLower.includes('accounting') || fieldLower.includes('bcom') || fieldLower.includes('b.com');
  const isLaw = fieldLower.includes('law') || fieldLower.includes('legal') || fieldLower.includes('llb') || fieldLower.includes('l.l.b');
  const isDesign = fieldLower.includes('design') || fieldLower.includes('art') || fieldLower.includes('fashion') || fieldLower.includes('fine art') || fieldLower.includes('bdes');

  const careerInsights = isEngineering
    ? { skills: ['Python 🔥', 'Machine Learning ⬆️', 'Cloud ✨', 'React', 'Docker'], salary: '₹9.5 LPA', salaryRange: 'Entry: ₹4-7 LPA · Senior: ₹18-35 LPA', openings: '4,200+', market: '🟢 Growing' }
    : isMedical
    ? { skills: ['Clinical Research 🔥', 'Telemedicine ⬆️', 'AI Diagnostics ✨', 'Patient Care', 'Pharmacology'], salary: '₹7.2 LPA', salaryRange: 'Entry: ₹3-5 LPA · Senior: ₹15-30 LPA', openings: '2,100+', market: '🟢 Growing' }
    : isCommerce
    ? { skills: ['Financial Modeling 🔥', 'Excel ⬆️', 'GST/Taxation ✨', 'Tally', 'Data Analysis'], salary: '₹6.8 LPA', salaryRange: 'Entry: ₹3-5 LPA · Senior: ₹12-25 LPA', openings: '3,500+', market: '🟡 Stable' }
    : isLaw
    ? { skills: ['Contract Drafting 🔥', 'Corporate Law ⬆️', 'Legal Research ✨', 'Litigation', 'Compliance'], salary: '₹7.5 LPA', salaryRange: 'Entry: ₹3-5 LPA · Senior: ₹15-40 LPA', openings: '1,200+', market: '🟢 Growing' }
    : isDesign
    ? { skills: ['Figma 🔥', 'UI/UX ⬆️', 'Motion Design ✨', 'Branding', 'Illustration'], salary: '₹6.5 LPA', salaryRange: 'Entry: ₹3-5 LPA · Senior: ₹12-22 LPA', openings: '1,800+', market: '🟢 Growing' }
    : { skills: ['Communication 🔥', 'Excel ⬆️', 'Data Analysis ✨', 'Leadership', 'SQL'], salary: '₹8.5 LPA', salaryRange: 'Entry: ₹4-6 LPA · Senior: ₹15-25 LPA', openings: '2,847+', market: '🟢 Growing' };

  // Varied match percentages based on job index
  const matchPcts = [92, 85, 78];

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── Hero Banner ── */}
      <div style={{ background: theme === 'dark' ? 'rgba(30, 27, 75, 0.4)' : 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(16px)', borderBottom: theme === 'dark' ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(124, 58, 237, 0.1)', position: 'relative', overflow: 'hidden', padding: '44px 24px 60px' }}>
        {/* blobs */}
        <motion.div animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }} transition={{ duration: 10, repeat: Infinity }}
          style={{ position: 'absolute', top: '-60px', left: '-60px', width: 400, height: 400, background: 'radial-gradient(circle, rgba(167,139,250,0.25), transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <motion.div animate={{ x: [20, -20, 20], y: [10, -10, 10] }} transition={{ duration: 14, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: 350, height: 350, background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: theme === 'dark' ? 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)' : 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.5, pointerEvents: 'none' }} />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: theme === 'dark' ? 'rgba(167,139,250,0.15)' : 'rgba(124,58,237,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 999, padding: '5px 16px', marginBottom: 14 }}>
                <span style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.9)' : '#7c3aed', fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{getGreeting()}</span>
              </motion.div>
              <h1 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, margin: '0 0 10px', lineHeight: 1.15, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>
                Welcome back, {firstName}
              </h1>
              <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#475569', fontSize: 15, margin: '0 0 24px', fontFamily: "'Inter', sans-serif" }}>{subtitle}</p>
              <div className="flex gap-3 flex-wrap">
                <Link to="/profile" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', padding: '10px 22px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 20px rgba(124,58,237,0.3)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Complete Profile <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/jobs" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', backdropFilter: 'blur(8px)', color: theme === 'dark' ? 'white' : '#0f172a', padding: '10px 22px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Browse Jobs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            {/* Stat pills */}
            <div className="flex flex-col gap-3 lg:items-end">
              {[
                { label: 'Jobs Match Your Profile', val: '47', icon: <Target className="w-4 h-4" />, color: '#a78bfa' },
                { label: 'Career DNA', val: 'Not taken yet', icon: <Brain className="w-4 h-4" />, color: '#60a5fa' },
                { label: 'New Jobs Today', val: '3', icon: <Zap className="w-4 h-4" />, color: '#34d399' },
              ].map((pill, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                  style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.05)', borderRadius: 14, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: theme === 'dark' ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.05)' }}>
                  <div style={{ color: pill.color }}>{pill.icon}</div>
                  <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : '#475569', fontSize: 13, fontWeight: 500 }}>{pill.label}</span>
                  <span style={{ color: pill.color, fontSize: 13, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{pill.val}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>


      <div className="container mx-auto max-w-6xl px-4 py-8">

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Profile Completion */}
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
            style={{ border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: 20, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: theme === 'dark' ? 'transparent' : 'white' }}
            whileHover={{ y: -4, boxShadow: theme === 'dark' ? '0 12px 32px rgba(124,58,237,0.3)' : '0 12px 32px rgba(124,58,237,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <p style={{ color: theme === 'dark' ? 'rgba(167,139,250,0.7)' : '#7c3aed', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Profile</p>
                <p style={{ fontSize: 28, fontWeight: 900, color: ringColor === '#16a34a' ? '#4ade80' : ringColor === '#d97706' ? '#fbbf24' : (theme === 'dark' ? '#a78bfa' : '#7c3aed'), fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>{pct}%</p>
                <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 11, marginTop: 2 }}>{Math.round((1 - pct / 100) * 8)} sections left</p>
              </div>
              <ProgressRing pct={pct} size={64} stroke={6} color={ringColor === '#16a34a' ? '#4ade80' : ringColor === '#d97706' ? '#fbbf24' : (theme === 'dark' ? '#a78bfa' : '#7c3aed')} />
            </div>
            <Link to="/profile" style={{ color: theme === 'dark' ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              Complete now <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </motion.div>

          {/* Jobs Applied */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
            style={{ border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, padding: 20, transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: theme === 'dark' ? 'transparent' : 'white' }}
            whileHover={{ y: -4, boxShadow: theme === 'dark' ? '0 12px 32px rgba(59,130,246,0.25)' : '0 12px 32px rgba(59,130,246,0.15)' }}>
            <p style={{ color: theme === 'dark' ? 'rgba(96,165,250,0.7)' : '#3b82f6', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Jobs Applied</p>
            <p style={{ fontSize: 32, fontWeight: 900, color: theme === 'dark' ? '#60a5fa' : '#2563eb', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 8px' }}>{stats.jobsApplied}</p>
            <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
              {[3, 5, 2, 7, 4, 6, stats.jobsApplied].map((h, i) => (
                <div key={i} style={{ flex: 1, height: 24, background: theme === 'dark' ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)', borderRadius: 3, display: 'flex', alignItems: 'flex-end' }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(h / 10) * 100}%` }} transition={{ delay: 0.5 + i * 0.05 }}
                    style={{ width: '100%', borderRadius: 3, background: theme === 'dark' ? 'rgba(96,165,250,0.8)' : '#3b82f6' }} />
                </div>
              ))}
            </div>
            {stats.jobsApplied === 0
              ? <Link to="/jobs" style={{ color: theme === 'dark' ? '#60a5fa' : '#3b82f6', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>Start applying <ArrowRight style={{ width: 12, height: 12 }} /></Link>
              : <Link to="/applications" style={{ color: theme === 'dark' ? '#60a5fa' : '#3b82f6', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>View all <ArrowRight style={{ width: 12, height: 12 }} /></Link>}
          </motion.div>

          {/* Career DNA */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
            style={{ border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: 20, transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: theme === 'dark' ? 'transparent' : 'white' }}
            whileHover={{ y: -4, boxShadow: theme === 'dark' ? '0 12px 32px rgba(124,58,237,0.3)' : '0 12px 32px rgba(124,58,237,0.15)' }}>
            <p style={{ color: theme === 'dark' ? 'rgba(167,139,250,0.7)' : '#7c3aed', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Career DNA</p>
            {profile?.career_dna?.results?.length > 0 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: theme === 'dark' ? '0 4px 12px rgba(124,58,237,0.4)' : 'none', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
                    <Brain style={{ width: 20, height: 20, color: 'white' }} />
                  </div>
                  <div>
                    <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: 700, fontSize: 13, margin: 0 }}>{profile.career_dna.results[0]?.career || 'Analyzed'}</p>
                    <span style={{ background: theme === 'dark' ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.1)', color: theme === 'dark' ? '#c4b5fd' : '#7c3aed', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>{profile.career_dna.results[0]?.match || 85}% match</span>
                  </div>
                </div>
                <Link to="/career-dna" style={{ color: theme === 'dark' ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>View results <ArrowRight style={{ width: 12, height: 12 }} /></Link>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: theme === 'dark' ? '0 0 16px rgba(124,58,237,0.5)' : 'none', background: theme === 'dark' ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)' }}>
                    <Brain style={{ width: 20, height: 20, color: theme === 'dark' ? 'white' : '#7c3aed' }} />
                  </motion.div>
                  <span style={{ background: theme === 'dark' ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)', color: theme === 'dark' ? '#c4b5fd' : '#7c3aed', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999 }}>Not taken yet</span>
                </div>
                <Link to="/career-dna" style={{ color: theme === 'dark' ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>Take now <ArrowRight style={{ width: 12, height: 12 }} /></Link>
              </>
            )}
          </motion.div>

          {/* Skill Gap */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
            style={{ border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, padding: 20, transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: theme === 'dark' ? 'transparent' : 'white' }}
            whileHover={{ y: -4, boxShadow: theme === 'dark' ? '0 12px 32px rgba(245,158,11,0.2)' : '0 12px 32px rgba(245,158,11,0.1)' }}>
            <p style={{ color: theme === 'dark' ? 'rgba(251,191,36,0.7)' : '#d97706', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Skill Progress</p>
            {skillProgress.total > 0 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ fontSize: 28, fontWeight: 900, color: theme === 'dark' ? '#fbbf24' : '#d97706', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>{skillProgress.completed}/{skillProgress.total}</p>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: theme === 'dark' ? '0 4px 12px rgba(245,158,11,0.4)' : 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    <BookOpen style={{ width: 20, height: 20, color: 'white' }} />
                  </div>
                </div>
                <div style={{ width: '100%', background: theme === 'dark' ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.1)', borderRadius: 999, height: 6, marginBottom: 6, overflow: 'hidden' }}>
                  <motion.div style={{ height: '100%', borderRadius: 999, background: theme === 'dark' ? '#fbbf24' : '#d97706' }}
                    initial={{ width: 0 }} animate={{ width: `${skillProgress.total > 0 ? Math.round((skillProgress.completed / skillProgress.total) * 100) : 0}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }} />
                </div>
                <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 11, marginBottom: 8 }}>{Math.round((skillProgress.completed / skillProgress.total) * 100)}% mastered</p>
                <Link to="/skill-gap" style={{ color: theme === 'dark' ? '#fbbf24' : '#d97706', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>Continue <ArrowRight style={{ width: 12, height: 12 }} /></Link>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: theme === 'dark' ? '0 4px 12px rgba(245,158,11,0.4)' : 'none', background: theme === 'dark' ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.05)' }}>
                    <Target style={{ width: 20, height: 20, color: theme === 'dark' ? 'white' : '#d97706' }} />
                  </div>
                  <span style={{ background: theme === 'dark' ? 'rgba(245,158,11,0.2)' : 'rgba(245,158,11,0.1)', color: theme === 'dark' ? '#fbbf24' : '#d97706', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999 }}>Analyze now</span>
                </div>
                <Link to="/skill-gap" style={{ color: theme === 'dark' ? '#fbbf24' : '#d97706', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>Get insights <ArrowRight style={{ width: 12, height: 12 }} /></Link>
              </>
            )}
          </motion.div>
        </div>

        {/* ── Career Roadmap ── */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
          style={{ border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24, padding: 28, marginBottom: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', background: theme === 'dark' ? 'transparent' : 'white' }}>
          <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 20, fontWeight: 800, margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Career Roadmap</h2>
          <p style={{ color: theme === 'dark' ? 'rgba(167,139,250,0.7)' : '#7c3aed', fontSize: 13, marginBottom: 24 }}>Based on your profile — here's what to do next</p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-0">
            {roadmap.map((step, i) => {
              const Icon = step.icon;
              const isActive = step.active && !step.done;
              return (
                <div key={i} className="flex md:flex-col items-center md:items-center flex-1 gap-3 md:gap-2">
                  <div className="flex md:flex-col items-center gap-2 md:gap-2 flex-1">
                    <Link to={step.locked ? '#' : step.link}
                      style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        background: step.done ? 'linear-gradient(135deg, #16a34a, #15803d)' : step.locked ? (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)') : isActive ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : (theme === 'dark' ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.05)'),
                        border: isActive ? '2px solid rgba(167,139,250,0.6)' : step.done ? '2px solid #4ade80' : (theme === 'dark' ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.05)'),
                        boxShadow: isActive ? '0 0 24px rgba(124,58,237,0.5)' : step.done ? '0 0 16px rgba(74,222,128,0.3)' : 'none',
                        cursor: step.locked ? 'not-allowed' : 'pointer', textDecoration: 'none' }}>
                      {isActive && <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                        style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2px solid rgba(124,58,237,0.4)' }} />}
                      {step.done ? <CheckCircle style={{ width: 24, height: 24, color: 'white' }} />
                        : step.locked ? <Lock style={{ width: 18, height: 18, color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8' }} />
                        : <Icon style={{ width: 24, height: 24, color: isActive ? 'white' : '#a78bfa' }} />}
                    </Link>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, fontWeight: 700, margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{step.label}</p>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                        background: step.done ? 'rgba(74,222,128,0.15)' : step.locked ? (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') : isActive ? 'rgba(124,58,237,0.25)' : (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                        color: step.done ? '#16a34a' : step.locked ? (theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8') : isActive ? (theme === 'dark' ? '#c4b5fd' : '#7c3aed') : (theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b') }}>
                        {step.done ? 'Done' : step.locked ? 'Locked' : isActive ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  {i < roadmap.length - 1 && (
                    <div className="hidden md:block h-px flex-1 mx-3" style={{ background: step.done ? 'rgba(124,58,237,0.5)' : (theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'), borderTop: step.done ? 'none' : (theme === 'dark' ? '1px dashed rgba(255,255,255,0.1)' : '1px dashed rgba(0,0,0,0.1)') }} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Quick Actions + Recommended Jobs ── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
            style={{ border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24, padding: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', background: theme === 'dark' ? 'transparent' : 'white' }}>
            <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: '0 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((a, i) => {
                const Icon = a.icon;
                return (
                  <Link key={i} to={a.link}
                    style={{ position: 'relative', padding: 16, borderRadius: 16, border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)', background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', textDecoration: 'none', display: 'block', transition: 'all 0.18s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(124,58,237,0.4)'; (e.currentTarget as HTMLElement).style.background = theme === 'dark' ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)'; (e.currentTarget as HTMLElement).style.background = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
                    {a.badge && <span style={{ position: 'absolute', top: 8, right: 8, background: '#7c3aed', color: 'white', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>{a.badge}</span>}
                    <div style={{ width: 42, height: 42, borderRadius: 12, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: theme === 'dark' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(124,58,237,0.2)' }}
                      className={`bg-gradient-to-br ${a.grad}`}>
                      <Icon style={{ width: 20, height: 20, color: 'white' }} />
                    </div>
                    <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, fontWeight: 700, margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{a.title}</p>
                    <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 11, margin: '0 0 8px' }}>{a.desc}</p>
                    <ArrowRight style={{ width: 14, height: 14, color: theme === 'dark' ? 'rgba(167,139,250,0.5)' : '#7c3aed' }} />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Recommended Jobs */}
          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible"
            style={{ border: '1px solid rgba(59,130,246,0.2)', borderRadius: 24, padding: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', background: theme === 'dark' ? 'transparent' : 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recommended For You</h2>
                <p style={{ color: 'rgba(96,165,250,0.6)', fontSize: 12, margin: '2px 0 0' }}>Based on your profile</p>
              </div>
              <Link to="/jobs" style={{ color: '#60a5fa', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>View all <ArrowRight style={{ width: 12, height: 12 }} /></Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {jobs.length > 0 ? jobs.map((job, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, border: theme === 'dark' ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.04)', background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(59,130,246,0.3)'; (e.currentTarget as HTMLElement).style.background = theme === 'dark' ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.04)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = theme === 'dark' ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.04)'; (e.currentTarget as HTMLElement).style.background = theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `hsl(${(i * 80 + 200) % 360}, 60%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                    {job.company?.charAt(0) || 'J'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</p>
                    <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, margin: '2px 0 0' }}><MapPin style={{ width: 10, height: 10 }} />{job.location || 'India'}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ background: theme === 'dark' ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.1)', color: theme === 'dark' ? '#c4b5fd' : '#7c3aed', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>{matchPcts[i] || 80}% match</span>
                    <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 11 }}>{job.salary_range || '4-8 LPA'}</span>
                  </div>
                </div>
              )) : [1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, border: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)', background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
                  <div style={{ width: 42, height: 42, background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderRadius: 12 }} />
                  <div style={{ flex: 1 }}><div style={{ height: 12, background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', borderRadius: 6, marginBottom: 8, width: '70%' }} /><div style={{ height: 10, background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 6, width: '50%' }} /></div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Career Insights ── */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible"
          style={{ border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24, padding: 28, marginBottom: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', background: theme === 'dark' ? 'transparent' : 'white' }}>
          <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 20, fontWeight: 800, margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Career Insights</h2>
          <p style={{ color: theme === 'dark' ? 'rgba(167,139,250,0.6)' : '#64748b', fontSize: 13, marginBottom: 20 }}>Trends in your field</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div style={{ background: theme === 'dark' ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(124,58,237,0.15)', borderRadius: 18, padding: 18 }}>
              <p style={{ color: theme === 'dark' ? '#a78bfa' : '#7c3aed', fontSize: 11, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}><TrendingUp style={{ width: 13, height: 13 }} /> Trending Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {careerInsights.skills.map((s, i) => (
                  <span key={i} style={{ background: theme === 'dark' ? 'rgba(124,58,237,0.2)' : 'white', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(124,58,237,0.2)', color: theme === 'dark' ? '#c4b5fd' : '#7c3aed', fontSize: 12, padding: '4px 12px', borderRadius: 999, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{ background: theme === 'dark' ? 'rgba(52,211,153,0.08)' : 'rgba(16,185,129,0.05)', border: theme === 'dark' ? '1px solid rgba(52,211,153,0.2)' : '1px solid rgba(16,185,129,0.15)', borderRadius: 18, padding: 18 }}>
              <p style={{ color: theme === 'dark' ? '#34d399' : '#059669', fontSize: 11, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}><Zap style={{ width: 13, height: 13 }} /> Average Salary</p>
              <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 28, fontWeight: 900, margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{careerInsights.salary}</p>
              <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12 }}>{careerInsights.salaryRange}</p>
            </div>
            <div style={{ background: theme === 'dark' ? 'rgba(96,165,250,0.08)' : 'rgba(59,130,246,0.05)', border: theme === 'dark' ? '1px solid rgba(96,165,250,0.2)' : '1px solid rgba(59,130,246,0.15)', borderRadius: 18, padding: 18 }}>
              <p style={{ color: theme === 'dark' ? '#60a5fa' : '#2563eb', fontSize: 11, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}><Bell style={{ width: 13, height: 13 }} /> Job Market</p>
              <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 22, fontWeight: 900, margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{careerInsights.openings} openings</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                  {[40, 55, 70].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: 32, background: theme === 'dark' ? 'rgba(96,165,250,0.1)' : 'rgba(59,130,246,0.1)', borderRadius: 6, display: 'flex', alignItems: 'flex-end' }}>
                      <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                        style={{ width: '100%', borderRadius: 6, background: theme === 'dark' ? 'rgba(96,165,250,0.5)' : 'rgba(59,130,246,0.5)' }} />
                    </div>
                  ))}
                </div>
                <span style={{ background: theme === 'dark' ? 'rgba(74,222,128,0.15)' : 'rgba(22,163,74,0.1)', color: theme === 'dark' ? '#4ade80' : '#16a34a', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>Growing</span>
              </div>
            </div>
          </div>
        </motion.div>
        {/* ── This Week's Goal ── */}
        <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible"
          style={{ border: '1px solid rgba(124,58,237,0.2)', borderLeft: '4px solid #7c3aed', borderRadius: 24, marginBottom: 24, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', background: theme === 'dark' ? 'transparent' : 'white' }}>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
            {/* Col 1: Focus */}
            <div style={{ padding: 24 }}>
              <p style={{ color: theme === 'dark' ? '#a78bfa' : '#7c3aed', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Your Focus This Week</p>
              <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 17, fontWeight: 800, margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Complete Your Profile</p>
              <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12, marginBottom: 12 }}>You're {pct}% done · {Math.max(0, Math.round((1 - pct / 100) * 8))} sections remaining</p>
              <div style={{ width: '100%', background: theme === 'dark' ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.1)', borderRadius: 999, height: 6, marginBottom: 16, overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }} />
              </div>
              <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: theme === 'dark' ? '#a78bfa' : '#7c3aed', textDecoration: 'none' }}>
                Continue <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>
            {/* Col 2: Streak */}
            <div style={{ padding: 24 }}>
              <p style={{ color: theme === 'dark' ? '#a78bfa' : '#7c3aed', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Streak</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Zap style={{ width: 32, height: 32, color: theme === 'dark' ? '#fbbf24' : '#d97706' }} />
                <div>
                  <span style={{ fontSize: 32, fontWeight: 900, color: theme === 'dark' ? 'white' : '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>1</span>
                  <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 14, marginLeft: 6 }}>day streak</span>
                </div>
              </div>
              <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 12, marginBottom: 16 }}>Come back tomorrow to keep it going!</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                  const today = new Date().getDay();
                  const dayIndex = i === 0 ? 1 : i === 6 ? 0 : i + 1;
                  const isToday = dayIndex === today;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: isToday ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : (theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'), border: isToday ? (theme === 'dark' ? '2px solid rgba(167,139,250,0.5)' : '2px solid rgba(124,58,237,0.3)') : (theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)'), display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isToday ? '0 0 12px rgba(124,58,237,0.4)' : 'none' }}>
                        {isToday && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                      </div>
                      <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 11 }}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Col 3: Quick Stat */}
            <div style={{ padding: 24 }}>
              <p style={{ color: theme === 'dark' ? '#a78bfa' : '#7c3aed', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Quick Stat</p>
              <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 13, marginBottom: 8 }}>Est. time to complete profile</p>
              <p style={{ fontSize: 36, fontWeight: 900, color: theme === 'dark' ? 'white' : '#0f172a', margin: '0 0 12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>~4 min</p>
              <p style={{ fontSize: 12, color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', background: theme === 'dark' ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)', borderRadius: 12, padding: '10px 14px', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(124,58,237,0.15)' }}>
                Students who complete their profile get <span style={{ fontWeight: 700, color: theme === 'dark' ? '#c4b5fd' : '#7c3aed' }}>5x more matches</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Explore by Field ── */}
        <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 20, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Explore Career Paths</h2>
            <p style={{ color: 'rgba(167,139,250,0.6)', fontSize: 13, margin: '4px 0 0' }}>Browse opportunities in every field</p>
          </div>
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { icon: <Cpu style={{ width: 14, height: 14 }} />, label: 'Engineering', jobs: '12,400', key: 'engineering' },
              { icon: <Heart style={{ width: 14, height: 14 }} />, label: 'Medical', jobs: '4,200', key: 'medical' },
              { icon: <Scale style={{ width: 14, height: 14 }} />, label: 'Law', jobs: '1,800', key: 'law' },
              { icon: <TrendingUp style={{ width: 14, height: 14 }} />, label: 'Commerce', jobs: '8,600', key: 'commerce' },
              { icon: <Palette style={{ width: 14, height: 14 }} />, label: 'Design', jobs: '3,100', key: 'design' },
              { icon: <Radio style={{ width: 14, height: 14 }} />, label: 'Mass Comm', jobs: '2,400', key: 'mass_comm' },
              { icon: <Atom style={{ width: 14, height: 14 }} />, label: 'Science', jobs: '1,600', key: 'science' },
              { icon: <Building style={{ width: 14, height: 14 }} />, label: 'Hotel Mgmt', jobs: '900', key: 'hotel' },
              { icon: <Leaf style={{ width: 14, height: 14 }} />, label: 'Agriculture', jobs: '1,200', key: 'agriculture' },
              { icon: <GraduationCap style={{ width: 14, height: 14 }} />, label: 'Education', jobs: '3,800', key: 'education' },
            ].map(field => {
              const isActive = fieldLower.includes(field.key) || fieldLower.includes(field.label.toLowerCase());
              return (
                <Link key={field.key} to={`/jobs?field=${field.key}`}
                  style={{
                    flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 999,
                    background: isActive ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'rgba(255,255,255,0.06)',
                    border: isActive ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(255,255,255,0.1)',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 4px 16px rgba(124,58,237,0.4)' : 'none',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.2)'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(124,58,237,0.4)'; } }}
                  onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.1)'; } }}>
                  <span style={{ color: isActive ? 'white' : '#a78bfa' }}>{field.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? 'white' : 'rgba(255,255,255,0.8)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{field.label}</span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)', color: isActive ? 'white' : 'rgba(148,163,184,0.6)', fontWeight: 600 }}>{field.jobs}</span>
                </Link>
              );
            })}
          </div>
          {/* fade hint on right edge */}
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 8, width: 60, pointerEvents: 'none' }} />
          </div>
        </motion.div>

        {/* ── Footer line ── */}
        <p className="text-center text-slate-400 text-xs py-4">Made with ❤️ in India</p>

      </div>
    </div>
  );
}
