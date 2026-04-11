import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AuthorCard from '../author/AuthorCard';

const CARD_WIDTH = 220;
const CARD_SPACING = 24;

function ParticipantsCarousel({ participants }) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);
  const [maxVisible, setMaxVisible] = useState(6);

  useEffect(() => {
    const calculateMaxVisible = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const howManyFit = Math.floor(containerWidth / (CARD_WIDTH + CARD_SPACING));
        setMaxVisible(Math.min(howManyFit, 6));
      }
    };
    calculateMaxVisible();
    window.addEventListener('resize', calculateMaxVisible);
    return () => window.removeEventListener('resize', calculateMaxVisible);
  }, []);
  
  if (!participants || participants.length === 0) return null;

  const role = participants[0].role;
  const heading = role === 'Author' ? 'Book is Authored by' : 'Book is Edited by';
  const isSlider = participants.length > maxVisible;
  const maxIndex = Math.max(0, participants.length - maxVisible);

  const handleNext = () => setIndex(prev => Math.min(prev + 1, maxIndex));
  const handlePrev = () => setIndex(prev => Math.max(prev - 1, 0));

  return (
    <Box sx={{ my: 6, position: 'relative' }}>
      {/* --- HEADING FIX --- */}
      {/* We apply a text shadow to make the heading pop against the gradient */}
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 2, 
          fontWeight: 'bold',
          textShadow: '0px 2px 4px rgba(0,0,0,0.5)' // The text shadow
        }}
      >
        {heading}
      </Typography>
      
      {/* --- HOVER FIX --- */}
      {/* We add padding to the container to give cards room to grow */}
      <Box 
        ref={containerRef} 
        sx={{ 
          overflow: 'hidden', 
          position: 'relative',
          // This padding gives 10px of space on the top and bottom for the hover effect
          py: '15px', 
          // Negative margin compensates for the padding so the layout doesn't shift
          my: '-10px',
          px: '10px'
        }}
      >
        <motion.div
          style={{
            display: 'flex',
            gap: `${CARD_SPACING}px`,
            width: '100%',
            justifyContent: isSlider ? 'flex-start' : 'center',
          }}
          animate={{ x: `-${index * (CARD_WIDTH + CARD_SPACING)}px` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {participants.map(p => (
            <Box key={p.author.id} sx={{ flex: `0 0 ${CARD_WIDTH}px` }}>
              <AuthorCard author={p.author} />
            </Box>
          ))}
        </motion.div>
      </Box>
      
      <AnimatePresence>
        {isSlider && (
          <>
            {index > 0 && (
              <IconButton onClick={handlePrev} sx={{ position: 'absolute', top: '55%', left: -16, backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'action.hover' }}}>
                <ArrowBackIosNewIcon />
              </IconButton>
            )}
            {index < maxIndex && (
               <IconButton onClick={handleNext} sx={{ position: 'absolute', top: '55%', right: -16, backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'action.hover' }}}>
                <ArrowForwardIosIcon />
              </IconButton>
            )}
          </>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default ParticipantsCarousel;