import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff, Brain, Target, Briefcase, TrendingUp, Compass, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../context/ThemeContext';

const perks = [
  { icon: Brain, color: '#a78bfa', label: 'Career DNA Analysis', desc: 'Your personalized career map' },
  { icon: Target, color: '#60a5fa', label: 'Skill Gap Tracker', desc: 'See exactly what to learn' },
  { icon: Briefcase, color: '#34d399', label: 'Smart Job Matching', desc: '50+ platforms pre-searched' },
  { icon: TrendingUp, color: '#fbbf24', label: 'AI Resume Bullets', desc: 'Gemini-powered suggestions' },
];

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const inputStyle = {
    width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
    background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.25)' : '1px solid rgba(124,58,237,0.4)',
    borderRadius: 12, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Left — Form */}
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', position: 'relative', zIndex: 1 }}>

        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(124,58,237,0.4)', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
              <Compass style={{ width: 20, height: 20, color: theme === 'dark' ? 'white' : '#0f172a' }} />
            </div>
            <span style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800 }}>CareerNavigator</span>
          </Link>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 28, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Welcome Back</h1>
            <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.7)' : '#64748b', fontSize: 14, margin: 0 }}>Continue your journey to success</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#475569', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(167,139,250,0.5)' }} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" style={inputStyle} />
              </div>
              {errors.email && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#475569', fontSize: 13, fontWeight: 600 }}>Password</label>
                <Link to="/forgot-password" style={{ color: '#a78bfa', fontSize: 12, textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(167,139,250,0.5)' }} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(167,139,250,0.5)', padding: 0 }}>
                  {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
            </div>

            {/* Remember me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="remember" style={{ width: 14, height: 14, accentColor: '#7c3aed' }} />
              <label htmlFor="remember" style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12 }}>Remember me for 30 days</label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: theme === 'dark' ? 'white' : '#0f172a', padding: '13px 24px', borderRadius: 12, fontWeight: 800, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Signing In...</>
              ) : (
                <><LogIn style={{ width: 16, height: 16 }} /> Sign In</>
              )}
            </button>
          </form>

          <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
          </p>

          <p style={{ textAlign: 'center', marginTop: 12 }}>
            <Link to="/" style={{ color: 'rgba(148,163,184,0.4)', fontSize: 12, textDecoration: 'none' }}>← Back to Home</Link>
          </p>
        </div>
      </motion.div>

      {/* Right — Dark premium panel */}
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ flex: 1, borderLeft: theme === 'dark' ? '1px solid rgba(124,58,237,0.15)' : '1px solid rgba(124,58,237,0.1)', padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: theme === 'dark' ? 'transparent' : 'rgba(124,58,237,0.02)' }}>

        <motion.div animate={{ x: [-20, 20, -20], y: [-15, 15, -15] }} transition={{ duration: 14, repeat: Infinity }}
          style={{ position: 'absolute', top: '-5%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <motion.div animate={{ x: [15, -15, 15], y: [10, -10, 10] }} transition={{ duration: 10, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '-5%', left: '-5%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(96,165,250,0.12), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
          <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            Your career dashboard
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: theme === 'dark' ? 'linear-gradient(135deg, #c4b5fd, #a78bfa, #7c3aed)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
              is waiting for you
            </span>
          </h2>
          <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#475569', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
            Pick up right where you left off. Your skill gaps, job matches, and career roadmap are all ready.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
            {perks.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = `${p.color}14`;
                    (e.currentTarget as HTMLElement).style.border = `1px solid ${p.color}50`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${p.color}25, 0 0 40px ${p.color}10`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = `${p.color}08`;
                    (e.currentTarget as HTMLElement).style.border = `1px solid ${p.color}20`;
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, background: `${p.color}08`, border: `1px solid ${p.color}20`, borderRadius: 14, padding: '12px 16px', cursor: 'default', transition: 'all 0.2s ease' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${p.color}18`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: 18, height: 18, color: p.color }} />
                  </div>
                  <div>
                    <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, fontWeight: 700 }}>{p.label}</div>
                    <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.55)' : '#64748b', fontSize: 12 }}>{p.desc}</div>
                  </div>
                  <CheckCircle style={{ width: 14, height: 14, color: p.color, marginLeft: 'auto', flexShrink: 0 }} />
                </motion.div>
              );
            })}
          </div>

          {/* CTA to register */}
          <div style={{ background: theme === 'dark' ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(124,58,237,0.1)', borderRadius: 16, padding: '20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, fontWeight: 700, marginBottom: 2 }}>New here?</div>
              <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 12 }}>Create a free account in 30 seconds</div>
            </div>
            <Link to="/register" style={{ display: 'flex', alignItems: 'center', gap: 6, color: theme === 'dark' ? 'white' : '#0f172a', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', padding: '10px 16px', borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}>
              Sign Up Free <ArrowRight style={{ width: 13, height: 13 }} />
            </Link>
          </div>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input::placeholder { color: rgba(148,163,184,0.4); } input:focus { border-color: rgba(124,58,237,0.6) !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }`}</style>
    </div>
  );
}
