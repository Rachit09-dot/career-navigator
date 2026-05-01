import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Download, FileText, User, GraduationCap, Briefcase, Code2, Award, Wrench, Sparkles, Loader2 } from 'lucide-react';
import { resumeAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Exp { id: string; title: string; company: string; location: string; dates: string; bullets: string[] }
interface Proj { id: string; name: string; tech: string; bullets: string[] }
interface Cert { id: string; name: string; date: string }

interface ResumeData {
  name: string; phone: string; email: string; linkedin: string;
  university: string; degree: string; years: string; city: string;
  coursework: string;
  experiences: Exp[];
  projects: Proj[];
  langSkills: string; frontendSkills: string; backendSkills: string;
  dbSkills: string; aiSkills: string; toolSkills: string;
  certifications: Cert[];
}

const uid = () => Math.random().toString(36).slice(2, 8);

const DEFAULT: ResumeData = {
  name: 'Your Full Name',
  phone: '+91-XXXXXXXXXX',
  email: 'yourname@email.com',
  linkedin: 'linkedin.com/in/your-profile',
  university: 'XYZ University',
  degree: 'B.Tech — Computer Science & Engineering',
  years: '20XX – 20XX',
  city: 'City, State',
  coursework: 'Data Structures, Algorithms, Database Management, Operating Systems, Computer Networks, Software Engineering',
  experiences: [
    { id: uid(), title: 'Software Developer Intern', company: 'ABC Technologies Pvt. Ltd.', location: 'Remote', dates: 'Jun 20XX – Aug 20XX', bullets: ['Developed and maintained RESTful APIs using Node.js, improving response time by X%.', 'Built reusable React components used across 3+ modules, reducing development time significantly.', 'Collaborated with a team of X engineers in an agile environment, completing X sprint milestones on time.', 'Wrote unit tests achieving X% code coverage across assigned modules.'] },
    { id: uid(), title: 'Web Development Intern', company: 'XYZ Solutions', location: 'On-site', dates: 'Dec 20XX – Jan 20XX', bullets: ['Built responsive UI pages using React.js and Tailwind CSS for X client projects.', 'Integrated third-party APIs reducing manual workflow effort by X%.', 'Maintained codebase using Git and participated in daily standups with the product team.'] },
  ],
  projects: [
    { id: uid(), name: 'Project Name — Brief Description', tech: 'React, Node.js, PostgreSQL, Tailwind CSS', bullets: ['Describe what you built and the problem it solves in one line.', 'Mention key technical decisions, architecture, or integrations used.', 'Quantify impact: X users, X% improvement, X features shipped.', 'Add deployment or scale details if applicable.'] },
    { id: uid(), name: 'Another Project — One Line Description', tech: 'Python, Flask, MongoDB', bullets: ['Describe the core functionality and your role in building it.', 'Mention any interesting technical challenges you solved.', 'Add metrics or outcomes if available.'] },
  ],
  langSkills: 'Python, JavaScript, TypeScript, Java, SQL',
  frontendSkills: 'React.js, Tailwind CSS, HTML5, CSS3',
  backendSkills: 'Node.js, Express.js, REST APIs, JWT Authentication',
  dbSkills: 'PostgreSQL, MongoDB, MySQL',
  aiSkills: 'NumPy, Pandas, Scikit-learn',
  toolSkills: 'Git, Docker, Postman, VS Code, Vercel',
  certifications: [
    { id: uid(), name: 'Certification Name — Issuing Organization', date: 'Mon 20XX' },
    { id: uid(), name: 'Another Certification — Platform / University', date: 'Mon 20XX' },
  ],
};

// ── Resume Preview ──────────────────────────────────────
function ResumePreview({ d }: { d: ResumeData }) {
  const courses = d.coursework.split(',').map(s => s.trim()).filter(Boolean);

  const sectionHeader = (title: string) => (
    <div style={{ marginTop: 8, marginBottom: 4 }}>
      <div style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #000', paddingBottom: 1, lineHeight: 1.2 }}>
        {title}
      </div>
    </div>
  );

  return (
    <div style={{ width: 794, background: '#fff', color: '#000', fontFamily: '"Times New Roman", Times, serif', fontSize: 10.5, lineHeight: 1.2, padding: '38px 48px', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: 24, fontWeight: 'bold', letterSpacing: 1, marginBottom: 2 }}>{d.name || 'Your Name'}</div>
        <div style={{ fontSize: 9.5, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {d.phone && <span>✆ {d.phone}</span>}
          {d.phone && d.email && <span style={{ color: '#555' }}>~</span>}
          {d.email && <span>✉ <span style={{ textDecoration: 'underline' }}>{d.email}</span></span>}
          {d.email && d.linkedin && <span style={{ color: '#555' }}>~</span>}
          {d.linkedin && <span>in <span style={{ textDecoration: 'underline' }}>{d.linkedin}</span></span>}
        </div>
      </div>

      {sectionHeader('Education')}
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 'bold', fontSize: 10.5 }}>{d.university || 'University Name'}</span>
          <span style={{ fontWeight: 'bold', fontSize: 9.5 }}>{d.years || '2023 – 2027'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 1 }}>
          <span style={{ fontStyle: 'italic', fontSize: 9.5 }}>{d.degree || 'B.Tech — CSE'}</span>
          <span style={{ fontStyle: 'italic', fontSize: 9.5 }}>{d.city || 'City, State'}</span>
        </div>
      </div>

      {courses.length > 0 && (
        <>
          {sectionHeader('Relevant Coursework')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', rowGap: 2, marginBottom: 4 }}>
            {courses.map((c, i) => <div key={i} style={{ fontSize: 9.5, paddingLeft: 4 }}>• {c}</div>)}
          </div>
        </>
      )}

      {d.experiences.length > 0 && (
        <>
          {sectionHeader('Experience')}
          {d.experiences.map(exp => (
            <div key={exp.id} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 'bold', fontSize: 10.5 }}>{exp.title || 'Job Title'}</span>
                <span style={{ fontWeight: 'bold', fontSize: 9.5 }}>{exp.dates}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 1 }}>
                <span style={{ fontStyle: 'italic', fontSize: 9.5 }}>{exp.company}</span>
                <span style={{ fontStyle: 'italic', fontSize: 9.5 }}>{exp.location}</span>
              </div>
              <ul style={{ margin: '2px 0 0', paddingLeft: 16, listStyleType: 'disc' }}>
                {exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i} style={{ fontSize: 9.5, lineHeight: 1.3, margin: '1px 0' }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {d.projects.length > 0 && (
        <>
          {sectionHeader('Projects')}
          {d.projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10.5 }}>
                <span style={{ fontWeight: 'bold' }}>{proj.name}</span>
                {proj.tech && <span style={{ fontStyle: 'italic', fontSize: 9.5 }}> | {proj.tech}</span>}
              </div>
              <ul style={{ margin: '2px 0 0', paddingLeft: 16, listStyleType: 'disc' }}>
                {proj.bullets.filter(b => b.trim()).map((b, i) => <li key={i} style={{ fontSize: 9.5, lineHeight: 1.3, margin: '1px 0' }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {(d.langSkills || d.frontendSkills || d.backendSkills || d.dbSkills || d.aiSkills || d.toolSkills) && (
        <>
          {sectionHeader('Technical Skills')}
          <div style={{ fontSize: 9.5, lineHeight: 1.5 }}>
            {d.langSkills && <div><span style={{ fontWeight: 'bold' }}>Languages:</span> {d.langSkills}</div>}
            {d.frontendSkills && <div><span style={{ fontWeight: 'bold' }}>Frontend:</span> {d.frontendSkills}</div>}
            {d.backendSkills && <div><span style={{ fontWeight: 'bold' }}>Backend & APIs:</span> {d.backendSkills}</div>}
            {d.dbSkills && <div><span style={{ fontWeight: 'bold' }}>Databases:</span> {d.dbSkills}</div>}
            {d.aiSkills && <div><span style={{ fontWeight: 'bold' }}>AI / ML:</span> {d.aiSkills}</div>}
            {d.toolSkills && <div><span style={{ fontWeight: 'bold' }}>Tools:</span> {d.toolSkills}</div>}
          </div>
        </>
      )}

      {d.certifications.length > 0 && (
        <>
          {sectionHeader('Certifications')}
          {d.certifications.map(cert => (
            <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, lineHeight: 1.6 }}>
              <span style={{ fontStyle: 'italic' }}>{cert.name}</span>
              <span style={{ fontStyle: 'italic', whiteSpace: 'nowrap', marginLeft: 8 }}>{cert.date}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  const { theme } = useTheme();
  const [data, setData] = useState<ResumeData>(DEFAULT);
  const [tab, setTab] = useState<string>('personal');
  const previewRef = useRef<HTMLDivElement>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null); // exp id being loaded

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'white',
    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)', borderRadius: 8, color: theme === 'dark' ? 'white' : '#0f172a',
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 11 };
  const cardStyle: React.CSSProperties = { border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(124,58,237,0.04)' };
  const addBtnStyle: React.CSSProperties = { width: '100%', padding: '11px', border: '2px dashed rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.06)', color: '#a78bfa', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 };
  const delBtnStyle: React.CSSProperties = { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '4px 7px', cursor: 'pointer', color: '#f87171', display: 'flex' };

  const set = (k: keyof ResumeData, v: any) => setData(d => ({ ...d, [k]: v }));
  const addExp = () => setData(d => ({ ...d, experiences: [...d.experiences, { id: uid(), title: '', company: '', location: '', dates: '', bullets: ['', '', '', ''] }] }));
  const delExp = (id: string) => setData(d => ({ ...d, experiences: d.experiences.filter(e => e.id !== id) }));
  const setExp = (id: string, k: keyof Exp, v: any) => setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === id ? { ...e, [k]: v } : e) }));
  const setBullet = (id: string, i: number, v: string) => setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, bi) => bi === i ? v : b) } : e) }));
  const addProj = () => setData(d => ({ ...d, projects: [...d.projects, { id: uid(), name: '', tech: '', bullets: ['', '', '', ''] }] }));
  const delProj = (id: string) => setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));
  const setProj = (id: string, k: keyof Proj, v: any) => setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, [k]: v } : p) }));
  const setPBullet = (id: string, i: number, v: string) => setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, bullets: p.bullets.map((b, bi) => bi === i ? v : b) } : p) }));
  const addCert = () => setData(d => ({ ...d, certifications: [...d.certifications, { id: uid(), name: '', date: '' }] }));
  const delCert = (id: string) => setData(d => ({ ...d, certifications: d.certifications.filter(c => c.id !== id) }));
  const setCert = (id: string, k: keyof Cert, v: string) => setData(d => ({ ...d, certifications: d.certifications.map(c => c.id === id ? { ...c, [k]: v } : c) }));

  const generateAIBullets = async (exp: Exp) => {
    setAiLoading(exp.id)
    try {
      const res = await resumeAPI.getAIBullets({ role: exp.title || 'Software Engineer', company: exp.company, context: exp.bullets.filter(b => b.trim()).join('. ') })
      const bullets = res.data.bullets as string[]
      setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === exp.id ? { ...e, bullets: bullets.slice(0, 4) } : e) }))
    } catch { /* silent */ } finally {
      setAiLoading(null)
    }
  }

  const handleDownload = () => {
    const el = previewRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>${data.name || 'Resume'}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{background:white;}@page{size:A4;margin:0;}@media print{body{-webkit-print-color-adjust:exact;}}</style></head><body>${el.outerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 400);
  };

  const TABS = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Code2 },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'certs', label: 'Certs', icon: Award },
  ];

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Top Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(124,58,237,0.3)', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', left: '15%', width: 350, height: 150, background: 'radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-40px', right: '10%', width: 200, height: 120, background: 'radial-gradient(circle, rgba(167,139,250,0.15), transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 14 }}>
          <motion.div whileHover={{ rotate: 5, scale: 1.05 }} style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(124,58,237,0.6)' }}>
            <FileText style={{ width: 20, height: 20, color: theme === 'dark' ? 'white' : '#0f172a' }} />
          </motion.div>
          <div>
            <h1 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: '-0.4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Resume Builder</h1>
            <p style={{ color: 'rgba(167,139,250,0.75)', fontSize: 12, margin: 0 }}>Live preview as you type</p>
          </div>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '5px 12px' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            <span style={{ color: '#86efac', fontSize: 11, fontWeight: 600 }}>Live Preview</span>
          </div>
          <motion.button onClick={handleDownload}
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(124,58,237,0.6)' }}
            whileTap={{ scale: 0.96 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#7c3aed', color: 'white', border: 'none', borderRadius: 12, padding: '11px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
            <Download style={{ width: 16, height: 16 }} /> Download PDF
          </motion.button>
        </div>
      </motion.div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 73px)' }}>
        {/* ── LEFT: Form Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ width: 390, flexShrink: 0, background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)', backdropFilter: 'blur(16px)', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}>

          {/* Tabs with icons */}
          <div style={{ display: 'flex', overflowX: 'auto', borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)', background: theme === 'dark' ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.02)', padding: '0 4px' }}>
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ padding: '12px 12px 10px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer', background: 'none', border: 'none', borderBottom: `2px solid ${active ? '#7c3aed' : 'transparent'}`, color: active ? '#a78bfa' : 'rgba(148,163,184,0.6)', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <Icon style={{ width: 14, height: 14 }} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Active section label */}
          <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            {(() => {
              const t = TABS.find(x => x.id === tab)!;
              const Icon = t.icon;
              return (
                <>
                  <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(124,58,237,0.3)' }}>
                    <Icon style={{ width: 14, height: 14, color: '#a78bfa' }} />
                  </div>
                  <span style={{ color: '#a78bfa', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.label}</span>
                </>
              );
            })()}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tab === 'personal' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} placeholder="Your Full Name" value={data.name} onChange={e => set('name', e.target.value)} />
                <label style={labelStyle}>Phone</label>
                <input style={inputStyle} placeholder="+91-9876543210" value={data.phone} onChange={e => set('phone', e.target.value)} />
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} placeholder="yourname@email.com" value={data.email} onChange={e => set('email', e.target.value)} />
                <label style={labelStyle}>LinkedIn URL</label>
                <input style={inputStyle} placeholder="linkedin.com/in/your-profile" value={data.linkedin} onChange={e => set('linkedin', e.target.value)} />
              </motion.div>
            )}
            {tab === 'education' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={labelStyle}>University Name</label>
                <input style={inputStyle} placeholder="XYZ University" value={data.university} onChange={e => set('university', e.target.value)} />
                <label style={labelStyle}>Degree & Branch</label>
                <input style={inputStyle} placeholder="B.Tech — Computer Science & Engineering" value={data.degree} onChange={e => set('degree', e.target.value)} />
                <label style={labelStyle}>Year Range</label>
                <input style={inputStyle} placeholder="2023 – 2027" value={data.years} onChange={e => set('years', e.target.value)} />
                <label style={labelStyle}>City, State</label>
                <input style={inputStyle} placeholder="New Delhi, India" value={data.city} onChange={e => set('city', e.target.value)} />
                <label style={{ ...labelStyle, marginTop: 4 }}>Relevant Coursework (comma separated)</label>
                <textarea style={{ ...inputStyle, resize: 'none' } as React.CSSProperties} rows={3} placeholder="Data Structures, Algorithms, DBMS..." value={data.coursework} onChange={e => set('coursework', e.target.value)} />
              </motion.div>
            )}
            {tab === 'experience' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.experiences.map((exp, ei) => (
                  <div key={exp.id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#a78bfa', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Experience {ei + 1}</span>
                      <button onClick={() => delExp(exp.id)} style={delBtnStyle}><Trash2 style={{ width: 13, height: 13 }} /></button>
                    </div>
                    <input style={inputStyle} placeholder="Job Title" value={exp.title} onChange={e => setExp(exp.id, 'title', e.target.value)} />
                    <input style={inputStyle} placeholder="Company Name" value={exp.company} onChange={e => setExp(exp.id, 'company', e.target.value)} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <input style={inputStyle} placeholder="Date Range" value={exp.dates} onChange={e => setExp(exp.id, 'dates', e.target.value)} />
                      <input style={inputStyle} placeholder="Location" value={exp.location} onChange={e => setExp(exp.id, 'location', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ color: 'rgba(148,163,184,0.45)', fontSize: 11, margin: 0 }}>Bullet points:</p>
                      <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => generateAIBullets(exp)}
                        disabled={aiLoading === exp.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(167,139,250,0.35)', background: 'rgba(124,58,237,0.12)', color: '#a78bfa', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                        {aiLoading === exp.id
                          ? <><Loader2 style={{ width: 11, height: 11, animation: 'spin 1s linear infinite' }} /> Generating...</>
                          : <><Sparkles style={{ width: 11, height: 11 }} /> AI Suggest</>
                        }
                      </motion.button>
                    </div>
                    {exp.bullets.map((b, bi) => (
                      <input key={bi} style={inputStyle} placeholder={`Bullet ${bi + 1}`} value={b} onChange={e => setBullet(exp.id, bi, e.target.value)} />
                    ))}
                  </div>
                ))}
                <button onClick={addExp} style={addBtnStyle}><Plus style={{ width: 15, height: 15 }} /> Add Experience</button>
              </motion.div>
            )}
            {tab === 'projects' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.projects.map((proj, pi) => (
                  <div key={proj.id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#a78bfa', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Project {pi + 1}</span>
                      <button onClick={() => delProj(proj.id)} style={delBtnStyle}><Trash2 style={{ width: 13, height: 13 }} /></button>
                    </div>
                    <input style={inputStyle} placeholder="Project Name" value={proj.name} onChange={e => setProj(proj.id, 'name', e.target.value)} />
                    <input style={inputStyle} placeholder="Tech Stack (React, Node.js, ...)" value={proj.tech} onChange={e => setProj(proj.id, 'tech', e.target.value)} />
                    <p style={{ color: 'rgba(148,163,184,0.45)', fontSize: 11, margin: 0 }}>Bullet points:</p>
                    {proj.bullets.map((b, bi) => (
                      <input key={bi} style={inputStyle} placeholder={`Bullet ${bi + 1}`} value={b} onChange={e => setPBullet(proj.id, bi, e.target.value)} />
                    ))}
                  </div>
                ))}
                <button onClick={addProj} style={addBtnStyle}><Plus style={{ width: 15, height: 15 }} /> Add Project</button>
              </motion.div>
            )}
            {tab === 'skills' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Languages', key: 'langSkills' as keyof ResumeData, placeholder: 'Python, JavaScript, TypeScript, Java, SQL' },
                  { label: 'Frontend', key: 'frontendSkills' as keyof ResumeData, placeholder: 'React.js, Tailwind CSS, HTML5, CSS3' },
                  { label: 'Backend & APIs', key: 'backendSkills' as keyof ResumeData, placeholder: 'Node.js, Express.js, REST APIs' },
                  { label: 'Databases', key: 'dbSkills' as keyof ResumeData, placeholder: 'PostgreSQL, MongoDB, MySQL' },
                  { label: 'AI / ML', key: 'aiSkills' as keyof ResumeData, placeholder: 'NumPy, Pandas, Scikit-learn' },
                  { label: 'Tools', key: 'toolSkills' as keyof ResumeData, placeholder: 'Git, Docker, Postman, VS Code' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label style={{ ...labelStyle, display: 'block', marginBottom: 5 }}>{label}</label>
                    <input style={inputStyle} placeholder={placeholder} value={data[key] as string} onChange={e => set(key, e.target.value)} />
                  </div>
                ))}
              </motion.div>
            )}
            {tab === 'certs' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.certifications.map((cert, ci) => (
                  <div key={cert.id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#a78bfa', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cert {ci + 1}</span>
                      <button onClick={() => delCert(cert.id)} style={delBtnStyle}><Trash2 style={{ width: 13, height: 13 }} /></button>
                    </div>
                    <input style={inputStyle} placeholder="Certification Name — Issuer" value={cert.name} onChange={e => setCert(cert.id, 'name', e.target.value)} />
                    <input style={inputStyle} placeholder="Date (e.g. Nov 2025)" value={cert.date} onChange={e => setCert(cert.id, 'date', e.target.value)} />
                  </div>
                ))}
                <button onClick={addCert} style={addBtnStyle}><Plus style={{ width: 15, height: 15 }} /> Add Certification</button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── RIGHT: Preview Panel ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ flex: 1, background: theme === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.05)', overflow: 'auto', padding: '24px 32px', display: 'flex', justifyContent: 'center' }}>
          <div>
            <div style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.04)', borderRadius: '12px 12px 0 0', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 11, fontWeight: 500 }}>Resume Preview — A4</span>
              <div style={{ width: 60 }} />
            </div>
            <div ref={previewRef} style={{ boxShadow: '0 12px 50px rgba(0,0,0,0.6)', borderRadius: '0 0 4px 4px' }}>
              <ResumePreview d={data} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
