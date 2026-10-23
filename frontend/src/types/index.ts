export interface User {
  id: string
  name: string
  email: string
  college?: string
  graduationYear?: number
  profileComplete: boolean
}

export interface Profile {
  userId: string
  academicDetails: {
    degree: string
    branch: string
    cgpa: number
    college: string
    graduationYear: number
  }
  skills: Skill[]
  projects: Project[]
  experience: Experience[]
  interests: string[]
  location: string
  profileStrength: number
}

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
  verified: boolean
}

export interface Project {
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
}

export interface Experience {
  company: string
  role: string
  duration: string
  description: string
}

export interface CareerPath {
  title: string
  matchPercentage: number
  salaryRange: { min: number; max: number }
  growthPotential: string
  requiredSkills: string[]
  description: string
}

export interface SkillGap {
  skillName: string
  priority: 'critical' | 'important' | 'nice-to-have'
  estimatedHours: number
  resources: LearningResource[]
}

export interface LearningResource {
  title: string
  type: 'video' | 'article' | 'course' | 'documentation'
  url: string
  duration?: string
  free: boolean
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salaryRange: { min: number; max: number }
  requiredSkills: string[]
  experienceLevel: string
  jobType: 'full-time' | 'internship' | 'contract'
  description: string
  postedDate: Date
  matchScore?: number
}

export interface Application {
  id: string
  jobId: string
  job: Job
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'accepted'
  appliedDate: Date
  lastUpdated: Date
  notes?: string
}
