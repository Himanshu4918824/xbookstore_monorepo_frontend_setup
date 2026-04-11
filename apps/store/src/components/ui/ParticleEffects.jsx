import React from 'react';
import { Box, useTheme } from '@mui/material'; // Import useTheme
import './ParticleEffects.css';

function ParticleEffects() {
  const theme = useTheme(); // Get the current theme
  const isDarkMode = theme.palette.mode === 'dark';

  // We create two sets of particles for the two different effects
  const particles = Array.from({ length: isDarkMode ? 300 : 150 }); // 50 for snow, 25 for droplets

  // We apply a different class based on the theme
  const effectClass = isDarkMode ? 'snow' : 'droplets';

  return (
    <Box className={`particle-container ${effectClass}`}>
      {particles.map((_, index) => (
        <Box key={index} className="particle" />
      ))}
    </Box>
  );
}
export default ParticleEffects;