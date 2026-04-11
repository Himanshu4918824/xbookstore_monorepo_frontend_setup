import React, { useState } from 'react';
import { Box, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// A simplified 3D mockup for the small preview
const MiniBookMockup = ({ imageUrl }) => {
  const spineThickness = 10; // A fixed small thickness for the preview

  return (
    <Box sx={{
      width: 80,
      height: 120,
      perspective: '1000px',
    }}>
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'rotateY(-25deg) rotateX(10deg)',
        }}
      >
        {/* Front Cover */}
        <Box sx={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', transform: `translateZ(${spineThickness / 2}px)` }} />
        {/* Spine */}
        <Box sx={{ position: 'absolute', width: `${spineThickness}px`, height: '100%', left: `-${spineThickness / 2}px`, transform: 'rotateY(90deg)', background: '#e0e0e0' }} />
        {/* Pages */}
        <Box sx={{ position: 'absolute', width: '100%', height: '100%', right: `-${spineThickness / 2}px`, transform: 'rotateY(0deg) translateZ(-${spineThickness / 2}px)', background: '#ffffff' }} />
      </motion.div>
    </Box>
  );
};

function HoverBookPreview({ label, book }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!book) return null;

  return (
    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: '160px' }}>
        {label}:
      </Typography>

      <MuiLink
        component={Link}
        to={`/books/${book.id}`}
        variant="body1"
        sx={{ fontWeight: 'medium', position: 'relative' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {book.title}
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '100%', // Position it below the link
                left: 0,
                zIndex: 10,
                paddingTop: '8px',
              }}
            >
              <Paper elevation={6} sx={{ backgroundColor: 'background.paper', p: 1, borderRadius: 2 }}>
                <MiniBookMockup imageUrl={book.imageUrl} />
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

      </MuiLink>
    </Box>
  );
}

// We need to import Paper and Typography for this to work
import { Paper, Typography } from '@mui/material';
export default HoverBookPreview;