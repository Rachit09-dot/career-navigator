import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ArrowLeft, Check, Loader2, Search, X,
  Cpu, Heart, TrendingUp, Palette, Scale, GraduationCap,
  Radio, Building, Leaf, BookOpen, Briefcase, RefreshCw,
  Award, Atom, Pen, Zap, Globe, Music, ChefHat, Shield,
  FlaskConical, Sprout, Target, Brain, School,
  Rocket, MapPin, Map, Wifi, Plane, BookMarked, Star
} from 'lucide-react'
import { profileAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { STREAMS } from '../data/streams.config'
import { INDIA_COLLEGES } from '../data/colleges'
import { INDIA_LOCATIONS } from '../data/cities'
import { useTheme } from '../context/ThemeContext'

// ── Autocomplete Component ────────────────────────────────────────────────────
function AutocompleteInput({
  value, onChange, placeholder, suggestions, style
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  suggestions: string[]
  style?: React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState<string[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = (v: string) => {
    onChange(v)
    if (v.length >= 1) {
      const q = v.toLowerCase()
      setFiltered(suggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 8))
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
    border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)',
    borderRadius: 12, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
    ...style,
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        onFocus={() => { if (value.length >= 1 && filtered.length > 0) setOpen(true) }}
        placeholder={placeholder}
        style={inputStyle}
      />
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: theme === 'dark' ? '#1e1b4b' : 'white',
          border: theme === 'dark' ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(124,58,237,0.2)',
          borderRadius: 12, marginTop: 4, overflow: 'hidden',
          boxShadow: theme === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          {filtered.map((item, i) => (
            <div key={i}
              onMouseDown={() => { onChange(item); setOpen(false) }}
              style={{
                padding: '10px 16px', color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : '#1e293b', fontSize: 13,
                cursor: 'pointer', borderBottom: i < filtered.length - 1 ? (theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)') : 'none',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = theme === 'dark' ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Stream icon map ────────────────────────────────────────────────────────────
const STREAM_ICONS: Record<string, React.ReactNode> = {
  engineering: <Cpu className="w-5 h-5" />,
  medical: <Heart className="w-5 h-5" />,
  commerce: <TrendingUp className="w-5 h-5" />,
  arts: <Palette className="w-5 h-5" />,
  law: <Scale className="w-5 h-5" />,
  education: <GraduationCap className="w-5 h-5" />,
  mass_comm: <Radio className="w-5 h-5" />,
  hotel: <Building className="w-5 h-5" />,
  agriculture: <Leaf className="w-5 h-5" />,
  science: <Atom className="w-5 h-5" />,
  design: <Pen className="w-5 h-5" />,
  it: <Zap className="w-5 h-5" />,
  social: <Globe className="w-5 h-5" />,
  fine_arts: <Music className="w-5 h-5" />,
  hospitality: <ChefHat className="w-5 h-5" />,
  defence: <Shield className="w-5 h-5" />,
  pharmacy: <FlaskConical className="w-5 h-5" />,
  environment: <Sprout className="w-5 h-5" />,
}

const DEFAULT_ICON = <BookOpen className="w-5 h-5" />

// ── Data ──────────────────────────────────────────────────────────────────────
const CURRENT_STATUS = [
  { id: 'studying', label: 'Still Studying', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'graduated', label: 'Just Graduated', icon: <Award className="w-4 h-4" /> },
  { id: 'working', label: 'Working Professional', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'career_change', label: 'Career Change', icon: <RefreshCw className="w-4 h-4" /> },
]
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Final Year', 'Post Graduate']

// Field-specific year options based on course duration
const FIELD_YEARS: Record<string, string[]> = {
  // 4-year B.Tech/B.E.
  engineering: ['1st Year', '2nd Year', '3rd Year', '4th Year (Final)', 'Post Graduate (M.Tech)'],
  // 5.5-year MBBS
  medical: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Internship', 'Post Graduate (MD/MS)'],
  // 3-year B.Com/BBA/BA
  commerce: ['1st Year', '2nd Year', '3rd Year (Final)', 'Post Graduate (MBA/M.Com)'],
  arts: ['1st Year', '2nd Year', '3rd Year (Final)', 'Post Graduate (MA)'],
  science: ['1st Year', '2nd Year', '3rd Year (Final)', 'Post Graduate (M.Sc)'],
  // 3-year LLB or 5-year integrated
  law: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year (Final)', 'Post Graduate (LLM)'],
  // 4-year B.Ed or 2-year
  education: ['1st Year', '2nd Year', '3rd Year', '4th Year (Final)', 'Post Graduate (M.Ed)'],
  // 4-year B.Des
  design: ['1st Year', '2nd Year', '3rd Year', '4th Year (Final)', 'Post Graduate (M.Des)'],
  // 3-year BHM
  hotel: ['1st Year', '2nd Year', '3rd Year (Final)', 'Post Graduate'],
  // 4-year B.Sc Agriculture
  agriculture: ['1st Year', '2nd Year', '3rd Year', '4th Year (Final)', 'Post Graduate (M.Sc)'],
  // 3-year BJMC/BMC
  mass_communication: ['1st Year', '2nd Year', '3rd Year (Final)', 'Post Graduate (MJMC)'],
  mass_comm: ['1st Year', '2nd Year', '3rd Year (Final)', 'Post Graduate (MJMC)'],
  // 3-year BSW
  social_work: ['1st Year', '2nd Year', '3rd Year (Final)', 'Post Graduate (MSW)'],
  social: ['1st Year', '2nd Year', '3rd Year (Final)', 'Post Graduate (MSW)'],
  // NDA/CDS — 3 years
  defence: ['1st Year', '2nd Year', '3rd Year (Final)', 'Training Phase'],
  // 4-year BFA
  fine_arts: ['1st Year', '2nd Year', '3rd Year', '4th Year (Final)', 'Post Graduate (MFA)'],
  // 3-year B.Sc Paramedical
  paramedical: ['1st Year', '2nd Year', '3rd Year (Final)', 'Post Graduate'],
  // 2-year Diploma/ITI
  diploma: ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', 'Final Semester'],
  // Civil Services — no fixed year
  civil_services: ['Preparing (Fresher)', 'Preparing (1-2 years)', 'Preparing (3+ years)', 'Appeared in Prelims'],
}

function getYearsForStream(streamId: string): string[] {
  return FIELD_YEARS[streamId] || YEARS
}
const EXPERIENCE_LEVELS = [
  { id: 'fresher', label: 'Fresher (0 exp)', icon: <Sprout className="w-4 h-4" /> },
  { id: 'intern', label: 'Completed Internship', icon: <BookMarked className="w-4 h-4" /> },
  { id: '1-2', label: '1-2 years', icon: <Briefcase className="w-4 h-4" /> },
  { id: '3+', label: '3+ years', icon: <Star className="w-4 h-4" /> },
]
const PRIMARY_GOALS = [
  { id: 'job', label: 'Find a Job / Internship', icon: <Target className="w-4 h-4" /> },
  { id: 'career_discover', label: 'Discover the right career path', icon: <Brain className="w-4 h-4" /> },
  { id: 'skills', label: 'Improve my skills', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'higher_studies', label: 'Higher studies (MBA/MS/etc)', icon: <School className="w-4 h-4" /> },
  { id: 'startup', label: 'Start my own venture', icon: <Rocket className="w-4 h-4" /> },
]
const LOCATION_PREFS = [
  { id: 'city_only', label: 'My City Only', icon: <MapPin className="w-4 h-4" /> },
  { id: 'anywhere_india', label: 'Anywhere in India', icon: <Map className="w-4 h-4" /> },
  { id: 'remote', label: 'Remote preferred', icon: <Wifi className="w-4 h-4" /> },
  { id: 'relocate', label: 'Open to relocate', icon: <Plane className="w-4 h-4" /> },
]
const SALARY_RANGES = [
  { id: '0-3', label: 'Fresher (0-3 LPA)' },
  { id: '3-6', label: '3-6 LPA' },
  { id: '6-10', label: '6-10 LPA' },
  { id: '10+', label: '10+ LPA' },
]
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Urdu']
const STREAM_SKILLS: Record<string, string[]> = {
  engineering: ['Python', 'Java', 'C++', 'JavaScript', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Structures', 'Git', 'AWS', 'Docker'],
  medical: ['Patient Care', 'Clinical Skills', 'Anatomy', 'Pharmacology', 'Research', 'Medical Writing', 'First Aid', 'Diagnosis'],
  commerce: ['Accounting', 'Tally', 'Excel', 'Financial Analysis', 'GST', 'Taxation', 'MS Office', 'Communication', 'Marketing'],
  arts: ['Research', 'Writing', 'Communication', 'Critical Thinking', 'Public Speaking', 'Content Creation', 'Social Media'],
  science: ['Lab Techniques', 'Research Methodology', 'Data Analysis', 'Scientific Writing', 'Statistics', 'Python/R', 'Experimentation', 'Critical Thinking'],
  law: ['Legal Research', 'Drafting', 'Litigation', 'Contract Law', 'Communication', 'Negotiation', 'MS Word'],
  education: ['Teaching Methods', 'Lesson Planning', 'Child Psychology', 'Classroom Management', 'Communication', 'Assessment & Evaluation', 'Educational Technology'],
  design: ['Figma', 'Photoshop', 'Illustrator', 'UI/UX', 'Canva', 'Sketch', 'Typography', 'Color Theory'],
  hospitality: ['Customer Service', 'Food Safety & Hygiene', 'Hotel Management Software', 'Communication', 'Event Planning', 'Housekeeping', 'Front Office Operations'],
  agriculture: ['Crop Management', 'Soil Testing', 'Irrigation Techniques', 'Pest Control', 'Agricultural Technology', 'Farm Management', 'Organic Farming'],
  media: ['Content Writing', 'Video Editing', 'Photography', 'Social Media Management', 'Adobe Premiere', 'Journalism', 'SEO', 'Communication'],
  sports: ['Sports Coaching', 'Fitness Training', 'Sports Psychology', 'Nutrition & Diet', 'First Aid/CPR', 'Sports Analytics', 'Yoga/Physiotherapy', 'Team Management'],
  social_work: ['Community Engagement', 'Counseling', 'Project Management', 'Report Writing', 'Fundraising', 'Social Research', 'Advocacy', 'Case Management'],
  vocational: ['Technical Skills', 'Tool Handling', 'Safety Practices', 'Blueprint Reading', 'Welding/Fitting', 'Electrical Work', 'Plumbing', 'Problem Solving'],
  defence: ['Physical Fitness', 'Leadership', 'Discipline', 'Weapons Training', 'Navigation', 'Tactical Skills', 'First Aid', 'Team Coordination'],
  civil_services: ['General Knowledge', 'Current Affairs', 'Reasoning', 'English', 'Essay Writing', 'Interview Skills', 'Subject Knowledge', 'Time Management'],
  fine_arts: ['Drawing & Sketching', 'Painting', 'Sculpture', 'Art History', 'Creativity', 'Performance', 'Stage Presence', 'Music/Dance Technique'],
  paramedical: ['Patient Assessment', 'Rehabilitation Techniques', 'Medical Equipment Operation', 'Clinical Skills', 'Documentation', 'First Aid', 'Anatomy & Physiology'],
  default: ['Communication', 'MS Office', 'Research', 'Problem Solving', 'Teamwork', 'Time Management'],
}

// ── 3D Tilt Card ──────────────────────────────────────────────────────────────
function TiltCard({ selected, onClick, children }: {
  selected: boolean; onClick: () => void; children: React.ReactNode
}) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rx = (y - cy) / 14
    const ry = (cx - x) / 14
    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`
  }
  const { theme } = useTheme()
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'all 0.18s ease',
        cursor: 'pointer',
        background: selected
          ? (theme === 'dark' ? 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(91,33,182,0.4))' : 'linear-gradient(135deg, #7c3aed, #5b21b6)')
          : (theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'white'),
        border: selected
          ? (theme === 'dark' ? '1.5px solid rgba(167,139,250,0.7)' : '1.5px solid rgba(124,58,237,0.4)')
          : (theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)'),
        borderRadius: 16,
        boxShadow: selected
          ? (theme === 'dark' ? '0 0 28px rgba(124,58,237,0.45), inset 0 1px 0 rgba(255,255,255,0.12)' : '0 0 20px rgba(124,58,237,0.15)')
          : (theme === 'dark' ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.04)'),
        color: selected ? 'white' : (theme === 'dark' ? 'white' : '#1e293b'),
        position: 'relative',
        padding: 12,
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.border = theme === 'dark' ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(124,58,237,0.3)'
          e.currentTarget.style.background = theme === 'dark' ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)'
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
          e.currentTarget.style.border = theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)'
          e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'white'
        } else {
          e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
        }
      }}
    >
      {/* top shimmer line */}
      {selected && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, borderRadius: '16px 16px 0 0' }} />
      )}
      {selected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
          style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(124,58,237,0.6)' }}>
          <Check style={{ width: 11, height: 11, color: 'white' }} />
        </motion.div>
      )}
      {children}
    </div>
  )
}

// ── Stagger variants ──────────────────────────────────────────────────────────
const container = { animate: { transition: { staggerChildren: 0.06 } } }
const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const slideVariants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 28 } },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60, transition: { duration: 0.18 } }),
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 3, height: 18, borderRadius: 999 }} />
      <span style={{ color: theme === 'dark' ? '#c4b5fd' : '#7c3aed', fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.01em' }}>{children}</span>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate()
  const updateUser = useAuthStore(s => s.updateUser)
  const { theme } = useTheme()
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [saving, setSaving] = useState(false)
  const [fieldSearch, setFieldSearch] = useState('')
  const [skillInput, setSkillInput] = useState('')

  const [data, setData] = useState({
    stream: '', field: '', current_status: '',
    college: '', current_year: '', city: '', experience_level: '',
    primary_goal: '', location_pref: '', salary_range: '',
    skills: [] as string[], languages: [] as string[],
  })

  const TOTAL = 5
  const progress = (step / TOTAL) * 100
  const selectedStream = STREAMS.find(s => s.id === data.stream)
  const filteredFields = selectedStream?.fields.filter(f =>
    f.label.toLowerCase().includes(fieldSearch.toLowerCase())
  ) || []
  const streamKey = data.stream in STREAM_SKILLS ? data.stream : 'default'
  const suggestedSkills = STREAM_SKILLS[streamKey]
  const STEP_LABELS = ['Field of Study', 'Specialization', 'Where Are You', 'Your Goals', 'Your Skills']

  const set = (k: string, v: string) => setData(d => ({ ...d, [k]: v }))
  const next = () => { setDir(1); setStep(s => s + 1); setFieldSearch('') }
  const back = () => { setDir(-1); setStep(s => s - 1) }
  const skip = () => { updateUser({ profileComplete: true }); navigate('/dashboard') }

  const toggleSkill = (s: string) => setData(d => ({
    ...d, skills: d.skills.includes(s) ? d.skills.filter(x => x !== s) : [...d.skills, s]
  }))
  const addCustomSkill = () => {
    const s = skillInput.trim()
    if (s && !data.skills.includes(s)) setData(d => ({ ...d, skills: [...d.skills, s] }))
    setSkillInput('')
  }
  const toggleLang = (l: string) => setData(d => ({
    ...d, languages: d.languages.includes(l) ? d.languages.filter(x => x !== l) : [...d.languages, l]
  }))

  const finish = async () => {
    setSaving(true)
    try {
      const fieldLabel = selectedStream?.fields.find(f => f.id === data.field)?.label || data.field
      await profileAPI.updateProfile({
        college: data.college,
        current_year: data.current_year || data.current_status,
        location: data.city,
        career_goal: data.primary_goal,
        field_of_study: selectedStream ? `${selectedStream.label}${fieldLabel ? ' — ' + fieldLabel : ''}` : '',
        skills: data.skills.join(', '),
        bio: `${data.experience_level ? 'Experience: ' + data.experience_level + '. ' : ''}${data.location_pref ? 'Location: ' + data.location_pref : ''}`,
      })
      updateUser({ profileComplete: true })
    } catch {}
    navigate('/dashboard')
    setSaving(false)
  }

  const ContinueBtn = ({ canNext = true, onNext = next }: { canNext?: boolean; onNext?: () => void }) => (
    <motion.button onClick={onNext} disabled={!canNext}
      whileHover={canNext ? { y: -2, boxShadow: '0 12px 30px rgba(124,58,237,0.4)' } : {}}
      whileTap={canNext ? { scale: 0.98 } : {}}
      style={{
        background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
        borderRadius: 14, fontWeight: 600, fontSize: 16, 
        color: 'white',
        padding: '14px 24px', transition: 'background 0.2s ease, color 0.2s ease, opacity 0.2s ease',
        opacity: canNext ? 1 : 0.5,
        cursor: canNext ? 'pointer' : 'not-allowed',
        border: 'none', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
      {step === TOTAL ? (saving ? <><Loader2 className="w-5 h-5 animate-spin" />Saving...</> : 'Launch Dashboard 🚀') : <>Continue <ArrowRight className="w-5 h-5" /></>}
    </motion.button>
  )

  const BackBtn = () => (
    <motion.button onClick={back} whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }}
      style={{
        background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)',
        borderRadius: 14, color: theme === 'dark' ? 'white' : '#1e293b', padding: '14px 20px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500,
      }}>
      <ArrowLeft className="w-4 h-4" /> Back
    </motion.button>
  )

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>

      {/* Animated blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div animate={{ x: [-30, 30, -30], y: [-20, 20, -20] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <motion.div animate={{ x: [20, -20, 20], y: [30, -30, 30] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '10%', right: '5%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(167,139,250,0.15), transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 300, height: 300, background: 'radial-gradient(circle, rgba(91,33,182,0.1), transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />
        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.4 }} />
      </div>

      <div style={{ width: '100%', maxWidth: 560, position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 30, fontWeight: 800, margin: 0, lineHeight: 1.2, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>
                Let's build your career profile
              </h1>
              <p style={{ color: theme === 'dark' ? 'rgba(167,139,250,0.8)' : '#7c3aed', fontSize: 13, marginTop: 6, fontFamily: "'Inter', sans-serif" }}>
                2 minutes · Unlocks everything personalized for you
              </p>
            </div>
            <button onClick={skip} style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#64748b', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
              Skip this step
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-2">
            <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : '#64748b', fontSize: 13 }}>Step {step} of {TOTAL} · {STEP_LABELS[step - 1]}</span>
            <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : '#64748b', fontSize: 13 }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
            <motion.div animate={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 80 }}
              style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', height: '100%', boxShadow: theme === 'dark' ? '0 0 12px rgba(124,58,237,0.6)' : 'none', borderRadius: 999 }} />
          </div>
        </motion.div>

        {/* Card */}
        <AnimatePresence mode="wait" custom={dir}>

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="s1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              style={{ backdropFilter: 'blur(24px)', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(0,0,0,0.05)', borderRadius: 24, padding: 28, boxShadow: theme === 'dark' ? '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' : '0 8px 40px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <SectionLabel>What do you study?</SectionLabel>
              <motion.div variants={container} initial="initial" animate="animate"
                className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1 mb-5">
                {STREAMS.map(stream => {
                  const isSel = data.stream === stream.id;
                  return (
                    <motion.div key={stream.id} variants={item}>
                      <TiltCard selected={isSel} onClick={() => { set('stream', stream.id); set('field', '') }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, border: isSel ? '1px solid rgba(255,255,255,0.3)' : (theme === 'dark' ? '1px solid rgba(167,139,250,0.3)' : '1px solid rgba(124,58,237,0.2)'), display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, boxShadow: theme === 'dark' ? '0 4px 12px rgba(124,58,237,0.3)' : 'none', color: isSel ? 'white' : (theme === 'dark' ? 'white' : '#7c3aed') }}>
                          {STREAM_ICONS[stream.id] || DEFAULT_ICON}
                        </div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.3, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{stream.label}</div>
                      </TiltCard>
                    </motion.div>
                  )
                })}
              </motion.div>

              <SectionLabel>Where are you right now?</SectionLabel>
              <motion.div variants={container} initial="initial" animate="animate" className="grid grid-cols-2 gap-2 mb-5">
                {CURRENT_STATUS.map(s => {
                  const isSel = data.current_status === s.id;
                  return (
                    <motion.div key={s.id} variants={item}>
                      <TiltCard selected={isSel} onClick={() => set('current_status', s.id)}>
                        <div className="flex items-center gap-2">
                          <div style={{ width: 28, height: 28, borderRadius: 6, background: isSel ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSel ? 'white' : (theme === 'dark' ? '#c4b5fd' : '#7c3aed') }}>
                            {s.icon}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.label}</span>
                        </div>
                      </TiltCard>
                    </motion.div>
                  )
                })}
              </motion.div>
              <ContinueBtn canNext={!!data.stream && !!data.current_status} />
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="s2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              style={{ backdropFilter: 'blur(24px)', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(0,0,0,0.05)', borderRadius: 24, padding: 28, boxShadow: theme === 'dark' ? '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' : '0 8px 40px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              {selectedStream ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme === 'dark' ? 'white' : '#7c3aed' }}>
                      {STREAM_ICONS[selectedStream.id] || DEFAULT_ICON}
                    </div>
                    <div>
                      <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: 700, fontSize: 18 }}>{selectedStream.label}</div>
                      <div style={{ color: theme === 'dark' ? 'rgba(148,163,184,1)' : '#64748b', fontSize: 13 }}>Select your specific course / branch</div>
                    </div>
                  </div>
                  <div style={{ position: 'relative', marginBottom: 12 }}>
                    <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: theme === 'dark' ? 'rgba(148,163,184,1)' : '#94a3b8' }} />
                    <input type="text" value={fieldSearch} onChange={e => setFieldSearch(e.target.value)}
                      placeholder="Search your course..."
                      style={{ width: '100%', paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10, background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)', borderRadius: 12, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <motion.div variants={container} initial="initial" animate="animate"
                    className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1 mb-4">
                    {filteredFields.map(field => (
                      <motion.div key={field.id} variants={item}>
                        <TiltCard selected={data.field === field.id} onClick={() => set('field', field.id)}>
                          <div className="flex items-center gap-2">
                            <div style={{ width: 26, height: 26, borderRadius: 7, background: data.field === field.id ? 'rgba(167,139,250,0.25)' : 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <BookOpen style={{ width: 13, height: 13, color: data.field === field.id ? '#e9d5ff' : '#a78bfa' }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{field.label}</span>
                          </div>
                        </TiltCard>
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              ) : (
                <p style={{ color: 'rgba(148,163,184,1)', textAlign: 'center', padding: '32px 0' }}>Please go back and select a field first</p>
              )}
              <div className="flex gap-3">
                <BackBtn />
                <div style={{ flex: 1 }}><ContinueBtn canNext={!!data.field} /></div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.div key="s3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              style={{ backdropFilter: 'blur(24px)', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(0,0,0,0.05)', borderRadius: 24, padding: 28, boxShadow: theme === 'dark' ? '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' : '0 8px 40px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 22, fontWeight: 800, marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.3px' }}>Where Are You Now?</div>
              <div style={{ color: theme === 'dark' ? 'rgba(167,139,250,0.7)' : '#7c3aed', fontSize: 13, marginBottom: 20 }}>Tell us about your college, year and location</div>
              <div className="space-y-4">
                <div>
                  <SectionLabel>College / University</SectionLabel>
                  <AutocompleteInput
                    value={data.college}
                    onChange={v => set('college', v)}
                    placeholder="IIT Delhi, AIIMS, Delhi University, GSFC University..."
                    suggestions={INDIA_COLLEGES}
                  />
                </div>
                {(data.current_status === 'studying' || !data.current_status) && (
                  <div>
                    <SectionLabel>Current Year</SectionLabel>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {getYearsForStream(data.stream).map(y => (
                        <TiltCard key={y} selected={data.current_year === y} onClick={() => set('current_year', y)}>
                          <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 500 }}>{y}</div>
                        </TiltCard>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <SectionLabel>City</SectionLabel>
                  <AutocompleteInput
                    value={data.city}
                    onChange={v => set('city', v)}
                    placeholder="Mumbai, Vadodara, Delhi, Bangalore..."
                    suggestions={INDIA_LOCATIONS}
                  />
                </div>
                <div>
                  <SectionLabel>Experience Level</SectionLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPERIENCE_LEVELS.map(e => (
                      <TiltCard key={e.id} selected={data.experience_level === e.id} onClick={() => set('experience_level', e.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: data.experience_level === e.id ? 'rgba(167,139,250,0.25)' : 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: data.experience_level === e.id ? '#e9d5ff' : '#a78bfa' }}>
                            {e.icon}
                          </div>
                          <span style={{ fontSize: 12.5, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{e.label}</span>
                        </div>
                      </TiltCard>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <BackBtn />
                <div style={{ flex: 1 }}><ContinueBtn canNext={!!data.college && !!data.city} /></div>
              </div>
            </motion.div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <motion.div key="s4" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              style={{ backdropFilter: 'blur(24px)', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(0,0,0,0.05)', borderRadius: 24, padding: 28, boxShadow: theme === 'dark' ? '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' : '0 8px 40px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 22, fontWeight: 800, marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.3px' }}>What Do You Want?</div>
              <div style={{ color: theme === 'dark' ? 'rgba(167,139,250,0.7)' : '#7c3aed', fontSize: 13, marginBottom: 20 }}>Tell us your goal and preferences</div>
              <div className="space-y-4">
                <div>
                  <SectionLabel>Primary Goal</SectionLabel>
                  <motion.div variants={container} initial="initial" animate="animate" className="space-y-2">
                    {PRIMARY_GOALS.map(g => (
                      <motion.div key={g.id} variants={item}>
                        <TiltCard selected={data.primary_goal === g.id} onClick={() => set('primary_goal', g.id)}>
                          <div className="flex items-center gap-3">
                            <div style={{ width: 32, height: 32, borderRadius: 9, background: data.primary_goal === g.id ? 'rgba(255,255,255,0.1)' : (theme === 'dark' ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)'), border: theme === 'dark' ? '1px solid rgba(124,58,237,0.35)' : '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: data.primary_goal === g.id ? 'white' : (theme === 'dark' ? '#c4b5fd' : '#7c3aed') }}>
                              {g.icon}
                            </div>
                            <span style={{ fontSize: 13.5, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{g.label}</span>
                          </div>
                        </TiltCard>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                <div>
                  <SectionLabel>Preferred Location</SectionLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {LOCATION_PREFS.map(l => (
                      <TiltCard key={l.id} selected={data.location_pref === l.id} onClick={() => set('location_pref', l.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: data.location_pref === l.id ? 'rgba(255,255,255,0.1)' : (theme === 'dark' ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)'), border: theme === 'dark' ? '1px solid rgba(124,58,237,0.35)' : '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: data.location_pref === l.id ? 'white' : (theme === 'dark' ? '#c4b5fd' : '#7c3aed') }}>
                            {l.icon}
                          </div>
                          <span style={{ fontSize: 12.5, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{l.label}</span>
                        </div>
                      </TiltCard>
                    ))}
                  </div>
                </div>
                <div>
                  <SectionLabel>Expected Salary <span style={{ opacity: 0.6, fontWeight: 400 }}>(optional)</span></SectionLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {SALARY_RANGES.map(s => (
                      <TiltCard key={s.id} selected={data.salary_range === s.id} onClick={() => set('salary_range', s.id)}>
                        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                      </TiltCard>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <BackBtn />
                <div style={{ flex: 1 }}><ContinueBtn canNext={!!data.primary_goal} /></div>
              </div>
            </motion.div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <motion.div key="s5" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit"
              style={{ backdropFilter: 'blur(24px)', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(0,0,0,0.05)', borderRadius: 24, padding: 28, boxShadow: theme === 'dark' ? '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' : '0 8px 40px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 22, fontWeight: 800, marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.3px' }}>Your Skills</div>
              <div style={{ color: theme === 'dark' ? 'rgba(167,139,250,0.7)' : '#7c3aed', fontSize: 13, marginBottom: 20 }}>Select the skills you already have</div>

              <div className="mb-4">
                <SectionLabel>Suggested Skills {selectedStream && <span style={{ opacity: 0.6 }}>({selectedStream.label})</span>}</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map(skill => (
                    <motion.button key={skill} onClick={() => toggleSkill(skill)}
                      whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }} whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        background: data.skills.includes(skill) ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : (theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)'),
                        color: data.skills.includes(skill) ? 'white' : (theme === 'dark' ? 'white' : '#0f172a'), border: data.skills.includes(skill) ? '1px solid #7c3aed' : (theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)'),
                        transition: 'all 0.15s ease',
                      } as React.CSSProperties}>{skill}</motion.button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <SectionLabel>Add Custom Skill</SectionLabel>
                <div className="flex gap-2">
                  <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomSkill()}
                    placeholder="Type a skill and press Enter..."
                    style={{ flex: 1, padding: '10px 14px', background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)', borderRadius: 12, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, outline: 'none' }} />
                  <motion.button onClick={addCustomSkill} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                    style={{ padding: '10px 16px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 12, color: theme === 'dark' ? 'white' : '#7c3aed', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Add</motion.button>
                </div>
              </div>

              {data.skills.length > 0 && (
                <div className="mb-4">
                  <SectionLabel>Selected ({data.skills.length})</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map(skill => (
                      <motion.span key={skill} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.5)', borderRadius: 999, color: 'white', fontSize: 13, fontWeight: 500 }}>
                        {skill}
                        <button onClick={() => toggleSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', padding: 0 }}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-5">
                <SectionLabel>Languages <span style={{ opacity: 0.6, fontWeight: 400 }}>(optional)</span></SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <motion.button key={lang} onClick={() => toggleLang(lang)}
                      whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        background: data.languages.includes(lang) ? 'linear-gradient(135deg, #5b21b6, #4c1d95)' : (theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)'),
                        color: data.languages.includes(lang) ? 'white' : (theme === 'dark' ? 'white' : '#0f172a'), border: data.languages.includes(lang) ? '1px solid #7c3aed' : (theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.1)'),
                        transition: 'all 0.15s ease',
                      } as React.CSSProperties}>{lang}</motion.button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <BackBtn />
                <div style={{ flex: 1 }}><ContinueBtn onNext={finish} /></div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
