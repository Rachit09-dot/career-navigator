import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const faqs = [
  {
    q: 'Is CareerNavigator completely free?',
    a: 'Yes, 100% free. No hidden charges, no credit card required. All core features including Career DNA, Skill Gap analysis, and Job Matching are free forever.',
  },
  {
    q: 'How does the Career DNA test work?',
    a: 'You answer 10 carefully designed questions about your interests, strengths, and work style. Our AI maps your responses to 60+ personality types and recommends the best-fit career paths for you.',
  },
  {
    q: 'Which fields does CareerNavigator support?',
    a: 'We support 18+ fields including Engineering (CSE, ECE, ME, CE), Medical, Law, Commerce, Arts, Management, and more. Each field has a personalized roadmap.',
  },
  {
    q: 'How accurate is the job matching?',
    a: 'Our AI achieves 95% match accuracy by analyzing your skills, field, location preference, and career goals against 1M+ live job listings from 50+ platforms.',
  },
  {
    q: 'Can I track my job applications?',
    a: 'Yes. The Application Tracker lets you log every job you apply to, set follow-up reminders, and track status — all in one place. Never lose a lead again.',
  },
  {
    q: 'Does it help with resume building?',
    a: 'Absolutely. The Resume AI Bullets feature generates powerful, ATS-optimized bullet points for your experience sections based on your role and skills.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const { theme } = useTheme();

  return (
    <section style={{ padding: '100px 24px', position: 'relative' }}>
      {/* bg glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.07), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
            Got Questions?
          </span>
          <h2 style={{
            color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 900, margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-0.5px',
          }}>
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              style={{
                borderRadius: 16,
                border: open === i
                  ? '1px solid rgba(167,139,250,0.35)'
                  : (theme === 'dark' ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)'),
                background: open === i
                  ? (theme === 'dark' ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.04)')
                  : (theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'),
                overflow: 'hidden',
                transition: 'border-color 0.3s, background 0.3s',
                boxShadow: open === i ? '0 0 30px rgba(124,58,237,0.1)' : 'none',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', padding: '20px 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', gap: 16,
                }}
              >
                <span style={{
                  color: open === i ? '#a78bfa' : (theme === 'dark' ? 'rgba(255,255,255,0.85)' : '#1e293b'),
                  fontWeight: 600, fontSize: 15,
                  fontFamily: "'Inter', sans-serif",
                  transition: 'color 0.3s',
                }}>
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ flexShrink: 0 }}
                >
                  <ChevronDown style={{
                    width: 18, height: 18,
                    color: open === i ? '#a78bfa' : 'rgba(148,163,184,0.5)',
                  }} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      padding: '0 24px 20px',
                      color: theme === 'dark' ? 'rgba(148,163,184,0.8)' : '#475569',
                      fontSize: 14, lineHeight: 1.7,
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
