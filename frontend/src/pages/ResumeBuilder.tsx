import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Download, FileText, User, GraduationCap, Briefcase, Code2, Award, Wrench, Sparkles, Loader2, Save, CheckCircle, Palette } from 'lucide-react';
import { resumeAPI, resumeDataAPI } from '../services/api';
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

type Template = 'classic' | 'modern' | 'minimal'

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
  ],
  projects: [
    { id: uid(), name: 'Project Name — Brief Description', tech: 'React, Node.js, PostgreSQL, Tailwind CSS', bullets: ['Describe what you built and the problem it solves in one line.', 'Mention key technical decisions, architecture, or integrations used.', 'Quantify impact: X users, X% improvement, X features shipped.'] },
  ],
  langSkills: 'Python, JavaScript, TypeScript, Java, SQL',
  frontendSkills: 'React.js, Tailwind CSS, HTML5, CSS3',
  backendSkills: 'Node.js, Express.js, REST APIs, JWT Authentication',
  dbSkills: 'PostgreSQL, MongoDB, MySQL',
  aiSkills: 'NumPy, Pandas, Scikit-learn',
  toolSkills: 'Git, Docker, Postman, VS Code, Vercel',
  certifications: [
    { id: uid(), name: 'Certification Name — Issuing Organization', date: 'Mon 20XX' },
  ],
};

// ── Template: Classic (Times New Roman, ATS-friendly) ─────────────────────────
function ClassicTemplate({ d }: { d: ResumeData }) {
  const courses = d.coursework.split(',').map(s => s.trim()).filter(Boolean);
  const sh = (title: string) => (
    <div style={{ marginTop: 6, marginBottom: 3 }}>
      <div style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #000', paddingBottom: 1, lineHeight: 1.2 }}>{title}</div>
    </div>
  );
  return (
    <div style={{ width: 794, minHeight: 1123, background: '#fff', color: '#000', fontFamily: '"Times New Roman", Times, serif', fontSize: 10.5, lineHeight: 1.2, padding: '32px 46px', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <div style={{ fontSize: 24, fontWeight: 'bold', letterSpacing: 1, marginBottom: 2 }}>{d.name || 'Your Name'}</div>
        <div style={{ fontSize: 9.5, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {d.phone && <span>✆ {d.phone}</span>}
          {d.email && <span>✉ {d.email}</span>}
          {d.linkedin && <span>in {d.linkedin}</span>}
        </div>
      </div>
      {sh('Education')}
      <div style={{ marginBottom: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bold', fontSize: 10.5 }}>{d.university}</span>
          <span style={{ fontWeight: 'bold', fontSize: 9.5 }}>{d.years}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
          <span style={{ fontStyle: 'italic', fontSize: 9.5 }}>{d.degree}</span>
          <span style={{ fontStyle: 'italic', fontSize: 9.5 }}>{d.city}</span>
        </div>
      </div>
      {courses.length > 0 && (<>{sh('Relevant Coursework')}<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', rowGap: 2, marginBottom: 4 }}>{courses.map((c, i) => <div key={i} style={{ fontSize: 9.5, paddingLeft: 4 }}>• {c}</div>)}</div></>)}
      {d.experiences.length > 0 && (<>{sh('Experience')}{d.experiences.map(exp => (<div key={exp.id} style={{ marginBottom: 6 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 'bold', fontSize: 10.5 }}>{exp.title}</span><span style={{ fontWeight: 'bold', fontSize: 9.5 }}>{exp.dates}</span></div><div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}><span style={{ fontStyle: 'italic', fontSize: 9.5 }}>{exp.company}</span><span style={{ fontStyle: 'italic', fontSize: 9.5 }}>{exp.location}</span></div><ul style={{ margin: '2px 0 0', paddingLeft: 16, listStyleType: 'disc' }}>{exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i} style={{ fontSize: 9.5, lineHeight: 1.3, margin: '1px 0' }}>{b}</li>)}</ul></div>))}</>)}
      {d.projects.length > 0 && (<>{sh('Projects')}{d.projects.map(proj => (<div key={proj.id} style={{ marginBottom: 6 }}><div style={{ fontSize: 10.5 }}><span style={{ fontWeight: 'bold' }}>{proj.name}</span>{proj.tech && <span style={{ fontStyle: 'italic', fontSize: 9.5 }}> | {proj.tech}</span>}</div><ul style={{ margin: '2px 0 0', paddingLeft: 16, listStyleType: 'disc' }}>{proj.bullets.filter(b => b.trim()).map((b, i) => <li key={i} style={{ fontSize: 9.5, lineHeight: 1.3, margin: '1px 0' }}>{b}</li>)}</ul></div>))}</>)}
      {(d.langSkills || d.frontendSkills || d.backendSkills || d.dbSkills || d.aiSkills || d.toolSkills) && (<>{sh('Technical Skills')}<div style={{ fontSize: 9.5, lineHeight: 1.5 }}>{d.langSkills && <div><span style={{ fontWeight: 'bold' }}>Languages:</span> {d.langSkills}</div>}{d.frontendSkills && <div><span style={{ fontWeight: 'bold' }}>Frontend:</span> {d.frontendSkills}</div>}{d.backendSkills && <div><span style={{ fontWeight: 'bold' }}>Backend & APIs:</span> {d.backendSkills}</div>}{d.dbSkills && <div><span style={{ fontWeight: 'bold' }}>Databases:</span> {d.dbSkills}</div>}{d.aiSkills && <div><span style={{ fontWeight: 'bold' }}>AI / ML:</span> {d.aiSkills}</div>}{d.toolSkills && <div><span style={{ fontWeight: 'bold' }}>Tools:</span> {d.toolSkills}</div>}</div></>)}
      {d.certifications.length > 0 && (<>{sh('Certifications')}{d.certifications.map(cert => (<div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, lineHeight: 1.6 }}><span style={{ fontStyle: 'italic' }}>{cert.name}</span><span style={{ fontStyle: 'italic', whiteSpace: 'nowrap', marginLeft: 8 }}>{cert.date}</span></div>))}</>)}
    </div>
  );
}

// ── Template: Modern (Clean two-column) ───────────────────────────────────────
function ModernTemplate({ d }: { d: ResumeData }) {
  const allSkills = [d.langSkills, d.frontendSkills, d.backendSkills, d.dbSkills, d.aiSkills, d.toolSkills].filter(Boolean).join(', ').split(',').map(s => s.trim()).filter(Boolean);
  return (
    <div style={{ width: 794, minHeight: 1123, background: '#fff', color: '#1e293b', fontFamily: '"Calibri", "Arial", sans-serif', fontSize: 10, lineHeight: 1.35, boxSizing: 'border-box', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#1e3a5f', color: 'white', padding: '28px 18px', flexShrink: 0 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', lineHeight: 1.2, marginBottom: 6 }}>{d.name || 'Your Name'}</div>
          <div style={{ width: 32, height: 2, background: '#60a5fa', marginBottom: 10 }} />
          {d.phone && <div style={{ fontSize: 9, marginBottom: 3, opacity: 0.85 }}>📞 {d.phone}</div>}
          {d.email && <div style={{ fontSize: 9, marginBottom: 3, opacity: 0.85 }}>✉ {d.email}</div>}
          {d.linkedin && <div style={{ fontSize: 9, opacity: 0.85, wordBreak: 'break-all' }}>🔗 {d.linkedin}</div>}
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, color: '#60a5fa', marginBottom: 8 }}>Education</div>
          <div style={{ fontSize: 9.5, fontWeight: 'bold', marginBottom: 2 }}>{d.university}</div>
          <div style={{ fontSize: 9, opacity: 0.8, marginBottom: 2 }}>{d.degree}</div>
          <div style={{ fontSize: 9, opacity: 0.7 }}>{d.years} · {d.city}</div>
        </div>
        {allSkills.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, color: '#60a5fa', marginBottom: 8 }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {allSkills.slice(0, 20).map((s, i) => (
                <span key={i} style={{ fontSize: 8.5, padding: '2px 7px', background: 'rgba(96,165,250,0.2)', borderRadius: 3, border: '1px solid rgba(96,165,250,0.3)' }}>{s}</span>
              ))}
            </div>
          </div>
        )}
        {d.certifications.some(c => c.name.trim()) && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, color: '#60a5fa', marginBottom: 8 }}>Certifications</div>
            {d.certifications.filter(c => c.name.trim()).map(cert => (
              <div key={cert.id} style={{ fontSize: 9, opacity: 0.85, marginBottom: 5 }}>
                <div style={{ fontWeight: 'bold' }}>{cert.name}</div>
                <div style={{ opacity: 0.7 }}>{cert.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: '28px 24px' }}>
        {d.experiences.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, color: '#1e3a5f', borderBottom: '2px solid #1e3a5f', paddingBottom: 4, marginBottom: 10 }}>Experience</div>
            {d.experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 10.5, fontWeight: 'bold', color: '#1e293b' }}>{exp.title}</span>
                  <span style={{ fontSize: 9, color: '#64748b' }}>{exp.dates}</span>
                </div>
                <div style={{ fontSize: 9.5, color: '#3b82f6', fontStyle: 'italic', marginBottom: 3 }}>{exp.company} · {exp.location}</div>
                <ul style={{ margin: 0, paddingLeft: 14 }}>
                  {exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i} style={{ fontSize: 9.5, lineHeight: 1.4, margin: '2px 0', color: '#374151' }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
        {d.projects.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, color: '#1e3a5f', borderBottom: '2px solid #1e3a5f', paddingBottom: 4, marginBottom: 10 }}>Projects</div>
            {d.projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10.5, fontWeight: 'bold', color: '#1e293b' }}>{proj.name}</div>
                {proj.tech && <div style={{ fontSize: 9, color: '#7c3aed', fontStyle: 'italic', marginBottom: 3 }}>{proj.tech}</div>}
                <ul style={{ margin: 0, paddingLeft: 14 }}>
                  {proj.bullets.filter(b => b.trim()).map((b, i) => <li key={i} style={{ fontSize: 9.5, lineHeight: 1.4, margin: '2px 0', color: '#374151' }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
        {d.coursework && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, color: '#1e3a5f', borderBottom: '2px solid #1e3a5f', paddingBottom: 4, marginBottom: 8 }}>Relevant Coursework</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {d.coursework.split(',').map(s => s.trim()).filter(Boolean).map((c, i) => (
                <div key={i} style={{ fontSize: 9.5, color: '#374151' }}>• {c}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Template: Minimal (Clean, white-space focused) ────────────────────────────
function MinimalTemplate({ d }: { d: ResumeData }) {
  const sh = (title: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, marginBottom: 6 }}>
      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: '#6366f1' }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
    </div>
  );
  return (
    <div style={{ width: 794, minHeight: 1123, background: '#ffffff', color: '#1e293b', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontSize: 10, lineHeight: 1.4, padding: '36px 48px', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, color: '#0f172a', marginBottom: 4 }}>{d.name}</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 9.5, color: '#64748b' }}>
          {d.phone && <span>{d.phone}</span>}
          {d.email && <span>{d.email}</span>}
          {d.linkedin && <span>{d.linkedin}</span>}
        </div>
      </div>
      {sh('Education')}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 10.5 }}>{d.university}</div>
          <div style={{ fontSize: 9.5, color: '#64748b' }}>{d.degree}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 9.5, color: '#64748b' }}>
          <div>{d.years}</div>
          <div>{d.city}</div>
        </div>
      </div>
      {d.experiences.length > 0 && (<>{sh('Experience')}{d.experiences.map(exp => (<div key={exp.id} style={{ marginBottom: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}><span style={{ fontWeight: 700, fontSize: 10.5 }}>{exp.title} — {exp.company}</span><span style={{ fontSize: 9.5, color: '#64748b' }}>{exp.dates}</span></div><div style={{ fontSize: 9.5, color: '#64748b', marginBottom: 3 }}>{exp.location}</div><ul style={{ margin: 0, paddingLeft: 16 }}>{exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i} style={{ fontSize: 9.5, lineHeight: 1.4, marginBottom: 2 }}>{b}</li>)}</ul></div>))}</>)}
      {d.projects.length > 0 && (<>{sh('Projects')}{d.projects.map(proj => (<div key={proj.id} style={{ marginBottom: 10 }}><div style={{ fontWeight: 700, fontSize: 10.5 }}>{proj.name}{proj.tech && <span style={{ fontWeight: 400, fontSize: 9.5, color: '#64748b' }}> — {proj.tech}</span>}</div><ul style={{ margin: '2px 0 0', paddingLeft: 16 }}>{proj.bullets.filter(b => b.trim()).map((b, i) => <li key={i} style={{ fontSize: 9.5, lineHeight: 1.4, marginBottom: 2 }}>{b}</li>)}</ul></div>))}</>)}
      {(d.langSkills || d.frontendSkills || d.backendSkills) && (<>{sh('Skills')}<div style={{ fontSize: 9.5, lineHeight: 1.7 }}>{d.langSkills && <div><span style={{ fontWeight: 700 }}>Languages: </span>{d.langSkills}</div>}{d.frontendSkills && <div><span style={{ fontWeight: 700 }}>Frontend: </span>{d.frontendSkills}</div>}{d.backendSkills && <div><span style={{ fontWeight: 700 }}>Backend: </span>{d.backendSkills}</div>}{d.dbSkills && <div><span style={{ fontWeight: 700 }}>Databases: </span>{d.dbSkills}</div>}{d.toolSkills && <div><span style={{ fontWeight: 700 }}>Tools: </span>{d.toolSkills}</div>}</div></>)}
      {d.certifications.some(c => c.name.trim()) && (<>{sh('Certifications')}{d.certifications.filter(c => c.name.trim()).map(cert => (<div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, marginBottom: 3 }}><span>{cert.name}</span><span style={{ color: '#64748b' }}>{cert.date}</span></div>))}</>)}
    </div>
  );
}

function ResumePreview({ d, template }: { d: ResumeData; template: Template }) {
  if (template === 'modern') return <ModernTemplate d={d} />;
  if (template === 'minimal') return <MinimalTemplate d={d} />;
  return <ClassicTemplate d={d} />;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  const { theme } = useTheme();
  const [data, setData] = useState<ResumeData>(DEFAULT);
  const [template, setTemplate] = useState<Template>('classic');
  const [tab, setTab] = useState<string>('personal');
  const previewRef = useRef<HTMLDivElement>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [loading, setLoading] = useState(true);

  // Load saved resume on mount
  useEffect(() => {
    resumeDataAPI.load().then(res => {
      if (res.data) {
        setData(res.data.resumeData || DEFAULT);
        setTemplate(res.data.template || 'classic');
        setSaveStatus('idle');
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const saveResume = async () => {
    setSaving(true);
    try {
      await resumeDataAPI.save({ resumeData: data, template });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'white',
    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)', borderRadius: 8,
    color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, outline: 'none', boxSizing: 'border-box',
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
    setAiLoading(exp.id);
    try {
      const res = await resumeAPI.getAIBullets({ role: exp.title || 'Software Engineer', company: exp.company, context: exp.bullets.filter(b => b.trim()).join('. ') });
      const bullets = res.data.bullets as string[];
      setData(d => ({ ...d, experiences: d.experiences.map(e => e.id === exp.id ? { ...e, bullets: bullets.slice(0, 4) } : e) }));
    } catch { /* silent */ } finally {
      setAiLoading(null);
    }
  };

  const handleDownload = () => {
    const el = previewRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>${data.name || 'Resume'}</title><style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{background:white;}
      @page{size:A4;margin:0;}
      @media print{
        html,body{width:794px;overflow:hidden;}
        body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
      }
    </style></head><body>${el.outerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 600);
  };

  const TABS = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Code2 },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'certs', label: 'Certs', icon: Award },
  ];

  const TEMPLATES: { id: Template; label: string; desc: string }[] = [
    { id: 'classic', label: 'Classic', desc: 'ATS-friendly, Times New Roman' },
    { id: 'modern', label: 'Modern', desc: 'Two-column with sidebar' },
    { id: 'minimal', label: 'Minimal', desc: 'Clean, whitespace-focused' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#a78bfa' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Top Bar ── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(124,58,237,0.3)', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText style={{ width: 18, height: 18, color: 'white' }} />
          </div>
          <div>
            <h1 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 800, margin: 0 }}>Resume Builder</h1>
            <p style={{ color: 'rgba(167,139,250,0.75)', fontSize: 11, margin: 0 }}>Live preview · Auto-save supported</p>
          </div>
        </div>

        {/* Template selector */}
        <div style={{ display: 'flex', gap: 6 }}>
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={() => setTemplate(t.id)}
              title={t.desc}
              style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${template === t.id ? '#7c3aed' : (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`, background: template === t.id ? 'rgba(124,58,237,0.2)' : 'transparent', color: template === t.id ? '#c4b5fd' : (theme === 'dark' ? 'rgba(203,213,225,0.6)' : '#64748b'), cursor: 'pointer', fontSize: 12, fontWeight: template === t.id ? 700 : 500 }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Save status */}
          {saveStatus === 'saved' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#4ade80', fontSize: 12, fontWeight: 600 }}>
              <CheckCircle size={14} /> Saved
            </div>
          )}
          {saveStatus === 'error' && (
            <span style={{ color: '#f87171', fontSize: 12 }}>Save failed</span>
          )}

          <motion.button onClick={saveResume} disabled={saving}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
            {saving ? 'Saving...' : 'Save'}
          </motion.button>

          <motion.button onClick={handleDownload}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#7c3aed', color: 'white', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
            <Download style={{ width: 14, height: 14 }} /> Download PDF
          </motion.button>
        </div>
      </motion.div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* ── LEFT: Form Panel ── */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ width: 380, flexShrink: 0, background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', overflowX: 'auto', borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)', background: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.01)', padding: '0 4px' }}>
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ padding: '11px 10px 9px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer', background: 'none', border: 'none', borderBottom: `2px solid ${active ? '#7c3aed' : 'transparent'}`, color: active ? '#a78bfa' : 'rgba(148,163,184,0.6)', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <Icon style={{ width: 14, height: 14 }} />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                      <span style={{ color: '#a78bfa', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Exp {ei + 1}</span>
                      <button onClick={() => delExp(exp.id)} style={delBtnStyle}><Trash2 style={{ width: 13, height: 13 }} /></button>
                    </div>
                    <input style={inputStyle} placeholder="Job Title" value={exp.title} onChange={e => setExp(exp.id, 'title', e.target.value)} />
                    <input style={inputStyle} placeholder="Company Name" value={exp.company} onChange={e => setExp(exp.id, 'company', e.target.value)} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <input style={inputStyle} placeholder="Date Range" value={exp.dates} onChange={e => setExp(exp.id, 'dates', e.target.value)} />
                      <input style={inputStyle} placeholder="Location" value={exp.location} onChange={e => setExp(exp.id, 'location', e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ color: 'rgba(148,163,184,0.5)', fontSize: 11, margin: 0 }}>Bullet points:</p>
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={() => generateAIBullets(exp)} disabled={aiLoading === exp.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(167,139,250,0.35)', background: 'rgba(124,58,237,0.12)', color: '#a78bfa', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                        {aiLoading === exp.id ? <><Loader2 style={{ width: 11, height: 11, animation: 'spin 1s linear infinite' }} /> Generating...</> : <><Sparkles style={{ width: 11, height: 11 }} /> AI Suggest</>}
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
                    <input style={inputStyle} placeholder="Tech Stack" value={proj.tech} onChange={e => setProj(proj.id, 'tech', e.target.value)} />
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ flex: 1, background: theme === 'dark' ? 'rgba(0,0,0,0.3)' : '#f1f5f9', overflow: 'auto', padding: '24px 32px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div>
            {/* Browser chrome */}
            <div style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)', borderRadius: '12px 12px 0 0', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 7 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
              </div>
              <span style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#94a3b8', fontSize: 11 }}>
                Resume Preview — A4 · {template.charAt(0).toUpperCase() + template.slice(1)} Template
              </span>
              <div style={{ width: 60 }} />
            </div>
            <div ref={previewRef} style={{ boxShadow: '0 12px 50px rgba(0,0,0,0.3)', borderRadius: '0 0 4px 4px' }}>
              <ResumePreview d={data} template={template} />
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
