import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Trophy, Zap, Crown, Award, TrendingUp } from 'lucide-react'
import api from '../services/api'
import { useTheme } from '../context/ThemeContext'

export default function Achievements() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [data, setData] = useState<any>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [tab, setTab] = useState<'overview' | 'leaderboard'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/gamification/me'),
      api.get('/gamification/leaderboard'),
    ]).then(([me, lb]) => {
      setData(me.data)
      setLeaderboard(lb.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const card = { background: isDark ? 'rgba(255,255,255,0.04)' : 'white', border: `1px solid ${isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)'}`, borderRadius: 20 }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.3)', borderTopColor: '#7c3aed', borderRadius: '50%' }} />
    </div>
  )

  const xpPct = data ? (data.xpInLevel / 100) * 100 : 0

  return (
    <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 30, fontWeight: 900, margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>🏆 Achievements</h1>
          <p style={{ color: isDark ? 'rgba(196,181,253,0.7)' : '#64748b', marginBottom: 28 }}>Track your progress, earn XP, and unlock badges</p>

          {/* XP Card */}
          <div style={{ ...card, padding: 28, marginBottom: 24, background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(91,33,182,0.1))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <p style={{ color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 12, fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your XP</p>
                <p style={{ color: isDark ? 'white' : '#0f172a', fontSize: 48, fontWeight: 900, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{data?.totalXP || 0}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(124,58,237,0.5)' }}>
                  <Crown size={32} color="white" />
                </div>
                <p style={{ color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 13, fontWeight: 700, margin: '8px 0 0' }}>Level {data?.level || 1}</p>
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: isDark ? 'rgba(203,213,225,0.7)' : '#64748b', fontSize: 13 }}>Level {data?.level || 1} Progress</span>
                <span style={{ color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 13, fontWeight: 700 }}>{data?.xpInLevel || 0}/100 XP</span>
              </div>
              <div style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderRadius: 999, height: 10, overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 999 }}
                  initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1 }} />
              </div>
            </div>
            {data?.nextBadge && (
              <p style={{ color: isDark ? 'rgba(148,163,184,0.6)' : '#94a3b8', fontSize: 12, margin: '8px 0 0' }}>
                {data.nextBadge.xpNeeded} XP to unlock {data.nextBadge.icon} {data.nextBadge.name}
              </p>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {(['overview', 'leaderboard'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding: '9px 20px', borderRadius: 10, border: `1px solid ${tab === t ? '#7c3aed' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')}`, background: tab === t ? 'rgba(124,58,237,0.15)' : 'transparent', color: tab === t ? (isDark ? '#c4b5fd' : '#7c3aed') : (isDark ? 'rgba(203,213,225,0.6)' : '#64748b'), cursor: 'pointer', fontWeight: 600, fontSize: 13, textTransform: 'capitalize' }}>
                {t === 'overview' ? '🎖️ Badges' : '🏅 Leaderboard'}
              </button>
            ))}
          </div>

          {/* Overview: Badges */}
          {tab === 'overview' && (
            <div>
              {/* Earned */}
              {data?.earnedBadges?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 16, fontWeight: 700, marginBottom: 14 }}>✅ Earned Badges</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                    {data.earnedBadges.map((badge: any) => (
                      <motion.div key={badge.id} whileHover={{ y: -3 }}
                        style={{ ...card, padding: 16, textAlign: 'center', background: isDark ? 'rgba(124,58,237,0.12)' : 'rgba(124,58,237,0.05)' }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>{badge.icon}</div>
                        <p style={{ color: isDark ? 'white' : '#0f172a', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{badge.name}</p>
                        <p style={{ color: isDark ? 'rgba(148,163,184,0.6)' : '#94a3b8', fontSize: 11, margin: 0 }}>{badge.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* All badges */}
              <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
                {data?.earnedBadges?.length > 0 ? '🔒 Remaining Badges' : '🎯 Badges to Earn'}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                {(data?.allBadges || []).filter((b: any) => !data?.earnedBadges?.find((e: any) => e.id === b.id)).map((badge: any) => (
                  <div key={badge.id}
                    style={{ ...card, padding: 16, textAlign: 'center', opacity: 0.5 }}>
                    <div style={{ fontSize: 32, marginBottom: 8, filter: 'grayscale(100%)' }}>{badge.icon}</div>
                    <p style={{ color: isDark ? 'rgba(203,213,225,0.7)' : '#64748b', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{badge.name}</p>
                    <p style={{ color: isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 11, margin: '0 0 6px' }}>{badge.desc}</p>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(124,58,237,0.1)', color: isDark ? '#a78bfa' : '#7c3aed' }}>
                      {badge.xpRequired} XP
                    </span>
                  </div>
                ))}
              </div>

              {/* XP How to earn */}
              <div style={{ ...card, padding: 20, marginTop: 24 }}>
                <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>⚡ How to Earn XP</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                  {[
                    { action: 'Complete Profile', xp: 50, icon: '👤', once: true },
                    { action: 'Mock Interview', xp: 40, icon: '🎯', once: false },
                    { action: 'Score 80%+ Interview', xp: 25, icon: '🌟', once: false },
                    { action: 'MCQ Test', xp: 20, icon: '📝', once: false },
                    { action: 'Score 80%+ MCQ', xp: 15, icon: '✅', once: false },
                    { action: 'Career DNA', xp: 30, icon: '🧬', once: false },
                    { action: 'Skill Gap Analysis', xp: 20, icon: '📊', once: false },
                    { action: 'Apply to Job', xp: 15, icon: '💼', once: false },
                    { action: 'Roadmap Milestone', xp: 10, icon: '🗺️', once: false },
                    { action: 'First Login', xp: 10, icon: '🚀', once: true },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderRadius: 10 }}>
                      <span style={{ fontSize: 18 }}>{item.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 12, fontWeight: 600, margin: 0 }}>{item.action}</p>
                        {item.once && <p style={{ color: isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 10, margin: 0 }}>One time</p>}
                      </div>
                      <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 800 }}>+{item.xp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent events */}
              {data?.recentEvents?.length > 0 && (
                <div style={{ ...card, padding: 20, marginTop: 16 }}>
                  <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🕐 Recent Activity</h3>
                  {data.recentEvents.map((e: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < data.recentEvents.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}` : 'none' }}>
                      <span style={{ color: isDark ? 'rgba(203,213,225,0.8)' : '#374151', fontSize: 13 }}>{e.label}</span>
                      <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 700 }}>+{e.xp_earned} XP</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Leaderboard */}
          {tab === 'leaderboard' && (
            <div style={card}>
              <div style={{ padding: '20px 20px 0' }}>
                <h3 style={{ color: isDark ? 'white' : '#0f172a', fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>Top Achievers</h3>
                <p style={{ color: isDark ? 'rgba(148,163,184,0.6)' : '#94a3b8', fontSize: 12, marginBottom: 16 }}>Ranked by total XP earned · First names only for privacy</p>
              </div>
              {leaderboard.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <Trophy size={40} color={isDark ? '#a78bfa' : '#7c3aed'} style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: isDark ? 'rgba(203,213,225,0.7)' : '#64748b' }}>No rankings yet. Be the first to earn XP!</p>
                </div>
              ) : leaderboard.map((user, i) => {
                const medals = ['🥇', '🥈', '🥉']
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: user.isMe ? (isDark ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.05)') : 'transparent', borderBottom: i < leaderboard.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}` : 'none' }}>
                    <span style={{ fontSize: i < 3 ? 22 : 14, fontWeight: 700, color: i < 3 ? undefined : (isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8'), minWidth: 28, textAlign: 'center' }}>
                      {i < 3 ? medals[i] : `#${i + 1}`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: isDark ? 'white' : '#0f172a', fontSize: 14, fontWeight: user.isMe ? 800 : 600, margin: 0 }}>
                        {user.name} {user.isMe && <span style={{ fontSize: 11, color: '#a78bfa' }}>(you)</span>}
                      </p>
                      <p style={{ color: isDark ? 'rgba(148,163,184,0.6)' : '#94a3b8', fontSize: 11, margin: '2px 0 0' }}>Level {user.level}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: isDark ? '#a78bfa' : '#7c3aed', fontSize: 16, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user.xp}</p>
                      <p style={{ color: isDark ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 11, margin: 0 }}>XP {user.topBadge}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
