import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const heroBackgroundUrl = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2190';

export function HeroSlide() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <Box sx={{
      height: 'calc(100vh - 64px)',
      // width is now handled by the parent container
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',
    }}>
      {/* Background Image/Video */}
      <Box sx={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundImage: `url(${heroBackgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
        }
      }}/>

      {/* Animated Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold', textShadow: '0px 4px 8px rgba(0,0,0,0.8)' }}>
            Discover Your Next Chapter
          </Typography>
          <Typography variant="h5" sx={{ my: 3, textShadow: '0px 2px 4px rgba(0,0,0,0.7)' }}>
            The Home of Visionary Authors and Timeless Stories
          </Typography>
          <Button component={Link} to="/store" variant="contained" size="large">
            Explore The Store
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}