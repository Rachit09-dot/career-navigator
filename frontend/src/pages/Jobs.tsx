import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Brain, Briefcase, Target, Sparkles, ChevronRight, Globe, Building2, GraduationCap, Loader2, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { profileAPI, jobAPI, skillGapAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext'
import { Link } from 'react-router-dom';

// ── Granular Field → Roles mapping ────────────────────────────────────────
const FIELD_ROLES: Record<string, { title: string; roles: string[]; internRoles: string[] }> = {
  cse:          { title: 'Computer Science & Engineering', roles: ['Software Engineer', 'Full Stack Developer', 'Data Analyst', 'DevOps Engineer', 'ML Engineer', 'Cybersecurity Analyst', 'Cloud Engineer', 'Product Manager', 'Backend Developer', 'Frontend Developer'], internRoles: ['Software Developer Intern', 'Data Analyst Intern', 'Web Developer Intern', 'ML Intern', 'DevOps Intern'] },
  it:           { title: 'Information Technology', roles: ['Software Developer', 'IT Support Engineer', 'Network Engineer', 'System Administrator', 'Database Administrator', 'Web Developer', 'QA Engineer', 'IT Consultant'], internRoles: ['IT Support Intern', 'Web Developer Intern', 'Software Tester Intern', 'Network Intern'] },
  ece:          { title: 'Electronics & Communication Engineering', roles: ['Embedded Systems Engineer', 'VLSI Design Engineer', 'RF Engineer', 'Signal Processing Engineer', 'IoT Engineer', 'Telecom Engineer', 'Hardware Engineer', 'PCB Design Engineer'], internRoles: ['Embedded Systems Intern', 'VLSI Intern', 'Electronics Intern', 'IoT Intern', 'Telecom Intern'] },
  eee:          { title: 'Electrical & Electronics Engineering', roles: ['Electrical Engineer', 'Power Systems Engineer', 'Control Systems Engineer', 'Automation Engineer', 'PLC Engineer', 'Electrical Design Engineer', 'Energy Consultant'], internRoles: ['Electrical Intern', 'Power Systems Intern', 'Automation Intern', 'PLC Intern'] },
  mechanical:   { title: 'Mechanical Engineering', roles: ['Mechanical Engineer', 'Design Engineer', 'AutoCAD Designer', 'Manufacturing Engineer', 'Quality Engineer', 'Production Engineer', 'HVAC Engineer', 'Automobile Engineer', 'Robotics Engineer'], internRoles: ['Mechanical Design Intern', 'Manufacturing Intern', 'AutoCAD Intern', 'Production Intern', 'Quality Intern'] },
  civil:        { title: 'Civil Engineering', roles: ['Civil Engineer', 'Structural Engineer', 'Site Engineer', 'Construction Manager', 'Urban Planner', 'Geotechnical Engineer', 'Highway Engineer', 'Environmental Engineer'], internRoles: ['Civil Site Intern', 'Structural Intern', 'Construction Intern', 'Urban Planning Intern'] },
  chemical:     { title: 'Chemical Engineering', roles: ['Chemical Engineer', 'Process Engineer', 'Petrochemical Engineer', 'Quality Control Engineer', 'R&D Chemist', 'Environmental Engineer', 'Safety Engineer'], internRoles: ['Chemical Process Intern', 'R&D Intern', 'Quality Control Intern', 'Lab Intern'] },
  aerospace:    { title: 'Aerospace Engineering', roles: ['Aerospace Engineer', 'Aircraft Design Engineer', 'Avionics Engineer', 'Propulsion Engineer', 'Flight Test Engineer', 'Defence Scientist'], internRoles: ['Aerospace Intern', 'DRDO Intern', 'Aircraft Intern', 'Defence Research Intern'] },
  mbbs:         { title: 'MBBS / Medical', roles: ['Doctor / Physician', 'Surgeon', 'Resident Doctor', 'Medical Officer', 'Clinical Researcher', 'Healthcare Manager', 'Medical Consultant'], internRoles: ['Medical Intern', 'Clinical Intern', 'Hospital Intern', 'Healthcare Research Intern'] },
  bpharm:       { title: 'B.Pharm / Pharmacy', roles: ['Pharmacist', 'Drug Inspector', 'Clinical Research Associate', 'Medical Representative', 'Quality Assurance Pharmacist', 'Regulatory Affairs'], internRoles: ['Pharmacy Intern', 'Clinical Research Intern', 'QA Intern', 'Medical Rep Intern'] },
  nursing:      { title: 'Nursing / B.Sc Nursing', roles: ['Staff Nurse', 'ICU Nurse', 'Community Health Nurse', 'Nursing Educator', 'Healthcare Coordinator', 'Clinical Nurse Specialist'], internRoles: ['Nursing Intern', 'Hospital Intern', 'Community Health Intern'] },
  bpt:          { title: 'Physiotherapy / BPT', roles: ['Physiotherapist', 'Sports Physiotherapist', 'Rehabilitation Specialist', 'Occupational Therapist', 'Clinical Physiotherapist'], internRoles: ['Physiotherapy Intern', 'Sports Rehab Intern', 'Hospital Physio Intern'] },
  bcom:         { title: 'B.Com / Commerce', roles: ['Accountant', 'Tax Consultant', 'Auditor', 'Financial Analyst', 'Tally Operator', 'GST Consultant', 'Bookkeeper', 'Finance Executive'], internRoles: ['Accounts Intern', 'Tax Intern', 'Finance Intern', 'Audit Intern'] },
  ca:           { title: 'CA / Chartered Accountant', roles: ['Chartered Accountant', 'Tax Auditor', 'Financial Controller', 'CFO', 'Investment Analyst', 'Risk Manager', 'Compliance Officer'], internRoles: ['CA Articleship', 'Tax Intern', 'Audit Intern', 'Finance Intern'] },
  mba:          { title: 'MBA / BBA', roles: ['Business Analyst', 'Marketing Manager', 'Operations Manager', 'HR Manager', 'Product Manager', 'Consultant', 'Brand Manager', 'Sales Manager'], internRoles: ['Business Analyst Intern', 'Marketing Intern', 'HR Intern', 'Operations Intern', 'Sales Intern'] },
  law:          { title: 'Law / LLB', roles: ['Advocate', 'Corporate Lawyer', 'Legal Advisor', 'Compliance Officer', 'Legal Consultant', 'Public Prosecutor', 'Judicial Services'], internRoles: ['Legal Intern', 'Law Firm Intern', 'Corporate Legal Intern', 'Court Intern'] },
  design:       { title: 'Design / B.Des', roles: ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Motion Designer', 'Brand Designer', 'Art Director', 'Visual Designer'], internRoles: ['UI/UX Intern', 'Graphic Design Intern', 'Product Design Intern', 'Motion Design Intern'] },
  mass_comm:    { title: 'Mass Communication / Journalism', roles: ['Journalist', 'News Anchor', 'Content Creator', 'PR Manager', 'Social Media Manager', 'Film Director', 'Video Editor'], internRoles: ['Journalism Intern', 'Content Writing Intern', 'PR Intern', 'Social Media Intern', 'Video Editing Intern'] },
  bed:          { title: 'B.Ed / Education', roles: ['Teacher', 'Professor', 'Education Consultant', 'Curriculum Designer', 'EdTech Specialist', 'School Principal', 'Trainer'], internRoles: ['Teaching Intern', 'EdTech Intern', 'Curriculum Intern', 'School Intern'] },
  hotel:        { title: 'Hotel Management / BHM', roles: ['Hotel Manager', 'Chef', 'Event Manager', 'Tourism Officer', 'F&B Manager', 'Front Office Manager', 'Hospitality Consultant'], internRoles: ['Hotel Intern', 'Chef Intern', 'Event Management Intern', 'F&B Intern'] },
  agriculture:  { title: 'Agriculture / B.Sc Agriculture', roles: ['Agricultural Officer', 'Food Scientist', 'Farm Manager', 'Agri Researcher', 'Horticulturist', 'Soil Scientist', 'Agri Business Manager'], internRoles: ['Agriculture Research Intern', 'Farm Management Intern', 'Food Science Intern', 'Agri Intern'] },
  sports:       { title: 'Sports / Physical Education', roles: ['Sports Coach', 'Sports Analyst', 'Fitness Trainer', 'Sports Manager', 'Physiotherapist', 'Sports Journalist', 'PE Teacher'], internRoles: ['Sports Coaching Intern', 'Fitness Intern', 'Sports Management Intern'] },
  social_work:  { title: 'Social Work / MSW', roles: ['NGO Manager', 'Social Worker', 'Community Developer', 'Policy Analyst', 'Counselor', 'Development Officer', 'CSR Manager'], internRoles: ['NGO Intern', 'Social Work Intern', 'Community Development Intern', 'CSR Intern'] },
  defence:      { title: 'Defence / NDA', roles: ['Army Officer', 'Navy Officer', 'Air Force Officer', 'Defence Analyst', 'NDA Officer', 'Coast Guard', 'Security Consultant'], internRoles: ['DRDO Intern', 'Defence Research Intern', 'NDA Intern'] },
  civil_services: { title: 'Civil Services / UPSC', roles: ['IAS Officer', 'IPS Officer', 'IFS Officer', 'State PCS Officer', 'Revenue Officer', 'Government Jobs', 'PSU Jobs'], internRoles: ['NITI Aayog Intern', 'Government Intern', 'Policy Research Intern', 'AICTE Intern'] },
  fine_arts:    { title: 'Fine Arts / Animation', roles: ['Artist', 'Animator', 'Illustrator', 'Art Director', 'Creative Director', 'Art Teacher', '3D Artist', 'Game Designer'], internRoles: ['Animation Intern', 'Graphic Art Intern', 'Game Design Intern', 'Illustration Intern'] },
  paramedical:  { title: 'Paramedical / Allied Health', roles: ['Radiologist', 'Lab Technician', 'Physiotherapist', 'Medical Coder', 'Dialysis Technician', 'OT Technician', 'Sonographer'], internRoles: ['Lab Technician Intern', 'Radiology Intern', 'Medical Coding Intern', 'Hospital Intern'] },
  diploma:      { title: 'Diploma / ITI', roles: ['Electrician', 'Mechanical Technician', 'Civil Supervisor', 'ITI Instructor', 'Plant Operator', 'Quality Inspector', 'Welder', 'Fitter'], internRoles: ['Electrician Intern', 'Mechanical Intern', 'Civil Intern', 'Plant Operator Intern'] },
  ba:           { title: 'BA / Arts & Humanities', roles: ['Civil Services Officer', 'Content Writer', 'Journalist', 'HR Executive', 'Social Worker', 'Psychologist', 'Teacher', 'Public Relations'], internRoles: ['Content Writing Intern', 'Journalism Intern', 'HR Intern', 'Social Work Intern'] },
  psychology:   { title: 'Psychology', roles: ['Psychologist', 'Counselor', 'HR Manager', 'Mental Health Therapist', 'School Counselor', 'Clinical Psychologist', 'Research Psychologist'], internRoles: ['Counseling Intern', 'Psychology Research Intern', 'HR Intern', 'Mental Health Intern'] },
  bsc_cs:       { title: 'B.Sc Computer Science', roles: ['Software Developer', 'Data Analyst', 'Web Developer', 'Python Developer', 'Database Administrator', 'IT Support', 'QA Tester'], internRoles: ['Software Intern', 'Data Analyst Intern', 'Web Developer Intern', 'Python Intern'] },
  bsc_bio:      { title: 'B.Sc Biology / Biotechnology', roles: ['Research Scientist', 'Biotechnologist', 'Lab Analyst', 'Quality Control Analyst', 'Clinical Research Associate', 'Microbiologist'], internRoles: ['Lab Research Intern', 'Biotech Intern', 'Clinical Research Intern', 'QC Intern'] },
  bsc_chem:     { title: 'B.Sc Chemistry', roles: ['Chemist', 'Lab Analyst', 'Quality Control Chemist', 'R&D Scientist', 'Pharmaceutical Chemist', 'Environmental Analyst'], internRoles: ['Chemistry Lab Intern', 'QC Intern', 'R&D Intern', 'Pharma Intern'] },
  bsc_physics:  { title: 'B.Sc Physics', roles: ['Research Scientist', 'Data Analyst', 'Physicist', 'Radiation Safety Officer', 'Optics Engineer', 'DRDO Scientist'], internRoles: ['Physics Research Intern', 'Data Analyst Intern', 'Lab Intern', 'DRDO Intern'] },
}

function getFieldKey(f: string): string {
  const s = (f || '').toLowerCase()
  if (s.includes('computer science') || s.includes('cse') || s.includes('b.tech cs') || s.includes('btech cs')) return 'cse'
  if (s.includes('information technology') || s.includes(' it ') || s.includes('b.tech it') || s.includes('btech it')) return 'it'
  if (s.includes('electronics') && s.includes('communication')) return 'ece'
  if (s.includes('electrical') && s.includes('electronics')) return 'eee'
  if (s.includes('electrical')) return 'eee'
  if (s.includes('mechanical')) return 'mechanical'
  if (s.includes('civil') && (s.includes('engineer') || s.includes('b.tech') || s.includes('btech'))) return 'civil'
  if (s.includes('chemical')) return 'chemical'
  if (s.includes('aerospace') || s.includes('aeronautical')) return 'aerospace'
  if (s.includes('engineer') || s.includes('btech') || s.includes('b.tech') || s.includes('software')) return 'cse'
  if (s.includes('mbbs') || s.includes('medicine') || s.includes('medical')) return 'mbbs'
  if (s.includes('pharm') || s.includes('pharmacy')) return 'bpharm'
  if (s.includes('nursing')) return 'nursing'
  if (s.includes('physiotherapy') || s.includes('bpt')) return 'bpt'
  if (s.includes('chartered') || s.includes(' ca ') || s.includes('ca ')) return 'ca'
  if (s.includes('mba') || s.includes('bba') || s.includes('management')) return 'mba'
  if (s.includes('commerce') || s.includes('bcom') || s.includes('b.com') || s.includes('finance') || s.includes('accounting')) return 'bcom'
  if (s.includes('law') || s.includes('legal') || s.includes('llb') || s.includes('l.l.b')) return 'law'
  if (s.includes('design') || s.includes('bdes') || s.includes('fashion') || s.includes('ux') || s.includes('ui')) return 'design'
  if (s.includes('mass communication') || s.includes('journalism') || s.includes('media')) return 'mass_comm'
  if (s.includes('education') || s.includes('b.ed') || s.includes('bed') || s.includes('teaching')) return 'bed'
  if (s.includes('hotel') || s.includes('hospitality') || s.includes('tourism') || s.includes('bhm')) return 'hotel'
  if (s.includes('agriculture') || s.includes('agri') || s.includes('horticulture')) return 'agriculture'
  if (s.includes('sports') || s.includes('physical education') || s.includes('bpes')) return 'sports'
  if (s.includes('social work') || s.includes('msw') || s.includes('bsw')) return 'social_work'
  if (s.includes('defence') || s.includes('military') || s.includes('nda')) return 'defence'
  if (s.includes('civil service') || s.includes('upsc') || s.includes('ias') || s.includes('government')) return 'civil_services'
  if (s.includes('fine art') || s.includes('animation') || s.includes('performing') || s.includes('bfa')) return 'fine_arts'
  if (s.includes('paramedical') || s.includes('allied health') || s.includes('radiology') || s.includes('lab tech')) return 'paramedical'
  if (s.includes('diploma') || s.includes('iti') || s.includes('vocational') || s.includes('polytechnic')) return 'diploma'
  if (s.includes('computer') && s.includes('science')) return 'bsc_cs'
  if (s.includes('biotechnology') || s.includes('microbiology') || (s.includes('biology') && s.includes('bsc'))) return 'bsc_bio'
  if (s.includes('chemistry') || s.includes('bsc chem')) return 'bsc_chem'
  if (s.includes('physics') || s.includes('bsc phys')) return 'bsc_physics'
  if (s.includes('science') || s.includes('bsc')) return 'bsc_bio'
  if (s.includes('psychology')) return 'psychology'
  if (s.includes('art') || s.includes('humanities') || s.includes('ba ') || s.includes('b.a')) return 'ba'
  return 'cse'
}

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.3 } }) }

function PlatformLogo({ name, color, size = 16 }: { name: string; color: string; size?: number }) {
  // Known platforms with direct CDN logo URLs
  const logoMap: Record<string, string> = {
    'LinkedIn': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg',
    'Naukri.com': 'https://static.naukimg.com/s/0/0/i/new-naukri.ico',
    'Indeed': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/indeed.svg',
    'Glassdoor': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/glassdoor.svg',
    'GitHub Jobs': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg',
    'Stack Overflow Jobs': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stackoverflow.svg',
    'Wellfound': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/angellist.svg',
    'AngelList Talent': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/angellist.svg',
    'Kaggle': 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/kaggle.svg',
    'Internshala': 'https://internshala.com/favicon.ico',
    'Unstop': 'https://unstop.com/favicon.ico',
    'Cutshort': 'https://cutshort.io/favicon.ico',
    'Hirect': 'https://hirect.in/favicon.ico',
    'Hirist': 'https://www.hirist.com/favicon.ico',
    'Apna': 'https://apna.co/favicon.ico',
    'WorkIndia': 'https://www.workindia.in/favicon.ico',
    'Freshersworld': 'https://www.freshersworld.com/favicon.ico',
    'LetsIntern': 'https://www.letsintern.com/favicon.ico',
    'Twenty19': 'https://www.twenty19.com/favicon.ico',
    'HelloIntern': 'https://www.hellointern.com/favicon.ico',
    'WayUp': 'https://www.wayup.com/favicon.ico',
    'Remote OK': 'https://remoteok.com/favicon.ico',
    'We Work Remotely': 'https://weworkremotely.com/favicon.ico',
    'Dice': 'https://www.dice.com/favicon.ico',
    'ZipRecruiter': 'https://www.ziprecruiter.com/favicon.ico',
    'SimplyHired': 'https://www.simplyhired.com/favicon.ico',
    'CareerBuilder': 'https://www.careerbuilder.com/favicon.ico',
    'Jora': 'https://in.jora.com/favicon.ico',
    'Monster India': 'https://www.monsterindia.com/favicon.ico',
    'TimesJobs': 'https://www.timesjobs.com/favicon.ico',
    'Shine': 'https://www.shine.com/favicon.ico',
    'PlacementIndia': 'https://www.placementindia.com/favicon.ico',
    'Idealist': 'https://www.idealist.org/favicon.ico',
    'GoAbroad': 'https://www.goabroad.com/favicon.ico',
    'Chegg Internships': 'https://www.internships.com/favicon.ico',
    'AICTE Internship Portal': 'https://internship.aicte-india.org/favicon.ico',
    'NITI Aayog Internship': 'https://www.niti.gov.in/favicon.ico',
    'DRDO Internship': 'https://www.drdo.gov.in/favicon.ico',
    'TCS Careers': 'https://www.tcs.com/favicon.ico',
    'Infosys Careers': 'https://www.infosys.com/favicon.ico',
    'Wipro Careers': 'https://careers.wipro.com/favicon.ico',
    'Accenture Careers': 'https://www.accenture.com/favicon.ico',
    'Amazon Jobs': 'https://www.amazon.jobs/favicon.ico',
    'Google Careers': 'https://careers.google.com/favicon.ico',
    'Microsoft Careers': 'https://careers.microsoft.com/favicon.ico',
  }
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const src = logoMap[name]
  const [failed, setFailed] = useState(false)
  if (src && !failed) {
    return (
      <img src={src} alt={name} width={size} height={size}
        style={{ objectFit: 'contain', borderRadius: 2 }}
        onError={() => setFailed(true)}
      />
    )
  }
  return (
    <div style={{ width: size, height: size, borderRadius: 3, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
      {initials}
    </div>
  )
}

function PlatformCard({ p, i, searchQuery, isInternship = false }: { p: any; i: number; searchQuery: string; isInternship?: boolean }) {
  const { theme } = useTheme()
  const q = encodeURIComponent(searchQuery)
  const qDash = encodeURIComponent(searchQuery.replace(/ /g, '-'))
  const iq = encodeURIComponent(searchQuery + ' internship')
  const iqDash = encodeURIComponent((searchQuery + '-internship').replace(/ /g, '-'))
  let url = p.baseUrl || '#'
  if (p.searchable && p.urlFn) url = p.urlFn(q, qDash, q, qDash, iq, iqDash)
  return (
    <motion.a href={url} target="_blank" rel="noopener noreferrer"
      custom={i} variants={fadeUp} initial="hidden" animate="visible"
      whileHover={{ y: -4, scale: 1.01, boxShadow: `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${p.color}50` }}
      style={{ display: 'flex', flexDirection: 'column', padding: '16px', background: p.bg, border: `1px solid ${p.border}`, borderRadius: 16, textDecoration: 'none', transition: 'all 0.2s', position: 'relative', overflow: 'hidden', gap: 10 }}>
      {/* top glow line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${p.color}80, transparent)` }} />
      {/* header row: logo box + name + badge + arrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* logo box */}
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${p.color}15`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <PlatformLogo name={p.name} color={p.color} size={24} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ color: theme === 'dark' ? '#f1f5f9' : '#0f172a', fontSize: 14, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'nowrap' }}>{p.name}</span>
            {p.badge && <span style={{ background: `${p.color}25`, border: `1px solid ${p.color}50`, color: p.color, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>{p.badge}</span>}
          </div>
          <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 11, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.desc}</p>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${p.color}20`, border: `1px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ExternalLink style={{ width: 12, height: 12, color: p.color }} />
        </div>
      </div>
      {/* search query chip */}
      {p.searchable && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${p.color}10`, border: `1px solid ${p.color}25`, borderRadius: 8, padding: '5px 9px' }}>
          <Search style={{ width: 10, height: 10, color: p.color, opacity: 0.8, flexShrink: 0 }} />
          <span style={{ color: p.color, fontSize: 10, fontWeight: 600, opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{searchQuery}{isInternship ? ' internship' : ''}" · India</span>
        </div>
      )}
    </motion.a>
  )
}

function PlatformSection({ title, icon: Icon, iconColor, platforms, searchQuery, isInternship, delay }: any) {
  const { theme } = useTheme()
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: `${iconColor}40`, filter: 'blur(6px)' }} />
          <Icon style={{ width: 14, height: 14, color: iconColor, position: 'relative' }} />
        </div>
        <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(15,23,42,0.85)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
        <span style={{ color: iconColor, fontSize: 11, fontWeight: 600, opacity: 0.7 }}>({platforms.length})</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10, marginBottom: 28 }}>
        {platforms.map((p: any, i: number) => <PlatformCard key={p.name} p={p} i={i} searchQuery={searchQuery} isInternship={isInternship} />)}
      </div>
    </motion.div>
  )
}

const JOB_PLATFORMS = {
  general: [
    { name: 'LinkedIn', color: '#0077b5', bg: 'rgba(0,119,181,0.1)', border: 'rgba(0,119,181,0.3)', desc: 'Professional network jobs', badge: 'Most Popular', searchable: true, urlFn: (q: string) => `https://www.linkedin.com/jobs/search/?keywords=${q}&location=India` },
    { name: 'Naukri.com', color: '#e65100', bg: 'rgba(230,81,0,0.1)', border: 'rgba(230,81,0,0.3)', desc: "India's #1 job portal", badge: null, searchable: true, urlFn: (_: string, qd: string) => `https://www.naukri.com/${qd}-jobs` },
    { name: 'Indeed', color: '#1a73e8', bg: 'rgba(26,115,232,0.1)', border: 'rgba(26,115,232,0.3)', desc: 'Millions of job listings', badge: null, searchable: true, urlFn: (q: string) => `https://in.indeed.com/jobs?q=${q}&l=India` },
    { name: 'Monster India', color: '#c2185b', bg: 'rgba(194,24,91,0.1)', border: 'rgba(194,24,91,0.3)', desc: 'Global job search platform', badge: null, searchable: true, urlFn: (q: string) => `https://www.monsterindia.com/srp/results?query=${q}&locations=India` },
    { name: 'Glassdoor', color: '#0caa41', bg: 'rgba(12,170,65,0.1)', border: 'rgba(12,170,65,0.3)', desc: 'Jobs + company reviews', badge: null, searchable: true, urlFn: (_: string, qd: string) => `https://www.glassdoor.co.in/Job/india-${qd}-jobs-SRCH_IL.0,5_IN115.htm` },
    { name: 'TimesJobs', color: '#f57f17', bg: 'rgba(245,127,23,0.1)', border: 'rgba(245,127,23,0.3)', desc: 'Times Group job portal', badge: null, searchable: true, urlFn: (q: string) => `https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&txtKeywords=${q}` },
    { name: 'Shine', color: '#7b1fa2', bg: 'rgba(123,31,162,0.1)', border: 'rgba(123,31,162,0.3)', desc: 'Top Indian job portal', badge: null, searchable: true, urlFn: (_: string, qd: string) => `https://www.shine.com/job-search/${qd}-jobs` },
  ],
  tech: [
    { name: 'Cutshort', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.3)', desc: 'AI-powered tech job matching', badge: 'AI Match', searchable: true, urlFn: (q: string) => `https://cutshort.io/jobs?q=${q}` },
    { name: 'Hirist', color: '#0891b2', bg: 'rgba(8,145,178,0.1)', border: 'rgba(8,145,178,0.3)', desc: 'Tech jobs in India', badge: null, searchable: true, urlFn: (q: string) => `https://www.hirist.tech/search?q=${q}` },
    { name: 'Hirect', color: '#059669', bg: 'rgba(5,150,105,0.1)', border: 'rgba(5,150,105,0.3)', desc: 'Direct hiring for tech', badge: null, searchable: false, baseUrl: 'https://hirect.in' },
    { name: 'Wellfound', color: '#e11d48', bg: 'rgba(225,29,72,0.1)', border: 'rgba(225,29,72,0.3)', desc: 'Startup jobs (AngelList)', badge: 'Startups', searchable: true, urlFn: (q: string) => `https://wellfound.com/jobs?q=${q}&l=India` },
    { name: 'AngelList Talent', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', desc: 'Startup & tech jobs', badge: null, searchable: true, urlFn: (q: string) => `https://angel.co/jobs?q=${q}` },
    { name: 'Stack Overflow Jobs', color: '#f48024', bg: 'rgba(244,128,36,0.1)', border: 'rgba(244,128,36,0.3)', desc: 'Developer-focused jobs', badge: null, searchable: false, baseUrl: 'https://stackoverflow.com/jobs' },
    { name: 'GitHub Jobs', color: '#6e40c9', bg: 'rgba(110,64,201,0.1)', border: 'rgba(110,64,201,0.3)', desc: 'Open source & dev jobs', badge: null, searchable: false, baseUrl: 'https://jobs.github.com' },
  ],
  global: [
    { name: 'SimplyHired', color: '#1565c0', bg: 'rgba(21,101,192,0.1)', border: 'rgba(21,101,192,0.3)', desc: 'Global job aggregator', badge: null, searchable: true, urlFn: (q: string) => `https://www.simplyhired.com/search?q=${q}&l=India` },
    { name: 'ZipRecruiter', color: '#00897b', bg: 'rgba(0,137,123,0.1)', border: 'rgba(0,137,123,0.3)', desc: 'AI job matching globally', badge: null, searchable: true, urlFn: (q: string) => `https://www.ziprecruiter.com/jobs-search?search=${q}&location=India` },
    { name: 'Dice', color: '#d32f2f', bg: 'rgba(211,47,47,0.1)', border: 'rgba(211,47,47,0.3)', desc: 'Tech & IT jobs globally', badge: 'Tech Only', searchable: true, urlFn: (q: string) => `https://www.dice.com/jobs?q=${q}` },
    { name: 'We Work Remotely', color: '#2e7d32', bg: 'rgba(46,125,50,0.1)', border: 'rgba(46,125,50,0.3)', desc: 'Remote jobs worldwide', badge: 'Remote', searchable: true, urlFn: (q: string) => `https://weworkremotely.com/remote-jobs/search?term=${q}` },
    { name: 'Remote OK', color: '#00b4d8', bg: 'rgba(0,180,216,0.1)', border: 'rgba(0,180,216,0.3)', desc: 'Remote-first job board', badge: 'Remote', searchable: false, baseUrl: 'https://remoteok.com' },
    { name: 'CareerBuilder', color: '#1976d2', bg: 'rgba(25,118,210,0.1)', border: 'rgba(25,118,210,0.3)', desc: 'Global career platform', badge: null, searchable: false, baseUrl: 'https://www.careerbuilder.com' },
  ],
  india: [
    { name: 'Freshersworld', color: '#2e7d32', bg: 'rgba(46,125,50,0.1)', border: 'rgba(46,125,50,0.3)', desc: 'Fresher & entry level jobs', badge: 'Freshers', searchable: true, urlFn: (_: string, qd: string) => `https://www.freshersworld.com/jobs/jobsearch/${qd}-jobs` },
    { name: 'Apna', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', desc: 'Blue & grey collar jobs', badge: null, searchable: true, urlFn: (q: string) => `https://apna.co/jobs?q=${q}` },
    { name: 'WorkIndia', color: '#6d28d9', bg: 'rgba(109,40,217,0.1)', border: 'rgba(109,40,217,0.3)', desc: 'India-specific job portal', badge: null, searchable: false, baseUrl: 'https://www.workindia.in' },
    { name: 'Foundit', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.3)', desc: 'Formerly Monster India', badge: null, searchable: true, urlFn: (q: string) => `https://www.foundit.in/srp/results?query=${q}` },
    { name: 'Talent.com', color: '#00897b', bg: 'rgba(0,137,123,0.1)', border: 'rgba(0,137,123,0.3)', desc: 'Formerly Neuvoo', badge: null, searchable: true, urlFn: (q: string) => `https://www.talent.com/jobs?k=${q}&l=India` },
    { name: 'Jora India', color: '#f57f17', bg: 'rgba(245,127,23,0.1)', border: 'rgba(245,127,23,0.3)', desc: 'Aggregated India jobs', badge: null, searchable: true, urlFn: (q: string) => `https://in.jora.com/j?q=${q}&l=India` },
    { name: 'PlacementIndia', color: '#0891b2', bg: 'rgba(8,145,178,0.1)', border: 'rgba(8,145,178,0.3)', desc: 'Campus & fresher placements', badge: null, searchable: false, baseUrl: 'https://www.placementindia.com' },
  ],
  company: [
    { name: 'TCS Careers', color: '#1565c0', bg: 'rgba(21,101,192,0.1)', border: 'rgba(21,101,192,0.3)', desc: 'Direct apply — highest chance', badge: 'Direct Apply', searchable: false, baseUrl: 'https://www.tcs.com/careers' },
    { name: 'Infosys Careers', color: '#0d47a1', bg: 'rgba(13,71,161,0.1)', border: 'rgba(13,71,161,0.3)', desc: 'Direct apply to Infosys', badge: 'Direct Apply', searchable: false, baseUrl: 'https://www.infosys.com/careers' },
    { name: 'Wipro Careers', color: '#6a1b9a', bg: 'rgba(106,27,154,0.1)', border: 'rgba(106,27,154,0.3)', desc: 'Direct apply to Wipro', badge: 'Direct Apply', searchable: false, baseUrl: 'https://careers.wipro.com' },
    { name: 'Accenture Careers', color: '#a71680', bg: 'rgba(167,22,128,0.1)', border: 'rgba(167,22,128,0.3)', desc: 'Direct apply to Accenture', badge: 'Direct Apply', searchable: false, baseUrl: 'https://www.accenture.com/in-en/careers' },
    { name: 'Amazon Jobs', color: '#ff9900', bg: 'rgba(255,153,0,0.1)', border: 'rgba(255,153,0,0.3)', desc: 'Amazon global careers', badge: 'FAANG', searchable: false, baseUrl: 'https://www.amazon.jobs' },
    { name: 'Google Careers', color: '#4285f4', bg: 'rgba(66,133,244,0.1)', border: 'rgba(66,133,244,0.3)', desc: 'Google global careers', badge: 'FAANG', searchable: false, baseUrl: 'https://careers.google.com' },
    { name: 'Microsoft Careers', color: '#00a4ef', bg: 'rgba(0,164,239,0.1)', border: 'rgba(0,164,239,0.3)', desc: 'Microsoft global careers', badge: 'FAANG', searchable: false, baseUrl: 'https://careers.microsoft.com' },
  ],
}

const INTERNSHIP_PLATFORMS = {
  general: [
    { name: 'Internshala', color: '#00b4d8', bg: 'rgba(0,180,216,0.1)', border: 'rgba(0,180,216,0.3)', desc: "India's #1 internship platform", badge: 'Most Popular', searchable: true, urlFn: (_: string, qd: string) => `https://internshala.com/internships/keywords-${qd}` },
    { name: 'LinkedIn', color: '#0077b5', bg: 'rgba(0,119,181,0.1)', border: 'rgba(0,119,181,0.3)', desc: 'Professional internship listings', badge: null, searchable: true, urlFn: (_: string, _qd: string, _q: string, _qd2: string, iq: string) => `https://www.linkedin.com/jobs/search/?keywords=${iq}&location=India` },
    { name: 'Indeed', color: '#1a73e8', bg: 'rgba(26,115,232,0.1)', border: 'rgba(26,115,232,0.3)', desc: 'Internships across India', badge: null, searchable: true, urlFn: (_: string, _qd: string, _q: string, _qd2: string, iq: string) => `https://in.indeed.com/jobs?q=${iq}&l=India` },
    { name: 'Naukri.com', color: '#e65100', bg: 'rgba(230,81,0,0.1)', border: 'rgba(230,81,0,0.3)', desc: 'Fresher & internship jobs', badge: null, searchable: true, urlFn: (_: string, qd: string) => `https://www.naukri.com/${qd}-internship-jobs` },
    { name: 'Glassdoor', color: '#0caa41', bg: 'rgba(12,170,65,0.1)', border: 'rgba(12,170,65,0.3)', desc: 'Internships with reviews', badge: null, searchable: true, urlFn: (_: string, _qd: string, _q: string, _qd2: string, _iq: string, iqd: string) => `https://www.glassdoor.co.in/Job/india-${iqd}-jobs-SRCH_IL.0,5_IN115.htm` },
  ],
  student: [
    { name: 'Unstop', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.3)', desc: 'Competitions + internships', badge: 'Competitions too', searchable: true, urlFn: (_: string, _qd: string, q: string) => `https://unstop.com/internships?search=${q}` },
    { name: 'LetsIntern', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', desc: 'Dedicated internship portal', badge: null, searchable: true, urlFn: (_: string, _qd: string, q: string) => `https://www.letsintern.com/internships?q=${q}` },
    { name: 'Twenty19', color: '#0891b2', bg: 'rgba(8,145,178,0.1)', border: 'rgba(8,145,178,0.3)', desc: 'Student-specific platform', badge: 'Students', searchable: false, baseUrl: 'https://www.twenty19.com' },
    { name: 'HelloIntern', color: '#ec4899', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.3)', desc: 'Paid & unpaid internships', badge: null, searchable: false, baseUrl: 'https://www.hellointern.com' },
    { name: 'Wellfound', color: '#e11d48', bg: 'rgba(225,29,72,0.1)', border: 'rgba(225,29,72,0.3)', desc: 'Startup internships', badge: 'Startups', searchable: true, urlFn: (_: string, _qd: string, _q: string, _qd2: string, iq: string) => `https://wellfound.com/jobs?q=${iq}&l=India` },
    { name: 'Cutshort', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.3)', desc: 'Tech internships with AI match', badge: null, searchable: true, urlFn: (_: string, _qd: string, _q: string, _qd2: string, iq: string) => `https://cutshort.io/jobs?q=${iq}` },
  ],
  government: [
    { name: 'AICTE Internship Portal', color: '#1565c0', bg: 'rgba(21,101,192,0.1)', border: 'rgba(21,101,192,0.3)', desc: 'Official AICTE internships', badge: 'Govt Official', searchable: false, baseUrl: 'https://internship.aicte-india.org' },
    { name: 'NITI Aayog Internship', color: '#0d47a1', bg: 'rgba(13,71,161,0.1)', border: 'rgba(13,71,161,0.3)', desc: 'Policy & research internships', badge: 'Govt Official', searchable: false, baseUrl: 'https://www.niti.gov.in/internship' },
    { name: 'DRDO Internship', color: '#b71c1c', bg: 'rgba(183,28,28,0.1)', border: 'rgba(183,28,28,0.3)', desc: 'Defence research internships', badge: 'Govt Official', searchable: false, baseUrl: 'https://www.drdo.gov.in' },
    { name: 'We Work Remotely', color: '#2e7d32', bg: 'rgba(46,125,50,0.1)', border: 'rgba(46,125,50,0.3)', desc: 'Remote internships worldwide', badge: 'Remote', searchable: true, urlFn: (_: string, _qd: string, _q: string, _qd2: string, iq: string) => `https://weworkremotely.com/remote-jobs/search?term=${iq}` },
  ],
  company: [
    { name: 'Google Careers', color: '#4285f4', bg: 'rgba(66,133,244,0.1)', border: 'rgba(66,133,244,0.3)', desc: 'Google internship programs', badge: 'FAANG', searchable: false, baseUrl: 'https://careers.google.com' },
    { name: 'Microsoft Careers', color: '#00a4ef', bg: 'rgba(0,164,239,0.1)', border: 'rgba(0,164,239,0.3)', desc: 'Microsoft internship programs', badge: 'FAANG', searchable: false, baseUrl: 'https://careers.microsoft.com' },
    { name: 'Amazon Jobs', color: '#ff9900', bg: 'rgba(255,153,0,0.1)', border: 'rgba(255,153,0,0.3)', desc: 'Amazon internship programs', badge: 'FAANG', searchable: false, baseUrl: 'https://www.amazon.jobs' },
    { name: 'Infosys Careers', color: '#0d47a1', bg: 'rgba(13,71,161,0.1)', border: 'rgba(13,71,161,0.3)', desc: 'Infosys internship programs', badge: null, searchable: false, baseUrl: 'https://www.infosys.com/careers' },
    { name: 'TCS Careers', color: '#1565c0', bg: 'rgba(21,101,192,0.1)', border: 'rgba(21,101,192,0.3)', desc: 'TCS internship programs', badge: null, searchable: false, baseUrl: 'https://www.tcs.com/careers' },
  ],
}

function FeaturedJobCard({ job, index, onApplySuccess }: { job: any, index: number, onApplySuccess: (title: string) => void }) {
  const { theme } = useTheme();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    try {
      await jobAPI.applyJob(job.id, {
        job_title: job.title,
        company: job.company,
        location: job.location,
        redirect_url: job.redirect_url
      });
      setApplied(true);
      onApplySuccess(job.title);
    } catch (err: any) {
      alert(`Failed to apply: ${err.response?.data?.error || err.response?.data?.message || err.message}`);
    } finally {
      setApplying(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      style={{
        background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff',
        border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: theme === 'dark' ? 'none' : '0 4px 12px rgba(0,0,0,0.03)'
      }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: theme === 'dark' ? 'white' : '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {job.title}
            </h3>
            {job.matchPercentage > 0 && (
              <span style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999 }}>
                {job.matchPercentage}% SKILL MATCH
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>{job.company}</span>
            <span style={{ color: 'rgba(148,163,184,0.5)' }}>•</span>
            <span style={{ fontSize: 12, color: 'rgba(148,163,184,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Building2 style={{ width: 12, height: 12 }} /> {job.location}
            </span>
          </div>
        </div>
        <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
          {job.salary_range}
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {job.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 12 }}>
        <div style={{ flex: 1, display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {(job.requirements || '').split(',').slice(0, 2).map((req: string, i: number) => (
            <span key={i} style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f1f5f9', color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : '#475569', fontSize: 11, padding: '4px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>
              {req.trim()}
            </span>
          ))}
          {job.matchedSkills && job.matchedSkills.length > 0 && (
            <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 11, padding: '4px 8px', borderRadius: 6, whiteSpace: 'nowrap', fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle style={{ width: 10, height: 10 }} /> {job.matchedSkills.length} Skills Matched
            </span>
          )}
        </div>
        
        <motion.button 
          whileHover={{ scale: applied ? 1 : 1.05 }} 
          whileTap={{ scale: applied ? 1 : 0.95 }}
          onClick={handleApply}
          disabled={applying || applied}
          style={{ 
            background: applied ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #7c3aed, #5b21b6)', 
            color: applied ? '#10b981' : 'white', 
            border: applied ? '1px solid rgba(16,185,129,0.3)' : 'none', 
            padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700, 
            cursor: applied ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: applied ? 'none' : '0 4px 12px rgba(124,58,237,0.3)'
          }}
        >
          {applying ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> : applied ? <CheckCircle style={{ width: 14, height: 14 }} /> : <Sparkles style={{ width: 14, height: 14 }} />}
          {applying ? 'Tracking...' : applied ? 'Tracked' : 'Track Job'}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Jobs() {
  const { theme } = useTheme();
  const location = useLocation()
  const [profile, setProfile] = useState<any>(null)
  const [customSearch, setCustomSearch] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'jobs' | 'internships'>('jobs')
  
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([])
  const [jobsLoading, setJobsLoading] = useState(false)
  const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' })
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);

  const showToast = (title: string) => {
    setToast({ show: true, message: `Successfully saved ${title} to your tracker! View it in your Applications tab.` })
    setTimeout(() => setToast({ show: false, message: '' }), 4000)
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const qParam = params.get('q') || params.get('role') || ''
    
    Promise.all([
      profileAPI.getProfile().catch(() => ({ data: null })),
      skillGapAPI.getLast().catch(() => ({ data: null })),
      skillGapAPI.getCompletedSkills().catch(() => ({ data: null }))
    ]).then(([resProfile, resLastGap, resCompleted]) => {
      const p = resProfile.data;
      if (!p) return;
      setProfile(p);
      
      const dnaDone = p?.career_dna?.results?.length > 0;
      const totalSkills = resLastGap?.data?.gaps?.length || 0;
      const completedSkills = resCompleted?.data?.completed_skills?.length || 0;
      const gapDone = totalSkills > 0 && completedSkills >= totalSkills;

      if (!dnaDone || !gapDone) {
        setAccessGranted(false);
        return;
      }
      
      setAccessGranted(true);

      const dnaRole = p?.career_dna?.results?.[0]?.career || ''
      const fieldKey = getFieldKey(p?.field_of_study || '')
      const fieldData = FIELD_ROLES[fieldKey]
      const initial = qParam || dnaRole || (fieldData?.roles[0] || 'Software Engineer')
      setActiveSearch(initial)
    })
  }, [location.search])

  const fieldKey = getFieldKey(profile?.field_of_study || '')

  useEffect(() => {
    if (!activeSearch) return;
    const fetchFeaturedJobs = async () => {
      setJobsLoading(true)
      try {
        const query = activeTab === 'internships' ? `${activeSearch} internship` : activeSearch;
        const res = await jobAPI.getJobs({ q: query, field: fieldKey })
        setFeaturedJobs(res.data.jobs || [])
      } catch (err) {
        console.error('Failed to fetch jobs', err)
      } finally {
        setJobsLoading(false)
      }
    }
    fetchFeaturedJobs()
  }, [activeSearch, activeTab, fieldKey])

  const fieldData = FIELD_ROLES[fieldKey] || FIELD_ROLES.cse
  const dnaRoles = profile?.career_dna?.results?.map((r: any) => r.career).filter(Boolean) || []
  const jobRoles = [...new Set([...dnaRoles, ...fieldData.roles])].slice(0, 12)
  const internRoles = [...new Set([...dnaRoles.map((r: string) => r + ' Intern'), ...fieldData.internRoles])].slice(0, 10)
  const searchQuery = customSearch.trim() || activeSearch

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (customSearch.trim()) setActiveSearch(customSearch.trim())
  }

  const totalJobs = Object.values(JOB_PLATFORMS).reduce((s, arr) => s + arr.length, 0)
  const totalInternships = Object.values(INTERNSHIP_PLATFORMS).reduce((s, arr) => s + arr.length, 0)
  const currentRoles = activeTab === 'jobs' ? jobRoles : internRoles

  if (accessGranted === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: 40, height: 40, animation: 'spin 1s linear infinite', color: '#7c3aed' }} />
      </div>
    );
  }

  if (accessGranted === false) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? 'transparent' : '#f8fafc', padding: 24, position: 'relative' }}>
        <motion.div animate={{ x: [-30, 30, -30], y: [-20, 20, -20] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'fixed', top: '10%', left: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
        <motion.div animate={{ x: [20, -20, 20], y: [30, -30, 30] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'fixed', bottom: '10%', right: '10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(59,130,246,0.1), transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          style={{ maxWidth: 460, width: '100%', background: theme === 'dark' ? 'rgba(30, 27, 75, 0.4)' : 'white', backdropFilter: 'blur(16px)', border: theme === 'dark' ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid rgba(0,0,0,0.05)', borderRadius: 24, padding: '40px 32px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', position: 'relative', zIndex: 10 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: theme === 'dark' ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: theme === 'dark' ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(124,58,237,0.1)' }}>
            <Lock style={{ width: 28, height: 28, color: '#a78bfa' }} />
          </div>
          <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 24, fontWeight: 900, marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Jobs Locked</h2>
          <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#475569', fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
            To ensure we match you with the best possible roles, you need to discover your <strong>Career DNA</strong> and complete your <strong>Skill Gap Analysis</strong> first.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to="/career-dna" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
              Take Career DNA <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <Link to="/skill-gap" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)', color: theme === 'dark' ? 'white' : '#0f172a', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Analyze Skill Gap <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div animate={{ x: [-30, 30, -30], y: [-20, 20, -20] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '-5%', left: '-5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,58,237,0.14), transparent 65%)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(124,58,237,0.06) 1px, transparent 1px)', backgroundSize: '36px 36px', opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '48px 16px 80px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 36 }}>

          <h1 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900, margin: '0 0 10px', lineHeight: 1.05, letterSpacing: '-1px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Jobs & Internships{' '}
            <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #a855f7, #3b82f6)' }}>Made for You</span>
          </h1>
          <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.65)' : '#64748b', fontSize: 14, margin: 0 }}>
            {totalJobs} job platforms + {totalInternships} internship platforms — pre-searched for your role
          </p>
        </motion.div>

        {/* Career DNA Banner */}
        {dnaRoles.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 14, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Brain style={{ width: 16, height: 16, color: '#c4b5fd', flexShrink: 0 }} />
            <span style={{ color: '#c4b5fd', fontSize: 13, fontWeight: 600 }}>Career DNA: </span>
            <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(15,23,42,0.85)', fontSize: 13 }}>{dnaRoles.slice(0, 3).join(' · ')}</span>
          </motion.div>
        )}

        {/* Tab Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.04)', borderRadius: 14, padding: 4, gap: 4 }}>
            {[
              { id: 'jobs', label: 'Jobs', icon: Briefcase, count: totalJobs, color: '#a78bfa' },
              { id: 'internships', label: 'Internships', icon: GraduationCap, count: totalInternships, color: '#34d399' },
            ].map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <motion.button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setActiveSearch(tab.id === 'jobs' ? (dnaRoles[0] || fieldData.roles[0]) : (fieldData.internRoles[0] || 'Software Developer Intern')); setCustomSearch('') }}
                  whileTap={{ scale: 0.97 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 10, border: 'none', background: active ? `${tab.color}20` : 'transparent', color: active ? tab.color : 'rgba(148,163,184,0.6)', fontSize: 14, fontWeight: active ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s', boxShadow: active ? `0 0 14px ${tab.color}30` : 'none' }}>
                  <Icon style={{ width: 15, height: 15 }} />
                  {tab.label}
                  <span style={{ background: active ? `${tab.color}25` : 'rgba(255,255,255,0.06)', color: active ? tab.color : 'rgba(148,163,184,0.5)', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 999 }}>{tab.count}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Role Selector */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ position: 'relative', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 24, padding: '24px 24px 20px', marginBottom: 24, overflow: 'hidden' }}>
          {/* background glow */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target style={{ width: 14, height: 14, color: '#c4b5fd' }} />
            </div>
            <div>
              <span style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.01em' }}>
                {activeTab === 'jobs' ? 'Select Job Role' : 'Select Internship Role'}
              </span>
              <span style={{ color: 'rgba(167,139,250,0.7)', fontSize: 11, marginLeft: 8 }}>— {fieldData.title}</span>
            </div>
          </div>
          {/* role chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {currentRoles.map((role, i) => {
              const active = activeSearch === role && !customSearch.trim()
              return (
                <motion.button key={role} onClick={() => { setActiveSearch(role); setCustomSearch('') }}
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2, scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  style={{
                    padding: '8px 16px', borderRadius: 12, fontSize: 12.5, fontWeight: active ? 700 : 500,
                    cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    border: `1.5px solid ${active ? 'rgba(167,139,250,0.7)' : 'rgba(255,255,255,0.1)'}`,
                    background: active
                      ? 'linear-gradient(135deg, rgba(124,58,237,0.45), rgba(91,33,182,0.3))'
                      : (theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                    color: active ? (theme === 'dark' ? '#e9d5ff' : '#5b21b6') : (theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(15,23,42,0.6)'),
                    boxShadow: active ? '0 0 18px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1)' : 'none',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 5
                  }}>
                  {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 6px #a78bfa', display: 'inline-block' }} />}
                  {role}
                </motion.button>
              )
            })}
          </div>
          {/* search bar */}
          <form onSubmit={handleCustomSearch} style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(167,139,250,0.5)' }} />
              <input type="text" value={customSearch} onChange={e => setCustomSearch(e.target.value)}
                placeholder="Or type any custom role..."
                style={{ width: '100%', paddingLeft: 40, paddingRight: 14, paddingTop: 11, paddingBottom: 11, background: 'rgba(124,58,237,0.07)', border: '1.5px solid rgba(124,58,237,0.2)', borderRadius: 12, color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }}
                onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.55)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.2)')} />
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{ background: '#7c3aed', padding: '11px 20px', border: 'none', borderRadius: 12, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, boxShadow: '0 4px 16px rgba(124,58,237,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Search <ChevronRight style={{ width: 13, height: 13 }} />
            </motion.button>
          </form>
        </motion.div>

        {/* Active Search Display */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 999, padding: '8px 18px' }}>
            <Briefcase style={{ width: 14, height: 14, color: '#a78bfa' }} />
            <span style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 13 }}>Searching:</span>
            <span style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 14, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{searchQuery}</span>
            {activeTab === 'internships' && <span style={{ color: '#34d399', fontSize: 12, fontWeight: 600 }}>+ internship</span>}
          </div>
        </div>

        {/* Featured Direct Apply Jobs Section */}
        {jobsLoading ? (
          <div style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
            <Loader2 style={{ width: 32, height: 32, color: '#7c3aed', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : featuredJobs.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Sparkles style={{ width: 18, height: 18, color: '#f59e0b' }} />
              <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : '#0f172a', fontSize: 18, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Featured Jobs (Save to Tracker)</span>
              <span style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, marginLeft: 4 }}>NEW</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {featuredJobs.map((job, i) => (
                <FeaturedJobCard key={job.id || i} job={job} index={i} onApplySuccess={showToast} />
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div>
            <PlatformSection title="General Job Portals" icon={Globe} iconColor="#a78bfa" platforms={JOB_PLATFORMS.general} searchQuery={searchQuery} isInternship={false} delay={0.1} />
            <PlatformSection title="Tech Job Portals" icon={Briefcase} iconColor="#60a5fa" platforms={JOB_PLATFORMS.tech} searchQuery={searchQuery} isInternship={false} delay={0.15} />
            <PlatformSection title="Global Job Search" icon={Globe} iconColor="#34d399" platforms={JOB_PLATFORMS.global} searchQuery={searchQuery} isInternship={false} delay={0.2} />
            <PlatformSection title="India-Specific + Freshers" icon={Sparkles} iconColor="#f59e0b" platforms={JOB_PLATFORMS.india} searchQuery={searchQuery} isInternship={false} delay={0.25} />
            <PlatformSection title="Company Career Pages — Direct Apply" icon={Building2} iconColor="#f87171" platforms={JOB_PLATFORMS.company} searchQuery={searchQuery} isInternship={false} delay={0.3} />
          </div>
        )}

        {/* INTERNSHIPS TAB */}
        {activeTab === 'internships' && (
          <div>
            <PlatformSection title="General Internship Platforms" icon={GraduationCap} iconColor="#34d399" platforms={INTERNSHIP_PLATFORMS.general} searchQuery={searchQuery} isInternship={true} delay={0.1} />
            <PlatformSection title="Student & Campus Based" icon={Sparkles} iconColor="#a78bfa" platforms={INTERNSHIP_PLATFORMS.student} searchQuery={searchQuery} isInternship={true} delay={0.15} />
            <PlatformSection title="Government / Official Internships" icon={Building2} iconColor="#f87171" platforms={INTERNSHIP_PLATFORMS.government} searchQuery={searchQuery} isInternship={true} delay={0.2} />
            <PlatformSection title="Company Internship Pages — Direct Apply" icon={Building2} iconColor="#fb923c" platforms={INTERNSHIP_PLATFORMS.company} searchQuery={searchQuery} isInternship={true} delay={0.25} />
          </div>
        )}

      </div>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: 16,
              boxShadow: '0 10px 40px rgba(16,185,129,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              zIndex: 1000,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <CheckCircle style={{ width: 24, height: 24 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>Job Saved</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>{toast.message}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
