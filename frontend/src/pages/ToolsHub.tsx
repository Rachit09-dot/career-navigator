import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileSearch, TrendingUp, Building, MessageSquare, Github,
  Loader2, CheckCircle, XCircle, Copy, Check,
  AlertCircle, Star, Zap, ChevronRight, ArrowRight, Award,
  BarChart2, Code, Target, BookOpen
} from 'lucide-react'
import { toolsAPI } from '../services/api'
import { useTheme } from '../context/ThemeContext'

type Tool = 'ats' | 'salary' | 'company' | 'outreach' | 'github'

const TOOLS = [
  { id: 'ats' as Tool,     icon: FileSearch,    title: 'ATS Scanner',        desc: 'Resume vs job description match', color: '#7c3aed', bg: 'rgba(124,58,237,0.12)'  },
  { id: 'salary' as Tool,  icon: TrendingUp,    title: 'Salary Intel',       desc: 'Salary ranges for any role',      color: '#16a34a', bg: 'rgba(22,163,74,0.12)'   },
  { id: 'company' as Tool, icon: Building,      title: 'Company Prep',       desc: 'Interview prep for any company',  color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  { id: 'outreach' as Tool,icon: MessageSquare, title: 'Outreach Writer',    desc: 'Draft recruiter messages',        color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  { id: 'github' as Tool,  icon: Github,        title: 'GitHub Analyzer',    desc: 'Improve your portfolio',          color: '#ec4899', bg: 'rgba(236,72,153,0.12)'  },
]

export default function ToolsHub() {
  const { theme } = useTheme()
  const D = theme === 'dark'

  const [activeTool, setActiveTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(false)
  // ── Per-tool results (persist across tool switches + page refresh) ──────────
  const [results, setResults] = useState<Record<string, any>>(() => {
    try { return JSON.parse(localStorage.getItem('cn_tool_results') || '{}') } catch { return {} }
  })
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Persist results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cn_tool_results', JSON.stringify(results))
  }, [results])

  const result = activeTool ? results[activeTool] ?? null : null

  // Form fields
  const [resumeText, setResumeText]     = useState('')
  const [jobDesc,    setJobDesc]        = useState('')
  const [salaryRole, setSalaryRole]     = useState('')
  const [salaryLoc,  setSalaryLoc]      = useState('India')
  const [salaryExp,  setSalaryExp]      = useState('Fresher')
  const [compName,   setCompName]       = useState('')
  const [compRole,   setCompRole]       = useState('')
  const [outType,    setOutType]        = useState('recruiter')
  const [outRole,    setOutRole]        = useState('')
  const [outCompany, setOutCompany]     = useState('')
  const [outTone,    setOutTone]        = useState('Professional')
  const [ghUser,     setGhUser]         = useState('')

  // ── Styles ────────────────────────────────────────────────────────────────
  const card   = (extra?: any) => ({ background: D ? 'rgba(255,255,255,0.04)' : 'white', border: `1px solid ${D ? 'rgba(124,58,237,0.18)' : 'rgba(124,58,237,0.12)'}`, borderRadius: 18, ...extra })
  const inp    = { width: '100%', padding: '11px 14px', background: D ? 'rgba(255,255,255,0.07)' : '#f8fafc', border: `1px solid ${D ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 10, color: D ? 'white' : '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }
  const lbl    = { display: 'block' as const, color: D ? '#a78bfa' : '#7c3aed', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.07em' }
  const subHdr = (color: string) => ({ color, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 })
  const chip   = (bg: string, color: string) => ({ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: bg, color })
  const pill   = (text: string, bg: string, color: string, key: number) => (
    <span key={key} style={{ ...chip(bg, color), display: 'inline-block', margin: '3px 4px 3px 0' }}>{text}</span>
  )

  const run = async (tool: Tool) => {
    setLoading(true); setError('')
    try {
      let res: any
      if (tool === 'ats')     res = await toolsAPI.atsScan(resumeText, jobDesc)
      if (tool === 'salary')  res = await toolsAPI.salary({ role: salaryRole, location: salaryLoc, experience: salaryExp })
      if (tool === 'company') res = await toolsAPI.companyPrep({ company: compName, role: compRole })
      if (tool === 'outreach')res = await toolsAPI.outreach({ type: outType, role: outRole, company: outCompany, tone: outTone })
      if (tool === 'github')  res = await toolsAPI.githubAnalyze(ghUser)
      // Store result per tool key
      setResults(prev => ({ ...prev, [tool]: res.data }))
    } catch (e: any) {
      setError(e.response?.data?.message || 'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  const copy = (txt: string) => { navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  const ScoreBar = ({ label, value, color }: { label: string; value: number; color?: string }) => {
    const c = color || (value >= 70 ? '#4ade80' : value >= 50 ? '#a78bfa' : '#fbbf24')
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ color: D ? 'rgba(203,213,225,0.7)' : '#64748b', fontSize: 13 }}>{label}</span>
          <span style={{ color: c, fontSize: 13, fontWeight: 800 }}>{value}%</span>
        </div>
        <div style={{ background: D ? 'rgba(255,255,255,0.08)' : '#e2e8f0', borderRadius: 999, height: 7, overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', background: c, borderRadius: 999 }} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} />
        </div>
      </div>
    )
  }

  const activeMeta = TOOLS.find(t => t.id === activeTool)

  return (
    <div style={{ minHeight: '100vh', padding: '28px 16px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ color: D ? 'white' : '#0f172a', fontSize: 32, fontWeight: 900, margin: '0 0 6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>🧰 Career Tools</h1>
          <p style={{ color: D ? 'rgba(196,181,253,0.7)' : '#64748b', margin: 0, fontSize: 15 }}>5 AI-powered tools to accelerate your job search</p>
        </motion.div>

        {/* ── Tool Selector Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14, marginBottom: 32 }}>
          {TOOLS.map((t, i) => {
            const Icon = t.icon
            const active = activeTool === t.id
            return (
              <motion.button key={t.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, boxShadow: `0 12px 30px ${t.color}25` }}
                onClick={() => { setActiveTool(t.id); setError('') }}
                style={{ padding: '18px 16px', borderRadius: 18, border: `2px solid ${active ? t.color : (D ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)')}`, background: active ? t.bg : (D ? 'rgba(255,255,255,0.03)' : 'white'), cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s', boxShadow: active ? `0 0 0 1px ${t.color}40, 0 8px 24px ${t.color}20` : 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, border: `1px solid ${t.color}30` }}>
                  <Icon size={20} style={{ color: t.color }} />
                </div>
                <p style={{ color: D ? 'white' : '#0f172a', fontSize: 13, fontWeight: 800, margin: '0 0 4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.title}</p>
                <p style={{ color: D ? 'rgba(148,163,184,0.6)' : '#94a3b8', fontSize: 11, margin: 0, lineHeight: 1.4 }}>{t.desc}</p>
                {results[t.id] && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>
                    <CheckCircle size={10} /> Result saved
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* ── Form Panel ── */}
        <AnimatePresence mode="wait">
          {activeTool && (
            <motion.div key={activeTool} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              style={{ ...card({ padding: 28, marginBottom: 24 }) }}>

              {/* Form header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: activeMeta?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${activeMeta?.color}30` }}>
                  {activeMeta && <activeMeta.icon size={22} style={{ color: activeMeta.color }} />}
                </div>
                <div>
                  <h2 style={{ color: D ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{activeMeta?.title}</h2>
                  <p style={{ color: D ? 'rgba(148,163,184,0.6)' : '#94a3b8', fontSize: 13, margin: 0 }}>{activeMeta?.desc}</p>
                </div>
              </div>

              {/* ── ATS Form ── */}
              {activeTool === 'ats' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div><label style={lbl}>Your Resume Text</label><textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your full resume text here…" rows={9} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} /></div>
                    <div><label style={lbl}>Job Description</label><textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste the job description here…" rows={9} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} /></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <p style={{ color: D ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 12, margin: 0 }}>⚠️ Estimated ATS score. Actual systems vary by employer.</p>
                    <RunBtn loading={loading} disabled={!resumeText.trim() || !jobDesc.trim()} color="#7c3aed" onClick={() => run('ats')} label="Scan Resume" icon={<FileSearch size={15} />} />
                  </div>
                </div>
              )}

              {/* ── Salary Form ── */}
              {activeTool === 'salary' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
                    <div><label style={lbl}>Job Role</label><input value={salaryRole} onChange={e => setSalaryRole(e.target.value)} placeholder="e.g. Data Analyst" style={inp} /></div>
                    <div><label style={lbl}>Location</label><input value={salaryLoc} onChange={e => setSalaryLoc(e.target.value)} placeholder="e.g. Bangalore" style={inp} /></div>
                    <div><label style={lbl}>Experience</label>
                      <select value={salaryExp} onChange={e => setSalaryExp(e.target.value)} style={{ ...inp, appearance: 'auto' }}>
                        <option>Fresher</option><option>1-2 years</option><option>3-5 years</option><option>5+ years</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <p style={{ color: D ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 12, margin: 0 }}>⚠️ AI-estimated ranges. Verify on Naukri/LinkedIn.</p>
                    <RunBtn loading={loading} disabled={!salaryRole.trim()} color="#16a34a" onClick={() => run('salary')} label="Get Salary Data" icon={<TrendingUp size={15} />} />
                  </div>
                </div>
              )}

              {/* ── Company Form ── */}
              {activeTool === 'company' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                    <div><label style={lbl}>Company Name</label><input value={compName} onChange={e => setCompName(e.target.value)} placeholder="e.g. Google, Infosys, Zomato" style={inp} /></div>
                    <div><label style={lbl}>Target Role</label><input value={compRole} onChange={e => setCompRole(e.target.value)} placeholder="e.g. Software Engineer" style={inp} /></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <p style={{ color: D ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 12, margin: 0 }}>⚠️ AI-generated practice material. Actual questions are proprietary.</p>
                    <RunBtn loading={loading} disabled={!compName.trim() || !compRole.trim()} color="#3b82f6" onClick={() => run('company')} label="Generate Prep" icon={<Building size={15} />} />
                  </div>
                </div>
              )}

              {/* ── Outreach Form ── */}
              {activeTool === 'outreach' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div><label style={lbl}>Message Type</label>
                      <select value={outType} onChange={e => setOutType(e.target.value)} style={{ ...inp, appearance: 'auto' }}>
                        <option value="recruiter">Recruiter Message</option>
                        <option value="referral">Referral Request</option>
                        <option value="follow-up">Follow-Up</option>
                        <option value="inquiry">Job Inquiry</option>
                      </select>
                    </div>
                    <div><label style={lbl}>Role You're Applying For</label><input value={outRole} onChange={e => setOutRole(e.target.value)} placeholder="e.g. Data Analyst" style={inp} /></div>
                    <div><label style={lbl}>Company (optional)</label><input value={outCompany} onChange={e => setOutCompany(e.target.value)} placeholder="e.g. Amazon" style={inp} /></div>
                    <div><label style={lbl}>Tone</label>
                      <select value={outTone} onChange={e => setOutTone(e.target.value)} style={{ ...inp, appearance: 'auto' }}>
                        <option>Professional</option><option>Friendly</option><option>Formal</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <p style={{ color: D ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 12, margin: 0 }}>⚠️ Generates drafts only — messages are never sent automatically.</p>
                    <RunBtn loading={loading} disabled={!outRole.trim()} color="#f59e0b" onClick={() => run('outreach')} label="Generate Draft" icon={<MessageSquare size={15} />} />
                  </div>
                </div>
              )}

              {/* ── GitHub Form ── */}
              {activeTool === 'github' && (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={lbl}>GitHub Username</label>
                    <input value={ghUser} onChange={e => setGhUser(e.target.value)} onKeyDown={e => e.key === 'Enter' && !loading && ghUser.trim() && run('github')} placeholder="e.g. torvalds" style={{ ...inp, maxWidth: 360 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <p style={{ color: D ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 12, margin: 0 }}>⚠️ Based on public repository metadata only.</p>
                    <RunBtn loading={loading} disabled={!ghUser.trim()} color="#ec4899" onClick={() => run('github')} label="Analyze Profile" icon={<Github size={15} />} />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error ── */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 14, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {result && activeTool && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

              {/* Result header bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={16} color="#4ade80" />
                  <span style={{ color: D ? '#4ade80' : '#16a34a', fontSize: 13, fontWeight: 700 }}>Result loaded</span>
                  <span style={{ color: D ? 'rgba(148,163,184,0.4)' : '#94a3b8', fontSize: 12 }}>· Saved locally</span>
                </div>
                <button
                  onClick={() => { setResults(prev => { const n = { ...prev }; delete n[activeTool]; return n }) }}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, border: `1px solid ${D ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, background: 'transparent', color: D ? 'rgba(148,163,184,0.6)' : '#94a3b8', cursor: 'pointer', fontSize: 12 }}>
                  🔄 Clear &amp; Re-run
                </button>
              </div>

              {/* ════════════════ ATS Result ════════════════ */}
              {activeTool === 'ats' && (
                <div>
                  {/* Score hero */}
                  <div style={{ ...card({ padding: 28, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }) }}>
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, color: result.overallScore >= 70 ? '#4ade80' : result.overallScore >= 50 ? '#a78bfa' : '#f87171', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{result.overallScore}<span style={{ fontSize: 20 }}>%</span></div>
                      <span style={{ ...chip(result.overallScore >= 70 ? 'rgba(74,222,128,0.15)' : result.overallScore >= 50 ? 'rgba(167,139,250,0.15)' : 'rgba(248,113,113,0.15)', result.overallScore >= 70 ? '#4ade80' : result.overallScore >= 50 ? '#a78bfa' : '#f87171') }}>{result.verdict}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <ScoreBar label="Keyword Match"   value={result.breakdown?.keywordMatch    || 0} />
                      <ScoreBar label="Skills Match"    value={result.breakdown?.skillsMatch     || 0} />
                      <ScoreBar label="Experience Match"value={result.breakdown?.experienceMatch || 0} />
                      <ScoreBar label="Formatting"      value={result.breakdown?.formattingScore || 0} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    {result.missingKeywords?.length > 0 && (
                      <div style={card({ padding: 20 })}>
                        <p style={subHdr('#f87171')}><XCircle size={14} /> Missing Keywords</p>
                        <div>{result.missingKeywords.map((k: string, i: number) => pill(k, 'rgba(248,113,113,0.1)', '#f87171', i))}</div>
                      </div>
                    )}
                    {result.matchedKeywords?.length > 0 && (
                      <div style={card({ padding: 20 })}>
                        <p style={subHdr('#4ade80')}><CheckCircle size={14} /> Matched Keywords</p>
                        <div>{result.matchedKeywords.map((k: string, i: number) => pill(k, 'rgba(74,222,128,0.1)', '#4ade80', i))}</div>
                      </div>
                    )}
                  </div>

                  {result.recommendations?.length > 0 && (
                    <div style={card({ padding: 20, marginBottom: 14 })}>
                      <p style={subHdr('#a78bfa')}><Zap size={14} /> Recommendations</p>
                      {result.recommendations.map((r: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, padding: '10px 14px', background: D ? 'rgba(167,139,250,0.07)' : 'rgba(124,58,237,0.04)', borderRadius: 10, border: `1px solid ${D ? 'rgba(167,139,250,0.15)' : 'rgba(124,58,237,0.08)'}` }}>
                          <ChevronRight size={14} color="#a78bfa" style={{ flexShrink: 0, marginTop: 2 }} />
                          <span style={{ color: D ? 'rgba(203,213,225,0.85)' : '#374151', fontSize: 13, lineHeight: 1.5 }}>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p style={{ color: D ? 'rgba(148,163,184,0.4)' : '#94a3b8', fontSize: 11, fontStyle: 'italic' }}>{result.disclaimer}</p>
                </div>
              )}

              {/* ════════════════ Salary Result ════════════════ */}
              {activeTool === 'salary' && (
                <div>
                  <div style={{ ...card({ padding: 24, marginBottom: 16 }) }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(22,163,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={22} color="#4ade80" />
                      </div>
                      <div>
                        <h3 style={{ color: D ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{result.role}</h3>
                        <p style={{ color: D ? 'rgba(148,163,184,0.6)' : '#94a3b8', fontSize: 13, margin: 0 }}>{result.location} · {result.experienceLevel} · <span style={{ color: result.growthOutlook === 'High' ? '#4ade80' : '#fbbf24' }}>📈 {result.growthOutlook} Growth</span></p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                      {Object.entries(result.salaryRanges || {}).map(([level, data]: [string, any]) => (
                        <div key={level} style={{ background: D ? 'rgba(22,163,74,0.08)' : 'rgba(22,163,74,0.04)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
                          <p style={{ color: D ? 'rgba(148,163,184,0.6)' : '#94a3b8', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>{level}</p>
                          <p style={{ color: '#4ade80', fontSize: 20, fontWeight: 900, margin: '0 0 2px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>₹{data.median}L</p>
                          <p style={{ color: D ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 11, margin: 0 }}>₹{data.min}L – ₹{data.max}L</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    {result.inDemandSkills?.length > 0 && (
                      <div style={card({ padding: 20 })}>
                        <p style={subHdr('#a78bfa')}><Star size={14} /> In-Demand Skills</p>
                        <div>{result.inDemandSkills.map((s: string, i: number) => pill(s, 'rgba(167,139,250,0.12)', D ? '#c4b5fd' : '#7c3aed', i))}</div>
                      </div>
                    )}
                    {result.topPayingCompanies?.length > 0 && (
                      <div style={card({ padding: 20 })}>
                        <p style={subHdr('#fbbf24')}><Award size={14} /> Top Paying Companies</p>
                        {result.topPayingCompanies.map((c: string, i: number) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ color: '#fbbf24', fontSize: 12, fontWeight: 700 }}>#{i + 1}</span>
                            <span style={{ color: D ? 'rgba(203,213,225,0.85)' : '#374151', fontSize: 13 }}>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p style={{ color: D ? 'rgba(148,163,184,0.4)' : '#94a3b8', fontSize: 11, fontStyle: 'italic' }}>{result.disclaimer}</p>
                </div>
              )}

              {/* ════════════════ Company Prep Result ════════════════ */}
              {activeTool === 'company' && (
                <div>
                  {/* Header */}
                  <div style={{ ...card({ padding: 24, marginBottom: 16, background: D ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.04)', borderColor: 'rgba(59,130,246,0.25)' }) }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building size={24} color="#60a5fa" />
                      </div>
                      <div>
                        <h3 style={{ color: D ? 'white' : '#0f172a', fontSize: 20, fontWeight: 900, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{result.company}</h3>
                        <p style={{ color: '#60a5fa', fontSize: 13, margin: 0, fontWeight: 600 }}>{result.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Interview Process */}
                  {result.interviewProcess?.length > 0 && (
                    <div style={card({ padding: 22, marginBottom: 16 })}>
                      <p style={subHdr('#60a5fa')}><Target size={14} /> Interview Process</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {result.interviewProcess.map((step: string, i: number) => (
                          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px', background: D ? 'rgba(59,130,246,0.07)' : 'rgba(59,130,246,0.04)', borderRadius: 12, border: '1px solid rgba(59,130,246,0.15)' }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(59,130,246,0.3)' }}>
                              <span style={{ color: '#60a5fa', fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
                            </div>
                            <span style={{ color: D ? 'rgba(203,213,225,0.9)' : '#1e293b', fontSize: 14, lineHeight: 1.5 }}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Topic Areas */}
                  {result.topicAreas?.length > 0 && (
                    <div style={card({ padding: 22, marginBottom: 16 })}>
                      <p style={subHdr('#a78bfa')}><BookOpen size={14} /> Topic Areas to Prepare</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                        {result.topicAreas.map((area: any, i: number) => (
                          <div key={i} style={{ padding: '14px 16px', background: D ? 'rgba(167,139,250,0.08)' : 'rgba(124,58,237,0.04)', borderRadius: 12, border: '1px solid rgba(167,139,250,0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <span style={{ color: D ? 'white' : '#0f172a', fontSize: 13, fontWeight: 700 }}>{area.area}</span>
                              <span style={{ ...chip(area.importance === 'High' ? 'rgba(248,113,113,0.15)' : 'rgba(167,139,250,0.15)', area.importance === 'High' ? '#f87171' : '#a78bfa') }}>{area.importance}</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {area.topics?.slice(0, 4).map((t: string, j: number) => (
                                <span key={j} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 999, background: D ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: D ? 'rgba(203,213,225,0.7)' : '#64748b' }}>{t}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practice Questions */}
                  {result.practiceQuestions?.length > 0 && (
                    <div style={card({ padding: 22, marginBottom: 16 })}>
                      <p style={subHdr('#fbbf24')}><Code size={14} /> Practice Questions (AI-Generated)</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {result.practiceQuestions.map((q: any, i: number) => {
                          const catColor = q.category === 'Technical' ? { bg: 'rgba(59,130,246,0.12)', c: '#60a5fa' } : q.category === 'HR' ? { bg: 'rgba(22,163,74,0.12)', c: '#4ade80' } : { bg: 'rgba(245,158,11,0.12)', c: '#fbbf24' }
                          const diffColor = q.difficulty === 'Hard' ? '#f87171' : q.difficulty === 'Medium' ? '#fbbf24' : '#4ade80'
                          return (
                            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', background: D ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderRadius: 12, border: `1px solid ${D ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}` }}>
                              <span style={{ color: D ? 'rgba(148,163,184,0.4)' : '#cbd5e1', fontSize: 12, fontWeight: 700, minWidth: 22, paddingTop: 1 }}>Q{i + 1}</span>
                              <div style={{ flex: 1 }}>
                                <p style={{ color: D ? 'rgba(203,213,225,0.9)' : '#1e293b', fontSize: 14, margin: '0 0 8px', lineHeight: 1.55 }}>{q.question}</p>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <span style={chip(catColor.bg, catColor.c)}>{q.category}</span>
                                  {q.difficulty && <span style={chip(`${diffColor}15`, diffColor)}>{q.difficulty}</span>}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Prep Plan */}
                  {result.preparationPlan?.length > 0 && (
                    <div style={card({ padding: 22, marginBottom: 16 })}>
                      <p style={subHdr('#4ade80')}><BarChart2 size={14} /> Preparation Plan</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                        {result.preparationPlan.map((plan: any, i: number) => (
                          <div key={i} style={{ padding: '14px 16px', background: D ? 'rgba(22,163,74,0.07)' : 'rgba(22,163,74,0.04)', borderRadius: 12, border: '1px solid rgba(22,163,74,0.2)' }}>
                            <p style={{ color: '#4ade80', fontSize: 12, fontWeight: 800, margin: '0 0 8px' }}>Week {plan.week} — {plan.focus}</p>
                            {plan.tasks?.map((t: string, j: number) => (
                              <div key={j} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                                <CheckCircle size={12} color="#4ade80" style={{ flexShrink: 0, marginTop: 2 }} />
                                <span style={{ color: D ? 'rgba(203,213,225,0.75)' : '#475569', fontSize: 12 }}>{t}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills to highlight */}
                  {result.keySkillsToHighlight?.length > 0 && (
                    <div style={card({ padding: 18, marginBottom: 14 })}>
                      <p style={subHdr('#a78bfa')}><Star size={14} /> Key Skills to Highlight</p>
                      <div>{result.keySkillsToHighlight.map((s: string, i: number) => pill(s, 'rgba(167,139,250,0.12)', D ? '#c4b5fd' : '#7c3aed', i))}</div>
                    </div>
                  )}

                  <p style={{ color: D ? 'rgba(148,163,184,0.4)' : '#94a3b8', fontSize: 11, fontStyle: 'italic' }}>{result.disclaimer}</p>
                </div>
              )}

              {/* ════════════════ Outreach Result ════════════════ */}
              {activeTool === 'outreach' && (
                <div style={card({ padding: 28 })}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <h3 style={{ color: D ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0 }}>Your Draft Message</h3>
                      <p style={{ color: D ? 'rgba(148,163,184,0.6)' : '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>Review and personalise before sending</p>
                    </div>
                    <button onClick={() => copy(`Subject: ${result.subject}\n\n${result.message}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                      {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                    </button>
                  </div>

                  {result.subject && (
                    <div style={{ background: D ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
                      <span style={{ color: '#f59e0b', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', marginRight: 8 }}>Subject:</span>
                      <span style={{ color: D ? 'white' : '#0f172a', fontSize: 14, fontWeight: 600 }}>{result.subject}</span>
                    </div>
                  )}

                  <div style={{ background: D ? 'rgba(255,255,255,0.04)' : '#f8fafc', border: `1px solid ${D ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, borderRadius: 14, padding: '20px 20px', marginBottom: 18 }}>
                    <pre style={{ color: D ? 'rgba(203,213,225,0.9)' : '#1e293b', fontSize: 14, margin: 0, whiteSpace: 'pre-wrap', fontFamily: "'Inter', sans-serif", lineHeight: 1.8 }}>{result.message}</pre>
                  </div>

                  {result.tips?.length > 0 && (
                    <div style={{ background: D ? 'rgba(245,158,11,0.07)' : 'rgba(245,158,11,0.04)', borderRadius: 12, padding: '16px 18px' }}>
                      <p style={subHdr('#f59e0b')}><Zap size={14} /> Customisation Tips</p>
                      {result.tips.map((t: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                          <ArrowRight size={13} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                          <span style={{ color: D ? 'rgba(203,213,225,0.8)' : '#475569', fontSize: 13 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p style={{ color: D ? 'rgba(148,163,184,0.4)' : '#94a3b8', fontSize: 11, fontStyle: 'italic', marginTop: 14 }}>{result.disclaimer}</p>
                </div>
              )}

              {/* ════════════════ GitHub Result ════════════════ */}
              {activeTool === 'github' && (
                <div>
                  {/* Profile card */}
                  <div style={card({ padding: 24, marginBottom: 16, display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' })}>
                    {result.profile?.avatarUrl && <img src={result.profile.avatarUrl} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(236,72,153,0.3)' }} />}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: D ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0 }}>{result.profile?.name || result.profile?.username}</h3>
                      <p style={{ color: D ? 'rgba(148,163,184,0.6)' : '#94a3b8', fontSize: 13, margin: '4px 0 8px' }}>@{result.profile?.username} · {result.profile?.publicRepos} repos · {result.profile?.followers} followers</p>
                      {result.languages?.length > 0 && <div>{result.languages.map((l: string, i: number) => pill(l, 'rgba(236,72,153,0.1)', D ? '#f9a8d4' : '#be185d', i))}</div>}
                    </div>
                    {result.analysis?.overallScore != null && (
                      <div style={{ textAlign: 'center', background: D ? 'rgba(236,72,153,0.1)' : 'rgba(236,72,153,0.05)', border: '2px solid rgba(236,72,153,0.25)', borderRadius: 18, padding: '16px 24px' }}>
                        <p style={{ color: result.analysis.overallScore >= 70 ? '#4ade80' : result.analysis.overallScore >= 50 ? '#a78bfa' : '#fbbf24', fontSize: 44, fontWeight: 900, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1 }}>{result.analysis.overallScore}</p>
                        <p style={{ color: D ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 11, margin: '4px 0 0' }}>Portfolio Score</p>
                      </div>
                    )}
                  </div>

                  {/* Score breakdown */}
                  {result.analysis?.breakdown && (
                    <div style={card({ padding: 22, marginBottom: 14 })}>
                      <p style={subHdr('#ec4899')}><BarChart2 size={14} /> Score Breakdown</p>
                      {Object.entries(result.analysis.breakdown).map(([k, v]: [string, any]) => (
                        <ScoreBar key={k} label={k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} value={v} color="#ec4899" />
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    {result.analysis?.quickWins?.length > 0 && (
                      <div style={card({ padding: 20 })}>
                        <p style={subHdr('#4ade80')}><Zap size={14} /> Quick Wins</p>
                        {result.analysis.quickWins.map((w: string, i: number) => (
                          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <CheckCircle size={13} color="#4ade80" style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ color: D ? 'rgba(203,213,225,0.85)' : '#374151', fontSize: 13 }}>{w}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {result.analysis?.strengths?.length > 0 && (
                      <div style={card({ padding: 20 })}>
                        <p style={subHdr('#a78bfa')}><Star size={14} /> Strengths</p>
                        {result.analysis.strengths.map((s: string, i: number) => (
                          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <Star size={13} color="#a78bfa" style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ color: D ? 'rgba(203,213,225,0.85)' : '#374151', fontSize: 13 }}>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {result.analysis?.improvements?.length > 0 && (
                    <div style={card({ padding: 22, marginBottom: 14 })}>
                      <p style={subHdr('#fbbf24')}><Target size={14} /> Improvements</p>
                      {result.analysis.improvements.map((imp: any, i: number) => (
                        <div key={i} style={{ padding: '12px 16px', background: D ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderRadius: 12, marginBottom: 10, border: `1px solid ${D ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}` }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                            <span style={chip(imp.priority === 'High' ? 'rgba(248,113,113,0.15)' : 'rgba(251,191,36,0.15)', imp.priority === 'High' ? '#f87171' : '#fbbf24')}>{imp.priority}</span>
                            <span style={{ color: D ? 'white' : '#0f172a', fontSize: 13, fontWeight: 700 }}>{imp.area}</span>
                          </div>
                          <p style={{ color: D ? 'rgba(203,213,225,0.7)' : '#64748b', fontSize: 13, margin: 0 }}>{imp.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <p style={{ color: D ? 'rgba(148,163,184,0.4)' : '#94a3b8', fontSize: 11, fontStyle: 'italic' }}>{result.analysis?.disclaimer}</p>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ── Run Button Component ───────────────────────────────────────────────────────
function RunBtn({ loading, disabled, color, onClick, label, icon }: { loading: boolean; disabled: boolean; color: string; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <motion.button onClick={onClick} disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, border: 'none', background: disabled || loading ? `${color}40` : color, color: 'white', fontWeight: 700, fontSize: 14, cursor: disabled || loading ? 'not-allowed' : 'pointer', boxShadow: !disabled && !loading ? `0 4px 20px ${color}40` : 'none', transition: 'all 0.15s' }}>
      {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : icon}
      {loading ? 'Generating…' : label}
    </motion.button>
  )
}
