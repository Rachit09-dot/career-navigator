import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Brain, Target, Briefcase, TrendingUp, Shield, CheckCircle, Compass, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../context/ThemeContext';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  if (password.length >= 12) score++;
  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' };
  if (score <= 2) return { score, label: 'Fair', color: '#f59e0b' };
  if (score <= 3) return { score, label: 'Good', color: '#60a5fa' };
  return { score, label: 'Strong', color: '#34d399' };
}

const perks = [
  { icon: Brain, color: '#a78bfa', label: 'Career DNA Analysis', desc: 'Discover your perfect career path' },
  { icon: Target, color: '#60a5fa', label: 'Skill Gap Tracker', desc: 'Know exactly what to learn next' },
  { icon: Briefcase, color: '#34d399', label: '50+ Job Platforms', desc: 'All pre-searched for your role' },
  { icon: TrendingUp, color: '#fbbf24', label: 'AI Resume Bullets', desc: 'Powered by Gemini AI' },
  { icon: Shield, color: '#f472b6', label: 'Application Tracker', desc: 'Never lose a lead again' },
];

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Min 8 characters required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name: formData.name, email: formData.email, password: formData.password });
      if (response.data?.token) {
        login(response.data.user, response.data.token);
        navigate('/onboarding');
      } else {
        navigate('/login');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
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

        {/* Dot grid */}
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
            <h1 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 28, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Create Account</h1>
            <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.7)' : '#64748b', fontSize: 14, margin: 0 }}>Start your career journey today — it's free</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name */}
            <div>
              <label style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#475569', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(167,139,250,0.5)' }} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" style={inputStyle} />
              </div>
              {errors.name && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
            </div>

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
              <label style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#475569', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(167,139,250,0.5)' }} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 characters" style={{ ...inputStyle, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(167,139,250,0.5)', padding: 0 }}>
                  {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
              {formData.password && (() => {
                const s = getPasswordStrength(formData.password);
                return (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{ height: 3, flex: 1, borderRadius: 999, background: i <= s.score ? s.color : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                      ))}
                    </div>
                    <p style={{ color: s.color, fontSize: 11, fontWeight: 600 }}>Strength: {s.label}</p>
                  </div>
                );
              })()}
              {errors.password && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#475569', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(167,139,250,0.5)' }} />
                <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" style={inputStyle} />
              </div>
              {errors.confirmPassword && <p style={{ color: '#f87171', fontSize: 12, marginTop: 4 }}>{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="terms" required style={{ width: 14, height: 14, accentColor: '#7c3aed' }} />
              <label htmlFor="terms" style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.7)' : '#64748b', fontSize: 12 }}>
                I agree to the <Link to="/terms" style={{ color: '#a78bfa', textDecoration: 'none' }}>Terms</Link> and <Link to="/privacy" style={{ color: '#a78bfa', textDecoration: 'none' }}>Privacy Policy</Link>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: theme === 'dark' ? 'white' : '#0f172a', padding: '13px 24px', borderRadius: 12, fontWeight: 800, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Creating Account...</>
              ) : (
                <><UserPlus style={{ width: 16, height: 16 }} /> Create Account</>
              )}
            </button>
          </form>

          <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 13, textAlign: 'center', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </motion.div>

      {/* Right — Dark premium panel */}
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ flex: 1, borderLeft: theme === 'dark' ? '1px solid rgba(124,58,237,0.15)' : '1px solid rgba(124,58,237,0.1)', padding: '60px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: theme === 'dark' ? 'transparent' : 'rgba(124,58,237,0.02)' }}>

        {/* Blobs */}
        <motion.div animate={{ x: [-20, 20, -20], y: [-15, 15, -15] }} transition={{ duration: 14, repeat: Infinity }}
          style={{ position: 'absolute', top: '-5%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <motion.div animate={{ x: [15, -15, 15], y: [10, -10, 10] }} transition={{ duration: 10, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '-5%', left: '-5%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(96,165,250,0.12), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 440 }}>
          <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            Everything you need to
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: theme === 'dark' ? 'linear-gradient(135deg, #c4b5fd, #a78bfa, #7c3aed)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}>
              land your dream job
            </span>
          </h2>
          <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#475569', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
            Join students across 18+ fields who are using CareerNavigator to discover their path, close skill gaps, and get hired.
          </p>

          {/* Feature list */}
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

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { val: '18+', label: 'Career Fields' },
              { val: '50+', label: 'Job Platforms' },
              { val: '100%', label: 'Free to Use' },
            ].map((s, i) => (
              <div key={i} style={{ background: theme === 'dark' ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.04)', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.15)' : '1px solid rgba(124,58,237,0.1)', borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
                <div style={{ color: theme === 'dark' ? '#a78bfa' : '#7c3aed', fontSize: 22, fontWeight: 900 }}>{s.val}</div>
                <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.55)' : '#64748b', fontSize: 11 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } input::placeholder { color: rgba(148,163,184,0.4); } input:focus { border-color: rgba(124,58,237,0.6) !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }`}</style>
    </div>
  );
}
