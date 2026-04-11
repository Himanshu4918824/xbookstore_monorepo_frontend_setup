import React, { useContext } from 'react';
import { IconButton } from '@mui/material';
import { WbSunny, Brightness2 } from '@mui/icons-material'; // Sun and Moon icons from MUI
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import { useState } from 'react';

// We need to install the icons package first!
// Open your terminal and run: npm install @mui/icons-material

function ThemeToggleButton() {
  const { toggleColorMode } = useContext(ThemeContext);
  
  // We need to know which theme is active to show the correct icon.
  // We will get this from the MUI theme itself.
  const [isDark, setIsDark] = useState(true);

  const handleToggle = () => {
    toggleColorMode();
    setIsDark(!isDark);
  }

  return (
    <IconButton onClick={handleToggle} color="inherit" sx={{ width: 40, height: 40 }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'moon' : 'sun'}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.4 }}
        >
          {isDark ? <Brightness2 /> : <WbSunny />}
        </motion.div>
      </AnimatePresence>
    </IconButton>
  );
}

export default ThemeToggleButton;