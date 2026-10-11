import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Save, CheckCircle, Award, Target, TrendingUp, Zap, Star, Calendar, Link as LinkIcon, Github, Linkedin, Globe, Camera, Edit2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { profileAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../context/ThemeContext'

export default function Profile() {
  const { theme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    experience: '',
    education: '',
    github: '',
    linkedin: '',
    portfolio: '',
    achievements: '',
    languages: '',
    certifications: ''
  });
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        const p = res.data;
        setFormData({
          name: p.name || user?.name || '',
          email: p.email || user?.email || '',
          phone: p.phone || '',
          location: p.location || '',
          bio: p.bio || '',
          skills: Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || ''),
          experience: p.experience || '',
          education: p.education || '',
          github: p.github_url || '',
          linkedin: p.linkedin_url || '',
          portfolio: p.portfolio_url || '',
          achievements: '',
          languages: '',
          certifications: p.certifications || ''
        });
      } catch {
        setFormData(f => ({ ...f, name: user?.name || '', email: user?.email || '', github: '', linkedin: '', portfolio: '', achievements: '', languages: '', certifications: '' }));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Map frontend field names to backend field names
      const payload = {
        ...formData,
        linkedin_url: formData.linkedin,
        github_url: formData.github,
        portfolio_url: formData.portfolio,
        // Remove fields not supported by backend
        linkedin: undefined,
        github: undefined,
        portfolio: undefined,
        achievements: undefined,
        languages: undefined,
      };
      
      await profileAPI.updateProfile(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save profile. Make sure backend is running.');
    } finally {
      setSaving(false);
    }
  };

  const calculateCompletion = () => {
    const fields = Object.values(formData);
    const filled = fields.filter(f => f && String(f).trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 48, height: 48, border: '3px solid rgba(124,58,237,0.3)', borderTop: '3px solid #7c3aed', borderRadius: '50%', margin: '0 auto 16px' }} />
        <div style={{ color: '#a78bfa', fontSize: 18, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Loading profile...</div>
      </motion.div>
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <User className="w-4 h-4" /> },
    { id: 'professional', label: 'Professional', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
    { id: 'social', label: 'Social Links', icon: <LinkIcon className="w-4 h-4" /> },
  ];

  const completion = calculateCompletion();

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
    border: '1px solid rgba(124,58,237,0.25)',
    borderRadius: 12, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', color: 'rgba(167,139,250,0.8)',
    fontSize: 13, fontWeight: 600, marginBottom: 8,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  const sectionStyle: React.CSSProperties = {
    border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: 20, padding: 24,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  };

  return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      {/* bg blobs */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(91,33,182,0.12), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header card */}
        <div style={{ borderRadius: 24, padding: '32px 32px 28px', marginBottom: 24, position: 'relative', overflow: 'hidden', boxShadow: '0 12px 40px rgba(124,58,237,0.4)' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User style={{ width: 24, height: 24, color: theme === 'dark' ? 'white' : '#0f172a' }} />
              </div>
              <div>
                <h1 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 28, fontWeight: 900, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>Your Profile</h1>
                <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 13, margin: 0 }}>Complete your profile to get better job matches</p>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600 }}>Profile Completion</span>
                <span style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, fontWeight: 800 }}>{completion}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'white', borderRadius: 999, width: `${completion}%`, transition: 'width 0.5s ease', boxShadow: '0 0 12px rgba(255,255,255,0.5)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Success Popup Modal */}
        <AnimatePresence>
          {saved && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(8px)', zIndex: 999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onClick={() => setSaved(false)}
              >
                {/* Modal */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  onClick={e => e.stopPropagation()}
                  style={{
                    border: '1px solid rgba(74,222,128,0.3)',
                    borderRadius: 24, padding: 40, maxWidth: 420, width: '90%',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.2)',
                    position: 'relative', overflow: 'hidden'
                  }}
                >
                  {/* Animated background circles */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      position: 'absolute', top: -50, right: -50,
                      width: 200, height: 200,
                      background: 'radial-gradient(circle, rgba(74,222,128,0.2), transparent 70%)',
                      borderRadius: '50%', filter: 'blur(40px)'
                    }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{
                      position: 'absolute', bottom: -40, left: -40,
                      width: 180, height: 180,
                      background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)',
                      borderRadius: '50%', filter: 'blur(40px)'
                    }}
                  />

                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    {/* Success Icon with animation */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                      style={{
                        width: 80, height: 80, margin: '0 auto 20px',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(74,222,128,0.4), inset 0 2px 0 rgba(255,255,255,0.3)'
                      }}
                    >
                      <CheckCircle style={{ width: 40, height: 40, color: theme === 'dark' ? 'white' : '#0f172a' }} />
                    </motion.div>

                    {/* Confetti particles */}
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: [0, (Math.random() - 0.5) * 200],
                          y: [0, -Math.random() * 150 - 50],
                          opacity: [1, 1, 0]
                        }}
                        transition={{ duration: 1.2, delay: i * 0.05 }}
                        style={{
                          position: 'absolute',
                          top: '50%', left: '50%',
                          width: 8, height: 8,
                          background: ['#4ade80', '#7c3aed', '#60a5fa', '#f59e0b'][i % 4],
                          borderRadius: '50%',
                          pointerEvents: 'none'
                        }}
                      />
                    ))}

                    {/* Text */}
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      style={{
                        color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 28, fontWeight: 900, margin: '0 0 12px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      Profile Saved! 🎉
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{
                        color: 'rgba(167,139,250,0.8)', fontSize: 15, margin: '0 0 28px',
                        lineHeight: 1.6
                      }}
                    >
                      Your profile has been updated successfully. You're one step closer to your dream career!
                    </motion.p>

                    {/* Close button */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(74,222,128,0.4)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSaved(false)}
                      style={{
                        color: theme === 'dark' ? 'white' : '#0f172a', border: 'none', borderRadius: 12,
                        padding: '12px 32px', fontSize: 15, fontWeight: 700,
                        cursor: 'pointer', boxShadow: '0 4px 16px rgba(74,222,128,0.3)',
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    >
                      Awesome!
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Tabs */}
          <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <motion.button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1, minWidth: 120, padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'rgba(167,139,250,0.7)',
                  fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.2s', boxShadow: activeTab === tab.id ? '0 4px 12px rgba(124,58,237,0.4)' : 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <motion.div key="basic" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <div style={sectionStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}>
                      <User style={{ width: 18, height: 18, color: theme === 'dark' ? 'white' : '#0f172a' }} />
                    </div>
                    <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Basic Information</h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange}
                        style={inputStyle} placeholder="John Doe"
                        onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input type="email" name="email" value={formData.email}
                        style={{ ...inputStyle, background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)', color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', cursor: 'not-allowed' }} disabled />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        style={inputStyle} placeholder="+91 98765 43210"
                        onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                    </div>
                    <div>
                      <label style={labelStyle}>Location</label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange}
                        style={inputStyle} placeholder="Mumbai, India"
                        onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={{ ...labelStyle, fontSize: 15, marginBottom: 12 }}>Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
                      placeholder="Tell us about yourself..."
                      onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={{ ...labelStyle, fontSize: 15, marginBottom: 12 }}>Skills <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontWeight: 400 }}>(comma separated)</span></label>
                    <input type="text" name="skills" value={formData.skills} onChange={handleChange}
                      style={inputStyle} placeholder="React, Node.js, Python, SQL"
                      onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={{ ...labelStyle, fontSize: 15, marginBottom: 12 }}>Languages <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontWeight: 400 }}>(comma separated)</span></label>
                    <input type="text" name="languages" value={formData.languages} onChange={handleChange}
                      style={inputStyle} placeholder="English, Hindi, Gujarati"
                      onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Professional Tab */}
            {activeTab === 'professional' && (
              <motion.div key="professional" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <div style={sectionStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(96,165,250,0.4)' }}>
                      <Briefcase style={{ width: 18, height: 18, color: theme === 'dark' ? 'white' : '#0f172a' }} />
                    </div>
                    <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Professional Details</h2>
                  </div>
                  <div>
                    <label style={{ ...labelStyle, color: '#60a5fa' }}>Experience</label>
                    <textarea name="experience" value={formData.experience} onChange={handleChange} rows={4}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder="Software Engineer at XYZ Company (2020-2023)&#10;• Led team of 5 developers&#10;• Built scalable microservices"
                      onFocus={e => (e.target.style.borderColor = 'rgba(96,165,250,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={{ ...labelStyle, color: '#34d399' }}>Education</label>
                    <textarea name="education" value={formData.education} onChange={handleChange} rows={4}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder="B.Tech in Computer Science, ABC University (2016-2020)&#10;CGPA: 8.5/10"
                      onFocus={e => (e.target.style.borderColor = 'rgba(52,211,153,0.4)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={{ ...labelStyle, color: '#f59e0b' }}>Certifications</label>
                    <textarea name="certifications" value={formData.certifications} onChange={handleChange} rows={3}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder="AWS Certified Solutions Architect&#10;Google Cloud Professional&#10;MongoDB Certified Developer"
                      onFocus={e => (e.target.style.borderColor = 'rgba(245,158,11,0.4)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <motion.div key="achievements" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <div style={sectionStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}>
                      <Award style={{ width: 18, height: 18, color: theme === 'dark' ? 'white' : '#0f172a' }} />
                    </div>
                    <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Achievements & Awards</h2>
                  </div>
                  <textarea name="achievements" value={formData.achievements} onChange={handleChange} rows={6}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    placeholder="🏆 Winner of National Hackathon 2023&#10;🥇 First Prize in College Tech Fest&#10;📜 Published research paper in IEEE&#10;⭐ Top contributor on GitHub (500+ stars)"
                    onFocus={e => (e.target.style.borderColor = 'rgba(245,158,11,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                  
                  {/* Quick Stats */}
                  <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    <motion.div whileHover={{ y: -2 }} style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                      <Target style={{ width: 24, height: 24, color: '#7c3aed', margin: '0 auto 8px' }} />
                      <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 20, fontWeight: 800 }}>{completion}%</div>
                      <div style={{ color: 'rgba(167,139,250,0.7)', fontSize: 12 }}>Profile Complete</div>
                    </motion.div>
                    <motion.div whileHover={{ y: -2 }} style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                      <TrendingUp style={{ width: 24, height: 24, color: '#60a5fa', margin: '0 auto 8px' }} />
                      <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 20, fontWeight: 800 }}>Pro</div>
                      <div style={{ color: 'rgba(96,165,250,0.7)', fontSize: 12 }}>Account Type</div>
                    </motion.div>
                    <motion.div whileHover={{ y: -2 }} style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                      <Zap style={{ width: 24, height: 24, color: '#34d399', margin: '0 auto 8px' }} />
                      <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 20, fontWeight: 800 }}>Active</div>
                      <div style={{ color: 'rgba(52,211,153,0.7)', fontSize: 12 }}>Status</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Social Links Tab */}
            {activeTab === 'social' && (
              <motion.div key="social" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <div style={sectionStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(236,72,153,0.4)' }}>
                      <LinkIcon style={{ width: 18, height: 18, color: theme === 'dark' ? 'white' : '#0f172a' }} />
                    </div>
                    <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Social Links</h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Github className="w-4 h-4" />
                          GitHub Profile
                        </div>
                      </label>
                      <input type="url" name="github" value={formData.github} onChange={handleChange}
                        style={inputStyle} placeholder="https://github.com/yourusername"
                        onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                    </div>
                    <div>
                      <label style={labelStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Linkedin className="w-4 h-4" />
                          LinkedIn Profile
                        </div>
                      </label>
                      <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange}
                        style={inputStyle} placeholder="https://linkedin.com/in/yourusername"
                        onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                    </div>
                    <div>
                      <label style={labelStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Globe className="w-4 h-4" />
                          Portfolio Website
                        </div>
                      </label>
                      <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange}
                        style={inputStyle} placeholder="https://yourportfolio.com"
                        onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.25)')} />
                    </div>
                  </div>

                  {/* Social Preview Cards */}
                  {(formData.github || formData.linkedin || formData.portfolio) && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ color: 'rgba(167,139,250,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Your Links Preview</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {formData.github && (
                          <motion.a href={formData.github} target="_blank" rel="noopener noreferrer" whileHover={{ y: -2, scale: 1.02 }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.08)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.08)', borderRadius: 10, color: theme === 'dark' ? 'white' : '#0f172a', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                            <Github className="w-4 h-4" />
                            GitHub
                          </motion.a>
                        )}
                        {formData.linkedin && (
                          <motion.a href={formData.linkedin} target="_blank" rel="noopener noreferrer" whileHover={{ y: -2, scale: 1.02 }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(14,118,168,0.2)', border: '1px solid rgba(14,118,168,0.4)', borderRadius: 10, color: '#60a5fa', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                          </motion.a>
                        )}
                        {formData.portfolio && (
                          <motion.a href={formData.portfolio} target="_blank" rel="noopener noreferrer" whileHover={{ y: -2, scale: 1.02 }}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 10, color: '#a78bfa', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                            <Globe className="w-4 h-4" />
                            Portfolio
                          </motion.a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button type="submit" disabled={saving} whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: saving ? 1 : 0.98 }}
            style={{ width: '100%', color: theme === 'dark' ? 'white' : '#0f172a', padding: '16px', borderRadius: 14, fontWeight: 800, fontSize: 15, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 24px rgba(124,58,237,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: saving ? 0.7 : 1, transition: 'all 0.15s' }}>
            {saving ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }} />
                Saving...
              </>
            ) : (
              <>
                <Sparkles style={{ width: 18, height: 18 }} />
                Save Profile
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
