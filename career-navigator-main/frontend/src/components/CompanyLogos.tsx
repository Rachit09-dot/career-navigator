const companies = [
  { name: 'Google', color: '#4285F4' },
  { name: 'Microsoft', color: '#00A4EF' },
  { name: 'Amazon', color: '#FF9900' },
  { name: 'TCS', color: '#a78bfa' },
  { name: 'Infosys', color: '#007CC3' },
  { name: 'Wipro', color: '#34d399' },
  { name: 'Deloitte', color: '#86BC25' },
  { name: 'Accenture', color: '#A100FF' },
  { name: 'IBM', color: '#1F70C1' },
  { name: 'Cognizant', color: '#1A6496' },
  { name: 'HCL', color: '#f472b6' },
  { name: 'Capgemini', color: '#0070AD' },
];

import { useTheme } from '../context/ThemeContext';

const doubled = [...companies, ...companies, ...companies];

export default function CompanyLogos() {
  const { theme } = useTheme();
  return (
    <div style={{ padding: '60px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{
          fontSize: 13, color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#64748b',
          fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          Our students work at
        </p>
      </div>

      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={{
          display: 'flex', gap: 20, width: 'max-content',
          animation: 'logoScroll 35s linear infinite',
        }}>
          {doubled.map((c, i) => (
            <div
              key={i}
              style={{
                padding: '12px 28px',
                borderRadius: 12,
                background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, minWidth: 120,
                transition: 'all 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.background = `${c.color}15`;
                el.style.borderColor = `${c.color}40`;
                el.style.boxShadow = `0 0 20px ${c.color}20`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.background = theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
                el.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
                el.style.boxShadow = 'none';
              }}
            >
              <span style={{
                fontSize: 15, fontWeight: 700,
                color: c.color,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '-0.3px',
              }}>
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* fades */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 80,
        background: theme === 'dark' ? 'linear-gradient(90deg, #0b071a, transparent)' : 'linear-gradient(90deg, #f8fafc, transparent)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 80,
        background: theme === 'dark' ? 'linear-gradient(-90deg, #0b071a, transparent)' : 'linear-gradient(-90deg, #f8fafc, transparent)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      <style>{`
        @keyframes logoScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
