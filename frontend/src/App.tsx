import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Features from './pages/Features'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import CareerDNA from './pages/CareerDNA'
import SkillGap from './pages/SkillGap'
import Jobs from './pages/Jobs'
import Applications from './pages/Applications'
import ResumeBuilder from './pages/ResumeBuilder'
import Onboarding from './pages/Onboarding'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import MockInterview from './pages/MockInterview'
import LearningRoadmap from './pages/LearningRoadmap'
import ToolsHub from './pages/ToolsHub'
import MCQTest from './pages/MCQTest'
import Achievements from './pages/Achievements'
import NotFound from './pages/NotFound'
import Chatbot from './components/Chatbot'


function AppContent() {
  const location = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const hideNavbarFooter = ['/login', '/register', '/onboarding'].includes(location.pathname);
  
  // Footer only on public/landing pages, not on app pages
  const appRoutes = ['/dashboard', '/profile', '/career-dna', '/skill-gap', '/jobs', '/applications', '/resume-builder', '/mock-interview', '/roadmap', '/tools', '/mcq', '/achievements'];
  const isAppRoute = appRoutes.some(r => location.pathname.startsWith(r));
  const showFooter = !hideNavbarFooter && !isAppRoute;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-slate-900 dark:text-slate-100">
      <AnimatedBackground />
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/career-dna" element={<ProtectedRoute><CareerDNA /></ProtectedRoute>} />
        <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
        <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
        <Route path="/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><LearningRoadmap /></ProtectedRoute>} />
        <Route path="/tools" element={<ProtectedRoute><ToolsHub /></ProtectedRoute>} />
        <Route path="/mcq" element={<ProtectedRoute><MCQTest /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showFooter && <Footer />}
      {!hideNavbarFooter && <Chatbot />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
