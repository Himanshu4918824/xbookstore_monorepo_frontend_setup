import React from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// We add the 'export' keyword here so other files can import this component.
export const Particle = ({ isDarkMode }) => {
  const size = isDarkMode ? random(1, 3) : random(5, 10);
  const duration = isDarkMode ? random(10, 20) : random(15, 25);
  const delay = random(0, 10);
  const initialY = isDarkMode ? '-10%' : '110%';
  const exitY = isDarkMode ? '110%' : '-10%';
  const initialX = `${random(0, 100)}%`;

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: initialY,
        left: initialX,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.2)',
        backdropFilter: isDarkMode ? 'none' : 'blur(2px)',
      }}
      animate={{ y: [initialY, exitY] }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
      }}
    />
  );
};

// This is our main panel component
function FrostedGlassPanel({ children, sx }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const particles = Array.from({ length: isDarkMode ? 15 : 8 });

  return (
    <Box sx={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 2,
      p: { xs: 2, md: 4 },
      ...sx,
    }}>
      <Box sx={{
        position: 'absolute',
        inset: 0,
        backgroundColor: theme.palette.background.paper,
        backdropFilter: 'blur(10px)',
        zIndex: 0,
      }} />
      
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        {particles.map((_, index) => <Particle key={index} isDarkMode={isDarkMode} />)}
      </Box>
      
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {children}
      </Box>
    </Box>
  );
}

export default FrostedGlassPanel;