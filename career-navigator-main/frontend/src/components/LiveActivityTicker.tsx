import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext'

const activities = [
  { name: 'Rahul S.', city: 'Delhi', action: 'matched with', role: 'Software Engineer at TCS', color: '#34d399' },
  { name: 'Priya M.', city: 'Mumbai', action: 'completed', role: 'Career DNA Test', color: '#a78bfa' },
  { name: 'Amit K.', city: 'Bangalore', action: 'got 94% match for', role: 'Data Analyst role', color: '#60a5fa' },
  { name: 'Sneha R.', city: 'Pune', action: 'started applying to', role: '12 jobs today', color: '#fbbf24' },
  { name: 'Vikram T.', city: 'Hyderabad', action: 'closed skill gap in', role: 'React & Node.js', color: '#f472b6' },
  { name: 'Ananya P.', city: 'Chennai', action: 'matched with', role: 'Product Manager at Startup', color: '#34d399' },
  { name: 'Rohan G.', city: 'Kolkata', action: 'completed', role: 'Resume AI Builder', color: '#a78bfa' },
  { name: 'Divya N.', city: 'Jaipur', action: 'got 98% match for', role: 'UI/UX Designer role', color: '#60a5fa' },
];

export default function LiveActivityTicker() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % activities.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const item = activities[current];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '10px 24px', gap: 10,
      background: 'rgba(52,211,153,0.05)',
      borderTop: '1px solid rgba(52,211,153,0.1)',
      borderBottom: '1px solid rgba(52,211,153,0.1)',
    }}>
      {/* Pulsing dot */}
      <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#34d399',
          boxShadow: '0 0 8px #34d399',
        }} />
        <div style={{
          position: 'absolute', inset: -3, borderRadius: '50%',
          border: '1px solid rgba(52,211,153,0.4)',
          animation: 'ping 1.5s ease-out infinite',
        }} />
      </div>

      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'all 0.35s ease',
        fontSize: 13, color: 'rgba(255,255,255,0.75)',
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <span style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: 600 }}>{item.name}</span>
        <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 11 }}>from {item.city}</span>
        <span>{item.action}</span>
        <span style={{ color: item.color, fontWeight: 600 }}>{item.role}</span>
      </div>

      <div style={{
        marginLeft: 8, fontSize: 11, color: 'rgba(148,163,184,0.4)',
        flexShrink: 0,
      }}>
        just now
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
