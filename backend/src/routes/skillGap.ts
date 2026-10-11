import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '../utils/db'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = express.Router()

router.post('/analyze', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { target_role, current_skills, stream } = req.body
    if (!target_role) return res.status(400).json({ message: 'Target role is required' })

    let gaps: any[]

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const prompt = `You are a career advisor for Indian students. Analyze skill gap for this person.

Target Role: ${target_role}
Student Background/Stream: ${stream || 'Not specified'}
Current Skills: ${current_skills || 'None mentioned'}

CRITICAL RULES:
1. Skills MUST be specific to "${target_role}" — not generic
2. For tech roles (Software Engineer, Data Analyst, DevOps etc.) → suggest programming languages, frameworks, tools
3. For medical roles (Doctor, Pharmacist etc.) → suggest clinical skills, medical knowledge, certifications
4. For law roles (Advocate, Corporate Lawyer etc.) → suggest legal research, drafting, specific laws
5. For commerce roles (CA, Financial Analyst etc.) → suggest accounting software, financial modeling, certifications
6. For design roles (UI/UX, Graphic Designer etc.) → suggest design tools, principles, portfolio skills
7. For mechanical/civil/electrical engineering → suggest CAD tools, domain-specific software, certifications
8. Resources should be free/affordable (YouTube, NPTEL, Coursera free tier, official docs)
9. Include REAL URLs that actually work

Return ONLY valid JSON array (no markdown, no explanation):
[
  {
    "skill": "Specific Skill Name",
    "priority": "critical",
    "currentLevel": "beginner",
    "targetLevel": "advanced",
    "estimatedHours": 40,
    "resources": [
      { "title": "Resource Name", "type": "video", "url": "https://...", "free": true }
    ]
  }
]

Priority: critical, important, or nice-to-have
Types: video, course, article, documentation, book
Return 5-6 skills. Make them HIGHLY SPECIFIC to ${target_role}.`

      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      gaps = jsonMatch ? JSON.parse(jsonMatch[0]) : getFallbackGaps(target_role)
    } catch (aiError) {
      console.error('Gemini error, using fallback:', aiError)
      gaps = getFallbackGaps(target_role)
    }

    // Save result
    await supabase.from('career_assessments').insert({
      user_id: req.userId,
      assessment_type: 'skill_gap',
      results: { target_role, gaps },
      completed_date: new Date().toISOString(),
    })

    res.json({ target_role, gaps })
  } catch (error) {
    console.error('Skill gap error:', error)
    res.status(500).json({ message: 'Skill gap analysis failed' })
  }
})

// Get last skill gap result
router.get('/last', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { data } = await supabase
      .from('career_assessments')
      .select('results, completed_date')
      .eq('user_id', req.userId)
      .eq('assessment_type', 'skill_gap')
      .order('completed_date', { ascending: false })
      .limit(1)
      .single()

    if (!data) return res.json(null)
    res.json(data.results)
  } catch {
    res.json(null)
  }
})

// Mark a skill as completed
router.post('/complete-skill', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { skill_name } = req.body
    if (!skill_name) return res.status(400).json({ message: 'skill_name required' })

    // Get existing completed skills from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('completed_skills')
      .eq('user_id', req.userId)
      .single()

    const existing: string[] = profile?.completed_skills || []
    const updated = existing.includes(skill_name)
      ? existing.filter((s: string) => s !== skill_name) // toggle off
      : [...existing, skill_name] // toggle on

    await supabase.from('profiles').update({ completed_skills: updated }).eq('user_id', req.userId)
    res.json({ completed_skills: updated })
  } catch (error) {
    console.error('Complete skill error:', error)
    res.status(500).json({ message: 'Failed to update skill' })
  }
})

// Get completed skills
router.get('/completed-skills', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('completed_skills')
      .eq('user_id', req.userId)
      .single()
    res.json({ completed_skills: data?.completed_skills || [] })
  } catch {
    res.json({ completed_skills: [] })
  }
})

// Generate Evaluation Test
router.post('/generate-test', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { target_role } = req.body
    if (!target_role) return res.status(400).json({ message: 'Target role is required' })

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a technical interviewer and career evaluator. Create a 10-question multiple-choice test to evaluate a candidate's readiness for the role of "${target_role}".

CRITICAL RULES:
1. The questions should test practical, real-world knowledge required for this specific role.
2. Provide exactly 4 options for each question (A, B, C, D).
3. Return ONLY a valid JSON array of objects. No markdown formatting, no explanations, just the JSON array.
4. Format:
[
  {
    "question": "Question text here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "Option 2"
  }
]

Make the questions challenging but fair. The options should be distinct. The correctAnswer must match exactly one of the strings in the options array.`

    let questions: any[]

    try {
      const result = await model.generateContent(prompt)
      const text = result.response.text().trim()
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (aiError) {
      console.error('Gemini error generating test:', aiError)
      // Fallback questions if AI fails
      questions = [
        {
          question: `What is a core fundamental skill required for a ${target_role}?`,
          options: ["Understanding the domain basics", "Ignoring best practices", "Using outdated tools", "None of the above"],
          correctAnswer: "Understanding the domain basics"
        },
        {
          question: `Which of the following is most important for career growth as a ${target_role}?`,
          options: ["Continuous learning", "Avoiding new technologies", "Working in isolation", "Sticking only to known concepts"],
          correctAnswer: "Continuous learning"
        },
        {
          question: `How should a ${target_role} handle a complex problem?`,
          options: ["Break it down into smaller, manageable parts", "Give up immediately", "Guess the solution without analysis", "Delegate it to someone else without trying"],
          correctAnswer: "Break it down into smaller, manageable parts"
        },
        {
          question: `Which communication skill is essential for a ${target_role}?`,
          options: ["Active listening and clear articulation", "Using excessive jargon", "Refusing to document work", "Interrupting colleagues"],
          correctAnswer: "Active listening and clear articulation"
        },
        {
          question: `When facing a tight deadline, what is the best approach for a ${target_role}?`,
          options: ["Prioritize critical tasks and communicate with stakeholders", "Rush and compromise quality entirely", "Ignore the deadline", "Hide the progress"],
          correctAnswer: "Prioritize critical tasks and communicate with stakeholders"
        },
        {
          question: `Which of these traits is crucial for problem-solving in this role?`,
          options: ["Critical thinking", "Jumping to conclusions", "Avoiding feedback", "Blaming others"],
          correctAnswer: "Critical thinking"
        },
        {
          question: `How important is teamwork for a ${target_role}?`,
          options: ["Very important, collaboration brings better results", "Not at all important", "Only important for managers", "Somewhat important, but mostly solo work"],
          correctAnswer: "Very important, collaboration brings better results"
        },
        {
          question: `What should a ${target_role} do when they make a mistake?`,
          options: ["Acknowledge it, learn from it, and fix it", "Hide it and hope nobody notices", "Blame a colleague", "Quit the project immediately"],
          correctAnswer: "Acknowledge it, learn from it, and fix it"
        },
        {
          question: `How should you stay updated with industry trends as a ${target_role}?`,
          options: ["Read industry blogs, documentation, and take courses", "Stop learning after getting hired", "Only read entertainment news", "Rely entirely on older colleagues"],
          correctAnswer: "Read industry blogs, documentation, and take courses"
        },
        {
          question: `What is the best way to handle constructive criticism?`,
          options: ["Listen, evaluate, and use it to improve", "Take it personally and get angry", "Ignore it completely", "Argue with the person giving feedback"],
          correctAnswer: "Listen, evaluate, and use it to improve"
        }
      ]
    }

    res.json({ questions })
  } catch (error) {
    console.error('Test generation error:', error)
    res.status(500).json({ message: 'Failed to generate evaluation test' })
  }
})

function getFallbackGaps(role: string) {
  const r = role.toLowerCase()

  // ── CSE / Software ──────────────────────────────────────────────────────
  if (r.includes('software engineer') || r.includes('full stack') || r.includes('backend') || r.includes('frontend') || r.includes('web developer')) {
    return [
      { skill: 'Data Structures & Algorithms', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 80,
        resources: [{ title: 'DSA - Striver Sheet', type: 'article', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2', free: true }, { title: 'DSA - Abdul Bari YouTube', type: 'video', url: 'https://www.youtube.com/watch?v=0IAPZzGSbME', free: true }] },
      { skill: 'System Design', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 40,
        resources: [{ title: 'System Design Primer - GitHub', type: 'documentation', url: 'https://github.com/donnemartin/system-design-primer', free: true }] },
      { skill: 'React.js / Node.js', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 60,
        resources: [{ title: 'React Official Docs', type: 'documentation', url: 'https://react.dev', free: true }, { title: 'Node.js Tutorial - Traversy Media', type: 'video', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', free: true }] },
      { skill: 'SQL & Databases', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 25,
        resources: [{ title: 'SQL Tutorial - W3Schools', type: 'article', url: 'https://www.w3schools.com/sql', free: true }] },
      { skill: 'Git & Version Control', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 10,
        resources: [{ title: 'Git Tutorial - Atlassian', type: 'article', url: 'https://www.atlassian.com/git/tutorials', free: true }] },
    ]
  }
  if (r.includes('data analyst') || r.includes('data analysis')) {
    return [
      { skill: 'Python for Data Analysis', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 50,
        resources: [{ title: 'Python - Kaggle Learn', type: 'course', url: 'https://www.kaggle.com/learn/python', free: true }] },
      { skill: 'SQL', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 30,
        resources: [{ title: 'SQL - Mode Analytics', type: 'course', url: 'https://mode.com/sql-tutorial', free: true }] },
      { skill: 'Power BI / Tableau', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 25,
        resources: [{ title: 'Power BI Tutorial - Microsoft', type: 'course', url: 'https://learn.microsoft.com/en-us/power-bi', free: true }] },
      { skill: 'Excel & Statistics', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'Excel for Data Analysis - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=excel+data+analysis', free: true }] },
      { skill: 'Pandas & NumPy', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'Pandas Tutorial - Kaggle', type: 'course', url: 'https://www.kaggle.com/learn/pandas', free: true }] },
    ]
  }
  if (r.includes('ml engineer') || r.includes('machine learning') || r.includes('data scientist') || r.includes('ai engineer')) {
    return [
      { skill: 'Python & ML Libraries', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 60,
        resources: [{ title: 'ML Course - Andrew Ng Coursera', type: 'course', url: 'https://www.coursera.org/learn/machine-learning', free: true }] },
      { skill: 'Deep Learning & Neural Networks', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 50,
        resources: [{ title: 'Deep Learning Specialization', type: 'course', url: 'https://www.coursera.org/specializations/deep-learning', free: true }] },
      { skill: 'Statistics & Mathematics', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 40,
        resources: [{ title: 'Statistics - Khan Academy', type: 'course', url: 'https://www.khanacademy.org/math/statistics-probability', free: true }] },
      { skill: 'TensorFlow / PyTorch', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 35,
        resources: [{ title: 'TensorFlow Official Tutorials', type: 'documentation', url: 'https://www.tensorflow.org/tutorials', free: true }] },
      { skill: 'MLOps & Model Deployment', priority: 'nice-to-have', currentLevel: 'beginner', targetLevel: 'beginner', estimatedHours: 20,
        resources: [{ title: 'MLOps - Made With ML', type: 'article', url: 'https://madewithml.com', free: true }] },
    ]
  }
  if (r.includes('devops') || r.includes('cloud engineer') || r.includes('sre')) {
    return [
      { skill: 'Docker & Kubernetes', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 40,
        resources: [{ title: 'Docker Tutorial - TechWorld with Nana', type: 'video', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE', free: true }] },
      { skill: 'AWS / Azure / GCP', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 50,
        resources: [{ title: 'AWS Free Tier + Training', type: 'course', url: 'https://aws.amazon.com/training/digital', free: true }] },
      { skill: 'CI/CD Pipelines', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 25,
        resources: [{ title: 'GitHub Actions Tutorial', type: 'video', url: 'https://www.youtube.com/results?search_query=github+actions+tutorial', free: true }] },
      { skill: 'Linux & Shell Scripting', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'Linux Command Line - Ryan Chadwick', type: 'article', url: 'https://ryanstutorials.net/linuxtutorial', free: true }] },
      { skill: 'Terraform / Infrastructure as Code', priority: 'important', currentLevel: 'beginner', targetLevel: 'beginner', estimatedHours: 20,
        resources: [{ title: 'Terraform Tutorial', type: 'video', url: 'https://www.youtube.com/results?search_query=terraform+tutorial+beginners', free: true }] },
    ]
  }
  if (r.includes('cybersecurity') || r.includes('security analyst') || r.includes('ethical hacker')) {
    return [
      { skill: 'Network Security Fundamentals', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 40,
        resources: [{ title: 'CompTIA Security+ Study Guide', type: 'article', url: 'https://www.professormesser.com/security-plus/sy0-601/sy0-601-video/sy0-601-comptia-security-plus-course', free: true }] },
      { skill: 'Ethical Hacking & Penetration Testing', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 50,
        resources: [{ title: 'TryHackMe - Free Learning', type: 'course', url: 'https://tryhackme.com', free: true }] },
      { skill: 'Linux & Command Line', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'OverTheWire Wargames', type: 'course', url: 'https://overthewire.org/wargames', free: true }] },
      { skill: 'Python for Security', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 25,
        resources: [{ title: 'Python for Cybersecurity - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=python+cybersecurity', free: true }] },
      { skill: 'OWASP & Web Security', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'OWASP Top 10', type: 'documentation', url: 'https://owasp.org/www-project-top-ten', free: true }] },
    ]
  }
  // ── ECE / Electronics ────────────────────────────────────────────────────
  if (r.includes('embedded') || r.includes('vlsi') || r.includes('iot') || r.includes('electronics engineer')) {
    return [
      { skill: 'C/C++ for Embedded Systems', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 50,
        resources: [{ title: 'Embedded C - NPTEL', type: 'course', url: 'https://nptel.ac.in/courses/108/105/108105102', free: true }] },
      { skill: 'Microcontrollers (Arduino/STM32)', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 40,
        resources: [{ title: 'Arduino Tutorial - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=arduino+tutorial+beginners', free: true }] },
      { skill: 'PCB Design (KiCad/Altium)', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 30,
        resources: [{ title: 'KiCad Tutorial - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=kicad+tutorial', free: true }] },
      { skill: 'RTOS & Linux Kernel', priority: 'important', currentLevel: 'beginner', targetLevel: 'beginner', estimatedHours: 25,
        resources: [{ title: 'FreeRTOS Tutorial', type: 'documentation', url: 'https://www.freertos.org/Documentation/RTOS_book.html', free: true }] },
      { skill: 'Communication Protocols (I2C, SPI, UART)', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'Serial Protocols - SparkFun', type: 'article', url: 'https://learn.sparkfun.com/tutorials/serial-communication', free: true }] },
    ]
  }
  // ── Mechanical Engineering ───────────────────────────────────────────────
  if (r.includes('mechanical engineer') || r.includes('autocad') || r.includes('manufacturing') || r.includes('production engineer')) {
    return [
      { skill: 'AutoCAD / SolidWorks', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 50,
        resources: [{ title: 'AutoCAD Tutorial - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=autocad+tutorial+beginners', free: true }, { title: 'SolidWorks Tutorials - Official', type: 'documentation', url: 'https://www.solidworks.com/sw/resources/solidworks-tutorials.htm', free: true }] },
      { skill: 'Finite Element Analysis (FEA)', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 35,
        resources: [{ title: 'ANSYS Tutorial - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=ansys+tutorial+beginners', free: true }] },
      { skill: 'Manufacturing Processes', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 30,
        resources: [{ title: 'Manufacturing - NPTEL', type: 'course', url: 'https://nptel.ac.in/courses/112/105/112105127', free: true }] },
      { skill: 'GD&T (Geometric Dimensioning)', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'GD&T Tutorial - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=gdt+tutorial', free: true }] },
      { skill: 'CATIA / CREO', priority: 'nice-to-have', currentLevel: 'beginner', targetLevel: 'beginner', estimatedHours: 25,
        resources: [{ title: 'CATIA Tutorial - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=catia+tutorial+beginners', free: true }] },
    ]
  }
  // ── Civil Engineering ────────────────────────────────────────────────────
  if (r.includes('civil engineer') || r.includes('structural engineer') || r.includes('site engineer')) {
    return [
      { skill: 'AutoCAD Civil 3D', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 45,
        resources: [{ title: 'AutoCAD Civil 3D - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=autocad+civil+3d+tutorial', free: true }] },
      { skill: 'STAAD Pro / ETABS', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 40,
        resources: [{ title: 'STAAD Pro Tutorial - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=staad+pro+tutorial', free: true }] },
      { skill: 'Structural Analysis', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 35,
        resources: [{ title: 'Structural Analysis - NPTEL', type: 'course', url: 'https://nptel.ac.in/courses/105/106/105106116', free: true }] },
      { skill: 'IS Codes & Standards', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'BIS Standards - India', type: 'documentation', url: 'https://www.bis.gov.in', free: false }] },
      { skill: 'Project Management (MS Project)', priority: 'important', currentLevel: 'beginner', targetLevel: 'beginner', estimatedHours: 15,
        resources: [{ title: 'MS Project Tutorial - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=ms+project+tutorial', free: true }] },
    ]
  }
  // ── Medical ──────────────────────────────────────────────────────────────
  if (r.includes('doctor') || r.includes('physician') || r.includes('mbbs') || r.includes('surgeon')) {
    return [
      { skill: 'Clinical Diagnosis & Examination', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 80,
        resources: [{ title: 'Clinical Medicine - NPTEL', type: 'course', url: 'https://nptel.ac.in', free: true }, { title: 'Geeky Medics - Clinical Skills', type: 'video', url: 'https://geekymedics.com', free: true }] },
      { skill: 'Pharmacology', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 50,
        resources: [{ title: 'Pharmacology - Osmosis', type: 'video', url: 'https://www.osmosis.org/learn/Pharmacology', free: true }] },
      { skill: 'Medical Ethics & NMC Guidelines', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 15,
        resources: [{ title: 'NMC Guidelines', type: 'documentation', url: 'https://www.nmc.org.in', free: true }] },
      { skill: 'Patient Communication', priority: 'important', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 20,
        resources: [{ title: 'Doctor-Patient Communication - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=doctor+patient+communication+skills', free: true }] },
      { skill: 'Emergency Medicine & BLS/ACLS', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 30,
        resources: [{ title: 'BLS Training - AHA', type: 'course', url: 'https://cpr.heart.org/en/courses/basic-life-support', free: false }] },
    ]
  }
  if (r.includes('pharmacist') || r.includes('pharmacy')) {
    return [
      { skill: 'Drug Interactions & Pharmacokinetics', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 40,
        resources: [{ title: 'Pharmacology - Osmosis', type: 'video', url: 'https://www.osmosis.org/learn/Pharmacology', free: true }] },
      { skill: 'Clinical Pharmacy Practice', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 35,
        resources: [{ title: 'Clinical Pharmacy - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=clinical+pharmacy+tutorial', free: true }] },
      { skill: 'Drug Regulatory Affairs', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'CDSCO Guidelines', type: 'documentation', url: 'https://cdsco.gov.in', free: true }] },
      { skill: 'Quality Control & GMP', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 25,
        resources: [{ title: 'GMP Guidelines - WHO', type: 'documentation', url: 'https://www.who.int/medicines/areas/quality_safety/quality_assurance/gmp/en', free: true }] },
    ]
  }
  // ── Commerce & Finance ───────────────────────────────────────────────────
  if (r.includes('chartered accountant') || r.includes(' ca ') || r.includes('ca ')) {
    return [
      { skill: 'Accounting Standards (Ind AS)', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 60,
        resources: [{ title: 'ICAI Study Material', type: 'documentation', url: 'https://www.icai.org/post/study-material', free: true }] },
      { skill: 'Taxation (GST & Income Tax)', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 50,
        resources: [{ title: 'GST Portal Learning', type: 'documentation', url: 'https://www.gst.gov.in', free: true }, { title: 'Income Tax - ClearTax', type: 'article', url: 'https://cleartax.in/s/income-tax', free: true }] },
      { skill: 'Auditing & Assurance', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 40,
        resources: [{ title: 'Auditing Standards - ICAI', type: 'documentation', url: 'https://www.icai.org/post/auditing-standards', free: true }] },
      { skill: 'Tally ERP / SAP', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'Tally Tutorial - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=tally+erp+9+tutorial', free: true }] },
      { skill: 'Financial Reporting & Analysis', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 25,
        resources: [{ title: 'Financial Analysis - Investopedia', type: 'article', url: 'https://www.investopedia.com/financial-analysis-4689817', free: true }] },
    ]
  }
  if (r.includes('financial analyst') || r.includes('investment banker') || r.includes('equity analyst')) {
    return [
      { skill: 'Financial Modeling (Excel)', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 50,
        resources: [{ title: 'Financial Modeling - CFI', type: 'course', url: 'https://corporatefinanceinstitute.com/resources/excel/financial-modeling', free: true }] },
      { skill: 'Valuation Methods (DCF, Comps)', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 35,
        resources: [{ title: 'Valuation - Damodaran Online', type: 'course', url: 'https://pages.stern.nyu.edu/~adamodar', free: true }] },
      { skill: 'Bloomberg / Reuters Terminal', priority: 'important', currentLevel: 'beginner', targetLevel: 'beginner', estimatedHours: 15,
        resources: [{ title: 'Bloomberg Market Concepts', type: 'course', url: 'https://www.bloomberg.com/professional/product/bloomberg-market-concepts', free: false }] },
      { skill: 'CFA Level 1 Preparation', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 60,
        resources: [{ title: 'CFA Institute Resources', type: 'documentation', url: 'https://www.cfainstitute.org/en/programs/cfa', free: false }] },
      { skill: 'Python for Finance', priority: 'nice-to-have', currentLevel: 'beginner', targetLevel: 'beginner', estimatedHours: 20,
        resources: [{ title: 'Python for Finance - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=python+for+finance', free: true }] },
    ]
  }
  if (r.includes('business analyst') || r.includes('product manager')) {
    return [
      { skill: 'SQL & Data Analysis', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 30,
        resources: [{ title: 'SQL - Mode Analytics', type: 'course', url: 'https://mode.com/sql-tutorial', free: true }] },
      { skill: 'Business Requirements Documentation', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 25,
        resources: [{ title: 'BA Fundamentals - IIBA', type: 'article', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok', free: false }] },
      { skill: 'Agile & Scrum', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'Scrum Guide - Official', type: 'documentation', url: 'https://scrumguides.org', free: true }] },
      { skill: 'Power BI / Tableau', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 25,
        resources: [{ title: 'Power BI - Microsoft Learn', type: 'course', url: 'https://learn.microsoft.com/en-us/power-bi', free: true }] },
      { skill: 'Stakeholder Management', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 15,
        resources: [{ title: 'Stakeholder Management - Coursera', type: 'course', url: 'https://www.coursera.org/search?query=stakeholder+management', free: true }] },
    ]
  }
  // ── Law ──────────────────────────────────────────────────────────────────
  if (r.includes('lawyer') || r.includes('advocate') || r.includes('legal') || r.includes('corporate lawyer')) {
    return [
      { skill: 'Legal Research (SCC/Manupatra)', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 30,
        resources: [{ title: 'Indian Kanoon - Free Case Law', type: 'article', url: 'https://indiankanoon.org', free: true }, { title: 'SCC Online', type: 'article', url: 'https://www.scconline.com', free: false }] },
      { skill: 'Contract Drafting & Negotiation', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 25,
        resources: [{ title: 'Contract Drafting - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=contract+drafting+india', free: true }] },
      { skill: 'IPC, CrPC & Evidence Act', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 40,
        resources: [{ title: 'Bare Acts - India Code', type: 'documentation', url: 'https://www.indiacode.nic.in', free: true }] },
      { skill: 'Court Procedure & Pleadings', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'Legal Procedure - Legal Service India', type: 'article', url: 'https://www.legalserviceindia.com', free: true }] },
      { skill: 'Corporate Law & Companies Act', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 25,
        resources: [{ title: 'Companies Act 2013 - MCA', type: 'documentation', url: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html', free: true }] },
    ]
  }
  // ── Design ───────────────────────────────────────────────────────────────
  if (r.includes('ui') || r.includes('ux') || r.includes('graphic designer') || r.includes('product designer')) {
    return [
      { skill: 'Figma (UI/UX Design)', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 40,
        resources: [{ title: 'Figma Tutorial - Official', type: 'video', url: 'https://www.youtube.com/c/Figmadesign', free: true }] },
      { skill: 'User Research & Wireframing', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 25,
        resources: [{ title: 'UX Design - Google Course', type: 'course', url: 'https://www.coursera.org/professional-certificates/google-ux-design', free: true }] },
      { skill: 'Adobe Photoshop / Illustrator', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 30,
        resources: [{ title: 'Adobe Tutorials - Official', type: 'video', url: 'https://helpx.adobe.com/in/photoshop/tutorials.html', free: true }] },
      { skill: 'Design Systems & Prototyping', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'Design Systems - Figma', type: 'article', url: 'https://www.figma.com/resources/learn-design/design-systems', free: true }] },
      { skill: 'Portfolio Building', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 15,
        resources: [{ title: 'Behance Portfolio Tips', type: 'article', url: 'https://www.behance.net', free: true }] },
    ]
  }
  // ── Media & Journalism ───────────────────────────────────────────────────
  if (r.includes('journalist') || r.includes('reporter') || r.includes('media') || r.includes('content creator')) {
    return [
      { skill: 'News Writing & Reporting', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 25,
        resources: [{ title: 'Journalism Basics - Coursera', type: 'course', url: 'https://www.coursera.org/search?query=journalism', free: true }] },
      { skill: 'Video Editing (Premiere Pro/DaVinci)', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 30,
        resources: [{ title: 'DaVinci Resolve Tutorial - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=davinci+resolve+tutorial+beginners', free: true }] },
      { skill: 'Social Media Management', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 15,
        resources: [{ title: 'Social Media Marketing - Google', type: 'course', url: 'https://learndigital.withgoogle.com', free: true }] },
      { skill: 'SEO & Digital Content', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'SEO Fundamentals - Moz', type: 'article', url: 'https://moz.com/beginners-guide-to-seo', free: true }] },
      { skill: 'Photography & Photojournalism', priority: 'nice-to-have', currentLevel: 'beginner', targetLevel: 'beginner', estimatedHours: 15,
        resources: [{ title: 'Photography Basics - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=photography+basics+beginners', free: true }] },
    ]
  }
  // ── Education ────────────────────────────────────────────────────────────
  if (r.includes('teacher') || r.includes('professor') || r.includes('educator')) {
    return [
      { skill: 'Pedagogy & Teaching Methods', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 30,
        resources: [{ title: 'Teaching Methods - NPTEL', type: 'course', url: 'https://nptel.ac.in/courses/109/104/109104108', free: true }] },
      { skill: 'Curriculum Design', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'Curriculum Development - Coursera', type: 'course', url: 'https://www.coursera.org/search?query=curriculum+design', free: true }] },
      { skill: 'EdTech Tools (Google Classroom, Zoom)', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 10,
        resources: [{ title: 'Google for Education', type: 'course', url: 'https://edu.google.com/teacher-center', free: true }] },
      { skill: 'Assessment & Evaluation', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 15,
        resources: [{ title: 'Assessment Strategies - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=assessment+strategies+teaching', free: true }] },
    ]
  }
  // ── Civil Services ───────────────────────────────────────────────────────
  if (r.includes('ias') || r.includes('ips') || r.includes('civil service') || r.includes('upsc') || r.includes('government')) {
    return [
      { skill: 'UPSC Prelims Preparation (GS)', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 200,
        resources: [{ title: 'UPSC Syllabus - Official', type: 'documentation', url: 'https://upsc.gov.in/examinations/syllabus', free: true }, { title: 'Vision IAS Free Resources', type: 'article', url: 'https://www.visionias.in', free: true }] },
      { skill: 'Current Affairs & Newspaper Reading', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 100,
        resources: [{ title: 'The Hindu - Daily Reading', type: 'article', url: 'https://www.thehindu.com', free: true }] },
      { skill: 'Essay Writing & Answer Writing', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 50,
        resources: [{ title: 'UPSC Answer Writing - Insights IAS', type: 'article', url: 'https://www.insightsonindia.com', free: true }] },
      { skill: 'Indian Polity & Constitution', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 40,
        resources: [{ title: 'Indian Polity - M. Laxmikanth Summary', type: 'article', url: 'https://www.youtube.com/results?search_query=laxmikanth+polity+summary', free: true }] },
      { skill: 'CSAT (Aptitude & Reasoning)', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 30,
        resources: [{ title: 'CSAT Practice - Unacademy', type: 'course', url: 'https://unacademy.com/goal/upsc-civil-services-examination-ias-preparation/KSCGY', free: true }] },
    ]
  }
  // ── Sports ───────────────────────────────────────────────────────────────
  if (r.includes('sports coach') || r.includes('fitness trainer') || r.includes('sports analyst')) {
    return [
      { skill: 'Sports Science & Physiology', priority: 'critical', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 30,
        resources: [{ title: 'Sports Science - Coursera', type: 'course', url: 'https://www.coursera.org/search?query=sports+science', free: true }] },
      { skill: 'Coaching Methodology & Tactics', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 40,
        resources: [{ title: 'Coaching Certification - SAI', type: 'documentation', url: 'https://sportsauthorityofindia.nic.in', free: false }] },
      { skill: 'Nutrition & Diet Planning', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 20,
        resources: [{ title: 'Sports Nutrition - YouTube', type: 'video', url: 'https://www.youtube.com/results?search_query=sports+nutrition+basics', free: true }] },
      { skill: 'Injury Prevention & First Aid', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 15,
        resources: [{ title: 'First Aid - Red Cross', type: 'course', url: 'https://www.redcross.org/take-a-class/first-aid', free: false }] },
    ]
  }
  // ── Default fallback (generic but better than before) ────────────────────
  return [
    { skill: `Core Technical Skills for ${role}`, priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 40,
      resources: [{ title: `${role} Tutorial - YouTube`, type: 'video', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(role)}+tutorial`, free: true }, { title: `${role} Course - Coursera`, type: 'course', url: `https://www.coursera.org/search?query=${encodeURIComponent(role)}`, free: true }] },
    { skill: 'Communication & Presentation Skills', priority: 'critical', currentLevel: 'beginner', targetLevel: 'advanced', estimatedHours: 20,
      resources: [{ title: 'Public Speaking - Coursera', type: 'course', url: 'https://www.coursera.org/search?query=public+speaking', free: true }] },
    { skill: 'Problem Solving & Critical Thinking', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 15,
      resources: [{ title: 'Critical Thinking - edX', type: 'course', url: 'https://www.edx.org/search?q=critical+thinking', free: true }] },
    { skill: 'MS Office / Google Workspace', priority: 'important', currentLevel: 'beginner', targetLevel: 'intermediate', estimatedHours: 10,
      resources: [{ title: 'Google Workspace Training', type: 'course', url: 'https://workspace.google.com/learning-center', free: true }] },
    { skill: 'Industry Certifications', priority: 'nice-to-have', currentLevel: 'beginner', targetLevel: 'beginner', estimatedHours: 20,
      resources: [{ title: 'NPTEL Courses - Free Certifications', type: 'course', url: 'https://nptel.ac.in', free: true }] },
  ]
}

export default router
