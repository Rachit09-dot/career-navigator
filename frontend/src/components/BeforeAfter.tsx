import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const before = [
  'Randomly applying to 100s of jobs',
  'No idea which skills to learn next',
  'Resume gets rejected by ATS',
  'Confused about which career to choose',
  'Manually tracking applications in Excel',
  'Wasting months on wrong preparation',
];

const after = [
  'AI matches you to top 10 perfect roles',
  'Exact skill gap roadmap in minutes',
  'AI-optimized resume bullets that get noticed',
  'Career DNA reveals your ideal path',
  'Auto-track every application in one place',
  'Focused 30-day plan to land your dream job',
];

export default function BeforeAfter() {
  const { theme } = useTheme();
  return (
    <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* bg glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 400,
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.07), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.15em',
            color: theme === 'dark' ? 'rgba(167,139,250,0.7)' : '#7c3aed', textTransform: 'uppercase',
            display: 'block', marginBottom: 12,
          }}>
            The Difference
          </span>
          <h2 style={{
            color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 900, margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-0.5px',
          }}>
            Life{' '}
            <span style={{ color: '#f87171' }}>Before</span>
            {' '}vs{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa, #34d399)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>After</span>
            {' '}CareerNavigator
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
          className="grid-cols-1 md:grid-cols-2">

          {/* BEFORE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              borderRadius: 24,
              background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.2)',
              padding: '32px 28px',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: 'linear-gradient(90deg, #ef4444, #f87171)',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X style={{ width: 18, height: 18, color: '#f87171' }} />
              </div>
              <span style={{
                color: '#f87171', fontWeight: 800, fontSize: 18,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                Without CareerNavigator
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {before.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <X style={{ width: 10, height: 10, color: '#f87171' }} />
                  </div>
                  <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.7)' : '#475569', fontSize: 14, lineHeight: 1.5 }}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AFTER */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              borderRadius: 24,
              background: 'rgba(52,211,153,0.05)',
              border: '1px solid rgba(52,211,153,0.2)',
              padding: '32px 28px',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 0 40px rgba(52,211,153,0.05)',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: 'linear-gradient(90deg, #34d399, #a78bfa)',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(52,211,153,0.15)',
                border: '1px solid rgba(52,211,153,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check style={{ width: 18, height: 18, color: '#34d399' }} />
              </div>
              <span style={{
                color: '#34d399', fontWeight: 800, fontSize: 18,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                With CareerNavigator
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {after.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: 'rgba(52,211,153,0.15)',
                    border: '1px solid rgba(52,211,153,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check style={{ width: 10, height: 10, color: '#34d399' }} />
                  </div>
                  <span style={{ color: theme === 'dark' ? 'rgba(226,232,240,0.85)' : '#334155', fontSize: 14, lineHeight: 1.5 }}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
