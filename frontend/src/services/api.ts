import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_URL = RAW_API_URL.endsWith('/api') 
  ? RAW_API_URL 
  : `${RAW_API_URL.replace(/\/$/, '')}/api`

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
}

// Profile APIs
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data: any) => api.put('/profile', data),
  addSkill: (skill: any) => api.post('/profile/skills', skill),
  removeSkill: (skillId: string) => api.delete(`/profile/skills/${skillId}`),
  addProject: (project: any) => api.post('/profile/projects', project),
}

// Career DNA APIs
export const careerAPI = {
  getAssessment: () => api.get('/career/assessment'),
  submitAssessment: (answers: any) => api.post('/career/assessment', { answers }),
  getCareerDNA: () => api.get('/career/dna'),
  getCareerPaths: () => api.get('/career/paths'),
}

// Skill Gap APIs
export const skillGapAPI = {
  analyze: (data: { target_role: string; current_skills?: string; stream?: string }) =>
    api.post('/skill-gap/analyze', data),
  getLast: () => api.get('/skill-gap/last'),
  completeSkill: (skill_name: string) => api.post('/skill-gap/complete-skill', { skill_name }),
  getCompletedSkills: () => api.get('/skill-gap/completed-skills'),
  generateTest: (target_role: string) => api.post('/skill-gap/generate-test', { target_role }),
}

// Resume AI APIs
export const resumeAPI = {
  getAIBullets: (data: { role: string; company?: string; context?: string }) =>
    api.post('/resume/ai-bullets', data),
}

// Resume Data (save/load) APIs
export const resumeDataAPI = {
  load: () => api.get('/resume-data'),
  save: (data: { resumeData: any; template?: string }) => api.post('/resume-data', data),
}

// Notifications APIs
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id?: number, all?: boolean) => api.post('/notifications/mark-read', { id, all }),
  delete: (id: number) => api.delete(`/notifications/${id}`),
}

// Job APIs
export const jobAPI = {
  getJobs: (filters?: any) => api.get('/jobs', { params: filters }),
  getJobById: (id: string) => api.get(`/jobs/${id}`),
  getMatchedJobs: () => api.get('/jobs/matched'),
  applyJob: (jobId: string, jobData?: any) => api.post(`/jobs/${jobId}/apply`, jobData || {}),
}

// Application APIs
export const applicationAPI = {
  getApplications: () => api.get('/applications'),
  getApplicationById: (id: string) => api.get(`/applications/${id}`),
  addApplication: (data: any) => api.post('/applications', data),
  getStats: () => api.get('/applications/stats'),
  updateStatus: (id: string, status: string) =>
    api.put(`/applications/${id}/status`, { status }),
  addNotes: (id: string, notes: string) =>
    api.put(`/applications/${id}/notes`, { notes }),
}

// MCQ Test APIs
export const mcqAPI = {
  generate: (data: { role: string; topic?: string; difficulty?: string; count?: number }) =>
    api.post('/mcq/generate', data),
  submit: (data: { role: string; topic?: string; difficulty?: string; questions: any[]; userAnswers: Record<number, string>; timeTaken?: number }) =>
    api.post('/mcq/submit', data),
  getHistory: () => api.get('/mcq/history'),
  getResult: (id: number) => api.get(`/mcq/${id}`),
}

// Mock Interview APIs
export const interviewAPI = {
  generate: (data: { role: string; category: string; difficulty?: string }) =>
    api.post('/interview/generate', data),
  evaluate: (data: { sessionId: number; questionId: number; question: string; answer: string; role: string }) =>
    api.post('/interview/evaluate', data),
  complete: (sessionId: number) => api.post(`/interview/complete/${sessionId}`, {}),
  getHistory: () => api.get('/interview/history'),
  getSession: (id: number) => api.get(`/interview/${id}`),
}

// Roadmap APIs
export const roadmapAPI = {
  generate: (targetRole: string) => api.post('/roadmap/generate', { target_role: targetRole }),
  toggleMilestone: (roadmapId: number, milestoneId: string) =>
    api.post('/roadmap/milestone', { roadmapId, milestoneId }),
  getMyRoadmaps: () => api.get('/roadmap/my'),
  getRoadmap: (id: number) => api.get(`/roadmap/${id}`),
}

// Tools APIs
export const toolsAPI = {
  atsScan: (resumeText: string, jobDescription: string) =>
    api.post('/tools/ats-scan', { resumeText, jobDescription }),
  salary: (data: { role: string; location?: string; experience?: string }) =>
    api.post('/tools/salary', data),
  companyPrep: (data: { company: string; role: string }) =>
    api.post('/tools/company-prep', data),
  outreach: (data: { type: string; role: string; company?: string; recipientRole?: string; tone?: string; userContext?: string }) =>
    api.post('/tools/outreach', data),
  githubAnalyze: (username: string) =>
    api.post('/tools/github-analyze', { username }),
}

export default api
