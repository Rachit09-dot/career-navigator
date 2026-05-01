const row1 = [
  { emoji: '🎯', value: '18+', label: 'Career Fields' },
  { emoji: '💼', value: '50+', label: 'Job Platforms' },
  { emoji: '🧠', value: 'AI-Powered', label: 'Matching' },
  { emoji: '✅', value: '10,000+', label: 'Students Placed' },
  { emoji: '🚀', value: '60+', label: 'Personality Types' },
  { emoji: '⭐', value: '4.9/5', label: 'Rating' },
  { emoji: '🏆', value: '100%', label: 'Free to Use' },
  { emoji: '📊', value: '95%', label: 'Match Accuracy' },
];

const row2 = [
  { emoji: '🔥', value: '3x', label: 'Faster Job Search' },
  { emoji: '💡', value: '200+', label: 'Skill Paths' },
  { emoji: '🎓', value: '18+', label: 'Study Fields' },
  { emoji: '🌐', value: 'Pan India', label: 'Coverage' },
  { emoji: '⚡', value: '2 Min', label: 'Profile Setup' },
  { emoji: '🤖', value: 'GPT-4', label: 'AI Engine' },
  { emoji: '📈', value: '85%', label: 'Placement Rate' },
  { emoji: '🎯', value: '1M+', label: 'Job Listings' },
];

import { useTheme } from '../context/ThemeContext';

function MarqueeRow({ items, reverse = false, theme }: { items: typeof row1; reverse?: boolean, theme: string }) {
  const doubled = [...items, ...items, ...items];
  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          gap: 14,
          width: 'max-content',
          animation: `${reverse ? 'marqueeReverse' : 'marquee'} 28s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="marquee-pill"
          >
            <span style={{ fontSize: 18 }}>{item.emoji}</span>
            <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 14 }}>{item.value}</span>
            <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#64748b', fontSize: 12 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StatsMarquee() {
  const { theme } = useTheme();
  return (
    <div style={{ position: 'relative', padding: '36px 0', overflow: 'hidden' }}>
      {/* top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.5), rgba(96,165,250,0.5), transparent)',
      }} />

      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.15em',
          color: theme === 'dark' ? 'rgba(167,139,250,0.6)' : '#7c3aed', textTransform: 'uppercase',
        }}>
          Trusted by students across India
        </span>
      </div>

      <MarqueeRow items={row1} theme={theme} />
      <div style={{ height: 12 }} />
      <MarqueeRow items={row2} reverse theme={theme} />

      {/* left fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 100,
        background: theme === 'dark' ? 'linear-gradient(90deg, #0b071a, transparent)' : 'linear-gradient(90deg, #f8fafc, transparent)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      {/* right fade */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 100,
        background: theme === 'dark' ? 'linear-gradient(-90deg, #0b071a, transparent)' : 'linear-gradient(-90deg, #f8fafc, transparent)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* bottom glow line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.5), rgba(167,139,250,0.5), transparent)',
      }} />

      <style>{`
        .marquee-pill {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 18px; border-radius: 50px; flex-shrink: 0;
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(167,139,250,0.2);
          backdrop-filter: blur(8px); white-space: nowrap;
          transition: all 0.3s ease; cursor: default;
        }
        .marquee-pill:hover {
          background: rgba(124,58,237,0.25);
          border-color: rgba(167,139,250,0.5);
          box-shadow: 0 0 22px rgba(124,58,237,0.35);
          transform: scale(1.06);
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes marqueeReverse {
          from { transform: translateX(-33.333%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
