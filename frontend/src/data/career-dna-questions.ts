export interface QuestionOption {
  id: string
  icon: string
  title: string
  subtitle: string
}

export interface DNAQuestion {
  id: number
  question: string
  options: QuestionOption[]
}

// ── Engineering & Technology ──────────────────────────────────────────────────
const ENGINEERING_QUESTIONS: DNAQuestion[] = [
  {
    id: 1, question: 'Which area of CS excites you most?',
    options: [
      { id: 'ai', icon: '🤖', title: 'AI & Machine Learning', subtitle: 'Models, training, predictions' },
      { id: 'web', icon: '🌐', title: 'Web & App Development', subtitle: 'Products people use daily' },
      { id: 'security', icon: '🛡️', title: 'Cybersecurity', subtitle: 'Protecting systems, ethical hacking' },
      { id: 'cloud', icon: '☁️', title: 'Cloud & DevOps', subtitle: 'Infrastructure, scaling, deployment' },
      { id: 'data', icon: '📊', title: 'Data Science', subtitle: 'Patterns and insights from data' },
    ]
  },
  {
    id: 2, question: 'When you face a tough coding problem:',
    options: [
      { id: 'systematic', icon: '📝', title: 'Break it down on paper first', subtitle: 'Plan before coding' },
      { id: 'dive', icon: '⚡', title: 'Jump in and start coding', subtitle: 'Learn by doing' },
      { id: 'discuss', icon: '👥', title: 'Discuss with teammates', subtitle: 'Collaborative approach' },
      { id: 'research', icon: '🔍', title: 'Research similar solutions', subtitle: 'Learn from existing work' },
      { id: 'iterate', icon: '🔄', title: 'Try multiple approaches', subtitle: 'Experiment until it works' },
    ]
  },
  {
    id: 3, question: 'What kind of project excites you most?',
    options: [
      { id: 'product', icon: '📱', title: 'Product used by millions', subtitle: 'Like Zomato or Swiggy' },
      { id: 'research', icon: '🧪', title: 'Research a new algorithm', subtitle: 'Solve unsolved problems' },
      { id: 'enterprise', icon: '🏢', title: 'Optimize enterprise systems', subtitle: 'Large scale, high impact' },
      { id: 'startup', icon: '🚀', title: 'Build your own startup', subtitle: 'Founder mindset' },
      { id: 'consult', icon: '💼', title: 'Tech consulting', subtitle: 'Strategy and advisory' },
    ]
  },
  {
    id: 4, question: 'Your ideal work setup is:',
    options: [
      { id: 'solo', icon: '🧍', title: 'Solo deep work', subtitle: 'Just me and my code' },
      { id: 'small', icon: '👫', title: 'Small tight-knit team', subtitle: '3-5 engineers' },
      { id: 'large', icon: '🏟️', title: 'Large engineering org', subtitle: '100+ engineers' },
      { id: 'opensource', icon: '🌍', title: 'Open source contributor', subtitle: 'Collaborate globally' },
      { id: 'multihats', icon: '🎩', title: 'Startup — wear many hats', subtitle: 'Dev + product + strategy' },
    ]
  },
  {
    id: 5, question: 'What matters most in your career?',
    options: [
      { id: 'salary', icon: '💰', title: 'High CTC', subtitle: 'Maximize earnings' },
      { id: 'impact', icon: '❤️', title: 'Real impact', subtitle: 'Work that matters' },
      { id: 'learning', icon: '📚', title: 'Continuous learning', subtitle: 'Always using new tech' },
      { id: 'recognition', icon: '🏆', title: 'Recognition', subtitle: 'Be known in my field' },
      { id: 'balance', icon: '⚖️', title: 'Work-life balance', subtitle: 'Good work + personal life' },
    ]
  },
  {
    id: 6, question: 'Which tech layer appeals most to you?',
    options: [
      { id: 'frontend', icon: '🎨', title: 'Frontend', subtitle: 'What users see and feel' },
      { id: 'backend', icon: '🖥️', title: 'Backend', subtitle: 'Logic, APIs, databases' },
      { id: 'mobile', icon: '📱', title: 'Mobile', subtitle: 'iOS or Android apps' },
      { id: 'aiml', icon: '🧠', title: 'AI/ML', subtitle: 'Models and algorithms' },
      { id: 'systems', icon: '⚙️', title: 'Systems', subtitle: 'OS, compilers, low-level' },
    ]
  },
  {
    id: 7, question: 'Where do you see yourself working?',
    options: [
      { id: 'startup', icon: '🔥', title: 'Early stage startup', subtitle: 'Equity + high growth' },
      { id: 'faang', icon: '🌐', title: 'FAANG/MNC', subtitle: 'Google, Microsoft, Amazon' },
      { id: 'unicorn', icon: '✨', title: 'Indian unicorn', subtitle: 'Flipkart, Razorpay, CRED' },
      { id: 'research', icon: '🔬', title: 'Research lab / IIT', subtitle: 'Academia and research' },
      { id: 'own', icon: '👑', title: 'My own company', subtitle: 'Full entrepreneur' },
    ]
  },
  {
    id: 8, question: 'How do you learn new technology?',
    options: [
      { id: 'docs', icon: '📄', title: 'Read documentation', subtitle: 'Thorough understanding first' },
      { id: 'videos', icon: '▶️', title: 'Watch tutorials', subtitle: 'Follow along visually' },
      { id: 'build', icon: '🔨', title: 'Build a project', subtitle: 'Figure it out as you go' },
      { id: 'course', icon: '🎓', title: 'Structured course', subtitle: 'Guided learning path' },
      { id: 'break', icon: '🔧', title: 'Break and fix things', subtitle: 'Learn from breaking stuff' },
    ]
  },
  {
    id: 9, question: 'Production bug at 2AM before launch. You:',
    options: [
      { id: 'love', icon: '⚡', title: 'Love it — pressure is my fuel', subtitle: 'Best work under pressure' },
      { id: 'handle', icon: '✅', title: 'Handle it, prefer to avoid', subtitle: 'Can do it, not ideal' },
      { id: 'team', icon: '👥', title: 'Call teammates immediately', subtitle: 'Teamwork is key' },
      { id: 'calm', icon: '🧠', title: 'Stay calm, debug methodically', subtitle: 'Systematic approach' },
      { id: 'stress', icon: '😤', title: 'Get stressed but push through', subtitle: 'Results despite difficulty' },
    ]
  },
  {
    id: 10, question: 'In 5 years, you want to be:',
    options: [
      { id: 'manager', icon: '👥', title: 'Engineering Manager', subtitle: 'Lead and grow teams' },
      { id: 'ic', icon: '💻', title: 'Principal Engineer / Tech Lead', subtitle: 'Deep technical expert' },
      { id: 'cto', icon: '🚀', title: 'CTO of my startup', subtitle: 'Build something big' },
      { id: 'phd', icon: '🎓', title: 'PhD / Researcher', subtitle: 'Push boundaries of CS' },
      { id: 'remote', icon: '🌏', title: 'Remote — global company', subtitle: 'Work from anywhere' },
    ]
  },
]

// ── Medical & Health Sciences ─────────────────────────────────────────────────
const MEDICAL_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which medical area interests you most?', options: [
    { id: 'clinical', icon: '🏥', title: 'Clinical Practice', subtitle: 'Direct patient care' },
    { id: 'research', icon: '🔬', title: 'Medical Research', subtitle: 'Discover new treatments' },
    { id: 'surgery', icon: '🩺', title: 'Surgery', subtitle: 'Hands-on procedures' },
    { id: 'pharma', icon: '💊', title: 'Pharmaceuticals', subtitle: 'Drug development' },
    { id: 'public', icon: '🌍', title: 'Public Health', subtitle: 'Community-level impact' },
  ]},
  { id: 2, question: 'How do you handle high-pressure situations?', options: [
    { id: 'calm', icon: '🧘', title: 'Stay calm, focus on protocol', subtitle: 'Systematic approach' },
    { id: 'team', icon: '👥', title: 'Rely on team coordination', subtitle: 'Collaborative response' },
    { id: 'instinct', icon: '⚡', title: 'Trust my instincts', subtitle: 'Experience-driven' },
    { id: 'analyze', icon: '📊', title: 'Analyze data first', subtitle: 'Evidence-based decisions' },
    { id: 'escalate', icon: '📞', title: 'Escalate to senior', subtitle: 'Know when to ask for help' },
  ]},
  { id: 3, question: 'What motivates you in healthcare?', options: [
    { id: 'save', icon: '❤️', title: 'Saving lives directly', subtitle: 'Immediate patient impact' },
    { id: 'research', icon: '🔭', title: 'Advancing medical science', subtitle: 'Long-term breakthroughs' },
    { id: 'prevent', icon: '🛡️', title: 'Disease prevention', subtitle: 'Proactive healthcare' },
    { id: 'mental', icon: '🧠', title: 'Mental health support', subtitle: 'Psychological wellbeing' },
    { id: 'tech', icon: '💻', title: 'Healthcare technology', subtitle: 'Digital health innovation' },
  ]},
  { id: 4, question: 'Your ideal work environment:', options: [
    { id: 'hospital', icon: '🏥', title: 'Large hospital', subtitle: 'Diverse cases, big team' },
    { id: 'clinic', icon: '🏠', title: 'Private clinic', subtitle: 'Personal patient relationships' },
    { id: 'lab', icon: '🧪', title: 'Research laboratory', subtitle: 'Controlled, scientific' },
    { id: 'field', icon: '🌾', title: 'Rural / field work', subtitle: 'Underserved communities' },
    { id: 'corporate', icon: '🏢', title: 'Pharma / corporate', subtitle: 'Business side of health' },
  ]},
  { id: 5, question: 'Which specialization appeals most?', options: [
    { id: 'cardio', icon: '❤️', title: 'Cardiology', subtitle: 'Heart and vascular' },
    { id: 'neuro', icon: '🧠', title: 'Neurology', subtitle: 'Brain and nervous system' },
    { id: 'pediatric', icon: '👶', title: 'Pediatrics', subtitle: 'Child healthcare' },
    { id: 'ortho', icon: '🦴', title: 'Orthopedics', subtitle: 'Bones and joints' },
    { id: 'psych', icon: '💭', title: 'Psychiatry', subtitle: 'Mental health' },
  ]},
  { id: 6, question: 'How do you prefer to learn medicine?', options: [
    { id: 'cases', icon: '📋', title: 'Case studies', subtitle: 'Real patient scenarios' },
    { id: 'textbook', icon: '📚', title: 'Textbooks & journals', subtitle: 'Deep theoretical base' },
    { id: 'mentor', icon: '👨‍⚕️', title: 'Mentorship / residency', subtitle: 'Learn from seniors' },
    { id: 'simulation', icon: '🎮', title: 'Simulation labs', subtitle: 'Practice without risk' },
    { id: 'research', icon: '🔬', title: 'Research papers', subtitle: 'Latest evidence' },
  ]},
  { id: 7, question: 'Where do you see yourself in 5 years?', options: [
    { id: 'specialist', icon: '🏆', title: 'Specialist doctor', subtitle: 'Expert in one field' },
    { id: 'researcher', icon: '🔬', title: 'Medical researcher', subtitle: 'Published, respected' },
    { id: 'hospital_head', icon: '🏥', title: 'Hospital administrator', subtitle: 'Lead a department' },
    { id: 'startup', icon: '🚀', title: 'Health-tech startup', subtitle: 'Innovate in healthcare' },
    { id: 'ngo', icon: '🌍', title: 'NGO / global health', subtitle: 'WHO, MSF, etc.' },
  ]},
  { id: 8, question: 'Patient communication style:', options: [
    { id: 'empathetic', icon: '💛', title: 'Highly empathetic', subtitle: 'Emotional connection first' },
    { id: 'direct', icon: '📋', title: 'Direct and factual', subtitle: 'Clear, no sugarcoating' },
    { id: 'educational', icon: '📖', title: 'Educational approach', subtitle: 'Explain everything' },
    { id: 'collaborative', icon: '🤝', title: 'Collaborative decisions', subtitle: 'Patient is a partner' },
    { id: 'efficient', icon: '⚡', title: 'Efficient and quick', subtitle: 'Respect their time' },
  ]},
  { id: 9, question: 'What role does technology play in your practice?', options: [
    { id: 'essential', icon: '💻', title: 'Essential — I embrace it', subtitle: 'AI diagnostics, telemedicine' },
    { id: 'tool', icon: '🔧', title: 'Useful tool, not everything', subtitle: 'Balanced approach' },
    { id: 'skeptical', icon: '🤔', title: 'Skeptical but open', subtitle: 'Evidence needed first' },
    { id: 'build', icon: '🏗️', title: 'I want to build health-tech', subtitle: 'Developer + doctor' },
    { id: 'minimal', icon: '🩺', title: 'Minimal — human touch first', subtitle: 'Traditional practice' },
  ]},
  { id: 10, question: 'Your biggest strength as a healthcare professional:', options: [
    { id: 'diagnosis', icon: '🔍', title: 'Diagnostic accuracy', subtitle: 'Spot what others miss' },
    { id: 'empathy', icon: '❤️', title: 'Patient empathy', subtitle: 'Patients trust you' },
    { id: 'research', icon: '📊', title: 'Research mindset', subtitle: 'Evidence-based always' },
    { id: 'leadership', icon: '👑', title: 'Team leadership', subtitle: 'Coordinate care teams' },
    { id: 'innovation', icon: '💡', title: 'Innovation', subtitle: 'New approaches to old problems' },
  ]},
]

// ── Commerce & Business ───────────────────────────────────────────────────────
const COMMERCE_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which business domain excites you most?', options: [
    { id: 'finance', icon: '💹', title: 'Finance & Investment', subtitle: 'Markets, wealth, banking' },
    { id: 'marketing', icon: '📢', title: 'Marketing & Branding', subtitle: 'Build brands, drive growth' },
    { id: 'operations', icon: '⚙️', title: 'Operations & Supply Chain', subtitle: 'Efficiency and logistics' },
    { id: 'hr', icon: '👥', title: 'HR & People Management', subtitle: 'Build great teams' },
    { id: 'strategy', icon: '♟️', title: 'Strategy & Consulting', subtitle: 'Solve business problems' },
  ]},
  { id: 2, question: 'How do you make important decisions?', options: [
    { id: 'data', icon: '📊', title: 'Data and numbers first', subtitle: 'Quantitative analysis' },
    { id: 'instinct', icon: '💡', title: 'Business instinct', subtitle: 'Experience-driven gut feel' },
    { id: 'consult', icon: '🤝', title: 'Consult stakeholders', subtitle: 'Collaborative consensus' },
    { id: 'framework', icon: '📋', title: 'Apply frameworks', subtitle: 'SWOT, Porter\'s, etc.' },
    { id: 'risk', icon: '⚖️', title: 'Risk-reward analysis', subtitle: 'Weigh every option' },
  ]},
  { id: 3, question: 'Your ideal career path:', options: [
    { id: 'ca', icon: '📜', title: 'Chartered Accountant', subtitle: 'Finance and taxation expert' },
    { id: 'mba', icon: '🎓', title: 'MBA → Corporate leadership', subtitle: 'IIM, ISB, global MBA' },
    { id: 'startup', icon: '🚀', title: 'Start my own business', subtitle: 'Entrepreneur from day 1' },
    { id: 'banking', icon: '🏦', title: 'Investment banking', subtitle: 'High finance, M&A' },
    { id: 'consulting', icon: '💼', title: 'Management consulting', subtitle: 'McKinsey, BCG, Deloitte' },
  ]},
  { id: 4, question: 'What kind of problems do you enjoy solving?', options: [
    { id: 'financial', icon: '💰', title: 'Financial optimization', subtitle: 'Cut costs, maximize returns' },
    { id: 'market', icon: '📈', title: 'Market expansion', subtitle: 'New customers, new markets' },
    { id: 'people', icon: '👥', title: 'People and culture', subtitle: 'Team dynamics, retention' },
    { id: 'process', icon: '🔄', title: 'Process improvement', subtitle: 'Efficiency and automation' },
    { id: 'brand', icon: '✨', title: 'Brand building', subtitle: 'Perception and positioning' },
  ]},
  { id: 5, question: 'What motivates you most?', options: [
    { id: 'wealth', icon: '💎', title: 'Building wealth', subtitle: 'Financial independence' },
    { id: 'power', icon: '👑', title: 'Leadership & influence', subtitle: 'Shape decisions at scale' },
    { id: 'impact', icon: '🌍', title: 'Business impact', subtitle: 'Change how industries work' },
    { id: 'security', icon: '🛡️', title: 'Job security', subtitle: 'Stable, respected career' },
    { id: 'network', icon: '🤝', title: 'Building networks', subtitle: 'Relationships are everything' },
  ]},
  { id: 6, question: 'Your working style:', options: [
    { id: 'analytical', icon: '📊', title: 'Analytical and precise', subtitle: 'Numbers don\'t lie' },
    { id: 'creative', icon: '🎨', title: 'Creative and innovative', subtitle: 'Think outside the box' },
    { id: 'people', icon: '💬', title: 'People-oriented', subtitle: 'Relationships drive results' },
    { id: 'strategic', icon: '♟️', title: 'Strategic and big-picture', subtitle: 'Long-term thinking' },
    { id: 'execution', icon: '⚡', title: 'Execution-focused', subtitle: 'Get things done fast' },
  ]},
  { id: 7, question: 'Where do you want to work?', options: [
    { id: 'mnc', icon: '🌐', title: 'MNC / Fortune 500', subtitle: 'Global exposure, big brand' },
    { id: 'startup', icon: '🔥', title: 'High-growth startup', subtitle: 'Fast learning, equity' },
    { id: 'own', icon: '🏢', title: 'My own business', subtitle: 'Full control' },
    { id: 'govt', icon: '🏛️', title: 'Government / PSU', subtitle: 'Stability and prestige' },
    { id: 'ngo', icon: '❤️', title: 'Social enterprise / NGO', subtitle: 'Business for good' },
  ]},
  { id: 8, question: 'How do you handle financial risk?', options: [
    { id: 'conservative', icon: '🔒', title: 'Very conservative', subtitle: 'Capital preservation first' },
    { id: 'calculated', icon: '📐', title: 'Calculated risks only', subtitle: 'Model before deciding' },
    { id: 'moderate', icon: '⚖️', title: 'Moderate risk-taker', subtitle: 'Balanced portfolio mindset' },
    { id: 'aggressive', icon: '📈', title: 'Aggressive growth', subtitle: 'High risk, high reward' },
    { id: 'depends', icon: '🔄', title: 'Depends on context', subtitle: 'Situational approach' },
  ]},
  { id: 9, question: 'Which skill do you want to master?', options: [
    { id: 'excel', icon: '📊', title: 'Financial modeling', subtitle: 'Excel, valuation, DCF' },
    { id: 'sales', icon: '🤝', title: 'Sales & negotiation', subtitle: 'Close deals, build revenue' },
    { id: 'digital', icon: '💻', title: 'Digital marketing', subtitle: 'SEO, ads, analytics' },
    { id: 'leadership', icon: '👑', title: 'Leadership & management', subtitle: 'Lead teams effectively' },
    { id: 'data', icon: '🔢', title: 'Business analytics', subtitle: 'Data-driven decisions' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'cfo', icon: '💹', title: 'CFO / Finance Director', subtitle: 'Top finance role' },
    { id: 'founder', icon: '🚀', title: 'Founder / Co-founder', subtitle: 'Built something from scratch' },
    { id: 'consultant', icon: '💼', title: 'Senior consultant', subtitle: 'Trusted advisor to CEOs' },
    { id: 'manager', icon: '👥', title: 'Business unit head', subtitle: 'P&L responsibility' },
    { id: 'investor', icon: '💰', title: 'Investor / VC', subtitle: 'Fund the next big thing' },
  ]},
]

// ── Default / Generic ─────────────────────────────────────────────────────────
const DEFAULT_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'What activities make you lose track of time?', options: [
    { id: 'solve', icon: '🧩', title: 'Solving complex problems', subtitle: 'Debugging, puzzles, logic' },
    { id: 'help', icon: '🤝', title: 'Helping & teaching others', subtitle: 'Explaining, mentoring' },
    { id: 'build', icon: '🔨', title: 'Building & creating things', subtitle: 'Coding, designing, crafting' },
    { id: 'lead', icon: '📋', title: 'Leading & organizing teams', subtitle: 'Planning, delegating' },
    { id: 'research', icon: '🔬', title: 'Researching & analyzing data', subtitle: 'Reading, experimenting' },
  ]},
  { id: 2, question: 'What is your biggest natural strength?', options: [
    { id: 'logic', icon: '🧠', title: 'Logical thinking', subtitle: 'Systematic, analytical, precise' },
    { id: 'comm', icon: '🗣️', title: 'Communication & persuasion', subtitle: 'Convincing, presenting' },
    { id: 'creative', icon: '🎨', title: 'Creativity & innovation', subtitle: 'Original ideas, design thinking' },
    { id: 'org', icon: '📌', title: 'Organization & planning', subtitle: 'Structured, detail-oriented' },
    { id: 'empathy', icon: '💛', title: 'Empathy & understanding', subtitle: 'Reading people, EQ' },
  ]},
  { id: 3, question: 'What kind of work environment suits you?', options: [
    { id: 'startup', icon: '🏃', title: 'Fast-paced startup', subtitle: 'Move fast, ship daily' },
    { id: 'large', icon: '🏢', title: 'Large stable organization', subtitle: 'Structured, clear hierarchy' },
    { id: 'remote', icon: '🏠', title: 'Remote & freelance', subtitle: 'Work from anywhere' },
    { id: 'research', icon: '🔬', title: 'Research & academia', subtitle: 'Deep thinking, long-term' },
    { id: 'own', icon: '🚀', title: 'Running my own venture', subtitle: 'Be your own boss' },
  ]},
  { id: 4, question: 'What motivates you most in a career?', options: [
    { id: 'money', icon: '💰', title: 'High earning potential', subtitle: 'Financial freedom' },
    { id: 'impact', icon: '🌍', title: 'Making a real impact', subtitle: 'Changing lives' },
    { id: 'freedom', icon: '🎭', title: 'Creative freedom', subtitle: 'Express yourself' },
    { id: 'security', icon: '🛡️', title: 'Job security & stability', subtitle: 'Predictable, safe' },
    { id: 'learning', icon: '📚', title: 'Continuous learning', subtitle: 'Always growing' },
  ]},
  { id: 5, question: 'How do you handle a difficult challenge?', options: [
    { id: 'analyze', icon: '📊', title: 'Analyze it systematically', subtitle: 'Break it down, root cause' },
    { id: 'ask', icon: '👥', title: 'Ask others for help', subtitle: 'Collaborate, seek expertise' },
    { id: 'experiment', icon: '🧪', title: 'Experiment creatively', subtitle: 'Try different approaches' },
    { id: 'delegate', icon: '📝', title: 'Break into tasks & delegate', subtitle: 'Organize and distribute' },
    { id: 'push', icon: '💪', title: 'Push through independently', subtitle: 'Self-reliant, determined' },
  ]},
  { id: 6, question: "What's your ideal team size?", options: [
    { id: 'solo', icon: '🧍', title: 'Solo — I work best alone', subtitle: 'Full control' },
    { id: 'small', icon: '👫', title: 'Small team (2-5 people)', subtitle: 'Close-knit, agile' },
    { id: 'medium', icon: '👨‍👩‍👧‍👦', title: 'Medium team (6-15)', subtitle: 'Diverse skills' },
    { id: 'large', icon: '🏟️', title: 'Large team (15+)', subtitle: 'Big org, specialized roles' },
    { id: 'flex', icon: '🔄', title: 'Flexible — depends on project', subtitle: 'Adaptable to any size' },
  ]},
  { id: 7, question: 'How do you learn best?', options: [
    { id: 'read', icon: '📖', title: 'Reading & theory', subtitle: 'Books, docs, deep understanding' },
    { id: 'hands', icon: '🛠️', title: 'Hands-on practice', subtitle: 'Build it to learn it' },
    { id: 'watch', icon: '👀', title: 'Watching & observing', subtitle: 'Videos, shadowing experts' },
    { id: 'teach', icon: '🎓', title: 'Teaching others', subtitle: 'Explaining solidifies knowledge' },
    { id: 'discuss', icon: '💬', title: 'Discussion & debate', subtitle: 'Talking through ideas' },
  ]},
  { id: 8, question: 'What is your risk tolerance?', options: [
    { id: 'vlow', icon: '🔒', title: 'Very low — I prefer stability', subtitle: 'Safe, predictable path' },
    { id: 'low', icon: '⚖️', title: 'Low — calculated risks only', subtitle: 'Careful, measured' },
    { id: 'med', icon: '🎯', title: 'Medium — balanced', subtitle: 'Weigh pros and cons' },
    { id: 'high', icon: '📈', title: 'High — I embrace uncertainty', subtitle: 'Opportunity in chaos' },
    { id: 'vhigh', icon: '🎲', title: 'Very high — I love risk', subtitle: 'All-in, high reward' },
  ]},
  { id: 9, question: 'How important is work-life balance?', options: [
    { id: 'hustle', icon: '🔥', title: 'Work is my life — I hustle hard', subtitle: 'Career-first, always on' },
    { id: 'protect', icon: '⚡', title: 'Work hard but protect my time', subtitle: 'Productive but boundaried' },
    { id: 'balance', icon: '⚖️', title: 'Balance is everything', subtitle: 'Equal priority to both' },
    { id: 'family', icon: '🏡', title: 'Family & personal life first', subtitle: 'Work funds my real life' },
    { id: 'phase', icon: '🔄', title: 'Depends on the phase of life', subtitle: 'Flexible based on context' },
  ]},
  { id: 10, question: 'Where do you see yourself in 5 years?', options: [
    { id: 'expert', icon: '🏆', title: 'Senior expert in my field', subtitle: 'Deep specialist, go-to person' },
    { id: 'founder', icon: '🚀', title: 'Running my own venture', subtitle: 'Founder, entrepreneur' },
    { id: 'leader', icon: '👑', title: 'Leading a large team', subtitle: 'Manager, director, VP' },
    { id: 'academic', icon: '📜', title: 'Published researcher/academic', subtitle: 'PhD, papers, academia' },
    { id: 'remote', icon: '🌏', title: 'Working remotely from anywhere', subtitle: 'Digital nomad' },
  ]},
]

// ── Arts & Humanities ─────────────────────────────────────────────────────────
const ARTS_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which area of arts & humanities excites you most?', options: [
    { id: 'lit', icon: '📖', title: 'Literature & Writing', subtitle: 'Stories, poetry, content' },
    { id: 'history', icon: '🏛️', title: 'History & Culture', subtitle: 'Past civilizations, heritage' },
    { id: 'philosophy', icon: '🧠', title: 'Philosophy & Ethics', subtitle: 'Ideas, logic, morality' },
    { id: 'lang', icon: '🌐', title: 'Languages & Linguistics', subtitle: 'Communication, translation' },
    { id: 'psych', icon: '💭', title: 'Psychology & Sociology', subtitle: 'Human behavior, society' },
  ]},
  { id: 2, question: 'What kind of work do you enjoy most?', options: [
    { id: 'write', icon: '✍️', title: 'Writing & storytelling', subtitle: 'Articles, books, scripts' },
    { id: 'research', icon: '🔍', title: 'Research & analysis', subtitle: 'Deep study, documentation' },
    { id: 'teach', icon: '🎓', title: 'Teaching & mentoring', subtitle: 'Sharing knowledge' },
    { id: 'counsel', icon: '🤝', title: 'Counseling & guidance', subtitle: 'Helping people grow' },
    { id: 'translate', icon: '🌍', title: 'Translation & interpretation', subtitle: 'Bridging languages' },
  ]},
  { id: 3, question: 'Your ideal career path:', options: [
    { id: 'author', icon: '📚', title: 'Author / Journalist', subtitle: 'Write for impact' },
    { id: 'upsc', icon: '🏛️', title: 'Civil Services (UPSC)', subtitle: 'Serve the nation' },
    { id: 'professor', icon: '🎓', title: 'Professor / Researcher', subtitle: 'Academic excellence' },
    { id: 'counselor', icon: '💛', title: 'Psychologist / Counselor', subtitle: 'Mental health support' },
    { id: 'content', icon: '📢', title: 'Content Creator / Editor', subtitle: 'Digital media' },
  ]},
  { id: 4, question: 'What motivates you most?', options: [
    { id: 'impact', icon: '🌍', title: 'Creating social impact', subtitle: 'Change lives through work' },
    { id: 'expression', icon: '🎭', title: 'Creative expression', subtitle: 'Share your voice' },
    { id: 'knowledge', icon: '📖', title: 'Expanding knowledge', subtitle: 'Lifelong learning' },
    { id: 'recognition', icon: '🏆', title: 'Recognition & prestige', subtitle: 'Be respected in field' },
    { id: 'stability', icon: '🛡️', title: 'Job security', subtitle: 'Stable, respected career' },
  ]},
  { id: 5, question: 'How do you prefer to work?', options: [
    { id: 'solo', icon: '🧍', title: 'Independent research', subtitle: 'Deep solo work' },
    { id: 'team', icon: '👥', title: 'Collaborative projects', subtitle: 'Group discussions' },
    { id: 'field', icon: '🌾', title: 'Field work & interviews', subtitle: 'On-ground research' },
    { id: 'digital', icon: '💻', title: 'Digital & remote', subtitle: 'Online platforms' },
    { id: 'classroom', icon: '🏫', title: 'Classroom & training', subtitle: 'Teaching environment' },
  ]},
  { id: 6, question: 'Which skill do you want to master?', options: [
    { id: 'writing', icon: '✍️', title: 'Academic / creative writing', subtitle: 'Craft compelling content' },
    { id: 'public', icon: '🎤', title: 'Public speaking', subtitle: 'Communicate with confidence' },
    { id: 'research2', icon: '🔬', title: 'Research methodology', subtitle: 'Systematic investigation' },
    { id: 'digital2', icon: '📱', title: 'Digital content creation', subtitle: 'Blogs, videos, podcasts' },
    { id: 'lang2', icon: '🌐', title: 'Foreign language fluency', subtitle: 'Open global doors' },
  ]},
  { id: 7, question: 'Where do you see yourself working?', options: [
    { id: 'university', icon: '🏛️', title: 'University / Research institute', subtitle: 'Academic environment' },
    { id: 'media', icon: '📺', title: 'Media / Publishing house', subtitle: 'Content at scale' },
    { id: 'govt', icon: '🏢', title: 'Government / Civil services', subtitle: 'Policy and administration' },
    { id: 'ngo', icon: '❤️', title: 'NGO / Social sector', subtitle: 'Grassroots impact' },
    { id: 'freelance', icon: '🌍', title: 'Freelance / Self-employed', subtitle: 'Own your time' },
  ]},
  { id: 8, question: 'What kind of problems do you enjoy solving?', options: [
    { id: 'social', icon: '🤝', title: 'Social & cultural issues', subtitle: 'Community challenges' },
    { id: 'mental', icon: '🧠', title: 'Mental health & wellbeing', subtitle: 'Human psychology' },
    { id: 'policy', icon: '📋', title: 'Policy & governance', subtitle: 'Systemic change' },
    { id: 'education', icon: '📚', title: 'Education access', subtitle: 'Learning for all' },
    { id: 'narrative', icon: '📖', title: 'Narrative & communication', subtitle: 'Telling better stories' },
  ]},
  { id: 9, question: 'Your biggest strength:', options: [
    { id: 'empathy', icon: '💛', title: 'Empathy & emotional intelligence', subtitle: 'Connect deeply with people' },
    { id: 'critical', icon: '🧠', title: 'Critical thinking', subtitle: 'Analyze and question' },
    { id: 'creativity', icon: '🎨', title: 'Creativity & originality', subtitle: 'Fresh perspectives' },
    { id: 'communication', icon: '🗣️', title: 'Communication skills', subtitle: 'Express ideas clearly' },
    { id: 'research3', icon: '🔍', title: 'Research & documentation', subtitle: 'Thorough and systematic' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'professor2', icon: '🎓', title: 'Professor / Academic', subtitle: 'Teach and publish' },
    { id: 'journalist', icon: '📰', title: 'Senior journalist / Editor', subtitle: 'Shape public discourse' },
    { id: 'ias', icon: '🏛️', title: 'IAS / IPS Officer', subtitle: 'Serve at national level' },
    { id: 'author2', icon: '📚', title: 'Published author', subtitle: 'Books that matter' },
    { id: 'therapist', icon: '💭', title: 'Psychologist / Therapist', subtitle: 'Heal and guide' },
  ]},
]

// ── Pure Science ──────────────────────────────────────────────────────────────
const SCIENCE_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which science domain excites you most?', options: [
    { id: 'physics', icon: '⚛️', title: 'Physics', subtitle: 'Forces, energy, universe' },
    { id: 'chemistry', icon: '🧪', title: 'Chemistry', subtitle: 'Matter, reactions, materials' },
    { id: 'biology', icon: '🧬', title: 'Biology / Life Sciences', subtitle: 'Living systems, genetics' },
    { id: 'math', icon: '📐', title: 'Mathematics / Statistics', subtitle: 'Numbers, patterns, proofs' },
    { id: 'env', icon: '🌿', title: 'Environmental Science', subtitle: 'Ecology, climate, sustainability' },
  ]},
  { id: 2, question: 'What kind of research excites you?', options: [
    { id: 'lab', icon: '🔬', title: 'Laboratory experiments', subtitle: 'Hands-on discovery' },
    { id: 'theoretical', icon: '📐', title: 'Theoretical / mathematical', subtitle: 'Abstract problem solving' },
    { id: 'field', icon: '🌾', title: 'Field research', subtitle: 'Outdoor data collection' },
    { id: 'computational', icon: '💻', title: 'Computational science', subtitle: 'Simulations, modeling' },
    { id: 'applied', icon: '🏭', title: 'Applied research', subtitle: 'Real-world solutions' },
  ]},
  { id: 3, question: 'Your ideal career path:', options: [
    { id: 'researcher', icon: '🔬', title: 'Research Scientist', subtitle: 'Publish, discover, innovate' },
    { id: 'professor', icon: '🎓', title: 'Professor / Academic', subtitle: 'Teach and research' },
    { id: 'industry', icon: '🏭', title: 'Industry R&D', subtitle: 'Science for products' },
    { id: 'govt', icon: '🏛️', title: 'Government scientist / DRDO / ISRO', subtitle: 'National science missions' },
    { id: 'data', icon: '📊', title: 'Data Scientist / Analyst', subtitle: 'Science meets technology' },
  ]},
  { id: 4, question: 'What motivates you most?', options: [
    { id: 'discovery', icon: '🔭', title: 'Making new discoveries', subtitle: 'Push boundaries of knowledge' },
    { id: 'solve', icon: '🧩', title: 'Solving complex problems', subtitle: 'Intellectual challenge' },
    { id: 'impact', icon: '🌍', title: 'Real-world impact', subtitle: 'Science that helps people' },
    { id: 'prestige', icon: '🏆', title: 'Academic prestige', subtitle: 'Publications, awards' },
    { id: 'stability', icon: '🛡️', title: 'Stable career', subtitle: 'Government or academia' },
  ]},
  { id: 5, question: 'How do you approach a scientific problem?', options: [
    { id: 'hypothesis', icon: '💡', title: 'Form hypothesis, test it', subtitle: 'Classic scientific method' },
    { id: 'data', icon: '📊', title: 'Collect data first, then analyze', subtitle: 'Data-driven approach' },
    { id: 'literature', icon: '📚', title: 'Study existing literature', subtitle: 'Build on prior work' },
    { id: 'collaborate', icon: '👥', title: 'Collaborate with experts', subtitle: 'Interdisciplinary approach' },
    { id: 'intuition', icon: '🧠', title: 'Follow scientific intuition', subtitle: 'Creative leaps' },
  ]},
  { id: 6, question: 'Which skill do you want to master?', options: [
    { id: 'lab2', icon: '🔬', title: 'Advanced lab techniques', subtitle: 'Instrumentation, protocols' },
    { id: 'stats', icon: '📐', title: 'Statistical analysis', subtitle: 'R, SPSS, data interpretation' },
    { id: 'coding', icon: '💻', title: 'Scientific programming', subtitle: 'Python, MATLAB, R' },
    { id: 'writing', icon: '✍️', title: 'Research paper writing', subtitle: 'Publish in journals' },
    { id: 'grant', icon: '💰', title: 'Grant writing & funding', subtitle: 'Secure research funding' },
  ]},
  { id: 7, question: 'Where do you want to work?', options: [
    { id: 'iit', icon: '🏛️', title: 'IIT / IISc / Top university', subtitle: 'Premier research institute' },
    { id: 'isro', icon: '🚀', title: 'ISRO / DRDO / BARC', subtitle: 'National science missions' },
    { id: 'pharma', icon: '💊', title: 'Pharma / Biotech company', subtitle: 'Applied science' },
    { id: 'abroad', icon: '🌍', title: 'International research lab', subtitle: 'Global collaboration' },
    { id: 'startup', icon: '🔥', title: 'Deep-tech startup', subtitle: 'Science-based innovation' },
  ]},
  { id: 8, question: 'What is your risk tolerance for research?', options: [
    { id: 'safe', icon: '🔒', title: 'Incremental, safe research', subtitle: 'Build on proven work' },
    { id: 'moderate', icon: '⚖️', title: 'Moderate risk, good reward', subtitle: 'Balanced approach' },
    { id: 'bold', icon: '🚀', title: 'Bold, high-risk research', subtitle: 'Potential for breakthroughs' },
    { id: 'applied2', icon: '🏭', title: 'Applied, industry-focused', subtitle: 'Practical outcomes' },
    { id: 'interdisciplinary', icon: '🔄', title: 'Interdisciplinary exploration', subtitle: 'Cross-field innovation' },
  ]},
  { id: 9, question: 'Your biggest strength as a scientist:', options: [
    { id: 'analytical', icon: '📊', title: 'Analytical thinking', subtitle: 'Break down complex data' },
    { id: 'patience', icon: '⏳', title: 'Patience & persistence', subtitle: 'Long-term experiments' },
    { id: 'creativity2', icon: '💡', title: 'Creative hypothesis generation', subtitle: 'Think outside the box' },
    { id: 'precision', icon: '🎯', title: 'Precision & accuracy', subtitle: 'Meticulous methodology' },
    { id: 'communication', icon: '🗣️', title: 'Science communication', subtitle: 'Explain complex ideas simply' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'phd', icon: '🎓', title: 'PhD researcher', subtitle: 'Deep specialist' },
    { id: 'scientist', icon: '🔬', title: 'Senior scientist at institute', subtitle: 'Lead research projects' },
    { id: 'professor2', icon: '🏛️', title: 'Assistant Professor', subtitle: 'Teach and publish' },
    { id: 'industry2', icon: '🏭', title: 'R&D lead at company', subtitle: 'Applied science impact' },
    { id: 'abroad2', icon: '🌍', title: 'Postdoc abroad', subtitle: 'International exposure' },
  ]},
]

// ── Law & Legal Studies ───────────────────────────────────────────────────────
const LAW_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which area of law interests you most?', options: [
    { id: 'corporate', icon: '🏢', title: 'Corporate & Business Law', subtitle: 'M&A, contracts, compliance' },
    { id: 'criminal', icon: '⚖️', title: 'Criminal Law', subtitle: 'Justice, prosecution, defense' },
    { id: 'constitutional', icon: '🏛️', title: 'Constitutional Law', subtitle: 'Rights, governance, PIL' },
    { id: 'ip', icon: '💡', title: 'Intellectual Property', subtitle: 'Patents, trademarks, copyright' },
    { id: 'international', icon: '🌍', title: 'International Law', subtitle: 'Treaties, human rights' },
  ]},
  { id: 2, question: 'What kind of legal work excites you?', options: [
    { id: 'litigation', icon: '🎤', title: 'Courtroom litigation', subtitle: 'Argue cases before judges' },
    { id: 'drafting', icon: '📝', title: 'Contract drafting & advisory', subtitle: 'Transactional work' },
    { id: 'research', icon: '🔍', title: 'Legal research & writing', subtitle: 'Deep analysis, opinions' },
    { id: 'policy', icon: '📋', title: 'Policy & legislation', subtitle: 'Shape laws and regulations' },
    { id: 'mediation', icon: '🤝', title: 'Mediation & arbitration', subtitle: 'Resolve disputes peacefully' },
  ]},
  { id: 3, question: 'Your ideal career path:', options: [
    { id: 'advocate', icon: '⚖️', title: 'Advocate / Barrister', subtitle: 'Practice in courts' },
    { id: 'corporate2', icon: '🏢', title: 'Corporate lawyer at firm', subtitle: 'Big law, high stakes' },
    { id: 'judge', icon: '🏛️', title: 'Judicial services', subtitle: 'Become a judge' },
    { id: 'ias', icon: '🎓', title: 'Civil services / IAS', subtitle: 'Law + governance' },
    { id: 'ngo', icon: '❤️', title: 'Legal aid / NGO', subtitle: 'Justice for the marginalized' },
  ]},
  { id: 4, question: 'What motivates you most in law?', options: [
    { id: 'justice', icon: '⚖️', title: 'Delivering justice', subtitle: 'Fight for what is right' },
    { id: 'money', icon: '💰', title: 'High earnings', subtitle: 'Top law firms pay well' },
    { id: 'power', icon: '👑', title: 'Influence & power', subtitle: 'Shape society through law' },
    { id: 'intellect', icon: '🧠', title: 'Intellectual challenge', subtitle: 'Complex legal puzzles' },
    { id: 'help', icon: '🤝', title: 'Helping people', subtitle: 'Protect rights of others' },
  ]},
  { id: 5, question: 'How do you handle a complex legal problem?', options: [
    { id: 'research2', icon: '📚', title: 'Research precedents thoroughly', subtitle: 'Case law first' },
    { id: 'argue', icon: '🎤', title: 'Build the strongest argument', subtitle: 'Persuasion is key' },
    { id: 'negotiate', icon: '🤝', title: 'Find a negotiated solution', subtitle: 'Avoid court if possible' },
    { id: 'statutory', icon: '📋', title: 'Analyze statutory provisions', subtitle: 'Letter of the law' },
    { id: 'consult', icon: '👥', title: 'Consult senior colleagues', subtitle: 'Collaborative approach' },
  ]},
  { id: 6, question: 'Which skill do you want to master?', options: [
    { id: 'advocacy', icon: '🎤', title: 'Oral advocacy', subtitle: 'Argue persuasively in court' },
    { id: 'drafting2', icon: '✍️', title: 'Legal drafting', subtitle: 'Precise, airtight documents' },
    { id: 'research3', icon: '🔍', title: 'Legal research', subtitle: 'Find the right precedent' },
    { id: 'negotiation', icon: '🤝', title: 'Negotiation & deal-making', subtitle: 'Corporate transactions' },
    { id: 'tech', icon: '💻', title: 'Legal tech & AI tools', subtitle: 'Future of law practice' },
  ]},
  { id: 7, question: 'Where do you want to work?', options: [
    { id: 'biglaw', icon: '🏢', title: 'Top law firm (AZB, Cyril Amarchand)', subtitle: 'High-profile cases' },
    { id: 'court', icon: '⚖️', title: 'High Court / Supreme Court', subtitle: 'Constitutional practice' },
    { id: 'inhouse', icon: '🏭', title: 'In-house legal at company', subtitle: 'Corporate counsel' },
    { id: 'govt2', icon: '🏛️', title: 'Government / Public prosecutor', subtitle: 'State legal service' },
    { id: 'own', icon: '🔥', title: 'Own law practice', subtitle: 'Independent advocate' },
  ]},
  { id: 8, question: 'What is your approach to ethics in law?', options: [
    { id: 'strict', icon: '⚖️', title: 'Strictly follow the law', subtitle: 'Letter of the law always' },
    { id: 'spirit', icon: '💡', title: 'Follow the spirit of the law', subtitle: 'Justice over technicality' },
    { id: 'client', icon: '🤝', title: 'Client interest first', subtitle: 'Zealous representation' },
    { id: 'society', icon: '🌍', title: 'Society interest first', subtitle: 'Law as social tool' },
    { id: 'balance', icon: '⚖️', title: 'Balance all interests', subtitle: 'Pragmatic approach' },
  ]},
  { id: 9, question: 'Your biggest strength as a lawyer:', options: [
    { id: 'analytical2', icon: '🧠', title: 'Analytical reasoning', subtitle: 'Spot issues others miss' },
    { id: 'persuasion', icon: '🎤', title: 'Persuasion & rhetoric', subtitle: 'Win arguments' },
    { id: 'attention', icon: '🎯', title: 'Attention to detail', subtitle: 'Nothing slips through' },
    { id: 'empathy2', icon: '💛', title: 'Client empathy', subtitle: 'Understand their situation' },
    { id: 'network', icon: '🤝', title: 'Networking & relationships', subtitle: 'Know the right people' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'associate', icon: '🏢', title: 'Associate at top law firm', subtitle: 'On track to partner' },
    { id: 'advocate2', icon: '⚖️', title: 'Independent advocate', subtitle: 'Own practice' },
    { id: 'llm', icon: '🎓', title: 'LLM from top university', subtitle: 'Specialized expertise' },
    { id: 'judicial', icon: '🏛️', title: 'Judicial services officer', subtitle: 'On the bench' },
    { id: 'policy2', icon: '📋', title: 'Policy advisor / Legal consultant', subtitle: 'Shape regulations' },
  ]},
]

// ── Education & Teaching ──────────────────────────────────────────────────────
const EDUCATION_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which level of education interests you most?', options: [
    { id: 'primary', icon: '🏫', title: 'Primary / Elementary', subtitle: 'Foundation years, young minds' },
    { id: 'secondary', icon: '📚', title: 'Secondary / High School', subtitle: 'Subject specialization' },
    { id: 'higher', icon: '🎓', title: 'Higher Education / College', subtitle: 'University teaching' },
    { id: 'special', icon: '💛', title: 'Special Education', subtitle: 'Differently-abled learners' },
    { id: 'vocational', icon: '🔧', title: 'Vocational / Skill Training', subtitle: 'Practical skills' },
  ]},
  { id: 2, question: 'What kind of educator do you want to be?', options: [
    { id: 'subject', icon: '📖', title: 'Subject matter expert', subtitle: 'Deep knowledge, clear teaching' },
    { id: 'mentor', icon: '🤝', title: 'Mentor & guide', subtitle: 'Shape students holistically' },
    { id: 'innovator', icon: '💡', title: 'Innovative educator', subtitle: 'New teaching methods' },
    { id: 'researcher', icon: '🔬', title: 'Education researcher', subtitle: 'Study how people learn' },
    { id: 'admin', icon: '🏢', title: 'School / College administrator', subtitle: 'Lead institutions' },
  ]},
  { id: 3, question: 'What motivates you to teach?', options: [
    { id: 'impact', icon: '🌍', title: 'Shaping future generations', subtitle: 'Long-term societal impact' },
    { id: 'passion', icon: '❤️', title: 'Passion for the subject', subtitle: 'Share what you love' },
    { id: 'stability', icon: '🛡️', title: 'Job security & stability', subtitle: 'Government jobs, pension' },
    { id: 'respect', icon: '🏆', title: 'Social respect', subtitle: 'Honored profession' },
    { id: 'learning', icon: '📚', title: 'Continuous learning', subtitle: 'Always growing with students' },
  ]},
  { id: 4, question: 'Your ideal teaching environment:', options: [
    { id: 'govt', icon: '🏛️', title: 'Government school / college', subtitle: 'Serve all sections of society' },
    { id: 'private', icon: '🏫', title: 'Private school / university', subtitle: 'Better resources' },
    { id: 'online', icon: '💻', title: 'Online education platform', subtitle: 'Reach millions' },
    { id: 'coaching', icon: '📋', title: 'Coaching institute', subtitle: 'Competitive exam prep' },
    { id: 'ngo', icon: '❤️', title: 'NGO / Rural education', subtitle: 'Underserved communities' },
  ]},
  { id: 5, question: 'How do you handle a struggling student?', options: [
    { id: 'extra', icon: '⏰', title: 'Give extra time and attention', subtitle: 'Personalized support' },
    { id: 'different', icon: '🔄', title: 'Try different teaching methods', subtitle: 'Adapt to their style' },
    { id: 'parents', icon: '👨‍👩‍👧', title: 'Involve parents', subtitle: 'Collaborative approach' },
    { id: 'peer', icon: '👥', title: 'Peer learning groups', subtitle: 'Students teach each other' },
    { id: 'counsel', icon: '💛', title: 'Counsel and motivate', subtitle: 'Address root cause' },
  ]},
  { id: 6, question: 'Which qualification do you want to pursue?', options: [
    { id: 'bed', icon: '🎓', title: 'B.Ed / M.Ed', subtitle: 'Teaching certification' },
    { id: 'net', icon: '📋', title: 'UGC NET / SET', subtitle: 'College teaching eligibility' },
    { id: 'phd', icon: '🔬', title: 'PhD in Education', subtitle: 'Research and academia' },
    { id: 'ctet', icon: '🏫', title: 'CTET / TET', subtitle: 'School teaching certification' },
    { id: 'edtech', icon: '💻', title: 'EdTech certification', subtitle: 'Digital teaching skills' },
  ]},
  { id: 7, question: 'What is your teaching philosophy?', options: [
    { id: 'student', icon: '👶', title: 'Student-centered learning', subtitle: 'Student leads, teacher guides' },
    { id: 'structured', icon: '📋', title: 'Structured curriculum', subtitle: 'Clear syllabus, discipline' },
    { id: 'experiential', icon: '🔬', title: 'Experiential learning', subtitle: 'Learn by doing' },
    { id: 'critical', icon: '🧠', title: 'Critical thinking focus', subtitle: 'Question everything' },
    { id: 'holistic', icon: '🌱', title: 'Holistic development', subtitle: 'Beyond academics' },
  ]},
  { id: 8, question: 'Technology in education — your view:', options: [
    { id: 'embrace', icon: '💻', title: 'Fully embrace EdTech', subtitle: 'Digital-first classroom' },
    { id: 'blend', icon: '🔄', title: 'Blend tech with traditional', subtitle: 'Best of both worlds' },
    { id: 'tool', icon: '🔧', title: 'Tech as a tool, not replacement', subtitle: 'Teacher still central' },
    { id: 'skeptical', icon: '🤔', title: 'Skeptical but open', subtitle: 'Prove it works first' },
    { id: 'build', icon: '🚀', title: 'Want to build EdTech products', subtitle: 'Tech entrepreneur in education' },
  ]},
  { id: 9, question: 'Your biggest strength as an educator:', options: [
    { id: 'patience', icon: '⏳', title: 'Patience & empathy', subtitle: 'Never give up on a student' },
    { id: 'knowledge', icon: '📚', title: 'Deep subject knowledge', subtitle: 'Expert in your field' },
    { id: 'communication2', icon: '🗣️', title: 'Communication skills', subtitle: 'Explain anything clearly' },
    { id: 'creativity2', icon: '🎨', title: 'Creative lesson planning', subtitle: 'Make learning fun' },
    { id: 'leadership', icon: '👑', title: 'Leadership & management', subtitle: 'Run a classroom well' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'teacher', icon: '🏫', title: 'Senior teacher / HOD', subtitle: 'Lead a department' },
    { id: 'principal', icon: '🏢', title: 'Principal / Vice-Principal', subtitle: 'Lead a school' },
    { id: 'professor2', icon: '🎓', title: 'College professor', subtitle: 'Higher education' },
    { id: 'edtech2', icon: '💻', title: 'EdTech content creator', subtitle: 'Teach millions online' },
    { id: 'researcher2', icon: '🔬', title: 'Education researcher / policy', subtitle: 'Reform the system' },
  ]},
]

// ── Design & Creative Arts ────────────────────────────────────────────────────
const DESIGN_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which design domain excites you most?', options: [
    { id: 'uiux', icon: '📱', title: 'UI/UX Design', subtitle: 'Digital products, apps, websites' },
    { id: 'graphic', icon: '🎨', title: 'Graphic Design', subtitle: 'Branding, print, visual identity' },
    { id: 'fashion', icon: '👗', title: 'Fashion Design', subtitle: 'Clothing, textiles, styling' },
    { id: 'interior', icon: '🏠', title: 'Interior Design', subtitle: 'Spaces, furniture, ambiance' },
    { id: 'product', icon: '🔧', title: 'Product / Industrial Design', subtitle: 'Physical product design' },
  ]},
  { id: 2, question: 'What drives your creative process?', options: [
    { id: 'user', icon: '👤', title: 'User needs & research', subtitle: 'Design for people' },
    { id: 'aesthetics', icon: '✨', title: 'Pure aesthetics', subtitle: 'Beauty and visual harmony' },
    { id: 'problem', icon: '🧩', title: 'Problem solving', subtitle: 'Design as a solution' },
    { id: 'trend', icon: '📈', title: 'Trends & culture', subtitle: 'Stay ahead of the curve' },
    { id: 'emotion', icon: '💛', title: 'Emotional storytelling', subtitle: 'Design that moves people' },
  ]},
  { id: 3, question: 'Your ideal work environment:', options: [
    { id: 'agency', icon: '🏢', title: 'Design agency', subtitle: 'Diverse clients, fast pace' },
    { id: 'inhouse', icon: '🏭', title: 'In-house at a brand', subtitle: 'Deep brand ownership' },
    { id: 'startup', icon: '🚀', title: 'Startup', subtitle: 'Build from scratch' },
    { id: 'freelance', icon: '🌍', title: 'Freelance / Independent', subtitle: 'Own your projects' },
    { id: 'studio', icon: '🎨', title: 'Own design studio', subtitle: 'Build your brand' },
  ]},
  { id: 4, question: 'Which tool do you want to master?', options: [
    { id: 'figma', icon: '📱', title: 'Figma / Adobe XD', subtitle: 'UI/UX prototyping' },
    { id: 'photoshop', icon: '🖼️', title: 'Photoshop / Illustrator', subtitle: 'Visual design' },
    { id: 'blender', icon: '🎮', title: '3D / Blender / Cinema 4D', subtitle: '3D modeling & animation' },
    { id: 'autocad', icon: '📐', title: 'AutoCAD / SketchUp', subtitle: 'Architectural / product design' },
    { id: 'motion', icon: '🎬', title: 'After Effects / Motion', subtitle: 'Animation & motion graphics' },
  ]},
  { id: 5, question: 'What matters most in your design work?', options: [
    { id: 'function', icon: '🔧', title: 'Functionality first', subtitle: 'Design must work' },
    { id: 'beauty', icon: '✨', title: 'Visual beauty', subtitle: 'Aesthetics above all' },
    { id: 'user2', icon: '👤', title: 'User experience', subtitle: 'Ease of use' },
    { id: 'brand', icon: '🏷️', title: 'Brand consistency', subtitle: 'Cohesive identity' },
    { id: 'innovation', icon: '💡', title: 'Innovation & originality', subtitle: 'Never seen before' },
  ]},
  { id: 6, question: 'How do you handle client feedback?', options: [
    { id: 'adapt', icon: '🔄', title: 'Adapt quickly', subtitle: 'Client is always right' },
    { id: 'explain', icon: '🗣️', title: 'Explain your design decisions', subtitle: 'Educate the client' },
    { id: 'collaborate', icon: '🤝', title: 'Collaborate to find middle ground', subtitle: 'Partnership approach' },
    { id: 'iterate', icon: '🔁', title: 'Iterate based on data', subtitle: 'Let metrics decide' },
    { id: 'push', icon: '💪', title: 'Push for the best design', subtitle: 'Advocate for quality' },
  ]},
  { id: 7, question: 'What kind of projects excite you most?', options: [
    { id: 'brand2', icon: '🏷️', title: 'Brand identity projects', subtitle: 'Logo, colors, typography' },
    { id: 'app', icon: '📱', title: 'App / website design', subtitle: 'Digital product design' },
    { id: 'campaign', icon: '📢', title: 'Marketing campaigns', subtitle: 'Visual storytelling' },
    { id: 'space', icon: '🏠', title: 'Space / environment design', subtitle: 'Physical experiences' },
    { id: 'social', icon: '📸', title: 'Social media content', subtitle: 'Viral visual content' },
  ]},
  { id: 8, question: 'Your biggest strength as a designer:', options: [
    { id: 'creativity3', icon: '🎨', title: 'Creativity & originality', subtitle: 'Fresh ideas always' },
    { id: 'technical', icon: '🔧', title: 'Technical tool mastery', subtitle: 'Expert in software' },
    { id: 'empathy3', icon: '💛', title: 'User empathy', subtitle: 'Design for real people' },
    { id: 'attention', icon: '🎯', title: 'Attention to detail', subtitle: 'Pixel-perfect work' },
    { id: 'speed', icon: '⚡', title: 'Speed & delivery', subtitle: 'Fast without compromising quality' },
  ]},
  { id: 9, question: 'How do you stay inspired?', options: [
    { id: 'dribbble', icon: '🌐', title: 'Dribbble / Behance', subtitle: 'Design community' },
    { id: 'nature', icon: '🌿', title: 'Nature & surroundings', subtitle: 'Organic inspiration' },
    { id: 'travel', icon: '✈️', title: 'Travel & culture', subtitle: 'Diverse perspectives' },
    { id: 'music', icon: '🎵', title: 'Music & art', subtitle: 'Cross-disciplinary inspiration' },
    { id: 'users', icon: '👥', title: 'User research & feedback', subtitle: 'Real problems inspire' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'lead', icon: '👑', title: 'Design Lead / Art Director', subtitle: 'Lead creative teams' },
    { id: 'founder', icon: '🚀', title: 'Founder of design studio', subtitle: 'Build your own brand' },
    { id: 'ux', icon: '📱', title: 'Senior UX Designer at tech company', subtitle: 'Product design at scale' },
    { id: 'fashion2', icon: '👗', title: 'Fashion designer with own label', subtitle: 'Your brand on the runway' },
    { id: 'freelance2', icon: '🌍', title: 'Top freelance designer', subtitle: 'Global clients, own schedule' },
  ]},
]

// ── Hotel Management & Hospitality ────────────────────────────────────────────
const HOTEL_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which area of hospitality excites you most?', options: [
    { id: 'fob', icon: '🏨', title: 'Front Office & Guest Relations', subtitle: 'First impression, guest experience' },
    { id: 'fb', icon: '🍽️', title: 'Food & Beverage', subtitle: 'Restaurants, banquets, bars' },
    { id: 'housekeeping', icon: '🛏️', title: 'Housekeeping & Operations', subtitle: 'Behind-the-scenes excellence' },
    { id: 'culinary', icon: '👨‍🍳', title: 'Culinary Arts / Kitchen', subtitle: 'Chef, food creation' },
    { id: 'events', icon: '🎉', title: 'Events & Banquets', subtitle: 'Weddings, conferences, parties' },
  ]},
  { id: 2, question: 'What kind of hospitality career appeals to you?', options: [
    { id: 'luxury', icon: '⭐', title: 'Luxury hotel management', subtitle: '5-star properties' },
    { id: 'restaurant', icon: '🍽️', title: 'Restaurant / F&B management', subtitle: 'Dining experiences' },
    { id: 'travel', icon: '✈️', title: 'Travel & tourism', subtitle: 'Tour operations, travel agency' },
    { id: 'airline', icon: '🛫', title: 'Airlines / Cabin crew', subtitle: 'Sky-high hospitality' },
    { id: 'own', icon: '🏠', title: 'Own hotel / restaurant', subtitle: 'Entrepreneur in hospitality' },
  ]},
  { id: 3, question: 'What motivates you most?', options: [
    { id: 'guest', icon: '😊', title: 'Making guests happy', subtitle: 'Satisfaction is everything' },
    { id: 'travel2', icon: '🌍', title: 'Travel & global exposure', subtitle: 'Work across the world' },
    { id: 'food', icon: '🍴', title: 'Passion for food & culture', subtitle: 'Culinary exploration' },
    { id: 'management', icon: '👑', title: 'Managing teams & operations', subtitle: 'Leadership in hospitality' },
    { id: 'money', icon: '💰', title: 'High earning potential', subtitle: 'Luxury sector pays well' },
  ]},
  { id: 4, question: 'How do you handle a difficult guest?', options: [
    { id: 'calm', icon: '😌', title: 'Stay calm, listen first', subtitle: 'Empathy before action' },
    { id: 'resolve', icon: '✅', title: 'Resolve immediately', subtitle: 'Fix the problem fast' },
    { id: 'escalate', icon: '📞', title: 'Escalate to manager', subtitle: 'Know when to involve seniors' },
    { id: 'compensate', icon: '🎁', title: 'Offer compensation', subtitle: 'Turn complaint into loyalty' },
    { id: 'prevent', icon: '🛡️', title: 'Prevent issues proactively', subtitle: 'Anticipate needs' },
  ]},
  { id: 5, question: 'Your ideal work location:', options: [
    { id: 'india', icon: '🇮🇳', title: 'India — metro cities', subtitle: 'Mumbai, Delhi, Bangalore' },
    { id: 'resort', icon: '🏖️', title: 'Resort destinations', subtitle: 'Goa, Maldives, hill stations' },
    { id: 'international', icon: '🌍', title: 'International hotels', subtitle: 'Dubai, Singapore, Europe' },
    { id: 'cruise', icon: '🚢', title: 'Cruise ships', subtitle: 'Travel while working' },
    { id: 'own2', icon: '🏠', title: 'Own property', subtitle: 'Build your own brand' },
  ]},
  { id: 6, question: 'Which skill do you want to master?', options: [
    { id: 'service', icon: '🤝', title: 'Guest service excellence', subtitle: 'World-class hospitality' },
    { id: 'culinary2', icon: '👨‍🍳', title: 'Culinary skills', subtitle: 'Master the kitchen' },
    { id: 'revenue', icon: '📊', title: 'Revenue management', subtitle: 'Pricing, yield, occupancy' },
    { id: 'language', icon: '🌐', title: 'Foreign language', subtitle: 'Serve international guests' },
    { id: 'digital', icon: '💻', title: 'Digital marketing for hotels', subtitle: 'OTA, social media' },
  ]},
  { id: 7, question: 'What is your work style?', options: [
    { id: 'people', icon: '👥', title: 'People-facing, always on floor', subtitle: 'Guest interaction is my energy' },
    { id: 'backend', icon: '🔧', title: 'Backend operations', subtitle: 'Make things run smoothly' },
    { id: 'creative', icon: '🎨', title: 'Creative — menus, events, decor', subtitle: 'Design experiences' },
    { id: 'analytical', icon: '📊', title: 'Analytical — data, revenue', subtitle: 'Numbers-driven decisions' },
    { id: 'leadership2', icon: '👑', title: 'Leadership & team management', subtitle: 'Lead from the front' },
  ]},
  { id: 8, question: 'Which certification do you want?', options: [
    { id: 'ihmct', icon: '🎓', title: 'IHM / IHMCT degree', subtitle: 'Premier hotel management' },
    { id: 'fhrai', icon: '🏨', title: 'FHRAI certification', subtitle: 'Industry recognition' },
    { id: 'sommelier', icon: '🍷', title: 'Sommelier / Bartending', subtitle: 'F&B specialization' },
    { id: 'chef', icon: '👨‍🍳', title: 'Professional chef certification', subtitle: 'Culinary excellence' },
    { id: 'revenue2', icon: '📊', title: 'Revenue management certification', subtitle: 'Hotel analytics' },
  ]},
  { id: 9, question: 'Your biggest strength:', options: [
    { id: 'warmth', icon: '😊', title: 'Warmth & hospitality', subtitle: 'People feel welcome around you' },
    { id: 'attention2', icon: '🎯', title: 'Attention to detail', subtitle: 'Nothing is overlooked' },
    { id: 'multitask', icon: '⚡', title: 'Multitasking under pressure', subtitle: 'Handle chaos gracefully' },
    { id: 'creativity4', icon: '🎨', title: 'Creativity in service', subtitle: 'Surprise and delight guests' },
    { id: 'leadership3', icon: '👑', title: 'Team leadership', subtitle: 'Inspire your team' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'gm', icon: '🏨', title: 'Hotel General Manager', subtitle: 'Run a full property' },
    { id: 'chef2', icon: '👨‍🍳', title: 'Executive Chef', subtitle: 'Lead the kitchen' },
    { id: 'owner', icon: '🏠', title: 'Own hotel / restaurant', subtitle: 'Entrepreneur' },
    { id: 'airline2', icon: '✈️', title: 'Senior cabin crew / purser', subtitle: 'Airline career' },
    { id: 'consultant', icon: '💼', title: 'Hospitality consultant', subtitle: 'Advise hotels & brands' },
  ]},
]

// ── Agriculture & Allied Sciences ─────────────────────────────────────────────
const AGRICULTURE_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which area of agriculture interests you most?', options: [
    { id: 'crop', icon: '🌾', title: 'Crop Science & Agronomy', subtitle: 'Better yields, soil health' },
    { id: 'animal', icon: '🐄', title: 'Animal Husbandry / Veterinary', subtitle: 'Livestock, dairy, poultry' },
    { id: 'horticulture', icon: '🌸', title: 'Horticulture', subtitle: 'Fruits, vegetables, flowers' },
    { id: 'agritech', icon: '💻', title: 'AgriTech & Precision Farming', subtitle: 'Drones, IoT, data in farming' },
    { id: 'food', icon: '🍎', title: 'Food Processing & Technology', subtitle: 'Value-added products' },
  ]},
  { id: 2, question: 'What kind of career appeals to you?', options: [
    { id: 'research', icon: '🔬', title: 'Agricultural research', subtitle: 'ICAR, universities, labs' },
    { id: 'extension', icon: '🌾', title: 'Extension officer / KVK', subtitle: 'Help farmers directly' },
    { id: 'startup', icon: '🚀', title: 'AgriTech startup', subtitle: 'Innovate for farmers' },
    { id: 'govt', icon: '🏛️', title: 'Government agriculture officer', subtitle: 'Policy and implementation' },
    { id: 'own', icon: '🏡', title: 'Own farm / agribusiness', subtitle: 'Entrepreneur in agriculture' },
  ]},
  { id: 3, question: 'What motivates you most?', options: [
    { id: 'food2', icon: '🌍', title: 'Food security for India', subtitle: 'Feed the nation' },
    { id: 'farmer', icon: '👨‍🌾', title: 'Improving farmer livelihoods', subtitle: 'Grassroots impact' },
    { id: 'innovation', icon: '💡', title: 'Agricultural innovation', subtitle: 'New tech for old problems' },
    { id: 'environment', icon: '🌿', title: 'Sustainable farming', subtitle: 'Protect the environment' },
    { id: 'business', icon: '💰', title: 'Agribusiness opportunity', subtitle: 'Agriculture is big business' },
  ]},
  { id: 4, question: 'Your ideal work setting:', options: [
    { id: 'field', icon: '🌾', title: 'Field / Farm', subtitle: 'Hands-on, outdoor work' },
    { id: 'lab', icon: '🔬', title: 'Research laboratory', subtitle: 'Controlled experiments' },
    { id: 'office', icon: '🏢', title: 'Office / Policy', subtitle: 'Planning and administration' },
    { id: 'village', icon: '🏡', title: 'Rural communities', subtitle: 'Work with farmers directly' },
    { id: 'tech', icon: '💻', title: 'Tech company / startup', subtitle: 'AgriTech innovation' },
  ]},
  { id: 5, question: 'Which skill do you want to master?', options: [
    { id: 'soil', icon: '🌱', title: 'Soil science & management', subtitle: 'Foundation of farming' },
    { id: 'drone', icon: '🚁', title: 'Drone & precision farming', subtitle: 'Modern agriculture' },
    { id: 'genetics', icon: '🧬', title: 'Plant genetics & breeding', subtitle: 'Better crop varieties' },
    { id: 'market', icon: '📊', title: 'Agricultural marketing', subtitle: 'Connect farm to market' },
    { id: 'organic', icon: '🌿', title: 'Organic farming methods', subtitle: 'Sustainable practices' },
  ]},
  { id: 6, question: 'What is your approach to farming challenges?', options: [
    { id: 'science', icon: '🔬', title: 'Science-based solutions', subtitle: 'Research and data' },
    { id: 'traditional', icon: '🌾', title: 'Traditional wisdom + modern', subtitle: 'Best of both' },
    { id: 'tech2', icon: '💻', title: 'Technology-first', subtitle: 'Drones, sensors, AI' },
    { id: 'community', icon: '👥', title: 'Community-based approach', subtitle: 'Farmers helping farmers' },
    { id: 'policy2', icon: '📋', title: 'Policy & systemic change', subtitle: 'Fix the system' },
  ]},
  { id: 7, question: 'Which exam / qualification do you want?', options: [
    { id: 'icar', icon: '🎓', title: 'ICAR JRF / SRF', subtitle: 'Research fellowship' },
    { id: 'ias', icon: '🏛️', title: 'IAS / State agriculture services', subtitle: 'Government officer' },
    { id: 'msc', icon: '📚', title: 'M.Sc Agriculture', subtitle: 'Specialization' },
    { id: 'mba', icon: '💼', title: 'MBA Agribusiness', subtitle: 'Business side of agriculture' },
    { id: 'phd', icon: '🔬', title: 'PhD in Agriculture', subtitle: 'Research career' },
  ]},
  { id: 8, question: 'Your biggest strength:', options: [
    { id: 'practical', icon: '🔧', title: 'Practical field knowledge', subtitle: 'Hands-on expertise' },
    { id: 'analytical2', icon: '📊', title: 'Analytical thinking', subtitle: 'Data-driven decisions' },
    { id: 'empathy4', icon: '💛', title: 'Empathy for farmers', subtitle: 'Understand their struggles' },
    { id: 'innovation2', icon: '💡', title: 'Innovation mindset', subtitle: 'New solutions for old problems' },
    { id: 'patience2', icon: '⏳', title: 'Patience & persistence', subtitle: 'Agriculture takes time' },
  ]},
  { id: 9, question: 'What is your view on technology in agriculture?', options: [
    { id: 'essential', icon: '🚀', title: 'Essential for future farming', subtitle: 'Tech will transform agriculture' },
    { id: 'supplement', icon: '🔄', title: 'Supplement traditional methods', subtitle: 'Balance is key' },
    { id: 'build', icon: '💻', title: 'Want to build AgriTech', subtitle: 'Startup in agriculture' },
    { id: 'skeptical', icon: '🤔', title: 'Skeptical — farmers need basics first', subtitle: 'Access before innovation' },
    { id: 'policy3', icon: '📋', title: 'Policy must drive adoption', subtitle: 'Government-led change' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'scientist', icon: '🔬', title: 'Agricultural scientist at ICAR', subtitle: 'Research and publish' },
    { id: 'officer', icon: '🏛️', title: 'Agriculture development officer', subtitle: 'Government service' },
    { id: 'founder', icon: '🚀', title: 'AgriTech startup founder', subtitle: 'Build for farmers' },
    { id: 'farmer2', icon: '🌾', title: 'Progressive farmer / agripreneur', subtitle: 'Own successful farm' },
    { id: 'professor2', icon: '🎓', title: 'Professor at agriculture college', subtitle: 'Teach and research' },
  ]},
]

// ── Mass Communication & Media ────────────────────────────────────────────────
const MEDIA_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which media domain excites you most?', options: [
    { id: 'journalism', icon: '📰', title: 'Journalism & Reporting', subtitle: 'Break news, tell stories' },
    { id: 'digital', icon: '📱', title: 'Digital Media & Content', subtitle: 'Social, blogs, YouTube' },
    { id: 'film', icon: '🎬', title: 'Film & Video Production', subtitle: 'Storytelling through visuals' },
    { id: 'pr', icon: '📢', title: 'PR & Corporate Communications', subtitle: 'Brand reputation management' },
    { id: 'advertising', icon: '🎯', title: 'Advertising & Marketing', subtitle: 'Creative campaigns' },
  ]},
  { id: 2, question: 'What kind of stories do you want to tell?', options: [
    { id: 'investigative', icon: '🔍', title: 'Investigative journalism', subtitle: 'Expose the truth' },
    { id: 'entertainment', icon: '🎭', title: 'Entertainment & lifestyle', subtitle: 'Pop culture, trends' },
    { id: 'social', icon: '🌍', title: 'Social issues & development', subtitle: 'Stories that matter' },
    { id: 'business', icon: '💼', title: 'Business & finance news', subtitle: 'Markets, companies, economy' },
    { id: 'sports', icon: '⚽', title: 'Sports journalism', subtitle: 'Games, athletes, events' },
  ]},
  { id: 3, question: 'Your ideal work environment:', options: [
    { id: 'newsroom', icon: '📰', title: 'Newsroom / TV channel', subtitle: 'Fast-paced, breaking news' },
    { id: 'agency', icon: '🏢', title: 'PR / Advertising agency', subtitle: 'Client campaigns' },
    { id: 'digital2', icon: '💻', title: 'Digital media startup', subtitle: 'New-age journalism' },
    { id: 'film2', icon: '🎬', title: 'Film / OTT production house', subtitle: 'Content creation' },
    { id: 'freelance', icon: '🌍', title: 'Freelance journalist / creator', subtitle: 'Own your content' },
  ]},
  { id: 4, question: 'What motivates you most?', options: [
    { id: 'truth', icon: '⚖️', title: 'Speaking truth to power', subtitle: 'Journalism as democracy' },
    { id: 'fame', icon: '⭐', title: 'Fame & recognition', subtitle: 'Be a known face/voice' },
    { id: 'creativity5', icon: '🎨', title: 'Creative expression', subtitle: 'Tell stories your way' },
    { id: 'impact2', icon: '🌍', title: 'Social impact', subtitle: 'Change through media' },
    { id: 'money2', icon: '💰', title: 'Monetizing content', subtitle: 'Build a media business' },
  ]},
  { id: 5, question: 'Which skill do you want to master?', options: [
    { id: 'writing2', icon: '✍️', title: 'Writing & storytelling', subtitle: 'Craft compelling narratives' },
    { id: 'video', icon: '🎬', title: 'Video production & editing', subtitle: 'Visual storytelling' },
    { id: 'social2', icon: '📱', title: 'Social media strategy', subtitle: 'Grow audiences online' },
    { id: 'data2', icon: '📊', title: 'Data journalism', subtitle: 'Numbers tell stories too' },
    { id: 'anchor', icon: '🎤', title: 'Anchoring & presenting', subtitle: 'On-camera presence' },
  ]},
  { id: 6, question: 'How do you approach a big story?', options: [
    { id: 'research4', icon: '🔍', title: 'Research thoroughly first', subtitle: 'Facts before publishing' },
    { id: 'sources', icon: '🤝', title: 'Build sources & contacts', subtitle: 'Network is everything' },
    { id: 'fast', icon: '⚡', title: 'Break it fast, verify later', subtitle: 'Speed matters in news' },
    { id: 'visual', icon: '🎬', title: 'Think visually first', subtitle: 'How will this look on screen?' },
    { id: 'angle', icon: '💡', title: 'Find the unique angle', subtitle: 'What makes this different?' },
  ]},
  { id: 7, question: 'Where do you want to work?', options: [
    { id: 'ndtv', icon: '📺', title: 'Major TV news channel', subtitle: 'NDTV, Aaj Tak, CNN-News18' },
    { id: 'print', icon: '📰', title: 'National newspaper / magazine', subtitle: 'TOI, Hindu, India Today' },
    { id: 'digital3', icon: '💻', title: 'Digital news platform', subtitle: 'The Wire, Scroll, Quint' },
    { id: 'bollywood', icon: '🎬', title: 'Bollywood / OTT production', subtitle: 'Netflix, Amazon, Hotstar' },
    { id: 'own2', icon: '🚀', title: 'Own YouTube / podcast channel', subtitle: 'Independent creator' },
  ]},
  { id: 8, question: 'Your biggest strength:', options: [
    { id: 'curiosity', icon: '🔍', title: 'Curiosity & questioning', subtitle: 'Always ask why' },
    { id: 'communication3', icon: '🗣️', title: 'Communication skills', subtitle: 'Articulate and persuasive' },
    { id: 'creativity6', icon: '🎨', title: 'Creative storytelling', subtitle: 'Make any story engaging' },
    { id: 'network2', icon: '🤝', title: 'Networking & sources', subtitle: 'Know the right people' },
    { id: 'speed', icon: '⚡', title: 'Speed & accuracy', subtitle: 'Fast and reliable' },
  ]},
  { id: 9, question: 'Ethics in media — your view:', options: [
    { id: 'strict2', icon: '⚖️', title: 'Strict ethical standards always', subtitle: 'Truth above everything' },
    { id: 'pragmatic', icon: '🔄', title: 'Pragmatic — context matters', subtitle: 'Situational ethics' },
    { id: 'audience', icon: '👥', title: 'Audience interest first', subtitle: 'Give people what they want' },
    { id: 'public', icon: '🌍', title: 'Public interest first', subtitle: 'Journalism as public service' },
    { id: 'commercial', icon: '💰', title: 'Commercial viability matters', subtitle: 'Media is a business' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'anchor2', icon: '🎤', title: 'TV anchor / correspondent', subtitle: 'Recognized face on screen' },
    { id: 'editor', icon: '📰', title: 'Senior editor / bureau chief', subtitle: 'Lead editorial team' },
    { id: 'creator', icon: '📱', title: 'Top content creator', subtitle: '1M+ subscribers' },
    { id: 'director', icon: '🎬', title: 'Film / documentary director', subtitle: 'Award-winning content' },
    { id: 'pr2', icon: '📢', title: 'PR director at major brand', subtitle: 'Shape brand narrative' },
  ]},
]

// ── Sports & Physical Education ───────────────────────────────────────────────
const SPORTS_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which sports career path interests you most?', options: [
    { id: 'athlete', icon: '🏆', title: 'Professional athlete', subtitle: 'Compete at highest level' },
    { id: 'coach', icon: '🎯', title: 'Sports coach / trainer', subtitle: 'Develop other athletes' },
    { id: 'physed', icon: '🏫', title: 'Physical education teacher', subtitle: 'School / college PE' },
    { id: 'management', icon: '📋', title: 'Sports management', subtitle: 'Events, clubs, federations' },
    { id: 'physio', icon: '🏥', title: 'Sports physiotherapy', subtitle: 'Injury prevention & rehab' },
  ]},
  { id: 2, question: 'What sport or activity are you most passionate about?', options: [
    { id: 'cricket', icon: '🏏', title: 'Cricket', subtitle: 'India\'s most loved sport' },
    { id: 'football', icon: '⚽', title: 'Football / Athletics', subtitle: 'Global sports' },
    { id: 'fitness', icon: '💪', title: 'Fitness & gym training', subtitle: 'Strength, conditioning' },
    { id: 'martial', icon: '🥋', title: 'Martial arts / Combat sports', subtitle: 'Discipline and technique' },
    { id: 'yoga', icon: '🧘', title: 'Yoga & wellness', subtitle: 'Mind-body connection' },
  ]},
  { id: 3, question: 'What motivates you most?', options: [
    { id: 'compete', icon: '🏆', title: 'Winning & competition', subtitle: 'Thrive under pressure' },
    { id: 'inspire', icon: '💛', title: 'Inspiring others', subtitle: 'Be a role model' },
    { id: 'health', icon: '💪', title: 'Promoting health & fitness', subtitle: 'Healthier India' },
    { id: 'fame2', icon: '⭐', title: 'Fame & recognition', subtitle: 'Be a sports celebrity' },
    { id: 'business2', icon: '💰', title: 'Sports business opportunity', subtitle: 'Monetize sports passion' },
  ]},
  { id: 4, question: 'Your ideal career setting:', options: [
    { id: 'national', icon: '🇮🇳', title: 'National / state team', subtitle: 'Represent India' },
    { id: 'school', icon: '🏫', title: 'School / college sports', subtitle: 'Develop young talent' },
    { id: 'academy', icon: '🏟️', title: 'Sports academy', subtitle: 'Train future champions' },
    { id: 'corporate', icon: '🏢', title: 'Corporate sports / wellness', subtitle: 'Employee fitness programs' },
    { id: 'media2', icon: '📺', title: 'Sports media / commentary', subtitle: 'Analyze and broadcast' },
  ]},
  { id: 5, question: 'Which qualification do you want?', options: [
    { id: 'bped', icon: '🎓', title: 'B.P.Ed / M.P.Ed', subtitle: 'Physical education degree' },
    { id: 'nis', icon: '🏆', title: 'NIS coaching diploma', subtitle: 'National Institute of Sports' },
    { id: 'physio2', icon: '🏥', title: 'Sports physiotherapy degree', subtitle: 'BPT / MPT' },
    { id: 'management2', icon: '📋', title: 'Sports management MBA', subtitle: 'Business of sports' },
    { id: 'nutrition', icon: '🥗', title: 'Sports nutrition certification', subtitle: 'Fuel performance' },
  ]},
  { id: 6, question: 'How do you handle defeat or setback?', options: [
    { id: 'analyze', icon: '📊', title: 'Analyze what went wrong', subtitle: 'Learn from every loss' },
    { id: 'train', icon: '💪', title: 'Train harder', subtitle: 'Outwork the competition' },
    { id: 'mental', icon: '🧠', title: 'Work on mental strength', subtitle: 'Mindset is everything' },
    { id: 'coach2', icon: '🎯', title: 'Seek coach guidance', subtitle: 'Expert feedback' },
    { id: 'rest', icon: '😌', title: 'Rest and recover', subtitle: 'Recovery is training too' },
  ]},
  { id: 7, question: 'Your biggest strength:', options: [
    { id: 'discipline', icon: '⏰', title: 'Discipline & consistency', subtitle: 'Show up every day' },
    { id: 'leadership4', icon: '👑', title: 'Leadership on field', subtitle: 'Inspire teammates' },
    { id: 'technical2', icon: '🎯', title: 'Technical skill mastery', subtitle: 'Perfect your craft' },
    { id: 'mental2', icon: '🧠', title: 'Mental toughness', subtitle: 'Perform under pressure' },
    { id: 'teaching', icon: '🤝', title: 'Teaching & coaching ability', subtitle: 'Explain and demonstrate' },
  ]},
  { id: 8, question: 'Technology in sports — your view:', options: [
    { id: 'embrace2', icon: '💻', title: 'Embrace sports analytics', subtitle: 'Data-driven performance' },
    { id: 'wearables', icon: '⌚', title: 'Wearables & fitness tech', subtitle: 'Track everything' },
    { id: 'traditional2', icon: '🏋️', title: 'Traditional training is best', subtitle: 'Fundamentals first' },
    { id: 'video2', icon: '🎬', title: 'Video analysis for improvement', subtitle: 'Watch and learn' },
    { id: 'build2', icon: '🚀', title: 'Want to build sports tech', subtitle: 'Startup in sports' },
  ]},
  { id: 9, question: 'What is your long-term vision?', options: [
    { id: 'olympian', icon: '🥇', title: 'Represent India at Olympics', subtitle: 'Ultimate athletic goal' },
    { id: 'coach3', icon: '🎯', title: 'Coach a national team', subtitle: 'Develop champions' },
    { id: 'academy2', icon: '🏟️', title: 'Start a sports academy', subtitle: 'Build future talent' },
    { id: 'media3', icon: '📺', title: 'Sports commentator / analyst', subtitle: 'Voice of the game' },
    { id: 'wellness', icon: '🧘', title: 'Wellness & fitness entrepreneur', subtitle: 'Health business' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'pro', icon: '🏆', title: 'Professional athlete', subtitle: 'Competing at top level' },
    { id: 'coach4', icon: '🎯', title: 'Certified sports coach', subtitle: 'Training athletes' },
    { id: 'teacher2', icon: '🏫', title: 'PE teacher at reputed school', subtitle: 'Shaping young athletes' },
    { id: 'manager', icon: '📋', title: 'Sports event manager', subtitle: 'Organize big events' },
    { id: 'physio3', icon: '🏥', title: 'Sports physiotherapist', subtitle: 'Keep athletes healthy' },
  ]},
]

// ── Social Work & Development ─────────────────────────────────────────────────
const SOCIAL_WORK_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which area of social work interests you most?', options: [
    { id: 'community', icon: '🏘️', title: 'Community development', subtitle: 'Grassroots change' },
    { id: 'child', icon: '👶', title: 'Child welfare & protection', subtitle: 'Rights of children' },
    { id: 'women', icon: '👩', title: 'Women empowerment', subtitle: 'Gender equality' },
    { id: 'disability', icon: '♿', title: 'Disability & inclusion', subtitle: 'Rights for all' },
    { id: 'environment2', icon: '🌿', title: 'Environmental activism', subtitle: 'Climate & sustainability' },
  ]},
  { id: 2, question: 'What kind of organization do you want to work with?', options: [
    { id: 'ngo2', icon: '❤️', title: 'NGO / Non-profit', subtitle: 'Mission-driven work' },
    { id: 'un', icon: '🌍', title: 'UN / International organizations', subtitle: 'Global development' },
    { id: 'govt3', icon: '🏛️', title: 'Government social schemes', subtitle: 'Policy implementation' },
    { id: 'csr', icon: '🏢', title: 'Corporate CSR', subtitle: 'Business with purpose' },
    { id: 'own3', icon: '🚀', title: 'Start own social enterprise', subtitle: 'Social entrepreneur' },
  ]},
  { id: 3, question: 'What motivates you most?', options: [
    { id: 'justice2', icon: '⚖️', title: 'Social justice', subtitle: 'Fight inequality' },
    { id: 'empathy5', icon: '💛', title: 'Empathy for the marginalized', subtitle: 'Give voice to the voiceless' },
    { id: 'change', icon: '🌍', title: 'Systemic change', subtitle: 'Fix root causes' },
    { id: 'community2', icon: '🏘️', title: 'Community belonging', subtitle: 'Build strong communities' },
    { id: 'policy4', icon: '📋', title: 'Policy advocacy', subtitle: 'Change laws and systems' },
  ]},
  { id: 4, question: 'How do you approach a social problem?', options: [
    { id: 'listen', icon: '👂', title: 'Listen to the community first', subtitle: 'Bottom-up approach' },
    { id: 'data3', icon: '📊', title: 'Collect data, then act', subtitle: 'Evidence-based intervention' },
    { id: 'network3', icon: '🤝', title: 'Build coalitions', subtitle: 'Strength in numbers' },
    { id: 'advocacy2', icon: '📢', title: 'Raise awareness first', subtitle: 'Public pressure for change' },
    { id: 'direct', icon: '⚡', title: 'Direct service delivery', subtitle: 'Help people immediately' },
  ]},
  { id: 5, question: 'Which qualification do you want?', options: [
    { id: 'bsw', icon: '🎓', title: 'BSW / MSW', subtitle: 'Social work degree' },
    { id: 'sociology', icon: '📚', title: 'Sociology / Anthropology', subtitle: 'Understand society' },
    { id: 'public', icon: '🏛️', title: 'Public policy / Administration', subtitle: 'Policy-level change' },
    { id: 'development', icon: '🌍', title: 'Development studies', subtitle: 'International development' },
    { id: 'law2', icon: '⚖️', title: 'Human rights law', subtitle: 'Legal advocacy' },
  ]},
  { id: 6, question: 'Your biggest strength:', options: [
    { id: 'empathy6', icon: '💛', title: 'Deep empathy', subtitle: 'Feel what others feel' },
    { id: 'communication4', icon: '🗣️', title: 'Communication & advocacy', subtitle: 'Speak for others' },
    { id: 'resilience', icon: '💪', title: 'Resilience & persistence', subtitle: 'Never give up on people' },
    { id: 'network4', icon: '🤝', title: 'Networking & coalition building', subtitle: 'Connect the right people' },
    { id: 'analytical3', icon: '📊', title: 'Analytical & research skills', subtitle: 'Understand root causes' },
  ]},
  { id: 7, question: 'What is your work style?', options: [
    { id: 'field2', icon: '🌾', title: 'Field work — on the ground', subtitle: 'Direct community contact' },
    { id: 'research5', icon: '🔬', title: 'Research & documentation', subtitle: 'Evidence for change' },
    { id: 'policy5', icon: '📋', title: 'Policy & advocacy', subtitle: 'Systemic approach' },
    { id: 'fundraising', icon: '💰', title: 'Fundraising & partnerships', subtitle: 'Resource mobilization' },
    { id: 'training', icon: '🎓', title: 'Training & capacity building', subtitle: 'Empower communities' },
  ]},
  { id: 8, question: 'How do you handle burnout in social work?', options: [
    { id: 'selfcare', icon: '🧘', title: 'Prioritize self-care', subtitle: 'You can\'t pour from empty cup' },
    { id: 'team2', icon: '👥', title: 'Lean on team support', subtitle: 'Shared burden' },
    { id: 'celebrate', icon: '🎉', title: 'Celebrate small wins', subtitle: 'Progress keeps you going' },
    { id: 'purpose', icon: '💡', title: 'Reconnect with purpose', subtitle: 'Remember why you started' },
    { id: 'boundaries', icon: '🛡️', title: 'Set clear boundaries', subtitle: 'Work-life separation' },
  ]},
  { id: 9, question: 'What change do you most want to create?', options: [
    { id: 'poverty', icon: '🏘️', title: 'Reduce poverty', subtitle: 'Economic empowerment' },
    { id: 'education2', icon: '📚', title: 'Improve education access', subtitle: 'Learning for all' },
    { id: 'health2', icon: '🏥', title: 'Better healthcare access', subtitle: 'Health equity' },
    { id: 'gender', icon: '⚖️', title: 'Gender equality', subtitle: 'Equal rights and opportunities' },
    { id: 'environment3', icon: '🌿', title: 'Environmental justice', subtitle: 'Clean planet for all' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'director', icon: '🏢', title: 'Program director at NGO', subtitle: 'Lead social programs' },
    { id: 'policy6', icon: '🏛️', title: 'Policy advisor / government', subtitle: 'Shape social policy' },
    { id: 'founder2', icon: '🚀', title: 'Founder of social enterprise', subtitle: 'Business for good' },
    { id: 'un2', icon: '🌍', title: 'UN / UNICEF / WHO officer', subtitle: 'Global development work' },
    { id: 'researcher3', icon: '🔬', title: 'Social researcher / academic', subtitle: 'Study and publish' },
  ]},
]

// ── Diploma, ITI & Vocational ─────────────────────────────────────────────────
const VOCATIONAL_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which vocational trade interests you most?', options: [
    { id: 'electrical', icon: '⚡', title: 'Electrical / Electronics', subtitle: 'Wiring, circuits, repair' },
    { id: 'mechanical', icon: '🔧', title: 'Mechanical / Auto', subtitle: 'Engines, machines, vehicles' },
    { id: 'civil', icon: '🏗️', title: 'Civil / Construction', subtitle: 'Buildings, infrastructure' },
    { id: 'it', icon: '💻', title: 'IT / Computer Hardware', subtitle: 'Tech support, networking' },
    { id: 'beauty', icon: '💄', title: 'Beauty & Wellness', subtitle: 'Salon, spa, grooming' },
  ]},
  { id: 2, question: 'What kind of work do you enjoy?', options: [
    { id: 'hands', icon: '🔧', title: 'Hands-on technical work', subtitle: 'Fix, build, repair' },
    { id: 'service', icon: '🤝', title: 'Service & customer interaction', subtitle: 'Help people directly' },
    { id: 'creative2', icon: '🎨', title: 'Creative craftsmanship', subtitle: 'Make beautiful things' },
    { id: 'outdoor', icon: '🌞', title: 'Outdoor / field work', subtitle: 'Not stuck in office' },
    { id: 'precision2', icon: '🎯', title: 'Precision & detail work', subtitle: 'Exact, careful work' },
  ]},
  { id: 3, question: 'Your career goal:', options: [
    { id: 'job', icon: '💼', title: 'Stable government / PSU job', subtitle: 'Security and benefits' },
    { id: 'private', icon: '🏭', title: 'Private sector technician', subtitle: 'Industry employment' },
    { id: 'own2', icon: '🏠', title: 'Own workshop / business', subtitle: 'Self-employed entrepreneur' },
    { id: 'abroad2', icon: '🌍', title: 'Work abroad (Gulf, Europe)', subtitle: 'International opportunities' },
    { id: 'upgrade', icon: '📚', title: 'Upgrade to degree / diploma', subtitle: 'Continue education' },
  ]},
  { id: 4, question: 'What motivates you most?', options: [
    { id: 'skill', icon: '🔧', title: 'Mastering a skill', subtitle: 'Be the best at your trade' },
    { id: 'income', icon: '💰', title: 'Good income', subtitle: 'Financial stability' },
    { id: 'respect2', icon: '🏆', title: 'Respect for your craft', subtitle: 'Skilled workers are valued' },
    { id: 'independence', icon: '🚀', title: 'Independence', subtitle: 'Be your own boss' },
    { id: 'family', icon: '🏡', title: 'Support family', subtitle: 'Provide for loved ones' },
  ]},
  { id: 5, question: 'Which certification do you want?', options: [
    { id: 'iti', icon: '🎓', title: 'ITI trade certificate', subtitle: 'Government recognized' },
    { id: 'ncvt', icon: '📋', title: 'NCVT / SCVT certification', subtitle: 'National vocational' },
    { id: 'pmkvy', icon: '🏛️', title: 'PMKVY / Skill India', subtitle: 'Government skill program' },
    { id: 'diploma', icon: '📚', title: 'Polytechnic diploma', subtitle: '3-year technical diploma' },
    { id: 'international', icon: '🌍', title: 'International trade certification', subtitle: 'Work abroad' },
  ]},
  { id: 6, question: 'How do you learn best?', options: [
    { id: 'practical', icon: '🔧', title: 'Practical training', subtitle: 'Learn by doing' },
    { id: 'apprentice', icon: '👨‍🏭', title: 'Apprenticeship', subtitle: 'Learn from a master' },
    { id: 'video3', icon: '▶️', title: 'Video tutorials', subtitle: 'Watch and replicate' },
    { id: 'classroom2', icon: '🏫', title: 'Classroom + lab', subtitle: 'Theory + practice' },
    { id: 'self', icon: '💡', title: 'Self-taught experimentation', subtitle: 'Figure it out yourself' },
  ]},
  { id: 7, question: 'Your ideal work setting:', options: [
    { id: 'factory', icon: '🏭', title: 'Factory / manufacturing plant', subtitle: 'Large-scale production' },
    { id: 'workshop', icon: '🔧', title: 'Workshop / garage', subtitle: 'Hands-on environment' },
    { id: 'site', icon: '🏗️', title: 'Construction site', subtitle: 'Build infrastructure' },
    { id: 'home', icon: '🏠', title: 'Home-based business', subtitle: 'Work from home' },
    { id: 'mobile', icon: '🚗', title: 'Mobile service (on-call)', subtitle: 'Go to customers' },
  ]},
  { id: 8, question: 'Your biggest strength:', options: [
    { id: 'technical3', icon: '🔧', title: 'Technical skill', subtitle: 'Expert in your trade' },
    { id: 'problem2', icon: '🧩', title: 'Problem-solving', subtitle: 'Fix anything' },
    { id: 'reliability', icon: '✅', title: 'Reliability & punctuality', subtitle: 'Always deliver' },
    { id: 'customer', icon: '😊', title: 'Customer service', subtitle: 'People trust you' },
    { id: 'speed2', icon: '⚡', title: 'Speed & efficiency', subtitle: 'Get it done fast' },
  ]},
  { id: 9, question: 'What is your 3-year plan?', options: [
    { id: 'master', icon: '🏆', title: 'Master my trade completely', subtitle: 'Become the best' },
    { id: 'business3', icon: '🏠', title: 'Start own business', subtitle: 'Entrepreneur' },
    { id: 'upgrade2', icon: '📚', title: 'Upgrade qualifications', subtitle: 'Diploma or degree' },
    { id: 'abroad3', icon: '🌍', title: 'Get job abroad', subtitle: 'Gulf, Europe, etc.' },
    { id: 'govt2', icon: '🏛️', title: 'Get government job', subtitle: 'Stability and security' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'supervisor', icon: '👑', title: 'Supervisor / Foreman', subtitle: 'Lead a team of workers' },
    { id: 'owner2', icon: '🏠', title: 'Owner of workshop / business', subtitle: 'Self-employed' },
    { id: 'trainer', icon: '🎓', title: 'Vocational trainer / instructor', subtitle: 'Teach your trade' },
    { id: 'engineer', icon: '🔧', title: 'Junior engineer (after diploma)', subtitle: 'Career upgrade' },
    { id: 'abroad4', icon: '🌍', title: 'Skilled worker abroad', subtitle: 'International career' },
  ]},
]

// ── Defence & Paramilitary ────────────────────────────────────────────────────
const DEFENCE_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which defence career interests you most?', options: [
    { id: 'army', icon: '🪖', title: 'Indian Army', subtitle: 'Land forces, infantry, artillery' },
    { id: 'navy', icon: '⚓', title: 'Indian Navy', subtitle: 'Maritime defence' },
    { id: 'airforce', icon: '✈️', title: 'Indian Air Force', subtitle: 'Aerial warfare, pilots' },
    { id: 'paramilitary', icon: '🛡️', title: 'Paramilitary (CRPF, BSF, CISF)', subtitle: 'Internal security' },
    { id: 'officer', icon: '⭐', title: 'Officer through NDA / CDS', subtitle: 'Commission as officer' },
  ]},
  { id: 2, question: 'What motivates you to join defence?', options: [
    { id: 'nation', icon: '🇮🇳', title: 'Serve the nation', subtitle: 'Patriotism and duty' },
    { id: 'adventure', icon: '🏔️', title: 'Adventure & challenge', subtitle: 'Thrill of service' },
    { id: 'respect3', icon: '🏆', title: 'Respect & honor', subtitle: 'Uniform commands respect' },
    { id: 'stability2', icon: '🛡️', title: 'Job security & benefits', subtitle: 'Pension, housing, perks' },
    { id: 'leadership5', icon: '👑', title: 'Leadership opportunity', subtitle: 'Lead from the front' },
  ]},
  { id: 3, question: 'Which exam are you preparing for?', options: [
    { id: 'nda', icon: '🎓', title: 'NDA (National Defence Academy)', subtitle: 'After 12th, officer route' },
    { id: 'cds', icon: '📋', title: 'CDS (Combined Defence Services)', subtitle: 'After graduation' },
    { id: 'agniveer', icon: '🪖', title: 'Agniveer / Soldier recruitment', subtitle: 'Soldier-level entry' },
    { id: 'capf', icon: '🛡️', title: 'CAPF / Paramilitary', subtitle: 'CRPF, BSF, CISF, ITBP' },
    { id: 'merchant', icon: '⚓', title: 'Merchant Navy', subtitle: 'Commercial maritime' },
  ]},
  { id: 4, question: 'What kind of role appeals to you?', options: [
    { id: 'combat', icon: '⚔️', title: 'Combat / Field operations', subtitle: 'Front-line action' },
    { id: 'technical4', icon: '🔧', title: 'Technical / Engineering corps', subtitle: 'Signals, EME, engineers' },
    { id: 'intelligence', icon: '🔍', title: 'Intelligence & strategy', subtitle: 'RAW, IB, military intel' },
    { id: 'medical2', icon: '🏥', title: 'Medical corps', subtitle: 'Army doctors, nurses' },
    { id: 'admin', icon: '📋', title: 'Administrative / Logistics', subtitle: 'Support operations' },
  ]},
  { id: 5, question: 'How do you handle pressure?', options: [
    { id: 'thrive', icon: '⚡', title: 'Thrive under pressure', subtitle: 'Best when stakes are high' },
    { id: 'calm2', icon: '😌', title: 'Stay calm and focused', subtitle: 'Composure is my strength' },
    { id: 'team3', icon: '👥', title: 'Rely on team', subtitle: 'Unit cohesion' },
    { id: 'training2', icon: '💪', title: 'Training prepares me', subtitle: 'Muscle memory kicks in' },
    { id: 'adapt', icon: '🔄', title: 'Adapt quickly', subtitle: 'Flexible in any situation' },
  ]},
  { id: 6, question: 'Your physical fitness level:', options: [
    { id: 'excellent', icon: '🏆', title: 'Excellent — I train daily', subtitle: 'Ready for selection' },
    { id: 'good', icon: '💪', title: 'Good — working to improve', subtitle: 'On the right track' },
    { id: 'average', icon: '🔄', title: 'Average — need to improve', subtitle: 'Committed to training' },
    { id: 'building', icon: '🌱', title: 'Building from scratch', subtitle: 'Starting fitness journey' },
    { id: 'technical5', icon: '🔧', title: 'Focus on technical skills', subtitle: 'Technical role preferred' },
  ]},
  { id: 7, question: 'Your biggest strength:', options: [
    { id: 'discipline2', icon: '⏰', title: 'Discipline & punctuality', subtitle: 'Never miss a commitment' },
    { id: 'leadership6', icon: '👑', title: 'Leadership & decision-making', subtitle: 'Lead in crisis' },
    { id: 'physical', icon: '💪', title: 'Physical fitness', subtitle: 'Strong and enduring' },
    { id: 'teamwork', icon: '👥', title: 'Teamwork & loyalty', subtitle: 'Unit before self' },
    { id: 'courage', icon: '🦁', title: 'Courage & bravery', subtitle: 'Face fear head-on' },
  ]},
  { id: 8, question: 'After defence service, what next?', options: [
    { id: 'continue', icon: '🪖', title: 'Full career in defence', subtitle: 'Retire as senior officer' },
    { id: 'corporate2', icon: '🏢', title: 'Corporate security / management', subtitle: 'Ex-serviceman advantage' },
    { id: 'politics', icon: '🏛️', title: 'Politics / public service', subtitle: 'Serve in another way' },
    { id: 'business4', icon: '💼', title: 'Start own business', subtitle: 'Entrepreneur after service' },
    { id: 'teaching2', icon: '🎓', title: 'Teaching / coaching defence aspirants', subtitle: 'Give back' },
  ]},
  { id: 9, question: 'What is your view on discipline?', options: [
    { id: 'essential2', icon: '⏰', title: 'Discipline is everything', subtitle: 'Foundation of success' },
    { id: 'balance2', icon: '⚖️', title: 'Balance discipline with flexibility', subtitle: 'Adapt when needed' },
    { id: 'team4', icon: '👥', title: 'Team discipline over individual', subtitle: 'Unit cohesion first' },
    { id: 'self2', icon: '🧠', title: 'Self-discipline is key', subtitle: 'Internal motivation' },
    { id: 'mission', icon: '🎯', title: 'Mission-focused discipline', subtitle: 'Discipline serves the goal' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'officer2', icon: '⭐', title: 'Commissioned officer', subtitle: 'Lieutenant / Captain' },
    { id: 'jco', icon: '🪖', title: 'JCO / Senior NCO', subtitle: 'Experienced soldier' },
    { id: 'pilot', icon: '✈️', title: 'IAF pilot', subtitle: 'Fly for India' },
    { id: 'paramilitary2', icon: '🛡️', title: 'Paramilitary officer', subtitle: 'CRPF / BSF inspector' },
    { id: 'merchant2', icon: '⚓', title: 'Merchant Navy officer', subtitle: 'Maritime career' },
  ]},
]

// ── Civil Services & Government Jobs ─────────────────────────────────────────
const CIVIL_SERVICES_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which government career interests you most?', options: [
    { id: 'ias', icon: '🏛️', title: 'IAS / IPS / IFS (UPSC)', subtitle: 'Top civil services' },
    { id: 'state', icon: '🏢', title: 'State PCS / SDM / BDO', subtitle: 'State civil services' },
    { id: 'banking', icon: '🏦', title: 'Banking (IBPS / SBI / RBI)', subtitle: 'Public sector banks' },
    { id: 'ssc', icon: '📋', title: 'SSC / Railway / Defence civilian', subtitle: 'Central government jobs' },
    { id: 'psu', icon: '🏭', title: 'PSU (ONGC, BHEL, NTPC)', subtitle: 'Public sector enterprises' },
  ]},
  { id: 2, question: 'What motivates you to pursue government service?', options: [
    { id: 'serve', icon: '🇮🇳', title: 'Serve the nation', subtitle: 'Public service is my calling' },
    { id: 'stability3', icon: '🛡️', title: 'Job security & stability', subtitle: 'Pension, benefits, security' },
    { id: 'power2', icon: '👑', title: 'Power & influence', subtitle: 'Shape policy and decisions' },
    { id: 'respect4', icon: '🏆', title: 'Social respect', subtitle: 'Government jobs are respected' },
    { id: 'family2', icon: '🏡', title: 'Family expectation', subtitle: 'Sarkari naukri is the goal' },
  ]},
  { id: 3, question: 'Which exam are you preparing for?', options: [
    { id: 'upsc', icon: '🎓', title: 'UPSC CSE', subtitle: 'IAS, IPS, IFS' },
    { id: 'pcs', icon: '🏢', title: 'State PCS', subtitle: 'UPPSC, MPPSC, BPSC etc.' },
    { id: 'ibps', icon: '🏦', title: 'IBPS / SBI PO / Clerk', subtitle: 'Banking exams' },
    { id: 'ssc2', icon: '📋', title: 'SSC CGL / CHSL / MTS', subtitle: 'Central government' },
    { id: 'railway', icon: '🚂', title: 'Railway / RRB exams', subtitle: 'Indian Railways' },
  ]},
  { id: 4, question: 'How do you approach exam preparation?', options: [
    { id: 'structured', icon: '📋', title: 'Structured study plan', subtitle: 'Timetable and discipline' },
    { id: 'coaching', icon: '🎓', title: 'Coaching institute', subtitle: 'Guided preparation' },
    { id: 'self3', icon: '📚', title: 'Self-study with books', subtitle: 'Independent learner' },
    { id: 'online', icon: '💻', title: 'Online resources & tests', subtitle: 'Digital preparation' },
    { id: 'group', icon: '👥', title: 'Study group', subtitle: 'Learn with peers' },
  ]},
  { id: 5, question: 'What kind of government work appeals to you?', options: [
    { id: 'admin2', icon: '🏛️', title: 'District administration', subtitle: 'DM, SDM, collector' },
    { id: 'police', icon: '👮', title: 'Police & law enforcement', subtitle: 'IPS, DSP, inspector' },
    { id: 'revenue', icon: '💰', title: 'Revenue & taxation', subtitle: 'IRS, income tax' },
    { id: 'foreign', icon: '🌍', title: 'Foreign service', subtitle: 'IFS, diplomacy' },
    { id: 'audit', icon: '📊', title: 'Audit & accounts', subtitle: 'IAAS, finance' },
  ]},
  { id: 6, question: 'Your biggest strength for civil services:', options: [
    { id: 'gk', icon: '📚', title: 'General knowledge & current affairs', subtitle: 'Always updated' },
    { id: 'writing3', icon: '✍️', title: 'Essay & answer writing', subtitle: 'Clear, structured writing' },
    { id: 'analytical4', icon: '🧠', title: 'Analytical thinking', subtitle: 'Understand complex issues' },
    { id: 'communication5', icon: '🗣️', title: 'Communication & interview skills', subtitle: 'Confident speaker' },
    { id: 'persistence', icon: '💪', title: 'Persistence & hard work', subtitle: 'Never give up' },
  ]},
  { id: 7, question: 'How many attempts are you willing to give?', options: [
    { id: 'one', icon: '🎯', title: 'Give it my all in 1-2 attempts', subtitle: 'Focused, all-in' },
    { id: 'three', icon: '🔄', title: '3-4 attempts if needed', subtitle: 'Persistent approach' },
    { id: 'max', icon: '💪', title: 'Maximum attempts allowed', subtitle: 'Never give up' },
    { id: 'parallel', icon: '⚖️', title: 'Prepare for multiple exams', subtitle: 'Backup options' },
    { id: 'flexible', icon: '🌱', title: 'Flexible — see how it goes', subtitle: 'Adaptive strategy' },
  ]},
  { id: 8, question: 'What is your backup plan?', options: [
    { id: 'state2', icon: '🏢', title: 'State services if not UPSC', subtitle: 'Still government job' },
    { id: 'banking2', icon: '🏦', title: 'Banking / SSC as backup', subtitle: 'Secure government job' },
    { id: 'private2', icon: '💼', title: 'Private sector job meanwhile', subtitle: 'Earn while preparing' },
    { id: 'teaching3', icon: '🎓', title: 'Teaching / coaching', subtitle: 'Share knowledge' },
    { id: 'none', icon: '🎯', title: 'No backup — only civil services', subtitle: 'Full commitment' },
  ]},
  { id: 9, question: 'Your daily study hours:', options: [
    { id: 'ten', icon: '⏰', title: '10+ hours daily', subtitle: 'Full-time preparation' },
    { id: 'eight', icon: '📚', title: '6-8 hours daily', subtitle: 'Serious preparation' },
    { id: 'four', icon: '🔄', title: '4-6 hours (with job/college)', subtitle: 'Balanced approach' },
    { id: 'two', icon: '🌱', title: '2-4 hours (starting out)', subtitle: 'Building momentum' },
    { id: 'smart', icon: '💡', title: 'Quality over quantity', subtitle: 'Smart study approach' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'ias2', icon: '🏛️', title: 'IAS / IPS officer', subtitle: 'Serving at district level' },
    { id: 'bank', icon: '🏦', title: 'Bank PO / Manager', subtitle: 'Banking career' },
    { id: 'ssc3', icon: '📋', title: 'Central government officer', subtitle: 'SSC / Railway job' },
    { id: 'psu2', icon: '🏭', title: 'PSU executive', subtitle: 'ONGC, BHEL, NTPC' },
    { id: 'state3', icon: '🏢', title: 'State government officer', subtitle: 'PCS / SDM' },
  ]},
]

// ── Fine Arts & Performing Arts ───────────────────────────────────────────────
const FINE_ARTS_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which art form are you most passionate about?', options: [
    { id: 'painting', icon: '🎨', title: 'Painting & Visual Arts', subtitle: 'Canvas, colors, expression' },
    { id: 'music', icon: '🎵', title: 'Music (vocal / instrumental)', subtitle: 'Melody, rhythm, harmony' },
    { id: 'dance', icon: '💃', title: 'Dance & Choreography', subtitle: 'Classical, contemporary, folk' },
    { id: 'theatre', icon: '🎭', title: 'Theatre & Drama', subtitle: 'Stage performance, acting' },
    { id: 'sculpture', icon: '🗿', title: 'Sculpture & Craft', subtitle: '3D art, pottery, installation' },
  ]},
  { id: 2, question: 'What kind of career do you want in arts?', options: [
    { id: 'performer', icon: '⭐', title: 'Professional performer', subtitle: 'Stage, screen, concerts' },
    { id: 'teacher2', icon: '🎓', title: 'Arts teacher / guru', subtitle: 'Pass on the tradition' },
    { id: 'commercial', icon: '💰', title: 'Commercial artist', subtitle: 'Ads, films, media' },
    { id: 'curator', icon: '🏛️', title: 'Curator / Art director', subtitle: 'Galleries, museums' },
    { id: 'own2', icon: '🚀', title: 'Independent artist', subtitle: 'Build your own brand' },
  ]},
  { id: 3, question: 'What motivates you most?', options: [
    { id: 'expression2', icon: '🎨', title: 'Creative expression', subtitle: 'Art is my language' },
    { id: 'tradition', icon: '🏛️', title: 'Preserve cultural heritage', subtitle: 'Keep traditions alive' },
    { id: 'fame3', icon: '⭐', title: 'Fame & recognition', subtitle: 'Be a celebrated artist' },
    { id: 'income2', icon: '💰', title: 'Monetize your art', subtitle: 'Make a living from passion' },
    { id: 'impact3', icon: '🌍', title: 'Social impact through art', subtitle: 'Art as activism' },
  ]},
  { id: 4, question: 'Your ideal performance / exhibition setting:', options: [
    { id: 'stage', icon: '🎭', title: 'Live stage performance', subtitle: 'Theatre, concerts, recitals' },
    { id: 'gallery', icon: '🏛️', title: 'Art gallery / museum', subtitle: 'Visual art exhibitions' },
    { id: 'digital2', icon: '📱', title: 'Digital / online platforms', subtitle: 'YouTube, Instagram, NFTs' },
    { id: 'film3', icon: '🎬', title: 'Film / OTT / TV', subtitle: 'Screen performance' },
    { id: 'street', icon: '🌍', title: 'Street art / public spaces', subtitle: 'Art for everyone' },
  ]},
  { id: 5, question: 'Which qualification do you want?', options: [
    { id: 'bfa', icon: '🎓', title: 'BFA / MFA (Fine Arts)', subtitle: 'Formal arts education' },
    { id: 'music2', icon: '🎵', title: 'Music degree / diploma', subtitle: 'Classical or contemporary' },
    { id: 'nsd', icon: '🎭', title: 'NSD / Drama school', subtitle: 'National School of Drama' },
    { id: 'dance2', icon: '💃', title: 'Dance academy certification', subtitle: 'Kathak, Bharatnatyam, etc.' },
    { id: 'self4', icon: '💡', title: 'Self-taught + portfolio', subtitle: 'Work speaks for itself' },
  ]},
  { id: 6, question: 'How do you handle creative blocks?', options: [
    { id: 'explore', icon: '🌍', title: 'Explore new experiences', subtitle: 'Travel, meet people' },
    { id: 'practice', icon: '🔄', title: 'Keep practicing anyway', subtitle: 'Discipline over inspiration' },
    { id: 'collaborate2', icon: '👥', title: 'Collaborate with other artists', subtitle: 'Cross-pollinate ideas' },
    { id: 'nature2', icon: '🌿', title: 'Spend time in nature', subtitle: 'Reset and recharge' },
    { id: 'consume', icon: '📚', title: 'Consume other art', subtitle: 'Get inspired by others' },
  ]},
  { id: 7, question: 'Your biggest strength as an artist:', options: [
    { id: 'originality', icon: '💡', title: 'Originality & unique voice', subtitle: 'Unmistakably you' },
    { id: 'technique', icon: '🎯', title: 'Technical mastery', subtitle: 'Perfect your craft' },
    { id: 'emotion', icon: '💛', title: 'Emotional depth', subtitle: 'Move your audience' },
    { id: 'versatility', icon: '🔄', title: 'Versatility', subtitle: 'Many styles, many forms' },
    { id: 'discipline3', icon: '⏰', title: 'Discipline & consistency', subtitle: 'Create every day' },
  ]},
  { id: 8, question: 'How do you monetize your art?', options: [
    { id: 'sell', icon: '💰', title: 'Sell original works', subtitle: 'Paintings, sculptures, crafts' },
    { id: 'perform', icon: '🎭', title: 'Performance fees', subtitle: 'Concerts, shows, events' },
    { id: 'teach2', icon: '🎓', title: 'Teach art / music / dance', subtitle: 'Classes and workshops' },
    { id: 'commission', icon: '🏢', title: 'Commercial commissions', subtitle: 'Ads, films, brands' },
    { id: 'digital3', icon: '📱', title: 'Digital content & NFTs', subtitle: 'Online art economy' },
  ]},
  { id: 9, question: 'What is your long-term vision?', options: [
    { id: 'national', icon: '🏆', title: 'National award-winning artist', subtitle: 'Padma Shri, Sangeet Natak' },
    { id: 'international2', icon: '🌍', title: 'International recognition', subtitle: 'Perform / exhibit globally' },
    { id: 'school', icon: '🏫', title: 'Start own art school', subtitle: 'Build next generation' },
    { id: 'brand', icon: '⭐', title: 'Build a personal brand', subtitle: 'Known name in your field' },
    { id: 'preserve', icon: '🏛️', title: 'Preserve classical art forms', subtitle: 'Cultural heritage keeper' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'performer2', icon: '⭐', title: 'Established performer', subtitle: 'Regular shows and gigs' },
    { id: 'teacher3', icon: '🎓', title: 'Respected arts teacher', subtitle: 'Guru with many students' },
    { id: 'commercial2', icon: '🎬', title: 'Commercial artist in media', subtitle: 'Films, ads, OTT' },
    { id: 'gallery2', icon: '🏛️', title: 'Gallery artist / curator', subtitle: 'Art world recognition' },
    { id: 'creator2', icon: '📱', title: 'Digital arts creator', subtitle: 'Online audience' },
  ]},
]

// ── Paramedical & Allied Health ───────────────────────────────────────────────
const PARAMEDICAL_QUESTIONS: DNAQuestion[] = [
  { id: 1, question: 'Which paramedical field interests you most?', options: [
    { id: 'physio', icon: '🏃', title: 'Physiotherapy', subtitle: 'Rehabilitation, movement' },
    { id: 'lab', icon: '🔬', title: 'Medical Lab Technology', subtitle: 'Diagnostics, testing' },
    { id: 'radiology', icon: '🩻', title: 'Radiology / Imaging', subtitle: 'X-ray, MRI, CT scan' },
    { id: 'nursing', icon: '💉', title: 'Nursing', subtitle: 'Patient care, bedside' },
    { id: 'optometry', icon: '👁️', title: 'Optometry / Audiology', subtitle: 'Vision and hearing care' },
  ]},
  { id: 2, question: 'What kind of healthcare work appeals to you?', options: [
    { id: 'direct', icon: '🤝', title: 'Direct patient care', subtitle: 'Hands-on with patients' },
    { id: 'diagnostic', icon: '🔬', title: 'Diagnostic & lab work', subtitle: 'Behind-the-scenes testing' },
    { id: 'emergency', icon: '🚑', title: 'Emergency & critical care', subtitle: 'High-pressure, life-saving' },
    { id: 'community3', icon: '🏘️', title: 'Community health', subtitle: 'Public health programs' },
    { id: 'research6', icon: '📊', title: 'Healthcare research', subtitle: 'Clinical trials, studies' },
  ]},
  { id: 3, question: 'What motivates you most?', options: [
    { id: 'save', icon: '❤️', title: 'Saving and healing lives', subtitle: 'Direct patient impact' },
    { id: 'science2', icon: '🔬', title: 'Medical science & technology', subtitle: 'Cutting-edge healthcare' },
    { id: 'stability4', icon: '🛡️', title: 'Job security', subtitle: 'Healthcare always in demand' },
    { id: 'respect5', icon: '🏆', title: 'Respect & trust', subtitle: 'Patients trust you' },
    { id: 'growth', icon: '📈', title: 'Career growth', subtitle: 'Specialize and advance' },
  ]},
  { id: 4, question: 'Your ideal work setting:', options: [
    { id: 'hospital', icon: '🏥', title: 'Hospital / clinic', subtitle: 'Acute care setting' },
    { id: 'rehab', icon: '🏃', title: 'Rehabilitation center', subtitle: 'Recovery and therapy' },
    { id: 'community4', icon: '🏘️', title: 'Community health center', subtitle: 'Primary healthcare' },
    { id: 'corporate2', icon: '🏢', title: 'Corporate wellness', subtitle: 'Employee health programs' },
    { id: 'own2', icon: '🏠', title: 'Own clinic / practice', subtitle: 'Independent practitioner' },
  ]},
  { id: 5, question: 'Which qualification do you want?', options: [
    { id: 'bpt', icon: '🎓', title: 'BPT / MPT (Physiotherapy)', subtitle: 'Physical therapy degree' },
    { id: 'bmlt', icon: '🔬', title: 'BMLT / DMLT (Lab Tech)', subtitle: 'Medical lab technology' },
    { id: 'bsc_nursing', icon: '💉', title: 'B.Sc Nursing / GNM', subtitle: 'Nursing degree' },
    { id: 'bsc_radiology', icon: '🩻', title: 'B.Sc Radiology / Imaging', subtitle: 'Diagnostic imaging' },
    { id: 'boptom', icon: '👁️', title: 'B.Optom / Audiology', subtitle: 'Vision / hearing care' },
  ]},
  { id: 6, question: 'How do you handle a medical emergency?', options: [
    { id: 'protocol', icon: '📋', title: 'Follow protocol strictly', subtitle: 'Training kicks in' },
    { id: 'calm3', icon: '😌', title: 'Stay calm, assess first', subtitle: 'Composure saves lives' },
    { id: 'team5', icon: '👥', title: 'Call the team immediately', subtitle: 'Teamwork in crisis' },
    { id: 'act', icon: '⚡', title: 'Act fast, think later', subtitle: 'Speed is critical' },
    { id: 'communicate', icon: '🗣️', title: 'Communicate clearly', subtitle: 'Coordinate the response' },
  ]},
  { id: 7, question: 'Your biggest strength:', options: [
    { id: 'empathy7', icon: '💛', title: 'Empathy & compassion', subtitle: 'Patients feel cared for' },
    { id: 'technical6', icon: '🔧', title: 'Technical skill', subtitle: 'Expert in your procedure' },
    { id: 'attention3', icon: '🎯', title: 'Attention to detail', subtitle: 'Nothing is missed' },
    { id: 'calm4', icon: '😌', title: 'Calm under pressure', subtitle: 'Steady in emergencies' },
    { id: 'communication6', icon: '🗣️', title: 'Patient communication', subtitle: 'Explain clearly, reassure' },
  ]},
  { id: 8, question: 'Technology in healthcare — your view:', options: [
    { id: 'embrace3', icon: '💻', title: 'Embrace health tech fully', subtitle: 'AI diagnostics, telemedicine' },
    { id: 'tool2', icon: '🔧', title: 'Tech as a tool', subtitle: 'Supports but doesn\'t replace' },
    { id: 'learn', icon: '📚', title: 'Want to learn health tech', subtitle: 'Future of healthcare' },
    { id: 'skeptical2', icon: '🤔', title: 'Skeptical — human touch first', subtitle: 'Care can\'t be automated' },
    { id: 'build3', icon: '🚀', title: 'Want to build health tech', subtitle: 'Startup in healthcare' },
  ]},
  { id: 9, question: 'Where do you want to work?', options: [
    { id: 'aiims', icon: '🏥', title: 'AIIMS / Top government hospital', subtitle: 'Premier healthcare' },
    { id: 'private2', icon: '🏢', title: 'Private hospital / chain', subtitle: 'Apollo, Fortis, Max' },
    { id: 'abroad3', icon: '🌍', title: 'Abroad (UK, Canada, Gulf)', subtitle: 'International healthcare' },
    { id: 'ngo2', icon: '❤️', title: 'NGO / Rural health', subtitle: 'Underserved communities' },
    { id: 'own3', icon: '🏠', title: 'Own clinic / diagnostic center', subtitle: 'Entrepreneur' },
  ]},
  { id: 10, question: 'In 5 years, you want to be:', options: [
    { id: 'senior', icon: '🏆', title: 'Senior therapist / technician', subtitle: 'Expert in your field' },
    { id: 'specialist', icon: '🎓', title: 'Specialist with PG degree', subtitle: 'Advanced qualification' },
    { id: 'own4', icon: '🏠', title: 'Own clinic / practice', subtitle: 'Independent practitioner' },
    { id: 'abroad4', icon: '🌍', title: 'Working abroad', subtitle: 'International career' },
    { id: 'researcher4', icon: '🔬', title: 'Clinical researcher', subtitle: 'Contribute to medical science' },
  ]},
]

// ── Field mapping ─────────────────────────────────────────────────────────────
export const QUESTIONS_BY_FIELD: Record<string, DNAQuestion[]> = {
  'Engineering & Technology': ENGINEERING_QUESTIONS,
  'Medical & Health Sciences': MEDICAL_QUESTIONS,
  'Commerce & Business': COMMERCE_QUESTIONS,
  'Arts & Humanities': ARTS_QUESTIONS,
  'Pure Science': SCIENCE_QUESTIONS,
  'Law & Legal Studies': LAW_QUESTIONS,
  'Education & Teaching': EDUCATION_QUESTIONS,
  'Design & Creative Arts': DESIGN_QUESTIONS,
  'Hotel Management & Hospitality': HOTEL_QUESTIONS,
  'Agriculture & Allied Sciences': AGRICULTURE_QUESTIONS,
  'Mass Communication & Media': MEDIA_QUESTIONS,
  'Sports & Physical Education': SPORTS_QUESTIONS,
  'Social Work & Development': SOCIAL_WORK_QUESTIONS,
  'Diploma, ITI & Vocational': VOCATIONAL_QUESTIONS,
  'Defence & Paramilitary': DEFENCE_QUESTIONS,
  'Civil Services & Government Jobs': CIVIL_SERVICES_QUESTIONS,
  'Fine Arts & Performing Arts': FINE_ARTS_QUESTIONS,
  'Paramedical & Allied Health': PARAMEDICAL_QUESTIONS,
  'default': DEFAULT_QUESTIONS,
}

// Fuzzy field matcher — maps profile.field_of_study to a question set key
export function getQuestionsForField(field: string): DNAQuestion[] {
  if (!field) return DEFAULT_QUESTIONS
  const f = field.toLowerCase()

  if (f.includes('engineer') || f.includes('tech') || f.includes('cse') || f.includes('it') ||
      f.includes('computer') || f.includes('software') || f.includes('btech') || f.includes('b.tech') ||
      f.includes('ece') || f.includes('eee') || f.includes('mechanical') || f.includes('civil') ||
      f.includes('electrical') || f.includes('electronics') || f.includes('information technology'))
    return ENGINEERING_QUESTIONS

  if (f.includes('medical') || f.includes('mbbs') || f.includes('health') || f.includes('pharma') ||
      f.includes('nursing') || f.includes('bds') || f.includes('ayurved') || f.includes('bpharm') ||
      f.includes('medicine') || f.includes('surgery'))
    return MEDICAL_QUESTIONS

  if (f.includes('commerce') || f.includes('bba') || f.includes('mba') || f.includes('ca') ||
      f.includes('finance') || f.includes('accounting') || f.includes('bcom') || f.includes('b.com') ||
      f.includes('economics') || f.includes('business') || f.includes('management'))
    return COMMERCE_QUESTIONS

  if (f.includes('arts') || f.includes('humanities') || f.includes('ba ') || f.includes('b.a') ||
      f.includes('literature') || f.includes('history') || f.includes('philosophy') ||
      f.includes('sociology') || f.includes('psychology') || f.includes('political science'))
    return ARTS_QUESTIONS

  if (f.includes('science') || f.includes('bsc') || f.includes('b.sc') || f.includes('physics') ||
      f.includes('chemistry') || f.includes('biology') || f.includes('mathematics') ||
      f.includes('botany') || f.includes('zoology') || f.includes('statistics'))
    return SCIENCE_QUESTIONS

  if (f.includes('law') || f.includes('legal') || f.includes('llb') || f.includes('l.l.b') ||
      f.includes('llm') || f.includes('jurisprudence'))
    return LAW_QUESTIONS

  if (f.includes('education') || f.includes('teaching') || f.includes('b.ed') || f.includes('bed') ||
      f.includes('m.ed') || f.includes('teacher') || f.includes('pedagogy'))
    return EDUCATION_QUESTIONS

  if (f.includes('design') || f.includes('fashion') || f.includes('graphic') || f.includes('interior') ||
      f.includes('product design') || f.includes('ui') || f.includes('ux') || f.includes('bdes') ||
      f.includes('visual communication'))
    return DESIGN_QUESTIONS

  if (f.includes('hotel') || f.includes('hospitality') || f.includes('tourism') || f.includes('catering') ||
      f.includes('culinary') || f.includes('bhmct') || f.includes('ihmct'))
    return HOTEL_QUESTIONS

  if (f.includes('agriculture') || f.includes('agri') || f.includes('horticulture') ||
      f.includes('veterinary') || f.includes('animal husbandry') || f.includes('food technology') ||
      f.includes('bsc agri') || f.includes('forestry'))
    return AGRICULTURE_QUESTIONS

  if (f.includes('mass comm') || f.includes('journalism') || f.includes('media') ||
      f.includes('communication') || f.includes('bjmc') || f.includes('mjmc') ||
      f.includes('public relations') || f.includes('advertising') || f.includes('film'))
    return MEDIA_QUESTIONS

  if (f.includes('sports') || f.includes('physical education') || f.includes('bped') ||
      f.includes('b.p.ed') || f.includes('fitness') || f.includes('coaching'))
    return SPORTS_QUESTIONS

  if (f.includes('social work') || f.includes('bsw') || f.includes('msw') ||
      f.includes('development studies') || f.includes('ngo') || f.includes('community'))
    return SOCIAL_WORK_QUESTIONS

  if (f.includes('diploma') || f.includes('iti') || f.includes('vocational') ||
      f.includes('polytechnic') || f.includes('trade') || f.includes('skill'))
    return VOCATIONAL_QUESTIONS

  if (f.includes('defence') || f.includes('military') || f.includes('nda') || f.includes('army') ||
      f.includes('navy') || f.includes('air force') || f.includes('paramilitary') ||
      f.includes('crpf') || f.includes('bsf') || f.includes('merchant navy'))
    return DEFENCE_QUESTIONS

  if (f.includes('civil service') || f.includes('upsc') || f.includes('ias') || f.includes('ips') ||
      f.includes('government') || f.includes('ssc') || f.includes('banking') || f.includes('psc'))
    return CIVIL_SERVICES_QUESTIONS

  if (f.includes('fine art') || f.includes('performing art') || f.includes('music') ||
      f.includes('dance') || f.includes('theatre') || f.includes('drama') ||
      f.includes('bfa') || f.includes('painting') || f.includes('sculpture'))
    return FINE_ARTS_QUESTIONS

  if (f.includes('paramedical') || f.includes('physiotherapy') || f.includes('bpt') ||
      f.includes('radiology') || f.includes('lab tech') || f.includes('mllt') ||
      f.includes('optometry') || f.includes('audiology') || f.includes('allied health'))
    return PARAMEDICAL_QUESTIONS

  return DEFAULT_QUESTIONS
}

export function getFieldLabel(field: string): string {
  if (!field) return 'General'
  const f = field.toLowerCase()
  if (f.includes('engineer') || f.includes('tech') || f.includes('cse') || f.includes('computer')) return 'Engineering & Technology'
  if (f.includes('medical') || f.includes('mbbs') || f.includes('health') || f.includes('pharma')) return 'Medical & Health Sciences'
  if (f.includes('commerce') || f.includes('bba') || f.includes('mba') || f.includes('finance') || f.includes('bcom')) return 'Commerce & Business'
  if (f.includes('arts') || f.includes('humanities') || f.includes('literature') || f.includes('history')) return 'Arts & Humanities'
  if (f.includes('science') || f.includes('bsc') || f.includes('physics') || f.includes('chemistry')) return 'Pure Science'
  if (f.includes('law') || f.includes('legal') || f.includes('llb')) return 'Law & Legal Studies'
  if (f.includes('education') || f.includes('teaching') || f.includes('b.ed')) return 'Education & Teaching'
  if (f.includes('design') || f.includes('fashion') || f.includes('graphic')) return 'Design & Creative Arts'
  if (f.includes('hotel') || f.includes('hospitality') || f.includes('tourism')) return 'Hotel Management & Hospitality'
  if (f.includes('agriculture') || f.includes('agri') || f.includes('horticulture')) return 'Agriculture & Allied Sciences'
  if (f.includes('mass comm') || f.includes('journalism') || f.includes('media')) return 'Mass Communication & Media'
  if (f.includes('sports') || f.includes('physical education')) return 'Sports & Physical Education'
  if (f.includes('social work') || f.includes('bsw')) return 'Social Work & Development'
  if (f.includes('diploma') || f.includes('iti') || f.includes('vocational')) return 'Diploma, ITI & Vocational'
  if (f.includes('defence') || f.includes('military') || f.includes('nda')) return 'Defence & Paramilitary'
  if (f.includes('civil service') || f.includes('upsc') || f.includes('government')) return 'Civil Services & Government Jobs'
  if (f.includes('fine art') || f.includes('music') || f.includes('dance') || f.includes('theatre')) return 'Fine Arts & Performing Arts'
  if (f.includes('paramedical') || f.includes('physiotherapy') || f.includes('radiology')) return 'Paramedical & Allied Health'
  return field
}
