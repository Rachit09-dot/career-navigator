import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Target, ArrowRight, RotateCcw,
  CheckCircle, X, Zap, Briefcase, TrendingUp, Lock, Loader2
} from 'lucide-react'
import { careerAPI, profileAPI } from '../services/api'
import { getQuestionsForField, getFieldLabel, type DNAQuestion } from '../data/career-dna-questions'
import { useAuthStore } from '../store/authStore'
import { useTheme } from '../context/ThemeContext'

// ── Processing messages ───────────────────────────────────────────────────────
const PROCESSING_MSGS = [
  'Analyzing your responses...',
  'Mapping personality patterns...',
  'Calculating career matches...',
  'Your results are ready! 🎉',
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
}

const RANK_COLORS = ['#f59e0b', '#94a3b8', '#cd7f32']
const RANK_LABELS = ['Best Match ⭐', 'Strong Match', 'Good Match']

// ── Personality type map (60+ types) ─────────────────────────────────────────
function getPersonalityType(career: string, allC: string, matchScore: number) {
  const c = career.toLowerCase()
  const high = matchScore >= 85
  // ENGINEERING / TECH
  if (c.includes('software') || c.includes('developer') || c.includes('programmer')) {
    if (allC.includes('data') && allC.includes('product')) return { type: 'The Full-Stack Visionary', desc: 'You code, analyze, and strategize — all at once. You are the rare engineer who understands the entire product lifecycle from database to dashboard.' }
    if (allC.includes('security') || allC.includes('cyber')) return { type: 'The Digital Guardian', desc: 'You build systems and then break them to make them stronger. Your mind works like both an attacker and a defender — always two steps ahead.' }
    if (allC.includes('ml') || allC.includes('ai') || allC.includes('machine learning')) return { type: 'The AI Architect', desc: 'You build the future. You combine software engineering with machine learning to create systems that learn, adapt, and improve on their own.' }
    if (allC.includes('product')) return { type: 'The Builder-Thinker', desc: 'You code with purpose. You understand both the technical depth and the product vision — making you the kind of engineer every startup dreams of.' }
    if (allC.includes('data')) return { type: 'The Tech Architect', desc: 'You build systems that scale. You think in code and data simultaneously — a rare combination that makes you invaluable in the modern tech world.' }
    if (high) return { type: 'The Code Craftsman', desc: 'You write code like poetry — clean, efficient, and purposeful. You have a rare ability to turn complex requirements into elegant technical solutions.' }
    return { type: 'The Problem Solver', desc: 'You think in systems and love breaking complex problems into elegant solutions. You thrive in technical environments where logic meets creativity.' }
  }
  if (c.includes('devops') || c.includes('cloud') || c.includes('infrastructure')) return { type: 'The Systems Orchestrator', desc: 'You are the invisible force that keeps everything running. You build the pipelines, automate the processes, and ensure that great software actually reaches users.' }
  if (c.includes('cybersecurity') || c.includes('security analyst')) return { type: 'The Threat Hunter', desc: 'You think like an adversary to protect like a guardian. Your ability to anticipate attacks before they happen makes you one of the most valuable people in any organization.' }
  if (c.includes('ml engineer') || c.includes('machine learning')) return { type: 'The Intelligence Builder', desc: 'You teach machines to think. You combine mathematical rigor with engineering skill to build AI systems that solve problems humans cannot tackle alone.' }
  if (c.includes('data scientist')) {
    if (allC.includes('product') || allC.includes('business')) return { type: 'The Insight Strategist', desc: 'You turn numbers into decisions. You bridge the gap between raw data and business strategy — making every team smarter and every product better.' }
    return { type: 'The Pattern Hunter', desc: 'You see signal in the noise. You combine mathematical rigor with machine learning intuition to extract insights that others simply cannot see.' }
  }
  if (c.includes('data analyst') || c.includes('business analyst')) {
    if (allC.includes('finance')) return { type: 'The Financial Intelligence Expert', desc: 'You decode the language of money. You combine analytical skills with financial acumen to help organizations make smarter, data-backed decisions.' }
    if (allC.includes('marketing')) return { type: 'The Growth Analyst', desc: 'You find the levers that drive growth. You combine data analysis with marketing intuition to identify what works and scale it relentlessly.' }
    return { type: 'The Data Thinker', desc: 'You make decisions backed by evidence. You love turning raw data into meaningful insights that drive real business outcomes.' }
  }
  if (c.includes('embedded') || c.includes('vlsi') || c.includes('electronics')) return { type: 'The Hardware Whisperer', desc: 'You work at the intersection of software and silicon. You understand how code talks to hardware — a skill that powers everything from smartphones to satellites.' }
  if (c.includes('mechanical') || c.includes('civil') || c.includes('structural')) return { type: 'The Physical World Builder', desc: 'You design things that exist in the real world. Your work has weight, dimension, and permanence — and that is what makes it deeply satisfying.' }
  if (c.includes('aerospace') || c.includes('aviation')) return { type: 'The Sky Architect', desc: 'You design machines that defy gravity. Your work demands precision, innovation, and a willingness to push the boundaries of what is physically possible.' }
  // PRODUCT & MANAGEMENT
  if (c.includes('product manager') || c.includes('product')) {
    if (allC.includes('data') || allC.includes('analyst')) return { type: 'The Data-Driven Product Leader', desc: 'You build products with evidence, not assumptions. You combine product intuition with analytical rigor to make decisions that users and stakeholders both love.' }
    if (high) return { type: 'The Product Visionary', desc: 'You see products not as they are, but as they could be. You combine deep user empathy with strategic thinking to build things people genuinely love.' }
    return { type: 'The Strategic Builder', desc: 'You bridge vision and execution. You understand people, processes, and products — and know exactly how to bring them together to ship great things.' }
  }
  if (c.includes('project manager') || c.includes('operations manager')) return { type: 'The Execution Engine', desc: 'You make things happen. Where others see chaos, you see a plan. You are the person who turns ambitious ideas into delivered results — on time, every time.' }
  if (c.includes('marketing manager') || c.includes('brand manager')) {
    if (allC.includes('digital') || allC.includes('social media')) return { type: 'The Digital Growth Hacker', desc: 'You understand the algorithms and the humans behind them. You craft campaigns that cut through the noise and build brands that people actually care about.' }
    return { type: 'The Influence Architect', desc: 'You understand what makes people tick. You craft messages that resonate, campaigns that convert, and brands that people genuinely love.' }
  }
  if (c.includes('entrepreneur') || c.includes('startup') || c.includes('founder')) {
    if (allC.includes('tech') || allC.includes('software')) return { type: 'The Tech Entrepreneur', desc: 'You build companies, not just products. You combine technical depth with business acumen and the relentless drive to create something that changes the world.' }
    return { type: 'The Visionary Maker', desc: 'You see opportunities where others see obstacles. You have the drive to build something from nothing and the resilience to keep going when it gets hard.' }
  }
  if (c.includes('consultant') || c.includes('strategy')) return { type: 'The Strategic Advisor', desc: 'You see the big picture and the details simultaneously. You help organizations navigate complexity and make better decisions under pressure.' }
  if (c.includes('hr') || c.includes('human resources') || c.includes('talent')) return { type: 'The People Architect', desc: 'You understand that organizations are built on people. You create cultures, develop talent, and build the human systems that make great companies possible.' }
  // MEDICAL & HEALTH
  if (c.includes('surgeon') || c.includes('specialist')) {
    if (allC.includes('research') || allC.includes('academic')) return { type: 'The Surgical Innovator', desc: 'You operate at the frontier of medicine. You combine surgical precision with research curiosity to push the boundaries of what is medically possible.' }
    return { type: 'The Precision Expert', desc: 'You operate at the intersection of science and skill. Your work demands absolute precision, deep knowledge, and the ability to stay calm under pressure.' }
  }
  if (c.includes('doctor') || c.includes('physician') || c.includes('mbbs')) {
    if (allC.includes('research')) return { type: 'The Clinician-Scientist', desc: 'You treat patients and advance medicine simultaneously. You bring the rigor of research to the bedside — making you a rare force in modern healthcare.' }
    if (allC.includes('public health') || allC.includes('community')) return { type: 'The Community Healer', desc: 'You see health as a social issue, not just a medical one. You work to improve the health of entire communities, not just individual patients.' }
    if (high) return { type: 'The Compassionate Expert', desc: 'You combine deep medical knowledge with genuine human warmth. Patients trust you not just because you are skilled, but because they feel truly cared for.' }
    return { type: 'The Compassionate Healer', desc: 'You are driven by empathy and science in equal measure. You combine deep medical knowledge with genuine care for the people in front of you.' }
  }
  if (c.includes('pharmacist') || c.includes('pharmacy')) return { type: 'The Medicine Expert', desc: 'You are the bridge between science and patient care. Your knowledge of drugs, interactions, and treatments makes you a critical part of every healthcare team.' }
  if (c.includes('physiotherapist') || c.includes('rehabilitation')) return { type: 'The Recovery Specialist', desc: 'You help people reclaim their lives. Your combination of anatomy knowledge and patient empathy makes you a powerful force in healing and rehabilitation.' }
  if (c.includes('healthcare manager') || c.includes('hospital administrator')) return { type: 'The Health Systems Leader', desc: 'You run the engine that keeps healthcare working. You combine medical understanding with management skills to make hospitals and clinics function at their best.' }
  if (c.includes('medical researcher') || c.includes('clinical researcher')) return { type: 'The Medical Pioneer', desc: 'You are on the front lines of medical discovery. Your research today will become the treatments that save lives tomorrow.' }
  if (c.includes('psychiatrist') || c.includes('psychologist') || c.includes('mental health')) return { type: 'The Mind Healer', desc: 'You help people understand themselves and navigate life\'s hardest moments. Your empathy and insight create safe spaces where real transformation happens.' }
  // LAW
  if (c.includes('corporate lawyer') || c.includes('corporate law')) {
    if (allC.includes('finance') || allC.includes('investment')) return { type: 'The Deal Architect', desc: 'You sit at the intersection of law and finance. You structure complex transactions, protect stakeholders, and ensure that billion-dollar deals hold up under scrutiny.' }
    return { type: 'The Deal Maker', desc: 'You navigate the complex world of business law with precision. You protect companies, structure deals, and ensure that agreements hold up under scrutiny.' }
  }
  if (c.includes('advocate') || c.includes('litigation')) {
    if (allC.includes('criminal')) return { type: 'The Justice Warrior', desc: 'You fight for justice in the most high-stakes arena there is. Your ability to construct arguments and challenge evidence makes you a formidable force in the courtroom.' }
    return { type: 'The Logical Defender', desc: 'You have a sharp analytical mind and a strong sense of justice. You construct arguments with precision and fight for what is right in the courtroom.' }
  }
  if (c.includes('legal advisor') || c.includes('legal consultant')) return { type: 'The Risk Navigator', desc: 'You help people and organizations avoid legal pitfalls. Your ability to anticipate problems before they happen makes you an invaluable advisor.' }
  if (c.includes('judge') || c.includes('judiciary')) return { type: 'The Balanced Arbiter', desc: 'You weigh evidence with impartiality and deliver justice with wisdom. Your commitment to fairness and the rule of law defines everything you do.' }
  if (c.includes('public prosecutor') || c.includes('prosecutor')) return { type: 'The Truth Enforcer', desc: 'You represent society in its pursuit of justice. Your ability to build airtight cases and present them compellingly makes you a powerful force for accountability.' }
  if (c.includes('intellectual property') || c.includes('ip lawyer')) return { type: 'The Innovation Protector', desc: 'You protect the ideas that drive progress. You understand both the law and the technology well enough to defend the creative and intellectual work of others.' }
  // EDUCATION
  if (c.includes('professor') || c.includes('academic')) {
    if (allC.includes('research')) return { type: 'The Knowledge Creator', desc: 'You do not just teach — you advance the frontier of human knowledge. You combine deep expertise with the ability to inspire the next generation of thinkers.' }
    return { type: 'The Intellectual Guide', desc: 'You shape minds at the highest level. Your depth of knowledge and ability to challenge assumptions makes you a transformative force in higher education.' }
  }
  if (c.includes('teacher') || c.includes('educator')) {
    if (allC.includes('technology') || allC.includes('edtech')) return { type: 'The EdTech Innovator', desc: 'You are reimagining how people learn. You combine pedagogical expertise with technology to create educational experiences that are more engaging and effective.' }
    if (high) return { type: 'The Inspiring Mentor', desc: 'You do not just teach subjects — you change lives. Students remember you not for what you taught, but for how you made them believe in themselves.' }
    return { type: 'The Knowledge Sharer', desc: 'You have a natural ability to simplify complex ideas and inspire others. You find deep satisfaction in watching people grow because of your guidance.' }
  }
  if (c.includes('curriculum') || c.includes('education consultant')) return { type: 'The Learning Architect', desc: 'You design how people learn. You understand pedagogy, psychology, and content — and use all three to create educational experiences that actually work.' }
  if (c.includes('school principal') || c.includes('education administrator')) return { type: 'The Institution Builder', desc: 'You create the environment where learning thrives. Your leadership shapes the culture, standards, and outcomes of an entire educational community.' }
  if (c.includes('trainer') || c.includes('corporate trainer')) return { type: 'The Performance Coach', desc: 'You unlock potential in professionals. You understand adult learning and organizational behavior well enough to create training that actually changes how people work.' }
  // DESIGN & CREATIVE
  if (c.includes('ui') || c.includes('ux') || c.includes('product designer')) {
    if (allC.includes('research') || allC.includes('user research')) return { type: 'The Empathy-Driven Designer', desc: 'You design from the inside out. You start with deep user research and work outward to create interfaces that feel intuitive because they are built on real human insight.' }
    if (high) return { type: 'The Experience Craftsman', desc: 'You design how people feel when they use technology. You combine empathy, aesthetics, and logic to create interfaces that are both beautiful and intuitive.' }
    return { type: 'The Visual Thinker', desc: 'You see the world through aesthetics and user experience. You combine creativity with empathy to craft solutions that are both beautiful and functional.' }
  }
  if (c.includes('graphic designer') || c.includes('visual designer')) return { type: 'The Visual Communicator', desc: 'You speak in images, colors, and typography. You translate complex ideas into visuals that communicate instantly and leave a lasting impression.' }
  if (c.includes('animator') || c.includes('motion designer')) return { type: 'The Motion Artist', desc: 'You bring static ideas to life. Your ability to combine storytelling with technical animation skills makes you a rare creative force in the digital world.' }
  if (c.includes('art director') || c.includes('creative director')) return { type: 'The Creative Commander', desc: 'You lead with vision. You set the aesthetic direction for entire projects and inspire teams to execute at the highest creative level.' }
  if (c.includes('brand designer') || c.includes('brand strategist')) return { type: 'The Identity Architect', desc: 'You build the visual and emotional identity of organizations. You understand that great branding is not just about looks — it is about meaning and trust.' }
  // MEDIA & COMMUNICATION
  if (c.includes('journalist') || c.includes('reporter')) {
    if (allC.includes('investigative') || allC.includes('data journalism')) return { type: 'The Investigative Mind', desc: 'You dig where others stop. You combine journalistic instinct with data skills to uncover stories that powerful people would rather keep hidden.' }
    return { type: 'The Truth Seeker', desc: 'You are driven by a relentless curiosity and a commitment to facts. You dig deep, ask hard questions, and tell stories that matter to society.' }
  }
  if (c.includes('content creator') || c.includes('youtuber')) return { type: 'The Digital Storyteller', desc: 'You understand the new media landscape intuitively. You create content that connects, entertains, and builds communities in the digital age.' }
  if (c.includes('pr manager') || c.includes('public relations')) return { type: 'The Reputation Architect', desc: 'You shape how the world sees organizations and people. Your ability to craft narratives and manage crises makes you a powerful behind-the-scenes force.' }
  if (c.includes('news anchor') || c.includes('broadcaster')) return { type: 'The Voice of Authority', desc: 'You communicate with clarity and confidence. You have the rare ability to distill complex events into clear, compelling narratives for mass audiences.' }
  if (c.includes('film director') || c.includes('filmmaker')) return { type: 'The Visual Narrator', desc: 'You tell stories through the most powerful medium humans have ever created. You combine technical mastery with artistic vision to create experiences that move people.' }
  if (c.includes('radio') || c.includes('podcast')) return { type: 'The Audio Storyteller', desc: 'You understand the intimate power of voice. You create audio experiences that inform, entertain, and connect with listeners in a deeply personal way.' }
  // CIVIL SERVICES & GOVERNMENT
  if (c.includes('ias') || c.includes('ips') || c.includes('ifs')) return { type: 'The Nation Builder', desc: 'You are driven by a desire to serve at the highest level. You combine intellectual rigor with a deep sense of duty to create change that affects millions.' }
  if (c.includes('government') || c.includes('civil services')) return { type: 'The Public Servant', desc: 'You are motivated by impact at scale. You want to use your abilities to improve systems, policies, and lives — not just for a few, but for everyone.' }
  if (c.includes('revenue officer') || c.includes('block development')) return { type: 'The Grassroots Leader', desc: 'You create change where it matters most — at the ground level. You understand that real development happens in villages and districts, not just in capital cities.' }
  // AGRICULTURE & ENVIRONMENT
  if (c.includes('agricultural officer') || c.includes('agri researcher')) {
    if (allC.includes('technology') || allC.includes('agritech')) return { type: 'The AgriTech Pioneer', desc: 'You are modernizing one of humanity\'s oldest industries. You combine agricultural science with technology to make farming smarter, more efficient, and more sustainable.' }
    return { type: 'The Earth Steward', desc: 'You understand that feeding the world is one of humanity\'s greatest challenges. You combine scientific knowledge with practical wisdom to make agriculture smarter.' }
  }
  if (c.includes('food scientist') || c.includes('food technologist')) return { type: 'The Food Innovator', desc: 'You work at the intersection of science and sustenance. You develop the foods, processes, and safety standards that feed billions of people every day.' }
  if (c.includes('environmental') || c.includes('sustainability')) return { type: 'The Planet Protector', desc: 'You are driven by a deep responsibility to the natural world. You use science and policy to fight for a sustainable future for generations to come.' }
  if (c.includes('horticulturist') || c.includes('soil scientist')) return { type: 'The Nature Scientist', desc: 'You understand the living systems that sustain all life on Earth. Your work with plants, soil, and ecosystems makes you a guardian of our natural foundation.' }
  // SPORTS & FITNESS
  if (c.includes('sports coach') || c.includes('coach')) {
    if (allC.includes('data') || allC.includes('analytics')) return { type: 'The Analytics-Driven Coach', desc: 'You combine the art of coaching with the science of data. You use performance analytics to unlock potential that traditional coaching methods would never find.' }
    return { type: 'The Performance Catalyst', desc: 'You unlock potential in others. You understand the psychology of performance and the science of training — and you use both to help people exceed their limits.' }
  }
  if (c.includes('sports analyst') || c.includes('sports manager')) return { type: 'The Game Strategist', desc: 'You see sports through the lens of data and strategy. You find the patterns that give teams and athletes a competitive edge that others cannot see.' }
  if (c.includes('fitness trainer') || c.includes('physiotherapist')) return { type: 'The Body Optimizer', desc: 'You understand the human body as a high-performance machine. You help people move better, recover faster, and perform at levels they never thought possible.' }
  // SOCIAL WORK & NGO
  if (c.includes('social worker') || c.includes('community developer')) {
    if (allC.includes('policy') || allC.includes('government')) return { type: 'The Policy Changemaker', desc: 'You work at the intersection of grassroots reality and policy change. You translate the needs of communities into the language of governments and institutions.' }
    return { type: 'The Change Catalyst', desc: 'You are driven by a deep belief that every person deserves dignity and opportunity. You work tirelessly to build systems that lift people up.' }
  }
  if (c.includes('ngo manager') || c.includes('development officer')) return { type: 'The Impact Architect', desc: 'You build organizations that create change. You combine management skills with social mission to run NGOs and development programs that actually deliver results.' }
  if (c.includes('counselor') || c.includes('therapist')) return { type: 'The Healing Presence', desc: 'You create the safe space where people can finally be honest with themselves. Your empathy and training help people navigate their darkest moments and find their way forward.' }
  // DEFENCE
  if (c.includes('army officer') || c.includes('military')) return { type: 'The Disciplined Warrior', desc: 'You are built for service, sacrifice, and leadership under pressure. You combine physical and mental toughness with a deep commitment to protecting others.' }
  if (c.includes('navy officer') || c.includes('naval')) return { type: 'The Maritime Commander', desc: 'You lead in one of the most demanding environments on Earth. Your ability to navigate complex operations at sea makes you a rare and essential leader.' }
  if (c.includes('air force') || c.includes('pilot')) return { type: 'The Sky Commander', desc: 'You operate at the edge of human capability. Your precision, quick thinking, and courage in the air make you one of the most elite professionals in the world.' }
  if (c.includes('defence analyst') || c.includes('nda')) return { type: 'The Strategic Defender', desc: 'You protect the nation through intelligence and strategy. Your ability to analyze threats and develop responses makes you a critical asset in national security.' }
  // FINANCE
  if (c.includes('chartered accountant') || c.includes('ca')) {
    if (allC.includes('audit') || allC.includes('compliance')) return { type: 'The Financial Integrity Guardian', desc: 'You are the last line of defense against financial fraud and mismanagement. Your meticulous attention to detail and ethical standards protect organizations and investors.' }
    return { type: 'The Financial Architect', desc: 'You are the backbone of every business. Your mastery of numbers, taxation, and compliance makes you the trusted guardian of financial integrity.' }
  }
  if (c.includes('investment banker') || c.includes('investment')) return { type: 'The Capital Navigator', desc: 'You move money with purpose. You understand markets, valuations, and deals — and you thrive in high-stakes environments where every decision counts.' }
  if (c.includes('financial analyst') || c.includes('equity analyst')) return { type: 'The Market Decoder', desc: 'You read the language of markets. You analyze companies, industries, and economic trends to find the investments that others overlook.' }
  if (c.includes('actuary') || c.includes('risk analyst')) return { type: 'The Risk Quantifier', desc: 'You put numbers on uncertainty. Your ability to model risk and probability makes you invaluable in insurance, finance, and any industry where the future matters.' }
  // HOTEL & HOSPITALITY
  if (c.includes('hotel manager') || c.includes('hospitality manager')) return { type: 'The Experience Orchestrator', desc: 'You create the environments where people feel genuinely welcomed and cared for. Your attention to detail and service instinct make every guest feel like the most important person in the room.' }
  if (c.includes('chef') || c.includes('culinary')) return { type: 'The Culinary Artist', desc: 'You create experiences through food. Your combination of technical skill, creativity, and passion for ingredients makes every dish a form of self-expression.' }
  if (c.includes('event manager') || c.includes('tourism')) return { type: 'The Moment Maker', desc: 'You create memories. Your ability to coordinate complex logistics while maintaining a seamless guest experience makes you the architect of unforgettable moments.' }
  // PARAMEDICAL
  if (c.includes('radiologist') || c.includes('radiology')) return { type: 'The Diagnostic Eye', desc: 'You see what others cannot. Your ability to read medical images and identify subtle abnormalities makes you a critical first step in the diagnostic process.' }
  if (c.includes('lab technician') || c.includes('medical lab')) return { type: 'The Precision Analyst', desc: 'You are the scientist behind the diagnosis. Your meticulous work in the laboratory provides the data that doctors need to make life-saving decisions.' }
  if (c.includes('medical coder') || c.includes('health informatics')) return { type: 'The Healthcare Data Expert', desc: 'You translate medical knowledge into the language of data and systems. Your work ensures that healthcare information flows accurately and efficiently.' }
  // DIPLOMA / ITI
  if (c.includes('electrician') || c.includes('electrical technician')) return { type: 'The Power Expert', desc: 'You keep the lights on — literally. Your mastery of electrical systems makes you an essential part of every building, factory, and infrastructure project.' }
  if (c.includes('mechanical technician') || c.includes('mechanic')) return { type: 'The Machine Whisperer', desc: 'You understand how machines work at a fundamental level. Your hands-on expertise and problem-solving ability keep the physical world running smoothly.' }
  if (c.includes('civil supervisor') || c.includes('construction')) return { type: 'The Ground-Level Builder', desc: 'You turn blueprints into reality. Your ability to manage materials, workers, and timelines on-site makes you the essential link between design and construction.' }
  // FINE ARTS
  if (c.includes('artist') || c.includes('fine artist')) return { type: 'The Creative Soul', desc: 'You see the world differently and have the skill to show others what you see. Your art is not just expression — it is a way of making people feel things they cannot put into words.' }
  if (c.includes('illustrator') || c.includes('art teacher')) return { type: 'The Visual Educator', desc: 'You teach people to see. Whether through your own illustrations or through teaching, you help others develop their visual literacy and creative confidence.' }
  // DEFAULT
  if (high) return { type: 'The High-Potential Achiever', desc: 'You have a rare combination of skills and drive. Your strong match scores suggest you are exceptionally well-suited for your chosen path — and you have the potential to excel at the highest level.' }
  return { type: 'The Adaptive Achiever', desc: 'You bring a unique combination of skills and perspectives to everything you do. You adapt quickly, learn fast, and find ways to excel in diverse environments.' }
}

// ── Component ─────────────────────────────────────────────────────────────────
const CareerDNA = () => {
  const { theme } = useTheme()
  const updateUser = useAuthStore(s => s.updateUser)
  const [state, setState] = useState<'landing' | 'questions' | 'processing' | 'results'>('landing')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [procMsg, setProcMsg] = useState(0)
  const [prevResults, setPrevResults] = useState<{ date?: string } | null>(null)
  const [exitModal, setExitModal] = useState(false)
  const [fieldStudy, setFieldStudy] = useState('')
  const [questions, setQuestions] = useState<DNAQuestion[]>([])
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null)
  const procTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load profile field_of_study + check previous results
  useEffect(() => {
    const init = async () => {
      try {
        const [assessRes, profileRes] = await Promise.allSettled([
          careerAPI.getAssessment(),
          profileAPI.getProfile(),
        ])
        if (profileRes.status === 'fulfilled') {
          const p = profileRes.value.data;
          const field = p?.field_of_study || ''
          const isComplete = p && (
            p.field_of_study && 
            p.skills?.length > 0 && 
            p.education?.length > 0
          );
          // For simplicity, we just use the completion logic here or from profileAPI
          // We can also compute percentage if we need to.
          
          setFieldStudy(field)
          setQuestions(getQuestionsForField(field))
          // Assuming we can derive >80% if certain fields exist:
          let score = 0;
          if (p?.full_name) score += 20;
          if (p?.email) score += 10;
          if (p?.phone) score += 10;
          if (p?.field_of_study) score += 20;
          if (p?.education?.length > 0) score += 20;
          if (p?.skills?.length > 0) score += 20;
          
          if (score < 80) {
            setAccessGranted(false);
          } else {
            setAccessGranted(true);
          }
        } else {
          setQuestions(getQuestionsForField(''))
          setAccessGranted(false);
        }
        if (assessRes.status === 'fulfilled' && assessRes.value.data?.results?.length) {
          setResults(assessRes.value.data.results)
          setPrevResults({ date: assessRes.value.data.created_at || assessRes.value.data.updated_at })
          setState('results')
        }
      } catch {
        setQuestions(getQuestionsForField(''))
        setAccessGranted(false);
      }
    }
    init()
  }, [])

  const startProcessing = async (finalAnswers: Record<string, string>) => {
    setState('processing')
    setProcMsg(0)
    let i = 0
    procTimer.current = setInterval(() => {
      i++
      if (i < PROCESSING_MSGS.length) setProcMsg(i)
      else if (procTimer.current) clearInterval(procTimer.current)
    }, 900)

    try {
      // Pass field context to backend (Gemini prompt)
      const payload = { 
        ...finalAnswers, 
        _field_of_study: fieldStudy,
        stream: fieldStudy,
        field: fieldStudy,
      }
      const res = await careerAPI.submitAssessment(payload)
      await new Promise(r => setTimeout(r, 3200))
      const finalResults = res.data.results || res.data
      setResults(finalResults)
      // FIX 5: update authStore so dashboard reflects immediately
      updateUser({ career_dna: { results: finalResults, completedAt: new Date().toISOString() } } as any)
    } catch {
      await new Promise(r => setTimeout(r, 3200))
      // Field-specific fallback based on user's stream
      const field = fieldStudy.toLowerCase()
      console.log('🔍 Checking field for fallback:', field) // DEBUG
      
      if (field.includes('law') || field.includes('legal')) {
        setResults([
          { career: 'Advocate', match: 85, salary: '₹5-20 LPA', growth: 'High', skills: ['Legal Research', 'Drafting', 'Litigation'], reason: 'Core law career with strong growth', path: 'Complete LLB → Clear Bar Exam → Practice' },
          { career: 'Corporate Lawyer', match: 78, salary: '₹8-30 LPA', growth: 'Very High', skills: ['Contract Law', 'M&A', 'Compliance'], reason: 'High-paying corporate legal work', path: 'LLB → Join law firm → Specialize in corporate' },
          { career: 'Legal Advisor', match: 70, salary: '₹6-18 LPA', growth: 'High', skills: ['Advisory', 'Risk Assessment', 'Documentation'], reason: 'Consulting role with flexible work', path: 'LLB → Gain experience → Advisory role' },
        ])
      } else if (field.includes('medical') || field.includes('mbbs') || field.includes('health')) {
        setResults([
          { career: 'Doctor/Physician', match: 90, salary: '₹8-40 LPA', growth: 'Very High', skills: ['Clinical Skills', 'Diagnosis', 'Patient Care'], reason: 'Core medical career', path: 'MBBS → Internship → MD/Practice' },
          { career: 'Healthcare Manager', match: 72, salary: '₹6-20 LPA', growth: 'High', skills: ['Hospital Management', 'Healthcare IT', 'Administration'], reason: 'Management track in healthcare', path: 'Medical degree → MBA/MHA → Management role' },
          { career: 'Pharmacist', match: 68, salary: '₹4-12 LPA', growth: 'Medium', skills: ['Pharmacology', 'Drug Dispensing', 'Patient Counseling'], reason: 'Stable healthcare career', path: 'B.Pharm → License → Hospital/Retail pharmacy' },
        ])
      } else if (field.includes('mass communication') || field.includes('media') || field.includes('journalism')) {
        setResults([
          { career: 'Journalist', match: 85, salary: '₹4-15 LPA', growth: 'High', skills: ['Writing', 'Research', 'Interviewing'], reason: 'Core media career', path: 'BJMC → Internship → News organization' },
          { career: 'Content Creator', match: 78, salary: '₹5-20 LPA', growth: 'Very High', skills: ['Video Production', 'Social Media', 'SEO'], reason: 'High-growth digital media', path: 'Build portfolio → Start channel → Monetize' },
          { career: 'PR Manager', match: 70, salary: '₹6-18 LPA', growth: 'High', skills: ['Communication', 'Brand Management', 'Crisis Management'], reason: 'Corporate communications role', path: 'Degree → PR agency → Corporate PR' },
        ])
      } else if (field.includes('commerce') || field.includes('finance') || field.includes('bcom') || field.includes('bba')) {
        setResults([
          { career: 'Chartered Accountant', match: 88, salary: '₹8-30 LPA', growth: 'Very High', skills: ['Accounting', 'Taxation', 'Audit'], reason: 'Top commerce career', path: 'B.Com → CA Foundation → Articleship → CA Final' },
          { career: 'Financial Analyst', match: 80, salary: '₹6-20 LPA', growth: 'High', skills: ['Excel', 'Financial Modeling', 'Valuation'], reason: 'Strong finance career', path: 'Commerce degree → CFA/MBA → Analyst role' },
          { career: 'Business Analyst', match: 72, salary: '₹7-18 LPA', growth: 'High', skills: ['Data Analysis', 'SQL', 'Business Strategy'], reason: 'Bridge between business and tech', path: 'BBA/B.Com → Learn analytics → Corporate role' },
        ])
      } else if (field.includes('civil services') || field.includes('upsc') || field.includes('ias') || field.includes('ips') || field.includes('government')) {
        setResults([
          { career: 'IAS Officer', match: 92, salary: '₹56K-2.5L/month', growth: 'Very High', skills: ['General Knowledge', 'Current Affairs', 'Essay Writing'], reason: 'Top administrative position', path: 'Graduate → UPSC Prelims → Mains → Interview' },
          { career: 'IPS Officer', match: 85, salary: '₹56K-2.25L/month', growth: 'Very High', skills: ['Law & Order', 'Leadership', 'Physical Fitness'], reason: 'Police administration career', path: 'Graduate → UPSC → IPS training' },
          { career: 'State PCS Officer', match: 78, salary: '₹40K-1.5L/month', growth: 'High', skills: ['State Affairs', 'Administration', 'Public Policy'], reason: 'State-level administration', path: 'Graduate → State PSC exam → Training' },
        ])
      } else if (field.includes('agriculture') || field.includes('agri')) {
        setResults([
          { career: 'Agricultural Officer', match: 85, salary: '₹4-12 LPA', growth: 'High', skills: ['Crop Management', 'Soil Science', 'Farm Management'], reason: 'Government agriculture role', path: 'B.Sc Agriculture → State exams → Officer' },
          { career: 'Food Scientist', match: 75, salary: '₹5-15 LPA', growth: 'High', skills: ['Food Technology', 'Quality Control', 'R&D'], reason: 'Food industry career', path: 'B.Sc Food Tech → Industry/Research' },
          { career: 'Agri Entrepreneur', match: 68, salary: '₹6-25 LPA', growth: 'Very High', skills: ['Business', 'Farming', 'Marketing'], reason: 'Own agribusiness', path: 'Agriculture degree → Start farm/agritech' },
        ])
      } else if (field.includes('education') || field.includes('teaching') || field.includes('b.ed')) {
        setResults([
          { career: 'School Teacher', match: 88, salary: '₹3-10 LPA', growth: 'Medium', skills: ['Teaching Methods', 'Subject Knowledge', 'Classroom Management'], reason: 'Core teaching career', path: 'B.Ed → CTET/TET → School job' },
          { career: 'Professor', match: 80, salary: '₹6-20 LPA', growth: 'High', skills: ['Research', 'Higher Education', 'Subject Expertise'], reason: 'College/university teaching', path: 'Masters → PhD → NET/SET → Professor' },
          { career: 'Education Consultant', match: 72, salary: '₹5-18 LPA', growth: 'High', skills: ['Curriculum Design', 'EdTech', 'Training'], reason: 'Educational advisory role', path: 'B.Ed → Experience → Consulting' },
        ])
      } else if (field.includes('design') || field.includes('ui') || field.includes('ux') || field.includes('graphic')) {
        setResults([
          { career: 'UI/UX Designer', match: 88, salary: '₹6-20 LPA', growth: 'Very High', skills: ['Figma', 'User Research', 'Prototyping'], reason: 'High-demand design career', path: 'Design degree → Portfolio → Product companies' },
          { career: 'Graphic Designer', match: 78, salary: '₹4-15 LPA', growth: 'High', skills: ['Photoshop', 'Illustrator', 'Branding'], reason: 'Visual design career', path: 'Design course → Freelance/Agency' },
          { career: 'Product Designer', match: 72, salary: '₹8-25 LPA', growth: 'Very High', skills: ['Design Thinking', 'Prototyping', 'User Testing'], reason: 'End-to-end product design', path: 'Design degree → Product companies' },
        ])
      } else if (field.includes('hotel') || field.includes('hospitality') || field.includes('bhm')) {
        setResults([
          { career: 'Hotel Manager', match: 85, salary: '₹5-18 LPA', growth: 'High', skills: ['Hotel Operations', 'Customer Service', 'Management'], reason: 'Core hospitality career', path: 'BHM → Hotel internship → Management' },
          { career: 'Chef', match: 78, salary: '₹4-20 LPA', growth: 'High', skills: ['Culinary Arts', 'Menu Planning', 'Kitchen Management'], reason: 'Creative culinary career', path: 'Culinary course → Kitchen experience → Chef' },
          { career: 'Event Manager', match: 70, salary: '₹5-15 LPA', growth: 'High', skills: ['Event Planning', 'Coordination', 'Vendor Management'], reason: 'Dynamic events career', path: 'Hospitality degree → Event companies' },
        ])
      } else if (field.includes('sports') || field.includes('physical education') || field.includes('bped')) {
        setResults([
          { career: 'Sports Coach', match: 88, salary: '₹4-15 LPA', growth: 'High', skills: ['Coaching', 'Sports Psychology', 'Training Methods'], reason: 'Develop athletes', path: 'BPEd → Coaching certification → Academy/School' },
          { career: 'Fitness Trainer', match: 78, salary: '₹3-12 LPA', growth: 'High', skills: ['Fitness Training', 'Nutrition', 'Exercise Science'], reason: 'Health & fitness career', path: 'Sports degree → Certification → Gym/Personal training' },
          { career: 'Sports Manager', match: 70, salary: '₹6-20 LPA', growth: 'High', skills: ['Sports Management', 'Marketing', 'Event Organization'], reason: 'Business side of sports', path: 'Sports degree → MBA → Sports organizations' },
        ])
      } else if (field.includes('social work') || field.includes('ngo') || field.includes('bsw')) {
        setResults([
          { career: 'Social Worker', match: 90, salary: '₹3-10 LPA', growth: 'Medium', skills: ['Community Work', 'Counseling', 'Project Management'], reason: 'Direct community impact', path: 'BSW → NGO/Government programs' },
          { career: 'NGO Manager', match: 78, salary: '₹5-15 LPA', growth: 'High', skills: ['Program Management', 'Fundraising', 'Leadership'], reason: 'Lead social initiatives', path: 'Social work degree → NGO experience → Management' },
          { career: 'Policy Analyst', match: 70, salary: '₹6-18 LPA', growth: 'High', skills: ['Policy Research', 'Analysis', 'Advocacy'], reason: 'Influence social policy', path: 'Social sciences → Research → Policy organizations' },
        ])
      } else if (field.includes('defence') || field.includes('nda') || field.includes('army') || field.includes('navy') || field.includes('air force')) {
        setResults([
          { career: 'Army Officer', match: 92, salary: '₹56K-2L/month', growth: 'High', skills: ['Leadership', 'Physical Fitness', 'Tactical Skills'], reason: 'Serve the nation', path: 'NDA/CDS → Training → Commission' },
          { career: 'Navy Officer', match: 85, salary: '₹56K-2L/month', growth: 'High', skills: ['Navigation', 'Maritime Operations', 'Leadership'], reason: 'Naval service career', path: 'NDA/CDS → Naval Academy → Commission' },
          { career: 'Air Force Officer', match: 80, salary: '₹56K-2.2L/month', growth: 'High', skills: ['Aviation', 'Technical Skills', 'Leadership'], reason: 'Aviation & defense', path: 'NDA/CDS/AFCAT → Training → Commission' },
        ])
      } else if (field.includes('fine arts') || field.includes('bfa') || field.includes('painting') || field.includes('sculpture')) {
        setResults([
          { career: 'Artist', match: 90, salary: '₹3-20 LPA', growth: 'Medium', skills: ['Painting', 'Sculpture', 'Creativity'], reason: 'Creative expression career', path: 'BFA → Exhibitions → Gallery representation' },
          { career: 'Art Director', match: 78, salary: '₹6-25 LPA', growth: 'High', skills: ['Visual Direction', 'Team Leadership', 'Concept Development'], reason: 'Lead creative projects', path: 'Fine arts → Agency/Film industry' },
          { career: 'Art Teacher', match: 70, salary: '₹4-12 LPA', growth: 'Medium', skills: ['Teaching', 'Art History', 'Techniques'], reason: 'Teach art to students', path: 'BFA → B.Ed → School/College' },
        ])
      } else if (field.includes('paramedical') || field.includes('physiotherapy') || field.includes('radiology')) {
        setResults([
          { career: 'Physiotherapist', match: 88, salary: '₹4-15 LPA', growth: 'High', skills: ['Rehabilitation', 'Anatomy', 'Patient Care'], reason: 'Healthcare rehabilitation', path: 'BPT → License → Hospital/Clinic' },
          { career: 'Radiologist Technician', match: 78, salary: '₹3-10 LPA', growth: 'Medium', skills: ['Radiology', 'Medical Imaging', 'Equipment Operation'], reason: 'Medical imaging career', path: 'B.Sc Radiology → Hospital job' },
          { career: 'Lab Technician', match: 70, salary: '₹3-8 LPA', growth: 'Medium', skills: ['Lab Testing', 'Medical Equipment', 'Analysis'], reason: 'Medical laboratory work', path: 'BMLT → Hospital/Diagnostic center' },
        ])
      } else if (field.includes('diploma') || field.includes('iti') || field.includes('vocational')) {
        setResults([
          { career: 'Electrician', match: 85, salary: '₹3-10 LPA', growth: 'Medium', skills: ['Electrical Work', 'Wiring', 'Safety'], reason: 'Essential technical skill', path: 'ITI Electrician → Apprenticeship → Job/Business' },
          { career: 'Mechanical Technician', match: 78, salary: '₹3-12 LPA', growth: 'Medium', skills: ['Machine Operation', 'Maintenance', 'Repair'], reason: 'Hands-on technical work', path: 'ITI/Diploma → Industry job' },
          { career: 'Supervisor', match: 70, salary: '₹4-15 LPA', growth: 'High', skills: ['Team Management', 'Technical Knowledge', 'Quality Control'], reason: 'Lead technical teams', path: 'Diploma → Experience → Supervisor role' },
        ])
      } else {
        // Default engineering/tech fallback
        setResults([
          { career: 'Software Engineer', match: 88, salary: '₹8-25 LPA', growth: 'Very High', skills: ['React', 'Node.js', 'DSA'], reason: 'Strong problem-solving & building instinct', path: 'Learn coding → Build projects → Apply to companies' },
          { career: 'Product Manager', match: 74, salary: '₹12-35 LPA', growth: 'High', skills: ['Strategy', 'Analytics', 'Agile'], reason: 'Leadership + analytical balance', path: 'Tech/Business degree → Product role → PM' },
          { career: 'Data Scientist', match: 61, salary: '₹10-30 LPA', growth: 'High', skills: ['Python', 'ML', 'SQL'], reason: 'Research & analytical mindset', path: 'Learn Python/ML → Projects → Data roles' },
        ])
      }
    } finally {
      if (procTimer.current) clearInterval(procTimer.current)
      setState('results')
    }
  }

  const handleSelect = (option: string) => setSelected(option)

  const handleNext = async () => {
    if (!selected || !questions.length) return
    const key = `q${questions[currentQ].id}`
    const newAnswers = { ...answers, [key]: selected }
    setAnswers(newAnswers)
    setSelected(null)
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1)
    } else {
      await startProcessing(newAnswers)
    }
  }

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(q => q - 1)
      const prevKey = `q${questions[currentQ - 1].id}`
      setSelected(answers[prevKey] || null)
    }
  }

  const retake = () => {
    console.log('🔄 Retaking assessment, clearing old results') // DEBUG
    setState('landing')
    setCurrentQ(0)
    setAnswers({})
    setSelected(null)
    setResults([])
    setPrevResults(null)
  }

  // Enter key to proceed
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selected && state === 'questions') handleNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, state, currentQ, answers])

  const totalQ = questions.length || 10
  const pct = Math.round(((currentQ + 1) / totalQ) * 100)
  const fieldLabel = getFieldLabel(fieldStudy)

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
          <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 24, fontWeight: 900, marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Career DNA Locked</h2>
          <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#475569', fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
            You need to <strong>Complete your Profile</strong> (at least 80%) before we can analyze your Career DNA. We need to know your background to provide accurate insights.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to="/profile" style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}>
              Complete Profile <ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <AnimatePresence mode="wait">

        {/* ══════════════════════════════════════════════════════════════════
            STATE 1 — LANDING
        ══════════════════════════════════════════════════════════════════ */}
        {state === 'landing' && (
          <motion.div key="landing"
            style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>

            {/* Blobs */}
            <motion.div animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }} transition={{ duration: 12, repeat: Infinity }}
              style={{ position: 'absolute', top: '-80px', left: '-80px', width: 400, height: 400, background: 'radial-gradient(circle, rgba(167,139,250,0.18), transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
            <motion.div animate={{ x: [20, -20, 20], y: [10, -10, 10] }} transition={{ duration: 16, repeat: Infinity }}
              style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: 350, height: 350, background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />

            <div style={{ maxWidth: 680, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>

              {/* Brain icon with glow — stacked vertically above badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ position: 'absolute', inset: -10, borderRadius: '50%', background: 'rgba(124,58,237,0.25)', filter: 'blur(10px)' }} />
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}>
                    <Brain className={`w-10 h-10 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} />
                  </motion.div>
                </div>

                {/* Badge below brain icon */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'white', backdropFilter: 'blur(8px)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)', borderRadius: 999, padding: '5px 14px' }}>
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(15,23,42,0.9)', fontSize: 13, fontWeight: 500 }}>AI-Powered · 2 Minutes · Free</span>
                </div>
              </div>

              <h1 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.1 }}>
                Discover Your Career DNA
              </h1>
              <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,1)' : '#7c3aed', fontSize: 18, margin: '0 0 36px', lineHeight: 1.6 }}>
                Answer 10 questions. Our AI maps your unique personality<br className="hidden md:block" /> to career paths built for you.
                {fieldStudy && <><br /><span style={{ fontSize: 14, opacity: 0.7 }}>Questions tailored for: {fieldLabel}</span></>}
              </p>

              {/* Benefit cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 36 }} className="grid-cols-1 sm:grid-cols-3">
                {[
                  { Icon: Target, title: 'Career Matches', desc: 'Top 3 paths personalized to you', iconColor: '#a78bfa', bg: 'rgba(124,58,237,0.2)' },
                  { Icon: Brain, title: 'Personality Type', desc: 'Understand your work style', iconColor: '#c084fc', bg: 'rgba(168,85,247,0.2)' },
                  { Icon: TrendingUp, title: 'Salary Insights', desc: 'Real Indian market data', iconColor: '#34d399', bg: 'rgba(16,185,129,0.2)' },
                ].map(({ Icon, title, desc, iconColor, bg }, i) => (
                  <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                    style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'white', backdropFilter: 'blur(12px)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: '16px 12px', textAlign: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <Icon style={{ width: 20, height: 20, color: iconColor }} />
                    </div>
                    <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</p>
                    <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#7c3aed', fontSize: 12 }}>{desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setState('questions')}
                style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 14, padding: '16px 40px', fontSize: 18, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}>
                Start My Assessment <ArrowRight className="w-5 h-5" />
              </motion.button>

              <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,1)' : '#475569', fontSize: 13 }}>
                ✓ Free &nbsp;·&nbsp; ✓ Takes 2 min &nbsp;·&nbsp; ✓ 10,000+ students taken
              </p>

              {/* Previous results strip */}
              {prevResults && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  style={{ marginTop: 24, background: theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'white', backdropFilter: 'blur(12px)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <span style={{ color: theme === 'dark' ? 'rgba(196,181,253,1)' : '#7c3aed', fontSize: 14 }}>📊 You have previous results</span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setState('results')} style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>View Results</button>
                    <button onClick={() => setState('questions')} style={{ background: 'transparent', color: theme === 'dark' ? 'rgba(196,181,253,1)' : '#7c3aed', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>Retake</button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            STATE 2 — QUESTIONS
        ══════════════════════════════════════════════════════════════════ */}
        {state === 'questions' && (
          <motion.div key="questions"
            style={{ minHeight: '100vh', padding: '0', display: 'flex', flexDirection: 'column' }}>

            {/* Top bar */}
            <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: theme === 'dark' ? 'rgba(196,181,253,1)' : '#7c3aed', fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>
                Question {currentQ + 1} of {totalQ}
              </span>
              <div style={{ flex: 1, height: 6, background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: 999, overflow: 'hidden' }}>
                <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }}
                  style={{ height: '100%', borderRadius: 999 }} />
              </div>
              <span style={{ color: theme === 'dark' ? 'rgba(196,181,253,1)' : '#7c3aed', fontSize: 13 }}>{pct}%</span>
              <button onClick={() => setExitModal(true)}
                style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'white', border: 'none', borderRadius: 8, padding: '6px 12px', color: theme === 'dark' ? 'rgba(196,181,253,1)' : '#7c3aed', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                <X className="w-4 h-4" /> Exit
              </button>
            </div>

            {/* Question area */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 16px 24px' }}>
              <div style={{ maxWidth: 640, width: '100%' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={currentQ}
                    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}>

                    <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.5)', borderRadius: 999, padding: '3px 12px', marginBottom: 16 }}>
                      <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 700 }}>Q{currentQ + 1} · {fieldLabel}</span>
                    </div>

                    <h2 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 700, marginBottom: 24, lineHeight: 1.3, textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
                      {questions[currentQ]?.question}
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
                      {(questions[currentQ]?.options || []).map((opt, i) => {
                        const isSelected = selected === opt.title
                        const isLast = i === (questions[currentQ]?.options.length ?? 0) - 1
                        const isOdd = (questions[currentQ]?.options.length ?? 0) % 2 !== 0
                        return (
                          <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            onClick={() => handleSelect(opt.title)}
                            style={{
                              background: isSelected ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'rgba(255,255,255,0.05)',
                              border: isSelected ? '2px solid #7c3aed' : '2px solid rgba(255,255,255,0.1)',
                              borderRadius: 14, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                              boxShadow: isSelected ? '0 0 20px rgba(124,58,237,0.4)' : 'none',
                              position: 'relative', transition: 'all 0.2s',
                              gridColumn: (isLast && isOdd) ? '1 / -1' : undefined,
                              maxWidth: (isLast && isOdd) ? '50%' : undefined,
                              margin: (isLast && isOdd) ? '0 auto' : undefined,
                              width: (isLast && isOdd) ? '100%' : undefined,
                            }}>
                            {isSelected && (
                              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                                <CheckCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} />
                              </div>
                            )}
                            <div style={{ fontSize: 22, marginBottom: 6 }}>{opt.icon}</div>
                            <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{opt.title}</p>
                            <p style={{ color: isSelected ? 'rgba(221,214,254,0.9)' : 'rgba(148,163,184,1)', fontSize: 12 }}>{opt.subtitle}</p>
                          </motion.button>
                        )
                      })}
                    </div>

                    {/* Nav buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        {currentQ > 0 ? (
                          <button onClick={handlePrev}
                            style={{ background: 'transparent', border: 'none', color: theme === 'dark' ? 'rgba(148,163,184,1)' : '#475569', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
                            ← Previous
                          </button>
                        ) : <div />}
                        <div />
                      </div>

                      <AnimatePresence>
                        {selected && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '100%' }}>
                            <motion.button onClick={handleNext}
                              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                              style={{ background: '#7c3aed', color: 'white', border: 'none', borderRadius: 12, padding: '14px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, width: '100%', maxWidth: 320, justifyContent: 'center', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>
                              {currentQ === totalQ - 1 ? 'See My Results' : 'Next'} <ArrowRight className="w-4 h-4" />
                            </motion.button>
                            <p style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.35)' : 'rgba(15,23,42,0.5)', fontSize: 12 }}>Press Enter ↵ to continue</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Exit modal */}
            <AnimatePresence>
              {exitModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}>
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                    style={{ background: theme === 'dark' ? '#1e1b4b' : 'white', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 20, padding: 32, maxWidth: 360, width: '100%', textAlign: 'center' }}>
                    <p style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Exit assessment?</p>
                    <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,1)' : '#475569', fontSize: 14, marginBottom: 24 }}>Your progress will be lost.</p>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => setExitModal(false)}
                        style={{ flex: 1, background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'white', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '10px', color: theme === 'dark' ? 'white' : '#0f172a', cursor: 'pointer', fontWeight: 600 }}>
                        Keep Going
                      </button>
                      <button onClick={() => { setExitModal(false); setState('landing') }}
                        style={{ flex: 1, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '10px', color: theme === 'dark' ? '#fca5a5' : '#ef4444', cursor: 'pointer', fontWeight: 600 }}>
                        Exit
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            STATE 3 — PROCESSING
        ══════════════════════════════════════════════════════════════════ */}
        {state === 'processing' && (
          <motion.div key="processing"
            style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ textAlign: 'center', maxWidth: 400 }}>
              {/* Spinning brain */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#7c3aed', borderRightColor: '#a78bfa', position: 'absolute', inset: -8 }} />
                <div style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain className={`w-10 h-10 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} />
                </div>
              </div>

              {/* Messages */}
              <div style={{ minHeight: 32, marginBottom: 32 }}>
                <AnimatePresence mode="wait">
                  <motion.p key={procMsg}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    style={{ color: procMsg === 3 ? '#4ade80' : (theme === 'dark' ? 'white' : '#0f172a'), fontSize: 20, fontWeight: 600 }}>
                    {PROCESSING_MSGS[procMsg]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: 6, background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'white', borderRadius: 999, overflow: 'hidden' }}>
                <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3.2, ease: 'easeInOut' }}
                  style={{ height: '100%', borderRadius: 999 }} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            STATE 4 — RESULTS
        ══════════════════════════════════════════════════════════════════ */}
        {state === 'results' && results.length > 0 && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* Section A — Personality Hero */}
            {(() => {
              // Dynamically derive personality from top career
              const topCareer = results[0]?.career || ''
              const topSkills = results[0]?.skills || []
              const allCareers = results.map((r: any) => (r.career || '').toLowerCase()).join(' ')
              const matchScore = results[0]?.match || 80
              const personality = getPersonalityType(topCareer, allCareers, matchScore)
              const traits = topSkills.slice(0, 4).length > 0 ? topSkills.slice(0, 4) : ['Analytical', 'Focused', 'Driven', 'Adaptable']

              return (
            <div style={{ background: theme === 'dark' ? 'rgba(30, 27, 75, 0.4)' : 'rgba(124, 58, 237, 0.05)', backdropFilter: 'blur(16px)', padding: '48px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <motion.div animate={{ x: [-20, 20, -20] }} transition={{ duration: 10, repeat: Infinity }}
                style={{ position: 'absolute', top: '-60px', left: '-60px', width: 300, height: 300, background: 'radial-gradient(circle, rgba(167,139,250,0.2), transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'white', backdropFilter: 'blur(8px)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)', borderRadius: 999, padding: '6px 16px', marginBottom: 20 }}>
                  <span style={{ fontSize: 16 }}>✨</span>
                  <span style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontWeight: 600, fontSize: 14 }}>Your Career DNA is ready</span>
                </motion.div>
                <h1 style={{ color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 12 }}>
                  You are {personality.type}
                </h1>
                <p style={{ color: theme === 'dark' ? 'rgba(196,181,253,1)' : '#7c3aed', fontSize: 16, lineHeight: 1.7, marginBottom: 20 }}>
                  {personality.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                  {traits.map((t: string) => (
                    <span key={t} style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'white', backdropFilter: 'blur(8px)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)', borderRadius: 999, padding: '5px 14px', color: theme === 'dark' ? 'white' : '#0f172a', fontSize: 13, fontWeight: 500 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
              )
            })()}

            {/* Section B — Career Matches */}
            <div style={{ padding: '48px 24px' }}>
              <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: theme === 'dark' ? 'white' : '#0f172a', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Career Matches</h2>
                  <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 15, marginBottom: 28 }}>Ranked by compatibility with your personality</p>
                </motion.div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {results.slice(0, 3).map((career: any, i: number) => {
                    const title = career.career || career.title || 'Career Path'
                    const matchVal = career.match || 80
                    const isTop = i === 0
                    return (
                      <motion.div key={i} custom={i + 1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        style={{
                          background: isTop ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.04)',
                          borderRadius: 20, padding: isTop ? '28px' : '22px',
                          border: isTop ? `2px solid ${RANK_COLORS[0]}50` : '1px solid rgba(255,255,255,0.08)',
                          boxShadow: isTop ? `0 8px 32px rgba(245,158,11,0.12)` : 'none',
                        }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                          <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: i === 0 ? 'rgba(245,158,11,0.15)' : i === 1 ? 'rgba(148,163,184,0.1)' : 'rgba(205,127,50,0.1)', borderRadius: 999, padding: '3px 10px', marginBottom: 8 }}>
                              <span style={{ color: RANK_COLORS[i], fontSize: 12, fontWeight: 700 }}>{RANK_LABELS[i]}</span>
                            </div>
                            <h3 style={{ fontSize: isTop ? 24 : 20, fontWeight: 800, color: theme === 'dark' ? 'white' : '#0f172a', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: isTop ? 36 : 28, fontWeight: 800, color: '#7c3aed' }}>{matchVal}%</div>
                            <div style={{ fontSize: 12, color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>match</div>
                          </div>
                        </div>

                        {/* Match bar */}
                        <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden', marginBottom: 16 }}>
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${matchVal}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}
                            style={{ height: '100%', borderRadius: 999 }} />
                        </div>

                        {/* Details grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                          {[
                            { icon: '💰', label: 'Avg Salary', val: career.salary || '₹8-25 LPA' },
                            { icon: '📈', label: 'Growth', val: career.growth || 'High' },
                            { icon: '⏱️', label: 'Timeline', val: '2-3 years' },
                          ].map((d, di) => (
                            <div key={di} style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: 10, padding: '10px 12px' }}>
                              <div style={{ fontSize: 16, marginBottom: 4 }}>{d.icon}</div>
                              <div style={{ fontSize: 11, color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', marginBottom: 2 }}>{d.label}</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: theme === 'dark' ? 'white' : '#0f172a' }}>{d.val}</div>
                            </div>
                          ))}
                        </div>

                        {career.reason && <p style={{ color: theme === 'dark' ? 'rgba(148,163,184,0.65)' : '#64748b', fontSize: 14, fontStyle: 'italic', marginBottom: 16 }}>"{career.reason}"</p>}

                        {/* Skills */}
                        {career.skills?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                            {career.skills.map((s: string) => (
                              <span key={s} style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', fontSize: 12, padding: '3px 10px', borderRadius: 999, fontWeight: 500 }}>{s}</span>
                            ))}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <Link to={`/jobs?q=${encodeURIComponent(title)}`}
                            style={{ flex: 1, minWidth: 140, color: theme === 'dark' ? 'white' : '#0f172a', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <Briefcase className="w-4 h-4" /> Browse Jobs
                          </Link>
                          <Link to={`/skill-gap?role=${encodeURIComponent(title)}`}
                            style={{ flex: 1, minWidth: 140, background: 'rgba(124,58,237,0.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <Target className="w-4 h-4" /> Analyze Skills
                          </Link>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Section C — Strengths */}
            <div style={{ padding: '40px 24px', borderTop: '1px solid rgba(124,58,237,0.15)' }}>
              <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: theme === 'dark' ? 'white' : '#0f172a', marginBottom: 20, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Core Strengths</h2>
                </motion.div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="grid-cols-1 sm:grid-cols-3">
                  {[
                    { icon: '💡', title: 'Strategic Thinking', desc: 'You see the big picture and plan ahead' },
                    { icon: '🤝', title: 'Team Leadership', desc: 'You inspire and coordinate people effectively' },
                    { icon: '📊', title: 'Data-Driven Decisions', desc: 'You rely on evidence, not just intuition' },
                  ].map((s, i) => (
                    <motion.div key={i} custom={i + 1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                      style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: '20px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
                      <p style={{ fontWeight: 700, color: theme === 'dark' ? 'white' : '#0f172a', marginBottom: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.title}</p>
                      <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 13 }}>{s.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section D — Work Style */}
            <div style={{ padding: '40px 24px', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
              <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: theme === 'dark' ? 'white' : '#0f172a', marginBottom: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>How You Work Best</h2>
                  <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>
                    You perform best in structured yet dynamic environments. You prefer having clear goals but the freedom to choose how to achieve them. Collaboration energizes you, but you also need focused solo time to do deep work.
                  </p>
                </motion.div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid-cols-1 sm:grid-cols-2">
                  {[
                    { label: 'Work Style', left: 'Solo', right: 'Team', val: 65 },
                    { label: 'Structure', left: 'Structured', right: 'Flexible', val: 45 },
                  ].map((m, i) => (
                    <div key={i} style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.04)', borderRadius: 14, padding: '16px 20px' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: theme === 'dark' ? 'rgba(196,181,253,0.8)' : '#7c3aed', marginBottom: 10 }}>{m.label}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', whiteSpace: 'nowrap' }}>{m.left}</span>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, position: 'relative' }}>
                          <div style={{ position: 'absolute', left: `${m.val}%`, top: '50%', transform: 'translate(-50%, -50%)', width: 14, height: 14, borderRadius: '50%', background: '#7c3aed', border: '2px solid #1a1040', boxShadow: '0 0 0 2px #7c3aed' }} />
                        </div>
                        <span style={{ fontSize: 12, color: theme === 'dark' ? 'rgba(148,163,184,0.6)' : '#64748b', whiteSpace: 'nowrap' }}>{m.right}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section E — Next Step */}
            <div style={{ padding: '40px 24px', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
              <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '28px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Zap className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    <span style={{ fontWeight: 700, color: '#fbbf24', fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Immediate Next Step</span>
                  </div>
                  <p style={{ color: 'rgba(251,191,36,0.8)', fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
                    Start with a <strong style={{ color: '#fbbf24' }}>{results[0]?.career || 'Product Analyst'}</strong> role to build domain knowledge. This gives you the data skills and business exposure needed to move into senior positions within 2-3 years.
                  </p>
                  <Link to={`/jobs?q=${encodeURIComponent(results[0]?.career || '')}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: theme === 'dark' ? 'white' : '#0f172a', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}>
                    Find Matching Jobs <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Section F — Actions */}
            <div style={{ padding: '40px 24px', borderTop: '1px solid rgba(124,58,237,0.1)', textAlign: 'center' }}>
              <div style={{ maxWidth: 500, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
                  <CheckCircle className="w-4 h-4" style={{ color: '#34d399' }} />
                  <span style={{ color: 'rgba(148,163,184,0.7)', fontSize: 14 }}>Results saved to your profile</span>
                </div>
                <p style={{ color: 'rgba(148,163,184,0.45)', fontSize: 13, marginBottom: 20 }}>
                  Not satisfied with results? You can retake the assessment anytime
                </p>
                <motion.button onClick={retake} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ background: '#7c3aed', border: 'none', borderRadius: 14, padding: '14px 32px', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
                  <RotateCcw className="w-4 h-4" />
                  Retake Assessment
                </motion.button>
                <p style={{ color: 'rgba(148,163,184,0.35)', fontSize: 11, marginTop: 12 }}>
                  Your current field: {fieldLabel || 'Not set'}
                </p>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

export default CareerDNA
