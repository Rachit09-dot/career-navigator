import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const fields = [
  {
    id: 'cse', label: 'CSE / IT', emoji: '💻',
    roles: ['Software Engineer', 'Data Scientist', 'DevOps Engineer', 'Full Stack Developer'],
    skills: ['DSA', 'System Design', 'React/Node', 'Cloud (AWS/GCP)'],
    salary: '₹6L – ₹40L+',
    companies: ['Google', 'Microsoft', 'Amazon', 'Flipkart'],
    color: '#a78bfa',
  },
  {
    id: 'ece', label: 'ECE / EE', emoji: '⚡',
    roles: ['Embedded Engineer', 'VLSI Designer', 'IoT Developer', 'RF Engineer'],
    skills: ['C/C++', 'VHDL/Verilog', 'Arduino/RPi', 'Signal Processing'],
    salary: '₹4L – ₹25L+',
    companies: ['Intel', 'Qualcomm', 'Texas Instruments', 'Samsung'],
    color: '#60a5fa',
  },
  {
    id: 'mech', label: 'Mechanical', emoji: '⚙️',
    roles: ['Design Engineer', 'Manufacturing Engineer', 'CAD Specialist', 'R&D Engineer'],
    skills: ['AutoCAD', 'SolidWorks', 'ANSYS', 'GD&T'],
    salary: '₹3.5L – ₹18L+',
    companies: ['Tata Motors', 'L&T', 'Mahindra', 'ISRO'],
    color: '#fbbf24',
  },
  {
    id: 'civil', label: 'Civil', emoji: '🏗️',
    roles: ['Structural Engineer', 'Site Engineer', 'Urban Planner', 'Project Manager'],
    skills: ['AutoCAD', 'STAAD Pro', 'Revit', 'Project Management'],
    salary: '₹3L – ₹15L+',
    companies: ['L&T', 'DLF', 'NHAI', 'Shapoorji'],
    color: '#34d399',
  },
  {
    id: 'commerce', label: 'Commerce / MBA', emoji: '📊',
    roles: ['Financial Analyst', 'Product Manager', 'Business Analyst', 'Consultant'],
    skills: ['Excel/Power BI', 'SQL', 'Financial Modeling', 'Strategy'],
    salary: '₹5L – ₹35L+',
    companies: ['Deloitte', 'McKinsey', 'Goldman Sachs', 'Razorpay'],
    color: '#f472b6',
  },
  {
    id: 'medical', label: 'Medical / BPharm', emoji: '🏥',
    roles: ['Clinical Researcher', 'Medical Writer', 'Healthcare Analyst', 'Pharmacovigilance'],
    skills: ['Clinical Trials', 'Medical Coding', 'Regulatory Affairs', 'Data Analysis'],
    salary: '₹4L – ₹20L+',
    companies: ['Sun Pharma', 'Cipla', 'Apollo', 'AIIMS'],
    color: '#fb923c',
  },
  {
    id: 'law', label: 'Law / LLB', emoji: '⚖️',
    roles: ['Corporate Lawyer', 'Legal Analyst', 'Compliance Officer', 'IP Attorney'],
    skills: ['Legal Research', 'Contract Drafting', 'Litigation', 'Corporate Law'],
    salary: '₹4L – ₹30L+',
    companies: ['AZB & Partners', 'Cyril Amarchand', 'Khaitan & Co', 'Trilegal'],
    color: '#c084fc',
  },
  {
    id: 'design', label: 'Design / UI-UX', emoji: '🎨',
    roles: ['UI/UX Designer', 'Product Designer', 'Motion Designer', 'Brand Designer'],
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    salary: '₹4L – ₹28L+',
    companies: ['Zomato', 'Swiggy', 'Razorpay', 'Adobe'],
    color: '#f9a8d4',
  },
  {
    id: 'data', label: 'Data Science / AI', emoji: '🤖',
    roles: ['ML Engineer', 'Data Analyst', 'AI Researcher', 'NLP Engineer'],
    skills: ['Python', 'TensorFlow/PyTorch', 'SQL', 'Statistics'],
    salary: '₹7L – ₹50L+',
    companies: ['Google DeepMind', 'OpenAI', 'Fractal', 'Mu Sigma'],
    color: '#67e8f9',
  },
  {
    id: 'finance', label: 'Finance / CA', emoji: '💰',
    roles: ['Chartered Accountant', 'Investment Banker', 'CFO Track', 'Tax Consultant'],
    skills: ['Tally/SAP', 'Financial Reporting', 'Taxation', 'Audit'],
    salary: '₹6L – ₹40L+',
    companies: ['Big 4 (EY/PwC/KPMG/Deloitte)', 'JP Morgan', 'HDFC', 'SEBI'],
    color: '#4ade80',
  },
  {
    id: 'marketing', label: 'Marketing / Digital', emoji: '📣',
    roles: ['Digital Marketer', 'Growth Hacker', 'Content Strategist', 'SEO Specialist'],
    skills: ['Google Ads', 'Meta Ads', 'SEO/SEM', 'Analytics'],
    salary: '₹3.5L – ₹22L+',
    companies: ['WPP', 'Dentsu', 'Zomato', 'Nykaa'],
    color: '#fb7185',
  },
  {
    id: 'hr', label: 'HR / Psychology', emoji: '🧑‍🤝‍🧑',
    roles: ['HR Manager', 'Talent Acquisition', 'OD Consultant', 'L&D Specialist'],
    skills: ['HRMS Tools', 'Recruitment', 'Performance Mgmt', 'Labor Law'],
    salary: '₹3L – ₹18L+',
    companies: ['Infosys BPM', 'Randstad', 'Aon', 'Mercer'],
    color: '#a3e635',
  },
  {
    id: 'architecture', label: 'Architecture', emoji: '🏛️',
    roles: ['Architect', 'Interior Designer', 'Urban Designer', 'Landscape Architect'],
    skills: ['AutoCAD', 'Revit', 'SketchUp', '3ds Max'],
    salary: '₹3L – ₹20L+',
    companies: ['Hafeez Contractor', 'CP Kukreja', 'Morphogenesis', 'Gensler'],
    color: '#fcd34d',
  },
  {
    id: 'biotech', label: 'Biotech / Biomed', emoji: '🧬',
    roles: ['Biomedical Engineer', 'Research Scientist', 'Bioinformatician', 'QA Analyst'],
    skills: ['PCR/ELISA', 'Bioinformatics', 'Python/R', 'GMP/GLP'],
    salary: '₹3.5L – ₹18L+',
    companies: ['Biocon', 'Dr. Reddy\'s', 'Serum Institute', 'Thermo Fisher'],
    color: '#6ee7b7',
  },
  {
    id: 'journalism', label: 'Journalism / Media', emoji: '📰',
    roles: ['Journalist', 'Content Creator', 'Video Producer', 'PR Manager'],
    skills: ['Writing', 'Video Editing', 'Social Media', 'Storytelling'],
    salary: '₹2.5L – ₹15L+',
    companies: ['NDTV', 'Times Group', 'HT Media', 'Vice India'],
    color: '#fda4af',
  },
  {
    id: 'education', label: 'Education / Teaching', emoji: '📚',
    roles: ['EdTech Content Creator', 'Curriculum Designer', 'Academic Counselor', 'Teacher'],
    skills: ['Pedagogy', 'LMS Tools', 'Content Writing', 'Assessment Design'],
    salary: '₹3L – ₹15L+',
    companies: ['BYJU\'S', 'Unacademy', 'Vedantu', 'WhiteHat Jr'],
    color: '#93c5fd',
  },
  {
    id: 'hospitality', label: 'Hospitality / Hotel Mgmt', emoji: '🏨',
    roles: ['Hotel Manager', 'F&B Manager', 'Event Planner', 'Revenue Manager'],
    skills: ['PMS Software', 'Customer Service', 'F&B Operations', 'Revenue Mgmt'],
    salary: '₹2.5L – ₹14L+',
    companies: ['Taj Hotels', 'Marriott', 'OYO', 'ITC Hotels'],
    color: '#fdba74',
  },
  {
    id: 'agriculture', label: 'Agriculture / Agritech', emoji: '🌾',
    roles: ['Agronomist', 'Agritech Analyst', 'Supply Chain Manager', 'Food Technologist'],
    skills: ['Soil Science', 'GIS/Remote Sensing', 'Agri Finance', 'Supply Chain'],
    salary: '₹3L – ₹16L+',
    companies: ['ITC Agri', 'DeHaat', 'Ninjacart', 'BigHaat'],
    color: '#86efac',
  },
];

export default function CareerFieldSelector() {
  const [selected, setSelected] = useState(fields[0]);
  const { theme } = useTheme();

  return (
    <section style={{ padding: '100px 24px', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 500,
        background: `radial-gradient(ellipse, ${selected.color}0a, transparent 70%)`,
        pointerEvents: 'none', transition: 'background 0.5s ease',
      }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.15em',
            color: theme === 'dark' ? 'rgba(167,139,250,0.7)' : '#7c3aed', textTransform: 'uppercase',
            display: 'block', marginBottom: 12,
          }}>
            Personalized For You
          </span>
          <h2 style={{
            color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 900, margin: '0 0 8px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-0.5px',
          }}>
            I am a{' '}
            <span style={{
              color: selected.color,
              transition: 'color 0.3s',
            }}>
              {selected.label}
            </span>
            {' '}student
          </h2>
          <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', fontSize: 15, margin: 0 }}>
            Select your field to see your personalized career path
          </p>
        </motion.div>

        {/* Field Pills */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8,
          justifyContent: 'center', marginBottom: 48,
          maxWidth: 900, margin: '0 auto 48px',
        }}>
          {fields.map(f => (
            <button
              key={f.id}
              onClick={() => setSelected(f)}
              style={{
                padding: '10px 20px', borderRadius: 50,
                border: selected.id === f.id
                  ? `1px solid ${f.color}60`
                  : (theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'),
                background: selected.id === f.id
                  ? `${f.color}18`
                  : (theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'white'),
                color: selected.id === f.id ? f.color : (theme === 'dark' ? 'rgba(148,163,184,0.7)' : '#475569'),
                fontWeight: selected.id === f.id ? 700 : 500,
                fontSize: 14, cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: selected.id === f.id ? `0 0 20px ${f.color}20` : 'none',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            style={{
              borderRadius: 24,
              background: theme === 'dark' ? `linear-gradient(135deg, ${selected.color}0d, rgba(15,10,46,0.8))` : 'white',
              border: `1px solid ${selected.color}25`,
              padding: '36px 32px',
              boxShadow: theme === 'dark' ? `0 0 50px ${selected.color}10` : `0 10px 40px rgba(0,0,0,0.05), 0 0 0 1px ${selected.color}15`,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>

              {/* Top Roles */}
              <div>
                <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#64748b', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                  Top Roles For You
                </p>
                {selected.roles.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: selected.color, flexShrink: 0 }} />
                    <span style={{ color: theme === 'dark' ? 'rgba(226,232,240,0.85)' : '#1e293b', fontSize: 14 }}>{r}</span>
                  </div>
                ))}
              </div>

              {/* Skills to Learn */}
              <div>
                <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#64748b', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                  Key Skills to Learn
                </p>
                {selected.skills.map((s, i) => (
                  <div key={i} style={{
                    display: 'inline-block', padding: '4px 12px', borderRadius: 20, marginRight: 6, marginBottom: 8,
                    background: `${selected.color}15`,
                    border: `1px solid ${selected.color}30`,
                    color: selected.color, fontSize: 12, fontWeight: 600,
                  }}>
                    {s}
                  </div>
                ))}
              </div>

              {/* Salary + Companies */}
              <div>
                <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#64748b', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                  Salary Range
                </p>
                <div style={{
                  fontSize: 22, fontWeight: 900, color: selected.color,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  marginBottom: 20,
                }}>
                  {selected.salary}
                </div>
                <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.5)' : '#64748b', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Top Hiring Companies
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selected.companies.map((c, i) => (
                    <span key={i} style={{
                      padding: '3px 10px', borderRadius: 6,
                      background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                      color: theme === 'dark' ? 'rgba(203,213,225,0.7)' : '#475569', fontSize: 12,
                    }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${selected.color}20`, textAlign: 'center' }}>
              <Link to="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 12,
                background: `linear-gradient(135deg, ${selected.color}, ${selected.color}aa)`,
                color: theme === 'dark' ? 'white' : '#0f172a', textDecoration: 'none',
                fontWeight: 700, fontSize: 14,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: `0 8px 24px ${selected.color}30`,
              }}>
                Get My {selected.label} Career Roadmap <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
