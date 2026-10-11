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

export default api
