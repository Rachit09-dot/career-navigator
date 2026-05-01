import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();

  const bgGradient = theme === 'dark' 
    ? 'linear-gradient(135deg, #0b071a 0%, #170d36 40%, #0d0820 100%)'
    : 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 50%, #c4b5fd 100%)';

  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const orb1 = theme === 'dark' ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.1)';
  const orb2 = theme === 'dark' ? 'rgba(91,33,182,0.12)' : 'rgba(56,189,248,0.1)';
  const orb3 = theme === 'dark' ? 'rgba(99,102,241,0.08)' : 'rgba(167,139,250,0.1)';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, background: bgGradient, overflow: 'hidden', pointerEvents: 'none' }}>
      
      {/* Deep Space Glowing Orbs */}
      <motion.div animate={{ x: [-40, 40, -40], y: [-30, 30, -30], scale: [1, 1.2, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60vw', height: '60vw', background: `radial-gradient(circle, ${orb1}, transparent 60%)`, borderRadius: '50%', filter: 'blur(100px)' }} />
        
      <motion.div animate={{ x: [30, -30, 30], y: [20, -40, 20], scale: [1, 1.3, 1] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '70vw', height: '70vw', background: `radial-gradient(circle, ${orb2}, transparent 65%)`, borderRadius: '50%', filter: 'blur(120px)' }} />
        
      <motion.div animate={{ x: [-20, 20, -20], y: [10, -20, 10], scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ position: 'absolute', top: '30%', left: '40%', width: '40vw', height: '40vw', background: `radial-gradient(circle, ${orb3}, transparent 60%)`, borderRadius: '50%', filter: 'blur(80px)' }} />

      {/* Subtle grid pattern overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${gridColor} 1px, transparent 1px)`, backgroundSize: '32px 32px', opacity: 0.8 }} />      
      
      {/* Top ambient highlight */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent)' }} />
    </div>
  );
};

export default AnimatedBackground;
